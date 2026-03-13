import { Component, computed, inject, signal } from '@angular/core';
import { ContactService } from '../../../services/contact.service';
import { ContactSubmission, formatPostDate } from '../../../models';
import { DialogService } from '../../../services/dialog.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-contacts',
  imports: [],
  templateUrl: './contacts.html',
  styleUrl: './contacts.scss',
})
export class Contacts {
  private contactService = inject(ContactService);
  private dialogService = inject(DialogService);
  private notifications = inject(NotificationService);

  submissions = signal<ContactSubmission[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  markingId = signal<number | null>(null);
  deletingId = signal<number | null>(null);
  filter = signal<'all' | 'unread' | 'read'>('all');

  filteredSubmissions = computed(() => {
    const f = this.filter();
    return this.submissions().filter((s) => {
      if (f === 'unread') return !s.read;
      if (f === 'read') return s.read;
      return true;
    });
  });

  constructor() {
    this.load();
  }

  private load() {
    this.contactService.getSubmissions().subscribe({
      next: (data) => {
        this.submissions.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Could not load contact submissions.');
        this.loading.set(false);
      },
    });
  }

  markRead(submission: ContactSubmission) {
    this.markingId.set(submission.id);
    this.contactService.markAsRead(submission.id).subscribe({
      next: () => {
        this.submissions.update((list) =>
          list.map((s) => (s.id === submission.id ? { ...s, read: true } : s))
        );
        this.markingId.set(null);
      },
      error: () => {
        this.markingId.set(null);
      },
    });
  }

  async deleteSubmission(submission: ContactSubmission) {
    const confirmed = await this.dialogService.confirm({
      title: 'Delete message',
      message: `Delete message from ${submission.name}? This cannot be undone.`,
      confirmLabel: 'Delete',
      danger: true,
    });
    if (!confirmed) return;
    this.deletingId.set(submission.id);
    this.contactService.deleteSubmission(submission.id).subscribe({
      next: () => {
        this.submissions.update((list) => list.filter((s) => s.id !== submission.id));
        this.deletingId.set(null);
        this.notifications.success('Message deleted.');
      },
      error: () => {
        this.deletingId.set(null);
        this.notifications.error('Failed to delete message.');
      },
    });
  }

  formatDate(date: string | number[] | undefined): string {
    return formatPostDate(date);
  }
}
