namespace DashAccountingSystemV2.Services.Time
{
    /// <summary>
    /// Used to overload getting current time for testing purposes
    /// </summary>
    public interface ITimeProvider
    {
        DateTime Now { get; }

        DateTime UtcNow { get; }
    }
}
