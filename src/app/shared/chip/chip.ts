import { Component, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { ChipType } from './models/chip.enum';

@Component({
  selector: 'byf-chip',
  imports: [MatIcon],
  templateUrl: './chip.html',
  styleUrl: './chip.css',
})
export class Chip {
  text = input.required<string>();
  chipType = input.required<ChipType>();
  icon = input<string>();

  ChipType = ChipType;
}
