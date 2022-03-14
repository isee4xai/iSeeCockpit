// @ts-ignore

import { Persona } from "@/models/persona";
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

export async function api_create_persona(id: string,
    persona: Persona) {

    console.log(id)
    console.log(persona)
    const saved_usecases = localStorage.getItem(KEY);
    let arr = JSON.parse(saved_usecases) || [];
    const ucindex = arr.findIndex((obj => obj.id == id));
    arr[ucindex].personas.push(persona);
    localStorage.setItem(KEY, JSON.stringify(arr));

    return id;
}

