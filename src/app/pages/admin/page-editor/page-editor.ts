import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CdkDragDrop, CdkDropList, CdkDrag, CdkDragHandle, moveItemInArray } from '@angular/cdk/drag-drop';
import { PageService } from '../../../services/page.service';
import { Page, ContentBlock, BlockType } from '../../../models';
import { RichTextBlockEditor } from '../../../components/block-editors/rich-text-block-editor/rich-text-block-editor';
import { HeroBlockEditor } from '../../../components/block-editors/hero-block-editor/hero-block-editor';
import { ImageBlockEditor } from '../../../components/block-editors/image-block-editor/image-block-editor';
import { CtaBlockEditor } from '../../../components/block-editors/cta-block-editor/cta-block-editor';
import { HtmlBlockEditor } from '../../../components/block-editors/html-block-editor/html-block-editor';
import { DividerBlockEditor } from '../../../components/block-editors/divider-block-editor/divider-block-editor';

const BLOCK_LABELS: Record<BlockType, string> = {
  RICH_TEXT: 'Rich Text',
  HERO: 'Hero',
  IMAGE: 'Image',
  HTML: 'HTML',
  DIVIDER: 'Divider',
  CTA: 'Call to Action',
  BLOG_FEED: 'Blog Feed',
};

const EMPTY_CONTENT: Record<BlockType, Record<string, unknown>> = {
  RICH_TEXT: { body: '' },
  HERO: { title: '', subtitle: '', bgImageUrl: '', ctaText: '', ctaUrl: '' },
  IMAGE: { url: '', alt: '', caption: '' },
  HTML: { html: '' },
  DIVIDER: { style: 'thin' },
  CTA: { heading: '', body: '', buttonText: '', buttonUrl: '' },
  BLOG_FEED: { heading: 'Latest Posts', limit: 3 },
};

@Component({
  selector: 'app-page-editor',
  imports: [
    FormsModule, RouterLink,
    CdkDropList, CdkDrag, CdkDragHandle,
    RichTextBlockEditor, HeroBlockEditor, ImageBlockEditor,
    CtaBlockEditor, HtmlBlockEditor, DividerBlockEditor,
  ],
  templateUrl: './page-editor.html',
  styleUrl: './page-editor.scss',
})
export class PageEditor {
  private pageService = inject(PageService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  readonly blockTypes = Object.keys(BLOCK_LABELS) as BlockType[];
  readonly blockLabels = BLOCK_LABELS;

  // ── State ────────────────────────────────────────────────────────────────

  isEditing = signal(false);
  page = signal<Page | null>(null);

  // Metadata form
  title = '';
  slug = '';
  metaDescription = '';
  ogImageUrl = '';
  status = 'DRAFT';

  metaSaving = signal(false);
  metaError = signal<string | null>(null);
  metaSaved = signal(false);

  // Block state
  blocks = signal<ContentBlock[]>([]);
  editingBlockId = signal<number | null>(null);
  editingContent = signal<Record<string, unknown>>({});
  savingBlockId = signal<number | null>(null);
  deletingBlockId = signal<number | null>(null);
  addingType = signal<BlockType | null>(null);

  loading = signal(true);
  loadError = signal<string | null>(null);

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing.set(true);
      this.pageService.getPageById(+id).subscribe({
        next: (page) => {
          this.page.set(page);
          this.title = page.title;
          this.slug = page.slug;
          this.metaDescription = page.metaDescription ?? '';
          this.ogImageUrl = page.ogImageUrl ?? '';
          this.status = page.status;
          this.blocks.set([...page.blocks]);
          this.loading.set(false);
        },
        error: () => this.router.navigate(['/admin/pages']),
      });
    } else {
      this.loading.set(false);
    }
  }

  // ── Slug generation ──────────────────────────────────────────────────────

  onTitleChange() {
    if (!this.isEditing()) {
      this.slug = this.slugify(this.title);
    }
  }

  private slugify(text: string): string {
    return text.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  // ── Metadata save ────────────────────────────────────────────────────────

  saveMeta() {
    if (!this.title.trim() || !this.slug.trim()) {
      this.metaError.set('Title and slug are required.');
      return;
    }
    this.metaSaving.set(true);
    this.metaError.set(null);
    this.metaSaved.set(false);

    const req = {
      title: this.title,
      slug: this.slug,
      metaDescription: this.metaDescription,
      ogImageUrl: this.ogImageUrl,
      status: this.status,
    };

    if (this.isEditing()) {
      this.pageService.updatePage(this.page()!.id, req).subscribe({
        next: (page) => { this.page.set(page); this.metaSaving.set(false); this.metaSaved.set(true); },
        error: (err) => {
          this.metaError.set(err.error?.error ?? 'Failed to save.');
          this.metaSaving.set(false);
        },
      });
    } else {
      this.pageService.createPage(req).subscribe({
        next: (page) => {
          this.page.set(page);
          this.blocks.set([]);
          this.isEditing.set(true);
          this.metaSaving.set(false);
          this.metaSaved.set(true);
          this.router.navigate(['/admin/pages/edit', page.id], { replaceUrl: true });
        },
        error: (err) => {
          this.metaError.set(err.error?.error ?? 'Failed to save.');
          this.metaSaving.set(false);
        },
      });
    }
  }

  // ── Block add ────────────────────────────────────────────────────────────

  addBlock(type: BlockType) {
    if (!this.page()) return;
    this.addingType.set(type);
    const content = { ...EMPTY_CONTENT[type] };
    this.pageService.addBlock(this.page()!.id, { blockType: type, content }).subscribe({
      next: (block) => {
        this.blocks.update((list) => [...list, block]);
        this.editBlock(block);
        this.addingType.set(null);
      },
      error: () => this.addingType.set(null),
    });
  }

  // ── Block edit / save ────────────────────────────────────────────────────

  editBlock(block: ContentBlock) {
    this.editingBlockId.set(block.id);
    this.editingContent.set({ ...block.content });
  }

  cancelEdit() {
    this.editingBlockId.set(null);
    this.editingContent.set({});
  }

  saveBlock(block: ContentBlock) {
    this.savingBlockId.set(block.id);
    const content = this.editingContent();
    this.pageService.updateBlock(this.page()!.id, block.id, { content }).subscribe({
      next: (updated) => {
        this.blocks.update((list) => list.map((b) => b.id === updated.id ? updated : b));
        this.editingBlockId.set(null);
        this.savingBlockId.set(null);
      },
      error: () => this.savingBlockId.set(null),
    });
  }

  // ── Block delete ─────────────────────────────────────────────────────────

  deleteBlock(block: ContentBlock) {
    if (!confirm(`Delete this ${BLOCK_LABELS[block.blockType]} block?`)) return;
    this.deletingBlockId.set(block.id);
    this.pageService.deleteBlock(this.page()!.id, block.id).subscribe({
      next: () => {
        this.blocks.update((list) => list.filter((b) => b.id !== block.id));
        if (this.editingBlockId() === block.id) this.cancelEdit();
        this.deletingBlockId.set(null);
      },
      error: () => this.deletingBlockId.set(null),
    });
  }

  // ── Block reorder ────────────────────────────────────────────────────────

  onDrop(event: CdkDragDrop<ContentBlock[]>) {
    if (event.previousIndex === event.currentIndex) return;
    const list = [...this.blocks()];
    moveItemInArray(list, event.previousIndex, event.currentIndex);
    this.blocks.set(list);
    const reorderItems = list.map((b, i) => ({ id: b.id, sortOrder: i * 10 }));
    this.pageService.reorderBlocks(this.page()!.id, { blocks: reorderItems }).subscribe();
  }

  // ── Helpers ──────────────────────────────────────────────────────────────

  blockLabel(type: BlockType): string { return BLOCK_LABELS[type]; }

  blockSummary(block: ContentBlock): string {
    const c = block.content;
    switch (block.blockType) {
      case 'RICH_TEXT': return ((c['body'] as string) ?? '').slice(0, 80) || '(empty)';
      case 'HERO': return (c['title'] as string) || '(no title)';
      case 'IMAGE': return (c['url'] as string) || '(no URL)';
      case 'HTML': return ((c['html'] as string) ?? '').slice(0, 80) || '(empty)';
      case 'DIVIDER': return `Style: ${c['style'] ?? 'thin'}`;
      case 'CTA': return (c['heading'] as string) || '(no heading)';
      case 'BLOG_FEED': return `${c['heading'] ?? 'Latest Posts'} · limit ${c['limit'] ?? 3}`;
      default: return '';
    }
  }
}
