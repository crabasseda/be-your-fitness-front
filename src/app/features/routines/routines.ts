import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { AuthService } from '@core/services/auth.service';
import { ChipType } from '@shared/chip/models/chip.enum';
import { ModalCreateRoutine } from './components/modal-create-routine/modal-create-routine';

import { Router } from '@angular/router';
import { NotificationService } from '@core/services/notification.service';
import { ConfirmationModal } from '@shared/confirmation-modal/confirmation-modal';
import { finalize } from 'rxjs';
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
  private _notificationService = inject(NotificationService);

  isAthlete = this._authService.isAthlete();
  isTrainer = this._authService.isTrainer();

  isLoading = signal(true);

  ChipType = ChipType;
  showConfirmationModal = signal(false);
  showCreateRoutineModal = signal<boolean>(false);
  showEditRoutineModal = signal<boolean>(false);

  user = this._authService.getUser();
  myRoutines = signal<Routine[]>([]);
  //myRoutines = this._routinesService.routinesList;
  //assignedRoutines = this._routinesService.assignedRoutinesList;

  selectedTabIndex!: number;
  routineIdToDelete = signal<string>('');
  routineIdToEdit = signal<string>('');

  ngOnInit() {
    this._loadRoutines();
    //this._routinesService.getAssignedRoutines(this.user!.id);
  }

  handleStartTraining(routineId: string): void {
    this._router.navigate(['/workout', routineId]);
  }

  handleEdit(routineId: string): void {
    this.onOpenEditRoutineModal();
    this.routineIdToEdit.set(routineId);
  }

  handleConfirmationDelete(routineId: string) {
    this.routineIdToDelete.set(routineId);
    this.showConfirmationModal.set(true);
  }

  handleDelete(): void {
    this._routinesService.deleteRoutine(this.routineIdToDelete()).subscribe({
      next: () => {
        this._routinesService.getRoutines();
        this.showConfirmationModal.set(false);

        this._notificationService.success('Rutina eliminada correctamente');
        this._loadRoutines();
      },
    });
  }

  handleUpdateRoutine(routine: Routine) {
    this._routinesService.updateRoutine(this.routineIdToEdit(), routine).subscribe({
      next: () => {
        this.onCloseEditRoutineModal();
        this._notificationService.success('Rutina editada exitosamente');
      },
    });
  }

  onTabChange(index: number): void {
    this.selectedTabIndex = index;
  }

  onOpenCreateRoutineModal(): void {
    this.showCreateRoutineModal.set(true);
  }

  onCloseCreateRoutineModal(shouldReload: boolean) {
    if (shouldReload) {
      this._loadRoutines();
    }
    this.showCreateRoutineModal.set(false);
  }

  onOpenEditRoutineModal(): void {
    this.showEditRoutineModal.set(true);
  }

  onCloseEditRoutineModal() {
    this.showEditRoutineModal.set(false);
    this.routineIdToEdit.set('');
  }

  private _loadRoutines() {
    this._routinesService
      .getRoutines()
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (routines) => {
          this.myRoutines.set(routines);
        },
      });
  }
}
