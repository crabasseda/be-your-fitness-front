import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CalendarData, CreateWorkoutDTO, Workout } from '../models/workout.interface';

@Injectable({
  providedIn: 'root',
})
export class WorkoutService {
  private _http = inject(HttpClient);
  private _apiUrl = `${environment.apiUrl}/workouts`;

  createWorkout(workoutData: CreateWorkoutDTO): Observable<Workout> {
    return this._http.post<Workout>(`${this._apiUrl}`, workoutData);
  }

  getRecentWorkouts(
    limit: number = 10,
    startDate?: string,
    endDate?: string,
    userId?: string,
  ): Observable<Workout[]> {
    let params = new HttpParams();

    if (startDate) {
      params = params.set('start_date', startDate);
      if (endDate) params = params.set('end_date', endDate);
    } else params = params.set('limit', limit.toString());

    if (userId) {
      params = params.set('user_id', userId);
    }

    return this._http.get<Workout[]>(`${this._apiUrl}/recent`, { params });
  }

  getLastNWorkouts(limit: number = 10, userId?: string): Observable<Workout[]> {
    return this.getRecentWorkouts(limit, undefined, undefined, userId);
  }

  getWorkoutsLastNDays(days: number, userId?: string): Observable<Workout[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    return this.getRecentWorkouts(
      undefined,
      startDate.toISOString().split('T')[0],
      undefined,
      userId,
    );
  }

  getWorkoutsInRange(startDate: string, endDate?: string): Observable<Workout[]> {
    return this.getRecentWorkouts(undefined, startDate, endDate);
  }

  getWorkoutsForCalendar(year: number, month: number, userId?: string): Observable<CalendarData> {
    let params = new HttpParams().set('year', year.toString()).set('month', month.toString());

    if (userId) {
      params = params.set('user_id', userId);
    }

    return this._http.get<CalendarData>(`${this._apiUrl}/calendar/month`, { params });
  }
}
