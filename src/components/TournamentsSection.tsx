import { useState } from 'react';
import { tournaments } from '@/data/mockData';
import type { Lang } from '@/data/mockData';

const t = {
  ar: {
    title: 'البطولات', subtitle: 'ساحة الأبطال',
    active: 'جارية', upcoming: 'قادمة', past: 'منتهية',
    all: 'الكل', prize: 'الجوائز', teams: 'فريق', details: 'التفاصيل',
    start: 'البداية', end: 'النهاية',
  },
  en: {
    title: 'Tournaments', subtitle: 'Arena of Champions',
    active: 'Live', upcoming: 'Upcoming', past: 'Completed',
    all: 'All', prize: 'Prize Pool', teams: 'Teams', details: 'Details',
    start: 'Start', end: 'End',
  },
};

interface Props { lang: Lang; }

export default function TournamentsSection({ lang }: Props) {
  const isRtl = lang === 'ar';
  const tr = t[lang];
  const [filter, setFilter] = useState<'all' | 'active' | 'upcoming' | 'past'>('all');

  const filtered = filter === 'all' ? tournaments : tournaments.filter(t2 => t2.status === filter);

  const statusColor = {
    active: 'bg-green-500/20 text-green-400 border-green-500/30',
    upcoming: 'bg-[#F7941D]/20 text-[#F7941D] border-[#F7941D]/30',
    past: 'bg-white/10 text-white/40 border-white/10',
  };

  const statusLabel = { active: tr.active, upcoming: tr.upcoming, past: tr.past };

  return (
    <section id="tournaments" dir={isRtl ? 'rtl' : 'ltr'} className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="absolute top-0 left-0 right-0 arc-divider" />

      <div className="relative max-w-6xl mx-auto px-4">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-px w-8 bg-[#F7941D]/50" />
            <span className="font-mono text-xs text-[#F7941D] tracking-[0.25em] uppercase">{tr.title}</span>
            <div className="h-px w-8 bg-[#F7941D]/50" />
          </div>
          <h2 className="font-display font-900 text-5xl md:text-6xl text-white uppercase mb-8">{tr.subtitle}</h2>

          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-3">
            {(['all', 'active', 'upcoming', 'past'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`font-display font-700 text-sm uppercase tracking-wide px-5 py-2 border transition-all ${
                  filter === f
                    ? 'bg-[#F7941D] text-[#0D1117] border-[#F7941D]'
                    : 'border-[#0B3C6D]/50 text-white/50 hover:text-white hover:border-[#F7941D]/50'
                }`}
              >
                {f === 'all' ? tr.all : statusLabel[f]}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((tournament) => (
            <div key={tournament.id} className="arc-card group overflow-hidden border border-[#0B3C6D]/40 bg-[#0D1117]">
              {/* Image */}
              <div className="relative overflow-hidden h-44">
                <img
                  src={tournament.image}
                  alt={tournament.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D1117] via-[#0D1117]/30 to-transparent" />

                {/* Status badge */}
                <div className={`absolute top-3 ${isRtl ? 'right-3' : 'left-3'}`}>
                  <span className={`font-mono text-xs font-700 px-3 py-1 border uppercase tracking-wider ${statusColor[tournament.status as keyof typeof statusColor]}`}>
                    {tournament.status === 'active' && <span className="inline-block w-2 h-2 rounded-full bg-green-400 mr-1.5 animate-pulse" />}
                    {statusLabel[tournament.status as keyof typeof statusLabel]}
                  </span>
                </div>

                {/* Prize */}
                <div className={`absolute top-3 ${isRtl ? 'left-3' : 'right-3'}`}>
                  <div className="glass px-3 py-1 text-center">
                    <div className="font-display font-900 text-lg text-[#F7941D]">{tournament.prize}</div>
                    <div className="font-mono text-[9px] text-white/40 uppercase">{tr.prize}</div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="font-mono text-xs text-[#F7941D] mb-1 uppercase">{tournament.game}</div>
                <h3 className="font-display font-800 text-xl text-white uppercase mb-3">
                  {lang === 'ar' ? tournament.nameAr : tournament.name}
                </h3>

                {/* Details */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="glass p-2 text-center">
                    <div className="font-mono text-xs text-white/40 uppercase mb-1">{tr.start}</div>
                    <div className="font-display font-700 text-sm text-white">{tournament.startDate}</div>
                  </div>
                  <div className="glass p-2 text-center">
                    <div className="font-mono text-xs text-white/40 uppercase mb-1">{tr.end}</div>
                    <div className="font-display font-700 text-sm text-white">{tournament.endDate}</div>
                  </div>
                  <div className="glass p-2 text-center">
                    <div className="font-display font-900 text-xl text-[#F7941D]">{tournament.teams}</div>
                    <div className="font-mono text-xs text-white/40 uppercase">{tr.teams}</div>
                  </div>
                </div>

                <button className="btn-arc-outline w-full text-sm py-2">{tr.details}</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
