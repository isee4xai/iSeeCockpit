// @ts-ignore
import type { Persona, PersonaDetails, PersonaIntent } from '@/models/persona';
import type { Usecase } from '@/models/usecase';

const KEY = 'usecases';
const BASE_URL = 'http://localhost:3000/api';

// -----------------------------------------
//              HANDLE USECASE
// ------------------------------------------
export async function api_create(usecase: Usecase) {
  try {
    const data = await fetch(`${BASE_URL}/${KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
    },
    body: JSON.stringify(settings),
  });
  return data;
};

export async function api_delete(id: string) {
  try {
    const data = await fetch(`${BASE_URL}/${KEY}/${id}`, {
      method: 'DELETE',
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
    await fetch(`${BASE_URL}/${KEY}/${usecaseId}/persona`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(persona),
    });
    return usecaseId;
  } catch (error) {
    return usecaseId;
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
) {
  if (!usecaseId || !personaId || !intent) return usecaseId;
  try {
    const data = await fetch(
      `${BASE_URL}/stats/${KEY}/${usecaseId}/persona/${personaId}/${intent}/`,
      {
        method: 'GET',
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

export async function api_usecase_stat(usecaseId: string | undefined) {
  if (!usecaseId) return usecaseId;
  try {
    const data = await fetch(`${BASE_URL}/stats/${KEY}/${usecaseId}/`, {
      method: 'GET',
    });

    const result = await data.json();

    if (result.message) return {};

    return result || {};
  } catch (error) {
    return {};
  }
}
