// @ts-ignore

const KEY = 'user';
import { BASE_URL } from './api.config';

export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
    try {
        const data = await fetch(`${BASE_URL}/${KEY}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
        // Only for successful logins
        if (data.status == 200) {
            let result = await data.json();
            localStorage.setItem('isee_user', JSON.stringify(result));
            localStorage.setItem('isee_token', result.token);
            result.status = "ok"
            return result || "";
        } else {
            return {
                status: 'error',
                status_message: "Please check your credentials!"
            };
        }
    } catch (error) {
        return {
            status: 'error',
            status_message: error
        };
    }
};

export async function currentUser(options?: { [key: string]: any }) {
    var isee_user = localStorage.getItem('isee_user');
    if (isee_user) {
        return {
            success: true,
            data: JSON.parse(isee_user)
        }
    } else {
        return {
            success: false,
            data: {}
        }
    }
}

export function getToken() {
    var token = localStorage.getItem('isee_token');
    if (token) {
        return token as string;
    }
    return '';
}
