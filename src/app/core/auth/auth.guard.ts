import { inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UrlKey } from '@models/url';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  private _authService = inject(AuthService);
  private _router = inject(Router);

  canActivate(): boolean {
    if (!this._authService.isUserInStorage()) {
      this._router.navigateByUrl(UrlKey.SimpleHome);
      return false;
    }
    return true;
  }
}
