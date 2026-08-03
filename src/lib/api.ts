const API_BASE = import.meta.env.VITE_API_URL || '/api';
const TOKEN_KEY = 'arc_admin_token';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(path: string, options?: RequestInit & { auth?: boolean }): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options?.headers as Record<string, string>) || {}),
  };
  if (options?.auth !== false) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `Request failed: ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

function crud<T>(base: string) {
  return {
    list: (query?: string) => request<T[]>(query ? `${base}${query}` : base, { auth: false }),
    create: (data: Partial<T>) =>
      request<T>(base, { method: 'POST', body: JSON.stringify(data) }),
    update: (id: number, data: Partial<T>) =>
      request<T>(`${base}/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    remove: (id: number) =>
      request<{ ok: boolean }>(`${base}/${id}`, { method: 'DELETE' }),
  };
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
  gameId?: number | null;
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
  teamId?: number | null;
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

export type MerchItem = {
  id: number;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  category: 'jersey' | 'hoodie' | 'cap' | 'accessory';
  price: string;
  image: string;
  colors: string[];
  sizes: string[];
  featured: boolean;
  available: boolean;
  sortOrder?: number;
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
  updatedAt?: string;
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

export type AdminUser = {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'supervisor';
  active?: boolean;
  createdAt?: string;
};

const gamesApi = crud<Game>('/games');
const teamsApi = crud<Team>('/teams');
const playersApi = crud<Player>('/players');
const creatorsApi = crud<Creator>('/creators');
const tournamentsApi = crud<Tournament>('/tournaments');
const newsApi = crud<NewsItem>('/news');
const partnersApi = crud<Partner>('/partners');
const mediaApi = crud<MediaItem>('/media');
const merchApi = crud<MerchItem>('/merch');

export const api = {
  games: () => gamesApi.list(),
  createGame: gamesApi.create,
  updateGame: gamesApi.update,
  deleteGame: gamesApi.remove,

  teams: () => teamsApi.list(),
  createTeam: teamsApi.create,
  updateTeam: teamsApi.update,
  deleteTeam: teamsApi.remove,

  players: () => playersApi.list(),
  createPlayer: playersApi.create,
  updatePlayer: playersApi.update,
  deletePlayer: playersApi.remove,

  creators: () => creatorsApi.list(),
  createCreator: creatorsApi.create,
  updateCreator: creatorsApi.update,
  deleteCreator: creatorsApi.remove,

  tournaments: (status?: string) =>
    tournamentsApi.list(status ? `?status=${status}` : undefined),
  createTournament: tournamentsApi.create,
  updateTournament: tournamentsApi.update,
  deleteTournament: tournamentsApi.remove,

  news: () => newsApi.list(),
  createNews: newsApi.create,
  updateNews: newsApi.update,
  deleteNews: newsApi.remove,

  partners: () => partnersApi.list(),
  createPartner: partnersApi.create,
  updatePartner: partnersApi.update,
  deletePartner: partnersApi.remove,

  media: (category?: string) =>
    mediaApi.list(category ? `?category=${category}` : undefined),
  createMedia: mediaApi.create,
  updateMedia: mediaApi.update,
  deleteMedia: mediaApi.remove,

  merch: (category?: string) =>
    merchApi.list(category ? `?category=${category}` : undefined),
  merchAll: () => request<MerchItem[]>('/merch/admin/all'),
  createMerch: merchApi.create,
  updateMerch: merchApi.update,
  deleteMerch: merchApi.remove,

  site: () => request<SiteSettings>('/site', { auth: false }),
  updateSite: (data: Partial<SiteSettings>) =>
    request<SiteSettings>('/site', { method: 'PATCH', body: JSON.stringify(data) }),

  applications: (type?: string) =>
    request<Application[]>(type ? `/applications?type=${type}` : '/applications'),
  submitApplication: (data: Record<string, unknown>) =>
    request<Application>('/applications', {
      method: 'POST',
      body: JSON.stringify(data),
      auth: false,
    }),
  updateApplicationStatus: (id: number, status: string, adminNotes?: string) =>
    request<Application>(`/applications/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, adminNotes }),
    }),
  updateApplication: (id: number, data: Partial<Application>) =>
    request<Application>(`/applications/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  deleteApplication: (id: number) =>
    request<{ ok: boolean }>(`/applications/${id}`, { method: 'DELETE' }),

  dashboard: () => request<DashboardStats>('/admin/dashboard'),
  clearContent: () =>
    request<{ ok: boolean; message: string }>('/admin/clear-content', { method: 'POST' }),

  login: (email: string, password: string) =>
    request<{ accessToken: string; user: AdminUser }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      auth: false,
    }),
  me: () => request<AdminUser>('/auth/me'),
  users: () => request<AdminUser[]>('/auth/users'),
  createUser: (data: { email: string; password: string; name: string; role?: string }) =>
    request<AdminUser>('/auth/users', { method: 'POST', body: JSON.stringify(data) }),
  setUserActive: (id: number, active: boolean) =>
    request<AdminUser>(`/auth/users/${id}/active`, {
      method: 'PATCH',
      body: JSON.stringify({ active }),
    }),
};
