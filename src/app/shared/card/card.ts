import { Component, input, output } from '@angular/core';
import { Chip } from '../chip/chip';
import { ChipType } from '../chip/models/chip.enum';

@Component({
  selector: 'byf-card',
  imports: [Chip],
  templateUrl: './card.html',
  styleUrl: './card.css',
})
export class Card {
  image = input<string>();
  title = input<string>();
  subtitle = input<string>();
  chips = input<string[]>();

  clicked = output<void>();

  ChipType = ChipType;

  onClick() {
    this.clicked.emit();
  }
}
