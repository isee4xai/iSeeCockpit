// @ts-ignore
import type { Persona, PersonaDetails, PersonaIntent } from '@/models/persona';
import { message } from 'antd';
import { ONTOAPI_URL } from './api.config';

const KEY = 'onto';

// -----------------------------------------
//              HANDLE USECASE
// ------------------------------------------

export async function get_domains() {
  try {
    const data = await fetch(`${ONTOAPI_URL}/${KEY}/UserDomain`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    });
    const result = await data.json();
    if (result.message) {
      message.error("Error Reading Ontology - E001");
      return false;
    }

    return result || false;
  } catch (error) {
    message.error("Error Reading Ontology - API Error");
    return false;
  }
}

