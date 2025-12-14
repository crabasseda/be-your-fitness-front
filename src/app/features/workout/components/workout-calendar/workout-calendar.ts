import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
  ViewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCalendar, MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { CalendarData, CalendarDayData } from '@features/workout/models/workout.interface';
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
export class WorkoutCalendar implements AfterViewInit {
  @ViewChild(MatCalendar) calendar!: MatCalendar<Date>;
  private _cdr = inject(ChangeDetectorRef);

  calendarData = input<CalendarData>({});
  monthChanged = output<{ year: number; month: number }>();

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
        this.onDateSelected(this.selectedDate());
        if (this.calendar) this.calendar.updateTodaysDate();
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

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.calendar) {
        this.calendar.stateChanges.subscribe(() => {
          const activeDate = this.calendar.activeDate;
          const year = activeDate.getFullYear();
          const month = activeDate.getMonth() + 1;

          if (year !== this.currentYear() || month !== this.currentMonth()) {
            this.currentYear.set(year);
            this.currentMonth.set(month);
            this.monthChanged.emit({ year, month });

            this.showDetails.set(false);
            this.selectedDayData.set(null);

            this._cdr.detectChanges();
          }
        });
      }
    }, 0);
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
}
