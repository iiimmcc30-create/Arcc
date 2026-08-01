import { useState, useEffect } from 'react';
import type { Lang } from '@/data/mockData';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import GamesSection from '@/components/GamesSection';
import TeamsSection from '@/components/TeamsSection';
import PlayersSection from '@/components/PlayersSection';
import ContentCreatorsSection from '@/components/ContentCreatorsSection';
import TournamentsSection from '@/components/TournamentsSection';
import NewsSection from '@/components/NewsSection';
import MediaSection from '@/components/MediaSection';
import PartnersFooter from '@/components/PartnersFooter';
import JoinWizard from '@/components/JoinWizard';
import AdminDashboard from '@/components/AdminDashboard';

type Page = 'main' | 'join' | 'admin';

export default function App() {
  const [lang, setLang] = useState<Lang>('ar');
  const [page, setPage] = useState<Page>('main');

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const goToJoin = () => {
    setPage('join');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToMain = () => {
    setPage('main');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToAdmin = () => {
    setPage('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (page === 'admin') {
    return <AdminDashboard lang={lang} onBack={goToMain} />;
  }

  return (
    <div className="bg-[#0D1117] min-h-screen relative">
      {/* Background ambiance */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-[#0B3C6D]/8 blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-[#F7941D]/5 blur-[100px]" />
      </div>

      <Navbar
        lang={lang}
        setLang={setLang}
        onAdminClick={goToAdmin}
        activePage={page}
        setActivePage={(p) => setPage(p as Page)}
      />

      {page === 'join' ? (
        <div className="relative z-10">
          <JoinWizard lang={lang} onBack={goToMain} />
        </div>
      ) : (
        <main className="relative z-10">
          <HeroSection lang={lang} onJoin={goToJoin} />
          <AboutSection lang={lang} />
          <GamesSection lang={lang} />
          <TeamsSection lang={lang} />
          <PlayersSection lang={lang} />
          <ContentCreatorsSection lang={lang} />
          <TournamentsSection lang={lang} />
          <MediaSection lang={lang} />
          <NewsSection lang={lang} />
          <PartnersFooter lang={lang} onJoin={goToJoin} />
        </main>
      )}
    </div>
  );
}
