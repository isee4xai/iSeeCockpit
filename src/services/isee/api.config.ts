export const BASE_URL = process.env.NODE_ENV === 'production' ?
    'https://api-dev.isee4xai.com/api'
    : 'http://localhost:3000/api';

export const ONTOAPI_URL = process.env.NODE_ENV === 'production'
    ? 'https://api-onto-dev.isee4xai.com/api'
    : 'http://localhost:3100/api';

export const WS_URL = process.env.NODE_ENV === 'production'
    ? 'wss://dialog-dev.isee4xai.com/ws/'
    : 'ws://127.0.0.1:8000/ws/';

export const EDITOR_URL = "https://editor-dev.isee4xai.com/";