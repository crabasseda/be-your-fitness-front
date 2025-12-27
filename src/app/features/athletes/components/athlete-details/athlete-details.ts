import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '@core/services/notification.service';
import { WorkoutCalendar } from '@features/workout/components/workout-calendar/workout-calendar';
import { WorkoutStats } from '@features/workout/components/workout-stats/workout-stats';
import { CalendarData } from '@features/workout/models/workout.interface';
import { WorkoutService } from '@features/workout/services/workout.service';
import { User } from '@models/user.interface';
import { FeedbackService } from 'src/app/services/feedback.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'athlete-details',
  imports: [
    MatCard,
    MatIcon,
    WorkoutCalendar,
    WorkoutStats,
    MatCard,
    MatCardContent,
    MatButton,
    FormsModule,
  ],
  templateUrl: './athlete-details.html',
})
export class AthleteDetails implements OnInit {
  private _route = inject(ActivatedRoute);
  private _router = inject(Router);
  private _userService = inject(UserService);
  private _workoutService = inject(WorkoutService);
  private _feedbackService = inject(FeedbackService);
  private _notificationService = inject(NotificationService);

  athlete = signal<User | null>(null);
  calendarData = signal<CalendarData>({});
  athleteId = signal<string>('');

  feedbackText = signal<string>('');

  ngOnInit() {
    this.athleteId.set(this._route.snapshot.params['id']);
    this._loadAthleteDetails();
    this._loadCalendarData(new Date().getFullYear(), new Date().getMonth() + 1);
  }

  onMonthChanged(event: { year: number; month: number }) {
    this._loadCalendarData(event.year, event.month);
  }

  saveFeedback() {
    if (!this.feedbackText().trim()) {
      return;
    }

    this._feedbackService.createFeedback(this.athleteId(), this.feedbackText()).subscribe({
      next: () => {
        this._notificationService.success('Mensaje enviado al atleta');
        this.feedbackText.set('');
      },
      error: (error) => {
        console.error('Error al enviar feedback:', error);
        this._notificationService.error('Error al enviar el mensaje');
      },
    });
  }

  private _loadCalendarData(year: number, month: number) {
    this._workoutService.getWorkoutsForCalendar(year, month, this.athleteId()).subscribe({
      next: (data) => {
        this.calendarData.set(data);
      },
    });
  }

  private _loadAthleteDetails() {
    this._userService.getUserById(this.athleteId()).subscribe({
      next: (user) => {
        this.athlete.set(user);
      },
      error: (error) => {
        console.error('Error al cargar atleta:', error);
        this._router.navigate(['/athletes']);
      },
    });
  }
}
