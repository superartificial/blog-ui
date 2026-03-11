import { Component, Input, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ContentBlock } from '../../../models';

@Component({
  selector: 'app-html-block',
  template: `<div class="html-block" [innerHTML]="rendered"></div>`,
})
export class HtmlBlock {
  private sanitizer = inject(DomSanitizer);

  rendered: SafeHtml = '';

  @Input() set block(val: ContentBlock) {
    // Trusted admin-authored HTML — bypass sanitization intentionally.
    this.rendered = this.sanitizer.bypassSecurityTrustHtml(
      (val.content['html'] as string) ?? ''
    );
  }
}
