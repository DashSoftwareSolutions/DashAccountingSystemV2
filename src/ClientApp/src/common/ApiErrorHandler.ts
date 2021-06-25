import { Logger } from './Logging';
import authService from '../components/api-authorization/AuthorizeService';

export interface IApiErrorHandler {
    handleError(errorResponse: Response): void;
}

const logger = new Logger('API Error Handler');

class ApiErrorHandler implements IApiErrorHandler {
    async handleError(errorResponse: Response) {
        logger.info('error response:', errorResponse);

        if (errorResponse.status === 401) {// 401 Unauthorized ... likely access token has expired
            logger.debug('Received 401 Unauthorized from the API.  Signing out...');
            await authService.signOut();
        }
    }
}

const apiErrorHandler = new ApiErrorHandler();

export default apiErrorHandler;