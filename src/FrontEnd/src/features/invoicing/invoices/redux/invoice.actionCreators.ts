import {
    isEmpty,
    isNil,
} from 'lodash';
import { Dispatch } from 'redux';
import { KnownAction } from './invoice.actions';
import { AppThunkAction } from '../../../../app/globalReduxStore';
import IAction from '../../../../app/globalReduxStore/action.interface';
import ActionType from '../../../../app/globalReduxStore/actionType';
import { DEFAULT_ASSET_TYPE } from '../../../../common/constants';
import {
    ILogger,
    Logger,
} from '../../../../common/logging';
import {
    ExportDownloadInfo,
    ExportFormat,
    PagedResult,
} from '../../../../common/models';
import { apiErrorHandler } from '../../../../common/utilities/errorHandling';
import { TimeActivity } from '../../../time-tracking/time-activities/models';
import {
    Invoice,
    InvoiceLite,
    InvoiceStatus,
    InvoiceTerms,
} from '../models';

const logger: ILogger = new Logger('Invoice Actions');

const actionCreators = {
    /* BEGIN: REST API Actions */
    requestInvoice: (invoiceNumber: number): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        const appState = getState();

        if (!isNil(appState?.invoice) &&
            !isNil(appState?.application?.selectedTenant) &&
            !appState.invoice.details.isFetchingInvoice &&
            (isEmpty(appState.invoice?.details.existingInvoice) ||
                appState.invoice?.details.existingInvoice?.invoiceNumber !== invoiceNumber)) {
            const accessToken = appState.authentication.tokens?.accessToken;
            const tenantId = appState?.application?.selectedTenant?.id;

            fetch(`/api/invoice/${tenantId}/${invoiceNumber}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
                .then((response) => {
                    if (!response.ok) {
                        apiErrorHandler.handleError(response, dispatch as Dispatch<IAction>);
                        return null;
                    }

                    return response.json() as Promise<Invoice>
                })
                .then((invoice) => {
                    if (!isNil(invoice)) {
                        dispatch({
                            type: ActionType.RECEIVE_INVOICE,
                            invoice,
                        });
                    }
                });

            dispatch({ type: ActionType.REQUEST_INVOICE });
        }
    },

    requestInvoiceList: (): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        const appState = getState();

        if (!isNil(appState?.invoice) &&
            !isNil(appState?.application?.selectedTenant) &&
            !appState.invoice.list.isFetching &&
            isEmpty(appState.invoice?.list.results)) {
            const accessToken = appState.authentication.tokens?.accessToken;
            const tenantId = appState?.application?.selectedTenant?.id;

            fetch(`/api/invoice/${tenantId}/list`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
                .then((response) => {
                    if (!response.ok) {
                        apiErrorHandler.handleError(response, dispatch as Dispatch<IAction>);
                        return null;
                    }

                    return response.json() as Promise<PagedResult<InvoiceLite>>
                })
                .then((data) => {
                    if (!isNil(data)) {
                        dispatch({
                            type: ActionType.RECEIVE_INVOICE_LIST,
                            data,
                        });
                    }
                });

            dispatch({ type: ActionType.REQUEST_INVOICE_LIST });
        }
    },

    requestInvoicePdfExport: (invoiceNumber: number): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        const appState = getState();

        if (!isNil(appState?.invoice) &&
            !isNil(appState?.exportDownload) &&
            !isNil(appState?.application?.selectedTenant) &&
            !appState.exportDownload.isFetching) {
            const tenantId = appState?.application?.selectedTenant?.id;

            const exportRequestParameters = {
                tenantId,
                exportType: 'Invoice',
                exportFormat: ExportFormat.PDF,
            };

            const accessToken = appState.authentication.tokens?.accessToken;

            const requestOptions = {
                method: 'POST',
                body: JSON.stringify(exportRequestParameters),
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            };

            fetch(`/api/invoice/${tenantId}/${invoiceNumber}/export-pdf`, requestOptions)
                .then((response) => {
                    if (!response.ok) {
                        apiErrorHandler.handleError(response, dispatch as Dispatch<IAction>);
                        return null;
                    }

                    return response.json() as Promise<ExportDownloadInfo>;
                })
                .then((downloadInfo) => {
                    if (!isNil(downloadInfo)) {
                        dispatch({
                            type: ActionType.RECEIVE_EXPORT_DOWNLOAD_INFO,
                            downloadInfo,
                        });
                    }
                });

            dispatch({ type: ActionType.REQUEST_EXPORT_DOWNLOAD });
        }
    },

    requestInvoiceTerms: (): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        const appState = getState();

        if (!isNil(appState?.invoice) &&
            !isNil(appState?.application?.selectedTenant) &&
            !appState.invoice.details.isFetchingInvoiceTerms &&
            isEmpty(appState.invoice?.details.invoiceTermsOptions)) {
            const accessToken = appState.authentication.tokens?.accessToken;
            const tenantId = appState?.application?.selectedTenant?.id;

            fetch(`/api/invoice/${tenantId}/terms`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
                .then((response) => {
                    if (!response.ok) {
                        apiErrorHandler.handleError(response, dispatch as Dispatch<IAction>);
                        return null;
                    }

                    return response.json() as Promise<InvoiceTerms[]>
                })
                .then((data) => {
                    if (!isNil(data)) {
                        dispatch({
                            type: ActionType.RECEIVE_INVOICE_TERMS,
                            data,
                        });
                    }
                });

            dispatch({ type: ActionType.REQUEST_INVOICE_TERMS });
        }
    },

    requestUnbilledTimeActivities: (): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        const appState = getState();

        if (!isNil(appState?.invoice) &&
            !isNil(appState?.application?.selectedTenant) &&
            !appState.invoice.details.isFetchingUnbilledTimeActivities &&
            !isNil(appState.invoice.details.dirtyInvoice?.customerId) &&
            !isNil(appState.invoice.details.unbilledTimeActivitiesFilterStartDate) &&
            !isNil(appState.invoice.details.unbilledTimeActivitiesFilterEndDate) &&
            isEmpty(appState.invoice?.details.unbilledTimeActivities)) {
            const customer = appState.customers?.list?.customers?.find((c) => c.id === appState.invoice?.details.dirtyInvoice?.customerId);

            if (!isNil(customer)) {
                const accessToken = appState.authentication.tokens?.accessToken;
                const tenantId = appState?.application?.selectedTenant?.id;
                const requestUrl = `/api/time-tracking/${tenantId}/unbilled-time-activities?customer=${customer.customerNumber}&dateRangeStart=${appState.invoice.details.unbilledTimeActivitiesFilterStartDate}&dateRangeEnd=${appState.invoice.details.unbilledTimeActivitiesFilterEndDate}`;

                fetch(requestUrl, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                    .then((response) => {
                        if (!response.ok) {
                            apiErrorHandler.handleError(response, dispatch as Dispatch<IAction>);
                            return null;
                        }

                        return response.json() as Promise<TimeActivity[]>
                    })
                    .then((timeActivities) => {
                        if (!isNil(timeActivities)) {
                            dispatch({
                                type: ActionType.RECEIVE_UNBILLED_TIME_ACTIVITIES,
                                timeActivities,
                            });
                        }
                    });

                dispatch({ type: ActionType.REQUEST_UNBILLED_TIME_ACTIVITIES });
            }
        }
    },

    saveNewInvoice: (): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        const appState = getState();

        const invoiceToSave: Invoice | null = appState.invoice?.details.dirtyInvoice ?? null;

        if (isNil(invoiceToSave)) {
            logger.warn('No Invoice found in store state.  Bailing out...');
            return;
        }

        const accessToken = appState.authentication.tokens?.accessToken;

        const requestOptions = {
            method: 'POST',
            body: JSON.stringify(invoiceToSave),
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        };

        fetch('/api/invoice', requestOptions)
            .then((response) => {
                if (!response.ok) {
                    apiErrorHandler
                        .handleError(response, dispatch as Dispatch<IAction>)
                        .then(() => { dispatch({ type: ActionType.SAVE_INVOICE_ERROR }); });

                    return null;
                }

                return response.json() as Promise<Invoice>;
            })
            .then((savedInvoice) => {
                if (!isNil(savedInvoice)) {
                    dispatch({
                        type: ActionType.NEW_INVOICE_SAVE_COMPLETED,
                        savedInvoice,
                    });
                }
            });

        dispatch({ type: ActionType.REQUEST_SAVE_NEW_INVOICE });
    },

    sendInvoice: (): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        const appState = getState();
        const tenantId = appState.application?.selectedTenant?.id;
        const invoiceToSend = appState.invoice?.details.existingInvoice;

        if (isNil(invoiceToSend)) {
            logger.warn('No Invoice found in store state.  Bailing out.');
            return;
        }

        const accessToken = appState.authentication.tokens?.accessToken;

        const requestBody = {
            tenantId,
            invoiceNumber: invoiceToSend.invoiceNumber,
            status: InvoiceStatus.Sent,
        };

        const requestOptions = {
            method: 'PUT',
            body: JSON.stringify(requestBody),
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        };

        fetch(`/api/invoice/${tenantId}/${invoiceToSend.invoiceNumber}/status`, requestOptions)
            .then(response => {
                if (!response.ok) {
                    apiErrorHandler.handleError(response, dispatch as Dispatch<IAction>);
                    return null;
                }

                return response.json() as Promise<Invoice>;
            })
            .then((updatedInvoice) => {
                if (!isNil(updatedInvoice)) {
                    dispatch({
                        type: ActionType.SEND_INVOICE_COMPLETED,
                        updatedInvoice,
                    });
                }
            });

        dispatch({ type: ActionType.REQUEST_SEND_INVOICE });
    },

    deleteInvoice: (): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        const appState = getState();
        const tenantId = appState.application?.selectedTenant?.id;
        const accessToken = appState.authentication.tokens?.accessToken;
        const invoiceToDelete = appState.invoice?.details.existingInvoice;

        if (isNil(invoiceToDelete)) {
            logger.warn('No Invoice found in store state.  Bailing out.');
            return;
        }

        const requestOptions = {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        };

        fetch(`/api/invoice/${tenantId}/${invoiceToDelete.invoiceNumber}`, requestOptions)
            .then((response) => {
                if (!response.ok) {
                    apiErrorHandler.handleError(response, dispatch as Dispatch<IAction>);
                    dispatch({ type: ActionType.DELETE_INVOICE_ERROR });
                    return;
                }

                dispatch({ type: ActionType.DELETE_INVOICE_COMPLETED });
            });

        dispatch({ type: ActionType.REQUEST_DELETE_INVOICE });
    },
    /* END: REST API Actions */

    /* BEGIN: UI Gesture Actions */
    initializeNewInvoice: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const appState = getState();
        const tenant = appState.application?.selectedTenant;

        if (isNil(tenant)) {
            logger.warn('No selected Tenant.  Cannot create Invoice.');
            return;
        }

        dispatch({
            type: ActionType.INITIALIZE_NEW_INVOICE,
            tenant,
        });
    },

    updateCustomer: (customerId: string | null): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({
            type: ActionType.UPDATE_INVOICE_CUSTOMER,
            customerId,
        });
    },

    updateCustomerAddress: (customerAddress: string | null): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({
            type: ActionType.UPDATE_INVOICE_CUSTOMER_ADDRESS,
            customerAddress,
        });
    },

    updateCustomerEmail: (customerEmail: string | null): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({
            type: ActionType.UPDATE_INVOICE_CUSTOMER_EMAIL,
            customerEmail,
        });
    },

    updateInvoiceTerms: (invoiceTermsId: string | null): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({
            type: ActionType.UPDATE_INVOICE_TERMS,
            invoiceTermsId,
        });
    },

    updateInvoiceIssueDate: (issueDate: string | null): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({
            type: ActionType.UPDATE_INVOICE_ISSUE_DATE,
            issueDate,
        });
    },

    updateInvoiceDueDate: (dueDate: string | null): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({
            type: ActionType.UPDATE_INVOICE_DUE_DATE,
            dueDate,
        });
    },

    updateInvoiceMessage: (message: string | null): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({
            type: ActionType.UPDATE_INVOICE_MESSAGE,
            message,
        });
    },

    updateUnbilledTimeActivitiesFilterStartDate: (startDate: string | null): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({
            type: ActionType.UPDATE_UNBILLED_TIME_ACTIVITIES_FILTER_START_DATE,
            startDate,
        });
    },

    updateUnbilledTimeActivitiesFilterEndDate: (endDate: string | null): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({
            type: ActionType.UPDATE_UNBILLED_TIME_ACTIVITIES_FILTER_END_DATE,
            endDate,
        });
    },

    addSelectedTimeActivitiesAsInvoiceLineItems: (timeActivities: TimeActivity[]): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const appState = getState();
        const assetType = appState.application?.selectedTenant?.defaultAssetType ?? DEFAULT_ASSET_TYPE;

        dispatch({
            type: ActionType.ADD_SELECTED_TIME_ACTIVITIES_AS_INVOICE_LINE_ITEMS,
            assetType,
            timeActivities,
        });
    },
    /* END: UI Gesture Actions */

    /* BEGIN: Resets */
    reset: (): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: ActionType.RESET_INVOICE_STORE_STATE });
    },

    resetDirtyInvoice: (): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: ActionType.RESET_DIRTY_INVOICE });
    },

    resetExistingInvoice: (): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: ActionType.RESET_EXISTING_INVOICE });
    },

    resetInvoiceList: (): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: ActionType.RESET_INVOICE_LIST });
    },
    /* END: Resets */
};

export default actionCreators;
