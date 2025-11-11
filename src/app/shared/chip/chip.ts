import { Component, input } from '@angular/core';
import { ChipType } from './models/chip.enum';

@Component({
  selector: 'byf-chip',
  templateUrl: './chip.html',
  styleUrl: './chip.css',
})
export class Chip {
  text = input.required<string>();
  chipType = input.required<ChipType>();

  ChipType = ChipType;
}
