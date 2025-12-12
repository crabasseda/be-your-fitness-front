import { Component, inject, signal } from '@angular/core';
import { ExerciseDetailModal } from './components/exercise-detail-modal/exercise-detail-modal';
import { ExerciseList } from './components/exercise-list/exercise-list';
import { Exercise, ExtendedExercise } from './models/exercises.interface';
import { ExercisesService } from './services/exercises.service';

@Component({
  selector: 'exercises',
  imports: [ExerciseList, ExerciseDetailModal],
  templateUrl: './exercises.html',
  styleUrl: './exercises.css',
})
export class Exercises {
  private _exercisesService = inject(ExercisesService);

  isModalOpen = signal<boolean>(false);
  selectedExercise = signal<ExtendedExercise | null>(null);

  onExerciseClick(exercise: Exercise) {
    this._exercisesService.getExerciseById(exercise.exerciseId).subscribe({
      next: (exerciseDetail) => {
        this.selectedExercise.set(exerciseDetail);
        this.isModalOpen.set(true);
      },
      error: (error) => {
        console.error('Error al cargar el detalle del ejercicio:', error);
      },
    });
  }

  onCloseDetail() {
    this.isModalOpen.set(false);
  }
}
