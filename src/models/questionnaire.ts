export interface Questionnaire {
  _id: string;
  name?: string;
  dimension?: string;
  questions?: Question[];
}

export interface Question {
  id?: string;
  content?: string;
  responseType?: string;
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
