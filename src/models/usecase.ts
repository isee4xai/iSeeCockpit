// @ts-ignore

import type { Persona } from './persona';

/* eslint-disable */
export interface Usecase {
  _id?: string;
  published: boolean;
  name: string;
  goal?: string;
  domain?: string;
  version?: number;
  status?: string;
  settings?: UsecaseSettings;
  model?: UsecaseModel;
  stats?: {
    runs: number;
    feedback: number;
  };
  invites?: [string];
  endusers?: [string];
  interactions?: [string];
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
  source_file?: any;
  source_api?: string;
  dataset_file?: any;
  attributes?: any;
  completed?: boolean;
}
