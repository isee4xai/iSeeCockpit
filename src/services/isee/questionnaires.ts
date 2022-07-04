// @ts-ignore

import type { Questionnaire } from '@/models/questionnaire';
import { BASE_URL } from './api.config';
import { getToken } from './user';

const KEY = 'questionnaire';

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

export const api_create = async (questionnaire: Questionnaire) => {
  const data = await fetch(`${BASE_URL}/${KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': getToken()
    },
    body: JSON.stringify(questionnaire),
  });

  const result = await data.json();
  return result;
};

export const api_delete = async (id: string) => {
  const data = await fetch(`${BASE_URL}/${KEY}/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': getToken()
    },
  });
  return data;
};

export const api_update = async (questionnaire: Questionnaire) => {
  const data = await fetch(`${BASE_URL}/${KEY}/${questionnaire._id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': getToken()
    },
    body: JSON.stringify(questionnaire),
  });
  return data;
};
