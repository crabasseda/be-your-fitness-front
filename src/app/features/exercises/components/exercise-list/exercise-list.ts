import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatIcon } from '@angular/material/icon';
import { Exercise } from '@features/exercises/models/exercises.interface';
import { ExercisesService } from '@features/exercises/services/exercises.service';
import { Chip } from '@shared/chip/chip';
import { ChipType } from '@shared/chip/models/chip.enum';
import { FilterDropdown } from '@shared/filter-dropdown/filter-dropdown';
import { FilterOption } from '@shared/filter-dropdown/models/filter-dropdown.interface';
import { Searchbar } from '@shared/searchbar/searchbar';
import { SimpleCard } from '@shared/simple-card/simple-card';

type ExerciseListMode = 'selection' | 'view';

@Component({
  selector: 'exercise-list',
  standalone: true,
  imports: [MatIcon, MatCheckbox, FilterDropdown, Searchbar, SimpleCard, Chip],
  templateUrl: './exercise-list.html',
  styleUrls: ['./exercise-list.css'],
})
export class ExerciseList {
  private _exercisesService = inject(ExercisesService);

  mode = input<ExerciseListMode>('view');
  showFilters = input(true);
  showSearchbar = input(true);
  showSelectionChip = input(true);

  exerciseClicked = output<Exercise>();
  exercisesSelected = output<Exercise[]>();

  exercisesList = this._exercisesService.exerciseList;
  equipmentList = this._exercisesService.equipmentList;
  bodyPartsList = this._exercisesService.bodyPartsList;
  selectedEquipment = this._exercisesService.selectedEquipment;
  selectedBodyPart = this._exercisesService.selectedBodyPart;

  filteredExercises = signal<Exercise[] | null>(null);
  selectedExercisesIds = signal<Set<string>>(new Set());

  ChipType = ChipType;

  selectedCount = computed(() => this.selectedExercisesIds().size);

  selectedExercisesArray = computed(() => {
    const selectedIds = this.selectedExercisesIds();
    return this.exercisesList()?.filter((ex) => selectedIds.has(ex.exerciseId)) || [];
  });

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

  isSelectionMode = computed(() => this.mode() === 'selection');

  constructor() {
    effect(() => {
      if (this.exercisesList()) {
        this.filteredExercises.set(this.exercisesList());
      }
    });

    effect(() => {
      if (this.isSelectionMode() && this.selectedExercisesArray().length > 0) {
        this.exercisesSelected.emit(this.selectedExercisesArray());
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
    if (!this.isSelectionMode()) return;

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

  onExerciseClick(exercise: Exercise): void {
    if (this.isSelectionMode()) {
      this.toggleExerciseSelection(exercise.exerciseId);
    } else {
      this.exerciseClicked.emit(exercise);
    }
  }
}
