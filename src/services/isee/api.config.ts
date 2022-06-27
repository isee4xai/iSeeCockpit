import { getToken } from "./user";

export const BASE_URL = process.env.ISEE_API || 'http://localhost:3000/api';
export const HEADERS = {
    'Content-Type': 'application/json',
    'x-access-token': getToken()
}