import { ExerciseInRoutine } from './routine.interface';
import { RoutineType } from './routine.type';

// GET /assignments/athlete/:athleteId
export interface RoutineAssignmentResponse {
  id: string;
  routine_id: RoutineInAssignment;
  athlete_id: AthleteInAssignment;
  assigned_by: TrainerInAssignment;
  assigned_date: string;
  scheduled_dates: string[];
  status: 'active' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RoutineInAssignment {
  _id: string;
  name: string;
  type: RoutineType;
  created_by: string;
  exercises: ExerciseInRoutine[];
  createdAt: string;
  updatedAt: string;
}

// Atleta poblado en la asignación
export interface AthleteInAssignment {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

// Entrenador poblado en la asignación
export interface TrainerInAssignment {
  id: string;
  name: string;
}
