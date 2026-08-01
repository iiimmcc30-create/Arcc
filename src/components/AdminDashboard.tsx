import React, { useEffect, useState } from 'react';
import arcLogo from '@/imports/IMG_7058-1.jpeg';
import type { Lang } from '@/data/mockData';
import {
  api,
  getToken,
  setToken,
  type AdminUser,
  type Application,
  type DashboardStats,
  type NewsItem,
  type SiteSettings,
  type Tournament,
} from '@/lib/api';

type Section = 'dashboard' | 'players' | 'teams' | 'creators' | 'tournaments' | 'news' | 'site' | 'users';
type Status = 'pending' | 'approved' | 'rejected' | 'suspended';

const t = {
  ar: {
    title: 'لوحة التحكم', back: 'الموقع العام',
    dashboard: 'الرئيسية', players: 'اللاعبون', teams: 'الفرق',
    creators: 'صناع المحتوى', tournaments: 'البطولات', news: 'الأخبار', site: 'إدارة الموقع',
    users: 'المشرفون',
    totalPlayers: 'إجمالي اللاعبين', totalTeams: 'إجمالي الفرق', totalCreators: 'صناع المحتوى',
    newReqs: 'طلبات جديدة', pending: 'قيد المراجعة', approved: 'مقبولة', rejected: 'مرفوضة',
    recentActivity: 'النشاط الأخير',
    name: 'الاسم', game: 'اللعبة', status: 'الحالة', date: 'التاريخ', actions: 'الإجراءات',
    approve: 'قبول', reject: 'رفض', view: 'عرض', suspend: 'تعليق',
    captain: 'القائد', platform: 'المنصة', followers: 'المتابعون',
    role: 'المركز', country: 'الدولة',
    add: 'إضافة', save: 'حفظ', delete: 'حذف', loading: 'جاري التحميل...',
    loginTitle: 'دخول الإدارة', loginSub: 'سجّل الدخول لإدارة منظمة ARC',
    email: 'البريد الإلكتروني', password: 'كلمة المرور', login: 'تسجيل الدخول',
    logout: 'تسجيل الخروج', addSupervisor: 'إضافة مشرف',
    supervisorName: 'اسم المشرف', active: 'نشط', inactive: 'موقوف',
    deactivate: 'إيقاف', activate: 'تفعيل',
  },
  en: {
    title: 'Admin Dashboard', back: 'Public Site',
    dashboard: 'Dashboard', players: 'Players', teams: 'Teams',
    creators: 'Content Creators', tournaments: 'Tournaments', news: 'News', site: 'Site Management',
    users: 'Supervisors',
    totalPlayers: 'Total Players', totalTeams: 'Total Teams', totalCreators: 'Content Creators',
    newReqs: 'New Requests', pending: 'Pending', approved: 'Approved', rejected: 'Rejected',
    recentActivity: 'Recent Activity',
    name: 'Name', game: 'Game', status: 'Status', date: 'Date', actions: 'Actions',
    approve: 'Approve', reject: 'Reject', view: 'View', suspend: 'Suspend',
    captain: 'Captain', platform: 'Platform', followers: 'Followers',
    role: 'Role', country: 'Country',
    add: 'Add', save: 'Save', delete: 'Delete', loading: 'Loading...',
    loginTitle: 'Admin Login', loginSub: 'Sign in to manage ARC Esports',
    email: 'Email', password: 'Password', login: 'Sign In',
    logout: 'Logout', addSupervisor: 'Add Supervisor',
    supervisorName: 'Supervisor name', active: 'Active', inactive: 'Inactive',
    deactivate: 'Deactivate', activate: 'Activate',
  },
};

interface Props { lang: Lang; onBack: () => void; }

export default function AdminDashboard({ lang, onBack }: Props) {
  const isRtl = lang === 'ar';
  const tr = t[lang];
  const [section, setSection] = useState<Section>('dashboard');
  const [user, setUser] = useState<AdminUser | null>(null);
  const [authChecking, setAuthChecking] = useState(true);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [apps, setApps] = useState<Application[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [site, setSite] = useState<SiteSettings | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [selected, setSelected] = useState<Application | null>(null);
  const [loading, setLoading] = useState(false);

  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'supervisor' });

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setAuthChecking(false);
      return;
    }
    api.me()
      .then((u) => setUser(u))
      .catch(() => setToken(null))
      .finally(() => setAuthChecking(false));
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const [dashboard, applications, tournamentsData, newsData, siteData, usersData] = await Promise.all([
        api.dashboard(),
        api.applications(),
        api.tournaments(),
        api.news(),
        api.site(),
        api.users(),
      ]);
      setStats(dashboard);
      setApps(applications);
      setTournaments(tournamentsData);
      setNews(newsData);
      setSite(siteData);
      setUsers(usersData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) load();
  }, [user]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    setLoginError(null);
    try {
      const result = await api.login(loginEmail.trim(), loginPassword);
      setToken(result.accessToken);
      setUser(result.user);
    } catch {
      setLoginError(isRtl ? 'بيانات الدخول غير صحيحة' : 'Invalid credentials');
    } finally {
      setLoggingIn(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setStats(null);
  };

  const updateStatus = async (id: number, status: Status) => {
    await api.updateApplicationStatus(id, status);
    await load();
  };

  if (authChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#080C12] text-white/50 font-mono">
        {tr.loading}
      </div>
    );
  }

  if (!user) {
    return (
      <div dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen flex items-center justify-center bg-[#080C12] px-4 relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="absolute top-1/4 left-1/3 w-72 h-72 rounded-full bg-[#0B3C6D]/30 blur-[120px]" />
        <form onSubmit={handleLogin} className="relative glass-dark border border-[#0B3C6D]/50 p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <img src={arcLogo} alt="ARC" className="w-16 h-16 mx-auto mb-4 object-contain rounded-full border border-[#F7941D]/40" />
            <h1 className="font-display font-900 text-3xl text-white uppercase">{tr.loginTitle}</h1>
            <p className="font-body text-white/40 text-sm mt-2">{tr.loginSub}</p>
          </div>
          <div className="space-y-4">
            <div>
              <label className="font-mono text-xs text-white/40 uppercase mb-1.5 block">{tr.email}</label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="arc-input"
                placeholder="madunitesp@gmail.com"
              />
            </div>
            <div>
              <label className="font-mono text-xs text-white/40 uppercase mb-1.5 block">{tr.password}</label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="arc-input"
              />
            </div>
            {loginError && (
              <div className="font-mono text-sm text-red-400 border border-red-400/30 bg-red-400/10 p-3">
                {loginError}
              </div>
            )}
            <button type="submit" disabled={loggingIn} className="btn-arc w-full py-3">
              {loggingIn ? '...' : tr.login}
            </button>
            <button type="button" onClick={onBack} className="w-full font-mono text-xs text-white/30 hover:text-white mt-2">
              {tr.back}
            </button>
          </div>
        </form>
      </div>
    );
  }

  const playerApps = apps.filter((a) => a.type === 'player');
  const teamApps = apps.filter((a) => a.type === 'team');
  const creatorApps = apps.filter((a) => a.type === 'creator');

  const statusBadge = (status: Status) => {
    const map = {
      pending: 'badge-pending',
      approved: 'badge-active',
      rejected: 'badge-rejected',
      suspended: 'badge-pending',
    };
    const label = {
      pending: isRtl ? 'قيد المراجعة' : 'Pending',
      approved: isRtl ? 'مقبول' : 'Approved',
      rejected: isRtl ? 'مرفوض' : 'Rejected',
      suspended: isRtl ? 'معلّق' : 'Suspended',
    };
    return (
      <span className={`font-mono text-xs px-2 py-0.5 ${map[status]}`}>
        {label[status]}
      </span>
    );
  };

  const navItems: { id: Section; label: string; icon: string; adminOnly?: boolean }[] = [
    { id: 'dashboard', label: tr.dashboard, icon: '📊' },
    { id: 'players', label: tr.players, icon: '🎮' },
    { id: 'teams', label: tr.teams, icon: '🛡️' },
    { id: 'creators', label: tr.creators, icon: '📹' },
    { id: 'tournaments', label: tr.tournaments, icon: '🏆' },
    { id: 'news', label: tr.news, icon: '📰' },
    { id: 'site', label: tr.site, icon: '⚙️' },
    { id: 'users', label: tr.users, icon: '👥', adminOnly: true },
  ].filter((item) => !item.adminOnly || user.role === 'admin');

  const tableRows = (items: Application[]) =>
    items.map((item) => ({
      id: item.id,
      name: item.name,
      game: item.game || '—',
      role: item.role || '—',
      country: item.country || '—',
      captain: item.captain || '—',
      players: item.playerCount ?? '—',
      platform: item.platform || '—',
      followers: item.followers || '—',
      date: item.createdAt?.slice(0, 10) || '—',
      status: item.status as Status,
      raw: item,
    }));

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen flex bg-[#080C12]">
      <div className="w-60 flex-shrink-0 glass-dark border-e border-[#0B3C6D]/40 flex flex-col">
        <div className="p-5 border-b border-[#0B3C6D]/30 flex items-center gap-3">
          <img src={arcLogo} alt="ARC" className="w-10 h-10 object-contain rounded-full" />
          <div>
            <div className="font-display font-900 text-white text-base tracking-wider">ARC</div>
            <div className="font-mono text-[10px] text-[#F7941D] uppercase tracking-widest">{tr.title}</div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setSection(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-body transition-all rounded-sm ${
                section === item.id
                  ? 'bg-[#F7941D]/15 text-[#F7941D] border-s-2 border-[#F7941D]'
                  : 'text-white/40 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-[#0B3C6D]/30 space-y-1">
          <div className="px-4 py-2 font-mono text-[10px] text-white/30 truncate">{user.email}</div>
          <button onClick={logout} className="w-full px-4 py-2 text-sm text-red-400/70 hover:text-red-400 text-start">
            {tr.logout}
          </button>
          <button onClick={onBack} className="w-full px-4 py-2.5 text-sm text-white/30 hover:text-white text-start">
            {tr.back}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="glass-dark border-b border-[#0B3C6D]/30 px-8 py-4 flex items-center justify-between">
          <h1 className="font-display font-800 text-xl text-white uppercase">{navItems.find((n) => n.id === section)?.label}</h1>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="font-mono text-xs text-white/40">
              {loading ? tr.loading : `${user.name} · ${user.role}`}
            </span>
          </div>
        </div>

        <div className="p-8">
          {section === 'dashboard' && stats && (
            <div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  { label: tr.totalPlayers, value: stats.players, icon: '🎮', color: 'text-[#4A90D9]' },
                  { label: tr.totalTeams, value: stats.teams, icon: '🛡️', color: 'text-[#F7941D]' },
                  { label: tr.totalCreators, value: stats.creators, icon: '📹', color: 'text-purple-400' },
                  { label: tr.newReqs, value: stats.applications.pending, icon: '🔔', color: 'text-yellow-400' },
                ].map((stat, i) => (
                  <div key={i} className="glass border border-[#0B3C6D]/40 p-5 arc-card">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{stat.icon}</span>
                      <div className={`font-display font-900 text-3xl ${stat.color}`}>{stat.value}</div>
                    </div>
                    <div className="font-mono text-xs text-white/40 uppercase tracking-wider">{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className="glass border border-[#0B3C6D]/40 overflow-hidden">
                <div className="px-5 py-4 border-b border-[#0B3C6D]/30">
                  <h3 className="font-display font-800 text-base text-white uppercase">{tr.recentActivity}</h3>
                </div>
                <div className="divide-y divide-[#0B3C6D]/20">
                  {stats.recent.map((item) => (
                    <div key={item.id} className="px-5 py-3 flex items-center justify-between">
                      <div>
                        <div className="font-body text-sm text-white">{item.name}</div>
                        <div className="font-mono text-xs text-white/30">{item.type} · {item.game || item.platform || '—'}</div>
                      </div>
                      {statusBadge(item.status as Status)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {section === 'players' && (
            <ApplicationTable
              data={tableRows(playerApps)}
              columns={[
                { key: 'name', label: tr.name },
                { key: 'game', label: tr.game },
                { key: 'role', label: tr.role },
                { key: 'country', label: tr.country },
                { key: 'date', label: tr.date },
              ]}
              onApprove={(id) => updateStatus(id, 'approved')}
              onReject={(id) => updateStatus(id, 'rejected')}
              onView={(row) => setSelected(row.raw)}
              tr={tr}
              statusBadge={statusBadge}
            />
          )}

          {section === 'teams' && (
            <ApplicationTable
              data={tableRows(teamApps)}
              columns={[
                { key: 'name', label: tr.name },
                { key: 'game', label: tr.game },
                { key: 'captain', label: tr.captain },
                { key: 'players', label: isRtl ? 'عدد اللاعبين' : 'Players' },
                { key: 'date', label: tr.date },
              ]}
              onApprove={(id) => updateStatus(id, 'approved')}
              onReject={(id) => updateStatus(id, 'rejected')}
              onView={(row) => setSelected(row.raw)}
              tr={tr}
              statusBadge={statusBadge}
            />
          )}

          {section === 'creators' && (
            <ApplicationTable
              data={tableRows(creatorApps)}
              columns={[
                { key: 'name', label: tr.name },
                { key: 'platform', label: tr.platform },
                { key: 'followers', label: tr.followers },
                { key: 'date', label: tr.date },
              ]}
              onApprove={(id) => updateStatus(id, 'approved')}
              onReject={(id) => updateStatus(id, 'rejected')}
              onView={(row) => setSelected(row.raw)}
              tr={tr}
              statusBadge={statusBadge}
            />
          )}

          {section === 'tournaments' && (
            <div className="space-y-4">
              <button
                className="btn-arc text-sm"
                onClick={async () => {
                  await api.createTournament({
                    name: 'New ARC Cup',
                    nameAr: 'كأس ARC الجديد',
                    status: 'upcoming',
                    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=350&fit=crop&auto=format',
                    game: 'PUBG MOBILE',
                    startDate: '2026-10-01',
                    endDate: '2026-10-10',
                    prize: '$1,000',
                    teams: 16,
                  });
                  await load();
                }}
              >
                {tr.add}
              </button>
              <div className="glass border border-[#0B3C6D]/40 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#0B3C6D]/30 bg-[#0B3C6D]/10">
                      {[tr.name, tr.game, tr.status, tr.actions].map((label) => (
                        <th key={label} className="px-4 py-3 font-mono text-xs text-white/40 uppercase tracking-wider text-start">{label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#0B3C6D]/20">
                    {tournaments.map((item) => (
                      <tr key={item.id}>
                        <td className="px-4 py-3 text-sm text-white/70">{lang === 'ar' ? item.nameAr : item.name}</td>
                        <td className="px-4 py-3 text-sm text-white/70">{item.game}</td>
                        <td className="px-4 py-3 text-sm text-white/70">{item.status}</td>
                        <td className="px-4 py-3">
                          <button className="font-mono text-xs text-red-400 border border-red-400/30 px-2.5 py-1" onClick={async () => { await api.deleteTournament(item.id); await load(); }}>
                            {tr.delete}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {section === 'news' && (
            <div className="space-y-4">
              <button
                className="btn-arc text-sm"
                onClick={async () => {
                  await api.createNews({
                    title: 'خبر جديد من ARC',
                    titleEn: 'New ARC Announcement',
                    summary: 'تحديث جديد من إدارة ARC Esports',
                    summaryEn: 'A new update from ARC Esports management',
                    date: new Date().toISOString().slice(0, 10),
                    category: 'تحديثات',
                    categoryEn: 'Updates',
                    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=500&h=300&fit=crop&auto=format',
                  });
                  await load();
                }}
              >
                {tr.add}
              </button>
              <div className="glass border border-[#0B3C6D]/40 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#0B3C6D]/30 bg-[#0B3C6D]/10">
                      {[tr.name, tr.date, tr.actions].map((label) => (
                        <th key={label} className="px-4 py-3 font-mono text-xs text-white/40 uppercase tracking-wider text-start">{label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#0B3C6D]/20">
                    {news.map((item) => (
                      <tr key={item.id}>
                        <td className="px-4 py-3 text-sm text-white/70">{lang === 'ar' ? item.title : item.titleEn}</td>
                        <td className="px-4 py-3 text-sm text-white/70">{item.date}</td>
                        <td className="px-4 py-3">
                          <button className="font-mono text-xs text-red-400 border border-red-400/30 px-2.5 py-1" onClick={async () => { await api.deleteNews(item.id); await load(); }}>
                            {tr.delete}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {section === 'site' && site && (
            <div className="glass border border-[#0B3C6D]/40 p-6 space-y-4 max-w-2xl">
              <div>
                <label className="font-mono text-xs text-white/40 uppercase mb-1.5 block">Brand</label>
                <input className="arc-input" value={site.brandName} onChange={(e) => setSite({ ...site, brandName: e.target.value })} />
              </div>
              <div>
                <label className="font-mono text-xs text-white/40 uppercase mb-1.5 block">Tagline AR</label>
                <input className="arc-input" value={site.taglineAr} onChange={(e) => setSite({ ...site, taglineAr: e.target.value })} />
              </div>
              <div>
                <label className="font-mono text-xs text-white/40 uppercase mb-1.5 block">Email</label>
                <input className="arc-input" value={site.contactEmail || ''} onChange={(e) => setSite({ ...site, contactEmail: e.target.value })} />
              </div>
              <button className="btn-arc text-sm" onClick={async () => setSite(await api.updateSite(site))}>{tr.save}</button>
            </div>
          )}

          {section === 'users' && user.role === 'admin' && (
            <div className="space-y-6">
              <div className="glass border border-[#0B3C6D]/40 p-6 max-w-2xl space-y-4">
                <h3 className="font-display font-800 text-lg text-white uppercase">{tr.addSupervisor}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input className="arc-input" placeholder={tr.supervisorName} value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} />
                  <input className="arc-input" type="email" placeholder={tr.email} value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
                  <input className="arc-input" type="password" placeholder={tr.password} value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} />
                  <select className="arc-select" value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}>
                    <option value="supervisor">Supervisor</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <button
                  className="btn-arc text-sm"
                  onClick={async () => {
                    if (!newUser.name || !newUser.email || !newUser.password) return;
                    await api.createUser(newUser);
                    setNewUser({ name: '', email: '', password: '', role: 'supervisor' });
                    await load();
                  }}
                >
                  {tr.add}
                </button>
              </div>

              <div className="glass border border-[#0B3C6D]/40 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#0B3C6D]/30 bg-[#0B3C6D]/10">
                      {[tr.name, tr.email, tr.role, tr.status, tr.actions].map((label) => (
                        <th key={label} className="px-4 py-3 font-mono text-xs text-white/40 uppercase tracking-wider text-start">{label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#0B3C6D]/20">
                    {users.map((u) => (
                      <tr key={u.id}>
                        <td className="px-4 py-3 text-sm text-white/70">{u.name}</td>
                        <td className="px-4 py-3 text-sm text-white/70">{u.email}</td>
                        <td className="px-4 py-3 text-sm text-white/70">{u.role}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className={u.active ? 'badge-active' : 'badge-rejected'}>
                            {u.active ? tr.active : tr.inactive}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {u.role !== 'admin' && (
                            <button
                              className="font-mono text-xs text-[#F7941D] border border-[#F7941D]/30 px-2.5 py-1"
                              onClick={async () => {
                                await api.setUserActive(u.id, !u.active);
                                await load();
                              }}
                            >
                              {u.active ? tr.deactivate : tr.activate}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="glass-dark border border-[#0B3C6D]/50 max-w-lg w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-display font-900 text-2xl text-white uppercase mb-4">{selected.name}</h3>
            <div className="space-y-2 text-sm text-white/70">
              <div>Type: {selected.type}</div>
              <div>Status: {selected.status}</div>
              <div>Email: {selected.email || '—'}</div>
              <div>Discord: {selected.discord || '—'}</div>
              <div>Game: {selected.game || '—'}</div>
            </div>
            <div className="flex gap-2 mt-6">
              <button className="btn-arc text-sm" onClick={() => updateStatus(selected.id, 'approved').then(() => setSelected(null))}>{tr.approve}</button>
              <button className="btn-arc-outline text-sm" onClick={() => updateStatus(selected.id, 'rejected').then(() => setSelected(null))}>{tr.reject}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ApplicationTable({
  data, columns, onApprove, onReject, onView, tr, statusBadge,
}: {
  data: Array<Record<string, unknown> & { id: number; status: Status; raw: Application }>;
  columns: { key: string; label: string }[];
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
  onView: (row: { raw: Application }) => void;
  tr: typeof t['en'];
  statusBadge: (s: Status) => React.ReactElement;
}) {
  return (
    <div className="glass border border-[#0B3C6D]/40 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#0B3C6D]/30 bg-[#0B3C6D]/10">
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-3 font-mono text-xs text-white/40 uppercase tracking-wider text-start">{col.label}</th>
              ))}
              <th className="px-4 py-3 font-mono text-xs text-white/40 uppercase tracking-wider text-start">{tr.status}</th>
              <th className="px-4 py-3 font-mono text-xs text-white/40 uppercase tracking-wider text-start">{tr.actions}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#0B3C6D]/20">
            {data.map((row) => (
              <tr key={row.id} className="hover:bg-[#0B3C6D]/10 transition-colors">
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 font-body text-sm text-white/70">{String(row[col.key] ?? '')}</td>
                ))}
                <td className="px-4 py-3">{statusBadge(row.status)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {row.status !== 'approved' && (
                      <button onClick={() => onApprove(row.id)} className="font-mono text-xs text-green-400 border border-green-400/30 px-2.5 py-1">{tr.approve}</button>
                    )}
                    {row.status !== 'rejected' && (
                      <button onClick={() => onReject(row.id)} className="font-mono text-xs text-red-400 border border-red-400/30 px-2.5 py-1">{tr.reject}</button>
                    )}
                    <button onClick={() => onView(row)} className="font-mono text-xs text-white/30 border border-white/10 px-2.5 py-1">{tr.view}</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
