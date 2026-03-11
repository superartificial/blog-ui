import { Component, Input, inject, signal, OnInit } from '@angular/core';
import { ContentBlock, PostSummary } from '../../../models';
import { PostService } from '../../../services/post.service';
import { PostCard } from '../../post-card/post-card';

@Component({
  selector: 'app-blog-feed-block',
  imports: [PostCard],
  templateUrl: './blog-feed-block.html',
  styleUrl: './blog-feed-block.scss',
})
export class BlogFeedBlock implements OnInit {
  private postService = inject(PostService);

  @Input() block!: ContentBlock;

  posts = signal<PostSummary[]>([]);
  loading = signal(true);

  get heading(): string { return this.block.content['heading'] as string ?? 'Latest Posts'; }
  get limit(): number { return this.block.content['limit'] as number ?? 3; }

  ngOnInit() {
    this.postService.getPosts().subscribe({
      next: (all) => {
        this.posts.set(all.slice(0, this.limit));
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
