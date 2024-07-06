namespace DashAccountingSystemV2.BackEnd.Services.Time
{
    public class TimeProvider : ITimeProvider
    {
        public DateTime UtcNow => DateTime.UtcNow;

        public DateTime Now => DateTime.Now;
    }
}
