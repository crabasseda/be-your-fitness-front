import { ExerciseInRoutine } from '@features/routines/models/routine.interface';
import { RoutineType } from '@features/routines/models/routine.type';

export interface CreateWorkoutDTO {
  user_id: string;
  routine_id?: string;
  routine_name: string;
  routine_type: string;
  workout_date: Date;
  duration_seconds: number;
  exercises: ExerciseInRoutine[];
  notes?: string;
}

export interface Workout extends CreateWorkoutDTO {
  _id: string;
  user_id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkoutSummary {
  _id: string;
  routine_name: string;
  routine_type: RoutineType;
  duration_seconds: number;
  started_at: string;
}

export interface CalendarDayData {
  count: number;
  total_duration: number;
  workouts: WorkoutSummary[];
}

export interface CalendarData {
  [day: number]: CalendarDayData;
}

export interface WorkoutStats {
  total_workouts: number;
  workouts_this_week: number;
  workouts_this_month: number;
  total_duration_hours: number;
  favorite_routine?: string;
  most_trained_type?: string;
}
