// @ts-ignore
import type { Persona, PersonaDetails, PersonaIntent } from '@/models/persona';
import type { Usecase } from '@/models/usecase';

import { BASE_URL } from './api.config';
import { getToken } from './user';

const KEY = 'usecases';

// -----------------------------------------
//              HANDLE USECASE
// ------------------------------------------
export async function api_create(usecase: Usecase) {
  try {
    const data = await fetch(`${BASE_URL}/${KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': getToken(),
      },
      body: JSON.stringify(usecase),
    });

    const result = await data.json();
    return result || [];
  } catch (error) {
    return [];
  }
}

export async function api_get(id: string) {
  try {
    const data = await fetch(`${BASE_URL}/${KEY}/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': getToken(),
      },
    });
    const result = await data.json();
    if (result.message) return false;
    return result || false;
  } catch (error) {
    return false;
  }
}

export async function api_get_casestructure(id: string) {
  try {
    const data = await fetch(`${BASE_URL}/${KEY}/${id}/casestructure`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': getToken(),
      },
    });
    const result = await data.json();
    if (result.message) return false;
    return result || false;
  } catch (error) {
    return false;
  }
}

export const api_get_all = async () => {
  try {
    const data = await fetch(`${BASE_URL}/${KEY}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': getToken(),
      },
    });
    const result = await data.json();
    if (result.message) return [];
    return result || [];
  } catch (error) {
    return [];
  }
};

export const api_update_settings = async (id: string | undefined, settings: Usecase) => {
  if (!id) return false;

  const data = await fetch(`${BASE_URL}/${KEY}/${id}/settings`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': getToken(),
    },
    body: JSON.stringify(settings),
  });
  return data;
};

export async function api_delete(id: string) {
  try {
    const data = await fetch(`${BASE_URL}/${KEY}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': getToken(),
      },
    });
    return data || false;
  } catch (error) {
    return false;
  }
}

export async function api_publish(id: string, status: boolean) {
  try {
    const data = await fetch(`${BASE_URL}/${KEY}/${id}/publish`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': getToken(),
      },
      body: JSON.stringify({ status }),
    });
    return data || false;
  } catch (error) {
    return false;
  }
}

// -----------------------------------------
//              HANDLE PERSONAS
// ------------------------------------------
export async function api_create_persona(usecaseId: string | undefined, persona: Persona) {
  if (!usecaseId) return usecaseId;

  try {
    const data = await fetch(`${BASE_URL}/${KEY}/${usecaseId}/persona`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': getToken(),
      },
      body: JSON.stringify(persona),
    });
    const result = await data.json();
    return result;
  } catch (error) {
    return false;
  }
}

export async function api_delete_persona(
  usecaseId: string | undefined,
  personaId: string | undefined,
) {
  if (!usecaseId || !personaId) return usecaseId;

  try {
    await fetch(`${BASE_URL}/${KEY}/${usecaseId}/persona/${personaId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': getToken(),
      },
    });
    return usecaseId;
  } catch (error) {
    return usecaseId;
  }
}

export async function api_persona_details(
  usecaseId: string | undefined,
  personaId: string | undefined,
  details: PersonaDetails,
) {
  if (!usecaseId || !personaId) return usecaseId;

  try {
    await fetch(`${BASE_URL}/${KEY}/${usecaseId}/persona/${personaId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': getToken(),
      },
      body: JSON.stringify(details),
    });
    return usecaseId;
  } catch (error) {
    return usecaseId;
  }
}

// -----------------------------------------
//              HANDLE INTENTS
// ------------------------------------------
export async function api_persona_new_intent(
  usecaseId: string | undefined,
  personaId: string | undefined,
  intent: PersonaIntent,
) {
  if (!usecaseId || !personaId) return usecaseId;

  try {
    await fetch(`${BASE_URL}/${KEY}/${usecaseId}/persona/${personaId}/intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': getToken(),
      },
      body: JSON.stringify(intent),
    });
    return usecaseId;
  } catch (error) {
    return usecaseId;
  }
}

export async function api_persona_delete_intent(
  usecaseId: string | undefined,
  personaId: string | undefined,
  intentId: string | undefined,
) {
  if (!usecaseId || !personaId || !intentId) return usecaseId;

  try {
    const test = await fetch(
      `${BASE_URL}/${KEY}/${usecaseId}/persona/${personaId}/intent/${intentId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': getToken(),
        },
      },
    );
    console.log(test);
    return usecaseId;
  } catch (error) {
    console.error(error);
    return usecaseId;
  }
}

export async function api_persona_update_intent(
  usecaseId: string | undefined,
  personaId: string | undefined,
  intentId: string | undefined,
  intent: PersonaIntent,
) {
  if (!usecaseId || !personaId || !intentId) return usecaseId;

  try {
    await fetch(`${BASE_URL}/${KEY}/${usecaseId}/persona/${personaId}/intent/${intentId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': getToken(),
      },
      body: JSON.stringify(intent),
    });
    return usecaseId;
  } catch (error) {
    return usecaseId;
  }
}

export async function api_intent_stat(
  usecaseId: string | undefined,
  personaId: string | undefined,
  intent: string | undefined,
  statDate: string[],
) {
  if (!usecaseId || !personaId || !intent) return usecaseId;
  try {
    const data = await fetch(
      `${BASE_URL}/stats/${KEY}/${usecaseId}/persona/${personaId}/${intent}/?sd=${statDate[0]}&ed=${statDate[1]}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': getToken(),
        },
      },
    );

    const result = await data.json();
    if (result.message) return [];
    console.log(result);
    return result || [];
  } catch (error) {
    console.log('test5');
    return [];
  }
}

export async function api_usecase_stat(usecaseId: string | undefined, dates: string[]) {
  if (!usecaseId) return usecaseId;
  try {
    console.log(dates);

    const data = await fetch(
      `${BASE_URL}/stats/${KEY}/${usecaseId}/?sd=${dates[0]}&ed=${dates[1]}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': getToken(),
        },
      },
    );

    const result = await data.json();

    if (result.message) return {};

    return result || {};
  } catch (error) {
    return {};
  }
}
