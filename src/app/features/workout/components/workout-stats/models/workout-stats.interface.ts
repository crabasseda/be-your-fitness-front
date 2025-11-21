export interface DailyWorkoutData {
  date: string;
  workout_count: number;
  total_duration_minutes: number;
  total_volume: number;
  total_reps: number;
}

export interface WorkoutStatsData {
  period: number;
  dailyData: DailyWorkoutData[];
  summary: {
    total: number;
    average: number;
    max: number;
    activeDays: number;
  };
}
