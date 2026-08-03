import React, { useEffect, useState } from "react";
import arcLogo from "@/imports/IMG_7058-1.jpeg";
import type { Lang } from "@/data/mockData";
import {
  api,
  getToken,
  setToken,
  type AdminUser,
  type Application,
  type Creator,
  type DashboardStats,
  type Game,
  type MediaItem,
  type MerchItem,
  type NewsItem,
  type Partner,
  type Player,
  type SiteSettings,
  type Team,
  type Tournament,
} from "@/lib/api";
import { uploadImageFile } from "@/lib/imageUpload";

type Section =
  | "dashboard"
  | "applications"
  | "games"
  | "rosterPlayers"
  | "rosterTeams"
  | "creators"
  | "tournaments"
  | "news"
  | "media"
  | "partners"
  | "merch"
  | "site"
  | "users";

type Status = "pending" | "approved" | "rejected" | "suspended";
type AppTypeFilter = "all" | "player" | "team" | "creator";
type StatusFilter = "all" | Status;

const ARC_COLORS = ["#0B3C6D", "#F7941D", "#0D1117"];

const t = {
  ar: {
    title: "لوحة التحكم",
    back: "الموقع العام",
    dashboard: "الرئيسية",
    applications: "الطلبات",
    games: "الألعاب",
    rosterPlayers: "نجوم ARC",
    rosterTeams: "الفرق",
    creators: "أصوات ARC",
    tournaments: "البطولات",
    news: "الأخبار",
    media: "الوسائط",
    partners: "الشركاء",
    merch: "المتجر",
    site: "إعدادات الموقع",
    users: "المشرفون",
    totalPlayers: "اللاعبون",
    totalTeams: "الفرق",
    totalCreators: "صناع المحتوى",
    totalTournaments: "البطولات",
    newReqs: "طلبات معلقة",
    recentActivity: "آخر الطلبات",
    name: "الاسم",
    game: "اللعبة",
    status: "الحالة",
    date: "التاريخ",
    actions: "الإجراءات",
    approve: "قبول",
    reject: "رفض",
    view: "عرض",
    suspend: "تعليق",
    delete: "حذف",
    captain: "القائد",
    platform: "المنصة",
    followers: "المتابعون",
    role: "المركز",
    country: "الدولة",
    add: "إضافة",
    edit: "تعديل",
    save: "حفظ",
    cancel: "إلغاء",
    loading: "جاري التحميل...",
    empty: "لا توجد بيانات",
    loginTitle: "دخول الإدارة",
    loginSub: "سجّل الدخول لإدارة منظمة ARC",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    login: "تسجيل الدخول",
    logout: "تسجيل الخروج",
    addSupervisor: "إضافة مشرف",
    supervisorName: "اسم المشرف",
    active: "نشط",
    inactive: "موقوف",
    deactivate: "إيقاف",
    activate: "تفعيل",
    type: "النوع",
    all: "الكل",
    player: "لاعب",
    team: "فريق",
    creator: "صانع محتوى",
    pending: "قيد المراجعة",
    approved: "مقبول",
    rejected: "مرفوض",
    suspended: "معلّق",
    adminNotes: "ملاحظات الإدارة",
    clearContent: "مسح كل المحتوى",
    clearConfirm: "هل أنت متأكد؟ سيتم حذف كل المحتوى العام.",
    discord: "ديسكورد",
    age: "العمر",
    accountId: "معرف الحساب",
    uid: "UID",
    rank: "الرتبة",
    achievements: "الإنجازات",
    profileLink: "رابط الملف",
    message: "الرسالة",
    teamName: "اسم الفريق",
    playerCount: "عدد اللاعبين",
    platforms: "المنصات",
    social: "التواصل",
    avgViews: "متوسط المشاهدات",
    avgLive: "متوسط البث المباشر",
    bio: "نبذة",
    createdAt: "تاريخ الإنشاء",
    updatedAt: "آخر تحديث",
    error: "حدث خطأ",
    success: "تم الحفظ",
    confirmDelete: "تأكيد الحذف؟",
    brandName: "اسم العلامة",
    taglineAr: "الشعار (عربي)",
    taglineEn: "الشعار (إنجليزي)",
    contactEmail: "بريد التواصل",
    heroVideoUrl: "رابط فيديو البطل",
    stats: "الإحصائيات",
    price: "السعر",
    category: "التصنيف",
    image: "الصورة",
    uploadImage: "رفع صورة من الجهاز",
    imageUrlHint: "أو الصق رابط صورة",
    imagePreview: "معاينة",
    logo: "الشعار",
    url: "الرابط",
    featured: "مميز",
    available: "متاح",
    colors: "الألوان (مفصولة بفاصلة)",
    sizes: "المقاسات (مفصولة بفاصلة)",
    description: "الوصف",
    descriptionAr: "الوصف (عربي)",
    verified: "موثّق",
    thumbnail: "الصورة المصغرة",
    videoUrl: "رابط الفيديو",
    slug: "المعرّف",
    players: "اللاعبون",
    tournamentsCount: "البطولات",
    desc: "الوصف (عربي)",
    descEn: "الوصف (إنجليزي)",
    flag: "العلم",
    startDate: "تاريخ البدء",
    endDate: "تاريخ الانتهاء",
    prize: "الجائزة",
    summary: "الملخص (عربي)",
    summaryEn: "الملخص (إنجليزي)",
    titleAr: "العنوان (عربي)",
    titleEn: "العنوان (إنجليزي)",
    sortOrder: "الترتيب",
    close: "إغلاق",
  },
  en: {
    title: "Admin Dashboard",
    back: "Public Site",
    dashboard: "Dashboard",
    applications: "Applications",
    games: "Games",
    rosterPlayers: "ARC Stars",
    rosterTeams: "Teams",
    creators: "ARC Voices",
    tournaments: "Tournaments",
    news: "News",
    media: "Media",
    partners: "Partners",
    merch: "Merch Store",
    site: "Site Settings",
    users: "Supervisors",
    totalPlayers: "Players",
    totalTeams: "Teams",
    totalCreators: "Creators",
    totalTournaments: "Tournaments",
    newReqs: "Pending Apps",
    recentActivity: "Recent Applications",
    name: "Name",
    game: "Game",
    status: "Status",
    date: "Date",
    actions: "Actions",
    approve: "Approve",
    reject: "Reject",
    view: "View",
    suspend: "Suspend",
    delete: "Delete",
    captain: "Captain",
    platform: "Platform",
    followers: "Followers",
    role: "Role",
    country: "Country",
    add: "Add",
    edit: "Edit",
    save: "Save",
    cancel: "Cancel",
    loading: "Loading...",
    empty: "No data yet",
    loginTitle: "Admin Login",
    loginSub: "Sign in to manage ARC Esports",
    email: "Email",
    password: "Password",
    login: "Sign In",
    logout: "Logout",
    addSupervisor: "Add Supervisor",
    supervisorName: "Supervisor name",
    active: "Active",
    inactive: "Inactive",
    deactivate: "Deactivate",
    activate: "Activate",
    type: "Type",
    all: "All",
    player: "Player",
    team: "Team",
    creator: "Creator",
    pending: "Pending",
    approved: "Approved",
    rejected: "Rejected",
    suspended: "Suspended",
    adminNotes: "Admin Notes",
    clearContent: "Clear All Content",
    clearConfirm: "Are you sure? This will delete all public content.",
    discord: "Discord",
    age: "Age",
    accountId: "Account ID",
    uid: "UID",
    rank: "Rank",
    achievements: "Achievements",
    profileLink: "Profile Link",
    message: "Message",
    teamName: "Team Name",
    playerCount: "Player Count",
    platforms: "Platforms",
    social: "Social",
    avgViews: "Avg Views",
    avgLive: "Avg Live",
    bio: "Bio",
    createdAt: "Created",
    updatedAt: "Updated",
    error: "An error occurred",
    success: "Saved successfully",
    confirmDelete: "Confirm delete?",
    brandName: "Brand Name",
    taglineAr: "Tagline (AR)",
    taglineEn: "Tagline (EN)",
    contactEmail: "Contact Email",
    heroVideoUrl: "Hero Video URL",
    stats: "Stats",
    price: "Price",
    category: "Category",
    image: "Image",
    uploadImage: "Upload image from device",
    imageUrlHint: "Or paste an image URL",
    imagePreview: "Preview",
    logo: "Logo",
    url: "URL",
    featured: "Featured",
    available: "Available",
    colors: "Colors (comma-separated)",
    sizes: "Sizes (comma-separated)",
    description: "Description",
    descriptionAr: "Description (AR)",
    verified: "Verified",
    thumbnail: "Thumbnail",
    videoUrl: "Video URL",
    slug: "Slug",
    players: "Players",
    tournamentsCount: "Tournaments",
    desc: "Description (AR)",
    descEn: "Description (EN)",
    flag: "Flag",
    startDate: "Start Date",
    endDate: "End Date",
    prize: "Prize",
    summary: "Summary (AR)",
    summaryEn: "Summary (EN)",
    titleAr: "Title (AR)",
    titleEn: "Title (EN)",
    sortOrder: "Sort Order",
    close: "Close",
  },
};

interface Props {
  lang: Lang;
  onBack: () => void;
}

function splitCsv(s: string): string[] {
  return s
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
}

function joinCsv(arr?: string[]): string {
  return (arr || []).join(", ");
}

function parseKeyVal(s: string): Record<string, string> {
  const out: Record<string, string> = {};
  s.split(",").forEach((pair) => {
    const [k, ...rest] = pair.split(":");
    if (k && rest.length) out[k.trim()] = rest.join(":").trim();
  });
  return out;
}

function formatKeyVal(obj?: Record<string, string>): string {
  if (!obj) return "";
  return Object.entries(obj)
    .map(([k, v]) => `${k}: ${v}`)
    .join(", ");
}

export default function AdminDashboard({ lang, onBack }: Props) {
  const isRtl = lang === "ar";
  const tr = t[lang];

  const [section, setSection] = useState<Section>("dashboard");
  const [user, setUser] = useState<AdminUser | null>(null);
  const [authChecking, setAuthChecking] = useState(true);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);
  const [toast, setToast] = useState<{ type: "error" | "success"; msg: string } | null>(null);

  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [apps, setApps] = useState<Application[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [rosterPlayers, setRosterPlayers] = useState<Player[]>([]);
  const [rosterTeams, setRosterTeams] = useState<Team[]>([]);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [merch, setMerch] = useState<MerchItem[]>([]);
  const [site, setSite] = useState<SiteSettings | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);

  const [appTypeFilter, setAppTypeFilter] = useState<AppTypeFilter>("all");
  const [appStatusFilter, setAppStatusFilter] = useState<StatusFilter>("all");
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [appNotes, setAppNotes] = useState("");

  const [modal, setModal] = useState<{
    kind: Section | "none";
    mode: "add" | "edit";
    form: Record<string, unknown>;
    id?: number;
  } | null>(null);
  const [saving, setSaving] = useState(false);

  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "supervisor" });

  const showError = (err: unknown) => {
    const msg = err instanceof Error ? err.message : tr.error;
    setToast({ type: "error", msg });
    if (/401|Unauthorized/i.test(msg)) {
      setToken(null);
      setUser(null);
    }
  };

  const showSuccess = (msg?: string) => setToast({ type: "success", msg: msg || tr.success });

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setAuthChecking(false);
      return;
    }
    api
      .me()
      .then((u) => setUser(u))
      .catch(() => setToken(null))
      .finally(() => setAuthChecking(false));
  }, []);

  const load = async () => {
    if (!getToken()) return;
    setLoading(true);
    try {
      const [
        dashboard,
        applications,
        gamesData,
        playersData,
        teamsData,
        creatorsData,
        tournamentsData,
        newsData,
        mediaData,
        partnersData,
        merchData,
        siteData,
        usersData,
      ] = await Promise.all([
        api.dashboard(),
        api.applications(),
        api.games(),
        api.players(),
        api.teams(),
        api.creators(),
        api.tournaments(),
        api.news(),
        api.media(),
        api.partners(),
        api.merchAll(),
        api.site(),
        api.users(),
      ]);
      setStats(dashboard);
      setApps(applications);
      setGames(gamesData);
      setRosterPlayers(playersData);
      setRosterTeams(teamsData);
      setCreators(creatorsData);
      setTournaments(tournamentsData);
      setNews(newsData);
      setMedia(mediaData);
      setPartners(partnersData);
      setMerch(merchData);
      setSite(siteData);
      setUsers(usersData);
    } catch (err) {
      showError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && getToken()) load();
  }, [user]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    setLoginError(null);
    try {
      const result = await api.login(loginEmail.trim(), loginPassword);
      setToken(result.accessToken);
      setUser(result.user);
    } catch {
      setLoginError(isRtl ? "بيانات الدخول غير صحيحة" : "Invalid credentials");
    } finally {
      setLoggingIn(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setStats(null);
    setApps([]);
    setUsers([]);
  };

  const updateAppStatus = async (id: number, status: Status) => {
    try {
      await api.updateApplicationStatus(id, status, appNotes || undefined);
      setSelectedApp(null);
      setAppNotes("");
      await load();
      showSuccess();
    } catch (err) {
      showError(err);
    }
  };

  const deleteApp = async (id: number) => {
    if (!window.confirm(tr.confirmDelete)) return;
    try {
      await api.deleteApplication(id);
      setSelectedApp(null);
      await load();
      showSuccess();
    } catch (err) {
      showError(err);
    }
  };

  const saveAppNotes = async () => {
    if (!selectedApp) return;
    try {
      await api.updateApplication(selectedApp.id, { adminNotes: appNotes });
      await load();
      showSuccess();
    } catch (err) {
      showError(err);
    }
  };

  const handleClearContent = async () => {
    if (!window.confirm(tr.clearConfirm)) return;
    try {
      await api.clearContent();
      await load();
      showSuccess();
    } catch (err) {
      showError(err);
    }
  };

  const openModal = (kind: Section, mode: "add" | "edit", form: Record<string, unknown>, id?: number) => {
    setModal({ kind, mode, form, id });
  };

  const closeModal = () => setModal(null);

  const setField = (key: string, value: unknown) => {
    setModal((m) => (m ? { ...m, form: { ...m.form, [key]: value } } : m));
  };

  const handleModalSave = async () => {
    if (!modal) return;
    setSaving(true);
    try {
      const f = modal.form;
      switch (modal.kind) {
        case "games":
          if (modal.mode === "add") await api.createGame(f as Partial<Game>);
          else await api.updateGame(modal.id!, f as Partial<Game>);
          break;
        case "rosterPlayers": {
          const payload = {
            ...f,
            achievements: splitCsv(String(f.achievementsCsv || "")),
            achievementsEn: splitCsv(String(f.achievementsEnCsv || "")),
            social: parseKeyVal(String(f.socialCsv || "")),
          };
          delete (payload as Record<string, unknown>).achievementsCsv;
          delete (payload as Record<string, unknown>).achievementsEnCsv;
          delete (payload as Record<string, unknown>).socialCsv;
          if (modal.mode === "add") await api.createPlayer(payload as Partial<Player>);
          else await api.updatePlayer(modal.id!, payload as Partial<Player>);
          break;
        }
        case "rosterTeams": {
          const payload = {
            ...f,
            achievements: splitCsv(String(f.achievementsCsv || "")),
            achievementsEn: splitCsv(String(f.achievementsEnCsv || "")),
            tournaments: splitCsv(String(f.tournamentsCsv || "")),
          };
          delete (payload as Record<string, unknown>).achievementsCsv;
          delete (payload as Record<string, unknown>).achievementsEnCsv;
          delete (payload as Record<string, unknown>).tournamentsCsv;
          if (modal.mode === "add") await api.createTeam(payload as Partial<Team>);
          else await api.updateTeam(modal.id!, payload as Partial<Team>);
          break;
        }
        case "creators": {
          const payload = {
            ...f,
            platforms: parseKeyVal(String(f.platformsCsv || "")),
            social: parseKeyVal(String(f.socialCsv || "")),
            verified: Boolean(f.verified),
          };
          delete (payload as Record<string, unknown>).platformsCsv;
          delete (payload as Record<string, unknown>).socialCsv;
          if (modal.mode === "add") await api.createCreator(payload as Partial<Creator>);
          else await api.updateCreator(modal.id!, payload as Partial<Creator>);
          break;
        }
        case "tournaments":
          if (modal.mode === "add") await api.createTournament(f as Partial<Tournament>);
          else await api.updateTournament(modal.id!, f as Partial<Tournament>);
          break;
        case "news":
          if (modal.mode === "add") await api.createNews(f as Partial<NewsItem>);
          else await api.updateNews(modal.id!, f as Partial<NewsItem>);
          break;
        case "media":
          if (modal.mode === "add") await api.createMedia(f as Partial<MediaItem>);
          else await api.updateMedia(modal.id!, f as Partial<MediaItem>);
          break;
        case "partners":
          if (modal.mode === "add") await api.createPartner(f as Partial<Partner>);
          else await api.updatePartner(modal.id!, f as Partial<Partner>);
          break;
        case "merch": {
          const payload = {
            ...f,
            colors: splitCsv(String(f.colorsCsv || "")),
            sizes: splitCsv(String(f.sizesCsv || "")),
            featured: Boolean(f.featured),
            available: Boolean(f.available),
            sortOrder: Number(f.sortOrder) || 0,
          };
          delete (payload as Record<string, unknown>).colorsCsv;
          delete (payload as Record<string, unknown>).sizesCsv;
          if (modal.mode === "add") await api.createMerch(payload as Partial<MerchItem>);
          else await api.updateMerch(modal.id!, payload as Partial<MerchItem>);
          break;
        }
      }
      closeModal();
      await load();
      showSuccess();
    } catch (err) {
      showError(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (kind: Section, id: number) => {
    if (!window.confirm(tr.confirmDelete)) return;
    try {
      switch (kind) {
        case "games":
          await api.deleteGame(id);
          break;
        case "rosterPlayers":
          await api.deletePlayer(id);
          break;
        case "rosterTeams":
          await api.deleteTeam(id);
          break;
        case "creators":
          await api.deleteCreator(id);
          break;
        case "tournaments":
          await api.deleteTournament(id);
          break;
        case "news":
          await api.deleteNews(id);
          break;
        case "media":
          await api.deleteMedia(id);
          break;
        case "partners":
          await api.deletePartner(id);
          break;
        case "merch":
          await api.deleteMerch(id);
          break;
      }
      await load();
      showSuccess();
    } catch (err) {
      showError(err);
    }
  };

  const saveSite = async () => {
    if (!site) return;
    try {
      const updated = await api.updateSite(site);
      setSite(updated);
      showSuccess();
    } catch (err) {
      showError(err);
    }
  };

  const statusBadge = (status: Status) => {
    const map: Record<Status, string> = {
      pending: "badge-pending",
      approved: "badge-active",
      rejected: "badge-rejected",
      suspended: "badge-pending",
    };
    const label: Record<Status, string> = {
      pending: tr.pending,
      approved: tr.approved,
      rejected: tr.rejected,
      suspended: tr.suspended,
    };
    return <span className={`font-mono text-xs px-2 py-0.5 ${map[status]}`}>{label[status]}</span>;
  };

  const filteredApps = apps.filter((a) => {
    if (appTypeFilter !== "all" && a.type !== appTypeFilter) return false;
    if (appStatusFilter !== "all" && a.status !== appStatusFilter) return false;
    return true;
  });

  const isAdmin = user?.role === "admin";

  const allNavItems: { id: Section; label: string; icon: string; adminOnly?: boolean }[] = [
    { id: "dashboard", label: tr.dashboard, icon: "📊" },
    { id: "applications", label: tr.applications, icon: "📋" },
    { id: "games", label: tr.games, icon: "🎯" },
    { id: "rosterPlayers", label: tr.rosterPlayers, icon: "🎮" },
    { id: "rosterTeams", label: tr.rosterTeams, icon: "🛡️" },
    { id: "creators", label: tr.creators, icon: "📹" },
    { id: "tournaments", label: tr.tournaments, icon: "🏆" },
    { id: "news", label: tr.news, icon: "📰" },
    { id: "media", label: tr.media, icon: "🎬" },
    { id: "partners", label: tr.partners, icon: "🤝" },
    { id: "merch", label: tr.merch, icon: "👕" },
    { id: "site", label: tr.site, icon: "⚙️" },
    { id: "users", label: tr.users, icon: "👥", adminOnly: true },
  ];
  const navItems = allNavItems.filter((item) => !item.adminOnly || isAdmin);

  if (authChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0D1117] text-white/50 font-mono">
        {tr.loading}
      </div>
    );
  }

  if (!user) {
    return (
      <div
        dir={isRtl ? "rtl" : "ltr"}
        className="min-h-screen flex items-center justify-center bg-[#0D1117] px-4 relative overflow-hidden"
      >
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="absolute top-1/4 left-1/3 w-72 h-72 rounded-full bg-[#0B3C6D]/30 blur-[120px]" />
        <form
          onSubmit={handleLogin}
          className="relative glass-dark border border-[#0B3C6D]/50 p-8 w-full max-w-md"
        >
          <div className="text-center mb-8">
            <img
              src={arcLogo}
              alt="ARC"
              className="w-16 h-16 mx-auto mb-4 object-contain rounded-full border border-[#F7941D]/40"
            />
            <h1 className="font-display font-900 text-3xl text-white uppercase">{tr.loginTitle}</h1>
            <p className="font-body text-white/40 text-sm mt-2">{tr.loginSub}</p>
          </div>
          <div className="space-y-4">
            <div>
              <label className="font-mono text-xs text-white/40 uppercase mb-1.5 block">{tr.email}</label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="arc-input"
              />
            </div>
            <div>
              <label className="font-mono text-xs text-white/40 uppercase mb-1.5 block">{tr.password}</label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="arc-input"
              />
            </div>
            {loginError && (
              <div className="font-mono text-sm text-red-400 border border-red-400/30 bg-red-400/10 p-3">
                {loginError}
              </div>
            )}
            <button type="submit" disabled={loggingIn} className="btn-arc w-full py-3">
              {loggingIn ? "..." : tr.login}
            </button>
            <button type="button" onClick={onBack} className="w-full font-mono text-xs text-white/30 hover:text-white mt-2">
              {tr.back}
            </button>
          </div>
        </form>
      </div>
    );
  }

  const renderEmpty = () => (
    <div className="glass border border-[#0B3C6D]/40 p-12 text-center">
      <p className="font-mono text-sm text-white/30">{tr.empty}</p>
    </div>
  );

  const renderTableActions = (kind: Section, id: number, onEdit: () => void) => (
    <div className="flex items-center gap-2">
      <button
        onClick={onEdit}
        className="font-mono text-xs text-[#F7941D] border border-[#F7941D]/30 px-2.5 py-1 hover:bg-[#F7941D]/10"
      >
        {tr.edit}
      </button>
      <button
        onClick={() => handleDelete(kind, id)}
        className="font-mono text-xs text-red-400 border border-red-400/30 px-2.5 py-1 hover:bg-red-400/10"
      >
        {tr.delete}
      </button>
    </div>
  );

  const renderImageField = (label: string, key: string) => {
    if (!modal) return null;
    const val = String(modal.form[key] ?? "");
    return (
      <div key={key} className="space-y-2">
        <label className="font-mono text-xs text-white/40 uppercase mb-1.5 block">{label}</label>
        {val ? (
          <div className="relative w-full max-w-[220px] aspect-square overflow-hidden border border-[#0B3C6D]/50 bg-[#0B3C6D]/10">
            <img src={val} alt={tr.imagePreview} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="w-full max-w-[220px] aspect-square border border-dashed border-[#0B3C6D]/50 flex items-center justify-center font-mono text-[10px] text-white/30 uppercase">
            {tr.imagePreview}
          </div>
        )}
        <label className="inline-flex items-center gap-2 cursor-pointer font-mono text-xs text-[#F7941D] border border-[#F7941D]/40 px-3 py-2 hover:bg-[#F7941D]/10">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              try {
                setToast({
                  type: "success",
                  msg: isRtl ? "جاري رفع الصورة..." : "Uploading image...",
                });
                const url = await uploadImageFile(file);
                setField(key, url);
                showSuccess(isRtl ? "تم رفع الصورة بنجاح" : "Image uploaded successfully");
              } catch (err) {
                let msg = err instanceof Error ? err.message : "Upload failed";
                try {
                  const parsed = JSON.parse(msg);
                  if (parsed?.message) msg = Array.isArray(parsed.message) ? parsed.message.join(", ") : parsed.message;
                } catch {
                  /* keep raw */
                }
                setToast({ type: "error", msg });
              } finally {
                e.target.value = "";
              }
            }}
          />
          {tr.uploadImage}
        </label>
        <input
          type="text"
          className="arc-input"
          placeholder={tr.imageUrlHint}
          value={val.startsWith("data:") ? "" : val}
          onChange={(e) => setField(key, e.target.value)}
        />
      </div>
    );
  };

  const renderFormField = (
    label: string,
    key: string,
    type: "text" | "number" | "textarea" | "select" | "checkbox" = "text",
    options?: { value: string; label: string }[],
  ) => {
    if (!modal) return null;
    const val = modal.form[key];
    if (type === "textarea") {
      return (
        <div key={key}>
          <label className="font-mono text-xs text-white/40 uppercase mb-1.5 block">{label}</label>
          <textarea
            className="arc-input min-h-[80px]"
            value={String(val ?? "")}
            onChange={(e) => setField(key, e.target.value)}
          />
        </div>
      );
    }
    if (type === "select" && options) {
      return (
        <div key={key}>
          <label className="font-mono text-xs text-white/40 uppercase mb-1.5 block">{label}</label>
          <select className="arc-select" value={String(val ?? "")} onChange={(e) => setField(key, e.target.value)}>
            {options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      );
    }
    if (type === "checkbox") {
      return (
        <label key={key} className="flex items-center gap-2 font-body text-sm text-white/70 cursor-pointer">
          <input type="checkbox" checked={Boolean(val)} onChange={(e) => setField(key, e.target.checked)} />
          {label}
        </label>
      );
    }
    return (
      <div key={key}>
        <label className="font-mono text-xs text-white/40 uppercase mb-1.5 block">{label}</label>
        <input
          type={type}
          className="arc-input"
          value={val === undefined || val === null ? "" : String(val)}
          onChange={(e) => setField(key, type === "number" ? Number(e.target.value) : e.target.value)}
        />
      </div>
    );
  };

  const renderModalForm = () => {
    if (!modal) return null;
    const fields: React.ReactNode[] = [];
    switch (modal.kind) {
      case "games":
        fields.push(
          renderFormField(tr.slug, "slug"),
          renderFormField(tr.name, "name"),
          renderFormField(tr.titleAr, "nameAr"),
          renderFormField(tr.image, "image"),
          renderFormField(tr.players, "players", "number"),
          renderFormField(tr.tournamentsCount, "tournaments", "number"),
          renderFormField(tr.desc, "desc", "textarea"),
          renderFormField(tr.descEn, "descEn", "textarea"),
        );
        break;
      case "rosterPlayers":
        fields.push(
          renderImageField(tr.image, "image"),
          renderFormField(tr.name, "name"),
          renderFormField(tr.game, "game"),
          renderFormField("Team ID", "teamId", "number"),
          renderFormField(tr.country, "country"),
          renderFormField(tr.country + " EN", "countryEn"),
          renderFormField(tr.flag, "flag"),
          renderFormField(tr.role, "role"),
          renderFormField(tr.rank, "rank"),
          renderFormField(tr.achievements + " AR", "achievementsCsv"),
          renderFormField(tr.achievements + " EN", "achievementsEnCsv"),
          renderFormField(tr.social + " (twitter/instagram: url)", "socialCsv"),
        );
        break;
      case "rosterTeams":
        fields.push(
          renderImageField(tr.logo, "logo"),
          renderFormField(tr.name, "name"),
          renderFormField(tr.game, "game"),
          renderFormField("Game ID", "gameId", "number"),
          renderFormField(tr.players, "players", "number"),
          renderFormField(tr.captain, "captain"),
          renderFormField(tr.achievements + " AR", "achievementsCsv"),
          renderFormField(tr.achievements + " EN", "achievementsEnCsv"),
          renderFormField(tr.tournaments, "tournamentsCsv"),
        );
        break;
      case "creators":
        fields.push(
          renderImageField(tr.image, "image"),
          renderFormField(tr.name, "name"),
          renderFormField(tr.titleAr, "nameAr"),
          renderFormField(tr.bio, "bio", "textarea"),
          renderFormField(tr.bio + " EN", "bioEn", "textarea"),
          renderFormField(tr.verified, "verified", "checkbox"),
          renderFormField(tr.platforms + " (tiktok/youtube: count)", "platformsCsv"),
          renderFormField(tr.social + " (tiktok/youtube: url)", "socialCsv"),
        );
        break;
      case "tournaments":
        fields.push(
          renderFormField(tr.name, "name"),
          renderFormField(tr.titleAr, "nameAr"),
          renderFormField(tr.status, "status", "select", [
            { value: "upcoming", label: "Upcoming" },
            { value: "active", label: "Active" },
            { value: "past", label: "Past" },
          ]),
          renderFormField(tr.image, "image"),
          renderFormField(tr.game, "game"),
          renderFormField(tr.startDate, "startDate"),
          renderFormField(tr.endDate, "endDate"),
          renderFormField(tr.prize, "prize"),
          renderFormField(tr.players, "teams", "number"),
        );
        break;
      case "news":
        fields.push(
          renderFormField(tr.titleAr, "title"),
          renderFormField(tr.titleEn, "titleEn"),
          renderFormField(tr.summary, "summary", "textarea"),
          renderFormField(tr.summaryEn, "summaryEn", "textarea"),
          renderFormField(tr.date, "date"),
          renderFormField(tr.category, "category"),
          renderFormField(tr.category + " EN", "categoryEn"),
          renderFormField(tr.image, "image"),
        );
        break;
      case "media":
        fields.push(
          renderFormField(tr.titleAr, "titleAr"),
          renderFormField(tr.name, "title"),
          renderFormField(tr.thumbnail, "thumbnail"),
          renderFormField(tr.videoUrl, "videoUrl"),
          renderFormField(tr.category, "category"),
          renderFormField(tr.creators, "creator"),
        );
        break;
      case "partners":
        fields.push(
          renderFormField(tr.name, "name"),
          renderFormField(tr.logo, "logo"),
          renderFormField(tr.url, "url"),
        );
        break;
      case "merch":
        fields.push(
          renderFormField(tr.name, "name"),
          renderFormField(tr.titleAr, "nameAr"),
          renderFormField(tr.description, "description", "textarea"),
          renderFormField(tr.descriptionAr, "descriptionAr", "textarea"),
          renderFormField(tr.category, "category", "select", [
            { value: "jersey", label: "Jersey" },
            { value: "hoodie", label: "Hoodie" },
            { value: "cap", label: "Cap" },
            { value: "accessory", label: "Accessory" },
          ]),
          renderFormField(tr.price, "price"),
          renderFormField(tr.image, "image"),
          renderFormField(tr.colors, "colorsCsv"),
          renderFormField(tr.sizes, "sizesCsv"),
          renderFormField(tr.featured, "featured", "checkbox"),
          renderFormField(tr.available, "available", "checkbox"),
          renderFormField(tr.sortOrder, "sortOrder", "number"),
        );
        break;
    }
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pe-2">
        {fields}
      </div>
    );
  };

  const openAppDetail = (app: Application) => {
    setSelectedApp(app);
    setAppNotes(app.adminNotes || "");
  };

  const detailRow = (label: string, value: unknown) => (
    <div className="flex gap-2 py-1.5 border-b border-[#0B3C6D]/20">
      <span className="font-mono text-xs text-white/40 w-36 flex-shrink-0">{label}</span>
      <span className="font-body text-sm text-white/80 break-all">{value ? String(value) : "—"}</span>
    </div>
  );

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="min-h-screen flex bg-[#0D1117]">
      {/* Sidebar */}
      <div className="w-60 flex-shrink-0 glass-dark border-e border-[#0B3C6D]/40 flex flex-col">
        <div className="p-5 border-b border-[#0B3C6D]/30 flex items-center gap-3">
          <img src={arcLogo} alt="ARC" className="w-10 h-10 object-contain rounded-full" />
          <div>
            <div className="font-display font-900 text-white text-base tracking-wider">ARC</div>
            <div className="font-mono text-[10px] text-[#F7941D] uppercase tracking-widest">{tr.title}</div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setSection(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-body transition-all rounded-sm ${
                section === item.id
                  ? "bg-[#F7941D]/15 text-[#F7941D] border-s-2 border-[#F7941D]"
                  : "text-white/40 hover:text-white hover:bg-white/5"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-[#0B3C6D]/30 space-y-1">
          <div className="px-4 py-2 font-mono text-[10px] text-white/30 truncate">{user.email}</div>
          <button onClick={logout} className="w-full px-4 py-2 text-sm text-red-400/70 hover:text-red-400 text-start">
            {tr.logout}
          </button>
          <button onClick={onBack} className="w-full px-4 py-2.5 text-sm text-white/30 hover:text-white text-start">
            {tr.back}
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 overflow-y-auto relative">
        {toast && (
          <div
            className={`fixed top-4 ${isRtl ? "left-4" : "right-4"} z-[60] font-mono text-sm px-4 py-3 border ${
              toast.type === "error"
                ? "text-red-400 border-red-400/30 bg-red-400/10"
                : "text-green-400 border-green-400/30 bg-green-400/10"
            }`}
          >
            {toast.msg}
          </div>
        )}

        <div className="glass-dark border-b border-[#0B3C6D]/30 px-8 py-4 flex items-center justify-between">
          <h1 className="font-display font-800 text-xl text-white uppercase">
            {navItems.find((n) => n.id === section)?.label}
          </h1>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="font-mono text-xs text-white/40">
              {loading ? tr.loading : `${user.name} · ${user.role}`}
            </span>
          </div>
        </div>

        <div className="p-8">
          {/* Dashboard */}
          {section === "dashboard" && (
            <div>
              {loading && !stats ? (
                <p className="font-mono text-white/30">{tr.loading}</p>
              ) : stats ? (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                      { label: tr.totalPlayers, value: stats.players, icon: "🎮", color: "text-[#4A90D9]" },
                      { label: tr.totalTeams, value: stats.teams, icon: "🛡️", color: "text-[#F7941D]" },
                      { label: tr.totalCreators, value: stats.creators, icon: "📹", color: "text-[#F7941D]" },
                      { label: tr.newReqs, value: stats.applications.pending, icon: "🔔", color: "text-yellow-400" },
                    ].map((stat, i) => (
                      <div key={i} className="glass border border-[#0B3C6D]/40 p-5 arc-card">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-2xl">{stat.icon}</span>
                          <div className={`font-display font-900 text-3xl ${stat.color}`}>{stat.value}</div>
                        </div>
                        <div className="font-mono text-xs text-white/40 uppercase tracking-wider">{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  <div className="glass border border-[#0B3C6D]/40 overflow-hidden mb-6">
                    <div className="px-5 py-4 border-b border-[#0B3C6D]/30">
                      <h3 className="font-display font-800 text-base text-white uppercase">{tr.recentActivity}</h3>
                    </div>
                    {stats.recent.length === 0 ? (
                      <div className="p-8 text-center font-mono text-sm text-white/30">{tr.empty}</div>
                    ) : (
                      <div className="divide-y divide-[#0B3C6D]/20">
                        {stats.recent.map((item) => (
                          <div key={item.id} className="px-5 py-3 flex items-center justify-between">
                            <div>
                              <div className="font-body text-sm text-white">{item.name}</div>
                              <div className="font-mono text-xs text-white/30">
                                {item.type} · {item.game || item.platform || "—"}
                              </div>
                            </div>
                            {statusBadge(item.status as Status)}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {isAdmin && (
                    <button
                      onClick={handleClearContent}
                      className="font-mono text-xs text-red-400 border border-red-400/40 px-4 py-2 hover:bg-red-400/10"
                    >
                      {tr.clearContent}
                    </button>
                  )}
                </>
              ) : (
                renderEmpty()
              )}
            </div>
          )}

          {/* Applications */}
          {section === "applications" && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-3">
                <select
                  className="arc-select w-auto"
                  value={appTypeFilter}
                  onChange={(e) => setAppTypeFilter(e.target.value as AppTypeFilter)}
                >
                  <option value="all">{tr.all}</option>
                  <option value="player">{tr.player}</option>
                  <option value="team">{tr.team}</option>
                  <option value="creator">{tr.creator}</option>
                </select>
                <select
                  className="arc-select w-auto"
                  value={appStatusFilter}
                  onChange={(e) => setAppStatusFilter(e.target.value as StatusFilter)}
                >
                  <option value="all">{tr.all}</option>
                  <option value="pending">{tr.pending}</option>
                  <option value="approved">{tr.approved}</option>
                  <option value="rejected">{tr.rejected}</option>
                  <option value="suspended">{tr.suspended}</option>
                </select>
              </div>

              {loading ? (
                <p className="font-mono text-white/30">{tr.loading}</p>
              ) : filteredApps.length === 0 ? (
                renderEmpty()
              ) : (
                <div className="glass border border-[#0B3C6D]/40 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-[#0B3C6D]/30 bg-[#0B3C6D]/10">
                          {[tr.name, tr.type, tr.game, tr.status, tr.date, tr.actions].map((label) => (
                            <th
                              key={label}
                              className="px-4 py-3 font-mono text-xs text-white/40 uppercase tracking-wider text-start"
                            >
                              {label}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#0B3C6D]/20">
                        {filteredApps.map((app) => (
                          <tr key={app.id} className="hover:bg-[#0B3C6D]/10">
                            <td className="px-4 py-3 text-sm text-white/70">{app.name}</td>
                            <td className="px-4 py-3 text-sm text-white/50 font-mono">{app.type}</td>
                            <td className="px-4 py-3 text-sm text-white/70">{app.game || app.platform || "—"}</td>
                            <td className="px-4 py-3">{statusBadge(app.status as Status)}</td>
                            <td className="px-4 py-3 text-sm text-white/50 font-mono">
                              {app.createdAt?.slice(0, 10) || "—"}
                            </td>
                            <td className="px-4 py-3">
                              <button
                                onClick={() => openAppDetail(app)}
                                className="font-mono text-xs text-[#F7941D] border border-[#F7941D]/30 px-2.5 py-1"
                              >
                                {tr.view}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Games */}
          {section === "games" && (
            <ContentSection
              loading={loading}
              empty={games.length === 0}
              tr={tr}
              onAdd={() =>
                openModal("games", "add", {
                  slug: "",
                  name: "",
                  nameAr: "",
                  image: "",
                  players: 0,
                  tournaments: 0,
                  desc: "",
                  descEn: "",
                })
              }
            >
              <DataTable
                headers={[tr.name, tr.game, tr.players, tr.actions]}
                rows={games.map((g) => [
                  lang === "ar" ? g.nameAr : g.name,
                  g.slug,
                  String(g.players),
                  renderTableActions("games", g.id, () =>
                    openModal("games", "edit", { ...g }, g.id),
                  ),
                ])}
              />
            </ContentSection>
          )}

          {/* Roster Players */}
          {section === "rosterPlayers" && (
            <ContentSection
              loading={loading}
              empty={rosterPlayers.length === 0}
              tr={tr}
              onAdd={() =>
                openModal("rosterPlayers", "add", {
                  name: "",
                  game: "",
                  teamId: null,
                  country: "",
                  countryEn: "",
                  flag: "",
                  role: "",
                  rank: "",
                  image: "",
                  achievementsCsv: "",
                  achievementsEnCsv: "",
                  socialCsv: "",
                })
              }
            >
              <DataTable
                headers={[tr.image, tr.name, tr.game, tr.role, tr.country, tr.actions]}
                rows={rosterPlayers.map((p) => [
                  p.image ? (
                    <img src={p.image} alt={p.name} className="w-10 h-10 object-cover border border-[#0B3C6D]/40" />
                  ) : (
                    <span className="text-white/20">—</span>
                  ),
                  p.name,
                  p.game,
                  p.role,
                  lang === "ar" ? p.country : p.countryEn,
                  renderTableActions("rosterPlayers", p.id, () =>
                    openModal(
                      "rosterPlayers",
                      "edit",
                      {
                        ...p,
                        achievementsCsv: joinCsv(p.achievements),
                        achievementsEnCsv: joinCsv(p.achievementsEn),
                        socialCsv: formatKeyVal(p.social),
                      },
                      p.id,
                    ),
                  ),
                ])}
              />
            </ContentSection>
          )}

          {/* Roster Teams */}
          {section === "rosterTeams" && (
            <ContentSection
              loading={loading}
              empty={rosterTeams.length === 0}
              tr={tr}
              onAdd={() =>
                openModal("rosterTeams", "add", {
                  name: "",
                  game: "",
                  gameId: null,
                  logo: "",
                  players: 0,
                  captain: "",
                  achievementsCsv: "",
                  achievementsEnCsv: "",
                  tournamentsCsv: "",
                })
              }
            >
              <DataTable
                headers={[tr.logo, tr.name, tr.game, tr.captain, tr.players, tr.actions]}
                rows={rosterTeams.map((team) => [
                  team.logo ? (
                    <img src={team.logo} alt={team.name} className="w-10 h-10 object-cover border border-[#0B3C6D]/40" />
                  ) : (
                    <span className="text-white/20">—</span>
                  ),
                  team.name,
                  team.game,
                  team.captain,
                  String(team.players),
                  renderTableActions("rosterTeams", team.id, () =>
                    openModal(
                      "rosterTeams",
                      "edit",
                      {
                        ...team,
                        achievementsCsv: joinCsv(team.achievements),
                        achievementsEnCsv: joinCsv(team.achievementsEn),
                        tournamentsCsv: joinCsv(team.tournaments),
                      },
                      team.id,
                    ),
                  ),
                ])}
              />
            </ContentSection>
          )}

          {/* Creators / ARC Voices */}
          {section === "creators" && (
            <ContentSection
              loading={loading}
              empty={creators.length === 0}
              tr={tr}
              onAdd={() =>
                openModal("creators", "add", {
                  name: "",
                  nameAr: "",
                  bio: "",
                  bioEn: "",
                  image: "",
                  verified: false,
                  platformsCsv: "",
                  socialCsv: "",
                })
              }
            >
              <DataTable
                headers={[tr.image, tr.name, tr.verified, tr.actions]}
                rows={creators.map((c) => [
                  c.image ? (
                    <img
                      src={c.image}
                      alt={c.name}
                      className="w-10 h-10 rounded-full object-cover border border-[#F7941D]/50"
                    />
                  ) : (
                    <span className="text-white/20">—</span>
                  ),
                  lang === "ar" ? c.nameAr || c.name : c.name,
                  c.verified ? "✓" : "—",
                  renderTableActions("creators", c.id, () =>
                    openModal(
                      "creators",
                      "edit",
                      {
                        ...c,
                        platformsCsv: formatKeyVal(c.platforms),
                        socialCsv: formatKeyVal(c.social),
                      },
                      c.id,
                    ),
                  ),
                ])}
              />
            </ContentSection>
          )}

          {/* Tournaments */}
          {section === "tournaments" && (
            <ContentSection
              loading={loading}
              empty={tournaments.length === 0}
              tr={tr}
              onAdd={() =>
                openModal("tournaments", "add", {
                  name: "",
                  nameAr: "",
                  status: "upcoming",
                  image: "",
                  game: "",
                  startDate: "",
                  endDate: "",
                  prize: "",
                  teams: 16,
                })
              }
            >
              <DataTable
                headers={[tr.name, tr.game, tr.status, tr.actions]}
                rows={tournaments.map((item) => [
                  lang === "ar" ? item.nameAr : item.name,
                  item.game,
                  item.status,
                  renderTableActions("tournaments", item.id, () =>
                    openModal("tournaments", "edit", { ...item }, item.id),
                  ),
                ])}
              />
            </ContentSection>
          )}

          {/* News */}
          {section === "news" && (
            <ContentSection
              loading={loading}
              empty={news.length === 0}
              tr={tr}
              onAdd={() =>
                openModal("news", "add", {
                  title: "",
                  titleEn: "",
                  summary: "",
                  summaryEn: "",
                  date: new Date().toISOString().slice(0, 10),
                  category: "",
                  categoryEn: "",
                  image: "",
                })
              }
            >
              <DataTable
                headers={[tr.name, tr.date, tr.actions]}
                rows={news.map((item) => [
                  lang === "ar" ? item.title : item.titleEn,
                  item.date,
                  renderTableActions("news", item.id, () =>
                    openModal("news", "edit", { ...item }, item.id),
                  ),
                ])}
              />
            </ContentSection>
          )}

          {/* Media */}
          {section === "media" && (
            <ContentSection
              loading={loading}
              empty={media.length === 0}
              tr={tr}
              onAdd={() =>
                openModal("media", "add", {
                  title: "",
                  titleAr: "",
                  thumbnail: "",
                  videoUrl: "",
                  category: "",
                  creator: "",
                })
              }
            >
              <DataTable
                headers={[tr.name, tr.category, tr.actions]}
                rows={media.map((item) => [
                  lang === "ar" ? item.titleAr : item.title,
                  item.category,
                  renderTableActions("media", item.id, () =>
                    openModal("media", "edit", { ...item }, item.id),
                  ),
                ])}
              />
            </ContentSection>
          )}

          {/* Partners */}
          {section === "partners" && (
            <ContentSection
              loading={loading}
              empty={partners.length === 0}
              tr={tr}
              onAdd={() => openModal("partners", "add", { name: "", logo: "", url: "" })}
            >
              <DataTable
                headers={[tr.name, tr.url, tr.actions]}
                rows={partners.map((item) => [
                  item.name,
                  item.url || "—",
                  renderTableActions("partners", item.id, () =>
                    openModal("partners", "edit", { ...item }, item.id),
                  ),
                ])}
              />
            </ContentSection>
          )}

          {/* Merch */}
          {section === "merch" && (
            <ContentSection
              loading={loading}
              empty={merch.length === 0}
              tr={tr}
              onAdd={() =>
                openModal("merch", "add", {
                  name: "",
                  nameAr: "",
                  description: "",
                  descriptionAr: "",
                  category: "jersey",
                  price: "",
                  image: "",
                  colorsCsv: ARC_COLORS.join(", "),
                  sizesCsv: "S, M, L, XL",
                  featured: false,
                  available: true,
                  sortOrder: 0,
                })
              }
            >
              <DataTable
                headers={[tr.name, tr.category, tr.price, tr.actions]}
                rows={merch.map((item) => [
                  lang === "ar" ? item.nameAr : item.name,
                  item.category,
                  item.price,
                  renderTableActions("merch", item.id, () =>
                    openModal(
                      "merch",
                      "edit",
                      {
                        ...item,
                        colorsCsv: joinCsv(item.colors.length ? item.colors : ARC_COLORS),
                        sizesCsv: joinCsv(item.sizes),
                      },
                      item.id,
                    ),
                  ),
                ])}
              />
            </ContentSection>
          )}

          {/* Site Settings */}
          {section === "site" && (
            <div>
              {loading && !site ? (
                <p className="font-mono text-white/30">{tr.loading}</p>
              ) : site ? (
                <div className="glass border border-[#0B3C6D]/40 p-6 space-y-4 max-w-3xl">
                  <div>
                    <label className="font-mono text-xs text-white/40 uppercase mb-1.5 block">{tr.brandName}</label>
                    <input
                      className="arc-input"
                      value={site.brandName}
                      onChange={(e) => setSite({ ...site, brandName: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="font-mono text-xs text-white/40 uppercase mb-1.5 block">{tr.taglineAr}</label>
                    <input
                      className="arc-input"
                      value={site.taglineAr}
                      onChange={(e) => setSite({ ...site, taglineAr: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="font-mono text-xs text-white/40 uppercase mb-1.5 block">{tr.taglineEn}</label>
                    <input
                      className="arc-input"
                      value={site.taglineEn}
                      onChange={(e) => setSite({ ...site, taglineEn: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="font-mono text-xs text-white/40 uppercase mb-1.5 block">{tr.contactEmail}</label>
                    <input
                      className="arc-input"
                      value={site.contactEmail || ""}
                      onChange={(e) => setSite({ ...site, contactEmail: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="font-mono text-xs text-white/40 uppercase mb-1.5 block">{tr.heroVideoUrl}</label>
                    <input
                      className="arc-input"
                      value={site.heroVideoUrl || ""}
                      onChange={(e) => setSite({ ...site, heroVideoUrl: e.target.value })}
                    />
                  </div>

                  <h3 className="font-display font-800 text-white uppercase pt-2">{tr.social}</h3>
                  {(["discord", "tiktok", "youtube", "kick", "twitch", "email"] as const).map((key) => (
                    <div key={key}>
                      <label className="font-mono text-xs text-white/40 uppercase mb-1.5 block">{key}</label>
                      <input
                        className="arc-input"
                        value={site.social?.[key] || ""}
                        onChange={(e) =>
                          setSite({ ...site, social: { ...site.social, [key]: e.target.value } })
                        }
                      />
                    </div>
                  ))}

                  <h3 className="font-display font-800 text-white uppercase pt-2">{tr.stats}</h3>
                  {(["players", "teams", "creators", "tournaments"] as const).map((key) => (
                    <div key={key}>
                      <label className="font-mono text-xs text-white/40 uppercase mb-1.5 block">{key}</label>
                      <input
                        type="number"
                        className="arc-input"
                        value={site.stats?.[key] ?? 0}
                        onChange={(e) =>
                          setSite({ ...site, stats: { ...site.stats, [key]: Number(e.target.value) } })
                        }
                      />
                    </div>
                  ))}

                  <button onClick={saveSite} className="btn-arc text-sm mt-4">
                    {tr.save}
                  </button>
                </div>
              ) : (
                renderEmpty()
              )}
            </div>
          )}

          {/* Users */}
          {section === "users" && isAdmin && (
            <div className="space-y-6">
              <div className="glass border border-[#0B3C6D]/40 p-6 max-w-2xl space-y-4">
                <h3 className="font-display font-800 text-lg text-white uppercase">{tr.addSupervisor}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    className="arc-input"
                    placeholder={tr.supervisorName}
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  />
                  <input
                    className="arc-input"
                    type="email"
                    placeholder={tr.email}
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  />
                  <input
                    className="arc-input"
                    type="password"
                    placeholder={tr.password}
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  />
                  <select
                    className="arc-select"
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  >
                    <option value="supervisor">Supervisor</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <button
                  className="btn-arc text-sm"
                  onClick={async () => {
                    if (!newUser.name || !newUser.email || !newUser.password) return;
                    try {
                      await api.createUser(newUser);
                      setNewUser({ name: "", email: "", password: "", role: "supervisor" });
                      await load();
                      showSuccess();
                    } catch (err) {
                      showError(err);
                    }
                  }}
                >
                  {tr.add}
                </button>
              </div>

              {users.length === 0 ? (
                renderEmpty()
              ) : (
                <DataTable
                  headers={[tr.name, tr.email, tr.role, tr.status, tr.actions]}
                  rows={users.map((u) => [
                    u.name,
                    u.email,
                    u.role,
                    <span key="s" className={u.active ? "badge-active" : "badge-rejected"}>
                      {u.active ? tr.active : tr.inactive}
                    </span>,
                    u.role !== "admin" ? (
                      <button
                        key="a"
                        className="font-mono text-xs text-[#F7941D] border border-[#F7941D]/30 px-2.5 py-1"
                        onClick={async () => {
                          try {
                            await api.setUserActive(u.id, !u.active);
                            await load();
                            showSuccess();
                          } catch (err) {
                            showError(err);
                          }
                        }}
                      >
                        {u.active ? tr.deactivate : tr.activate}
                      </button>
                    ) : (
                      "—"
                    ),
                  ])}
                />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Application Detail Drawer */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex" onClick={() => setSelectedApp(null)}>
          <div className="flex-1 bg-black/60" />
          <div
            className={`w-full max-w-xl glass-dark border-${isRtl ? "e" : "s"} border-[#0B3C6D]/50 h-full overflow-y-auto p-6`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="font-display font-900 text-2xl text-white uppercase">{selectedApp.name}</h3>
                <div className="flex gap-2 mt-2">
                  <span className="font-mono text-xs text-white/40">{selectedApp.type}</span>
                  {statusBadge(selectedApp.status as Status)}
                </div>
              </div>
              <button onClick={() => setSelectedApp(null)} className="font-mono text-xs text-white/40 hover:text-white">
                {tr.close}
              </button>
            </div>

            <div className="mb-6">
              {detailRow(tr.name, selectedApp.name)}
              {detailRow(tr.email, selectedApp.email)}
              {detailRow(tr.discord, selectedApp.discord)}
              {detailRow(tr.country, selectedApp.country)}
              {detailRow(tr.age, selectedApp.age)}
              {detailRow(tr.game, selectedApp.game)}
              {detailRow(tr.role, selectedApp.role)}
              {detailRow(tr.accountId, selectedApp.accountId)}
              {detailRow(tr.uid, selectedApp.uid)}
              {detailRow(tr.rank, selectedApp.rank)}
              {detailRow(tr.achievements, selectedApp.achievements)}
              {detailRow(tr.profileLink, selectedApp.profileLink)}
              {detailRow(tr.message, selectedApp.message)}
              {detailRow(tr.teamName, selectedApp.teamName)}
              {detailRow(tr.captain, selectedApp.captain)}
              {detailRow(tr.playerCount, selectedApp.playerCount)}
              {detailRow(tr.platform, selectedApp.platform)}
              {detailRow(tr.followers, selectedApp.followers)}
              {detailRow(tr.platforms, formatKeyVal(selectedApp.platforms))}
              {detailRow(tr.social, formatKeyVal(selectedApp.social))}
              {detailRow(tr.avgViews, selectedApp.avgViews)}
              {detailRow(tr.avgLive, selectedApp.avgLive)}
              {detailRow(tr.bio, selectedApp.bio)}
              {detailRow(tr.type, selectedApp.type)}
              {detailRow(tr.status, selectedApp.status)}
              {detailRow(tr.createdAt, selectedApp.createdAt?.slice(0, 19))}
              {detailRow(tr.updatedAt, selectedApp.updatedAt?.slice(0, 19))}
            </div>

            <div className="mb-6">
              <label className="font-mono text-xs text-white/40 uppercase mb-1.5 block">{tr.adminNotes}</label>
              <textarea
                className="arc-input min-h-[100px]"
                value={appNotes}
                onChange={(e) => setAppNotes(e.target.value)}
              />
              <button onClick={saveAppNotes} className="btn-arc-outline text-xs mt-2 px-3 py-1.5">
                {tr.save}
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {selectedApp.status !== "approved" && (
                <button
                  className="btn-arc text-sm"
                  onClick={() => updateAppStatus(selectedApp.id, "approved")}
                >
                  {tr.approve}
                </button>
              )}
              {selectedApp.status !== "rejected" && (
                <button
                  className="btn-arc-outline text-sm"
                  onClick={() => updateAppStatus(selectedApp.id, "rejected")}
                >
                  {tr.reject}
                </button>
              )}
              {selectedApp.status !== "suspended" && (
                <button
                  className="font-mono text-xs text-yellow-400 border border-yellow-400/30 px-3 py-2"
                  onClick={() => updateAppStatus(selectedApp.id, "suspended")}
                >
                  {tr.suspend}
                </button>
              )}
              <button
                className="font-mono text-xs text-red-400 border border-red-400/30 px-3 py-2"
                onClick={() => deleteApp(selectedApp.id)}
              >
                {tr.delete}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CRUD Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={closeModal}>
          <div
            className="glass-dark border border-[#0B3C6D]/50 max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-display font-900 text-xl text-white uppercase mb-4">
              {modal.mode === "add" ? tr.add : tr.edit}
            </h3>
            {renderModalForm()}
            <div className="flex gap-3 mt-6">
              <button onClick={handleModalSave} disabled={saving} className="btn-arc text-sm">
                {saving ? "..." : tr.save}
              </button>
              <button onClick={closeModal} className="btn-arc-outline text-sm">
                {tr.cancel}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ContentSection({
  loading,
  empty,
  tr,
  onAdd,
  children,
}: {
  loading: boolean;
  empty: boolean;
  tr: (typeof t)["en"];
  onAdd: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <button onClick={onAdd} className="btn-arc text-sm">
        {tr.add}
      </button>
      {loading ? (
        <p className="font-mono text-white/30">{tr.loading}</p>
      ) : empty ? (
        <div className="glass border border-[#0B3C6D]/40 p-12 text-center">
          <p className="font-mono text-sm text-white/30">{tr.empty}</p>
        </div>
      ) : (
        children
      )}
    </div>
  );
}

function DataTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: React.ReactNode[][];
}) {
  return (
    <div className="glass border border-[#0B3C6D]/40 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#0B3C6D]/30 bg-[#0B3C6D]/10">
              {headers.map((label) => (
                <th
                  key={label}
                  className="px-4 py-3 font-mono text-xs text-white/40 uppercase tracking-wider text-start"
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#0B3C6D]/20">
            {rows.map((row, i) => (
              <tr key={i} className="hover:bg-[#0B3C6D]/10">
                {row.map((cell, j) => (
                  <td key={j} className="px-4 py-3 font-body text-sm text-white/70">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
