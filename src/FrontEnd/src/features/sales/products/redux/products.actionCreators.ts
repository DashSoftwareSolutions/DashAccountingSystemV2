import {
    isEmpty,
    isNil,
} from 'lodash';
import { Dispatch } from 'redux';
import { KnownAction } from './products.actions';
import { AppThunkAction } from '../../../../app/globalReduxStore';
import IAction from '../../../../app/globalReduxStore/action.interface';
import ActionType from '../../../../app/globalReduxStore/actionType';
import {
    ILogger,
    Logger,
} from '../../../../common/logging';
import { apiErrorHandler } from '../../../../common/utilities/errorHandling';
import { ProductLite } from '../models';

const logger: ILogger = new Logger('Product Actions');

const actionCreators = {
    requestProducts: (): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        const appState = getState();

        if (!isNil(appState?.products) &&
            !appState.products.isFetching &&
            (isEmpty(appState.products.products))) {

            const tenantId = appState.application?.selectedTenant?.id;

            if (isNil(tenantId)) {
                logger.warn('No selected Tenant.  Cannot fetch Products.');
                return;
            }

            const accessToken = appState.authentication.tokens?.accessToken;

            fetch(`/api/sales/${tenantId}/products`, {
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
};

export default actionCreators;
