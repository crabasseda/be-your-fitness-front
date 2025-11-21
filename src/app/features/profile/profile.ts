import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent } from '@angular/material/card';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@core/auth/auth.service';
import { NotificationService } from '@core/services/notification.service';
import { WorkoutCalendar } from '@features/workout/components/workout-calendar/workout-calendar';
import { WorkoutStats } from '@features/workout/components/workout-stats/workout-stats';
import { WorkoutService } from '@features/workout/services/workout.service';
import { Chip } from '@shared/chip/chip';

@Component({
  selector: 'profile',
  imports: [MatIcon, MatButton, WorkoutCalendar, WorkoutStats, MatCard, MatCardContent, Chip],
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
  private _notificationService = inject(NotificationService);

  user = this._authService.getUser();
  workoutStats = signal<any>(null);
  calendarData = signal<any>(null);

  showSuccessBanner = signal<boolean>(false);
  lastCompletedWorkout = signal<any>(null);

  ngOnInit() {
    this._loadData();

    this._route.queryParams.subscribe((params) => {
      if (params['workoutSaved'] === 'true') {
        this.showSuccessBanner.set(true);
        this._showWorkoutCompletedNotification();

        this._router.navigate([], {
          queryParams: { workoutSaved: null },
          queryParamsHandling: 'merge',
        });
      }
    });
  }

  closeBanner() {
    this.showSuccessBanner.set(false);
  }

  onMonthChanged(event: { year: number; month: number }) {
    this._loadCalendarData(event.year, event.month);
  }

  private _showWorkoutCompletedNotification() {
    this._workoutService.getLastNWorkouts(1).subscribe((workouts) => {
      if (workouts.length > 0) {
        const workout = workouts[0];
        this._notificationService.success(` Rutina ${workout.routine_name} completada! 🎉`);
      }
    });
  }

  private _loadData() {
    const currentDate = new Date();
    this._loadCalendarData(currentDate.getFullYear(), currentDate.getMonth() + 1);
  }

  private _loadCalendarData(year: number, month: number) {
    this._workoutService.getWorkoutsForCalendar(year, month).subscribe((data) => {
      this.calendarData.set(data);
    });
  }
}
