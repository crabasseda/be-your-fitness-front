import { Component, effect, inject, input, output, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { RoutineExerciseCard } from '@features/routines/components/routine-exercise-card/routine-exercise-card';
import { ExerciseInRoutine, Routine } from '@features/routines/models/routine.interface';
import { RoutinesService } from '@features/routines/services/routines.service';
import { ConfirmationModal } from '@shared/confirmation-modal/confirmation-modal';
import { Modal } from '@shared/modal/modal';

@Component({
  selector: 'modal-edit-routine',
  imports: [Modal, RoutineExerciseCard, MatIcon, ConfirmationModal],
  templateUrl: './modal-edit-routine.html',
  styleUrl: './modal-edit-routine.css',
})
export class ModalEditRoutine {
  private _routinesService = inject(RoutinesService);

  showConfirmationModal = signal(false);

  routineId = input.required<string>();
  closeModal = output<void>();
  updatedRoutine = output<Routine>();

  routineToEdit = signal<Routine | null>(null);
  routineName = signal<string>('');
  updatedExercises = signal<ExerciseInRoutine[]>([]);

  constructor() {
    effect(() => {
      this._routinesService.getRoutineById(this.routineId()).subscribe({
        next: (response) => {
          this.routineToEdit.set(response);
          this.routineName.set(response.name);
          this.updatedExercises.set(response.exercises);
        },
        error: (error) => {
          console.error('Error al cargar rutina:', error);
        },
      });
    });
  }

  onExerciseUpdated(updatedExercise: ExerciseInRoutine): void {
    const currentExercises = this.updatedExercises();
    const index = currentExercises.findIndex(
      (ex) => ex.exercise_id === updatedExercise.exercise_id,
    );

    if (index !== -1) {
      const newExercises = [...currentExercises];
      newExercises[index] = updatedExercise;
      this.updatedExercises.set(newExercises);
    }
  }

  onNameChange(name: string): void {
    this.routineName.set(name);
  }

  handleUpdateRoutine(): void {
    this.showConfirmationModal.set(false);
    const originalRoutine = this.routineToEdit();

    if (!originalRoutine) {
      console.error('No hay rutina para actualizar');
      return;
    }

    const updatedRoutine: Routine = {
      ...originalRoutine,
      name: this.routineName(),
      exercises: this.updatedExercises(),
    };

    this.updatedRoutine.emit(updatedRoutine);
  }

  onClose(): void {
    this.closeModal.emit();
  }
}
