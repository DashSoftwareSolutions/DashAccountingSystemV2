using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Console;
using Microsoft.Extensions.Options;
using Moq;
using Npgsql;
using DashAccountingSystemV2.BackEnd.Data;
using DashAccountingSystemV2.Tests.Repositories;

namespace DashAccountingSystemV2.Tests
{
    public static class TestUtilities
    {
        internal static object DatabaseSyncLock = new object();

        private static Lazy<IConfiguration> _configuration = new Lazy<IConfiguration>(LoadConfiguration);
        private static Lazy<string> _connectionString = new Lazy<string>(InitializeConnectionString);

        private static IConfiguration LoadConfiguration()
        {
            return new ConfigurationBuilder()
                .AddJsonFile("appsettings.UnitTests.json", optional: false)
                .AddUserSecrets<SharedLookupRepositoryFixture>() // any non-static class in this project will do
                .Build();
        }

        private static string InitializeConnectionString()
        {
            var connectionStringBuilder = new NpgsqlConnectionStringBuilder(
                _configuration.Value.GetConnectionString("DefaultConnection"));

            connectionStringBuilder.Password = _configuration.Value["DbPassword"];

            return connectionStringBuilder.ConnectionString;
        }

        internal static IConfiguration GetConfiguration()
        {
            return _configuration.Value;
        }

        internal static string GetConnectionString()
        {
            return _connectionString.Value;
        }

        internal static async Task<ApplicationDbContext> GetDatabaseContextAsync()
        {
            var connectionString = GetConnectionString();

            var dbCtxOptionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();
            dbCtxOptionsBuilder.UseNpgsql(connectionString);

            var dbOptions = dbCtxOptionsBuilder.Options;

            ApplicationDbContext appDbContext = new ApplicationDbContext(dbOptions);
            
            await appDbContext.Database.EnsureCreatedAsync();
            await appDbContext.Database.MigrateAsync();
            
            return appDbContext;
        }

        internal static ILoggerFactory GetLoggerFactory()
        {
            var options = new ConsoleLoggerOptions();

            var mockOptionsMonitor = new Mock<IOptionsMonitor<ConsoleLoggerOptions>>();
            mockOptionsMonitor
                .SetupGet(mom => mom.CurrentValue)
                .Returns(options);

            var providers = new List<ILoggerProvider>()
            {
                new ConsoleLoggerProvider(mockOptionsMonitor.Object)
            };

            var loggerFactory = new LoggerFactory(providers);
            return loggerFactory;
        }

        #region Async Test Run Support
        /// <summary>
        /// Runs unit tests asynchronously without using the database sync lock
        /// </summary>
        /// <remarks>
        /// Should be used for tests where all Repositories are mocked and there is no live database access.
        /// </remarks>
        /// <param name="initialize">Test initialization</param>
        /// <param name="cleanup">Test cleanup.  Should remove database records added during the test and reset identity sequences.</param>
        /// <param name="testAction">Test method</param>
        internal static async Task RunCommonTestAsync(Func<Task> initialize, Func<Task> cleanup, Func<Task> testAction)
        {
            try
            {
                await initialize();
                await testAction();
            }
            finally
            {
                if (cleanup != null)
                    await cleanup();
            }
        }

        /// <summary>
        /// Runs unit tests asynchronously without using the database sync lock.  Defaults test initialization and cleanup actions to no-ops.
        /// </summary>
        /// <remarks>
        /// Should be used for tests where all Repositories are mocked and there is no live database access.
        /// </remarks>
        /// <param name="testAction">Test method</param>
        /// <returns></returns>
        internal static Task RunCommonTestAsync(Func<Task> testAction)
        {
            return RunCommonTestAsync(() => Task.CompletedTask, () => Task.CompletedTask, testAction);
        }

        private static void RunFunc(Func<Task> func)
        {
            var task = Task.Run(func);

            while (!task.IsCompleted)
            {
                Thread.Sleep(100);
            }

            if (task.IsFaulted)
                throw task.Exception;
        }

        /// <summary>
        /// Runs unit tests asynchronously using the database sync lock
        /// </summary>
        /// <param name="initialize">Test initialization</param>
        /// <param name="cleanup">Test cleanup</param>
        /// <param name="testAction">Test method</param>
        internal static void RunTestAsync(Func<Task> initialize, Func<Task> cleanup, Func<Task> testAction)
        {
            // Workaround for async test methods
            // Using lock(RepositoryTestUtils.DatabaseSyncLock) can freeze running unit tests in MSVS environment
            // even if parallel execution is not selected in unit test options.
            while (true)
            {
                bool lockTaken = false;

                try
                {
                    Monitor.TryEnter(DatabaseSyncLock, 10, ref lockTaken);

                    if (lockTaken)
                    {
                        try
                        {
                            if (initialize != null)
                                RunFunc(initialize);

                            RunFunc(testAction);
                        }
                        finally
                        {
                            if (cleanup != null)
                                RunFunc(cleanup);
                        }

                        break;
                    }
                    else
                    {
                        Thread.Sleep(500);
                    }
                }
                finally
                {
                    if (lockTaken)
                    {
                        Monitor.Exit(DatabaseSyncLock);
                    }
                }
            }
        }

        /// <summary>
        /// Runs unit tests asynchronously using the database sync lock.  Defaults test initialization and cleanup actions to no-ops.
        /// </summary>
        /// <param name="testAction">Test method</param>
        internal static void RunTestAsync(Func<Task> testAction)
        {
            RunTestAsync(() => Task.CompletedTask, () => Task.CompletedTask, testAction);
        }
        #endregion Async Test Run Support
    }
}
