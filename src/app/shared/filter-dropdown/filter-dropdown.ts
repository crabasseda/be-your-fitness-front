import { CommonModule } from '@angular/common';
import { Component, input, output, ViewEncapsulation } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { FilterOption } from './models/filter-dropdown.interface';

@Component({
  selector: 'byf-filter-dropdown',
  imports: [CommonModule, MatSelectModule, MatFormFieldModule, MatIconModule],
  templateUrl: './filter-dropdown.html',
  styleUrl: './filter-dropdown.css',
  encapsulation: ViewEncapsulation.None,
})
export class FilterDropdown {
  options = input.required<FilterOption[]>();
  label = input<string>('Filtrar');
  placeholder = input<string>('Seleccionar...');
  selectedValue = input<string | null>(null);
  showAllOption = input<boolean>(true);

  selectionChanged = output<string | null>();

  onSelectionChange(value: string | null) {
    this.selectionChanged.emit(value);
  }
}
