import { ChangeDetectionStrategy, Component, inject, model, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@core/auth/auth.service';
import { WorkoutCalendar } from '@features/workout/components/workout-calendar/workout-calendar';
import { WorkoutStats } from '@features/workout/components/workout-stats/workout-stats';
import { WorkoutSummary } from '@features/workout/models/workout.interface';
import { WorkoutService } from '@features/workout/services/workout.service';

@Component({
  selector: 'profile',
  imports: [MatIcon, MatButton, WorkoutCalendar, WorkoutStats],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Profile {
  private _workoutService = inject(WorkoutService);
  private _authService = inject(AuthService);
  private _route = inject(ActivatedRoute);
  private _router = inject(Router);

  user = this._authService.getUser();
  workoutStats = signal<any>(null);
  calendarData = signal<any>(null);
  recentWorkouts = signal<any[]>([]);
  currentMonth = signal(new Date());

  selected = model<Date | null>(null);

  ngOnInit() {
    this.loadData();

    this._route.queryParams.subscribe((params) => {
      if (params['workoutSaved'] === 'true') {
        console.log('✅ Workout completado, recargando datos...');
        this.loadData();

        this._router.navigate([], {
          queryParams: { workoutSaved: null },
          queryParamsHandling: 'merge',
        });
      }
    });
  }

  loadData() {
    // this.loadStats();
    this.loadCalendarData(2025, 11);
  }

  loadCalendarData(year: number, month: number) {
    this._workoutService.getWorkoutsForCalendar(year, month).subscribe((data) => {
      this.calendarData.set(data);
    });
  }

  onMonthChanged(event: { year: number; month: number }) {
    this.loadCalendarData(event.year, event.month);
  }

  onWorkoutClicked(workout: WorkoutSummary) {
    console.log('Workout clicked:', workout);
    // Navegar a detalles o abrir modal
  }

  // loadRecentWorkouts() {
  //   this._workoutService.getRecentWorkouts(5).subscribe({
  //     next: (workouts) => {
  //       console.log('🏋️ Últimos workouts:', workouts);
  //       this.recentWorkouts.set(workouts);
  //     }
  //   });
  // }
}
