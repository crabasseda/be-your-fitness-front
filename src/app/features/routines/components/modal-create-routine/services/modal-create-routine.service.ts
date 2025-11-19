import { Injectable, signal } from '@angular/core';
import { Exercise } from '@features/exercises/models/exercises.interface';
import { RoutineSchedule } from '@features/routines/models/routine.interface';
import { RoutineType } from '@features/routines/models/routine.type';

@Injectable({
  providedIn: 'root',
})
export class CreateRoutineService {
  selectedExercises = signal<Exercise[]>([]);

  routineName = signal<string>('');
  routineType = signal<RoutineType | null>(null);
  currentSchedule = signal<RoutineSchedule | undefined>(undefined);
}
