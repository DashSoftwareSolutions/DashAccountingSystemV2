import IAction from '../../../../app/globalReduxStore/action.interface';
import ActionType from '../../../../app/globalReduxStore/actionType';
import { ProductLite } from '../models';

export interface RequestProductsAction extends IAction {
    type: ActionType.REQUEST_PRODUCTS;
}

export interface ReceiveProductsAction extends IAction {
    type: ActionType.RECEIVE_PRODUCTS;
    products: ProductLite[];
}

export type KnownAction = RequestProductsAction | ReceiveProductsAction;
