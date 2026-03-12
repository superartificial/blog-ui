import { Component, inject, signal } from '@angular/core';
import { ImageService } from '../../../services/image.service';
import { ImageItem, formatPostDate } from '../../../models';

@Component({
  selector: 'app-images-admin',
  imports: [],
  templateUrl: './images-admin.html',
  styleUrl: './images-admin.scss',
})
export class ImagesAdmin {
  private imageService = inject(ImageService);

  images = signal<ImageItem[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  deletingId = signal<number | null>(null);

  constructor() {
    this.load();
  }

  private load() {
    this.imageService.getImages().subscribe({
      next: (imgs) => {
        this.images.set(imgs);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Could not load images.');
        this.loading.set(false);
      },
    });
  }

  deleteImage(img: ImageItem) {
    if (img.referenceCount > 0) {
      if (!confirm(`"${img.filename}" is referenced by ${img.referenceCount} item(s). Delete anyway?`)) return;
    } else {
      if (!confirm(`Delete "${img.filename}"? This cannot be undone.`)) return;
    }
    this.deletingId.set(img.id);
    this.imageService.delete(img.id).subscribe({
      next: () => {
        this.images.update((list) => list.filter((i) => i.id !== img.id));
        this.deletingId.set(null);
      },
      error: () => this.deletingId.set(null),
    });
  }

  formatSize(bytes?: number): string {
    if (!bytes) return '—';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  formatDate(date: string | number[] | undefined): string {
    return formatPostDate(date);
  }
}
