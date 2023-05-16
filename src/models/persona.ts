// @ts-ignore

// import type { Intent } from "./intent";
import type { IntentQuestion, Questionnaire } from './questionnaire';

/* eslint-disable */
export interface Persona {
  _id?: string;
  completed: boolean;
  details: PersonaDetails;
  uuid?: string;
  status?: string;
  intents?: PersonaIntent[];
}

export interface PersonaDetails {
  name: string;
  domain_knowledge_level?: string | null;
  ai_knowledge_level?: string | null;
}

export interface PersonaIntent {
  id: string;
  completed: boolean;
  name: string;
  label?: string;
  uuid?: string;
  ref?: string;
  questions?: IntentQuestion[];
  explanation?: string;
  strategy_selected?: boolean;
  strategy_topk?: number;
  strategies?: any[];
  evaluation: Questionnaire; //todo?
}
