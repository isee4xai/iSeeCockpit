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
  responseType?: string;
  intent?: string;
  dimension?: string;
  answer?: string[];
  responseOptions?: {
    val: string;
  }[];
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
