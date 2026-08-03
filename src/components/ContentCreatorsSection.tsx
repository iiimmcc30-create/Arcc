import React from 'react';
import type { Lang } from '@/data/mockData';
import { api } from '@/lib/api';
import { useFetch } from '@/hooks/useFetch';

const t = {
  ar: {
    title: 'صناع المحتوى',
    subtitle: 'أصوات ARC',
    followers: 'متابع',
    verified: 'موثّق',
    empty: 'لم تُضف أصوات ARC بعد — أضفهم مع صورهم من لوحة التحكم.',
  },
  en: {
    title: 'Content Creators',
    subtitle: 'Voices of ARC',
    followers: 'Followers',
    verified: 'Verified',
    empty: 'No ARC Voices yet — add them with photos from the admin dashboard.',
  },
};

interface Props { lang: Lang; }

const PlatformIcon = ({ platform }: { platform: string }) => {
  const icons: Record<string, React.ReactElement> = {
    tiktok: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.17 8.17 0 004.79 1.54V6.78s-1.18.13-1.02-.09z"/></svg>,
    youtube: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>,
    twitch: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z"/></svg>,
    kick: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M2 2h20v20H2V2zm4 4v12h3V14l5 4h4l-6-6 6-6h-4l-5 4V6H6z"/></svg>,
  };
  return icons[platform] || null;
};

export default function ContentCreatorsSection({ lang }: Props) {
  const isRtl = lang === 'ar';
  const tr = t[lang];
  const { data: creators, loading } = useFetch(api.creators, []);

  return (
    <section id="creators" dir={isRtl ? 'rtl' : 'ltr'} className="relative py-24 overflow-hidden">
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

        {loading && (
          <div className="text-center font-mono text-sm text-white/40 mb-8">...</div>
        )}

        {!loading && creators.length === 0 && (
          <div className="text-center font-mono text-sm text-white/40 mb-8">{tr.empty}</div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {creators.map((creator) => (
            <div key={creator.id} className="arc-card group glass border border-[#0B3C6D]/40 overflow-hidden">
              <div className="relative">
                <div className="h-32 relative overflow-hidden bg-gradient-to-br from-[#0B3C6D] to-[#174C8F]">
                  {creator.image ? (
                    <>
                      <img
                        src={creator.image}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover scale-110 blur-[2px] opacity-60"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0D1117]/80 via-[#0B3C6D]/40 to-transparent" />
                    </>
                  ) : (
                    <>
                      <div className="absolute inset-0 grid-bg opacity-40" />
                      <div className="absolute inset-0 bg-gradient-to-br from-[#F7941D]/10 to-transparent" />
                    </>
                  )}
                </div>
                <div className={`absolute bottom-0 translate-y-1/2 ${isRtl ? 'right-5' : 'left-5'}`}>
                  <div className="relative">
                    {creator.image ? (
                      <img
                        src={creator.image}
                        alt={creator.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-[#F7941D] bg-[#0D1117]"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full border-2 border-[#F7941D] bg-[#0B3C6D] flex items-center justify-center font-display font-900 text-xl text-white">
                        {creator.name.slice(0, 1)}
                      </div>
                    )}
                    {creator.verified && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#F7941D] rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-[#0D1117]" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-12 pb-5 px-5">
                <div className={`flex items-start justify-between ${isRtl ? 'flex-row-reverse' : ''}`}>
                  <div>
                    <h3 className="font-display font-800 text-lg text-white uppercase">
                      {lang === 'ar' ? creator.nameAr || creator.name : creator.name}
                    </h3>
                    {creator.verified && (
                      <span className="font-mono text-[10px] text-[#F7941D] bg-[#F7941D]/10 border border-[#F7941D]/30 px-2 py-0.5">
                        ✓ {tr.verified}
                      </span>
                    )}
                  </div>
                </div>

                <p className="font-body text-white/50 text-sm mt-3 leading-relaxed">
                  {lang === 'ar' ? creator.bio : creator.bioEn}
                </p>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  {Object.entries(creator.platforms || {}).map(([platform, count]) => (
                    <a
                      key={platform}
                      href={creator.social?.[platform] || '#'}
                      className="flex items-center gap-2 bg-white/5 border border-white/10 px-2.5 py-2 hover:border-[#F7941D]/40 hover:bg-[#F7941D]/5 transition-colors group/link"
                    >
                      <span className="text-[#F7941D] group-hover/link:scale-110 transition-transform">
                        <PlatformIcon platform={platform} />
                      </span>
                      <div>
                        <div className="font-display font-700 text-sm text-white leading-none">{count}</div>
                        <div className="font-mono text-[9px] text-white/30 uppercase">{platform}</div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
