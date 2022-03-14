
export interface Questionnaire {
    id: string;
    name?: string;
    category?: string;
    questions?: Question[];
};

export interface Question {
    id?: string;
    text?: string;
    metric?: string;
    category?: string;
    metric_values?: string[];
    required?: boolean;
    completed?: boolean;
};