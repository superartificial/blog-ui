import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { PostService } from '../../services/post.service';
import { Post, formatPostDate } from '../../models';

@Component({
  selector: 'app-post',
  imports: [RouterLink],
  templateUrl: './post.html',
  styleUrl: './post.scss',
})
export class PostPage {
  private route = inject(ActivatedRoute);
  private postService = inject(PostService);
  private sanitizer = inject(DomSanitizer);

  post = signal<Post | null>(null);
  loading = signal(true);
  notFound = signal(false);

  constructor() {
    const slug = this.route.snapshot.paramMap.get('slug') ?? '';
    this.postService.getPost(slug).subscribe({
      next: (post) => {
        this.post.set(post);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.notFound.set(err.status === 404);
      },
    });
  }

  get safeContent(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.post()?.content ?? '');
  }

  formatDate(date: string | number[] | undefined): string {
    return formatPostDate(date);
  }
}
