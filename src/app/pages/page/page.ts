import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PageService } from '../../services/page.service';
import { AuthService } from '../../services/auth.service';
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
  protected authService = inject(AuthService);

  page = signal<Page | null>(null);
  loading = signal(true);
  notFound = signal(false);
  isPreview = signal(false);

  constructor() {
    const slug = this.route.snapshot.paramMap.get('slug') ?? '';
    const idParam = this.route.snapshot.queryParamMap.get('id');
    const previewId = idParam ? +idParam : null;

    this.isPreview.set(this.route.snapshot.queryParamMap.get('preview') === 'true');

    const fetch$ = previewId && this.authService.isLoggedIn()
      ? this.pageService.getPageById(previewId)
      : this.pageService.getPageBySlug(slug);

    fetch$.subscribe({
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
