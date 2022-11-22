export const BASE_URL = process.env.NODE_ENV === 'production' ?
    'https://api-dev.isee4xai.com/api'
    : 'http://localhost:3000/api';

export const ONTOAPI_URL = process.env.NODE_ENV === 'production'
    ? 'https://api-onto-dev.isee4xai.com/api'
    : 'http://localhost:3100/api';