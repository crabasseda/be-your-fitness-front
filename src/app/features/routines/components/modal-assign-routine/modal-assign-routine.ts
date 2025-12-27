import { Component, inject, input, OnInit, output, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { AthleteCard } from '@features/athletes/components/athlete-card/athlete-card';
import { Routine } from '@features/routines/models/routine.interface';
import { User } from '@models/user.interface';
import { Modal } from '@shared/modal/modal';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'modal-assign-routine',
  imports: [Modal, AthleteCard, MatIcon],
  templateUrl: './modal-assign-routine.html',
})
export class ModalAssignRoutine implements OnInit {
  private _userService = inject(UserService);
  athletes = signal<User[]>([]);

  routine = input.required<Routine>();
  closeModal = output<void>();
  assignedAthletes = output<string[]>();

  selectedAthletes = signal<Set<string>>(new Set());

  ngOnInit() {
    this._userService.getAthletesByTrainerId().subscribe({
      next: (athletes) => {
        console.log(athletes);
        this.athletes.set(athletes);
      },
      error: (error) => {
        console.error('Error al cargar los atletas', error);
      },
    });

    const routine = this.routine();
    if (routine && routine.assigned_athletes) {
      this.selectedAthletes.set(new Set(routine.assigned_athletes));
    }
  }

  onSave() {
    this.assignedAthletes.emit(Array.from(this.selectedAthletes()));
  }

  onClose(): void {
    this.closeModal.emit();
  }

  onSelectionChanged(event: { athlete: User; selected: boolean }) {
    const selected = new Set(this.selectedAthletes());

    if (event.selected) {
      selected.add(event.athlete.id);
    } else {
      selected.delete(event.athlete.id);
    }

    this.selectedAthletes.set(selected);
  }

  isAthleteSelected(athleteId: string): boolean {
    return this.selectedAthletes().has(athleteId);
  }
}
