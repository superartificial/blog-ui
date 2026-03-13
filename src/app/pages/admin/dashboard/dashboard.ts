import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { PostService } from '../../../services/post.service';
import { PostSummary, formatPostDate } from '../../../models';
import { DialogService } from '../../../services/dialog.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  private postService = inject(PostService);
  private router = inject(Router);
  private dialogService = inject(DialogService);
  private notifications = inject(NotificationService);

  posts = signal<PostSummary[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  deletingId = signal<number | null>(null);
  statusFilter = signal<string>('all');

  filteredPosts = computed(() => {
    const f = this.statusFilter();
    return f === 'all' ? this.posts() : this.posts().filter((p) => p.status === f);
  });

  constructor() {
    this.loadPosts();
  }

  private loadPosts() {
    this.loading.set(true);
    this.postService.getAllPosts().subscribe({
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

  editPost(post: PostSummary) {
    this.router.navigate(['/admin/edit', post.id], { state: { post } });
  }

  async deletePost(post: PostSummary) {
    if (!post.id) return;
    const confirmed = await this.dialogService.confirm({
      title: 'Delete post',
      message: `Delete "${post.title}"? This cannot be undone.`,
      confirmLabel: 'Delete',
      danger: true,
    });
    if (!confirmed) return;

    this.deletingId.set(post.id);
    this.postService.deletePost(post.id).subscribe({
      next: () => {
        this.posts.update((list) => list.filter((p) => p.id !== post.id));
        this.deletingId.set(null);
        this.notifications.success('Post deleted.');
      },
      error: () => {
        this.deletingId.set(null);
        this.notifications.error('Failed to delete post.');
      },
    });
  }

  statusLabel(status: string | undefined): string {
    switch (status) {
      case 'PUBLISHED': return 'Published';
      case 'DRAFT': return 'Draft';
      case 'AWAITING_REVIEW': return 'Awaiting review';
      case 'ARCHIVED': return 'Archived';
      default: return status ?? '';
    }
  }

  formatDate(date: string | number[] | undefined): string {
    return formatPostDate(date);
  }
}
