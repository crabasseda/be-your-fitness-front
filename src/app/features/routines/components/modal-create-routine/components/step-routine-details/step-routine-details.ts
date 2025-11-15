import { Component, effect, inject, output } from '@angular/core';
import { AuthService } from '@core/auth/auth.service';
import { RoutineType } from '@features/routines/models/routine.interface';
import { CreateRoutineService } from '../../services/modal-create-routine.service';

@Component({
  selector: 'step-routine-details',
  imports: [],
  templateUrl: './step-routine-details.html',
  styleUrl: './step-routine-details.css',
})
export class StepRoutineDetails {
  private _authService = inject(AuthService);
  private _createRoutineService = inject(CreateRoutineService);

  public userId = this._authService.getUser()?.id;

  routineName = this._createRoutineService.routineName;
  routineType = this._createRoutineService.routineType;

  isValid = output<boolean>();

  constructor() {
    effect(() => {
      if (this.areDetailsValid()) {
        console.log(this.areDetailsValid());
        this.isValid.emit(true);
      }
    });
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

  onNameChange(name: string): void {
    this.routineName.set(name);
  }

  onTypeChange(type: RoutineType): void {
    this.routineType.set(type);
  }

  areDetailsValid() {
    return this.routineName().trim().length > 0 && this.routineType() !== null;
  }
}
