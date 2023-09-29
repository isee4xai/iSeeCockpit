export interface Feedback {
    question?: "",
    category?: "",
    values?: {
        key?: "",
        value?: "",
    }[],
}
export interface Evaluation {
    id?: string;
    comments?: string;
    assessment?: string;

    feedback?: Feedback[];
}

export interface Analytic {
    interactions_per_date?: [];
    interactions_per_persona?: [];
    overall_experience?: number;
    personas?: {
        evaluation: {
            dimension: [{
                question: string,
                type: string,
                values: {}
            }];
        },
        explainers: [],
        intents: []
    };
}