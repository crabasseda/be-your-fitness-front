import { Component, inject, output, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { NotificationService } from '@core/services/notification.service';
import { ExerciseList } from '@features/exercises/components/exercise-list/exercise-list';
import { Exercise } from '@features/exercises/models/exercises.interface';
import { RoutineExerciseCard } from '@features/routines/components/routine-exercise-card/routine-exercise-card';
import { CreateRoutineDTO, ExerciseInRoutine } from '@features/routines/models/routine.interface';
import { RoutinesService } from '@features/routines/services/routines.service';
import { Modal } from '@shared/modal/modal';
import { StepRoutineDetails } from './components/step-routine-details/step-routine-details';
import { ModalStep } from './models/modal-step.enum';
import { CreateRoutineService } from './services/modal-create-routine.service';

@Component({
  selector: 'modal-create-routine',
  imports: [Modal, MatIcon, RoutineExerciseCard, StepRoutineDetails, ExerciseList],
  templateUrl: './modal-create-routine.html',
  styleUrl: './modal-create-routine.css',
})
export class ModalCreateRoutine {
  private _createRoutineService = inject(CreateRoutineService);
  private _routinesService = inject(RoutinesService);
  private _notificationService = inject(NotificationService);

  closeModal = output<boolean>();

  isSaving = signal<boolean>(false);
  areDetailsValid = signal<boolean>(false);
  exercisesInRoutine = signal<ExerciseInRoutine[]>([]);

  ModalStep = ModalStep;

  routineName = this._createRoutineService.routineName;
  routineType = this._createRoutineService.routineType;
  schedule = this._createRoutineService.currentSchedule;

  selectedExercises = this._createRoutineService.selectedExercises;

  currentStep = signal(ModalStep.AddExercisesStep);
  readonly TOTAL_STEPS = 2;

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

  onClose(reloadRoutines: boolean) {
    this._resetModal();
    this.closeModal.emit(reloadRoutines);
  }

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

  onExercisesSelected(exercises: Exercise[]) {
    this._createRoutineService.selectedExercises.set(exercises);
  }

  onSaveRoutine(): void {
    if (!this.areDetailsValid()) return;

    const routineData: CreateRoutineDTO = {
      name: this.routineName(),
      type: this.routineType()!,
      exercises: this.exercisesInRoutine(),
      schedule: this.schedule(),
    };

    this._routinesService.createRoutine(routineData).subscribe({
      next: () => {
        this.isSaving.set(false);
        this._notificationService.success('Rutina creada exitosamente');
        this._resetModal();
        this.onClose(true);
      },
    });
  }

  private _resetModal() {
    this.routineName.set('');
    this.routineType.set(null);
    this.schedule.set(undefined);
  }
}
