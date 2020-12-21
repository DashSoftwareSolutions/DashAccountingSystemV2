using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DashAccountingSystemV2.BusinessLogic;

namespace DashAccountingSystemV2.Extensions
{
    public static class BusinessLogicExtensions
    {
        public static BusinessLogicResponse<TEntity> ErrorResponse<TEntity>(
            this IBusinessLogic bizLogic,
            ErrorType errorType,
            TEntity data = default(TEntity))
        {
            return new BusinessLogicResponse<TEntity>(data, errorType);
        }

        public static BusinessLogicResponse<TEntity> ErrorResponse<TEntity>(
            this IBusinessLogic bizLogic,
            ErrorType errorType,
            Exception exception,
            TEntity data = default(TEntity))
        {
            return new BusinessLogicResponse<TEntity>(data, errorType, exception);
        }

        public static BusinessLogicResponse<TEntity> ErrorResponse<TEntity>(
            this IBusinessLogic bizLogic,
            ErrorType errorType,
            string errorMessage,
            TEntity data = default(TEntity))
        {
            return new BusinessLogicResponse<TEntity>(data, errorType, errorMessage);
        }

        public static BusinessLogicResponse<TEntity> ErrorResponse<TEntity>(
            this IBusinessLogic bizLogic,
            ErrorType errorType,
            IEnumerable<string> errorMessages,
            TEntity data = default(TEntity))
        {
            return new BusinessLogicResponse<TEntity>(data, errorType, errorMessages);
        }
    }
}
