
export interface Questionnaire {
    name?: string;
    category?: string;
    questions?: Question[];
};

export interface Question {
    question_text?: string;
    question_metric?: string;
    question_category?: string;
    metric_values?: string[];
    required?: boolean;
};