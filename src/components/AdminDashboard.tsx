import React, { useEffect, useState } from 'react';
import arcLogo from '@/imports/IMG_7058-1.jpeg';
import type { Lang } from '@/data/mockData';
import { api, type Application, type DashboardStats, type NewsItem, type SiteSettings, type Tournament } from '@/lib/api';

type Section = 'dashboard' | 'players' | 'teams' | 'creators' | 'tournaments' | 'news' | 'site';
type Status = 'pending' | 'approved' | 'rejected' | 'suspended';

const t = {
  ar: {
    title: 'لوحة التحكم', back: 'الموقع العام',
    dashboard: 'الرئيسية', players: 'اللاعبون', teams: 'الفرق',
    creators: 'صناع المحتوى', tournaments: 'البطولات', news: 'الأخبار', site: 'إدارة الموقع',
    totalPlayers: 'إجمالي اللاعبين', totalTeams: 'إجمالي الفرق', totalCreators: 'صناع المحتوى',
    newReqs: 'طلبات جديدة', pending: 'قيد المراجعة', approved: 'مقبولة', rejected: 'مرفوضة',
    recentActivity: 'النشاط الأخير',
    name: 'الاسم', game: 'اللعبة', status: 'الحالة', date: 'التاريخ', actions: 'الإجراءات',
    approve: 'قبول', reject: 'رفض', view: 'عرض', suspend: 'تعليق',
    captain: 'القائد', platform: 'المنصة', followers: 'المتابعون',
    role: 'المركز', country: 'الدولة',
    add: 'إضافة', save: 'حفظ', delete: 'حذف', loading: 'جاري التحميل...',
  },
  en: {
    title: 'Admin Dashboard', back: 'Public Site',
    dashboard: 'Dashboard', players: 'Players', teams: 'Teams',
    creators: 'Content Creators', tournaments: 'Tournaments', news: 'News', site: 'Site Management',
    totalPlayers: 'Total Players', totalTeams: 'Total Teams', totalCreators: 'Content Creators',
    newReqs: 'New Requests', pending: 'Pending', approved: 'Approved', rejected: 'Rejected',
    recentActivity: 'Recent Activity',
    name: 'Name', game: 'Game', status: 'Status', date: 'Date', actions: 'Actions',
    approve: 'Approve', reject: 'Reject', view: 'View', suspend: 'Suspend',
    captain: 'Captain', platform: 'Platform', followers: 'Followers',
    role: 'Role', country: 'Country',
    add: 'Add', save: 'Save', delete: 'Delete', loading: 'Loading...',
  },
};

interface Props { lang: Lang; onBack: () => void; }

export default function AdminDashboard({ lang, onBack }: Props) {
  const isRtl = lang === 'ar';
  const tr = t[lang];
  const [section, setSection] = useState<Section>('dashboard');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [apps, setApps] = useState<Application[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [site, setSite] = useState<SiteSettings | null>(null);
  const [selected, setSelected] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [dashboard, applications, tournamentsData, newsData, siteData] = await Promise.all([
        api.dashboard(),
        api.applications(),
        api.tournaments(),
        api.news(),
        api.site(),
      ]);
      setStats(dashboard);
      setApps(applications);
      setTournaments(tournamentsData);
      setNews(newsData);
      setSite(siteData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id: number, status: Status) => {
    await api.updateApplicationStatus(id, status);
    await load();
  };

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

  const navItems: { id: Section; label: string; icon: string }[] = [
    { id: 'dashboard', label: tr.dashboard, icon: '📊' },
    { id: 'players', label: tr.players, icon: '🎮' },
    { id: 'teams', label: tr.teams, icon: '🛡️' },
    { id: 'creators', label: tr.creators, icon: '📹' },
    { id: 'tournaments', label: tr.tournaments, icon: '🏆' },
    { id: 'news', label: tr.news, icon: '📰' },
    { id: 'site', label: tr.site, icon: '⚙️' },
  ];

  const tableRows = (items: Application[], kind: 'player' | 'team' | 'creator') =>
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
      kind,
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

        <div className="p-3 border-t border-[#0B3C6D]/30">
          <button
            onClick={onBack}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-white/30 hover:text-white transition-colors"
          >
            <svg className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
            </svg>
            {tr.back}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="glass-dark border-b border-[#0B3C6D]/30 px-8 py-4 flex items-center justify-between">
          <h1 className="font-display font-800 text-xl text-white uppercase">{navItems.find((n) => n.id === section)?.label}</h1>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="font-mono text-xs text-white/40">{loading ? tr.loading : isRtl ? 'متصل بقاعدة البيانات' : 'Connected to DB'}</span>
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {[
                  { label: tr.pending, value: stats.applications.pending, bar: 'bg-[#F7941D]' },
                  { label: tr.approved, value: stats.applications.approved, bar: 'bg-green-400' },
                  { label: tr.rejected, value: stats.applications.rejected, bar: 'bg-red-400' },
                ].map((item, i) => (
                  <div key={i} className="glass border border-[#0B3C6D]/40 p-5">
                    <div className="font-mono text-xs text-white/40 uppercase tracking-wider mb-1">{item.label}</div>
                    <div className="font-display font-900 text-4xl text-white mb-3">{item.value}</div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${item.bar}`}
                        style={{
                          width: `${(item.value / Math.max(1, stats.applications.total)) * 100}%`,
                        }}
                      />
                    </div>
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
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#0B3C6D]/40 rounded-sm flex items-center justify-center font-display font-800 text-sm text-[#F7941D]">
                          {item.name[0]}
                        </div>
                        <div>
                          <div className="font-body text-sm text-white">{item.name}</div>
                          <div className="font-mono text-xs text-white/30">
                            {item.type} · {item.game || item.platform || '—'}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {statusBadge(item.status as Status)}
                        <span className="font-mono text-xs text-white/20">{item.createdAt?.slice(0, 10)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {section === 'players' && (
            <ApplicationTable
              data={tableRows(playerApps, 'player')}
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
              data={tableRows(teamApps, 'team')}
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
              data={tableRows(creatorApps, 'creator')}
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
                      {[tr.name, tr.game, tr.status, tr.date, tr.actions].map((label) => (
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
                        <td className="px-4 py-3 text-sm text-white/70">{item.startDate}</td>
                        <td className="px-4 py-3">
                          <button
                            className="font-mono text-xs text-red-400 border border-red-400/30 px-2.5 py-1"
                            onClick={async () => {
                              await api.deleteTournament(item.id);
                              await load();
                            }}
                          >
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
                          <button
                            className="font-mono text-xs text-red-400 border border-red-400/30 px-2.5 py-1"
                            onClick={async () => {
                              await api.deleteNews(item.id);
                              await load();
                            }}
                          >
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
                <input
                  className="arc-input"
                  value={site.brandName}
                  onChange={(e) => setSite({ ...site, brandName: e.target.value })}
                />
              </div>
              <div>
                <label className="font-mono text-xs text-white/40 uppercase mb-1.5 block">Tagline AR</label>
                <input
                  className="arc-input"
                  value={site.taglineAr}
                  onChange={(e) => setSite({ ...site, taglineAr: e.target.value })}
                />
              </div>
              <div>
                <label className="font-mono text-xs text-white/40 uppercase mb-1.5 block">Tagline EN</label>
                <input
                  className="arc-input"
                  value={site.taglineEn}
                  onChange={(e) => setSite({ ...site, taglineEn: e.target.value })}
                />
              </div>
              <div>
                <label className="font-mono text-xs text-white/40 uppercase mb-1.5 block">Email</label>
                <input
                  className="arc-input"
                  value={site.contactEmail || ''}
                  onChange={(e) => setSite({ ...site, contactEmail: e.target.value })}
                />
              </div>
              <button
                className="btn-arc text-sm"
                onClick={async () => {
                  const updated = await api.updateSite(site);
                  setSite(updated);
                }}
              >
                {tr.save}
              </button>
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
              <div>Role: {selected.role || '—'}</div>
              <div>Country: {selected.country || '—'}</div>
              <div>Achievements: {selected.achievements || '—'}</div>
              <div>Message: {selected.message || '—'}</div>
            </div>
            <div className="flex gap-2 mt-6">
              <button className="btn-arc text-sm" onClick={() => updateStatus(selected.id, 'approved').then(() => setSelected(null))}>{tr.approve}</button>
              <button className="btn-arc-outline text-sm" onClick={() => updateStatus(selected.id, 'rejected').then(() => setSelected(null))}>{tr.reject}</button>
              <button className="font-mono text-xs text-white/40 px-3" onClick={() => setSelected(null)}>Close</button>
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
                <th key={col.key} className="px-4 py-3 font-mono text-xs text-white/40 uppercase tracking-wider text-start">
                  {col.label}
                </th>
              ))}
              <th className="px-4 py-3 font-mono text-xs text-white/40 uppercase tracking-wider text-start">{tr.status}</th>
              <th className="px-4 py-3 font-mono text-xs text-white/40 uppercase tracking-wider text-start">{tr.actions}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#0B3C6D]/20">
            {data.map((row) => (
              <tr key={row.id} className="hover:bg-[#0B3C6D]/10 transition-colors">
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 font-body text-sm text-white/70">
                    {String(row[col.key] ?? '')}
                  </td>
                ))}
                <td className="px-4 py-3">{statusBadge(row.status)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {row.status !== 'approved' && (
                      <button
                        onClick={() => onApprove(row.id)}
                        className="font-mono text-xs text-green-400 hover:text-green-300 border border-green-400/30 hover:border-green-400 px-2.5 py-1 transition-all"
                      >
                        {tr.approve}
                      </button>
                    )}
                    {row.status !== 'rejected' && (
                      <button
                        onClick={() => onReject(row.id)}
                        className="font-mono text-xs text-red-400 hover:text-red-300 border border-red-400/30 hover:border-red-400 px-2.5 py-1 transition-all"
                      >
                        {tr.reject}
                      </button>
                    )}
                    <button
                      onClick={() => onView(row)}
                      className="font-mono text-xs text-white/30 hover:text-white/60 border border-white/10 hover:border-white/30 px-2.5 py-1 transition-all"
                    >
                      {tr.view}
                    </button>
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
