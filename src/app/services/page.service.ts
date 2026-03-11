import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Page, PageSummary, ContentBlock, BlockType } from '../models';

@Injectable({ providedIn: 'root' })
export class PageService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getPages() {
    return this.http.get<PageSummary[]>(`${this.apiUrl}/pages`);
  }

  getAllPages() {
    return this.http.get<PageSummary[]>(`${this.apiUrl}/pages/admin/all`);
  }

  getPageBySlug(slug: string) {
    return this.http.get<Page>(`${this.apiUrl}/pages/${slug}`);
  }

  getPageById(id: number) {
    return this.http.get<Page>(`${this.apiUrl}/pages/admin/${id}`);
  }

  createPage(req: { title: string; slug: string; metaDescription?: string; ogImageUrl?: string; status: string }) {
    return this.http.post<Page>(`${this.apiUrl}/pages`, req);
  }

  updatePage(id: number, req: Partial<{ title: string; slug: string; metaDescription: string; ogImageUrl: string; status: string }>) {
    return this.http.put<Page>(`${this.apiUrl}/pages/${id}`, req);
  }

  deletePage(id: number) {
    return this.http.delete<void>(`${this.apiUrl}/pages/${id}`);
  }

  addBlock(pageId: number, req: { blockType: BlockType; content: Record<string, unknown>; sortOrder?: number }) {
    return this.http.post<ContentBlock>(`${this.apiUrl}/pages/${pageId}/blocks`, req);
  }

  updateBlock(pageId: number, blockId: number, req: { blockType?: string; content?: Record<string, unknown> }) {
    return this.http.put<ContentBlock>(`${this.apiUrl}/pages/${pageId}/blocks/${blockId}`, req);
  }

  deleteBlock(pageId: number, blockId: number) {
    return this.http.delete<void>(`${this.apiUrl}/pages/${pageId}/blocks/${blockId}`);
  }

  reorderBlocks(pageId: number, req: { blocks: { id: number; sortOrder: number }[] }) {
    return this.http.put<void>(`${this.apiUrl}/pages/${pageId}/blocks/reorder`, req);
  }
}
