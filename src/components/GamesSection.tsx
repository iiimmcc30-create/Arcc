import { games as fallbackGames } from '@/data/mockData';
import type { Lang } from '@/data/mockData';
import { api } from '@/lib/api';
import { useFetch } from '@/hooks/useFetch';

const t = {
  ar: { title: 'الألعاب', subtitle: 'ساحاتنا التنافسية', players: 'لاعب', tournaments: 'بطولة', viewTeam: 'عرض الفريق' },
  en: { title: 'Games', subtitle: 'Our Competitive Arenas', players: 'Players', tournaments: 'Tournaments', viewTeam: 'View Team' },
};

interface Props { lang: Lang; }

export default function GamesSection({ lang }: Props) {
  const isRtl = lang === 'ar';
  const tr = t[lang];
  const { data: games, loading } = useFetch(api.games, fallbackGames as any);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section id="games" dir={isRtl ? 'rtl' : 'ltr'} className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30" />
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

        {loading && <div className="text-center font-mono text-sm text-white/40 mb-6">Loading...</div>}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {games.map((game) => (
            <div
              key={game.id}
              className="arc-card group relative overflow-hidden border border-[#0B3C6D]/40 bg-[#0D1117]"
            >
              {/* Image */}
              <div className="relative overflow-hidden h-48">
                <img
                  src={game.image}
                  alt={game.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D1117] via-[#0D1117]/40 to-transparent" />

                {/* Game name overlay */}
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="font-display font-900 text-2xl text-white uppercase tracking-wide drop-shadow-lg">
                    {game.name}
                  </h3>
                </div>

                {/* Orange accent corner */}
                <div className="absolute top-0 right-0 w-0 h-0 border-solid border-transparent border-t-[40px] border-r-[40px] border-t-[#F7941D] border-r-transparent transition-all duration-300 group-hover:border-t-[50px] group-hover:border-r-[50px]" />
              </div>

              {/* Content */}
              <div className="p-5">
                <p className="font-body text-white/60 text-sm mb-5 leading-relaxed">
                  {lang === 'ar' ? game.desc : game.descEn}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="glass p-3 text-center">
                    <div className="font-display font-800 text-2xl text-[#F7941D]">{game.players}</div>
                    <div className="font-mono text-xs text-white/40 uppercase tracking-wider">{tr.players}</div>
                  </div>
                  <div className="glass p-3 text-center">
                    <div className="font-display font-800 text-2xl text-[#F7941D]">{game.tournaments}</div>
                    <div className="font-mono text-xs text-white/40 uppercase tracking-wider">{tr.tournaments}</div>
                  </div>
                </div>

                <button
                  onClick={() => scrollTo('teams')}
                  className="btn-arc w-full text-sm py-2.5"
                >
                  {tr.viewTeam}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
