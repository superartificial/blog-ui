export interface PostSummary {
  id?: number;
  title: string;
  slug: string;
  excerpt?: string;
  status?: string;
  createdAt?: string | number[];
  updatedAt?: string | number[];
}

export interface Post extends PostSummary {
  content: string;
  humanIntro?: string;
  aiNotes?: string;
}

export interface ContactSubmission {
  id: number;
  name: string;
  email: string;
  message: string;
  ipAddress: string;
  submittedAt: string | number[];
  read: boolean;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string | null;
}

export function formatPostDate(date: string | number[] | undefined): string {
  if (!date) return '';
  let d: Date;
  if (Array.isArray(date)) {
    const [year, month, day] = date;
    d = new Date(year, month - 1, day);
  } else {
    d = new Date(date);
  }
  return d.toLocaleDateString('en-NZ', { year: 'numeric', month: 'long', day: 'numeric' });
}
