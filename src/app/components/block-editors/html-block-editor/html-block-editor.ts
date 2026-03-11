import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-html-block-editor',
  imports: [FormsModule],
  template: `
    <div class="block-editor-field">
      <label>HTML</label>
      <textarea
        [(ngModel)]="html"
        (ngModelChange)="emit()"
        name="html"
        rows="8"
        placeholder="<div>Your HTML here…</div>"
        class="html-textarea"
      ></textarea>
    </div>
  `,
  styles: [`.html-textarea { font-family: monospace; font-size: 0.875rem; }`],
})
export class HtmlBlockEditor implements OnInit {
  @Input() content: Record<string, unknown> = {};
  @Output() contentChange = new EventEmitter<Record<string, unknown>>();

  html = '';

  ngOnInit() {
    this.html = (this.content['html'] as string) ?? '';
  }

  emit() {
    this.contentChange.emit({ html: this.html });
  }
}
