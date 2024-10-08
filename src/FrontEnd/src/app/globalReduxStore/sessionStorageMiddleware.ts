import {
    Dispatch,
    Middleware,
} from 'redux';
import { RootState } from '.';
import IAction from './action.interface';
import ActionType from './actionType';
import { AUTH_SESSION_STORAGE_KEY } from '../../common/constants';
import { encodeJsonObjectAsBase64 } from '../../common/utilities/encoding';

const authenticationSessionStorageMiddleware: Middleware<
    Dispatch<IAction>,
    RootState,
    Dispatch<IAction>
> = storeApi => next => action => {
    switch (action.type) {
        case ActionType.RECEIVE_SUCCESSFUL_LOGIN_RESPONSE:
        case ActionType.RECEIVE_UPDATED_TOKENS:
            window.sessionStorage.setItem(AUTH_SESSION_STORAGE_KEY, encodeJsonObjectAsBase64(action.accessTokenResponse));
            break;

        case ActionType.RECEIVE_LOGOUT_RESPONSE:
            window.sessionStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
            break;
    }

    return next(action);
}

export default authenticationSessionStorageMiddleware;
