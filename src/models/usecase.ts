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
  model?: UsecaseModel;
  stats?: {
    runs: number;
    feedback: number;
  };
  personas?: Persona[];
}

export interface UsecaseSettings {
  ai_task?: string;
  ai_method?: [string];
  data_type?: [string];
  dataset_type?: string;
  assessments?: [string];
  completed?: boolean;
  num_features?: number;
  num_instances?: number;
}

export interface UsecaseModel {
  mode?: string;
  alias?: string;
  backend?: string;
  source_file?: string;
  source_api?: string;
  dataset_file?: string;
  attributes?: any;
  completed?: boolean;
}