// exercise-card.component.ts
import { CommonModule } from '@angular/common';
import { Component, effect, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { Exercise } from '@features/exercises/models/exercises.interface';
import { ExerciseInRoutine, Set } from '@features/routines/models/routine.interface';

type CardMode = 'routine' | 'workout';

@Component({
  selector: 'exercise-card',
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule, MatCheckboxModule],
  templateUrl: './exercise-card.html',
  styleUrl: './exercise-card.css',
})
export class ExerciseCard {
  // Inputs
  mode = input<CardMode>('routine'); // 'routine' para edición, 'workout' para ejecución
  exercise = input.required<Exercise | ExerciseInRoutine>();
  initialSets = input<Set[]>();

  // Signals
  sets = signal<Set[]>([{ set_number: 1, weight: 0, repetitions: 0, completed: false }]);

  // Outputs
  exerciseUpdated = output<ExerciseInRoutine>();
  removeExercise = output<string>();

  constructor() {
    // Inicializar sets
    effect(
      () => {
        const initial = this.initialSets();
        if (initial && initial.length > 0) {
          this.sets.set(
            initial.map((set) => ({
              ...set,
              completed: set.completed ?? false,
            })),
          );
        }
      },
      { allowSignalWrites: true },
    );

    // Emitir cambios
    effect(() => {
      const ex = this.exercise();
      const exerciseInRoutine: ExerciseInRoutine = {
        exercise_id: this._getExerciseId(ex),
        exercise_name: this._getExerciseName(ex),
        exercise_image: this._getExerciseImage(ex),
        order_number: 0,
        note: '',
        sets: this.sets(),
      };
      this.exerciseUpdated.emit(exerciseInRoutine);
    });
  }

  // Getters para manejar ambos tipos de exercise
  get exerciseName(): string {
    return this._getExerciseName(this.exercise());
  }

  get exerciseType(): string | undefined {
    const ex = this.exercise();
    return 'exerciseType' in ex ? ex.exerciseType : undefined;
  }

  get exerciseImage(): string | undefined {
    return this._getExerciseImage(this.exercise());
  }

  get isWorkoutMode(): boolean {
    return this.mode() === 'workout';
  }

  get isRoutineMode(): boolean {
    return this.mode() === 'routine';
  }

  // Métodos públicos
  addSet(): void {
    const currentSets = this.sets();
    const newSetNumber = currentSets.length + 1;
    this._updateSets([
      ...currentSets,
      { set_number: newSetNumber, weight: 0, repetitions: 0, completed: false },
    ]);
  }

  removeSet(setNumber: number): void {
    const currentSets = this.sets();
    if (currentSets.length <= 1) return;

    const filteredSets = currentSets
      .filter((set) => set.set_number !== setNumber)
      .map((set, index) => ({
        ...set,
        set_number: index + 1,
      }));

    this._updateSets(filteredSets);
  }

  updateWeight(setNumber: number, weight: number): void {
    const currentSets = this.sets();
    const updatedSets = currentSets.map((set) =>
      set.set_number === setNumber ? { ...set, weight } : set,
    );
    this._updateSets(updatedSets);
  }

  updateReps(setNumber: number, reps: number): void {
    const currentSets = this.sets();
    const updatedSets = currentSets.map((set) =>
      set.set_number === setNumber ? { ...set, repetitions: reps } : set,
    );
    this._updateSets(updatedSets);
  }

  toggleCompleted(setNumber: number): void {
    const currentSets = this.sets();
    const updatedSets = currentSets.map((set) =>
      set.set_number === setNumber ? { ...set, completed: !set.completed } : set,
    );
    this._updateSets(updatedSets);
  }

  onRemoveExercise(): void {
    this.removeExercise.emit(this._getExerciseId(this.exercise()));
  }

  // Métodos privados
  private _updateSets(newSets: Set[]): void {
    this.sets.set(newSets);
  }

  private _getExerciseId(ex: Exercise | ExerciseInRoutine): string {
    return 'exerciseId' in ex ? ex.exerciseId : ex.exercise_id;
  }

  private _getExerciseName(ex: Exercise | ExerciseInRoutine): string {
    return 'name' in ex ? ex.name : ex.exercise_name;
  }

  private _getExerciseImage(ex: Exercise | ExerciseInRoutine): string | undefined {
    return 'imageUrl' in ex ? ex.imageUrl : ex.exercise_image;
  }
}
