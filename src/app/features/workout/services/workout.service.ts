import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Routine, UpdateRoutineDto } from '@features/routines/models/routine.interface';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WorkoutService {
  private _http = inject(HttpClient);

  private _apiUrl = `${environment.apiUrl}/routines`;
  private _apiUrlAssignments = `${environment.apiUrl}/assignments`;

  workoutRoutine = signal<Routine | null>(null);

  // GET rutina por ID (detalle completo)
  getRoutineById(id: string) {
    this._http.get<Routine>(`${this._apiUrl}/${id}`).subscribe((res) => {
      console.log(res);
      this.workoutRoutine.set(res);
    });
  }

  // PUT actualizar rutina
  updateRoutine(id: string, routine: UpdateRoutineDto): Observable<Routine> {
    return this._http.put<Routine>(`${this._apiUrl}/${id}`, routine);
  }
}
