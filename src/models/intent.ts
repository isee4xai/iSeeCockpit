// @ts-ignore
/* eslint-disable */

import { Questionnaire } from "./questionnaire";

export interface Intent {
    id: string;
    completed: boolean;
    name: string;
    uuid?: string;
    ref?: string;
    questions?: string[];
    explanation?: string;
    evaluation: Questionnaire;    //todo?
};
