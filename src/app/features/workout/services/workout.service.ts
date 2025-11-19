import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Routine, UpdateRoutineDto } from '@features/routines/models/routine.interface';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CreateWorkoutDTO, Workout } from '../models/workout.interface';

@Injectable({
  providedIn: 'root',
})
export class WorkoutService {
  private _http = inject(HttpClient);

  private _apiUrl2 = `${environment.apiUrl}/routines`;
  private _apiUrl = `${environment.apiUrl}/workouts`;

  workoutRoutine = signal<Routine | null>(null);

  // GET rutina por ID (detalle completo)
  getRoutineById(id: string) {
    this._http.get<Routine>(`${this._apiUrl2}/${id}`).subscribe((res) => {
      this.workoutRoutine.set(res);
    });
  }

  // PUT actualizar rutina
  updateRoutine(id: string, routine: UpdateRoutineDto): Observable<Routine> {
    return this._http.put<Routine>(`${this._apiUrl2}/${id}`, routine);
  }

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
