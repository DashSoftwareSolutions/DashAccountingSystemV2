namespace DashAccountingSystemV2.BusinessLogic
{
    public enum ErrorType
    {
        None = 0,
        RequestNotValid = 1,
        RequestedEntityNotFound = 2,
        UserNotAuthorized = 3,
        Conflict = 4,
        RuntimeException = 5,
        NoContent = 6,
    }
}
