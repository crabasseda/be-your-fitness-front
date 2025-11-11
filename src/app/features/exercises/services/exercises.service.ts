import { HttpClient, HttpParams } from '@angular/common/http';
import { effect, inject, Injectable, signal } from '@angular/core';
import { catchError, map, of } from 'rxjs';
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
  url = 'https://v2.exercisedb.dev/api/v1';

  exerciseList = signal<Exercise[] | null>(null);

  equipmentList = signal<FiltersDataResponse[]>([]);
  bodyPartsList = signal<FiltersDataResponse[]>([]);

  selectedEquipment = signal<string | null>(null);
  selectedBodyPart = signal<string | null>(null);

  selectedExercise = signal<ExtendedExercise | null>(null);

  constructor() {
    effect(() => {
      const equipment = this.selectedEquipment();
      const bodyPart = this.selectedBodyPart();

      this.getExercises();
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
      .get<ExercisesResponse>(this.url + '/exercises', { params })
      .pipe(map((response) => response.data))
      .subscribe((data) => {
        this.exerciseList.set(data);
      });
  }

  getExerciseById(exerciseId: string) {
    this._http
      .get<ExerciseDetailResponse>(this.url + '/exercises/' + exerciseId)
      .pipe(map((response) => response.data))
      .subscribe((data) => {
        this.selectedExercise.set(data);
        console.log(data);
      });
  }

  getEquipments() {
    this._http
      .get<FiltersResponse>(this.url + '/equipments')
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
      .get<FiltersResponse>(this.url + '/bodyparts')
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
