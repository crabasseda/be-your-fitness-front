import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Routine } from '@features/routines/models/routine.interface';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CreateWorkoutDTO, Workout } from '../models/workout.interface';

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

  getWorkoutsForCalendar(year: number, month: number): Observable<any> {
    return this._http.get(`${this._apiUrl}/calendar/month`, {
      params: { year: year.toString(), month: month.toString() },
    });
  }

  getWorkoutStats(): Observable<any> {
    return this._http.get(`${this._apiUrl}/stats/summary`);
  }
}
