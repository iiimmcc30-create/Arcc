import type { Lang } from '@/data/mockData';

const t = {
  ar: {
    title: 'من نحن',
    subtitle: 'قصة ARC Esports',
    desc: 'ARC Esports منظمة ألعاب إلكترونية احترافية تأسست بهدف بناء بيئة تنافسية متكاملة في العالم العربي. نحن نؤمن بصناعة الأبطال وتطوير المواهب ودعم صناع المحتوى.',
    timeline: [
      { year: '2021', title: 'بداية المجتمع', desc: 'انطلقت رحلة ARC كمجتمع صغير من المحبين للألعاب الإلكترونية.' },
      { year: '2022', title: 'إنشاء الفرق', desc: 'تشكّلت أولى فرق ARC في لعبة PUBG MOBILE وبدأت المشاركة في البطولات.' },
      { year: '2022', title: 'صناعة المحتوى', desc: 'دخلنا عالم صناعة المحتوى مع نخبة من صناع المحتوى المتميزين.' },
      { year: '2023', title: 'البطولات', desc: 'أقمنا أولى بطولاتنا الرسمية وحصدنا ألقاباً إقليمية مرموقة.' },
      { year: '2024', title: 'منظمة احترافية', desc: 'ARC اليوم منظمة احترافية متكاملة تضم فرقاً في 3 ألعاب وعشرات اللاعبين.' },
    ],
  },
  en: {
    title: 'About Us',
    subtitle: 'The ARC Esports Story',
    desc: 'ARC Esports is a professional esports organization founded to build a complete competitive environment in the Arab world. We believe in creating champions, developing talents, and supporting content creators.',
    timeline: [
      { year: '2021', title: 'Community Begins', desc: 'ARC started its journey as a small community of gaming enthusiasts.' },
      { year: '2022', title: 'Team Formation', desc: 'First ARC teams formed in PUBG MOBILE and began participating in tournaments.' },
      { year: '2022', title: 'Content Creation', desc: 'Entered the world of content creation with a selection of outstanding creators.' },
      { year: '2023', title: 'Tournaments', desc: 'Hosted our first official tournaments and won prestigious regional titles.' },
      { year: '2024', title: 'Professional Org', desc: 'ARC is now a full professional organization with teams in 3 games and dozens of players.' },
    ],
  },
};

interface AboutProps { lang: Lang }

export default function AboutSection({ lang }: AboutProps) {
  const isRtl = lang === 'ar';
  const tr = t[lang];

  return (
    <section id="about" dir={isRtl ? 'rtl' : 'ltr'} className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="absolute top-0 left-0 right-0 arc-divider" />

      <div className="relative max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-px w-8 bg-[#F7941D]/50" />
            <span className="font-mono text-xs text-[#F7941D] tracking-[0.25em] uppercase">{tr.title}</span>
            <div className="h-px w-8 bg-[#F7941D]/50" />
          </div>
          <h2 className="font-display font-900 text-5xl md:text-6xl text-white uppercase mb-4">{tr.subtitle}</h2>
          <p className="font-body text-white/60 max-w-2xl mx-auto text-lg leading-relaxed">{tr.desc}</p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Center line */}
          <div className={`absolute ${isRtl ? 'right-1/2' : 'left-1/2'} top-0 bottom-0 w-px timeline-line hidden md:block`} />

          <div className="flex flex-col gap-0">
            {tr.timeline.map((item, i) => {
              const isLeft = i % 2 === 0;
              return (
                <div
                  key={i}
                  className={`relative flex items-center gap-8 md:gap-0 py-6 ${
                    isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                  } ${isRtl && isLeft ? 'md:flex-row-reverse' : isRtl ? 'md:flex-row' : ''}`}
                >
                  {/* Content card */}
                  <div className="md:w-[calc(50%-2rem)] w-full">
                    <div
                      className={`glass arc-card p-6 ${
                        isLeft && !isRtl ? 'md:ml-auto md:mr-8' : !isLeft && !isRtl ? 'md:ml-8' : ''
                      } ${isRtl && isLeft ? 'md:ml-8' : isRtl ? 'md:ml-auto md:mr-8' : ''}`}
                    >
                      <div className="font-mono text-[#F7941D] text-sm font-700 mb-1">{item.year}</div>
                      <h3 className="font-display font-800 text-xl text-white uppercase mb-2">{item.title}</h3>
                      <p className="font-body text-white/60 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>

                  {/* Dot */}
                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#F7941D] border-4 border-[#0D1117] z-10 animate-pulse-orange" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
