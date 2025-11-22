import { CommonModule } from '@angular/common';
import { Component, effect, input, output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RoutineSchedule } from '@features/routines/models/routine.interface';

@Component({
  selector: 'routine-schedule-selector',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './routine-schedule-selector.html',
  styleUrl: './routine-schedule-selector.css',
})
export class RoutineScheduleSelector {
  initialSchedule = input<RoutineSchedule | undefined>(undefined);
  scheduleChange = output<RoutineSchedule | undefined>();
  validChange = output<boolean>();

  scheduleType = signal<'none' | 'one-time' | 'recurring'>('none');
  specificDate = signal<Date | null>(null);

  frequency = signal<'daily' | 'weekly' | 'monthly'>('weekly');
  selectedDaysOfWeek = signal<number[]>([]);
  dayOfMonth = signal<number>(1);
  startDate = signal<Date | null>(null);
  endDate = signal<Date | null>(null);

  daysOfWeek = [
    { value: 1, label: 'L' },
    { value: 2, label: 'M' },
    { value: 3, label: 'X' },
    { value: 4, label: 'J' },
    { value: 5, label: 'V' },
    { value: 6, label: 'S' },
    { value: 0, label: 'D' },
  ];

  monthDays = Array.from({ length: 31 }, (_, i) => i + 1);
  constructor() {
    effect(() => {
      const initial = this.initialSchedule();
      if (initial) {
        this._loadSchedule(initial);
      }
    });

    effect(() => {
      this.scheduleType();
      this.specificDate();
      this.frequency();
      this.selectedDaysOfWeek();
      this.dayOfMonth();
      this.startDate();
      this.endDate();

      this.scheduleChange.emit(this.buildSchedule());
    });
    effect(() => {
      this.scheduleType();
      this.specificDate();
      this.selectedDaysOfWeek();

      this.validChange.emit(this.isValid());
      console.log(this.isValid());
    });
  }

  toggleDayOfWeek(day: number) {
    const current = this.selectedDaysOfWeek();
    if (current.includes(day)) {
      this.selectedDaysOfWeek.set(current.filter((d) => d !== day));
    } else {
      this.selectedDaysOfWeek.set([...current, day].sort());
    }
  }

  private _loadSchedule(schedule: RoutineSchedule) {
    if (schedule.type === 'one-time') {
      this.scheduleType.set('one-time');
      this.specificDate.set(schedule.specificDate || null);
    } else if (schedule.type === 'recurring' && schedule.recurrence) {
      this.scheduleType.set('recurring');
      this.frequency.set(schedule.recurrence.frequency);

      if (schedule.recurrence.daysOfWeek) {
        this.selectedDaysOfWeek.set(schedule.recurrence.daysOfWeek);
      }
      if (schedule.recurrence.dayOfMonth) {
        this.dayOfMonth.set(schedule.recurrence.dayOfMonth);
      }
      if (schedule.recurrence.startDate) {
        this.startDate.set(schedule.recurrence.startDate);
      }
      if (schedule.recurrence.endDate) {
        this.endDate.set(schedule.recurrence.endDate);
      }
    }
  }

  buildSchedule(): RoutineSchedule | undefined {
    if (this.scheduleType() === 'none') {
      return undefined;
    }

    if (this.scheduleType() === 'one-time') {
      if (!this.specificDate()) return undefined;
      return {
        type: 'one-time',
        specificDate: this.specificDate()!,
      };
    }
    const recurrence: any = {
      frequency: this.frequency(),
    };

    if (this.frequency() === 'weekly') {
      if (this.selectedDaysOfWeek().length === 0) return undefined;
      recurrence.daysOfWeek = this.selectedDaysOfWeek();
    } else if (this.frequency() === 'monthly') {
      recurrence.dayOfMonth = this.dayOfMonth();
    }

    if (this.startDate()) {
      recurrence.startDate = this.startDate();
    }
    if (this.endDate()) {
      recurrence.endDate = this.endDate();
    }

    return {
      type: 'recurring',
      recurrence,
    };
  }
  isValid(): boolean {
    if (this.scheduleType() === 'none') return true;

    if (this.scheduleType() === 'one-time') {
      return !!this.specificDate();
    }

    if (this.scheduleType() === 'recurring') {
      if (this.frequency() === 'weekly') {
        return this.selectedDaysOfWeek().length > 0;
      }
      return true;
    }

    return false;
  }
}
