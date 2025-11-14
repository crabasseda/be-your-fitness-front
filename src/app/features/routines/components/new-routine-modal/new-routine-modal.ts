import { Component, output } from '@angular/core';

@Component({
  selector: 'new-routine-modal',
  imports: [],
  templateUrl: './new-routine-modal.html',
  styleUrl: './new-routine-modal.css',
})
export class NewRoutineModal {
  closeModal = output<void>();

  onClose() {
    this.closeModal.emit();
  }
}
