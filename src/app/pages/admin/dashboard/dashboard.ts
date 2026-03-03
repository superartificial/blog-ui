import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { PostService } from '../../../services/post.service';
import { Post, formatPostDate } from '../../../models';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  private postService = inject(PostService);
  private router = inject(Router);

  posts = signal<Post[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  deletingId = signal<number | null>(null);

  constructor() {
    this.loadPosts();
  }

  private loadPosts() {
    this.loading.set(true);
    this.postService.getPosts().subscribe({
      next: (posts) => {
        this.posts.set(posts);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Could not load posts.');
        this.loading.set(false);
      },
    });
  }

  editPost(post: Post) {
    this.router.navigate(['/admin/edit', post.id], { state: { post } });
  }

  deletePost(post: Post) {
    if (!post.id || !confirm(`Delete "${post.title}"?`)) return;

    this.deletingId.set(post.id);
    this.postService.deletePost(post.id).subscribe({
      next: () => {
        this.posts.update((list) => list.filter((p) => p.id !== post.id));
        this.deletingId.set(null);
      },
      error: () => {
        this.deletingId.set(null);
        alert('Failed to delete post.');
      },
    });
  }

  formatDate(date: string | number[] | undefined): string {
    return formatPostDate(date);
  }
}
