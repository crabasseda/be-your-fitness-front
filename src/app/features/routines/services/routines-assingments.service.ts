import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { RoutineAssignmentResponse } from '../models/assignedRoutine.interface';

@Injectable({
  providedIn: 'root',
})
export class RoutinesAssignmentsService {
  private _http = inject(HttpClient);

  private _apiUrlAssignments = `${environment.apiUrl}/assignments`;

  assignedRoutinesResponse = signal<RoutineAssignmentResponse[]>([]);

  assignedRoutinesList = computed(() =>
    this.assignedRoutinesResponse().map((assignment) => assignment.routine_id),
  );

  getAssignedRoutines(athleteId: string) {
    this._http
      .get<RoutineAssignmentResponse[]>(`${this._apiUrlAssignments}/athlete/${athleteId}`)
      .subscribe((assignments) => {
        console.log(assignments);
        this.assignedRoutinesResponse.set(assignments);
      });
  }
}
