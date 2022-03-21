// @ts-ignore

import { Persona, PersonaDetails, PersonaIntent } from "@/models/persona";
import { Question } from "@/models/questionnaire";
import { Usecase, UsecaseSettings } from "@/models/usecase";

const KEY = "USECASES";

/* eslint-disable */
export async function api_create(usecase: Usecase) {
    const saved_usecases = localStorage.getItem(KEY);
    let initialValue = JSON.parse(saved_usecases) || [];
    initialValue.push(usecase);
    localStorage.setItem(KEY, JSON.stringify(initialValue));
    return usecase || [];
}

export async function api_get_all() {
    const saved_usecases = localStorage.getItem(KEY);
    const initialValue = JSON.parse(saved_usecases);
    return initialValue || [];

}

export async function api_get(id: string) {
    const saved_usecases = localStorage.getItem(KEY);
    const arr = JSON.parse(saved_usecases);

    const found = arr.find((v: { id: string; }) => {
        return v.id.toLowerCase() == id;
    });

    if (found) {
        console.log("Matched")
        console.log(found)
    }

    return found || false;
}

export async function api_update_settings(id: string,
    settings: UsecaseSettings) {

    console.log(id)
    console.log(settings)
    const saved_usecases = localStorage.getItem(KEY);
    let arr = JSON.parse(saved_usecases) || [];
    const ucindex = arr.findIndex((obj => obj.id == id));
    arr[ucindex].settings = settings
    localStorage.setItem(KEY, JSON.stringify(arr));

    return id || false;
}

export async function api_create_persona(usecaseId: string,
    persona: Persona) {

    console.log(usecaseId)
    console.log(persona)
    const saved_usecases = localStorage.getItem(KEY);
    let arr = JSON.parse(saved_usecases) || [];
    const ucindex = arr.findIndex((obj => obj.id == usecaseId));
    arr[ucindex].personas.push(persona);
    localStorage.setItem(KEY, JSON.stringify(arr));

    return usecaseId;
}

export async function api_delete_persona(usecaseId: string,
    personaId: string) {

    console.log(usecaseId)
    const saved_usecases = localStorage.getItem(KEY);
    let arr = JSON.parse(saved_usecases) || [];
    const ucindex = arr.findIndex((obj => obj.id == usecaseId));


    let filteredPersonas = arr[ucindex].personas.filter(persona => persona.id !== personaId)

    console.log(filteredPersonas)

    arr[ucindex].personas = filteredPersonas;


    localStorage.setItem(KEY, JSON.stringify(arr));

    return usecaseId;
}


// SAVE PERSONA FUNCTIONS
export async function api_persona_details(
    usecaseId: string, personaId: string, details: PersonaDetails) {

    console.log(usecaseId)
    console.log(personaId)
    const saved_usecases = localStorage.getItem(KEY);
    let arr = JSON.parse(saved_usecases) || [];
    const ucindex = arr.findIndex((obj => obj.id == usecaseId));
    let personas = arr[ucindex].personas;
    const persona_index = personas.findIndex((obj => obj.id == personaId));

    console.log(personas[persona_index])

    arr[ucindex].personas[persona_index].details = details

    localStorage.setItem(KEY, JSON.stringify(arr));

    return usecaseId;
}

export async function api_persona_new_intent(
    usecaseId: string, personaId: string, intent: PersonaIntent) {

    console.log(usecaseId)
    console.log(personaId)
    const saved_usecases = localStorage.getItem(KEY);
    let arr = JSON.parse(saved_usecases) || [];
    const ucindex = arr.findIndex((obj => obj.id == usecaseId));
    let personas = arr[ucindex].personas;
    const persona_index = personas.findIndex((obj => obj.id == personaId));

    console.log(personas[persona_index])

    arr[ucindex].personas[persona_index].intents.push(intent)

    localStorage.setItem(KEY, JSON.stringify(arr));

    return usecaseId;
}

export async function api_persona_add_intent_question(
    usecaseId: string, personaId: string, intent_cat: string, intent_question: string) {

    console.log(usecaseId)
    console.log(personaId)
    const saved_usecases = localStorage.getItem(KEY);

    let arr = JSON.parse(saved_usecases) || [];
    const ucindex = arr.findIndex((obj => obj.id == usecaseId));

    let personas = arr[ucindex].personas;
    const persona_index = personas.findIndex((obj => obj.id == personaId));

    let intents = arr[ucindex].personas[persona_index].intents;
    const intent_index = intents.findIndex((obj => obj.name == intent_cat));

    arr[ucindex].personas[persona_index].intents[intent_index].questions.push(intent_question)

    localStorage.setItem(KEY, JSON.stringify(arr));

    return usecaseId;
}

export async function api_persona_delete_intent(
    usecaseId: string, personaId: string, intentId: string) {

    console.log(usecaseId)
    console.log(personaId)
    const saved_usecases = localStorage.getItem(KEY);
    let arr = JSON.parse(saved_usecases) || [];
    const ucindex = arr.findIndex((obj => obj.id == usecaseId));
    let personas = arr[ucindex].personas;
    const persona_index = personas.findIndex((obj => obj.id == personaId));

    let filteredIntents = arr[ucindex].personas[persona_index].intents.filter(intent => intent.id !== intentId)

    console.log(filteredIntents)

    arr[ucindex].personas[persona_index].intents = filteredIntents;

    localStorage.setItem(KEY, JSON.stringify(arr));

    return usecaseId;
}


export async function api_persona_save_intent_evaluation(
    usecaseId: string, personaId: string, intent_cat: string, evaluation_questions: Question[]) {

    console.log(usecaseId)
    console.log(personaId)
    const saved_usecases = localStorage.getItem(KEY);

    let arr = JSON.parse(saved_usecases) || [];
    const ucindex = arr.findIndex((obj => obj.id == usecaseId));

    let personas = arr[ucindex].personas;
    const persona_index = personas.findIndex((obj => obj.id == personaId));

    let intents = arr[ucindex].personas[persona_index].intents;
    const intent_index = intents.findIndex((obj => obj.name == intent_cat));

    arr[ucindex].personas[persona_index].intents[intent_index].evaluation.questions = evaluation_questions;

    localStorage.setItem(KEY, JSON.stringify(arr));

    return usecaseId;
}


