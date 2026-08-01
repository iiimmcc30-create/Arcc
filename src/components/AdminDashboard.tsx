import React, { useState } from 'react';
import { adminApplications } from '@/data/mockData';
import arcLogo from '@/imports/IMG_7058-1.jpeg';
import type { Lang } from '@/data/mockData';

type Section = 'dashboard' | 'players' | 'teams' | 'creators' | 'tournaments' | 'news' | 'site';
type Status = 'pending' | 'approved' | 'rejected';

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
  },
};

interface Props { lang: Lang; onBack: () => void; }

export default function AdminDashboard({ lang, onBack }: Props) {
  const isRtl = lang === 'ar';
  const tr = t[lang];
  const [section, setSection] = useState<Section>('dashboard');
  const [statuses, setStatuses] = useState<Record<string, Record<number, Status>>>({
    players: Object.fromEntries(adminApplications.players.map(p => [p.id, p.status as Status])),
    teams: Object.fromEntries(adminApplications.teams.map(t2 => [t2.id, t2.status as Status])),
    creators: Object.fromEntries(adminApplications.creators.map(c => [c.id, c.status as Status])),
  });

  const updateStatus = (type: string, id: number, newStatus: Status) => {
    setStatuses(prev => ({ ...prev, [type]: { ...prev[type], [id]: newStatus } }));
  };

  const pendingCount = Object.values(statuses).flatMap(Object.values).filter(s => s === 'pending').length;
  const approvedCount = Object.values(statuses).flatMap(Object.values).filter(s => s === 'approved').length;
  const rejectedCount = Object.values(statuses).flatMap(Object.values).filter(s => s === 'rejected').length;

  const statusBadge = (status: Status) => {
    const map = {
      pending: 'badge-pending',
      approved: 'badge-active',
      rejected: 'badge-rejected',
    };
    const label = {
      pending: isRtl ? 'قيد المراجعة' : 'Pending',
      approved: isRtl ? 'مقبول' : 'Approved',
      rejected: isRtl ? 'مرفوض' : 'Rejected',
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

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen flex bg-[#080C12]">
      {/* Sidebar */}
      <div className="w-60 flex-shrink-0 glass-dark border-e border-[#0B3C6D]/40 flex flex-col">
        {/* Logo */}
        <div className="p-5 border-b border-[#0B3C6D]/30 flex items-center gap-3">
          <img src={arcLogo} alt="ARC" className="w-10 h-10 object-contain rounded-full" />
          <div>
            <div className="font-display font-900 text-white text-base tracking-wider">ARC</div>
            <div className="font-mono text-[10px] text-[#F7941D] uppercase tracking-widest">{tr.title}</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map(item => (
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

        {/* Back to site */}
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

      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <div className="glass-dark border-b border-[#0B3C6D]/30 px-8 py-4 flex items-center justify-between">
          <h1 className="font-display font-800 text-xl text-white uppercase">{navItems.find(n => n.id === section)?.label}</h1>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="font-mono text-xs text-white/40">{isRtl ? 'متصل' : 'Online'}</span>
          </div>
        </div>

        <div className="p-8">
          {/* Dashboard overview */}
          {section === 'dashboard' && (
            <div>
              {/* Stats cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  { label: tr.totalPlayers, value: adminApplications.players.length + 26, icon: '🎮', color: 'text-[#4A90D9]' },
                  { label: tr.totalTeams, value: adminApplications.teams.length + 4, icon: '🛡️', color: 'text-[#F7941D]' },
                  { label: tr.totalCreators, value: adminApplications.creators.length + 3, icon: '📹', color: 'text-purple-400' },
                  { label: tr.newReqs, value: pendingCount, icon: '🔔', color: 'text-yellow-400' },
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

              {/* Request status */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {[
                  { label: tr.pending, value: pendingCount, class: 'badge-pending', bar: 'bg-[#F7941D]' },
                  { label: tr.approved, value: approvedCount, class: 'badge-active', bar: 'bg-green-400' },
                  { label: tr.rejected, value: rejectedCount, class: 'badge-rejected', bar: 'bg-red-400' },
                ].map((item, i) => (
                  <div key={i} className="glass border border-[#0B3C6D]/40 p-5">
                    <div className="font-mono text-xs text-white/40 uppercase tracking-wider mb-1">{item.label}</div>
                    <div className="font-display font-900 text-4xl text-white mb-3">{item.value}</div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${item.bar}`} style={{ width: `${(item.value / Math.max(1, pendingCount + approvedCount + rejectedCount)) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent activity */}
              <div className="glass border border-[#0B3C6D]/40 overflow-hidden">
                <div className="px-5 py-4 border-b border-[#0B3C6D]/30">
                  <h3 className="font-display font-800 text-base text-white uppercase">{tr.recentActivity}</h3>
                </div>
                <div className="divide-y divide-[#0B3C6D]/20">
                  {[
                    ...adminApplications.players.slice(0, 2).map(p => ({ ...p, type: isRtl ? 'لاعب' : 'Player' })),
                    ...adminApplications.creators.slice(0, 2).map(c => ({ ...c, type: isRtl ? 'صانع محتوى' : 'Creator' })),
                  ].map((item, i) => (
                    <div key={i} className="px-5 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#0B3C6D]/40 rounded-sm flex items-center justify-center font-display font-800 text-sm text-[#F7941D]">
                          {item.name[0]}
                        </div>
                        <div>
                          <div className="font-body text-sm text-white">{item.name}</div>
                          <div className="font-mono text-xs text-white/30">{(item as typeof adminApplications.players[0]).game || (item as typeof adminApplications.creators[0]).platform} · {(item as any).type}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {statusBadge(statuses[(item as any).type === (isRtl ? 'لاعب' : 'Player') ? 'players' : 'creators'][item.id])}
                        <span className="font-mono text-xs text-white/20">{item.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Players management */}
          {section === 'players' && (
            <ApplicationTable
              data={adminApplications.players}
              columns={[
                { key: 'name', label: tr.name },
                { key: 'game', label: tr.game },
                { key: 'role', label: tr.role },
                { key: 'country', label: tr.country },
                { key: 'date', label: tr.date },
              ]}
              statuses={statuses.players}
              onApprove={(id) => updateStatus('players', id, 'approved')}
              onReject={(id) => updateStatus('players', id, 'rejected')}
              tr={tr}
              statusBadge={statusBadge}
            />
          )}

          {/* Teams management */}
          {section === 'teams' && (
            <ApplicationTable
              data={adminApplications.teams}
              columns={[
                { key: 'name', label: tr.name },
                { key: 'game', label: tr.game },
                { key: 'captain', label: tr.captain },
                { key: 'players', label: isRtl ? 'عدد اللاعبين' : 'Players' },
                { key: 'date', label: tr.date },
              ]}
              statuses={statuses.teams}
              onApprove={(id) => updateStatus('teams', id, 'approved')}
              onReject={(id) => updateStatus('teams', id, 'rejected')}
              tr={tr}
              statusBadge={statusBadge}
            />
          )}

          {/* Creators management */}
          {section === 'creators' && (
            <ApplicationTable
              data={adminApplications.creators}
              columns={[
                { key: 'name', label: tr.name },
                { key: 'platform', label: tr.platform },
                { key: 'followers', label: tr.followers },
                { key: 'date', label: tr.date },
              ]}
              statuses={statuses.creators}
              onApprove={(id) => updateStatus('creators', id, 'approved')}
              onReject={(id) => updateStatus('creators', id, 'rejected')}
              tr={tr}
              statusBadge={statusBadge}
            />
          )}

          {/* Tournaments/News/Site placeholder */}
          {['tournaments', 'news', 'site'].includes(section) && (
            <div className="glass border border-[#0B3C6D]/40 p-12 text-center">
              <div className="text-5xl mb-4">
                {section === 'tournaments' ? '🏆' : section === 'news' ? '📰' : '⚙️'}
              </div>
              <h3 className="font-display font-900 text-2xl text-white uppercase mb-2">
                {navItems.find(n => n.id === section)?.label}
              </h3>
              <p className="font-body text-white/40">
                {isRtl ? 'قريباً — هذا القسم قيد التطوير' : 'Coming soon — this section is under development'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ApplicationTable({
  data, columns, statuses, onApprove, onReject, tr, statusBadge,
}: {
  data: Record<string, unknown>[];
  columns: { key: string; label: string }[];
  statuses: Record<number, Status>;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
  tr: typeof t['en'];
  statusBadge: (s: Status) => React.ReactElement;
}) {
  return (
    <div className="glass border border-[#0B3C6D]/40 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#0B3C6D]/30 bg-[#0B3C6D]/10">
              {columns.map(col => (
                <th key={col.key} className="px-4 py-3 font-mono text-xs text-white/40 uppercase tracking-wider text-start">
                  {col.label}
                </th>
              ))}
              <th className="px-4 py-3 font-mono text-xs text-white/40 uppercase tracking-wider text-start">{tr.status}</th>
              <th className="px-4 py-3 font-mono text-xs text-white/40 uppercase tracking-wider text-start">{tr.actions}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#0B3C6D]/20">
            {data.map((row) => {
              const id = row.id as number;
              const status = statuses[id];
              return (
                <tr key={id} className="hover:bg-[#0B3C6D]/10 transition-colors">
                  {columns.map(col => (
                    <td key={col.key} className="px-4 py-3 font-body text-sm text-white/70">
                      {String(row[col.key] ?? '')}
                    </td>
                  ))}
                  <td className="px-4 py-3">{statusBadge(status)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {status !== 'approved' && (
                        <button
                          onClick={() => onApprove(id)}
                          className="font-mono text-xs text-green-400 hover:text-green-300 border border-green-400/30 hover:border-green-400 px-2.5 py-1 transition-all"
                        >
                          {tr.approve}
                        </button>
                      )}
                      {status !== 'rejected' && (
                        <button
                          onClick={() => onReject(id)}
                          className="font-mono text-xs text-red-400 hover:text-red-300 border border-red-400/30 hover:border-red-400 px-2.5 py-1 transition-all"
                        >
                          {tr.reject}
                        </button>
                      )}
                      <button className="font-mono text-xs text-white/30 hover:text-white/60 border border-white/10 hover:border-white/30 px-2.5 py-1 transition-all">
                        {tr.view}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
