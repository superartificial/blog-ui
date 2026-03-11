import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { PostService } from '../../services/post.service';
import { AuthService } from '../../services/auth.service';
import { Post, formatPostDate } from '../../models';
import { renderMarkdown } from '../../utils/markdown';

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
  authService = inject(AuthService);

  post = signal<Post | null>(null);
  renderedContent = signal<SafeHtml>('');
  renderedHumanIntro = signal<SafeHtml | null>(null);
  renderedAiNotes = signal<SafeHtml | null>(null);
  loading = signal(true);
  notFound = signal(false);

  constructor() {
    const slug = this.route.snapshot.paramMap.get('slug') ?? '';
    this.postService.getPost(slug).subscribe({
      next: (post) => {
        this.post.set(post);
        this.renderedContent.set(this.sanitizer.bypassSecurityTrustHtml(renderMarkdown(post.content ?? '')));
        if (post.humanIntro?.trim()) {
          this.renderedHumanIntro.set(this.sanitizer.bypassSecurityTrustHtml(renderMarkdown(post.humanIntro)));
        }
        if (post.aiNotes?.trim()) {
          this.renderedAiNotes.set(this.sanitizer.bypassSecurityTrustHtml(renderMarkdown(post.aiNotes)));
        }
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.notFound.set(err.status === 404);
      },
    });
  }

  formatDate(date: string | number[] | undefined): string {
    return formatPostDate(date);
  }

  statusLabel(status: string): string {
    switch (status) {
      case 'DRAFT': return 'Draft — not publicly visible';
      case 'AWAITING_REVIEW': return 'Awaiting review — not publicly visible';
      case 'ARCHIVED': return 'Archived — not publicly visible';
      default: return status;
    }
  }

  scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }
}
