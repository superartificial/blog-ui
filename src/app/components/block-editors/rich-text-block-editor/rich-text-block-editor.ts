import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MarkdownEditor } from '../../markdown-editor/markdown-editor';

@Component({
  selector: 'app-rich-text-block-editor',
  imports: [FormsModule, MarkdownEditor],
  template: `
    <div class="block-editor-field">
      <label>Content</label>
      <app-markdown-editor name="body" [(ngModel)]="body" (ngModelChange)="emit()" minHeight="200px" />
    </div>
  `,
})
export class RichTextBlockEditor implements OnInit {
  @Input() content: Record<string, unknown> = {};
  @Output() contentChange = new EventEmitter<Record<string, unknown>>();

  body = '';

  ngOnInit() {
    this.body = (this.content['body'] as string) ?? '';
  }

  emit() {
    this.contentChange.emit({ body: this.body });
  }
}
