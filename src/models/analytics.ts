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