import { AppThunkAction } from '../globalReduxStore';
import ActionType from '../globalReduxStore/actionType';
import { KnownAction } from './export.actions';

const actionCreators = {
    reset: (): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: ActionType.RESET_EXPORT_STORE });
    },
};

export default actionCreators;
