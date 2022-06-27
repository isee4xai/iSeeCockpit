// @ts-ignore

import type { Interaction } from '@/models/questionnaire';
import { HEADERS, BASE_URL } from './api.config';

const KEY = 'interaction';

export const api_get_all = async () => {
  try {
    const data = await fetch(`${BASE_URL}/${KEY}`, {
      method: 'GET',
      headers: HEADERS,
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
    headers: HEADERS,
    body: JSON.stringify(questionnaire),
  });
};
