import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);

  username = '';
  password = '';
  loading = signal(false);
  error = signal<string | null>(null);

  submit() {
    if (!this.username || !this.password) {
      this.error.set('Please enter your username and password.');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.authService.login({ username: this.username, password: this.password }).subscribe({
      next: (res) => {
        if (res.token) {
          this.router.navigate(['/admin']);
        } else {
          this.error.set('Invalid credentials.');
          this.loading.set(false);
        }
      },
      error: () => {
        this.error.set('Invalid username or password.');
        this.loading.set(false);
      },
    });
  }
}
