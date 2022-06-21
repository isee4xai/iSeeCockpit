// @ts-ignore

import type { Interaction } from '@/models/questionnaire';

const KEY = 'interaction';
const BASE_URL = 'http://localhost:3000/api';

export const api_get_all = async () => {
  try {
    const data = await fetch(`${BASE_URL}/${KEY}`, {
      method: 'GET',
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
    },
    body: JSON.stringify(questionnaire),
  });
};
