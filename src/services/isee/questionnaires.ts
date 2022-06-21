// @ts-ignore

import type { Questionnaire } from '@/models/questionnaire';

const KEY = 'questionnaire';
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

export const api_create = async (questionnaire: Questionnaire) => {
  const data = await fetch(`${BASE_URL}/${KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(questionnaire),
  });

  const result = await data.json();
  return result;
};

export const api_delete = async (id: string) => {
  const data = await fetch(`${BASE_URL}/${KEY}/${id}`, {
    method: 'DELETE',
  });
  return data;
};

export const api_update = async (questionnaire: Questionnaire) => {
  const data = await fetch(`${BASE_URL}/${KEY}/${questionnaire._id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(questionnaire),
  });
  return data;
};
