import {
    isEmpty,
    isNil,
} from 'lodash';
import {
    DateTime,
    Duration,
} from 'luxon';
import {
    Action,
    Reducer,
} from 'redux';
import { KnownAction } from './invoice.actions';
import ActionType from '../../../../app/globalReduxStore/actionType';
import { DEFAULT_INVOICE_TERMS } from '../../../../common/constants';
import {
    AmountType,
    DateTimeString,
    PagedResult,
} from '../../../../common/models';
import { TimeActivity } from '../../../time-tracking/time-activities/models';
import {
    Invoice,
    InvoiceLineItem,
    InvoiceLite,
    InvoiceStatus,
    InvoiceTerms,
} from '../models';

export interface InvoiceListState {
    isFetching: boolean;
    results: PagedResult<InvoiceLite> | null;
    // TODO: Parameters for filtering the Invoice List
}

const DEFAULT_INVOICE_LIST_STATE: InvoiceListState = {
    isFetching: false,
    results: null,
};

export interface SingleInvoiceState {
    dirtyInvoice: Invoice | null;
    existingInvoice: Invoice | null;
    invoiceTermsOptions: InvoiceTerms[];
    isDeleting: boolean;
    isFetchingInvoice: boolean;
    isFetchingInvoiceTerms: boolean;
    isFetchingUnbilledTimeActivities: boolean;
    isSaving: boolean;
    unbilledTimeActivities: TimeActivity[];
    unbilledTimeActivitiesFilterStartDate: DateTimeString | null;
    unbilledTimeActivitiesFilterEndDate: DateTimeString | null;
}

const DEFAULT_SINGLE_INVOICE_STATE: SingleInvoiceState = {
    dirtyInvoice: null,
    existingInvoice: null,
    invoiceTermsOptions: [],
    isDeleting: false,
    isFetchingInvoice: false,
    isFetchingInvoiceTerms: false,
    isFetchingUnbilledTimeActivities: false,
    isSaving: false,
    unbilledTimeActivities: [],
    unbilledTimeActivitiesFilterStartDate: null,
    unbilledTimeActivitiesFilterEndDate: null,
};

export interface InvoiceStoreState {
    list: InvoiceListState;
    details: SingleInvoiceState;
}

const unloadedState: InvoiceStoreState = {
    list: { ...DEFAULT_INVOICE_LIST_STATE },
    details: { ...DEFAULT_SINGLE_INVOICE_STATE },
};

const getDueDateBasedOnInvoiceTerms = (invoiceIssueDate: DateTimeString, terms: InvoiceTerms): DateTimeString | null => {
    const issueDateMoment = DateTime.fromISO(invoiceIssueDate);

    if (!isNil(terms.dueInDays)) {
        return issueDateMoment.plus({ days: terms.dueInDays }).toISODate();
    }

    if (!isNil(terms.dueOnDayOfMonth)) {
        let dueDate = issueDateMoment.set({ day: terms.dueOnDayOfMonth });

        if (dueDate <= issueDateMoment) {
            dueDate = dueDate.set({ month: dueDate.month + 1 });
        }

        if (!isNil(terms.dueNextMonthThreshold)) {
            const diff = issueDateMoment.diff(dueDate, 'days');

            if (diff.as('days') < terms.dueNextMonthThreshold) {
                dueDate = dueDate.set({ month: dueDate.month + 1 });
            }
        }

        return dueDate.toISODate();
    }

    return null;
};

const reducer: Reducer<InvoiceStoreState> = (state: InvoiceStoreState | undefined, incomingAction: Action): InvoiceStoreState => {
    if (state === undefined) {
        return unloadedState;
    }

    const action = incomingAction as KnownAction;

    if (!isNil(action)) {
        switch (action.type) {
            /* BEGIN: REST API Actions */
            case ActionType.REQUEST_INVOICE:
                return {
                    ...state,
                    details: {
                        ...state.details as Pick<SingleInvoiceState, keyof SingleInvoiceState>,
                        isFetchingInvoice: true,
                    },
                };

            case ActionType.RECEIVE_INVOICE:
                return {
                    ...state,
                    details: {
                        ...state.details as Pick<SingleInvoiceState, keyof SingleInvoiceState>,
                        existingInvoice: action.invoice,
                        isFetchingInvoice: false,
                    },
                };

            case ActionType.REQUEST_INVOICE_LIST:
                return {
                    ...state,
                    list: {
                        ...state.list as Pick<InvoiceListState, keyof InvoiceListState>,
                        isFetching: true,
                    },
                };

            case ActionType.RECEIVE_INVOICE_LIST:
                return {
                    ...state,
                    list: {
                        ...state.list as Pick<InvoiceListState, keyof InvoiceListState>,
                        isFetching: false,
                        results: action.data,
                    },
                };

            case ActionType.REQUEST_INVOICE_TERMS:
                return {
                    ...state,
                    details: {
                        ...state.details as Pick<SingleInvoiceState, keyof SingleInvoiceState>,
                        isFetchingInvoiceTerms: true,
                    },
                };

            case ActionType.RECEIVE_INVOICE_TERMS: {
                let dirtyInvoice = state.details.dirtyInvoice;
                const invoiceTermsOptions = action.data;

                if (!isNil(dirtyInvoice) &&
                    !isEmpty(invoiceTermsOptions) &&
                    dirtyInvoice.invoiceTermsId === null) {
                    const defaultTerms = invoiceTermsOptions.find((t) => t.name === DEFAULT_INVOICE_TERMS);
                    let dueDate: DateTimeString | null = null;

                    if (!isNil(defaultTerms) &&
                        !isNil(dirtyInvoice.issueDate)) {
                        dueDate = getDueDateBasedOnInvoiceTerms(dirtyInvoice.issueDate, defaultTerms);
                    }

                    dirtyInvoice = {
                        ...dirtyInvoice as Pick<Invoice, keyof Invoice>,
                        invoiceTermsId: defaultTerms?.id ?? null,
                        dueDate,
                    };
                }

                return {
                    ...state,
                    details: {
                        ...state.details as Pick<SingleInvoiceState, keyof SingleInvoiceState>,
                        isFetchingInvoiceTerms: false,
                        invoiceTermsOptions,
                        dirtyInvoice,
                    },
                };
            }

            case ActionType.REQUEST_UNBILLED_TIME_ACTIVITIES:
                return {
                    ...state,
                    details: {
                        ...state.details as Pick<SingleInvoiceState, keyof SingleInvoiceState>,
                        isFetchingUnbilledTimeActivities: true,
                    },
                };

            case ActionType.RECEIVE_UNBILLED_TIME_ACTIVITIES:
                return {
                    ...state,
                    details: {
                        ...state.details as Pick<SingleInvoiceState, keyof SingleInvoiceState>,
                        isFetchingUnbilledTimeActivities: false,
                        unbilledTimeActivities: action.timeActivities,
                    },
                };

            case ActionType.REQUEST_SAVE_NEW_INVOICE:
            case ActionType.REQUEST_SEND_INVOICE:
                return {
                    ...state,
                    details: {
                        ...state.details as Pick<SingleInvoiceState, keyof SingleInvoiceState>,
                        isSaving: true,
                    },
                };

            case ActionType.SAVE_INVOICE_ERROR:
                return {
                    ...state,
                    details: {
                        ...state.details as Pick<SingleInvoiceState, keyof SingleInvoiceState>,
                        isSaving: false,
                    },
                };

            case ActionType.NEW_INVOICE_SAVE_COMPLETED:
                return {
                    ...state,
                    details: {
                        ...state.details as Pick<SingleInvoiceState, keyof SingleInvoiceState>,
                        existingInvoice: action.savedInvoice,
                        isSaving: false,
                    },
                };

            case ActionType.SEND_INVOICE_COMPLETED:
                return {
                    ...state,
                    details: {
                        ...state.details as Pick<SingleInvoiceState, keyof SingleInvoiceState>,
                        existingInvoice: action.updatedInvoice,
                        isSaving: false,
                    },
                };

            case ActionType.REQUEST_DELETE_INVOICE:
                return {
                    ...state,
                    details: {
                        ...state.details as Pick<SingleInvoiceState, keyof SingleInvoiceState>,
                        isDeleting: true,
                    },
                };

            case ActionType.DELETE_INVOICE_COMPLETED:
                return unloadedState;

            case ActionType.DELETE_INVOICE_ERROR:
                return {
                    ...state,
                    details: {
                        ...state.details as Pick<SingleInvoiceState, keyof SingleInvoiceState>,
                        isDeleting: false,
                    },
                };

            /* END: REST API Actions */

            /* BEGIN: UI Gesture Actions */
            case ActionType.INITIALIZE_NEW_INVOICE:
                return {
                    ...state,
                    details: {
                        ...state.details as Pick<SingleInvoiceState, keyof SingleInvoiceState>,
                        dirtyInvoice: {
                            tenantId: action.tenant.id,
                            status: InvoiceStatus.Draft,
                            issueDate: DateTime.now().toISODate(),
                            amount: {
                                amount: 0,
                                amountAsString: '0.00',
                                amountType: AmountType.Debit,
                                assetType: action.tenant.defaultAssetType,
                            },
                            dueDate: null,
                            customerId: null,
                            customerAddress: null,
                            customerEmail: null,
                            invoiceTermsId: null,
                            message: null,
                            lineItems: [],
                        },
                    }
                };

            case ActionType.UPDATE_INVOICE_CUSTOMER:
                return {
                    ...state,
                    details: {
                        ...state.details as Pick<SingleInvoiceState, keyof SingleInvoiceState>,
                        dirtyInvoice: {
                            ...state.details.dirtyInvoice as Pick<Invoice, keyof Invoice>,
                            customerId: action.customerId,
                        },
                    },
                };

            case ActionType.UPDATE_INVOICE_CUSTOMER_ADDRESS:
                return {
                    ...state,
                    details: {
                        ...state.details as Pick<SingleInvoiceState, keyof SingleInvoiceState>,
                        dirtyInvoice: {
                            ...state.details.dirtyInvoice as Pick<Invoice, keyof Invoice>,
                            customerAddress: action.customerAddress,
                        },
                    },
                };

            case ActionType.UPDATE_INVOICE_CUSTOMER_EMAIL:
                return {
                    ...state,
                    details: {
                        ...state.details as Pick<SingleInvoiceState, keyof SingleInvoiceState>,
                        dirtyInvoice: {
                            ...state.details.dirtyInvoice as Pick<Invoice, keyof Invoice>,
                            customerEmail: action.customerEmail,
                        },
                    },
                };

            case ActionType.UPDATE_INVOICE_DUE_DATE:
                return {
                    ...state,
                    details: {
                        ...state.details as Pick<SingleInvoiceState, keyof SingleInvoiceState>,
                        dirtyInvoice: {
                            ...state.details.dirtyInvoice as Pick<Invoice, keyof Invoice>,
                            dueDate: action.dueDate,
                        },
                    },
                };

            case ActionType.UPDATE_INVOICE_ISSUE_DATE: {
                let dirtyInvoice = {
                    ...state.details.dirtyInvoice as Pick<Invoice, keyof Invoice>,
                    issueDate: action.issueDate,
                };

                if (!isNil(dirtyInvoice.invoiceTermsId)) {
                    const selectedTerms = state.details.invoiceTermsOptions.find((ito) => ito.id === dirtyInvoice.invoiceTermsId);

                    if (!isNil(selectedTerms) &&
                        !isNil(dirtyInvoice.issueDate)) {
                        const dueDate = getDueDateBasedOnInvoiceTerms(dirtyInvoice.issueDate, selectedTerms);

                        dirtyInvoice = {
                            ...dirtyInvoice,
                            dueDate,
                        };
                    }
                }

                return {
                    ...state,
                    details: {
                        ...state.details as Pick<SingleInvoiceState, keyof SingleInvoiceState>,
                        dirtyInvoice,
                    },
                };
            }

            case ActionType.UPDATE_INVOICE_TERMS: {
                let dirtyInvoice = {
                    ...state.details.dirtyInvoice as Pick<Invoice, keyof Invoice>,
                    invoiceTermsId: action.invoiceTermsId,
                };

                if (!isNil(action.invoiceTermsId)) {
                    const selectedTerms = state.details.invoiceTermsOptions.find((ito) => ito.id === action.invoiceTermsId);

                    if (!isNil(selectedTerms) &&
                        !isNil(dirtyInvoice.issueDate)) {
                        const dueDate = getDueDateBasedOnInvoiceTerms(dirtyInvoice.issueDate, selectedTerms);

                        dirtyInvoice = {
                            ...dirtyInvoice,
                            dueDate,
                        };
                    }
                }

                return {
                    ...state,
                    details: {
                        ...state.details as Pick<SingleInvoiceState, keyof SingleInvoiceState>,
                        dirtyInvoice,
                    },
                };
            }

            case ActionType.UPDATE_INVOICE_MESSAGE:
                return {
                    ...state,
                    details: {
                        ...state.details as Pick<SingleInvoiceState, keyof SingleInvoiceState>,
                        dirtyInvoice: {
                            ...state.details.dirtyInvoice as Pick<Invoice, keyof Invoice>,
                            message: action.message,
                        },
                    },
                };

            case ActionType.UPDATE_UNBILLED_TIME_ACTIVITIES_FILTER_START_DATE:
                return {
                    ...state,
                    details: {
                        ...state.details as Pick<SingleInvoiceState, keyof SingleInvoiceState>,
                        unbilledTimeActivitiesFilterStartDate: action.startDate,
                    },
                };

            case ActionType.UPDATE_UNBILLED_TIME_ACTIVITIES_FILTER_END_DATE:
                return {
                    ...state,
                    details: {
                        ...state.details as Pick<SingleInvoiceState, keyof SingleInvoiceState>,
                        unbilledTimeActivitiesFilterEndDate: action.endDate,
                    },
                };

            case ActionType.ADD_SELECTED_TIME_ACTIVITIES_AS_INVOICE_LINE_ITEMS: {
                const existingLineItems = state.details.dirtyInvoice?.lineItems ?? [];

                const maxExistingOrderNumber = existingLineItems
                    .map((li) => li.orderNumber)
                    .reduce((prevMax, current) => current > prevMax ? current : prevMax, 0);

                let nextOrderNumber = maxExistingOrderNumber;

                const newLineItems = action.timeActivities.map(
                    (ta: TimeActivity): InvoiceLineItem => {
                        const quantity = Duration.fromISOTime(ta.totalTime ?? '').as('hours');

                        return {
                            id: null,
                            orderNumber: ++nextOrderNumber,
                            date: ta.date,
                            productId: ta.productId,
                            productOrService: ta.product?.name,
                            productCategory: ta.product?.category,
                            description: ta.description,
                            quantity,
                            unitPrice: {
                                amount: ta.hourlyBillingRate ?? 0,
                                amountType: AmountType.Debit,
                                assetType: action.assetType,
                            },
                            total: {
                                amount: quantity * (ta.hourlyBillingRate ?? 0),
                                amountType: AmountType.Debit,
                                assetType: action.assetType,
                            },
                            timeActivityId: ta.id ?? '',
                        };
                    },
                );

                const updatedLineItems = [...existingLineItems, ...newLineItems];

                const invoiceTotal = updatedLineItems
                    .map((li) => li.total?.amount ?? 0)
                    .reduce((sum, next) => (sum + next), 0);

                return {
                    ...state,
                    details: {
                        ...state.details as Pick<SingleInvoiceState, keyof SingleInvoiceState>,
                        dirtyInvoice: {
                            ...state.details.dirtyInvoice as Pick<Invoice, keyof Invoice>,
                            lineItems: updatedLineItems,
                            amount: {
                                amount: invoiceTotal,
                                amountType: AmountType.Debit,
                                assetType: action.assetType,
                            },
                        },
                    },
                };
            }
            /* END: UI Gesture Actions */

            /* BEGIN: Resets */
            case ActionType.RESET_INVOICE_LIST:
                return {
                    ...state,
                    list: { ...DEFAULT_INVOICE_LIST_STATE },
                };

            case ActionType.RESET_DIRTY_INVOICE:
                return {
                    ...state,
                    details: {
                        ...state.details as Pick<SingleInvoiceState, keyof SingleInvoiceState>,
                        dirtyInvoice: null,
                    },
                };

            case ActionType.RESET_EXISTING_INVOICE:
                return {
                    ...state,
                    details: {
                        ...state.details as Pick<SingleInvoiceState, keyof SingleInvoiceState>,
                        existingInvoice: null,
                    },
                };

            case ActionType.RESET_INVOICE_STORE_STATE:
                return unloadedState;
            /* END: Resets */

            default:
                return state;
        }
    }

    // All stores should get reset to default state on logout
    if (incomingAction.type === ActionType.RECEIVE_LOGOUT_RESPONSE) {
        return unloadedState;
    }

    return state;
};

export default reducer;
