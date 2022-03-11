using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.Net.Http.Headers;
using DashAccountingSystemV2.BusinessLogic;
using DashAccountingSystemV2.ViewModels;

namespace DashAccountingSystemV2.Extensions
{
    public static class ControllerExtensions
    {
        public static void AppendContentDispositionResponseHeader(this Controller controller, string fileName)
        {
            var contentDispositionHeader = new ContentDispositionHeaderValue("attachment");
            contentDispositionHeader.SetHttpFileName(fileName);
            controller.Response.Headers.Add(HeaderNames.ContentDisposition, contentDispositionHeader.ToString());
        }

        /// <summary>
        /// Issues error response with a JSON body that contains an error
        /// message (which should be suitable for client-side display to end-users).
        /// HTTP Response Status defaults to 400 Bad Request, but you can set whichever
        /// status you want by passing an argument to the optional "status" parameter. 
        /// </summary>
        /// <param name="controller"><see cref="Controller"/></param>
        /// <param name="errorMessage">string: Error message to add to response body</param>
        /// <param name="status">HTTP Status.  Defaults to 400 Bad Request.</param>
        /// <returns><see cref="BadRequestObjectResult"/> 400 Bad Request response</returns>
        public static IActionResult ErrorResponse(this Controller controller, string errorMessage, int status = StatusCodes.Status400BadRequest)
        {
            var error = new StandardErrorResponse()
            {
                Message = errorMessage
            };

            return ErrorResponse(controller, error, status);
        }

        /// <summary>
        /// Issues an error response with a JSON body that contains an error
        /// message (which should be suitable for client-side display to end-users).
        /// Constructs the error message from Model State.
        /// HTTP Response Status defaults to 400 Bad Request, but you can set whichever
        /// status you want by passing an argument to the optional "status" parameter.
        /// </summary>
        /// <param name="controller"><see cref="Controller"/></param>
        /// <param name="modelState"><see cref="ModelStateDictionary"/> current Model State</param>
        /// <param name="status">HTTP Status.  Defaults to 400 Bad Request.</param>
        /// <returns><see cref="IActionResult"/> containing the error response</returns>
        public static IActionResult ErrorResponse(this Controller controller, ModelStateDictionary modelState, int status = StatusCodes.Status400BadRequest)
        {
            var error = new StandardErrorResponse()
            {
                Message = modelState.ToErrorMessageString()
            };

            return ErrorResponse(controller, error, status);
        }

        public static IActionResult ErrorResponse(this Controller controller, BusinessLogicResponse bizLogicResponse, object model = null)
        {
            var errorMessage = bizLogicResponse.ErrorMessage;
            var httpStatus = MapBusinessLogicErrorTypeToHttpStatus(bizLogicResponse.ErrorType);

            if (!string.IsNullOrWhiteSpace(errorMessage))
            {
                if (model == null)
                {
                    var msgOnlyBody = new StandardErrorResponse() { Message = bizLogicResponse.ErrorMessage };
                    return ErrorResponse(controller, msgOnlyBody, httpStatus);
                }

                var msgModelBody = new
                {
                    Message = errorMessage,
                    Data = model
                };
                return controller.StatusCode(httpStatus, msgModelBody);
            }

            if (model == null)
                return controller.StatusCode(httpStatus);

            return controller.StatusCode(httpStatus, model);
        }

        public static IActionResult ErrorResponse(this Controller controller, StandardErrorResponse responseBody, int status)
        {
            return controller.StatusCode(status, responseBody);
        }

        #region Business Logic Result Support
        #region Sync
        public static IActionResult Result(this Controller controller, BusinessLogicResponse bizLogicResponse)
        {
            if (bizLogicResponse.IsSuccessful)
                return controller.Ok();

            return controller.ErrorResponse(bizLogicResponse);
        }
        #endregion Sync

        #region Async
        public static async Task<IActionResult> Result(
            this Controller controller,
            Task<BusinessLogicResponse> asyncBizLogicTask)
        {
            var bizLogicResponse = await asyncBizLogicTask;

            if (bizLogicResponse.IsSuccessful)
                return controller.Ok();

            return controller.ErrorResponse(bizLogicResponse);
        }

        public static async Task<IActionResult> Result<TModel>(
            this Controller controller,
            Task<BusinessLogicResponse<TModel>> asyncBizLogicTask)
        {
            var bizLogicResponse = await asyncBizLogicTask;

            if (bizLogicResponse.IsSuccessful)
                return controller.Json(bizLogicResponse.Data);

            return controller.ErrorResponse(bizLogicResponse);
        }

        public static async Task<IActionResult> Result<TModel>(
            this Controller controller,
            Task<BusinessLogicResponse<TModel>> asyncBizLogicTask,
            Func<TModel, object> convert)
        {
            var bizLogicResponse = await asyncBizLogicTask;

            if (bizLogicResponse.IsSuccessful)
                return controller.Json(convert(bizLogicResponse.Data));

            return controller.ErrorResponse(bizLogicResponse);
        }

        public static async Task<IActionResult> Result<TModel>(
            this Controller controller,
            Task<BusinessLogicResponse<IEnumerable<TModel>>> asyncBizLogicTask,
            Func<TModel, object> convert)
        {
            var bizLogicResponse = await asyncBizLogicTask;

            if (bizLogicResponse.IsSuccessful)
                return controller.Json(bizLogicResponse.Data.Select(d => convert(d)));

            return controller.ErrorResponse(bizLogicResponse);
        }
        #endregion Async
        #endregion Business Logic Result Support

        private static int MapBusinessLogicErrorTypeToHttpStatus(ErrorType errorType)
        {
            switch (errorType)
            {
                case ErrorType.None: // Unusual, but we'll handle it
                    return StatusCodes.Status202Accepted; // Slightly different response code so we can identify that we hit this path

                case ErrorType.Conflict:
                    return StatusCodes.Status409Conflict;

                case ErrorType.RequestedEntityNotFound:
                    return StatusCodes.Status404NotFound;

                case ErrorType.RequestNotValid:
                    return StatusCodes.Status400BadRequest;

                case ErrorType.UserNotAuthorized:
                    return StatusCodes.Status403Forbidden;

                case ErrorType.NoContent:
                    return StatusCodes.Status204NoContent;

                case ErrorType.RuntimeException:
                default:
                    return StatusCodes.Status500InternalServerError;
            }
        }
    }
}
