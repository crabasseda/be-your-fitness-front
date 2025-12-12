import { DatePipe } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Router } from '@angular/router';
import { WorkoutService } from '@features/workout/services/workout.service';
import { Chip } from '@shared/chip/chip';
import { ChipType } from '@shared/chip/models/chip.enum';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'home',
  imports: [MatSlideToggleModule, MatButtonModule, MatIconModule, MatCardModule, Chip, DatePipe],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  private _authService = inject(AuthService);
  private _router = inject(Router);
  private _workoutService = inject(WorkoutService);

  public user = this._authService.getUser();

  stats = signal<any>(null);
  recentWorkouts = signal<any[]>([]);
  lastCompletedWorkout = signal<any>(null);
  weeklyGoal = signal<number>(4);

  ChipType = ChipType;

  motivationalMessages: string[] = [
    'No pares cuando estés cansado, para cuando hayas terminado.',
    'El dolor es temporal, la satisfacción es para siempre.',
    'Hoy sufres para sonreír mañana. Vamos con todo.',
    'Solo tú puedes decidir lo fuerte que quieres llegar a ser.',
    'Una repetición más te acerca a tu mejor versión.',
  ];

  motivationalMessage = '';

  weeklyStats = computed(() => this.stats()?.length);

  ngOnInit() {
    this._pickRandomMotivationalMessage();
    this._loadStats();
    this._loadRecentWorkouts();
  }

  getWeeklyProgress(): number {
    const current = this.weeklyStats() || 0;
    const goal = this.weeklyGoal();
    return Math.min((current / goal) * 100, 100);
  }

  formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
  }

  goToWorkout() {
    this._router.navigateByUrl('/routines');
  }

  private _loadStats() {
    this._workoutService.getWorkoutsInRange(this._firstDayWeek(), undefined).subscribe((stats) => {
      this.stats.set(stats);
    });
  }

  private _loadRecentWorkouts() {
    this._workoutService.getLastNWorkouts(3).subscribe((workouts) => {
      this.recentWorkouts.set(workouts);
    });
  }

  private _pickRandomMotivationalMessage() {
    const i = Math.floor(Math.random() * this.motivationalMessages.length);
    this.motivationalMessage = this.motivationalMessages[i];
  }

  private _firstDayWeek(): string {
    const today = new Date();
    const dayOfTheWeek = today.getDay();

    const diferencia = dayOfTheWeek === 0 ? -6 : 1 - dayOfTheWeek;

    const monday = new Date(today);
    monday.setDate(today.getDate() + diferencia);

    const year = monday.getFullYear();
    const month = String(monday.getMonth() + 1).padStart(2, '0');
    const day = String(monday.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
}
