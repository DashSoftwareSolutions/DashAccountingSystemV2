import { bindActionCreators, Dispatch } from 'redux';
import { isEmpty, isNil } from 'lodash';
import { Logger } from './Logging';
import authService from '../components/api-authorization/AuthorizeService';
import ApiErrorResponse from '../models/ApiErrorResponse';
import IAction from '../store/IAction';
import * as SystemNotifications from '../store/SystemNotifications';

export interface IApiErrorHandler {
    handleError(errorResponse: Response, dispatch: Dispatch<IAction>): void;
}

const logger = new Logger('API Error Handler');

class ApiErrorHandler implements IApiErrorHandler {
    async handleError(errorResponse: Response, dispatch: Dispatch<IAction>) {
        logger.debug('error response:', errorResponse);
        const showAlert = bindActionCreators(SystemNotifications.actionCreators.showAlert, dispatch);
        const httpStatus = !isEmpty(errorResponse.statusText) ? `${errorResponse.status} ${errorResponse.statusText}` : `HTTP ${errorResponse.status}`;

        if (errorResponse.status === 401) {// 401 Unauthorized ... likely access token has expired
            logger.debug('Received 401 Unauthorized from the API.  Signing out...');
            await authService.signOut();
        } else {
            logger.debug('Hello World from additional error handling...');
            switch (errorResponse.status) {
                case 403: // Forbidden - Likely a Permissions issue
                    showAlert('warning', 'You do not have permission for this operation', false);
                    break;

                case 400: // 400 Bad Request
                case 409: // 409 Conflict
                    {
                        const structuredApiErrorResponse = await (errorResponse.json() as Promise<ApiErrorResponse>);

                        if (!isNil(structuredApiErrorResponse)) {
                            showAlert('warning', `${structuredApiErrorResponse.message} (${httpStatus})`, false);
                        }

                        break;
                    }

                default:
                    showAlert('danger', `Received an error from the API.  ${httpStatus}`, false);

            }
        }
    }
}

const apiErrorHandler = new ApiErrorHandler();

export default apiErrorHandler;