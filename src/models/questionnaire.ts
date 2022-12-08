export interface Questionnaire {
  _id?: string;
  name?: string;
  dimension?: string;
  questions?: Question[];
}

export interface IntentQuestion {
  text?: string;
  id?: string;
  target?: string;
}

export interface Question {
  id?: string;
  content?: string;
  responseType?: ResponseType;
  intent?: string;
  dimension?: string;
  answer?: Response[];
  responseOptions?: Response[];
  required?: boolean;
  completed?: boolean;
  validators?: {
    min?: number;
    max?: number;
  };
}
export interface Interaction {
  name: string;
  dimension: string;
  personaId: string;
  usecaseId: string;
  questions: Question[];
}

export enum ResponseType {
  RADIO = "Radio",
  CHECK = "Checkbox",
  LIKERT = "Likert",
  NUMBER = "Number",
  INFO = "Info",
  OPEN = "Free-Text"
}

export interface Response {
  id?: string;
  content?: string;
}
