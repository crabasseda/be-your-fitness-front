import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, signal } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { WorkoutService } from '@features/workout/services/workout.service';
import { Chip } from '@shared/chip/chip';
import { ChipType } from '@shared/chip/models/chip.enum';
import { ChartConfiguration, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { CHART_METRIC_CONFIGS, ChartMetric } from './models/chart-metric.enum';
import { DailyWorkoutData } from './models/workout-stats.interface';

@Component({
  selector: 'workout-stats',
  imports: [
    CommonModule,
    BaseChartDirective,
    MatButtonToggleModule,
    MatIconModule,
    MatCardModule,
    Chip,
  ],
  templateUrl: './workout-stats.html',
  styleUrls: ['./workout-stats.css'],
})
export class WorkoutStats {
  private _workoutService = inject(WorkoutService);

  userId = input<string | undefined>();

  selectedPeriod = signal<number>(7);
  selectedMetric = signal<ChartMetric>(ChartMetric.Duration);
  rawWorkouts = signal<any[]>([]);
  isLoading = signal<boolean>(true);

  dailyData = computed(() => this._processWorkoutsData(this.rawWorkouts(), this.selectedPeriod()));

  chartData = computed(() => this._buildChartData(this.dailyData(), this.selectedMetric()));

  summary = computed(() => this._calculateSummary(this.dailyData(), this.selectedMetric()));

  metricConfig = computed(() => CHART_METRIC_CONFIGS[this.selectedMetric()]);

  chartType: ChartType = 'line';

  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: (context) => {
            const config = CHART_METRIC_CONFIGS[this.selectedMetric()];
            return `${config.label}: ${context.parsed.y} ${config.unit}`;
          },
        },
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false,
        },
      },
      y: {
        display: true,
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
    },
  };

  ChartMetric = ChartMetric;
  ChipType = ChipType;

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading.set(true);
    const targetUserId = this.userId();
    this._workoutService.getWorkoutsLastNDays(this.selectedPeriod(), targetUserId).subscribe({
      next: (workouts) => {
        this.rawWorkouts.set(workouts);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading workouts:', error);
        this.isLoading.set(false);
      },
    });
  }

  changePeriod(period: number) {
    this.selectedPeriod.set(period);
    this.loadData();
  }

  changeMetric(metric: ChartMetric) {
    this.selectedMetric.set(metric);
  }

  private _processWorkoutsData(workouts: any[], days: number): DailyWorkoutData[] {
    const workoutsByDay = new Map<string, any[]>();
    workouts.forEach((workout) => {
      const date = new Date(workout.createdAt).toISOString().split('T')[0];
      if (!workoutsByDay.has(date)) {
        workoutsByDay.set(date, []);
      }
      workoutsByDay.get(date)!.push(workout);
    });

    const dailyData: DailyWorkoutData[] = [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (days - 1));

    for (let i = 0; i < days; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      const dateString = currentDate.toISOString().split('T')[0];

      const dayWorkouts = workoutsByDay.get(dateString) || [];

      dailyData.push({
        date: dateString,
        workout_count: dayWorkouts.length,
        total_duration_minutes: this._calculateDuration(dayWorkouts),
        total_volume: this._calculateVolume(dayWorkouts),
        total_reps: this._calculateReps(dayWorkouts),
      });
    }

    return dailyData;
  }

  private _calculateDuration(workouts: any[]): number {
    return Math.round(workouts.reduce((sum, w) => sum + w.duration_seconds / 60, 0));
  }

  private _calculateVolume(workouts: any[]): number {
    return workouts.reduce((sum, workout) => {
      return (
        sum +
        workout.exercises.reduce((exSum: number, exercise: any) => {
          return (
            exSum +
            exercise.sets
              .filter((set: any) => set.completed)
              .reduce((setSum: number, set: any) => setSum + set.weight * set.repetitions, 0)
          );
        }, 0)
      );
    }, 0);
  }

  private _calculateReps(workouts: any[]): number {
    return workouts.reduce((sum, workout) => {
      return (
        sum +
        workout.exercises.reduce((exSum: number, exercise: any) => {
          return (
            exSum +
            exercise.sets
              .filter((set: any) => set.completed)
              .reduce((setSum: number, set: any) => setSum + set.repetitions, 0)
          );
        }, 0)
      );
    }, 0);
  }

  private _buildChartData(
    dailyData: DailyWorkoutData[],
    metric: ChartMetric,
  ): ChartConfiguration['data'] {
    const config = CHART_METRIC_CONFIGS[metric];

    let data: number[] = [];
    switch (metric) {
      case ChartMetric.Duration:
        data = dailyData.map((d) => d.total_duration_minutes);
        break;
      case ChartMetric.Volume:
        data = dailyData.map((d) => d.total_volume);
        break;
      case ChartMetric.Repetitions:
        data = dailyData.map((d) => d.total_reps);
        break;
    }

    return {
      labels: dailyData.map((d) => this._formatDateLabel(d.date)),
      datasets: [
        {
          data,
          label: config.label,
          borderColor: config.color,
          backgroundColor: `${config.color}20`,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: config.color,
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    };
  }

  private _calculateSummary(dailyData: DailyWorkoutData[], metric: ChartMetric) {
    let values: number[] = [];

    switch (metric) {
      case ChartMetric.Duration:
        values = dailyData.map((d) => d.total_duration_minutes);
        break;
      case ChartMetric.Volume:
        values = dailyData.map((d) => d.total_volume);
        break;
      case ChartMetric.Repetitions:
        values = dailyData.map((d) => d.total_reps);
        break;
    }

    const total = values.reduce((sum, val) => sum + val, 0);
    const activeDays = dailyData.filter((d) => d.workout_count > 0).length;
    const average = activeDays > 0 ? Math.round(total / activeDays) : 0;
    const max = Math.max(...values);

    return { total, average, max, activeDays };
  }

  private _formatDateLabel(dateString: string): string {
    const date = new Date(dateString);
    const period = this.selectedPeriod();

    if (period <= 7) {
      return date.toLocaleDateString('es-ES', { weekday: 'short' });
    } else if (period <= 30) {
      return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
    }
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'numeric' });
  }
}
