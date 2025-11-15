import { HttpClient, HttpParams } from '@angular/common/http';
import { effect, inject, Injectable, signal } from '@angular/core';
import { catchError, map, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  Exercise,
  ExerciseDetailResponse,
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

  exerciseList = signal<Exercise[] | null>(null);

  equipmentList = signal<FiltersDataResponse[]>([]);
  bodyPartsList = signal<FiltersDataResponse[]>([]);

  selectedEquipment = signal<string | null>(null);
  selectedBodyPart = signal<string | null>(null);

  selectedExercise = signal<ExtendedExercise | null>(null);

  constructor() {
    effect(() => {
      if (this.selectedEquipment() || this.selectedBodyPart()) this.getExercises();
    });
  }
  getExercises() {
    let params = new HttpParams().set('offset', '0').set('limit', '25');
    const equipment = this.selectedEquipment();
    if (equipment) {
      params = params.set('equipments', equipment);
    }
    const bodyPart = this.selectedBodyPart();
    if (bodyPart) {
      params = params.set('bodyParts', bodyPart);
    }

    this._http
      .get<ExercisesResponse>(this._apiUrl + '/exercises', { params })
      .pipe(map((response) => response.data))
      .subscribe((data) => {
        this.exerciseList.set(data);
      });
  }

  getExerciseById(exerciseId: string) {
    this._http
      .get<ExerciseDetailResponse>(this._apiUrl + '/exercises/' + exerciseId)
      .pipe(map((response) => response.data))
      .subscribe((data) => {
        this.selectedExercise.set(data);
      });
  }

  getEquipments() {
    this._http
      .get<FiltersResponse>(this._apiUrl + '/equipments')
      .pipe(
        map((response) => response.data),
        catchError((error) => {
          console.error('Error al cargar equipos:', error);
          return of([]);
        }),
      )
      .subscribe((data) => {
        this.equipmentList.set(data);
      });
  }

  getBodyParts() {
    this._http
      .get<FiltersResponse>(this._apiUrl + '/bodyparts')
      .pipe(
        map((response) => response.data),
        catchError((error) => {
          console.error('Error al cargar bodyparts:', error);
          return of([]);
        }),
      )
      .subscribe((data) => {
        this.bodyPartsList.set(data);
      });
  }
}
