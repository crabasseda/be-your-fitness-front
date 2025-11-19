import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CreateRoutineDTO, Routine, UpdateRoutineDto } from '../models/routine.interface';

@Injectable({
  providedIn: 'root',
})
export class RoutinesService {
  private _http = inject(HttpClient);
  private _apiUrl = `${environment.apiUrl}/routines`;

  getRoutines(): Observable<Routine[]> {
    return this._http.get<Routine[]>(this._apiUrl);
  }

  getRoutineById(id: string): Observable<Routine> {
    return this._http.get<Routine>(`${this._apiUrl}/${id}`);
  }

  createRoutine(routine: CreateRoutineDTO): Observable<Routine> {
    return this._http.post<Routine>(this._apiUrl, routine);
  }

  updateRoutine(id: string, routine: UpdateRoutineDto): Observable<Routine> {
    return this._http.put<Routine>(`${this._apiUrl}/${id}`, routine);
  }

  deleteRoutine(id: string): Observable<{ message: string }> {
    return this._http.delete<{ message: string }>(`${this._apiUrl}/${id}`);
  }
}
