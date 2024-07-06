import {
    isEmpty,
    isNil,
} from 'lodash';
import {
    bindActionCreators,
    Dispatch,
} from 'redux';
import IAction from "../../../app/store/iaction.interface";
import IApiErrorHandler from './iapiErrorHandler.interface';
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
            window.location.href = `${window.location.origin}/Identity/Account/Login?returnUrl=${encodeURIComponent(window.location.href)}`;
        } else {
            switch (errorResponse.status) {
                case 403: // Forbidden - Likely a Permissions issue
                    showAlert(NotificationLevel.Warning, 'You do not have permission for this operation', false);
                    break;

                case 400: // 400 Bad Request
                case 409: // 409 Conflict
                    {
                        const structuredApiErrorResponse = await (errorResponse.json() as Promise<ApiErrorResponse>);
                        const errorMessage = `${structuredApiErrorResponse.detail} (${httpStatus})`;

                        // TODO: There might be validation errors or other things that need to go into detailed error messages

                        if (!isNil(structuredApiErrorResponse)) {
                            showAlert(NotificationLevel.Warning, errorMessage, false);
                        }

                        break;
                    }

                default:
                    showAlert(NotificationLevel.Danger, `Received an error from the API.  ${httpStatus}`, false);

            }
        }
    }

}

const apiErrorHandler = new ApiErrorHandler();

export default apiErrorHandler;
