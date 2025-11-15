import { Component, input, output } from '@angular/core';
import { ExtendedExercise } from '@features/exercises/models/exercises.interface';
import { Chip } from '@shared/chip/chip';
import { ChipType } from '@shared/chip/models/chip.enum';
import { Modal } from '@shared/modal/modal';

@Component({
  selector: 'exercise-detail-modal',
  imports: [Chip, Modal],
  templateUrl: './exercise-detail-modal.html',
  styleUrl: './exercise-detail-modal.css',
})
export class ExerciseDetailModal {
  exercise = input.required<ExtendedExercise>();
  closeModal = output<void>();

  ChipType = ChipType;

  onClose() {
    this.closeModal.emit();
  }
}
