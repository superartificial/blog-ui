import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PostCard } from '../../components/post-card/post-card';
import { PostService } from '../../services/post.service';
import { CategoryService } from '../../services/category.service';
import { Category, PostSummary } from '../../models';

@Component({
  selector: 'app-home',
  imports: [PostCard, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private postService = inject(PostService);
  private categoryService = inject(CategoryService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  posts = signal<PostSummary[]>([]);
  tags = signal<string[]>([]);
  categories = signal<Category[]>([]);
  activeTag = signal<string | null>(null);
  activeCategory = signal<string | null>(null);
  activeCategoryLabel = signal<string | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  constructor() {
    this.postService.getTags().subscribe({ next: (t) => this.tags.set(t) });
    this.categoryService.getCategories().subscribe({ next: (c) => { this.categories.set(c); this.updateCategoryLabel(); } });

    // Drive all filtering from the URL — handles initial load, browser nav, and nav link clicks
    this.route.queryParams.subscribe(params => {
      this.activeTag.set(params['tag'] ?? null);
      this.activeCategory.set(params['category'] ?? null);
      this.updateCategoryLabel();
      this.loadPosts();
    });
  }

  private updateCategoryLabel() {
    const slug = this.activeCategory();
    if (!slug) { this.activeCategoryLabel.set(null); return; }
    for (const cat of this.categories()) {
      if (cat.slug === slug) { this.activeCategoryLabel.set(cat.name); return; }
      for (const child of cat.children ?? []) {
        if (child.slug === slug) { this.activeCategoryLabel.set(child.name); return; }
      }
    }
    // Categories may not be loaded yet — watch for them
    this.activeCategoryLabel.set(slug);
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
