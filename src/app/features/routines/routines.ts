import { Component, computed, effect, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { AuthService } from '@core/auth/auth.service';
import { ChipType } from '@shared/chip/models/chip.enum';
import { NewRoutineModal } from './components/new-routine-modal/new-routine-modal';
import { RoutineCard } from './components/routine-card/routine-card';
import { RoutinesService } from './services/routines.service';

@Component({
  selector: 'app-routines',
  imports: [MatButtonModule, MatIconModule, MatTabsModule, RoutineCard, NewRoutineModal],
  templateUrl: './routines.html',
  styleUrl: './routines.css',
})
export class Routines {
  private _routinesService = inject(RoutinesService);
  private _authService = inject(AuthService);

  isModalOpen = signal<boolean>(false);

  user = this._authService.getUser();
  myRoutines = this._routinesService.routinesList;
  assignedRoutines = this._routinesService.assignedRoutinesList;
  myRoutinesExercises = computed(() => {
    return this.myRoutines()
      .flatMap((routine) => routine.exercises)
      .map((exercise) => exercise.exercise_name);
  });
  assignedRoutinesExercises = computed(() => {
    return this.assignedRoutines()
      .flatMap((routine) => routine.exercises)
      .map((exercise) => exercise.exercise_name);
  });

  selectedTabIndex!: number;

  constructor() {
    effect(() => console.log(this.assignedRoutines()));
  }

  ngOnInit() {
    this._routinesService.getAllRoutines(this.user!.id);
    this._routinesService.getAssignedRoutines(this.user!.id);
  }

  ChipType = ChipType;

  handleCreateRoutine(): void {
    this.isModalOpen.set(true);
  }

  handleStartTraining(routineId: string): void {
    console.log('Iniciando entrenamiento...');
  }

  handleEdit(routineId: string): void {
    console.log('Editando rutina...');
  }

  handleDelete(routineId: string): void {
    console.log('Eliminando rutina...');
  }

  onTabChange(index: number): void {
    this.selectedTabIndex = index;
  }

  onCloseModal() {
    this.isModalOpen.set(false);
  }
}
