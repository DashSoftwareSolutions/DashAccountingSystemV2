import { Dispatch } from "redux";
import IAction from "../../../app/store/action.interface";

/**
 * Interface for a Redux based API Error Handler
 */
export default interface IApiErrorHandler {
    handleError(
        errorResponse: Response,
        dispatch: Dispatch<IAction>,
        redirectToLoginOn401?: boolean,
    ): void;
}
