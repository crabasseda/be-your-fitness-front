import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { User } from '@models/user.interface';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private _http = inject(HttpClient);
  private _apiUrl = environment.apiUrl;

  getUserById(userId: string): Observable<User> {
    return this._http.get<User>(`${this._apiUrl}/users/${userId}`);
  }

  getAthletesByTrainerId(): Observable<User[]> {
    return this._http.get<User[]>(`${this._apiUrl}/users`);
  }
}
