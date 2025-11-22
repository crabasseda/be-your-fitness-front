import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { UrlKey } from '@models/url';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'byf-layout',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {
  private _authService = inject(AuthService);
  private _router = inject(Router);

  public isLoggedIn = this._authService.isUserInStorage();

  handleSession() {
    if (this.isLoggedIn) {
      this._authService.logout();
      this._router.navigateByUrl(UrlKey.Login);
      return;
    }

    this._router.navigateByUrl(UrlKey.Login);
  }
}
