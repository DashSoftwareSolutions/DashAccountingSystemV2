import { isNil } from 'lodash';
import {
    Action,
    Reducer,
} from 'redux';
import { KnownAction } from './products.actions';
import ActionType from '../../../../app/globalReduxStore/actionType';
import { ProductLite } from '../models';

export interface ProductStoreState {
    isFetching: boolean;
    products: ProductLite[];
}

const unloadedState: ProductStoreState = {
    isFetching: false,
    products: [],
};

const reducer: Reducer<ProductStoreState> = (state: ProductStoreState | undefined, incomingAction: Action): ProductStoreState => {
    if (state === undefined) {
        return unloadedState;
    }

    const action = incomingAction as KnownAction;

    if (!isNil(action)) {
        switch (action.type) {
            case ActionType.REQUEST_PRODUCTS:
                return {
                    ...state,
                    isFetching: true
                };

            case ActionType.RECEIVE_PRODUCTS:
                return {
                    ...state,
                    isFetching: false,
                    products: action.products,
                };
        }
    }

    // All stores should get reset to default state on logout
    if (incomingAction.type === ActionType.RECEIVE_LOGOUT_RESPONSE) {
        return unloadedState;
    }

    return state;
};

export default reducer;
