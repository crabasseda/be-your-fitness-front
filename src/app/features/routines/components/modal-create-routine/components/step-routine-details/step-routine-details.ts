import { Component, effect, inject, output, signal } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '@core/auth/auth.service';
import { RoutineSchedule, RoutineType } from '@features/routines/models/routine.interface';
import { RoutineScheduleSelector } from '@shared/routine-schedule-selector/routine-schedule-selector';
import { CreateRoutineService } from '../../services/modal-create-routine.service';

@Component({
  selector: 'step-routine-details',
  imports: [MatDatepickerModule, MatInputModule, RoutineScheduleSelector],
  templateUrl: './step-routine-details.html',
  styleUrl: './step-routine-details.css',
})
export class StepRoutineDetails {
  private _authService = inject(AuthService);
  private _createRoutineService = inject(CreateRoutineService);

  private _isScheduleValid = signal<boolean>(true);

  public userId = this._authService.getUser()?.id;

  routineName = this._createRoutineService.routineName;
  routineType = this._createRoutineService.routineType;
  currentSchedule = this._createRoutineService.currentSchedule;

  isValid = output<boolean>();

  areDetailsValid(): boolean {
    return (
      this.routineName().trim().length > 0 && this.routineType() !== null && this._isScheduleValid()
    );
  }

  routineTypes: Array<{
    value: RoutineType;
    label: string;
    icon: string;
    description: string;
  }> = [
    {
      value: 'fuerza',
      label: 'Fuerza',
      icon: '💪',
      description: 'Enfocada en ganar fuerza máxima',
    },
    {
      value: 'hipertrofia',
      label: 'Hipertrofia',
      icon: '🏋️',
      description: 'Crecimiento muscular',
    },
    {
      value: 'resistencia',
      label: 'Resistencia',
      icon: '🏃',
      description: 'Mejorar resistencia muscular',
    },
    {
      value: 'mixto',
      label: 'Mixto',
      icon: '🔄',
      description: 'Combinación de diferentes tipos',
    },
    {
      value: 'movilidad',
      label: 'Movilidad',
      icon: '🧘',
      description: 'Estiramientos y flexibilidad',
    },
    {
      value: 'cardio',
      label: 'Cardio',
      icon: '❤️',
      description: 'Ejercicio cardiovascular',
    },
  ];

  constructor() {
    effect(() => {
      this.isValid.emit(this.areDetailsValid());
    });
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
