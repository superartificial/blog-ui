import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  template: '<p style="padding:2rem">Redirecting to login...</p>',
})
export class Login implements OnInit {
  private authService = inject(AuthService);

  ngOnInit() {
    this.authService.login();
  }
}
