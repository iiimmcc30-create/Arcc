import { useState } from 'react';
import type { Lang } from '@/data/mockData';
import { api } from '@/lib/api';

const t = {
  ar: {
    title: 'انضم إلى ARC Esports',
    subtitle: 'كن جزءاً من الأسرة',
    step1: 'نوع الطلب',
    step2: 'البيانات الشخصية',
    step3: 'بيانات اللعب',
    step4: 'الإنجازات',
    step5: 'مراجعة وإرسال',
    typePlayer: 'لاعب',
    typeTeam: 'فريق',
    typeCreator: 'صانع محتوى',
    typePlayerDesc: 'انضم كلاعب محترف في فرق ARC',
    typeTeamDesc: 'سجل فريقك للانضمام إلى المنظمة',
    typeCreatorDesc: 'انضم كصانع محتوى تحت راية ARC',
    next: 'التالي',
    prev: 'السابق',
    submit: 'إرسال الطلب',
    // Personal
    fullName: 'الاسم الكامل',
    age: 'العمر',
    country: 'الدولة',
    discord: 'Discord',
    email: 'البريد الإلكتروني',
    // Game
    game: 'اللعبة',
    accountId: 'ID الحساب',
    uid: 'UID (اختياري)',
    role: 'مركز اللعب',
    rank: 'الرتبة الحالية',
    // Achievements
    achievements: 'الإنجازات والمستوى',
    achievementsPlaceholder: 'أذكر إنجازاتك، بطولاتك السابقة، ومستواك الحالي...',
    profileLink: 'رابط الحساب',
    message: 'رسالة للإدارة (اختياري)',
    // Team
    teamName: 'اسم الفريق',
    captain: 'اسم القائد',
    playerCount: 'عدد اللاعبين',
    // Creator terms
    termsTitle: 'شروط الانضمام كصانع محتوى',
    terms: [
      'يجب أن يكون آخر بث أو فيديو خلال آخر 14 يوماً',
      'احترام المجتمع وعدم نشر محتوى مسيء',
      'جودة فيديو جيدة وميكروفون واضح',
      'نشاط مستمر والتفاعل مع الجمهور',
    ],
    minReq: 'الحد الأدنى للمتابعين',
    minReqs: [
      { platform: 'TikTok', min: '1,000 متابع' },
      { platform: 'YouTube', min: '300 مشترك' },
      { platform: 'Kick', min: '100 متابع' },
      { platform: 'Twitch', min: '100 متابع' },
    ],
    agreeTerms: 'أوافق على الشروط والأحكام',
    // Creator form
    platforms: 'المنصات',
    tiktokFollowers: 'متابعو TikTok',
    youtubeFollowers: 'مشتركو YouTube',
    kickFollowers: 'متابعو Kick',
    twitchFollowers: 'متابعو Twitch',
    avgViews: 'متوسط المشاهدات',
    avgLive: 'متوسط مشاهدي البث',
    bio: 'نبذة عنك',
    // Success
    successTitle: 'تم إرسال طلبك بنجاح! 🎯',
    successMsg: 'سيتم مراجعة طلبك من قبل الإدارة والرد عليك في أقرب وقت.',
    status: 'الحالة الحالية',
    statusVal: 'قيد المراجعة',
    backHome: 'العودة للرئيسية',
    roles: ['IGL', 'Fragger', 'Support', 'Sniper', 'Assaulter', 'Entry Fragger', 'Coach', 'Analyst'],
    games: ['PUBG MOBILE', 'FiveM', 'Rocket League'],
  },
  en: {
    title: 'Join ARC Esports',
    subtitle: 'Become Part of the Family',
    step1: 'Request Type',
    step2: 'Personal Info',
    step3: 'Gaming Details',
    step4: 'Achievements',
    step5: 'Review & Submit',
    typePlayer: 'Player',
    typeTeam: 'Team',
    typeCreator: 'Content Creator',
    typePlayerDesc: 'Join as a pro player in ARC teams',
    typeTeamDesc: 'Register your team to join the organization',
    typeCreatorDesc: 'Join as a content creator under the ARC banner',
    next: 'Next',
    prev: 'Back',
    submit: 'Submit Application',
    fullName: 'Full Name',
    age: 'Age',
    country: 'Country',
    discord: 'Discord',
    email: 'Email Address',
    game: 'Game',
    accountId: 'Account ID',
    uid: 'UID (optional)',
    role: 'Playing Role',
    rank: 'Current Rank',
    achievements: 'Achievements & Level',
    achievementsPlaceholder: 'List your achievements, past tournaments, and current skill level...',
    profileLink: 'Account Link',
    message: 'Message to Management (optional)',
    teamName: 'Team Name',
    captain: 'Captain Name',
    playerCount: 'Number of Players',
    termsTitle: 'Content Creator Terms',
    terms: [
      'Last stream or video must be within the past 14 days',
      'Respect the community and no offensive content',
      'Good video quality and clear microphone',
      'Consistent activity and audience engagement',
    ],
    minReq: 'Minimum Follower Requirements',
    minReqs: [
      { platform: 'TikTok', min: '1,000 followers' },
      { platform: 'YouTube', min: '300 subscribers' },
      { platform: 'Kick', min: '100 followers' },
      { platform: 'Twitch', min: '100 followers' },
    ],
    agreeTerms: 'I agree to the terms and conditions',
    platforms: 'Platforms',
    tiktokFollowers: 'TikTok Followers',
    youtubeFollowers: 'YouTube Subscribers',
    kickFollowers: 'Kick Followers',
    twitchFollowers: 'Twitch Followers',
    avgViews: 'Average Views',
    avgLive: 'Average Live Viewers',
    bio: 'About You',
    successTitle: 'Application Submitted! 🎯',
    successMsg: 'Your application will be reviewed by our management team and we will get back to you soon.',
    status: 'Current Status',
    statusVal: 'Under Review',
    backHome: 'Back to Home',
    roles: ['IGL', 'Fragger', 'Support', 'Sniper', 'Assaulter', 'Entry Fragger', 'Coach', 'Analyst'],
    games: ['PUBG MOBILE', 'FiveM', 'Rocket League'],
  },
};

interface Props { lang: Lang; onBack: () => void; }

type AppType = 'player' | 'team' | 'creator';

export default function JoinWizard({ lang, onBack }: Props) {
  const isRtl = lang === 'ar';
  const tr = t[lang];

  const [appType, setAppType] = useState<AppType | null>(null);
  const [step, setStep] = useState(0);
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [form, setForm] = useState({
    fullName: '', age: '', country: '', discord: '', email: '',
    game: '', accountId: '', uid: '', role: '', rank: '',
    achievements: '', profileLink: '', message: '',
    teamName: '', captain: '', playerCount: '',
    tiktok: '', youtube: '', kick: '', twitch: '',
    tiktokFollowers: '', youtubeFollowers: '', kickFollowers: '', twitchFollowers: '',
    avgViews: '', avgLive: '', bio: '',
  });

  const update = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const totalSteps = appType === 'creator' ? 4 : appType === 'team' ? 4 : 5;
  const progress = appType ? Math.round(((step + 1) / totalSteps) * 100) : 0;

  const handleSubmit = async () => {
    if (!appType || submitting) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const clean = (value: string) => value.trim() || undefined;
      const payload: Record<string, unknown> = {
        type: appType,
        name: clean(appType === 'team' ? form.teamName || form.fullName : form.fullName) || 'Applicant',
        email: clean(form.email),
        discord: clean(form.discord),
        country: clean(form.country),
        age: form.age ? Number(form.age) : undefined,
        game: clean(form.game),
        role: clean(form.role),
        accountId: clean(form.accountId),
        uid: clean(form.uid),
        rank: clean(form.rank),
        achievements: clean(form.achievements),
        profileLink: clean(form.profileLink),
        message: clean(form.message),
        teamName: clean(form.teamName),
        captain: clean(form.captain),
        playerCount: form.playerCount ? Number(form.playerCount) : undefined,
        bio: clean(form.bio),
        avgViews: clean(form.avgViews),
        avgLive: clean(form.avgLive),
        platforms: {
          tiktok: form.tiktokFollowers || '',
          youtube: form.youtubeFollowers || '',
          kick: form.kickFollowers || '',
          twitch: form.twitchFollowers || '',
        },
        social: {
          tiktok: form.tiktok || '',
          youtube: form.youtube || '',
          kick: form.kick || '',
          twitch: form.twitch || '',
        },
        platform: form.tiktok ? 'TikTok' : form.youtube ? 'YouTube' : form.twitch ? 'Twitch' : form.kick ? 'Kick' : undefined,
        followers: clean(form.tiktokFollowers || form.youtubeFollowers || form.twitchFollowers || form.kickFollowers),
      };
      Object.keys(payload).forEach((key) => {
        if (payload[key] === undefined) delete payload[key];
      });
      await api.submitApplication(payload);
      setSubmitted(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Submit failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen flex items-center justify-center px-4 py-24">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-[#F7941D]/20 border-2 border-[#F7941D] rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-orange">
            <svg className="w-12 h-12 text-[#F7941D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="font-display font-900 text-4xl text-white uppercase mb-3">{tr.successTitle}</h2>
          <p className="font-body text-white/60 mb-6">{tr.successMsg}</p>
          <div className="glass border border-[#F7941D]/30 p-4 mb-8 inline-block">
            <div className="font-mono text-xs text-white/40 mb-1">{tr.status}</div>
            <div className="flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#F7941D] animate-pulse" />
              <span className="font-display font-800 text-lg text-[#F7941D] uppercase">{tr.statusVal}</span>
            </div>
          </div>
          <br />
          <button onClick={onBack} className="btn-arc px-8 py-3">{tr.backHome}</button>
        </div>
      </div>
    );
  }

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen py-24 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <button onClick={onBack} className={`flex items-center gap-2 text-white/40 hover:text-white font-mono text-sm mb-6 transition-colors ${isRtl ? 'mr-0 ml-auto' : ''}`}>
            <svg className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {tr.backHome}
          </button>
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-px w-8 bg-[#F7941D]/50" />
            <span className="font-mono text-xs text-[#F7941D] tracking-[0.25em] uppercase">ARC Esports</span>
            <div className="h-px w-8 bg-[#F7941D]/50" />
          </div>
          <h1 className="font-display font-900 text-5xl text-white uppercase">{tr.title}</h1>
          <p className="font-body text-white/50 mt-2">{tr.subtitle}</p>
        </div>

        {/* Progress bar */}
        {appType && (
          <div className="mb-8">
            <div className="h-1 bg-[#0B3C6D]/40 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#0B3C6D] to-[#F7941D] transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between mt-2">
              <span className="font-mono text-xs text-white/30">Step {step + 1} / {totalSteps}</span>
              <span className="font-mono text-xs text-[#F7941D]">{progress}%</span>
            </div>
          </div>
        )}

        {/* Step 0: Type Selection */}
        {!appType && (
          <div className="glass border border-[#0B3C6D]/40 p-8">
            <h2 className="font-display font-900 text-2xl text-white uppercase mb-6 text-center">{tr.step1}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {([
                { type: 'player' as AppType, label: tr.typePlayer, desc: tr.typePlayerDesc, icon: '🎮' },
                { type: 'team' as AppType, label: tr.typeTeam, desc: tr.typeTeamDesc, icon: '🛡️' },
                { type: 'creator' as AppType, label: tr.typeCreator, desc: tr.typeCreatorDesc, icon: '📹' },
              ]).map(opt => (
                <button
                  key={opt.type}
                  onClick={() => { setAppType(opt.type); setStep(0); }}
                  className="arc-card glass border border-[#0B3C6D]/40 hover:border-[#F7941D]/60 p-6 text-center transition-all duration-300 group"
                >
                  <div className="text-4xl mb-3">{opt.icon}</div>
                  <h3 className="font-display font-800 text-xl text-white uppercase mb-2">{opt.label}</h3>
                  <p className="font-body text-white/50 text-sm">{opt.desc}</p>
                  <div className="mt-4 font-mono text-xs text-[#F7941D]/0 group-hover:text-[#F7941D] transition-colors uppercase tracking-wider">
                    {tr.next} →
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Player Form */}
        {appType === 'player' && (
          <div className="glass border border-[#0B3C6D]/40 p-8">
            <h2 className="font-display font-900 text-2xl text-white uppercase mb-6">
              {[tr.step2, tr.step3, tr.step4, tr.step4, tr.step5][step]}
            </h2>

            {step === 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: tr.fullName, key: 'fullName', type: 'text' },
                  { label: tr.age, key: 'age', type: 'number' },
                  { label: tr.country, key: 'country', type: 'text' },
                  { label: tr.discord, key: 'discord', type: 'text' },
                  { label: tr.email, key: 'email', type: 'email' },
                ].map(f => (
                  <div key={f.key} className={f.key === 'email' ? 'md:col-span-2' : ''}>
                    <label className="font-mono text-xs text-white/40 uppercase tracking-wider mb-1.5 block">{f.label}</label>
                    <input
                      type={f.type}
                      value={form[f.key as keyof typeof form]}
                      onChange={e => update(f.key, e.target.value)}
                      className="arc-input"
                      placeholder={f.label}
                    />
                  </div>
                ))}
              </div>
            )}

            {step === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-mono text-xs text-white/40 uppercase tracking-wider mb-1.5 block">{tr.game}</label>
                  <select value={form.game} onChange={e => update('game', e.target.value)} className="arc-select">
                    <option value="">{tr.game}</option>
                    {tr.games.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <label className="font-mono text-xs text-white/40 uppercase tracking-wider mb-1.5 block">{tr.role}</label>
                  <select value={form.role} onChange={e => update('role', e.target.value)} className="arc-select">
                    <option value="">{tr.role}</option>
                    {tr.roles.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="font-mono text-xs text-white/40 uppercase tracking-wider mb-1.5 block">{tr.accountId}</label>
                  <input type="text" value={form.accountId} onChange={e => update('accountId', e.target.value)} className="arc-input" placeholder={tr.accountId} />
                </div>
                <div>
                  <label className="font-mono text-xs text-white/40 uppercase tracking-wider mb-1.5 block">{tr.uid}</label>
                  <input type="text" value={form.uid} onChange={e => update('uid', e.target.value)} className="arc-input" placeholder={tr.uid} />
                </div>
                <div className="md:col-span-2">
                  <label className="font-mono text-xs text-white/40 uppercase tracking-wider mb-1.5 block">{tr.rank}</label>
                  <input type="text" value={form.rank} onChange={e => update('rank', e.target.value)} className="arc-input" placeholder={tr.rank} />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="font-mono text-xs text-white/40 uppercase tracking-wider mb-1.5 block">{tr.achievements}</label>
                  <textarea
                    value={form.achievements}
                    onChange={e => update('achievements', e.target.value)}
                    className="arc-input min-h-[140px] resize-none"
                    placeholder={tr.achievementsPlaceholder}
                  />
                </div>
                <div>
                  <label className="font-mono text-xs text-white/40 uppercase tracking-wider mb-1.5 block">{tr.profileLink}</label>
                  <input type="url" value={form.profileLink} onChange={e => update('profileLink', e.target.value)} className="arc-input" placeholder="https://" />
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <label className="font-mono text-xs text-white/40 uppercase tracking-wider mb-1.5 block">{tr.message}</label>
                <textarea
                  value={form.message}
                  onChange={e => update('message', e.target.value)}
                  className="arc-input min-h-[120px] resize-none"
                  placeholder={tr.message}
                />
                <div className="mt-6 glass border border-[#0B3C6D]/30 p-4">
                  <h4 className="font-display font-700 text-white uppercase mb-3">{lang === 'ar' ? 'ملخص الطلب' : 'Application Summary'}</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {[
                      [lang === 'ar' ? 'الاسم' : 'Name', form.fullName],
                      [lang === 'ar' ? 'اللعبة' : 'Game', form.game],
                      [lang === 'ar' ? 'المركز' : 'Role', form.role],
                      [lang === 'ar' ? 'الرتبة' : 'Rank', form.rank],
                    ].map(([label, val]) => (
                      <div key={label}>
                        <span className="font-mono text-xs text-white/30">{label}: </span>
                        <span className="font-body text-white/70">{val || '—'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {submitError && (
              <div className="mt-4 font-mono text-sm text-red-400 border border-red-400/30 bg-red-400/10 p-3">
                {submitError}
              </div>
            )}
            <WizardNav
              step={step} totalSteps={4} isRtl={isRtl}
              onPrev={() => step === 0 ? setAppType(null) : setStep(s => s - 1)}
              onNext={() => step < 3 ? setStep(s => s + 1) : handleSubmit()}
              prevLabel={step === 0 ? (isRtl ? 'تغيير النوع' : 'Change Type') : tr.prev}
              nextLabel={step === 3 ? (submitting ? '...' : tr.submit) : tr.next}
              disabled={submitting}
            />
          </div>
        )}

        {/* Team Form */}
        {appType === 'team' && (
          <div className="glass border border-[#0B3C6D]/40 p-8">
            <h2 className="font-display font-900 text-2xl text-white uppercase mb-6">
              {[tr.step2, tr.step3, tr.step4, tr.step5][step]}
            </h2>

            {step === 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: tr.teamName, key: 'teamName' },
                  { label: tr.country, key: 'country' },
                  { label: tr.game, key: 'game' },
                  { label: tr.playerCount, key: 'playerCount' },
                  { label: tr.captain, key: 'captain' },
                  { label: tr.discord, key: 'discord' },
                  { label: tr.email, key: 'email' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="font-mono text-xs text-white/40 uppercase tracking-wider mb-1.5 block">{f.label}</label>
                    {f.key === 'game' ? (
                      <select value={form.game} onChange={e => update('game', e.target.value)} className="arc-select">
                        <option value="">{f.label}</option>
                        {tr.games.map(g => <option key={g} value={g}>{g}</option>)}
                      </select>
                    ) : (
                      <input type="text" value={form[f.key as keyof typeof form]} onChange={e => update(f.key, e.target.value)} className="arc-input" placeholder={f.label} />
                    )}
                  </div>
                ))}
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="font-mono text-xs text-white/40 uppercase tracking-wider mb-1.5 block">{lang === 'ar' ? 'إنجازات الفريق' : 'Team Achievements'}</label>
                  <textarea value={form.achievements} onChange={e => update('achievements', e.target.value)} className="arc-input min-h-[120px] resize-none" placeholder="..." />
                </div>
                <div>
                  <label className="font-mono text-xs text-white/40 uppercase tracking-wider mb-1.5 block">{lang === 'ar' ? 'البطولات السابقة' : 'Past Tournaments'}</label>
                  <textarea value={form.uid} onChange={e => update('uid', e.target.value)} className="arc-input min-h-[100px] resize-none" placeholder="..." />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="font-mono text-xs text-white/40 uppercase tracking-wider mb-1.5 block">{lang === 'ar' ? 'روابط الفريق' : 'Team Links'}</label>
                  <input type="url" value={form.profileLink} onChange={e => update('profileLink', e.target.value)} className="arc-input" placeholder="https://" />
                </div>
                <div>
                  <label className="font-mono text-xs text-white/40 uppercase tracking-wider mb-1.5 block">{tr.message}</label>
                  <textarea value={form.message} onChange={e => update('message', e.target.value)} className="arc-input min-h-[100px] resize-none" placeholder={tr.message} />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="glass border border-[#0B3C6D]/30 p-5">
                <h4 className="font-display font-700 text-white uppercase mb-4">{lang === 'ar' ? 'ملخص طلب الفريق' : 'Team Application Summary'}</h4>
                <div className="space-y-2 text-sm">
                  {[
                    [tr.teamName, form.teamName], [tr.game, form.game], [tr.captain, form.captain],
                    [tr.playerCount, form.playerCount], [tr.country, form.country],
                  ].map(([label, val]) => (
                    <div key={label} className="flex justify-between border-b border-[#0B3C6D]/20 pb-2">
                      <span className="font-mono text-xs text-white/30">{label}</span>
                      <span className="font-body text-white/70">{val || '—'}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {submitError && (
              <div className="mt-4 font-mono text-sm text-red-400 border border-red-400/30 bg-red-400/10 p-3">
                {submitError}
              </div>
            )}
            <WizardNav
              step={step} totalSteps={4} isRtl={isRtl}
              onPrev={() => step === 0 ? setAppType(null) : setStep(s => s - 1)}
              onNext={() => step < 3 ? setStep(s => s + 1) : handleSubmit()}
              prevLabel={step === 0 ? (isRtl ? 'تغيير النوع' : 'Change Type') : tr.prev}
              nextLabel={step === 3 ? (submitting ? '...' : tr.submit) : tr.next}
              disabled={submitting}
            />
          </div>
        )}

        {/* Creator Form */}
        {appType === 'creator' && (
          <div className="glass border border-[#0B3C6D]/40 p-8">
            {step === 0 && (
              <>
                <h2 className="font-display font-900 text-2xl text-white uppercase mb-6">{tr.termsTitle}</h2>
                <div className="space-y-3 mb-6">
                  {tr.terms.map((term, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-5 h-5 border border-[#F7941D]/50 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-[#F7941D] text-xs">✓</span>
                      </div>
                      <span className="font-body text-white/70 text-sm">{term}</span>
                    </div>
                  ))}
                </div>

                <div className="glass border border-[#0B3C6D]/30 p-4 mb-6">
                  <div className="font-mono text-xs text-[#F7941D] uppercase tracking-wider mb-3">{tr.minReq}</div>
                  <div className="grid grid-cols-2 gap-3">
                    {tr.minReqs.map(r => (
                      <div key={r.platform} className="flex items-center justify-between">
                        <span className="font-display font-700 text-sm text-white">{r.platform}</span>
                        <span className="font-mono text-xs text-[#F7941D]">{r.min}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <label className="flex items-center gap-3 cursor-pointer group">
                  <div
                    onClick={() => setAgreed(!agreed)}
                    className={`w-5 h-5 border-2 flex items-center justify-center transition-all ${agreed ? 'bg-[#F7941D] border-[#F7941D]' : 'border-[#0B3C6D] group-hover:border-[#F7941D]/50'}`}
                  >
                    {agreed && <svg className="w-3 h-3 text-[#0D1117]" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>}
                  </div>
                  <span className="font-body text-sm text-white/70">{tr.agreeTerms}</span>
                </label>
              </>
            )}

            {step === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <h2 className="font-display font-900 text-2xl text-white uppercase mb-2 md:col-span-2">{tr.step2}</h2>
                {[
                  { label: tr.fullName, key: 'fullName' },
                  { label: tr.age, key: 'age' },
                  { label: tr.country, key: 'country' },
                  { label: tr.discord, key: 'discord' },
                  { label: tr.email, key: 'email' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="font-mono text-xs text-white/40 uppercase tracking-wider mb-1.5 block">{f.label}</label>
                    <input type="text" value={form[f.key as keyof typeof form]} onChange={e => update(f.key, e.target.value)} className="arc-input" placeholder={f.label} />
                  </div>
                ))}
              </div>
            )}

            {step === 2 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <h2 className="font-display font-900 text-2xl text-white uppercase mb-2 md:col-span-2">{tr.platforms}</h2>
                {[
                  { label: 'TikTok URL', key: 'tiktok' }, { label: 'YouTube URL', key: 'youtube' },
                  { label: 'Kick URL', key: 'kick' }, { label: 'Twitch URL', key: 'twitch' },
                  { label: tr.tiktokFollowers, key: 'tiktokFollowers' }, { label: tr.youtubeFollowers, key: 'youtubeFollowers' },
                  { label: tr.kickFollowers, key: 'kickFollowers' }, { label: tr.twitchFollowers, key: 'twitchFollowers' },
                  { label: tr.avgViews, key: 'avgViews' }, { label: tr.avgLive, key: 'avgLive' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="font-mono text-xs text-white/40 uppercase tracking-wider mb-1.5 block">{f.label}</label>
                    <input type="text" value={form[f.key as keyof typeof form]} onChange={e => update(f.key, e.target.value)} className="arc-input" placeholder={f.label} />
                  </div>
                ))}
                <div className="md:col-span-2">
                  <label className="font-mono text-xs text-white/40 uppercase tracking-wider mb-1.5 block">{tr.bio}</label>
                  <textarea value={form.bio} onChange={e => update('bio', e.target.value)} className="arc-input min-h-[100px] resize-none" placeholder={tr.bio} />
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 className="font-display font-900 text-2xl text-white uppercase mb-5">{tr.step5}</h2>
                <div className="glass border border-[#0B3C6D]/30 p-5">
                  <div className="space-y-2 text-sm">
                    {[
                      [tr.fullName, form.fullName], [tr.country, form.country],
                      ['TikTok', form.tiktokFollowers + ' followers'], ['YouTube', form.youtubeFollowers + ' subs'],
                    ].map(([label, val]) => (
                      <div key={label} className="flex justify-between border-b border-[#0B3C6D]/20 pb-2">
                        <span className="font-mono text-xs text-white/30">{label}</span>
                        <span className="font-body text-white/70">{val || '—'}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-4">
                  <label className="font-mono text-xs text-white/40 uppercase tracking-wider mb-1.5 block">{tr.message}</label>
                  <textarea value={form.message} onChange={e => update('message', e.target.value)} className="arc-input min-h-[80px] resize-none" placeholder={tr.message} />
                </div>
              </div>
            )}

            {submitError && (
              <div className="mt-4 font-mono text-sm text-red-400 border border-red-400/30 bg-red-400/10 p-3">
                {submitError}
              </div>
            )}
            <WizardNav
              step={step} totalSteps={4} isRtl={isRtl}
              onPrev={() => step === 0 ? setAppType(null) : setStep(s => s - 1)}
              onNext={() => {
                if (step === 0 && !agreed) return;
                step < 3 ? setStep(s => s + 1) : handleSubmit();
              }}
              prevLabel={step === 0 ? (isRtl ? 'تغيير النوع' : 'Change Type') : tr.prev}
              nextLabel={step === 3 ? (submitting ? '...' : tr.submit) : tr.next}
              disabled={(step === 0 && !agreed) || submitting}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function WizardNav({
  step, totalSteps, isRtl, onPrev, onNext, prevLabel, nextLabel, disabled,
}: {
  step: number; totalSteps: number; isRtl: boolean;
  onPrev: () => void; onNext: () => void;
  prevLabel: string; nextLabel: string; disabled?: boolean;
}) {
  return (
    <div className={`flex justify-between mt-8 ${isRtl ? 'flex-row-reverse' : ''}`}>
      <button onClick={onPrev} className="btn-arc-outline px-6 py-2.5 text-sm">{prevLabel}</button>
      <button onClick={onNext} disabled={disabled} className={`btn-arc px-6 py-2.5 text-sm ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}>{nextLabel}</button>
    </div>
  );
}
