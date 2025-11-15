import { CommonModule } from '@angular/common';
import { Component, effect, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { ExerciseInRoutine, Set } from '@features/routines/models/routine.interface';

@Component({
  selector: 'exercise-workout-card',
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule, MatCheckboxModule],
  templateUrl: './exercise-workout-card.html',
  styleUrl: './exercise-workout-card.css',
})
export class ExerciseWorkoutCard {
  exercise = input.required<ExerciseInRoutine>();
  initialSets = input<Set[]>([]); // Nuevo input para sets pre-existentes
  sets = signal<Set[]>([{ set_number: 1, weight: 0, repetitions: 0, completed: false }]);
  exerciseUpdated = output<ExerciseInRoutine>();
  removeExercise = output<string>();

  constructor() {
    // Inicializar con valores pre-existentes si los hay
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

    effect(() => {
      const exerciseInRoutine: ExerciseInRoutine = {
        exercise_id: this.exercise().exercise_id,
        exercise_name: this.exercise().exercise_name,
        exercise_image: this.exercise().exercise_image,
        order_number: 0,
        note: '',
        sets: this.sets(),
      };
      this.exerciseUpdated.emit(exerciseInRoutine);
    });
  }

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
    this.removeExercise.emit(this.exercise().exercise_id);
  }

  private _updateSets(newSets: Set[]): void {
    this.sets.set(newSets);
  }
}
