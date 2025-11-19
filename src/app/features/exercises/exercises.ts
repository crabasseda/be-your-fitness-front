import { Component, inject, signal } from '@angular/core';
import { ExerciseDetailModal } from './components/exercise-detail-modal/exercise-detail-modal';
import { ExerciseList } from './components/exercise-list/exercise-list';
import { Exercise } from './models/exercises.interface';
import { ExercisesService } from './services/exercises.service';

@Component({
  selector: 'app-exercises',
  imports: [ExerciseList, ExerciseDetailModal],
  templateUrl: './exercises.html',
  styleUrl: './exercises.css',
})
export class Exercises {
  private _exercisesService = inject(ExercisesService);

  isModalOpen = signal<boolean>(false);
  selectedExercise = this._exercisesService.selectedExercise;

  onExerciseClick(exercise: Exercise) {
    this._exercisesService.getExerciseById(exercise.exerciseId);
    this.isModalOpen.set(true);
  }

  onCloseDetail() {
    this.isModalOpen.set(false);
  }
}
