import arcLogo from '@/imports/IMG_7058-1.jpeg';
import type { Lang } from '@/data/mockData';

interface HeroProps {
  lang: Lang;
  onJoin: () => void;
}

const t = {
  ar: {
    tagline: 'نصنع الأبطال',
    tagline2: 'ونبني مستقبل صناع المحتوى',
    join: 'انضم إلى ARC',
    teams: 'الفرق',
    tournaments: 'البطولات',
    stat1: 'لاعب نشط',
    stat2: 'بطولة',
    stat3: 'فريق',
    stat4: 'دولة',
  },
  en: {
    tagline: 'We Make Champions',
    tagline2: 'Building the future of content creators',
    join: 'Join ARC',
    teams: 'Teams',
    tournaments: 'Tournaments',
    stat1: 'Active Players',
    stat2: 'Tournaments',
    stat3: 'Teams',
    stat4: 'Countries',
  },
};

export default function HeroSection({ lang, onJoin }: HeroProps) {
  const isRtl = lang === 'ar';
  const tr = t[lang];

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
      {/* Background layers */}
      <div className="absolute inset-0 bg-[#0D1117]" />

      {/* Grid pattern */}
      <div className="absolute inset-0 grid-bg opacity-60" />

      {/* Gradient radials */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[#0B3C6D]/20 blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] rounded-full bg-[#F7941D]/10 blur-[80px]" />
        <div className="absolute top-1/3 right-1/4 w-[200px] h-[200px] rounded-full bg-[#174C8F]/20 blur-[60px]" />
      </div>

      {/* Scan line */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#F7941D]/30 to-transparent"
          style={{ animation: 'scanline 6s linear infinite', top: '-1px' }}
        />
      </div>

      {/* Corner decorations */}
      <div className="absolute top-8 left-8 w-8 h-8 border-t-2 border-l-2 border-[#F7941D]/50" />
      <div className="absolute top-8 right-8 w-8 h-8 border-t-2 border-r-2 border-[#F7941D]/50" />
      <div className="absolute bottom-8 left-8 w-8 h-8 border-b-2 border-l-2 border-[#F7941D]/50" />
      <div className="absolute bottom-8 right-8 w-8 h-8 border-b-2 border-r-2 border-[#F7941D]/50" />

      {/* Esports background image */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1920&h=1080&fit=crop&auto=format)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0D1117] via-[#0D1117]/60 to-[#0D1117]/80" />

      {/* Content */}
      <div className="relative z-10 text-center max-w-5xl mx-auto px-4 py-24">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-[#F7941D]/20 blur-2xl scale-150" />
            <img
              src={arcLogo}
              alt="ARC Esports"
              className="relative w-28 h-28 md:w-36 md:h-36 object-contain animate-pulse-orange rounded-full"
            />
          </div>
        </div>

        {/* Label */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="h-px w-12 bg-[#F7941D]/50" />
          <span className="font-mono text-xs text-[#F7941D] tracking-[0.3em] uppercase">ARC ESPORTS ORGANIZATION</span>
          <div className="h-px w-12 bg-[#F7941D]/50" />
        </div>

        {/* Main heading */}
        <h1
          className="font-display font-900 text-5xl md:text-7xl lg:text-8xl text-white uppercase leading-none mb-2"
          style={{ textShadow: '0 0 60px rgba(11,60,109,0.8)' }}
        >
          {tr.tagline}
        </h1>
        <h2 className="font-display font-700 text-2xl md:text-4xl lg:text-5xl text-gradient uppercase leading-tight mb-8">
          {tr.tagline2}
        </h2>

        {/* Buttons */}
        <div className={`flex flex-wrap gap-4 justify-center ${isRtl ? 'flex-row-reverse' : ''}`}>
          <button onClick={onJoin} className="btn-arc text-base px-8 py-3">
            {tr.join}
          </button>
          <button onClick={() => scrollTo('teams')} className="btn-arc-outline text-base px-8 py-3">
            {tr.teams}
          </button>
          <button onClick={() => scrollTo('tournaments')} className="btn-arc-outline text-base px-8 py-3">
            {tr.tournaments}
          </button>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: '26+', label: tr.stat1 },
            { value: '17+', label: tr.stat2 },
            { value: '4', label: tr.stat3 },
            { value: '8+', label: tr.stat4 },
          ].map((stat, i) => (
            <div key={i} className="glass p-4 text-center arc-card">
              <div className="font-display font-900 text-3xl md:text-4xl text-[#F7941D]">{stat.value}</div>
              <div className="font-body text-xs text-white/50 mt-1 uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span className="font-mono text-xs text-white/30 tracking-widest uppercase">Scroll</span>
        <svg className="w-4 h-4 text-[#F7941D]/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
}
