import { RoutineType } from './routine.type';

export interface Routine {
  _id: string;
  name: string;
  type: RoutineType;
  created_by: string;
  exercises: ExerciseInRoutine[];
  schedule?: RoutineSchedule;
}

export interface RoutineSchedule {
  type: 'one-time' | 'recurring';
  specificDate?: Date;
  recurrence?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    daysOfWeek?: number[];
    dayOfMonth?: number;
    startDate?: Date;
    endDate?: Date;
  };
}

export interface ExerciseInRoutine {
  exercise_id: string;
  exercise_name: string;
  exercise_image?: string;
  order_number: number;
  note: string;
  sets: SetInRoutine[];
}
export interface SetInRoutine {
  set_number: number;
  weight: number;
  repetitions: number;
  completed?: boolean;
}

export interface CreateRoutineDTO {
  name: string;
  type: RoutineType;
  exercises: ExerciseInRoutine[];
  schedule?: RoutineSchedule;
}

export type RoutineDetails = Omit<CreateRoutineDTO, 'exercises'>;

export interface UpdateRoutineDto {
  name: string;
  type: RoutineType;
  exercises: ExerciseInRoutine[];
}
