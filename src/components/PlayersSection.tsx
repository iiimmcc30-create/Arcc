import { players as fallbackPlayers } from '@/data/mockData';
import type { Lang } from '@/data/mockData';
import { api } from '@/lib/api';
import { useFetch } from '@/hooks/useFetch';

const t = {
  ar: { title: 'اللاعبون', subtitle: 'نجوم ARC Esports', role: 'المركز', rank: 'الرتبة', achievements: 'الإنجازات' },
  en: { title: 'Players', subtitle: 'ARC Esports Stars', role: 'Role', rank: 'Rank', achievements: 'Achievements' },
};

interface Props { lang: Lang; }

export default function PlayersSection({ lang }: Props) {
  const isRtl = lang === 'ar';
  const tr = t[lang];
  const { data: players } = useFetch(api.players, fallbackPlayers as any);

  return (
    <section id="players" dir={isRtl ? 'rtl' : 'ltr'} className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-20" />
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

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {players.map((player) => (
            <div
              key={player.id}
              className="arc-card group relative overflow-hidden border border-[#0B3C6D]/40 bg-[#0D1117] cursor-pointer"
            >
              {/* Player image */}
              <div className="relative overflow-hidden aspect-square">
                <img
                  src={player.image}
                  alt={player.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D1117] via-transparent to-transparent" />

                {/* Country flag */}
                <div className="absolute top-2 right-2 text-lg">{player.flag}</div>

                {/* Role badge */}
                <div className="absolute top-2 left-2 font-mono text-[10px] bg-[#F7941D]/90 text-[#0D1117] font-700 px-1.5 py-0.5 uppercase">
                  {player.role}
                </div>
              </div>

              {/* Info */}
              <div className="p-3">
                <h3 className="font-display font-800 text-sm text-white uppercase leading-tight truncate">{player.name}</h3>
                <div className="font-mono text-[10px] text-[#F7941D] truncate mt-0.5">{player.game}</div>

                {/* Rank */}
                <div className="mt-2 pt-2 border-t border-[#0B3C6D]/30">
                  <div className="font-mono text-[10px] text-white/30 uppercase">{tr.rank}</div>
                  <div className="font-body text-xs text-white/70 font-600 truncate">{player.rank}</div>
                </div>
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-[#0B3C6D]/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-3 text-center">
                <div className="font-display font-900 text-base text-white uppercase mb-1">{player.name}</div>
                <div className="font-mono text-[10px] text-[#F7941D] mb-3">{lang === 'ar' ? player.country : player.countryEn}</div>
                <div className="font-mono text-[10px] text-white/60 mb-1 uppercase">{tr.achievements}</div>
                {(lang === 'ar' ? player.achievements : player.achievementsEn).map((a, i) => (
                  <div key={i} className="font-body text-[11px] text-white/80">🏆 {a}</div>
                ))}
                <div className="flex gap-2 mt-3">
                  {player.social.twitter && (
                    <a href={player.social.twitter} className="w-7 h-7 bg-[#F7941D]/20 border border-[#F7941D]/40 flex items-center justify-center hover:bg-[#F7941D]/40 transition-colors">
                      <svg className="w-3 h-3 text-[#F7941D]" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    </a>
                  )}
                  {player.social.instagram && (
                    <a href={player.social.instagram} className="w-7 h-7 bg-[#F7941D]/20 border border-[#F7941D]/40 flex items-center justify-center hover:bg-[#F7941D]/40 transition-colors">
                      <svg className="w-3 h-3 text-[#F7941D]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
