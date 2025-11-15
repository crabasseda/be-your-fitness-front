export interface Set {
  set_number: number;
  weight: number;
  repetitions: number;
}

export interface ExerciseInRoutine {
  exercise_id: string;
  exercise_name: string;
  exercise_image?: string;
  order_number: number;
  note: string;
  sets: Set[];
}

export interface Routine {
  id: string;
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

export interface RoutineResponse {
  id: string;
  name: string;
  type: RoutineType;
  created_by: string;
  exercises: ExerciseInRoutine[];
  createdAt: string;
  updatedAt: string;
}

export interface RoutineCard {
  id: string;
  name: string;
  type: RoutineType;
  exercises: {
    exercise_id: string;
    exercise_name: string;
    exercise_image?: string;
  }[];
  createdAt: string;
}

export interface AssignedRoutine {
  id: string;
  routine_id: RoutineCard[];
}
