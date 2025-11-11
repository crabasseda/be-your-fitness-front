import { Component, computed, effect, inject, signal } from '@angular/core';
import { Card } from '@shared/card/card';
import { FilterDropdown } from '@shared/filter-dropdown/filter-dropdown';
import { FilterOption } from '@shared/filter-dropdown/models/filter-dropdown.interface';
import { Searchbar } from '@shared/searchbar/searchbar';
import { ExerciseDetailModal } from './components/exercise-detail-modal/exercise-detail-modal';
import { Exercise } from './models/exercises.interface';
import { ExercisesService } from './services/exercises.service';

@Component({
  selector: 'app-exercises',
  imports: [Searchbar, Card, FilterDropdown, ExerciseDetailModal],
  templateUrl: './exercises.html',
  styleUrl: './exercises.css',
})
export class Exercises {
  private _exercisesService = inject(ExercisesService);

  isModalOpen = signal<boolean>(false);
  selectedExercise = this._exercisesService.selectedExercise;

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

  onCardClick(exercise: Exercise) {
    console.log(exercise);
    this._exercisesService.getExerciseById(exercise.exerciseId);
    this.isModalOpen.set(true);
  }

  onCloseDetail() {
    this.isModalOpen.set(false);
  }
}
