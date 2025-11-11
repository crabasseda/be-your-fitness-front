import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-home',
  imports: [MatSlideToggleModule, MatButtonModule, MatIconModule, MatCardModule, MatDivider],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private _authService = inject(AuthService);

  public user = this._authService.getUser();

  motivationalMessages: string[] = [
    'No pares cuando estés cansado, para cuando hayas terminado.',
    'El dolor es temporal, la satisfacción es para siempre.',
    'Hoy sufres para sonreír mañana. Vamos con todo.',
    'Solo tú puedes decidir lo fuerte que quieres llegar a ser.',
    'Una repetición más te acerca a tu mejor versión.',
  ];

  motivationalMessage: string = '';
  nextWorkoutText: string = '';

  ngOnInit() {
    this.pickRandomMotivationalMessage();
  }

  pickRandomMotivationalMessage() {
    const i = Math.floor(Math.random() * this.motivationalMessages.length);
    this.motivationalMessage = this.motivationalMessages[i];
  }
}
