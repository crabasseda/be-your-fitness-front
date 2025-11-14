import { ExerciseInRoutine, RoutineType } from './routine.interface';

// GET /assignments/athlete/:athleteId
export interface RoutineAssignmentResponse {
  id: string; // ← ID de la ASIGNACIÓN (no de la rutina)
  routine_id: RoutineInAssignment; // ← Info completa de la rutina
  athlete_id: AthleteInAssignment;
  assigned_by: TrainerInAssignment;
  assigned_date: string;
  scheduled_dates: string[]; // ← FECHAS PROGRAMADAS (esto es lo importante)
  status: 'active' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RoutineInAssignment {
  id: string;
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
