import { Component, inject, output, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '@core/auth/auth.service';
import { CreateRoutineDTO, ExerciseInRoutine } from '@features/routines/models/routine.interface';
import { RoutinesService } from '@features/routines/services/routines.service';
import { ExerciseCard } from '@shared/exercise-card/exercise-card';
import { Modal } from '@shared/modal/modal';
import { StepRoutineDetails } from './components/step-routine-details/step-routine-details';
import { StepSelectExercises } from './components/step-select-exercises/step-select-exercises';
import { CreateRoutineService } from './services/modal-create-routine.service';

@Component({
  selector: 'modal-create-routine',
  imports: [Modal, MatIcon, StepSelectExercises, ExerciseCard, StepRoutineDetails],
  templateUrl: './modal-create-routine.html',
  styleUrl: './modal-create-routine.css',
})
export class ModalCreateRoutine {
  private _createRoutineService = inject(CreateRoutineService);
  private _routinesService = inject(RoutinesService);
  private _authService = inject(AuthService);
  private _snackBar = inject(MatSnackBar);

  closeModal = output<void>();

  userId = this._authService.getUser()?.id;

  routineName = this._createRoutineService.routineName;
  routineType = this._createRoutineService.routineType;
  schedule = this._createRoutineService.currentSchedule;

  selectedExercises = this._createRoutineService.selectedExercises;

  currentStep = signal(1);
  readonly TOTAL_STEPS = 3;

  nextStep() {
    if (this.currentStep() < this.TOTAL_STEPS) {
      this.currentStep.update((step) => step + 1);
    }
  }

  previousStep() {
    if (this.currentStep() > 1) {
      this.currentStep.update((step) => step - 1);
    }
  }

  canProceedToNextStep(): boolean {
    return !!this.selectedExercises().length;
  }

  onClose() {
    this._resetModal();
    this.closeModal.emit();
  }
  exercisesInRoutine = signal<ExerciseInRoutine[]>([]);
  updateExerciseInRoutine(exerciseInRoutine: ExerciseInRoutine): void {
    this.exercisesInRoutine.update((exercises) => {
      const index = exercises.findIndex((ex) => ex.exercise_id === exerciseInRoutine.exercise_id);

      if (index === -1) {
        return [
          ...exercises,
          {
            ...exerciseInRoutine,
            order_number: exercises.length + 1,
          },
        ];
      } else {
        return exercises.map((ex) =>
          ex.exercise_id === exerciseInRoutine.exercise_id
            ? { ...exerciseInRoutine, order_number: ex.order_number }
            : ex,
        );
      }
    });
  }

  removeExerciseFromRoutine(exerciseId: string): void {
    this.selectedExercises.update((exercises) =>
      exercises.filter((ex) => ex.exerciseId !== exerciseId),
    );

    this.exercisesInRoutine.update((exercises) =>
      exercises
        .filter((ex) => ex.exercise_id !== exerciseId)
        .map((ex, index) => ({ ...ex, order_number: index + 1 })),
    );
  }

  areDetailsValid = signal<boolean>(false);
  isSaving = signal<boolean>(false);
  onSaveRoutine(): void {
    if (!this.areDetailsValid()) return;

    const routineData: CreateRoutineDTO = {
      name: this.routineName(),
      type: this.routineType()!,
      created_by: this.userId!,
      exercises: this.exercisesInRoutine(),
      schedule: this.schedule(),
    };

    this._routinesService.createRoutine(routineData).subscribe({
      next: (response) => {
        this.isSaving.set(false);

        this._snackBar.open(`✅ Rutina "${response.name}" creada exitosamente`, 'Cerrar', {
          duration: 5000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['success-snackbar'],
        });

        this._routinesService.getAllRoutines(this.userId!);
        this._resetModal();
        this.onClose();
      },
      error: (error) => {
        this.isSaving.set(false);

        this._snackBar.open('❌ Error al crear la rutina. Inténtalo de nuevo.', 'Cerrar', {
          duration: 7000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['error-snackbar'],
        });

        console.error('Error al crear rutina:', error);
      },
    });
  }

  private _resetModal() {
    this.routineName.set('');
    this.routineType.set(null);
    this.schedule.set(undefined);
  }
}
