import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PostCard } from '../../components/post-card/post-card';
import { PostService } from '../../services/post.service';
import { CategoryService } from '../../services/category.service';
import { PageService } from '../../services/page.service';
import { PostSummary } from '../../models';

@Component({
  selector: 'app-home',
  imports: [PostCard, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private postService = inject(PostService);
  private categoryService = inject(CategoryService);
  private pageService = inject(PageService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  posts = signal<PostSummary[]>([]);
  tags = signal<string[]>([]);
  activeTag = signal<string | null>(null);
  activeCategory = signal<string | null>(null);
  showHeader = signal(true);
  loading = signal(true);
  error = signal<string | null>(null);

  constructor() {
    this.postService.getTags().subscribe({ next: (t) => this.tags.set(t) });

    // Load "home" page config for showHeader setting; default to true if not found
    this.pageService.getPageBySlug('home').subscribe({
      next: (page) => this.showHeader.set(page.showHeader ?? true),
      error: () => this.showHeader.set(true),
    });

    this.route.queryParams.subscribe(params => {
      this.activeTag.set(params['tag'] ?? null);
      this.activeCategory.set(params['category'] ?? null);
      this.loadPosts();
    });
  }

  selectTag(tag: string) {
    const next = this.activeTag() === tag ? null : tag;
    this.router.navigate(['/'], { queryParams: next ? { tag: next } : {} });
  }

  private loadPosts() {
    this.loading.set(true);
    this.postService.getPosts(this.activeTag() ?? undefined, this.activeCategory() ?? undefined).subscribe({
      next: (posts) => { this.posts.set(posts); this.loading.set(false); },
      error: () => { this.error.set('Could not load posts. Please try again later.'); this.loading.set(false); },
    });
  }
}
