using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using IdentityServer4.EntityFramework.Options;
using Npgsql;
using DashAccountingSystemV2.Data;

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

            var operationalStoreOptions = new OperationalStoreOptions();
            var wrappedOperationalStoreOptions = new OptionsWrapper<OperationalStoreOptions>(operationalStoreOptions);

            ApplicationDbContext appDbContext = new ApplicationDbContext(dbOptions, wrappedOperationalStoreOptions);
            
            await appDbContext.Database.EnsureCreatedAsync();
            await appDbContext.Database.MigrateAsync();
            
            return appDbContext;
        }

        private static void RunFunc(Func<Task> func)
        {
            var t = Task.Run(func);

            while (!t.IsCompleted)
            {
                Thread.Sleep(100);
            }

            if (t.IsFaulted)
            {
                throw t.Exception;
            }
        }

        internal static void RunTestAsync(Action initialize, Action cleanup, Func<Task> testAction)
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
                            initialize();

                            RunFunc(testAction);
                        }
                        finally
                        {
                            cleanup();
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
    }
}
