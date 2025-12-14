import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Feedback } from '@models/feedback.interface';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class FeedbackService {
  private _http = inject(HttpClient);
  private _apiUrl = `${environment.apiUrl}/feedback`;

  createFeedback(athleteId: string, message: string): Observable<Feedback> {
    return this._http.post<Feedback>(this._apiUrl, { athlete_id: athleteId, message });
  }

  getLastFeedback(): Observable<Feedback | null> {
    return this._http.get<Feedback | null>(`${this._apiUrl}/last`);
  }

  getFeedbackHistory(limit = 10): Observable<Feedback[]> {
    return this._http.get<Feedback[]>(`${this._apiUrl}/history`, {
      params: { limit: limit.toString() },
    });
  }
}
