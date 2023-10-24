// @ts-ignore

import { EDITOR_URL } from './api.config';
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