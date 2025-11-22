import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Permission, rolePermissions } from '@models/permissions.constant';
import { Role, User } from '@models/user.interface';
import { catchError, firstValueFrom, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'token';
  private readonly USER_KEY = 'user';
  private _http = inject(HttpClient);
  private _apiUrl = environment.apiUrl;

  private _currentUser: User | null = null;

  async login(username: string, password: string): Promise<void> {
    try {
      const res: any = await firstValueFrom(
        this._http.post(`${this._apiUrl}/auth/login`, { username, password }).pipe(
          catchError(() => {
            return throwError(() => new Error('Credenciales incorrectas'));
          }),
        ),
      );

      localStorage.setItem(this.TOKEN_KEY, res.token);
      localStorage.setItem(this.USER_KEY, JSON.stringify(res.user));
      this._currentUser = res.user;
    } catch (err) {
      throw err;
    }
  }

  logout() {
    this._currentUser = null;
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  isUserInStorage(): boolean {
    if (!this._isBrowser()) return false;
    return !!localStorage?.getItem(this.TOKEN_KEY);
  }

  getUser(): User | null {
    if (!this.isUserInStorage()) return null;
    const storageUser = localStorage.getItem(this.USER_KEY);
    return JSON.parse(storageUser!);
  }

  hasRole(role: Role): boolean {
    return this._currentUser?.role === role;
  }

  hasPermission(permission: Permission): boolean {
    if (!this._currentUser) return false;
    return rolePermissions[this._currentUser.role].includes(permission);
  }

  private _isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }
}
