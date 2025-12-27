import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, output, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'routine-card',
  imports: [CommonModule, MatMenuModule, MatIconModule, MatButtonModule],
  templateUrl: './routine-card.html',
  styleUrl: './routine-card.css',
  encapsulation: ViewEncapsulation.None,
})
export class RoutineCard {
  private _authService = inject(AuthService);

  isTrainer = this._authService.isTrainer();

  name = input<string>();
  items = input.required<any>();
  areOptionsAvailable = input<boolean>();

  startTraining = output<void>();
  edit = output<void>();
  delete = output<void>();
  assign = output<void>();

  formattedItems = computed(() => {
    return this.items().map((exercise: any) => exercise.exercise_name);
  });

  onStartTraining(): void {
    this.startTraining.emit();
  }

  onEdit(): void {
    this.edit.emit();
  }

  onDelete(): void {
    this.delete.emit();
  }

  onAssign(): void {
    this.assign.emit();
  }
}
