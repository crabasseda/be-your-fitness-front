import { ChangeDetectionStrategy, Component, inject, model, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@core/auth/auth.service';
import { CalendarData } from '@features/workout/models/workout.interface';
import { WorkoutService } from '@features/workout/services/workout.service';

@Component({
  selector: 'profile',
  imports: [MatIcon, MatButton, MatCardModule, MatNativeDateModule, MatDatepickerModule],
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

  user = this._authService.getUser;
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
    this.loadCalendar(this.currentMonth());
  }

  loadStats() {
    this._workoutService.getWorkoutStats().subscribe({
      next: (stats) => {
        console.log('📊 Stats cargadas:', stats);
        this.workoutStats.set(stats);
      },
    });
  }
  workoutDays: number[] = [];
  loadCalendar(date: Date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    this._workoutService.getWorkoutsForCalendar(year, month).subscribe((data: CalendarData) => {
      this.calendarData.set(data);

      // Extraer días con workouts para los puntitos
      this.workoutDays = Object.keys(data).map((day) => parseInt(day));

      console.log('Días con workout:', this.workoutDays);
      // Output: [15, 20, 25]
    });
  }

  // loadRecentWorkouts() {
  //   this._workoutService.getRecentWorkouts(5).subscribe({
  //     next: (workouts) => {
  //       console.log('🏋️ Últimos workouts:', workouts);
  //       this.recentWorkouts.set(workouts);
  //     }
  //   });
  // }

  onMonthChange(newDate: Date) {
    this.currentMonth.set(newDate);
    this.loadCalendar(newDate);
  }

  onDayClick(day: number) {
    console.log('Click en día:', day);
    // Mostrar modal con detalles del día
  }

  formatDate(date: Date): string {
    const now = new Date();
    const workoutDate = new Date(date);
    const diffDays = Math.floor((now.getTime() - workoutDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;

    return workoutDate.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
    });
  }

  formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}min`;
    }
    return `${minutes}min`;
  }

  getRoutineIcon(type: string): string {
    const icons: Record<string, string> = {
      fuerza: '💪',
      cardio: '❤️',
      hipertrofia: '🦾',
      resistencia: '🏃',
      movilidad: '🧘',
      mixto: '🔄',
    };
    return icons[type] || '🏋️';
  }
}
