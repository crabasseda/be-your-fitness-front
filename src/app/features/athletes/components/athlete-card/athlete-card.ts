import { Component, input, output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { User } from '@models/user.interface';
import { Chip } from '@shared/chip/chip';
import { ChipType } from '@shared/chip/models/chip.enum';
type AthleteCardMode = 'view' | 'selection';

@Component({
  selector: 'athlete-card',
  imports: [MatCardModule, MatIconModule, MatCheckbox, Chip],
  templateUrl: './athlete-card.html',
  styleUrl: './athlete-card.css',
})
export class AthleteCard {
  athlete = input.required<User>();
  mode = input<AthleteCardMode>('view');
  isSelected = input<boolean>(false);

  cardClicked = output<User>();
  selectionChanged = output<{ athlete: User; selected: boolean }>();

  ChipType = ChipType;

  get fullName(): string {
    return `${this.athlete().name} ${this.athlete().surname}`;
  }

  get initials(): string {
    const athlete = this.athlete();
    return `${athlete.name.charAt(0)}${athlete.surname.charAt(0)}`.toUpperCase();
  }

  onCardClick(): void {
    if (this.mode() === 'selection') {
      this.toggleSelection();
    } else {
      this.cardClicked.emit(this.athlete());
    }
  }

  toggleSelection(): void {
    const newState = !this.isSelected();
    this.selectionChanged.emit({
      athlete: this.athlete(),
      selected: newState,
    });
  }
}
