import type { Explainer } from '@/models/explainer';
import { BASE_URL } from './api.config';
import { getToken } from './user';

const KEY = 'explainers';


export async function api_create(explainer: Explainer) {
    return [];
};

export const api_get_all = async () => {
    return [];
};

export async function api_get_explainers_lib() {
    try {
        const data = await fetch(`${BASE_URL}/${KEY}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        const result = await data.json();
        if (result.message) return false;
        return result || false;
    } catch (error) {
        return false;
    }
}

export async function api_get_explainers_lib_single(id: string) {
    try {
        const data = await fetch(`${BASE_URL}/${KEY}/meta?id=${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        const result = await data.json();
        if (result.message) return false;
        return result || false;
    } catch (error) {
        return false;
    }
}