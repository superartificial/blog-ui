import { Component, Input, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ContentBlock } from '../../../models';
import { renderMarkdown } from '../../../utils/markdown';

@Component({
  selector: 'app-rich-text-block',
  template: `<div class="rich-text-block prose" [innerHTML]="rendered"></div>`,
  styleUrl: './rich-text-block.scss',
})
export class RichTextBlock {
  private sanitizer = inject(DomSanitizer);

  rendered: SafeHtml = '';

  @Input() set block(val: ContentBlock) {
    const body = (val.content['body'] as string) ?? '';
    this.rendered = this.sanitizer.bypassSecurityTrustHtml(renderMarkdown(body));
  }
}
