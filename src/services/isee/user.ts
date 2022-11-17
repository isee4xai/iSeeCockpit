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
            await localStorage.setItem('isee_user', JSON.stringify(result));
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
    var user: API.CurrentUser = JSON.parse(localStorage.getItem('isee_user') || '');

    if (user) {
        const decodedJwt = parseJwt(user.token || '');
        if (decodedJwt.exp * 1000 < Date.now()) {
            return {
                success: false,
                data: {}
            }
        } else {
            return {
                success: true,
                data: user
            }
        }
    } else {
        return {
            success: false,
            data: {}
        }
    }
}

export function getToken() {
    // var user = localStorage.getItem('isee_user');
    var user: API.CurrentUser = JSON.parse(localStorage.getItem('isee_user') || '');

    if (!user) {
        return '';
    } else {
        var token = user.token
        if (token) {
            return token as string;
        }
    }

    return '';
}


export function logout() {
    localStorage.removeItem('isee_user');
}

const parseJwt = (token: string) => {
    try {
        return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
        return null;
    }
};
