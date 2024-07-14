import { Dispatch } from 'redux';
import { KnownAction } from './export.actions';
import { apiErrorHandler } from '../../common/utilities/errorHandling';
import { AppThunkAction } from '../globalReduxStore';
import IAction from '../globalReduxStore/action.interface';
import ActionType from '../globalReduxStore/actionType';

const actionCreators = {
    reportError: (apiResponse: Response): AppThunkAction<KnownAction> => (dispatch) => {
        apiErrorHandler.handleError(apiResponse, dispatch as Dispatch<IAction>);
        dispatch({ type: ActionType.RECEIVE_EXPORT_DOWNLOAD_ERROR, error: 'Error downloading requested data export' });
    },

    reset: (): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: ActionType.RESET_EXPORT_STORE });
    },
};

export default actionCreators;
