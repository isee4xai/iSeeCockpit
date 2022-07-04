// @ts-ignore

import type { Interaction } from '@/models/questionnaire';
import { BASE_URL } from './api.config';
import { getToken } from './user';

const KEY = 'interaction';

export const api_get_all = async () => {
  try {
    const data = await fetch(`${BASE_URL}/${KEY}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': getToken()
      },
    });
    const result = await data.json();
    return result || [];
  } catch (error) {
    return [];
  }
};

export const api_create = async (questionnaire: Interaction) => {
  console.log(questionnaire);
  await fetch(`${BASE_URL}/${KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': getToken()
    },
    body: JSON.stringify(questionnaire),
  });
};
