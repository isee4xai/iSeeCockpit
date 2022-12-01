// @ts-ignore

import type { Persona } from './persona';

/* eslint-disable */
export interface Usecase {
  _id?: string;
  published: boolean;
  name: string;
  goal?: string;
  domain?: string;
  status?: string;
  settings?: UsecaseSettings;
  stats?: {
    runs: number;
    feedback: number;
  };
  personas?: Persona[];
}

export interface UsecaseSettings {
  ai_task?: string;
  ai_method?: [string];
  data_type?: string;
  dataset_type?: string;
  model_mode?: string;
  model_alias?: string;
  model_backend?: string;
  model_source?: string;
  model_attributes?: object;
  assessments?: [string];
  completed?: boolean;
  num_features?: number;
  num_instances?: number;
}
