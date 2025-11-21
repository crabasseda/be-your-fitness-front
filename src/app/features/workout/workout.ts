import { Component, computed, inject, OnDestroy, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@core/auth/auth.service';
import { ExerciseCard } from '@features/routines/components/exercise-card/exercise-card';
import { ExerciseInRoutine, Routine } from '@features/routines/models/routine.interface';
import { RoutinesService } from '@features/routines/services/routines.service';
import { ConfirmationModal } from '@shared/confirmation-modal/confirmation-modal';
import { CreateWorkoutDTO } from './models/workout.interface';
import { WorkoutService } from './services/workout.service';

@Component({
  selector: 'workout',
  imports: [MatIcon, MatButton, ExerciseCard, ConfirmationModal],
  templateUrl: './workout.html',
  styleUrl: './workout.css',
})
export class Workout implements OnDestroy {
  private _route = inject(ActivatedRoute);
  private _router = inject(Router);
  private _workoutService = inject(WorkoutService);
  private _routineService = inject(RoutinesService);
  private _authService = inject(AuthService);

  private _startTime = Date.now();
  private _timerInterval?: number;

  workoutRoutine = signal<Routine | null>(null);
  durationTime = signal<string>('00:00');
  showConfirmationModal = signal(false);
  user = this._authService.getUser();

  exercises = signal<ExerciseInRoutine[]>([]);
  workoutNotes = signal<string>('');
  elapsedSeconds = signal<number>(0);

  workoutExercises = computed(() => {
    if (!this.workoutRoutine()) return;
    return this.workoutRoutine()!.exercises;
  });

  constructor() {
    this._startTimer();
  }
  ngOnInit() {
    const routineId = this._route.snapshot.paramMap.get('id') || '';

    this._routineService.getRoutineById(routineId).subscribe({
      next: (routine) => {
        this.workoutRoutine.set(routine);

        this.exercises.set(this._initializeExercisesForWorkout(routine.exercises));
      },
    });
  }

  private _initializeExercisesForWorkout(
    routineExercises: ExerciseInRoutine[],
  ): ExerciseInRoutine[] {
    return routineExercises.map((ex) => ({
      exercise_id: ex.exercise_id,
      exercise_name: ex.exercise_name,
      exercise_image: ex.exercise_image || '',
      order_number: ex.order_number,
      note: ex.note,
      sets: ex.sets.map((set) => ({
        set_number: set.set_number,
        weight: set.weight,
        repetitions: set.repetitions,
        completed: false,
      })),
    }));
  }

  ngOnDestroy(): void {
    if (this._timerInterval) {
      clearInterval(this._timerInterval);
    }
  }

  finishWorkout(): void {
    if (this._timerInterval) {
      clearInterval(this._timerInterval);
    }
    const workoutData: CreateWorkoutDTO = {
      user_id: this.user!.id,
      routine_id: this.workoutRoutine()?._id,
      routine_name: this.workoutRoutine()!.name,
      routine_type: this.workoutRoutine()!.type,
      workout_date: new Date(),
      duration_seconds: this.elapsedSeconds(),
      exercises: this.exercises(),
      notes: this.workoutNotes(),
    };

    this._workoutService.createWorkout(workoutData).subscribe({
      next: () => {
        this.showConfirmationModal.set(false);
        this._router.navigate(['/profile'], {
          queryParams: { workoutSaved: 'true' },
        });
      },
    });
  }

  handleUpdateExercise(updatedExercise: ExerciseInRoutine) {
    const updatedExercises = this.exercises().map((ex) =>
      ex.exercise_id === updatedExercise.exercise_id ? updatedExercise : ex,
    );
    this.exercises.set(updatedExercises);
  }

  cancelWorkout(): void {
    if (confirm('¿Salir sin guardar el entrenamiento?')) {
      if (this._timerInterval) {
        clearInterval(this._timerInterval);
      }
      this._router.navigateByUrl('/routines');
    }
  }

  private _startTimer(): void {
    this._timerInterval = window.setInterval(() => {
      const elapsed = Math.floor((Date.now() - this._startTime) / 1000);
      this.elapsedSeconds.set(elapsed);
      this.durationTime.set(this._formatDuration(elapsed * 1000));
    }, 1000);
  }

  private _formatDuration(milliseconds: number): string {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0)
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
}
