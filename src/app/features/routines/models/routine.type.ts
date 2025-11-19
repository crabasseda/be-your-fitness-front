export type RoutineType =
  | 'fuerza'
  | 'resistencia'
  | 'mixto'
  | 'hipertrofia'
  | 'movilidad'
  | 'cardio';

export const ROUTINE_TYPES: RoutineType[] = [
  'fuerza',
  'resistencia',
  'mixto',
  'hipertrofia',
  'movilidad',
  'cardio',
];

export const ROUTINE_TYPES_CONFIG: Array<{
  value: RoutineType;
  label: string;
  icon: string;
  description: string;
}> = [
  {
    value: 'fuerza',
    label: 'Fuerza',
    icon: '💪',
    description: 'Enfocada en ganar fuerza máxima',
  },
  {
    value: 'hipertrofia',
    label: 'Hipertrofia',
    icon: '🏋️',
    description: 'Crecimiento muscular',
  },
  {
    value: 'resistencia',
    label: 'Resistencia',
    icon: '🏃',
    description: 'Mejorar resistencia muscular',
  },
  {
    value: 'mixto',
    label: 'Mixto',
    icon: '🔄',
    description: 'Combinación de diferentes tipos',
  },
  {
    value: 'movilidad',
    label: 'Movilidad',
    icon: '🧘',
    description: 'Estiramientos y flexibilidad',
  },
  {
    value: 'cardio',
    label: 'Cardio',
    icon: '❤️',
    description: 'Ejercicio cardiovascular',
  },
];
