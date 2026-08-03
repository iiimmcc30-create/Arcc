import arcLogo from '@/imports/IMG_7058-1.jpeg';
import type { Lang } from '@/data/mockData';
import { api } from '@/lib/api';
import { useFetch } from '@/hooks/useFetch';

interface HeroProps {
  lang: Lang;
  onJoin: () => void;
}

const t = {
  ar: {
    org: 'منظمة ARC ESPORTS',
    tagline: 'نصنع الأبطال',
    tagline2: 'ونبني مستقبل صناع المحتوى',
    join: 'انضم إلى ARC',
    explore: 'استكشف المنظمة',
  },
  en: {
    org: 'ARC ESPORTS ORGANIZATION',
    tagline: 'We Make Champions',
    tagline2: 'Building the future of content creators',
    join: 'Join ARC',
    explore: 'Explore ARC',
  },
};

export default function HeroSection({ lang, onJoin }: HeroProps) {
  const isRtl = lang === 'ar';
  const tr = t[lang];
  const { data: site } = useFetch(api.site, {
    id: 0,
    brandName: 'ARC Esports',
    taglineAr: '',
    taglineEn: '',
    social: {},
    stats: {},
  });

  const brand = site?.brandName || 'ARC Esports';
  const line1 = (lang === 'ar' ? site?.taglineAr : site?.taglineEn) || tr.tagline;
  const line2 = lang === 'ar'
    ? (site?.taglineAr ? '' : tr.tagline2)
    : (site?.taglineEn ? '' : tr.tagline2);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section
      id="hero"
      dir={isRtl ? 'rtl' : 'ltr'}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 bg-[#0D1117]" />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1920&h=1080&fit=crop&auto=format)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0D1117] via-[#0D1117]/70 to-[#0D1117]/55" />
      <div className="absolute inset-0 grid-bg opacity-40" />

      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[#0B3C6D]/25 blur-[120px]" />
      <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] rounded-full bg-[#F7941D]/12 blur-[80px]" />

      <div className="relative z-10 text-center max-w-5xl mx-auto px-4 py-24">
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-[#F7941D]/20 blur-2xl scale-150" />
            <img
              src={arcLogo}
              alt={brand}
              className="relative w-28 h-28 md:w-40 md:h-40 object-contain animate-pulse-orange rounded-full"
            />
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="h-px w-12 bg-[#F7941D]/50" />
          <span className="font-mono text-xs text-[#F7941D] tracking-[0.3em] uppercase">{brand}</span>
          <div className="h-px w-12 bg-[#F7941D]/50" />
        </div>

        <h1
          className="font-display font-900 text-5xl md:text-7xl lg:text-8xl text-white uppercase leading-none mb-3"
          style={{ textShadow: '0 0 60px rgba(11,60,109,0.8)' }}
        >
          {line1 || tr.tagline}
        </h1>
        {line2 ? (
          <p className="font-display font-700 text-2xl md:text-4xl text-gradient uppercase leading-tight mb-8">
            {line2}
          </p>
        ) : (
          <p className="font-body text-white/55 text-lg md:text-xl max-w-2xl mx-auto mb-8">
            {tr.org}
          </p>
        )}

        <div className={`flex flex-wrap gap-4 justify-center ${isRtl ? 'flex-row-reverse' : ''}`}>
          <button onClick={onJoin} className="btn-arc text-base px-8 py-3">
            {tr.join}
          </button>
          <button onClick={() => scrollTo('about')} className="btn-arc-outline text-base px-8 py-3">
            {tr.explore}
          </button>
        </div>
      </div>
    </section>
  );
}
