import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { PostService } from '../../services/post.service';
import { Post, formatPostDate } from '../../models';
import { marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';
import DOMPurify from 'dompurify';

marked.use(markedHighlight({
  langPrefix: 'hljs language-',
  highlight(code, lang) {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext';
    return hljs.highlight(code, { language }).value;
  },
}));

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
  renderedContent = signal<SafeHtml>('');
  loading = signal(true);
  notFound = signal(false);

  constructor() {
    const slug = this.route.snapshot.paramMap.get('slug') ?? '';
    this.postService.getPost(slug).subscribe({
      next: (post) => {
        this.post.set(post);
        const html = marked.parse(post.content ?? '') as string;
        const clean = DOMPurify.sanitize(html);
        this.renderedContent.set(this.sanitizer.bypassSecurityTrustHtml(clean));
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
}
