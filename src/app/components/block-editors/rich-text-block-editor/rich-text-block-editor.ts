import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { ImageService } from '../../../services/image.service';
import { FormsModule } from '@angular/forms';
import { MarkdownEditor } from '../../markdown-editor/markdown-editor';

@Component({
  selector: 'app-rich-text-block-editor',
  imports: [FormsModule, MarkdownEditor],
  template: `
    <div class="block-editor-field">
      <label>Content</label>
      <app-markdown-editor name="body" [(ngModel)]="body" (ngModelChange)="emit()" minHeight="200px" [imageUploadFn]="imageUploadFn" />
    </div>
  `,
})
export class RichTextBlockEditor implements OnInit {
  private imageService = inject(ImageService);

  @Input() content: Record<string, unknown> = {};
  @Output() contentChange = new EventEmitter<Record<string, unknown>>();

  body = '';

  readonly imageUploadFn = (
    file: File,
    onSuccess: (url: string) => void,
    onError: (error: string) => void
  ) => {
    this.imageService.upload(file).subscribe({
      next: (img) => onSuccess(img.url),
      error: () => onError('Image upload failed'),
    });
  };

  ngOnInit() {
    this.body = (this.content['body'] as string) ?? '';
  }

  emit() {
    this.contentChange.emit({ body: this.body });
  }
}
