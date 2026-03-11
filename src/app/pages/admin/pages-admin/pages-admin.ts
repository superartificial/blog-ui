import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { PageService } from '../../../services/page.service';
import { PageSummary, formatPostDate } from '../../../models';

@Component({
  selector: 'app-pages-admin',
  imports: [RouterLink],
  templateUrl: './pages-admin.html',
  styleUrl: './pages-admin.scss',
})
export class PagesAdmin {
  private pageService = inject(PageService);
  private router = inject(Router);

  pages = signal<PageSummary[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  deletingId = signal<number | null>(null);

  constructor() {
    this.loadPages();
  }

  private loadPages() {
    this.pageService.getAllPages().subscribe({
      next: (pages) => {
        this.pages.set(pages);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Could not load pages.');
        this.loading.set(false);
      },
    });
  }

  editPage(page: PageSummary) {
    this.router.navigate(['/admin/pages/edit', page.id]);
  }

  deletePage(page: PageSummary) {
    if (!confirm(`Delete page "${page.title}"? This cannot be undone.`)) return;

    this.deletingId.set(page.id);
    this.pageService.deletePage(page.id).subscribe({
      next: () => {
        this.pages.update((list) => list.filter((p) => p.id !== page.id));
        this.deletingId.set(null);
      },
      error: () => this.deletingId.set(null),
    });
  }

  statusLabel(status: string): string {
    switch (status) {
      case 'PUBLISHED': return 'Published';
      case 'DRAFT': return 'Draft';
      case 'AWAITING_REVIEW': return 'Awaiting review';
      case 'ARCHIVED': return 'Archived';
      default: return status;
    }
  }

  formatDate(date: string | number[] | undefined): string {
    return formatPostDate(date);
  }
}
