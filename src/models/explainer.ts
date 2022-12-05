export interface Explainer {
    _id?: string;
    name: string;
    explainer_description?: string;
    technique?: string;
    dataset_type?: string;
    explanation_type?: string;
    explanation_description?: string;
    concurrentness?: string;
    scope?: string;
    portability?: string;
    target?: string;
    presentations?: string[];
    complexity?: string;
    ai_methods?: string[];
    ai_tasks?: string[];
    implementation?: string[];
    metadata?: string;
}