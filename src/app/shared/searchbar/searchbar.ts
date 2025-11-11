import { Component, effect, output, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'byf-searchbar',
  imports: [MatFormFieldModule, MatInputModule, MatIconModule, FormsModule],
  templateUrl: './searchbar.html',
  styleUrl: './searchbar.css',
})
export class Searchbar {
  searchText: WritableSignal<string> = signal('');

  public searchChange = output<string>();

  constructor() {
    effect(() => {
      this.searchChange.emit(this.searchText());
    });
  }

  clearSearch() {
    this.searchText.set('');
    this.searchChange.emit(this.searchText());
  }
}
