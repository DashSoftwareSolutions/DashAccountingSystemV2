import { Dispatch } from "redux";
import IAction from "../../../app/store/iaction.interface";

/**
 * Interface for a Redux based API Error Handler
 */
export default interface IApiErrorHandler {
    handleError(errorResponse: Response, dispatch: Dispatch<IAction>): void;
}
