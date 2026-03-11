import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PageService } from '../../services/page.service';
import { Page } from '../../models';
import { BlockRenderer } from '../../components/blocks/block-renderer/block-renderer';

@Component({
  selector: 'app-page',
  imports: [BlockRenderer, RouterLink],
  templateUrl: './page.html',
  styleUrl: './page.scss',
})
export class PagePage {
  private route = inject(ActivatedRoute);
  private pageService = inject(PageService);

  page = signal<Page | null>(null);
  loading = signal(true);
  notFound = signal(false);

  constructor() {
    const slug = this.route.snapshot.paramMap.get('slug') ?? '';
    this.pageService.getPageBySlug(slug).subscribe({
      next: (page) => {
        this.page.set(page);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.notFound.set(err.status === 404);
      },
    });
  }
}
