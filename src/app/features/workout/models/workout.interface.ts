import { ExerciseInRoutine } from '@features/routines/models/routine.interface';

// export interface SetInWorkout {
//   set_number: number;
//   weight: number;
//   repetitions: number;
//   completed: boolean;
// }

// export interface ExerciseInWorkout {
//   exercise_id: string;
//   exercise_name: string;
//   exercise_image: string;
//   order_number: number;
//   note: string;
//   sets: SetInWorkout[];
// }

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
