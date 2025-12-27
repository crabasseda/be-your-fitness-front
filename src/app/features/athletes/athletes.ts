import { Component, inject, OnInit, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
import { User } from '@models/user.interface';
import { UserService } from 'src/app/services/user.service';
import { AthleteCard } from './components/athlete-card/athlete-card';

@Component({
  selector: 'athletes',
  imports: [AthleteCard, MatIcon],
  templateUrl: './athletes.html',
})
export class Athletes implements OnInit {
  private _userService = inject(UserService);
  private _router = inject(Router);

  athletes = signal<User[]>([]);

  ngOnInit() {
    this._userService.getAthletesByTrainerId().subscribe({
      next: (athletes) => {
        this.athletes.set(athletes);
      },
      error: (error) => {
        console.error('Error al cargar los atletas', error);
      },
    });
  }

  onAthleteClicked(athlete: User) {
    this._router.navigate(['/athletes', athlete.id]);
  }
}
