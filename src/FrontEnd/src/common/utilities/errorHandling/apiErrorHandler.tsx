import React from 'react';
import {
    isEmpty,
    isNil,
    uniqueId,
} from 'lodash';
import {
    bindActionCreators,
    Dispatch,
} from 'redux';
import IAction from "../../../app/globalReduxStore/action.interface";
import IApiErrorHandler from './apiErrorHandler.interface';
import { ApiErrorResponse } from '../../models';
import * as SystemNotifications from '../../../app/notifications';
import {
    ILogger,
    Logger,
} from '../../logging';
import NotificationLevel from '../../../app/notifications/notificationLevel';

const logger: ILogger = new Logger('API Error Handler');

class ApiErrorHandler implements IApiErrorHandler {
    async handleError(errorResponse: Response, dispatch: Dispatch<IAction>) {
        logger.info('API Error response (raw):', errorResponse);
        const showAlert = bindActionCreators(SystemNotifications.actionCreators.showAlert, dispatch);
        const httpStatus = !isEmpty(errorResponse.statusText) ? `${errorResponse.status} ${errorResponse.statusText}` : `HTTP ${errorResponse.status}`;

        if (errorResponse.status === 401) { // 401 Unauthorized
            logger.info('Received 401 Unauthorized from the API.  Redirecting to login page...');
            window.location.href = `${window.location.origin}/login?returnUrl=${encodeURIComponent(window.location.pathname)}`;
        } else {
            switch (errorResponse.status) {
                case 403: // Forbidden - Likely a Permissions issue
                    showAlert(NotificationLevel.Warning, 'You do not have permission for this operation', false);
                    break;

                default:
                    {
                        const structuredApiErrorResponse = await (errorResponse.json() as Promise<ApiErrorResponse>);
                        let errorMessage: string = 'An unexpected error occurred.';
                        let errorToastJsx: React.ReactNode;
                        let validationErrorDetails: React.ReactNode;

                        if (!isNil(structuredApiErrorResponse)) {
                            errorMessage = structuredApiErrorResponse.detail ?? structuredApiErrorResponse.title ?? errorMessage;

                            if (!isEmpty(structuredApiErrorResponse.errors)) {
                                validationErrorDetails = (
                                    <ul>
                                        {Object.values(structuredApiErrorResponse.errors).flatMap((e) => (<li key={`error-${uniqueId}`}>{e}</li>))}
                                    </ul>
                                );
                            }
                        }

                        errorToastJsx = (
                            <React.Fragment>
                                <p>{errorMessage}</p>

                                {!isNil(validationErrorDetails) && (
                                    <React.Fragment>
                                        {validationErrorDetails}
                                    </React.Fragment>
                                )}

                                <hr className="mb-1" />

                                <p className="fst-italic mt-0 mb-0 text-secondary">
                                    {httpStatus}
                                </p>
                            </React.Fragment>
                        );

                        showAlert(
                            Math.floor(errorResponse.status / 100) === 4 ? NotificationLevel.Warning : NotificationLevel.Danger,
                            errorToastJsx,
                            false);

                        break;
                    }
            }
        }
    }

}

const apiErrorHandler = new ApiErrorHandler();

export default apiErrorHandler;
