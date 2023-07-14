// @ts-ignore
import type { Persona, PersonaDetails, PersonaIntent } from '@/models/persona';
import type { Usecase } from '@/models/usecase';
import { message, notification } from 'antd';

import { BASE_URL } from './api.config';
import { getToken } from './user';

const KEY = 'usecases';
const KEY_SHARED = 'usecases_shared';

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
    const data = await fetch(`${BASE_URL}/${KEY_SHARED}/${id}/casestructure`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': getToken(),
      },
    });
    const result = await data.json();
    if (result.message) {
      // message.error(result.message);
      notification.error({ message: result.message })
      return false;
    }
    return result || false;
  } catch (error) {
    return false;
  }
}


export async function api_get_model_instance_count(id: string) {
  try {
    const data = await fetch(`${BASE_URL}/${KEY_SHARED}/${id}/dataset/count`, {
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


export async function api_get_model_random_instance(id: string) {
  try {
    const data = await fetch(`${BASE_URL}/${KEY_SHARED}/${id}/dataset/randomInstance`, {
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


export async function api_get_model_prediction(id: string, instance: any) {
  try {
    const data = await fetch(`${BASE_URL}/${KEY_SHARED}/${id}/model/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': getToken(),
      },
      body: JSON.stringify({ instance: instance.instance, type: instance.type }),
    });
    const result = await data.json();
    if (result.message) return false;
    return result || false;
  } catch (error) {
    return false;
  }
}

export async function api_get_model_explanation(id: string, instance: any, explanationMethod: string) {
  try {
    const data = await fetch(`${BASE_URL}/${KEY_SHARED}/${id}/model/explain`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': getToken(),
      },
      body: JSON.stringify({ instance: instance.instance, type: instance.type, method: explanationMethod }),
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


export const api_model_upload = async (id: string | undefined, usecase: Usecase) => {
  if (!id) return false;

  var headers = new Headers();
  headers.append("Accept", "*/*");
  headers.append("Connection", "keep-alive");
  headers.append("x-access-token", getToken());

  var formdata = new FormData();
  formdata.append("source_file", usecase.model?.source_file, usecase.model?.source_file.name);
  // formdata.append("dataset_file", usecase.model?.dataset_file, usecase.model?.dataset_file.name);
  formdata.append("mode", "file");
  formdata.append("backend", usecase.model?.backend + "");
  // formdata.append("attributes", JSON.stringify(usecase.model?.attributes));
  formdata.append("completed", usecase.model?.completed + "");

  const data = await fetch(`${BASE_URL}/${KEY}/${id}/model`, {
    method: 'PATCH',
    headers: headers,
    body: formdata,
    redirect: 'follow'
  });

  return data;
};

export const api_dataset_upload = async (id: string | undefined, usecase: Usecase) => {
  if (!id) return false;

  var headers = new Headers();
  headers.append("Accept", "*/*");
  headers.append("Connection", "keep-alive");
  headers.append("x-access-token", getToken());

  var formdata = new FormData();
  formdata.append("dataset_file", usecase.model?.dataset_file, usecase.model?.dataset_file.name);
  formdata.append("attributes", JSON.stringify(usecase.model?.attributes));

  const data = await fetch(`${BASE_URL}/${KEY}/${id}/dataset`, {
    method: 'PATCH',
    headers: headers,
    body: formdata,
    redirect: 'follow'
  });
  const result = await data.json();
  console.log(result)
  return result;
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


export async function api_persona_query_strategies(
  usecaseId: string | undefined,
  personaId: string | undefined,
  intentId: string | undefined,
  loadMore: boolean | undefined,
) {
  if (!usecaseId || !personaId) return usecaseId;

  try {
    const data = await fetch(`${BASE_URL}/cbr/${usecaseId}/persona/${personaId}/intent/${intentId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': getToken(),
      },
      body: JSON.stringify({ loadMore: loadMore })
    });
    const result = await data.json();
    if (result.message) {
      message.error("Strategy Retrieval Failed! Make sure you have completed the AI Model Settings.")
      return []
    };
    return result;
  } catch (error) {
    return [];
  }
}

export async function api_persona_query_strategies_reuse(
  usecaseId: string | undefined,
  personaId: string | undefined,
  intentId: string | undefined,
) {
  if (!usecaseId || !personaId) return usecaseId;

  try {
    const data = await fetch(`${BASE_URL}/cbr/${usecaseId}/persona/${personaId}/intent/${intentId}/reuse`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': getToken(),
      },
    });
    const result = await data.json();
    if (result.message) {
      message.error("Strategy Retrieval Failed! Make sure you have completed the AI Model Settings.")
      return []
    };
    return result;
  } catch (error) {
    return [];
  }
}

export async function api_persona_query_set_default(
  usecaseId: string | undefined,
  personaId: string | undefined,
  intentId: string | undefined,
  strategyId: string | undefined,
) {
  if (!usecaseId || !personaId) return usecaseId;

  try {
    const data = await fetch(`${BASE_URL}/cbr/${usecaseId}/persona/${personaId}/intent_default/${intentId}/strategy/${strategyId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': getToken(),
      },
    });
    const result = await data.json();
    if (result.message) {
      message.error("Strategy Retrieval Failed! Make sure you have completed the AI Model Settings.")
      return []
    };

    return result;
  } catch (error) {
    return [];
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

// -----------------------------------------
//              HANDLE ENDUSERS
// ------------------------------------------
export async function api_create_enduser_invite(usecaseId: string | undefined, values: any) {
  try {
    const data = await fetch(`${BASE_URL}/${KEY}/${usecaseId}/endusers/invite`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': getToken(),
      },
      body: JSON.stringify(values),
    });

    const result = await data.json();
    return result || [];
  } catch (error) {
    return [];
  }
}

export async function api_get_invites(id: string) {
  try {
    const data = await fetch(`${BASE_URL}/${KEY}/${id}/endusers/invites`, {
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

export async function api_invite_publish(id: string, inviteId: string, status: boolean) {
  try {
    const data = await fetch(`${BASE_URL}/${KEY}/${id}/endusers/invite/${inviteId}/publish`, {
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
