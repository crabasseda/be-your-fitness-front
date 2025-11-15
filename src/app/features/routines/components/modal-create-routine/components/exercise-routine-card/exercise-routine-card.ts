import { CommonModule } from '@angular/common';
import { Component, effect, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Exercise } from '@features/exercises/models/exercises.interface';
import { ExerciseInRoutine, Set } from '@features/routines/models/routine.interface';

@Component({
  selector: 'exercise-routine-card',
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule],
  templateUrl: './exercise-routine-card.html',
  styleUrl: './exercise-routine-card.css',
})
export class ExerciseRoutineCard {
  exercise = input.required<Exercise>();
  sets = signal<Set[]>([{ set_number: 1, weight: 0, repetitions: 0 }]);

  exerciseUpdated = output<ExerciseInRoutine>();
  removeExercise = output<string>();

  constructor() {
    effect(() => {
      const exerciseInRoutine: ExerciseInRoutine = {
        exercise_id: this.exercise().exerciseId,
        exercise_name: this.exercise().name,
        exercise_image: this.exercise().imageUrl,
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
    this._updateSets([...currentSets, { set_number: newSetNumber, weight: 0, repetitions: 0 }]);
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

  onRemoveExercise(): void {
    this.removeExercise.emit(this.exercise().exerciseId);
  }

  private _updateSets(newSets: Set[]): void {
    this.sets.set(newSets);
  }
}
