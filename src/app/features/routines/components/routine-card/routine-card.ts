import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'routine-card',
  imports: [CommonModule, MatMenuModule, MatIconModule, MatButtonModule],
  templateUrl: './routine-card.html',
  styleUrl: './routine-card.css',
})
export class RoutineCard {
  name = input<string>();
  items = input<string[]>();
  areOptionsAvailable = input<boolean>();

  startTraining = output<void>();
  edit = output<void>();
  delete = output<void>();

  onStartTraining(): void {
    this.startTraining.emit();
  }

  onEdit(): void {
    this.edit.emit();
  }

  onDelete(): void {
    this.delete.emit();
  }
}
