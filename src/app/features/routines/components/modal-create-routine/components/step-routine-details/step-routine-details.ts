import { Component, effect, inject, output, signal } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { RoutineScheduleSelector } from '@features/routines/components/routine-schedule-selector/routine-schedule-selector';
import { RoutineSchedule } from '@features/routines/models/routine.interface';
import { ROUTINE_TYPES_CONFIG, RoutineType } from '@features/routines/models/routine.type';
import { CreateRoutineService } from '../../services/modal-create-routine.service';

@Component({
  selector: 'step-routine-details',
  imports: [MatDatepickerModule, MatInputModule, RoutineScheduleSelector],
  templateUrl: './step-routine-details.html',
  styleUrl: './step-routine-details.css',
})
export class StepRoutineDetails {
  private _createRoutineService = inject(CreateRoutineService);

  private _isScheduleValid = signal<boolean>(true);

  isValid = output<boolean>();

  routineName = this._createRoutineService.routineName;
  routineType = this._createRoutineService.routineType;
  currentSchedule = this._createRoutineService.currentSchedule;

  routineTypes = ROUTINE_TYPES_CONFIG;

  constructor() {
    effect(() => {
      this.isValid.emit(this.areDetailsValid());
    });
  }
  areDetailsValid(): boolean {
    return (
      this.routineName().trim().length > 0 && this.routineType() !== null && this._isScheduleValid()
    );
  }

  onNameChange(name: string): void {
    this.routineName.set(name);
  }

  onTypeChange(type: RoutineType): void {
    this.routineType.set(type);
  }

  onScheduleChange(schedule: RoutineSchedule | undefined) {
    this.currentSchedule.set(schedule);
  }

  onScheduleValidChange(isValid: boolean) {
    this._isScheduleValid.set(isValid);
  }
}
