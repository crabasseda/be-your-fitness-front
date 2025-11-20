import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { WorkoutService } from '@features/workout/services/workout.service';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private _http = inject(HttpClient);
  private _workoutService = inject(WorkoutService);

  private _apiUrl = `${environment.apiUrl}/workouts`;
}
