import type { Explainer } from '@/models/explainer';
import { message } from 'antd';
import { BASE_URL } from './api.config';
import { ONTOAPI_URL } from './api.config';

const KEY = 'explainers';

export async function api_create(explainer: Explainer) {
    try {
        const data = await fetch(`${BASE_URL}/${KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(explainer)
        });
        const result = await data.json();
        return result || [];
    } catch (error) {
        return [];
    }
};


export async function api_get_all() {
    try {
        const data = await fetch(`${ONTOAPI_URL}/${KEY}/list`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        const result = await data.json();
        if (result.message) {
            message.error("Error Reading Ontology - E004");
            return false;
        }

        return result || false;
    } catch (error) {
        message.error("Error Reading Ontology - API Error");
        return false;
    }
}

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