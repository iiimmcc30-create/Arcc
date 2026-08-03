import type { Lang } from '@/data/mockData';
import { api } from '@/lib/api';
import { useFetch } from '@/hooks/useFetch';

const t = {
  ar: { title: 'الفرق', subtitle: 'فرق ARC الرسمية', captain: 'القائد', achievements: 'الإنجازات', tournaments: 'البطولات', players: 'لاعب', details: 'عرض التفاصيل' },
  en: { title: 'Teams', subtitle: 'Official ARC Teams', captain: 'Captain', achievements: 'Achievements', tournaments: 'Tournaments', players: 'Players', details: 'View Details' },
};

interface Props { lang: Lang; }

export default function TeamsSection({ lang }: Props) {
  const isRtl = lang === 'ar';
  const tr = t[lang];
  const { data: teams } = useFetch(api.teams, []);

  return (
    <section id="teams" dir={isRtl ? 'rtl' : 'ltr'} className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-[#0B3C6D]/5" />
      <div className="absolute top-0 left-0 right-0 arc-divider" />

      <div className="relative max-w-6xl mx-auto px-4">
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-px w-8 bg-[#F7941D]/50" />
            <span className="font-mono text-xs text-[#F7941D] tracking-[0.25em] uppercase">{tr.title}</span>
            <div className="h-px w-8 bg-[#F7941D]/50" />
          </div>
          <h2 className="font-display font-900 text-5xl md:text-6xl text-white uppercase">{tr.subtitle}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {teams.map((team) => (
            <div
              key={team.id}
              className="arc-card glass border border-[#0B3C6D]/40 overflow-hidden group"
            >
              {/* Header */}
              <div className="flex items-center gap-4 p-5 border-b border-[#0B3C6D]/30">
                <div className="relative w-16 h-16 flex-shrink-0">
                  <img
                    src={team.logo}
                    alt={team.name}
                    className="w-full h-full object-cover rounded-sm border border-[#F7941D]/30"
                  />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#F7941D] rounded-full animate-pulse" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-800 text-xl text-white uppercase truncate">{team.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-mono text-xs text-[#F7941D] bg-[#F7941D]/10 px-2 py-0.5 border border-[#F7941D]/20">
                      {team.game}
                    </span>
                    <span className="font-mono text-xs text-white/40">{team.players} {tr.players}</span>
                  </div>
                </div>
                <div className={`font-mono text-xs text-white/30 ${isRtl ? 'text-left' : 'text-right'}`}>
                  <div>{tr.captain}</div>
                  <div className="text-white/60 font-600">{team.captain}</div>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 grid grid-cols-1 gap-4">
                {/* Achievements */}
                <div>
                  <div className="font-mono text-xs text-[#F7941D] uppercase tracking-wider mb-2">{tr.achievements}</div>
                  <div className="flex flex-wrap gap-2">
                    {(lang === 'ar' ? team.achievements : team.achievementsEn).map((a, i) => (
                      <span key={i} className="font-body text-xs text-white/70 bg-[#0B3C6D]/30 border border-[#0B3C6D]/50 px-2 py-1">
                        🏆 {a}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Tournaments */}
                <div>
                  <div className="font-mono text-xs text-white/40 uppercase tracking-wider mb-2">{tr.tournaments}</div>
                  <div className="flex flex-wrap gap-1.5">
                    {team.tournaments.map((t2, i) => (
                      <span key={i} className="font-mono text-xs text-white/50 bg-white/5 border border-white/10 px-2 py-0.5">
                        {t2}
                      </span>
                    ))}
                  </div>
                </div>

                <button className="btn-arc-outline text-sm py-2 w-full mt-1">
                  {tr.details}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
