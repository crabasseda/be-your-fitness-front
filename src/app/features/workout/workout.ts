import { Component, computed, inject, OnDestroy, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { ExerciseWorkoutCard } from './components/exercise-workout-card/exercise-workout-card';
import { WorkoutService } from './services/workout.service';

@Component({
  selector: 'workout',
  imports: [MatIcon, MatButton, ExerciseWorkoutCard],
  templateUrl: './workout.html',
  styleUrl: './workout.css',
})
export class Workout implements OnDestroy {
  private _route = inject(ActivatedRoute);
  private _workoutService = inject(WorkoutService);
  private _startTime = Date.now();
  private _timerInterval?: number;

  workoutRoutine = this._workoutService.workoutRoutine;
  durationTime = signal<string>('00:00');

  workoutExercises = computed(() => {
    if (!this.workoutRoutine()) return;
    return this.workoutRoutine()!.exercises;
  });

  constructor() {
    this._startTimer();
  }
  ngOnInit() {
    const routineId = this._route.snapshot.paramMap.get('id') || '';
    this._workoutService.getRoutineById(routineId);
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
  }

  private _startTimer(): void {
    this._timerInterval = window.setInterval(() => {
      const elapsed = Date.now() - this._startTime;
      this.durationTime.set(this._formatDuration(elapsed));
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
