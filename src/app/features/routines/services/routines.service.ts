import { HttpClient, HttpParams } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { RoutineAssignmentResponse } from '../models/assignedRoutine.interface';
import {
  CreateRoutineDTO,
  Routine,
  RoutineCard,
  UpdateRoutineDto,
} from '../models/routine.interface';

@Injectable({
  providedIn: 'root',
})
export class RoutinesService {
  private _http = inject(HttpClient);

  private _apiUrl = `${environment.apiUrl}/routines`;

  private _apiUrlAssignments = `${environment.apiUrl}/assignments`;

  routinesList = signal<RoutineCard[]>([]);
  // Signal con las asignaciones completas
  assignedRoutinesResponse = signal<RoutineAssignmentResponse[]>([]);

  // Computed signal que extrae solo las rutinas
  assignedRoutinesList = computed(() =>
    this.assignedRoutinesResponse().map((assignment) => assignment.routine_id),
  );

  getAllRoutines(userId: string) {
    let params = new HttpParams();

    params = params.set('userId', userId);

    this._http.get<RoutineCard[]>(this._apiUrl, { params }).subscribe((res) => {
      console.log(res);
      this.routinesList.set(res);
    });
  }

  // GET rutina por ID (detalle completo)
  getRoutineById(id: string): Observable<Routine> {
    return this._http.get<Routine>(`${this._apiUrl}/${id}`);
  }

  // POST crear nueva rutina
  createRoutine(routine: CreateRoutineDTO): Observable<Routine> {
    return this._http.post<Routine>(this._apiUrl, routine);
  }

  // PUT actualizar rutina
  updateRoutine(id: string, routine: UpdateRoutineDto): Observable<Routine> {
    return this._http.put<Routine>(`${this._apiUrl}/${id}`, routine);
  }

  // DELETE eliminar rutina
  deleteRoutine(id: string): Observable<{ message: string }> {
    return this._http.delete<{ message: string }>(`${this._apiUrl}/${id}`);
  }

  // ASSIGNED ROUTINES
  getAssignedRoutines(athleteId: string) {
    this._http
      .get<RoutineAssignmentResponse[]>(`${this._apiUrlAssignments}/athlete/${athleteId}`)
      .subscribe((assignments) => {
        this.assignedRoutinesResponse.set(assignments);
      });
  }
}
