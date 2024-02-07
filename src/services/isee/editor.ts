// @ts-ignore

import { EDITOR_URL, BASE_URL } from './api.config';
import { getToken } from './user';

import Cookies from 'js-cookie';

export const open_editor_with_token = async (strategy: string, usecaseId: string) => {
    try {
        const STRATEGY_URL = `${EDITOR_URL}#/id/${strategy}?usecaseId=${usecaseId}`;

        Cookies.set('auth', getToken(), { expires: 1, secure: true, domain: '.isee4xai.com', path: "/", sameSite: 'None' });

        window.open(STRATEGY_URL, "_blank")
        return;

    } catch (error) {
        console.log(error)
        return [];
    }
};

export const refresh_reuse_cases = async (usecase: string, strategy: string) => {
    try {
        const STRATEGY_URL = `${BASE_URL}/trees/Projects/methods`;
        const data = await fetch(STRATEGY_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': getToken()
            },
            body: JSON.stringify({
                usecaseId: usecase,
                treeId: strategy
            })
        });
        const result = await data.json();
        return result || [];
    } catch (error) {
        return [];
    }
};