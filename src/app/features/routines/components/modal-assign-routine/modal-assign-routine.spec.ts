import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAssignRoutine } from './modal-assign-routine';

describe('ModalAssignRoutine', () => {
  let component: ModalAssignRoutine;
  let fixture: ComponentFixture<ModalAssignRoutine>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalAssignRoutine],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalAssignRoutine);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
