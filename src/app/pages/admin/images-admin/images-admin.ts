import { Component, inject, signal } from '@angular/core';
import { ImageService } from '../../../services/image.service';
import { ImageItem, formatPostDate } from '../../../models';
import { DialogService } from '../../../services/dialog.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-images-admin',
  imports: [],
  templateUrl: './images-admin.html',
  styleUrl: './images-admin.scss',
})
export class ImagesAdmin {
  private imageService = inject(ImageService);
  private dialogService = inject(DialogService);
  private notifications = inject(NotificationService);

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

  async deleteImage(img: ImageItem) {
    const message = img.referenceCount > 0
      ? `"${img.filename}" is referenced by ${img.referenceCount} item(s). Delete anyway?`
      : `Delete "${img.filename}"? This cannot be undone.`;
    const confirmed = await this.dialogService.confirm({
      title: 'Delete image',
      message,
      confirmLabel: 'Delete',
      danger: true,
    });
    if (!confirmed) return;
    this.deletingId.set(img.id);
    this.imageService.delete(img.id).subscribe({
      next: () => {
        this.images.update((list) => list.filter((i) => i.id !== img.id));
        this.deletingId.set(null);
        this.notifications.success('Image deleted.');
      },
      error: () => {
        this.deletingId.set(null);
        this.notifications.error('Failed to delete image.');
      },
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
