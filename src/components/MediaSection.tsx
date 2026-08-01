import type { Lang } from '@/data/mockData';
import { api } from '@/lib/api';
import { useFetch } from '@/hooks/useFetch';
import { useState } from 'react';

const t = {
  ar: {
    title: 'الميديا',
    subtitle: 'لحظات ARC',
    all: 'الكل',
    latest: 'الأحدث',
    highlights: 'أبرز اللقطات',
    creators: 'صناع المحتوى',
    tournaments: 'البطولات',
    watch: 'مشاهدة',
  },
  en: {
    title: 'Media',
    subtitle: 'ARC Moments',
    all: 'All',
    latest: 'Latest',
    highlights: 'Highlights',
    creators: 'Creators',
    tournaments: 'Tournaments',
    watch: 'Watch',
  },
};

interface Props { lang: Lang; }

export default function MediaSection({ lang }: Props) {
  const isRtl = lang === 'ar';
  const tr = t[lang];
  const [filter, setFilter] = useState<'all' | 'latest' | 'highlights' | 'creators' | 'tournaments'>('all');
  const { data: media } = useFetch(api.media, []);

  const filtered = filter === 'all' ? media : media.filter((m) => m.category === filter);
  const filters = ['all', 'latest', 'highlights', 'creators', 'tournaments'] as const;

  return (
    <section id="media" dir={isRtl ? 'rtl' : 'ltr'} className="relative py-24 overflow-hidden">
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

          <div className="flex flex-wrap justify-center gap-3">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`font-display font-700 text-sm uppercase tracking-wide px-5 py-2 border transition-all ${
                  filter === f
                    ? 'bg-[#F7941D] text-[#0D1117] border-[#F7941D]'
                    : 'border-[#0B3C6D]/50 text-white/50 hover:text-white hover:border-[#F7941D]/50'
                }`}
              >
                {tr[f]}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((item) => (
            <a
              key={item.id}
              href={item.videoUrl || '#'}
              target="_blank"
              rel="noreferrer"
              className="arc-card group overflow-hidden border border-[#0B3C6D]/40 bg-[#0D1117] block"
            >
              <div className="relative overflow-hidden h-52">
                <img
                  src={item.thumbnail}
                  alt={lang === 'ar' ? item.titleAr : item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D1117] via-[#0D1117]/20 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-14 h-14 rounded-full bg-[#F7941D] text-[#0D1117] flex items-center justify-center font-display font-900">
                    ▶
                  </div>
                </div>
                <div className={`absolute top-3 ${isRtl ? 'right-3' : 'left-3'}`}>
                  <span className="font-mono text-xs bg-[#F7941D]/90 text-[#0D1117] font-700 px-2 py-0.5 uppercase">
                    {item.category}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-display font-800 text-lg text-white uppercase mb-1">
                  {lang === 'ar' ? item.titleAr : item.title}
                </h3>
                <div className="font-mono text-xs text-white/40">
                  {item.creator} · {tr.watch}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
