import { Component, effect, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { AuthService } from '@core/auth/auth.service';
import { ChipType } from '@shared/chip/models/chip.enum';
import { ModalCreateRoutine } from './components/modal-create-routine/modal-create-routine';

import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ConfirmationModal } from '@shared/confirmation-modal/confirmation-modal';
import { ModalEditRoutine } from './components/modal-edit-routine/modal-edit-routine';
import { RoutineCard } from './components/routine-card/routine-card';
import { Routine } from './models/routine.interface';
import { RoutinesService } from './services/routines.service';

@Component({
  selector: 'app-routines',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    RoutineCard,
    ModalCreateRoutine,
    ConfirmationModal,
    ModalEditRoutine,
  ],
  templateUrl: './routines.html',
  styleUrl: './routines.css',
})
export class Routines {
  private _router = inject(Router);
  private _routinesService = inject(RoutinesService);
  private _authService = inject(AuthService);
  private _snackBar = inject(MatSnackBar);

  ChipType = ChipType;
  showConfirmationModal = signal(false);
  showCreateRoutineModal = signal<boolean>(false);
  showEditRoutineModal = signal<boolean>(false);

  user = this._authService.getUser();
  myRoutines = this._routinesService.routinesList;
  assignedRoutines = this._routinesService.assignedRoutinesList;

  selectedTabIndex!: number;
  routineIdToDelete = signal<string>('');
  routineIdToEdit = signal<string>('');

  constructor() {
    effect(() => console.log(this.assignedRoutines()));
  }

  ngOnInit() {
    this._routinesService.getAllRoutines(this.user!.id);
    this._routinesService.getAssignedRoutines(this.user!.id);
  }

  handleStartTraining(routineId: string): void {
    this._router.navigate(['/workout', routineId]);
  }

  handleEdit(routineId: string): void {
    this.onOpenEditRoutineModal();
    this.routineIdToEdit.set(routineId);
    console.log('Editando rutina...');
  }

  handleConfirmationDelete(routineId: string) {
    this.routineIdToDelete.set(routineId);
    this.showConfirmationModal.set(true);
  }

  handleDelete(): void {
    this._routinesService.deleteRoutine(this.routineIdToDelete()).subscribe({
      next: (response) => {
        console.log('Rutina eliminada:', response.message);
        this._routinesService.getAllRoutines(this.user!.id);
        this.showConfirmationModal.set(false);
        this._snackBar.open(`✅ Rutina eliminada correctamente`, 'Cerrar', {
          duration: 5000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['success-snackbar'],
        });
      },
      error: (error) => {
        console.error('Error al eliminar:', error);
        this._snackBar.open('❌ Error al eliminar la rutina. Inténtalo de nuevo.', 'Cerrar', {
          duration: 7000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['error-snackbar'],
        });
      },
    });
  }

  handleUpdateRoutine(routine: Routine) {
    this._routinesService.updateRoutine(this.routineIdToEdit(), routine).subscribe({
      next: (response) => {
        console.log(response);
        console.log('Rutina guardada exitosamente');
        this.onCloseEditRoutineModal();
        this._snackBar.open(`✅ Rutina "${response.name}" editada exitosamente`, 'Cerrar', {
          duration: 5000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['success-snackbar'],
        });
      },
      error: (error) => {
        console.error('Error al guardar rutina:', error);
        this._snackBar.open('❌ Error al crear la rutina. Inténtalo de nuevo.', 'Cerrar', {
          duration: 7000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['error-snackbar'],
        });
      },
    });
  }

  onTabChange(index: number): void {
    this.selectedTabIndex = index;
  }

  onOpenCreateRoutineModal(): void {
    this.showCreateRoutineModal.set(true);
  }

  onCloseCreateRoutineModal() {
    this.showCreateRoutineModal.set(false);
  }

  onOpenEditRoutineModal(): void {
    this.showEditRoutineModal.set(true);
  }

  onCloseEditRoutineModal() {
    this.showEditRoutineModal.set(false);
    this.routineIdToEdit.set('');
  }
}
