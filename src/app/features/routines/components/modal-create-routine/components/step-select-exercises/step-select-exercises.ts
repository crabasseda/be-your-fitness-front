import { Component, computed, effect, inject, output, signal } from '@angular/core';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatIcon } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { Exercise } from '@features/exercises/models/exercises.interface';
import { ExercisesService } from '@features/exercises/services/exercises.service';
import { Chip } from '@shared/chip/chip';
import { ChipType } from '@shared/chip/models/chip.enum';
import { FilterDropdown } from '@shared/filter-dropdown/filter-dropdown';
import { FilterOption } from '@shared/filter-dropdown/models/filter-dropdown.interface';
import { Searchbar } from '@shared/searchbar/searchbar';
import { SimpleCard } from '@shared/simple-card/simple-card';
import { CreateRoutineService } from '../../services/modal-create-routine.service';

@Component({
  selector: 'step-select-exercises',
  imports: [MatIcon, FilterDropdown, Searchbar, SimpleCard, MatCheckbox, MatStepperModule, Chip],
  templateUrl: './step-select-exercises.html',
  styleUrl: './step-select-exercises.css',
})
export class StepSelectExercises {
  private _exercisesService = inject(ExercisesService);
  private _createRoutineService = inject(CreateRoutineService);

  closeModal = output<void>();
  createRoutine = output<any>();

  ChipType = ChipType;
  selectedCount = computed(() => this.selectedExercisesIds().size);
  selectedExercisesIds = signal<Set<string>>(new Set());

  selectedExercisesArray = computed(() => {
    const selectedIds = this.selectedExercisesIds();
    return this.exercisesList()!.filter((ex) => selectedIds.has(ex.exerciseId));
  });

  exercisesList = this._exercisesService.exerciseList;
  equipmentList = this._exercisesService.equipmentList;
  bodyPartsList = this._exercisesService.bodyPartsList;

  filteredExercises = signal<Exercise[] | null>(null);

  selectedEquipment = this._exercisesService.selectedEquipment;
  selectedBodyPart = this._exercisesService.selectedBodyPart;

  equipmentOptions = computed<FilterOption[]>(() => {
    if (!this.equipmentList()) return [];
    return this.equipmentList()!.map((equipment) => ({
      value: equipment.name,
      label: equipment.name
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' '),
    }));
  });

  bodyPartsOptions = computed<FilterOption[]>(() => {
    if (!this.bodyPartsList()) return [];
    return this.bodyPartsList()!.map((bodypart) => ({
      value: bodypart.name,
      label: bodypart.name
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' '),
    }));
  });

  constructor() {
    effect(() => {
      if (this.exercisesList()) {
        this.filteredExercises.set(this.exercisesList());
      }
    });

    effect(() => {
      if (this.selectedExercisesArray()) {
        this._createRoutineService.selectedExercises.set(this.selectedExercisesArray());
      }
    });
  }

  ngOnInit() {
    this._exercisesService.getExercises();
    this._exercisesService.getEquipments();
    this._exercisesService.getBodyParts();
  }

  onSearch(searchValue: string) {
    if (this.exercisesList()) {
      const exercises = this.exercisesList()!.filter((item) =>
        item.name.toLowerCase().includes(searchValue.toLowerCase()),
      );

      this.filteredExercises.set(exercises);
    }
  }

  onEquipmentChange(value: string | null) {
    this.selectedEquipment.set(value);
  }

  onBodyPartChange(value: string | null) {
    this.selectedBodyPart.set(value);
  }

  toggleExerciseSelection(exerciseId: string): void {
    const selected = new Set(this.selectedExercisesIds());

    if (selected.has(exerciseId)) {
      selected.delete(exerciseId);
    } else {
      selected.add(exerciseId);
    }

    this.selectedExercisesIds.set(selected);
  }

  isExerciseSelected(exercise: Exercise): boolean {
    return this.selectedExercisesIds().has(exercise.exerciseId);
  }

  getExercisesByIds(exerciseIds: string[]): Exercise[] {
    return this.exercisesList()!.filter((ex) => exerciseIds.includes(ex.exerciseId));
  }

  onConfirm(): void {
    const selected = this.exercisesList()?.filter((ex) =>
      this.selectedExercisesIds().has(ex.exerciseId),
    );
    this.createRoutine.emit(selected);
  }
}
