import { isNil } from 'lodash';
import { Dispatch } from 'redux';
import { KnownAction } from './payment.actions';
import { AppThunkAction } from '../../../../app/globalReduxStore';
import IAction from '../../../../app/globalReduxStore/action.interface';
import ActionType from '../../../../app/globalReduxStore/actionType';
import {
    ILogger,
    Logger,
} from '../../../../common/logging';
import { apiErrorHandler } from '../../../../common/utilities/errorHandling';
import { Invoice } from '../../invoices/models';
import { Payment } from '../models';

const logger: ILogger = new Logger('Payment Actions');

const actionCreators = {
    /* BEGIN: REST API Actions */
    saveNewPayment: (): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        const appState = getState();

        const paymentToSave: Payment | null = appState.payments?.dirtyPayment ?? null;

        if (isNil(paymentToSave)) {
            logger.warn('No Payment found in store state.  Bailing out...');
            return;
        }

        // TODO: Make sure Payment is valid to save
        const accessToken = appState.authentication.tokens?.accessToken;

        const requestOptions = {
            method: 'POST',
            body: JSON.stringify(paymentToSave),
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        };

        fetch('/api/payment', requestOptions)
            .then((response) => {
                if (!response.ok) {
                    apiErrorHandler
                        .handleError(response, dispatch as Dispatch<IAction>)
                        .then(() => { dispatch({ type: ActionType.SAVE_PAYMENT_ERROR }); });

                    return null;
                }

                return response.json() as Promise<Payment>;
            })
            .then((savedPayment) => {
                if (!isNil(savedPayment)) {
                    dispatch({
                        type: ActionType.NEW_PAYMENT_SAVE_COMPLETED,
                        savedPayment,
                    });
                }
            });

        dispatch({ type: ActionType.REQUEST_SAVE_NEW_PAYMENT });
    },
    /* END: REST API Actions */

    /* BEGIN: UI Gesture Actions */
    initializeNewPayment: (invoice: Invoice): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({
            type: ActionType.INITIALIZE_NEW_PAYMENT,
            invoice,
        });
    },

    updatePaymentAmount: (amountAsString: string | null, amount: number | null): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({
            type: ActionType.UPDATE_PAYMENT_AMOUNT,
            amount,
            amountAsString,
        });
    },

    updatePaymentCheckNumber: (checkNumber: number | null): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({
            type: ActionType.UPDATE_PAYMENT_CHECK_NUMBER,
            checkNumber,
        });
    },

    updatePaymentDate: (date: string | null): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({
            type: ActionType.UPDATE_PAYMENT_DATE,
            date,
        });
    },

    updatePaymentDepositAccount: (depositAccountId: string | null): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({
            type: ActionType.UPDATE_PAYMENT_DEPOSIT_ACCOUNT,
            depositAccountId,
        });
    },

    updatePaymentDescription: (description: string | null): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({
            type: ActionType.UPDATE_PAYMENT_DESCRIPTION,
            description,
        });
    },

    updatePaymentInvoiceAmount: (invoiceId: string, amountAsString: string | null, amount: number | null): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({
            type: ActionType.UPDATE_PAYMENT_INVOICE_AMOUNT,
            invoiceId,
            amountAsString,
            amount,
        });
    },

    updatePaymentInvoiceIsSelected: (invoiceId: string, isSelected: boolean): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({
            type: ActionType.UPDATE_PAYMENT_INVOICE_IS_SELECTED,
            invoiceId,
            isSelected,
        });
    },

    updatePaymentIsPosted: (isPosted: boolean): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({
            type: ActionType.UPDATE_PAYMENT_IS_POSTED,
            isPosted,
        });
    },

    updatePaymentMethod: (paymentMethodId: number | null): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({
            type: ActionType.UPDATE_PAYMENT_METHOD,
            paymentMethodId,
        });
    },

    updatePaymentRevenueAccount: (revenueAccountId: string | null): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({
            type: ActionType.UPDATE_PAYMENT_REVENUE_ACCOUNT,
            revenueAccountId,
        });
    },

    updatePaymentSelectAllInvoices: (isSelected: boolean): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({
            type: ActionType.UPDATE_PAYMENT_ARE_ALL_INVOICES_SELECTED,
            isSelected,
        });
    },
    /* END: UI Gesture Actions */

    /* BEGIN: Resets */
    reset: (): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: ActionType.RESET_PAYMENT_STORE_STATE });
    },
    /* END: Resets */
};

export default actionCreators;
