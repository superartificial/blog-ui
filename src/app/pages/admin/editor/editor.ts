import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PostService } from '../../../services/post.service';
import { Post } from '../../../models';

@Component({
  selector: 'app-editor',
  imports: [FormsModule, RouterLink],
  templateUrl: './editor.html',
  styleUrl: './editor.scss',
})
export class Editor {
  private postService = inject(PostService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isEditing = signal(false);
  loading = signal(false);
  error = signal<string | null>(null);

  post: Post = {
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    published: false,
  };

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing.set(true);
      const navState = this.router.lastSuccessfulNavigation()?.extras?.state as { post?: Post };
      if (navState?.post) {
        this.post = { ...navState.post };
      } else {
        // No state — redirect back to dashboard
        this.router.navigate(['/admin']);
      }
    }
  }

  onTitleChange() {
    if (!this.isEditing()) {
      this.post.slug = this.slugify(this.post.title);
    }
  }

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  save() {
    if (!this.post.title.trim() || !this.post.slug.trim() || !this.post.content.trim()) {
      this.error.set('Title, slug, and content are required.');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    const request$ = this.isEditing()
      ? this.postService.updatePost(this.post.id!, this.post)
      : this.postService.createPost(this.post);

    request$.subscribe({
      next: () => this.router.navigate(['/admin']),
      error: (err) => {
        const msg = err.error?.error ?? 'Failed to save post. Please try again.';
        this.error.set(msg);
        this.loading.set(false);
      },
    });
  }
}
