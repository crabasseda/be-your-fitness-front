export interface Routine {
  _id: string;
  name: string;
  type: RoutineType;
  created_by: string;
  exercises: ExerciseInRoutine[];
  createdAt?: string;
  updatedAt?: string;
}

export type RoutineType =
  | 'fuerza'
  | 'resistencia'
  | 'mixto'
  | 'hipertrofia'
  | 'movilidad'
  | 'cardio';

export interface ExerciseInRoutine {
  exercise_id: string;
  exercise_name: string;
  exercise_image?: string;
  order_number: number;
  note: string;
  sets: Set[];
}
export interface Set {
  set_number: number;
  weight: number;
  repetitions: number;
  completed?: boolean;
}

export interface CreateRoutineDTO {
  name: string;
  type: RoutineType;
  created_by: string;
  exercises: ExerciseInRoutine[];
}

export type RoutineDetails = Omit<CreateRoutineDTO, 'exercises'>;

export interface UpdateRoutineDto {
  name: string;
  type: RoutineType;
  exercises: ExerciseInRoutine[];
}
