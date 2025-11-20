import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Routine } from '@features/routines/models/routine.interface';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CalendarData, CreateWorkoutDTO, Workout } from '../models/workout.interface';

@Injectable({
  providedIn: 'root',
})
export class WorkoutService {
  private _http = inject(HttpClient);
  private _apiUrl = `${environment.apiUrl}/workouts`;

  workoutRoutine = signal<Routine | null>(null);

  createWorkout(workoutData: CreateWorkoutDTO): Observable<Workout> {
    return this._http.post<Workout>(`${this._apiUrl}`, workoutData);
  }

  getRecentWorkouts(limit: number = 5): Observable<Workout[]> {
    return this._http.get<Workout[]>(`${this._apiUrl}/workouts`, {
      params: { limit: limit.toString(), sort: 'recent' },
    });
  }

  getWorkoutsForCalendar(year: number, month: number): Observable<CalendarData> {
    return this._http.get<CalendarData>(
      `${this._apiUrl}/calendar/month?year=${year}&month=${month}`,
    );
  }

  getWorkoutStats(): Observable<any> {
    return this._http.get(`${this._apiUrl}/stats/summary`);
  }
}
