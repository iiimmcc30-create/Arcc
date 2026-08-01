const API_BASE = import.meta.env.VITE_API_URL || '/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `Request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export type Game = {
  id: number;
  slug: string;
  name: string;
  nameAr: string;
  image: string;
  players: number;
  tournaments: number;
  desc: string;
  descEn: string;
};

export type Team = {
  id: number;
  name: string;
  game: string;
  logo: string;
  players: number;
  captain: string;
  achievements: string[];
  achievementsEn: string[];
  tournaments: string[];
};

export type Player = {
  id: number;
  name: string;
  game: string;
  country: string;
  countryEn: string;
  flag: string;
  role: string;
  rank: string;
  image: string;
  achievements: string[];
  achievementsEn: string[];
  social: Record<string, string>;
};

export type Creator = {
  id: number;
  name: string;
  nameAr: string;
  bio: string;
  bioEn: string;
  image: string;
  verified: boolean;
  platforms: Record<string, string>;
  social: Record<string, string>;
};

export type Tournament = {
  id: number;
  name: string;
  nameAr: string;
  status: 'active' | 'upcoming' | 'past';
  image: string;
  game: string;
  startDate: string;
  endDate: string;
  prize: string;
  teams: number;
};

export type NewsItem = {
  id: number;
  title: string;
  titleEn: string;
  summary: string;
  summaryEn: string;
  date: string;
  category: string;
  categoryEn: string;
  image: string;
};

export type Partner = {
  id: number;
  name: string;
  logo: string;
  url?: string | null;
};

export type MediaItem = {
  id: number;
  title: string;
  titleAr: string;
  thumbnail: string;
  videoUrl?: string | null;
  category: string;
  creator?: string | null;
};

export type Application = {
  id: number;
  type: 'player' | 'team' | 'creator';
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  name: string;
  email?: string | null;
  discord?: string | null;
  country?: string | null;
  age?: number | null;
  game?: string | null;
  role?: string | null;
  accountId?: string | null;
  uid?: string | null;
  rank?: string | null;
  achievements?: string | null;
  profileLink?: string | null;
  message?: string | null;
  teamName?: string | null;
  captain?: string | null;
  playerCount?: number | null;
  platform?: string | null;
  followers?: string | null;
  platforms?: Record<string, string>;
  social?: Record<string, string>;
  avgViews?: string | null;
  avgLive?: string | null;
  bio?: string | null;
  adminNotes?: string | null;
  createdAt: string;
};

export type DashboardStats = {
  players: number;
  teams: number;
  creators: number;
  tournaments: number;
  news: number;
  applications: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    suspended: number;
  };
  recent: Application[];
};

export type SiteSettings = {
  id: number;
  brandName: string;
  taglineAr: string;
  taglineEn: string;
  social: Record<string, string>;
  stats: Record<string, number>;
  contactEmail?: string | null;
  heroVideoUrl?: string | null;
};

export const api = {
  games: () => request<Game[]>('/games'),
  teams: () => request<Team[]>('/teams'),
  team: (id: number) => request<Team>(`/teams/${id}`),
  players: () => request<Player[]>('/players'),
  creators: () => request<Creator[]>('/creators'),
  tournaments: (status?: string) =>
    request<Tournament[]>(status ? `/tournaments?status=${status}` : '/tournaments'),
  tournament: (id: number) => request<Tournament>(`/tournaments/${id}`),
  createTournament: (data: Partial<Tournament>) =>
    request<Tournament>('/tournaments', { method: 'POST', body: JSON.stringify(data) }),
  updateTournament: (id: number, data: Partial<Tournament>) =>
    request<Tournament>(`/tournaments/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteTournament: (id: number) =>
    request<{ ok: boolean }>(`/tournaments/${id}`, { method: 'DELETE' }),
  news: () => request<NewsItem[]>('/news'),
  createNews: (data: Partial<NewsItem>) =>
    request<NewsItem>('/news', { method: 'POST', body: JSON.stringify(data) }),
  updateNews: (id: number, data: Partial<NewsItem>) =>
    request<NewsItem>(`/news/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteNews: (id: number) =>
    request<{ ok: boolean }>(`/news/${id}`, { method: 'DELETE' }),
  partners: () => request<Partner[]>('/partners'),
  media: (category?: string) =>
    request<MediaItem[]>(category ? `/media?category=${category}` : '/media'),
  site: () => request<SiteSettings>('/site'),
  updateSite: (data: Partial<SiteSettings>) =>
    request<SiteSettings>('/site', { method: 'PATCH', body: JSON.stringify(data) }),
  applications: (type?: string) =>
    request<Application[]>(type ? `/applications?type=${type}` : '/applications'),
  submitApplication: (data: Record<string, unknown>) =>
    request<Application>('/applications', { method: 'POST', body: JSON.stringify(data) }),
  updateApplicationStatus: (id: number, status: string, adminNotes?: string) =>
    request<Application>(`/applications/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, adminNotes }),
    }),
  dashboard: () => request<DashboardStats>('/admin/dashboard'),
};
