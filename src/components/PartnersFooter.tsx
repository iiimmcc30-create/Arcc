import arcLogo from '@/imports/IMG_7058-1.jpeg';
import type { Lang } from '@/data/mockData';
import { api } from '@/lib/api';
import { useFetch } from '@/hooks/useFetch';

const t = {
  ar: {
    partners: 'شركاؤنا',
    partnersSubtitle: 'نفتخر بشراكاتنا',
    quickLinks: 'روابط سريعة',
    home: 'الرئيسية', about: 'من نحن', games: 'الألعاب', teams: 'الفرق',
    players: 'اللاعبون', tournaments: 'البطولات', news: 'الأخبار', join: 'انضم إلينا',
    legal: 'قانوني',
    privacy: 'سياسة الخصوصية', terms: 'الشروط والأحكام',
    social: 'تابعنا',
    copyright: '© 2024 ARC Esports. جميع الحقوق محفوظة.',
    desc: 'منظمة ARC Esports — نصنع الأبطال ونبني مستقبل صناع المحتوى في العالم العربي.',
  },
  en: {
    partners: 'Partners',
    partnersSubtitle: 'Proud to Partner With',
    quickLinks: 'Quick Links',
    home: 'Home', about: 'About', games: 'Games', teams: 'Teams',
    players: 'Players', tournaments: 'Tournaments', news: 'News', join: 'Join Us',
    legal: 'Legal',
    privacy: 'Privacy Policy', terms: 'Terms & Conditions',
    social: 'Follow Us',
    copyright: '© 2024 ARC Esports. All rights reserved.',
    desc: 'ARC Esports — Building champions and shaping the future of content creators in the Arab world.',
  },
};

interface Props { lang: Lang; onJoin: () => void; }

export default function PartnersFooter({ lang, onJoin }: Props) {
  const isRtl = lang === 'ar';
  const tr = t[lang];
  const { data: partners } = useFetch(api.partners, []);
  const { data: site } = useFetch(api.site, {
    id: 1,
    brandName: 'ARC Esports',
    taglineAr: tr.desc,
    taglineEn: tr.desc,
    social: {
      discord: 'https://discord.gg/arcesports',
      tiktok: 'https://tiktok.com/@arcesports',
      youtube: 'https://youtube.com/@arcesports',
      kick: 'https://kick.com/arcesports',
      twitch: 'https://twitch.tv/arcesports',
      email: 'contact@arcesports.com',
    },
    stats: {},
    contactEmail: 'contact@arcesports.com',
  });

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      {/* Partners */}
      <section dir={isRtl ? 'rtl' : 'ltr'} className="relative py-16 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 arc-divider" />
        <div className="relative max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="h-px w-8 bg-[#F7941D]/50" />
              <span className="font-mono text-xs text-[#F7941D] tracking-[0.25em] uppercase">{tr.partners}</span>
              <div className="h-px w-8 bg-[#F7941D]/50" />
            </div>
            <h2 className="font-display font-900 text-4xl text-white uppercase">{tr.partnersSubtitle}</h2>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            {partners.map((p) => (
              <div
                key={p.name}
                className="glass border border-[#0B3C6D]/40 px-8 py-4 hover:border-[#F7941D]/40 transition-all duration-300 group cursor-pointer"
              >
                <div className="font-display font-900 text-lg text-white/40 group-hover:text-white transition-colors tracking-widest uppercase">
                  {p.logo}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer dir={isRtl ? 'rtl' : 'ltr'} className="relative border-t border-[#0B3C6D]/30 pt-14 pb-6">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="relative max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <img src={arcLogo} alt="ARC Esports" className="w-12 h-12 object-contain rounded-full" />
                <div>
                  <div className="font-display font-900 text-xl text-white tracking-wider">ARC</div>
                  <div className="font-display text-xs text-[#F7941D] tracking-[0.2em] uppercase">Esports</div>
                </div>
              </div>
              <p className="font-body text-white/40 text-sm leading-relaxed">{tr.desc}</p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-display font-800 text-sm text-[#F7941D] uppercase tracking-wider mb-4">{tr.quickLinks}</h4>
              <ul className="space-y-2">
                {[
                  ['hero', tr.home], ['about', tr.about], ['games', tr.games], ['teams', tr.teams],
                  ['players', tr.players], ['tournaments', tr.tournaments], ['news', tr.news],
                ].map(([id, label]) => (
                  <li key={id}>
                    <button onClick={() => scrollTo(id)} className="font-body text-sm text-white/40 hover:text-[#F7941D] transition-colors">
                      {label}
                    </button>
                  </li>
                ))}
                <li>
                  <button onClick={onJoin} className="font-body text-sm text-white/40 hover:text-[#F7941D] transition-colors">
                    {tr.join}
                  </button>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-display font-800 text-sm text-[#F7941D] uppercase tracking-wider mb-4">{tr.legal}</h4>
              <ul className="space-y-2">
                <li><a href="#" className="font-body text-sm text-white/40 hover:text-[#F7941D] transition-colors">{tr.privacy}</a></li>
                <li><a href="#" className="font-body text-sm text-white/40 hover:text-[#F7941D] transition-colors">{tr.terms}</a></li>
              </ul>
            </div>

            {/* Social */}
            <div>
              <h4 className="font-display font-800 text-sm text-[#F7941D] uppercase tracking-wider mb-4">{tr.social}</h4>
              <div className="flex flex-wrap gap-2">
                {[
                  { name: 'Discord', icon: 'D', href: site.social?.discord },
                  { name: 'TikTok', icon: 'T', href: site.social?.tiktok },
                  { name: 'YouTube', icon: 'Y', href: site.social?.youtube },
                  { name: 'Kick', icon: 'K', href: site.social?.kick },
                  { name: 'Twitch', icon: 'Tw', href: site.social?.twitch },
                ].map(soc => (
                  <a
                    key={soc.name}
                    href={soc.href || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="w-9 h-9 glass border border-[#0B3C6D]/50 flex items-center justify-center font-mono text-xs text-white/40 hover:text-[#F7941D] hover:border-[#F7941D]/40 transition-all"
                    title={soc.name}
                  >
                    {soc.icon}
                  </a>
                ))}
              </div>
              {site.contactEmail && (
                <a href={`mailto:${site.contactEmail}`} className="block mt-3 font-mono text-xs text-white/40 hover:text-[#F7941D]">
                  {site.contactEmail}
                </a>
              )}
            </div>
          </div>

          <div className="border-t border-[#0B3C6D]/30 pt-6 text-center">
            <p className="font-mono text-xs text-white/20">{tr.copyright}</p>
          </div>
        </div>
      </footer>
    </>
  );
}
