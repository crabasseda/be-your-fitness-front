import { CommonModule } from '@angular/common';
import { Component, ContentChild, output, TemplateRef } from '@angular/core';
import { CloseBtn } from '@shared/close-btn/close-btn';

@Component({
  selector: 'byf-modal',
  imports: [CommonModule, CloseBtn],
  templateUrl: './modal.html',
  styleUrl: './modal.css',
})
export class Modal {
  @ContentChild('header') headerTemplate?: TemplateRef<any>;
  @ContentChild('body') bodyTemplate?: TemplateRef<any>;
  @ContentChild('footer') footerTemplate?: TemplateRef<any>;

  closeModal = output<void>();

  onClose() {
    this.closeModal.emit();
  }
}
