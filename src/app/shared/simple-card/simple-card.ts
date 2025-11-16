import { Component, input, output } from '@angular/core';
import { Chip } from '../chip/chip';
import { ChipType } from '../chip/models/chip.enum';

@Component({
  selector: 'byf-card',
  imports: [Chip],
  templateUrl: './simple-card.html',
  styleUrl: './simple-card.css',
})
export class SimpleCard {
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
