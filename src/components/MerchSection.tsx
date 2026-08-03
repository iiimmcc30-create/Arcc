import { useState } from 'react';
import type { Lang } from '@/data/mockData';
import arcLogo from '@/imports/IMG_7058-1.jpeg';
import { api, type MerchItem } from '@/lib/api';
import { useFetch } from '@/hooks/useFetch';

const t = {
  ar: {
    title: 'الزي الرسمي',
    subtitle: 'طقم ARC الرسمي',
    lead: 'هوية بصرية على أرض الملعب — أزرق ARC، برتقالي الشعلة، وشعار المنظمة.',
    all: 'الكل',
    jersey: 'جيرسي',
    hoodie: 'هودي',
    cap: 'قبعات',
    accessory: 'إكسسوارات',
    sizes: 'المقاسات',
    colors: 'الألوان',
    order: 'اطلب الآن',
    featured: 'توقيع ARC',
    brandNote: 'يُدار من لوحة التحكم — أضف القطع الرسمية من قسم المتجر.',
    empty: 'لم يُضف الزي الرسمي بعد. سيظهر هنا فور إضافته من لوحة التحكم.',
    home: 'جيرسي الأساسي',
    away: 'طقم الضيف',
  },
  en: {
    title: 'Official Kit',
    subtitle: 'ARC Match Kit',
    lead: 'Brand identity on the field — ARC navy, flame orange, and the official crest.',
    all: 'All',
    jersey: 'Jersey',
    hoodie: 'Hoodie',
    cap: 'Caps',
    accessory: 'Accessories',
    sizes: 'Sizes',
    colors: 'Colors',
    order: 'Order Now',
    featured: 'ARC Signature',
    brandNote: 'Managed from the admin dashboard — add official pieces in Merch.',
    empty: 'Official kit not added yet. It will appear here once created in the admin panel.',
    home: 'Home Jersey',
    away: 'Away Kit',
  },
};

function KitCanvas({ label, variant }: { label: string; variant: 'home' | 'away' }) {
  const home = variant === 'home';
  return (
    <div className="relative aspect-[4/5] overflow-hidden border border-[#0B3C6D]/50 bg-[#070A0F]">
      <div
        className="absolute inset-0"
        style={{
          background: home
            ? 'linear-gradient(160deg, #0B3C6D 0%, #071F38 45%, #0D1117 100%)'
            : 'linear-gradient(160deg, #F5F7FA 0%, #D7DEE8 40%, #8FA3BC 100%)',
        }}
      />
      <div
        className="absolute inset-x-[18%] top-[12%] bottom-[10%] rounded-[28%_28%_18%_18%/12%_12%_8%_8%] border"
        style={{
          borderColor: home ? 'rgba(247,148,29,0.55)' : 'rgba(11,60,109,0.55)',
          background: home
            ? 'linear-gradient(180deg, rgba(23,76,143,0.95), rgba(11,60,109,0.98))'
            : 'linear-gradient(180deg, #ffffff, #e8eef6)',
          boxShadow: home
            ? 'inset 0 0 40px rgba(247,148,29,0.15)'
            : 'inset 0 0 40px rgba(11,60,109,0.12)',
        }}
      >
        <div
          className="absolute left-0 top-[28%] bottom-[28%] w-2"
          style={{ background: '#F7941D' }}
        />
        <div
          className="absolute right-0 top-[28%] bottom-[28%] w-2"
          style={{ background: '#F7941D' }}
        />
        <div className="absolute inset-x-0 top-[22%] flex flex-col items-center">
          <img
            src={arcLogo}
            alt="ARC"
            className="w-16 h-16 md:w-20 md:h-20 object-contain rounded-full border border-[#F7941D]/50 bg-[#0D1117]/30"
          />
          <div
            className="mt-3 font-display font-900 text-2xl md:text-3xl tracking-[0.2em] uppercase"
            style={{ color: home ? '#FFFFFF' : '#0B3C6D' }}
          >
            ARC
          </div>
        </div>
        <div
          className="absolute inset-x-0 bottom-[14%] text-center font-mono text-[10px] tracking-[0.35em] uppercase"
          style={{ color: home ? 'rgba(255,255,255,0.55)' : 'rgba(11,60,109,0.55)' }}
        >
          Esports
        </div>
      </div>
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-wider text-white/70 bg-[#0D1117]/70 px-2 py-1 border border-[#F7941D]/40">
          {label}
        </span>
        <span className="font-mono text-[10px] text-[#F7941D]">#0B3C6D · #F7941D</span>
      </div>
    </div>
  );
}

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
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B3C6D]/25 via-transparent to-[#F7941D]/8" />
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

        {/* Brand kit canvas — visual identity anchor */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-14">
          <KitCanvas label={tr.home} variant="home" />
          <KitCanvas label={tr.away} variant="away" />
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
            {loading ? '...' : error || tr.empty}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <article
              key={item.id}
              className="group overflow-hidden border border-[#0B3C6D]/40 bg-[#0D1117] relative"
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
