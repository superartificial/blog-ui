import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ImagePicker } from '../../image-picker/image-picker';

@Component({
  selector: 'app-image-block-editor',
  imports: [FormsModule, ImagePicker],
  template: `
    <div class="block-editor-fields">
      <div class="block-editor-field">
        <label>Image</label>
        <app-image-picker [url]="url" (urlChange)="url = $event; emit()" label="Block image" />
      </div>
      <div class="block-editor-field">
        <label>Alt text</label>
        <input type="text" [(ngModel)]="alt" (ngModelChange)="emit()" name="alt" placeholder="Describe the image" />
      </div>
      <div class="block-editor-field">
        <label>Caption <span class="optional">(optional)</span></label>
        <input type="text" [(ngModel)]="caption" (ngModelChange)="emit()" name="caption" placeholder="Image caption" />
      </div>
    </div>
  `,
})
export class ImageBlockEditor implements OnInit {
  @Input() content: Record<string, unknown> = {};
  @Output() contentChange = new EventEmitter<Record<string, unknown>>();

  url = '';
  alt = '';
  caption = '';

  ngOnInit() {
    this.url = (this.content['url'] as string) ?? '';
    this.alt = (this.content['alt'] as string) ?? '';
    this.caption = (this.content['caption'] as string) ?? '';
  }

  emit() {
    this.contentChange.emit({ url: this.url, alt: this.alt, caption: this.caption });
  }
}
