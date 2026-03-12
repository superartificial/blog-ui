import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { ImageService } from '../../services/image.service';

@Component({
  selector: 'app-image-picker',
  templateUrl: './image-picker.html',
  styleUrl: './image-picker.scss',
})
export class ImagePicker {
  private imageService = inject(ImageService);

  @Input() url = '';
  @Input() label = 'Image';
  @Output() urlChange = new EventEmitter<string>();

  uploading = signal(false);
  error = signal<string | null>(null);
  /** Thumbnail URL — set after a fresh upload; used for the preview img to avoid loading a large image. */
  thumbnailUrl = signal<string>('');

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    input.value = '';

    this.uploading.set(true);
    this.error.set(null);
    this.imageService.upload(file).subscribe({
      next: (img) => {
        this.uploading.set(false);
        this.thumbnailUrl.set(img.thumbnailUrl ?? '');
        this.urlChange.emit(img.url);
      },
      error: () => {
        this.uploading.set(false);
        this.error.set('Upload failed.');
      },
    });
  }

  clear() {
    this.thumbnailUrl.set('');
    this.urlChange.emit('');
  }
}
