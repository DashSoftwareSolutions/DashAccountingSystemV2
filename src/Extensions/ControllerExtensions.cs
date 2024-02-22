using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Net.Http.Headers;
using DashAccountingSystemV2.BusinessLogic;

namespace DashAccountingSystemV2.Extensions
{
    public static class ControllerExtensions
    {
        public static void AppendContentDispositionResponseHeader(this ControllerBase controller, string fileName)
        {
            var contentDispositionHeader = new ContentDispositionHeaderValue("attachment");
            contentDispositionHeader.SetHttpFileName(fileName);
            controller.Response.Headers.Append(HeaderNames.ContentDisposition, contentDispositionHeader.ToString());
        }

        public static IActionResult ErrorResponse(this ControllerBase controller, string errorMessage, int status = StatusCodes.Status400BadRequest)
        {
            return controller.Problem(
                errorMessage,
                controller.HttpContext.Request.GetEncodedPathAndQuery(),
                status,
                "Error", // TODO: Have a way to customize this 
                $"https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/{status}");
        }

        public static IActionResult ErrorResponse(this ControllerBase controller, BusinessLogicResponse bizLogicResponse)
        {
            var errorMessage = bizLogicResponse.ErrorMessage ?? "An unexpected error occurred while attempting to serve the request.";
            var httpStatus = MapBusinessLogicErrorTypeToHttpStatus(bizLogicResponse.ErrorType);

            return ErrorResponse(controller, errorMessage, httpStatus);
        }

        #region Business Logic Result Support
        #region Sync
        public static IActionResult Result(this ControllerBase controller, BusinessLogicResponse bizLogicResponse)
        {
            if (bizLogicResponse.IsSuccessful)
                return controller.Ok();

            return controller.ErrorResponse(bizLogicResponse);
        }
        #endregion Sync

        #region Async
        public static async Task<IActionResult> Result(
            this ControllerBase controller,
            Task<BusinessLogicResponse> asyncBizLogicTask)
        {
            var bizLogicResponse = await asyncBizLogicTask;

            if (bizLogicResponse.IsSuccessful)
                return controller.Ok();

            return controller.ErrorResponse(bizLogicResponse);
        }

        public static async Task<IActionResult> Result<TModel>(
            this ControllerBase controller,
            Task<BusinessLogicResponse<TModel>> asyncBizLogicTask)
        {
            var bizLogicResponse = await asyncBizLogicTask;

            if (bizLogicResponse.IsSuccessful)
                return controller.Ok(bizLogicResponse.Data);

            return controller.ErrorResponse(bizLogicResponse);
        }

        public static async Task<IActionResult> Result<TModel>(
           this ControllerBase controller,
           Task<BusinessLogicResponse<TModel>> asyncBizLogicTask,
           Func<TModel, object> convertModelToViewModel)
        {
            var bizLogicResponse = await asyncBizLogicTask;

            if (bizLogicResponse.IsSuccessful)
            {
                if (bizLogicResponse.Data == null)
                    return controller.Ok();

                return controller.Ok(convertModelToViewModel(bizLogicResponse.Data));
            }

            return controller.ErrorResponse(bizLogicResponse);
        }

        public static async Task<IActionResult> Result<TModel>(
            this ControllerBase controller,
            Task<BusinessLogicResponse<IEnumerable<TModel>>> asyncBizLogicTask,
            Func<TModel, object> convertModelToViewModel)
        {
            var bizLogicResponse = await asyncBizLogicTask;

            if (bizLogicResponse.IsSuccessful)
            {
                if (bizLogicResponse.Data == null)
                    return controller.Ok();

                return controller.Ok(bizLogicResponse.Data.Select(convertModelToViewModel));
            }

            return controller.ErrorResponse(bizLogicResponse);
        }
        #endregion Async

        private static int MapBusinessLogicErrorTypeToHttpStatus(ErrorType errorType)
        {
            switch (errorType)
            {
                case ErrorType.Conflict:
                    return StatusCodes.Status409Conflict;

                case ErrorType.RequestedEntityNotFound:
                    return StatusCodes.Status404NotFound;

                case ErrorType.RequestNotValid:
                    return StatusCodes.Status400BadRequest;

                case ErrorType.UserNotAuthorized:
                    return StatusCodes.Status403Forbidden;

                case ErrorType.RuntimeException:
                default:
                    return StatusCodes.Status500InternalServerError;
            }
        }
        #endregion Business Logic Result Support
    }
}
