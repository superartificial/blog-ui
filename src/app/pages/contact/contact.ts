import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ContactService } from '../../services/contact.service';

@Component({
  selector: 'app-contact',
  imports: [FormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class ContactPage {
  private contactService = inject(ContactService);

  name = '';
  email = '';
  message = '';
  website = ''; // honeypot

  loading = signal(false);
  success = signal(false);
  error = signal<string | null>(null);

  submit() {
    if (!this.name.trim() || !this.email.trim() || !this.message.trim()) {
      this.error.set('Please fill in all fields.');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.contactService
      .submit({ name: this.name, email: this.email, message: this.message, website: this.website })
      .subscribe({
        next: () => {
          this.success.set(true);
          this.loading.set(false);
        },
        error: (err) => {
          const msg = err?.error?.error ?? 'Something went wrong. Please try again.';
          this.error.set(msg);
          this.loading.set(false);
        },
      });
  }
}
