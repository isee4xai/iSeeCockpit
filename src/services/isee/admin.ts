// @ts-ignore
import type { Persona, PersonaDetails, PersonaIntent } from '@/models/persona';
import { message } from 'antd';

import { BASE_URL } from './api.config';
import { getToken } from './user';
import { Company } from '@/models/company';

const KEY = 'admin';


export const api_admin_get_companies = async () => {
    try {
        const data = await fetch(`${BASE_URL}/${KEY}/companies`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': getToken(),
            },
        });
        const result = await data.json();
        if (result.message) {
            message.error(result.message)
            return []
        };

        return result || [];
    } catch (error) {
        console.log(error)
        return [];
    }
};

export async function api_admin_create_company(company: Company) {
    try {
        const data = await fetch(`${BASE_URL}/${KEY}/company`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': getToken(),
            },
            body: JSON.stringify(company),
        });

        const result = await data.json();
        return result || [];
    } catch (error) {
        return [];
    }
}
