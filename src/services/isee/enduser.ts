// @ts-ignore
import type { Persona, PersonaDetails, PersonaIntent } from '@/models/persona';
import type { Usecase } from '@/models/usecase';
import { message, notification } from 'antd';

import { BASE_URL } from './api.config';
import { getToken } from './user';

const KEY = 'enduser';


export const api_enduser_get_all = async () => {
    try {
        const data = await fetch(`${BASE_URL}/${KEY}/usecases`, {
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