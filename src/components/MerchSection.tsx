import { useState } from 'react';
import type { Lang } from '@/data/mockData';
import arcLogo from '@/imports/IMG_7058-1.jpeg';
import { api, type MerchItem } from '@/lib/api';
import { useFetch } from '@/hooks/useFetch';

const t = {
  ar: {
    title: 'الزي الرسمي',
    subtitle: 'هوية ARC على أرض الملعب',
    lead: 'تشكيلة رسمية تحمل شعار ARC وألوان المنظمة — مصممة للأبطال وصناع المحتوى.',
    all: 'الكل',
    jersey: 'جيرسي',
    hoodie: 'هودي',
    cap: 'قبعات',
    accessory: 'إكسسوارات',
    sizes: 'المقاسات',
    colors: 'الألوان',
    order: 'اطلب الآن',
    featured: 'أساسي',
    brandNote: 'كل قطعة تحمل الشعار الرسمي وهوية ARC البصرية.',
  },
  en: {
    title: 'Official Kit',
    subtitle: 'ARC Identity On The Field',
    lead: 'Official collection carrying the ARC crest and brand colors — built for champions and creators.',
    all: 'All',
    jersey: 'Jersey',
    hoodie: 'Hoodie',
    cap: 'Caps',
    accessory: 'Accessories',
    sizes: 'Sizes',
    colors: 'Colors',
    order: 'Order Now',
    featured: 'Signature',
    brandNote: 'Every piece carries the official crest and ARC visual identity.',
  },
};

interface Props { lang: Lang; }

export default function MerchSection({ lang }: Props) {
  const isRtl = lang === 'ar';
  const tr = t[lang];
  const [filter, setFilter] = useState<'all' | MerchItem['category']>('all');
  const { data: items, loading, error } = useFetch(api.merch, []);

  const filters = ['all', 'jersey', 'hoodie', 'cap', 'accessory'] as const;
  const filtered = filter === 'all' ? items : items.filter((item) => item.category === filter);

  return (
    <section id="merch" dir={isRtl ? 'rtl' : 'ltr'} className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B3C6D]/20 via-transparent to-[#F7941D]/5" />
      <div className="absolute inset-0 grid-bg opacity-25" />
      <div className="absolute top-0 left-0 right-0 arc-divider" />

      <div className="relative max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img src={arcLogo} alt="ARC" className="w-14 h-14 object-contain rounded-full border border-[#F7941D]/40" />
          </div>
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-px w-8 bg-[#F7941D]/50" />
            <span className="font-mono text-xs text-[#F7941D] tracking-[0.25em] uppercase">{tr.title}</span>
            <div className="h-px w-8 bg-[#F7941D]/50" />
          </div>
          <h2 className="font-display font-900 text-5xl md:text-6xl text-white uppercase mb-4">{tr.subtitle}</h2>
          <p className="font-body text-white/55 max-w-2xl mx-auto leading-relaxed">{tr.lead}</p>
          <p className="font-mono text-xs text-[#F7941D]/80 mt-3 uppercase tracking-wider">{tr.brandNote}</p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-10">
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

        {(loading || error || filtered.length === 0) && (
          <div className="text-center font-mono text-sm text-white/40 mb-8">
            {loading ? '...' : error || (isRtl ? 'لا توجد منتجات حالياً' : 'No products available')}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <article
              key={item.id}
              className="arc-card group overflow-hidden border border-[#0B3C6D]/40 bg-[#0D1117] relative"
            >
              <div className="relative h-72 overflow-hidden">
                <img
                  src={item.image}
                  alt={lang === 'ar' ? item.nameAr : item.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D1117] via-[#0D1117]/20 to-transparent" />
                <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-wider bg-[#0B3C6D]/90 text-white px-2 py-1 border border-[#174C8F]">
                    {tr[item.category]}
                  </span>
                  {item.featured && (
                    <span className="font-mono text-[10px] uppercase tracking-wider bg-[#F7941D] text-[#0D1117] px-2 py-1">
                      {tr.featured}
                    </span>
                  )}
                </div>
                <div className={`absolute bottom-3 ${isRtl ? 'left-3' : 'right-3'}`}>
                  <img
                    src={arcLogo}
                    alt="ARC crest"
                    className="w-12 h-12 object-contain rounded-full border border-[#F7941D]/50 shadow-lg bg-[#0D1117]/50"
                  />
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-display font-800 text-xl text-white uppercase leading-tight">
                    {lang === 'ar' ? item.nameAr : item.name}
                  </h3>
                  <div className="font-display font-900 text-[#F7941D] whitespace-nowrap">{item.price}</div>
                </div>
                <p className="font-body text-sm text-white/50 leading-relaxed mb-4">
                  {lang === 'ar' ? item.descriptionAr : item.description}
                </p>

                <div className="mb-3">
                  <div className="font-mono text-[10px] text-white/30 uppercase mb-1.5">{tr.colors}</div>
                  <div className="flex gap-2">
                    {item.colors.map((color) => (
                      <span
                        key={color}
                        className="w-5 h-5 border border-white/20"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>

                <div className="mb-5">
                  <div className="font-mono text-[10px] text-white/30 uppercase mb-1.5">{tr.sizes}</div>
                  <div className="flex flex-wrap gap-1.5">
                    {item.sizes.map((size) => (
                      <span key={size} className="font-mono text-xs text-white/60 border border-[#0B3C6D]/50 px-2 py-0.5">
                        {size}
                      </span>
                    ))}
                  </div>
                </div>

                <a
                  href={`mailto:contact@arcesports.com?subject=${encodeURIComponent(
                    `ARC Merch Order — ${item.name}`,
                  )}`}
                  className="btn-arc w-full text-sm py-2.5 inline-flex items-center justify-center"
                >
                  {tr.order}
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
