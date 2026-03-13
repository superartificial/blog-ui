import { Injectable, signal } from '@angular/core';

export type NotificationType = 'success' | 'error' | 'info';

export interface Notification {
  id: number;
  message: string;
  type: NotificationType;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private nextId = 0;
  readonly notifications = signal<Notification[]>([]);

  success(message: string, duration = 4000) { this.show(message, 'success', duration); }
  error(message: string, duration = 5000) { this.show(message, 'error', duration); }
  info(message: string, duration = 4000) { this.show(message, 'info', duration); }

  private show(message: string, type: NotificationType, duration: number) {
    const id = ++this.nextId;
    this.notifications.update((list) => [...list, { id, message, type }]);
    if (duration > 0) setTimeout(() => this.dismiss(id), duration);
  }

  dismiss(id: number) {
    this.notifications.update((list) => list.filter((n) => n.id !== id));
  }
}
