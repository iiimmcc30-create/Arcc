import { news } from '@/data/mockData';
import type { Lang } from '@/data/mockData';

const t = {
  ar: { title: 'الأخبار', subtitle: 'آخر أخبار ARC', readMore: 'اقرأ المزيد' },
  en: { title: 'News', subtitle: 'Latest from ARC', readMore: 'Read More' },
};

interface Props { lang: Lang; }

export default function NewsSection({ lang }: Props) {
  const isRtl = lang === 'ar';
  const tr = t[lang];

  return (
    <section id="news" dir={isRtl ? 'rtl' : 'ltr'} className="relative py-24 overflow-hidden">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {news.map((item, i) => (
            <div
              key={item.id}
              className={`arc-card group overflow-hidden border border-[#0B3C6D]/40 bg-[#0D1117] ${i === 0 ? 'md:col-span-2' : ''}`}
            >
              {/* Image */}
              <div className={`relative overflow-hidden ${i === 0 ? 'h-56' : 'h-40'}`}>
                <img
                  src={item.image}
                  alt={lang === 'ar' ? item.title : item.titleEn}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D1117] via-[#0D1117]/20 to-transparent" />
                <div className={`absolute top-3 ${isRtl ? 'right-3' : 'left-3'}`}>
                  <span className="font-mono text-xs bg-[#F7941D]/90 text-[#0D1117] font-700 px-2 py-0.5 uppercase">
                    {lang === 'ar' ? item.category : item.categoryEn}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="font-mono text-xs text-white/30 mb-2">{item.date}</div>
                <h3 className="font-display font-800 text-lg text-white uppercase leading-tight mb-2">
                  {lang === 'ar' ? item.title : item.titleEn}
                </h3>
                <p className="font-body text-white/50 text-sm leading-relaxed mb-4">
                  {lang === 'ar' ? item.summary : item.summaryEn}
                </p>
                <button className="font-display font-700 text-sm text-[#F7941D] uppercase tracking-wide hover:text-white transition-colors flex items-center gap-2">
                  {tr.readMore}
                  <svg className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
