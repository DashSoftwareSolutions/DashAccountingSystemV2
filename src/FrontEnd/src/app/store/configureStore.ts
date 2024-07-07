import {
    applyMiddleware,
    combineReducers,
    compose,
    createStore,
} from 'redux';
import thunk from 'redux-thunk';
import { ApplicationState, reducers } from './';
import ActionType from './actionType';
import IAction from './action.interface';

// Transform actions-type to a string if the action type is a
// number and there's we defined an actiontype for that.
// Else, use the unsanitized action as normal. The reason
// for the checks is to escape dispatched actions from
// packages like react-router or redux-form.
const actionTypeEnumToString = (action: IAction): any => (typeof action.type === 'number' || typeof action.type === 'string') && ActionType[action.type] ? ({
    ...action,
    type: ActionType[action.type],
}) : action;

export default function configureStore(initialState?: ApplicationState) {
    const middleware = [thunk];

    const rootReducer = combineReducers({
        ...reducers,
    });

    const enhancers = [];
    const windowIfDefined = typeof window === 'undefined' ? null : window as any;

    if (windowIfDefined && windowIfDefined.__REDUX_DEVTOOLS_EXTENSION__) {
        enhancers.push(windowIfDefined.__REDUX_DEVTOOLS_EXTENSION__({ actionSantizier: actionTypeEnumToString }));
    }

    return createStore(
        rootReducer,
        initialState,
        compose(applyMiddleware(...middleware), ...enhancers)
    );
}
