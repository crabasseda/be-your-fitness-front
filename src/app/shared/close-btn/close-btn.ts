import { Component, input, output } from '@angular/core';

@Component({
  selector: 'byf-close-btn',
  imports: [],
  templateUrl: './close-btn.html',
  styleUrl: './close-btn.css',
})
export class CloseBtn {
  bgColor = input<string>();
  svgColor = input<string>();
  closed = output<void>();

  triggerOnClose() {
    this.closed.emit();
  }
}
