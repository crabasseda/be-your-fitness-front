import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  Exercise,
  ExerciseDetailResponse,
  ExerciseFilters,
  ExercisesResponse,
  ExtendedExercise,
  FiltersDataResponse,
  FiltersResponse,
} from '../models/exercises.interface';

@Injectable({
  providedIn: 'root',
})
export class ExercisesService {
  private _http = inject(HttpClient);
  private _apiUrl = environment.exercisesApiUrl;

  getExercises(filters: ExerciseFilters = {}): Observable<Exercise[]> {
    let params = new HttpParams().set('offset', '0').set('limit', '25');
    if (filters.equipment) {
      params = params.set('equipments', filters.equipment);
    }

    if (filters.bodyPart) {
      params = params.set('bodyParts', filters.bodyPart);
    }

    return this._http
      .get<ExercisesResponse>(`${this._apiUrl}/exercises`, { params })
      .pipe(map((response) => response.data));
  }

  getExerciseById(exerciseId: string): Observable<ExtendedExercise> {
    return this._http
      .get<ExerciseDetailResponse>(`${this._apiUrl}/exercises/${exerciseId}`)
      .pipe(map((response) => response.data));
  }

  getEquipments(): Observable<FiltersDataResponse[]> {
    return this._http
      .get<FiltersResponse>(`${this._apiUrl}/equipments`)
      .pipe(map((response) => response.data));
  }

  getBodyParts(): Observable<FiltersDataResponse[]> {
    return this._http
      .get<FiltersResponse>(`${this._apiUrl}/bodyparts`)
      .pipe(map((response) => response.data));
  }
}
