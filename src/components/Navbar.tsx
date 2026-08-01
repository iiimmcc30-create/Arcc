import { useState, useEffect } from 'react';
import arcLogo from '@/imports/IMG_7058-1.jpeg';
import type { Lang } from '@/data/mockData';

const navLinks = {
  ar: [
    { label: 'الرئيسية', id: 'hero' },
    { label: 'من نحن', id: 'about' },
    { label: 'الألعاب', id: 'games' },
    { label: 'الفرق', id: 'teams' },
    { label: 'اللاعبين', id: 'players' },
    { label: 'البطولات', id: 'tournaments' },
    { label: 'الميديا', id: 'media' },
    { label: 'الزي الرسمي', id: 'merch' },
    { label: 'الأخبار', id: 'news' },
    { label: 'انضم إلينا', id: 'join', highlight: true },
  ],
  en: [
    { label: 'Home', id: 'hero' },
    { label: 'About', id: 'about' },
    { label: 'Games', id: 'games' },
    { label: 'Teams', id: 'teams' },
    { label: 'Players', id: 'players' },
    { label: 'Tournaments', id: 'tournaments' },
    { label: 'Media', id: 'media' },
    { label: 'Kit', id: 'merch' },
    { label: 'News', id: 'news' },
    { label: 'Join Us', id: 'join', highlight: true },
  ],
};

interface NavbarProps {
  lang: Lang;
  setLang: (l: Lang) => void;
  onAdminClick: () => void;
  activePage: string;
  setActivePage: (p: string) => void;
}

export default function Navbar({ lang, setLang, onAdminClick, activePage, setActivePage }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const isRtl = lang === 'ar';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    if (id === 'join') {
      setActivePage('join');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setActivePage('main');
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const links = navLinks[lang];

  return (
    <nav
      dir={isRtl ? 'rtl' : 'ltr'}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass-dark shadow-2xl' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <button onClick={() => scrollTo('hero')} className="flex items-center gap-3">
          <img
            src={arcLogo}
            alt="ARC Esports Logo"
            className="w-12 h-12 object-contain"
          />
          <div className={`${isRtl ? 'text-right' : 'text-left'}`}>
            <div className="font-display font-900 text-xl text-white tracking-wider leading-none">ARC</div>
            <div className="font-display text-xs tracking-[0.2em] text-[#F7941D] uppercase leading-none">Esports</div>
          </div>
        </button>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-6">
          {links.map(link => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className={`font-display font-600 text-sm tracking-wide uppercase transition-all duration-200 ${
                link.highlight
                  ? 'btn-arc text-sm py-2 px-4'
                  : 'text-white/70 hover:text-[#F7941D]'
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          {/* Language Toggle */}
          <button
            onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
            className="glass text-xs font-mono font-500 px-3 py-1.5 text-[#F7941D] hover:bg-[#F7941D]/10 transition-colors"
          >
            {lang === 'ar' ? 'EN' : 'عربي'}
          </button>

          {/* Admin */}
          <button
            onClick={onAdminClick}
            className="flex items-center gap-1.5 text-white/40 hover:text-white/70 text-xs font-mono transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            {lang === 'ar' ? 'الإدارة' : 'Admin'}
          </button>

          {/* Mobile menu */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden text-white p-1"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden glass-dark border-t border-[#0B3C6D]/40 px-4 py-4 flex flex-col gap-3">
          {links.map(link => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className={`font-display font-600 text-base tracking-wide uppercase transition-colors text-start ${
                link.highlight ? 'text-[#F7941D]' : 'text-white/70 hover:text-[#F7941D]'
              }`}
            >
              {link.label}
            </button>
          ))}
          <button onClick={onAdminClick} className="text-white/40 font-mono text-sm text-start">
            {lang === 'ar' ? '🔒 لوحة التحكم' : '🔒 Admin Panel'}
          </button>
        </div>
      )}
    </nav>
  );
}
