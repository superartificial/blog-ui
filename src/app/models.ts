export type PostStatus = 'DRAFT' | 'AWAITING_REVIEW' | 'PUBLISHED' | 'ARCHIVED';

export interface Category {
  id: number;
  name: string;
  slug: string;
  parentId?: number | null;
  children?: Category[];
  sortOrder: number;
}

export interface ImageItem {
  id: number;
  filename: string;
  url: string;
  thumbnailUrl?: string;
  mimeType?: string;
  sizeBytes?: number;
  uploadedAt?: string | number[];
  referenceCount: number;
}
export type BlockType = 'RICH_TEXT' | 'HTML' | 'HERO' | 'IMAGE' | 'DIVIDER' | 'CTA' | 'BLOG_FEED';

export interface ContentBlock {
  id: number;
  blockType: BlockType;
  sortOrder: number;
  content: Record<string, unknown>;
}

export interface PageSummary {
  id: number;
  slug: string;
  title: string;
  metaDescription?: string;
  status: PostStatus;
  createdAt?: string | number[];
  updatedAt?: string | number[];
}

export interface Page extends PageSummary {
  ogImageUrl?: string;
  blocks: ContentBlock[];
}

export interface PostSummary {
  id?: number;
  title: string;
  slug: string;
  excerpt?: string;
  status?: string;
  categoryId?: number;
  categoryName?: string;
  categorySlug?: string;
  tags?: string[];
  createdAt?: string | number[];
  updatedAt?: string | number[];
}

export interface Post extends PostSummary {
  content: string;
  humanIntro?: string;
  aiNotes?: string;
  categoryId?: number;
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

const CATEGORY_PALETTE = ['#087287', '#7318C8', '#A84F08', '#2d6a4f'];

export function categoryColor(slug?: string | null): string {
  if (!slug) return CATEGORY_PALETTE[0];
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = (hash * 31 + slug.charCodeAt(i)) & 0x7fffffff;
  }
  return CATEGORY_PALETTE[hash % CATEGORY_PALETTE.length];
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
