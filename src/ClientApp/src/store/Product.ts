import {
    Action,
    Dispatch,
    Reducer,
} from 'redux';
import { isEmpty, isNil } from 'lodash';
import { AppThunkAction } from './';
import { Logger } from '../common/Logging';
import apiErrorHandler from '../common/ApiErrorHandler';
import authService from '../components/api-authorization/AuthorizeService';
import ActionType from './ActionType';
import ProductLite from '../models/ProductLite';
import IAction from './IAction';

export interface ProductStoreState {
    isLoading: boolean;
    products: ProductLite[];
}

interface RequestProductsAction extends IAction {
    type: ActionType.REQUEST_PRODUCTS;
}

interface ReceiveProductsAction extends IAction {
    type: ActionType.RECEIVE_PRODUCTS;
    products: ProductLite[];
}

type KnownAction = RequestProductsAction | ReceiveProductsAction;

const logger = new Logger('Product Store');

export const actionCreators = {
    requestProducts: (): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        const appState = getState();

        if (!isNil(appState?.products) &&
            !appState.products.isLoading &&
            (isEmpty(appState.products.products))) {

            const tenantId = appState.tenants?.selectedTenant?.id;

            if (isNil(tenantId)) {
                logger.warn('No selected Tenant.  Cannot fetch Products.');
                return;
            }

            const accessToken = await authService.getAccessToken();

            fetch(`api/sales/${tenantId}/products`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
                .then(response => {
                    if (!response.ok) {
                        apiErrorHandler.handleError(response, dispatch as Dispatch<IAction>);
                        return null;
                    }

                    return response.json() as Promise<ProductLite[]>
                })
                .then(products => {
                    if (!isNil(products)) {
                        dispatch({
                            type: ActionType.RECEIVE_PRODUCTS,
                            products,
                        });
                    }
                });

            dispatch({ type: ActionType.REQUEST_PRODUCTS });
        }
    },
}

const unloadedState: ProductStoreState = {
    isLoading: false,
    products: [],
};

export const reducer: Reducer<ProductStoreState> = (state: ProductStoreState | undefined, incomingAction: Action): ProductStoreState => {
    if (state === undefined) {
        return unloadedState;
    }

    const action = incomingAction as KnownAction;

    if (!isNil(action)) {
        switch (action.type) {
            case ActionType.REQUEST_PRODUCTS:
                return {
                    ...state,
                    isLoading: true
                };

            case ActionType.RECEIVE_PRODUCTS:
                return {
                    ...state,
                    isLoading: false,
                    products: action.products,
                };
        }
    }

    return state;
};
