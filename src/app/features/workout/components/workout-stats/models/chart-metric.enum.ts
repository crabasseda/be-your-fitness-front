export enum ChartMetric {
  Duration = 'duration',
  Volume = 'volume',
  Repetitions = 'repetitions',
}

export interface ChartMetricConfig {
  label: string;
  unit: string;
  color: string;
  icon: string;
}

export const CHART_METRIC_CONFIGS: Record<ChartMetric, ChartMetricConfig> = {
  [ChartMetric.Duration]: {
    label: 'Duración',
    unit: 'minutos',
    color: '#ec6c1e',
    icon: 'schedule',
  },
  [ChartMetric.Volume]: {
    label: 'Volumen',
    unit: 'kg',
    color: '#f6a100',
    icon: 'fitness_center',
  },
  [ChartMetric.Repetitions]: {
    label: 'Repeticiones',
    unit: 'reps',
    color: '#3498db',
    icon: 'format_list_numbered',
  },
};
