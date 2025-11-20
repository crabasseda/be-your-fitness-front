import { CommonModule } from '@angular/common';
import { Component, computed, effect, input, output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import {
  CalendarData,
  CalendarDayData,
  WorkoutSummary,
} from '@features/workout/models/workout.interface';
import { Chip } from '@shared/chip/chip';
import { ChipType } from '@shared/chip/models/chip.enum';
import { CloseBtn } from '@shared/close-btn/close-btn';

@Component({
  selector: 'workout-calendar',
  standalone: true,
  imports: [
    CommonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    Chip,
    CloseBtn,
  ],
  templateUrl: './workout-calendar.html',
  styleUrls: ['./workout-calendar.css'],
})
export class WorkoutCalendar {
  calendarData = input<CalendarData>({});
  monthChanged = output<{ year: number; month: number }>();
  workoutClicked = output<WorkoutSummary>();

  selectedDate = signal<Date>(new Date());
  currentYear = signal<number>(new Date().getFullYear());
  currentMonth = signal<number>(new Date().getMonth() + 1);
  selectedDayData = signal<CalendarDayData | null>(null);
  showDetails = signal<boolean>(false);

  ChipType = ChipType;
  calendarKey = signal<number>(0);

  currentMonthName = computed(() => {
    const months = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ];
    return months[this.currentMonth() - 1];
  });

  workoutDays = computed(() => {
    const data = this.calendarData();
    if (!data || Object.keys(data).length === 0) {
      return [];
    }
    return Object.keys(data).map((day) => parseInt(day));
  });

  dateClass = (date: Date): string => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    if (month !== this.currentMonth() || year !== this.currentYear()) {
      return '';
    }

    const hasWorkout = this.workoutDays().includes(day);

    const selected = this.selectedDate();
    const isSelected =
      selected &&
      selected.getDate() === day &&
      selected.getMonth() + 1 === month &&
      selected.getFullYear() === year;

    let classes = '';
    if (hasWorkout) classes += 'has-workout ';
    if (isSelected) classes += 'selected-day ';

    return classes.trim();
  };

  constructor() {
    effect(() => {
      if (this.calendarData()) {
        this.calendarKey.update((k) => k + 1);
        this.onDateSelected(new Date());
      }
    });
  }

  onDateSelected(date: Date | null) {
    if (!date) return;

    this.selectedDate.set(date);
    const day = date.getDate();

    const dayData = this.calendarData()[day] || null;
    this.selectedDayData.set(dayData);
    this.showDetails.set(!!dayData);
  }

  closeDetails() {
    this.showDetails.set(false);
    this.selectedDayData.set(null);
  }

  formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}min`;
  }

  onWorkoutClick(workout: WorkoutSummary) {
    this.workoutClicked.emit(workout);
  }
}
