import { Component, inject, signal } from '@angular/core';
import { PostCard } from '../../components/post-card/post-card';
import { PostService } from '../../services/post.service';
import { PostSummary } from '../../models';

@Component({
  selector: 'app-home',
  imports: [PostCard],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private postService = inject(PostService);

  posts = signal<PostSummary[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  constructor() {
    this.postService.getPosts().subscribe({
      next: (posts) => {
        this.posts.set(posts);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Could not load posts. Please try again later.');
        this.loading.set(false);
      },
    });
  }
}
