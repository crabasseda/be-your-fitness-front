import { Injectable, signal } from '@angular/core';
import { Exercise } from '@features/exercises/models/exercises.interface';
import { RoutineType } from '@features/routines/models/routine.interface';

@Injectable({
  providedIn: 'root',
})
export class CreateRoutineService {
  selectedExercises = signal<Exercise[]>([]);

  routineName = signal<string>('');
  routineType = signal<RoutineType | null>(null);
}
