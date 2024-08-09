using DashAccountingSystemV2.BackEnd.Extensions;

namespace DashAccountingSystemV2.BackEnd.BusinessLogic
{
    public class BusinessLogicResponse
    {
        public bool IsSuccessful => ErrorType == ErrorType.None && Exception == null;

        public ErrorType ErrorType { get; set; } = ErrorType.None;

        public Exception? Exception { get; set; }

        public string? ErrorMessage => ErrorMessages?.FirstOrDefault() ?? Exception?.Message;

        private List<string>? _errorMessages;
        public IReadOnlyCollection<string>? ErrorMessages => _errorMessages?.AsReadOnly();

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
            _errorMessages = [errorMessage];
        }

        public BusinessLogicResponse(ErrorType errorType, IEnumerable<string>? errorMessages)
        {
            ErrorType = errorType;

#pragma warning disable CS8604 // Possible null reference argument.  `HasAny()` checks for `null`.
            if (errorMessages.HasAny())
            {
                _errorMessages = [.. errorMessages];
            }
#pragma warning restore CS8604 // Possible null reference argument.
        }
    }

    public class BusinessLogicResponse<TEntity> : BusinessLogicResponse
    {
        public TEntity? Data { get; set; }

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
