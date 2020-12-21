using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using DashAccountingSystemV2.Extensions;

namespace DashAccountingSystemV2.BusinessLogic
{
    public class BusinessLogicResponse
    {
        public bool IsSuccessful
        {
            get { return ErrorType == ErrorType.None && Exception == null; }
        }

        public ErrorType ErrorType { get; set; } = ErrorType.None;

        public Exception Exception { get; set; }

        public string ErrorMessage
        {
            get { return ErrorMessages?.FirstOrDefault() ?? Exception?.Message; }
        }

        private List<string> _errorMessages;
        public IReadOnlyCollection<string> ErrorMessages
        {
            get { return _errorMessages?.AsReadOnly(); }
        }

        public BusinessLogicResponse() { }

        public BusinessLogicResponse(ErrorType errorType)
        {
            ErrorType = errorType;
        }

        public BusinessLogicResponse(ErrorType errorType, Exception exception)
        {
            ErrorType = errorType;
            Exception = exception;
        }

        public BusinessLogicResponse(ErrorType errorType, string errorMessage)
        {
            ErrorType = errorType;
            _errorMessages = new List<string>() { errorMessage };
        }

        public BusinessLogicResponse(ErrorType errorType, IEnumerable<string> errorMessages)
        {
            ErrorType = errorType;
            if (errorMessages.HasAny())
            {
                _errorMessages = new List<string>();
                _errorMessages.AddRange(errorMessages);
            }
        }

        public static ErrorType MapHttpStatusCode(HttpStatusCode statusCode)
        {
            ErrorType errorType = ErrorType.None;
            switch (statusCode)
            {
                case HttpStatusCode.Conflict:
                    errorType = ErrorType.Conflict;
                    break;
                case HttpStatusCode.NoContent:
                    errorType = ErrorType.NoContent;
                    break;
                case HttpStatusCode.NotFound:
                    errorType = ErrorType.RequestedEntityNotFound;
                    break;
                case HttpStatusCode.Unauthorized:
                case HttpStatusCode.Forbidden:
                    errorType = ErrorType.UserNotAuthorized;
                    break;
                case HttpStatusCode.BadRequest:
                    errorType = ErrorType.RequestNotValid;
                    break;
                default:
                    errorType = ErrorType.RuntimeException;
                    break;
            }

            return errorType;
        }
    }

    public class BusinessLogicResponse<TEntity> : BusinessLogicResponse
    {
        public TEntity Data { get; set; }

        public BusinessLogicResponse() : base() { }

        public BusinessLogicResponse(BusinessLogicResponse src)
            : base(src.ErrorType, src.ErrorMessages)
        {
            Exception = src.Exception;
        }

        public BusinessLogicResponse(TEntity data) : base()
        {
            Data = data;
        }

        public BusinessLogicResponse(TEntity data, ErrorType errorType)
            : base(errorType)
        {
            Data = data;
        }

        public BusinessLogicResponse(TEntity data, ErrorType errorType, Exception exception)
            : base(errorType, exception)
        {
            Data = data;
        }

        public BusinessLogicResponse(TEntity data, ErrorType errorType, string errorMessage)
            : base(errorType, errorMessage)
        {
            Data = data;
        }

        public BusinessLogicResponse(TEntity data, ErrorType errorType, IEnumerable<string> errorMessages)
            : base(errorType, errorMessages)
        {
            Data = data;
        }

        public BusinessLogicResponse(ErrorType errorType) : base(errorType)
        {
        }

        public BusinessLogicResponse(ErrorType errorType, Exception exception) : base(errorType, exception)
        {
        }

        public BusinessLogicResponse(ErrorType errorType, string errorMessage) : base(errorType, errorMessage)
        {
        }

        public BusinessLogicResponse(ErrorType errorType, IEnumerable<string> errorMessages) : base(errorType, errorMessages)
        {
        }
    }
}
