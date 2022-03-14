// @ts-ignore

import { Persona } from "./persona";

/* eslint-disable */
export interface Usecase {
    id: string;
    published: boolean;
    name: string;
    goal?: string;
    status?: string;
    settings: UsecaseSettings,
    stats: {
        runs: number,
        feedback: number
    };
    personas?: Persona[];
};


export interface UsecaseSettings {
    ai_task?: string;
    ai_method?: string;
    data_type?: string;
    model_outcome?: string;
    ml_model?: string;
    assessments?: [string];

}