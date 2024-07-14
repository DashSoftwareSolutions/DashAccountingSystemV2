using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Npgsql;
using Serilog;
using DashAccountingSystemV2.BackEnd.BusinessLogic;
using DashAccountingSystemV2.BackEnd.Data;
using DashAccountingSystemV2.BackEnd.Extensions;
using DashAccountingSystemV2.BackEnd.Models;
using DashAccountingSystemV2.BackEnd.Repositories;
using DashAccountingSystemV2.BackEnd.Security.Authentication;
using DashAccountingSystemV2.BackEnd.Security.Authorization;
using DashAccountingSystemV2.BackEnd.Security.ExportDownloads;
using DashAccountingSystemV2.BackEnd.Services.Caching;
using DashAccountingSystemV2.BackEnd.Services.Export;
using static DashAccountingSystemV2.BackEnd.Security.Constants;

try
{
    var builder = WebApplication.CreateBuilder(args);

    // Add services to the container.
    // Web API and Swagger
    builder.Services.AddControllers();
    // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen();

    // Database
    var connectionStringBuilder = new NpgsqlConnectionStringBuilder(
        builder.Configuration.GetConnectionString("DefaultConnection"))
    {
        Password = builder.Configuration["NewDbPassword"]
    };

    var connectionString = connectionStringBuilder.ConnectionString;

    if (string.IsNullOrEmpty(connectionString))
    {
        Log.Logger.Error("Cannot start application server without connection string.");
        throw new InvalidOperationException("No connection string.");
    }

    Log.Logger.Information("Using connection string: '{0}'", connectionString.MaskPassword());

    // Database Context (Entity Framework via Npgsql)
    builder.Services.AddDbContext<ApplicationDbContext>(options =>
    {
        options.UseNpgsql(connectionString);
    });

    // Authorization/Identity services
    builder.Services
        .AddAuthorizationBuilder()
        .AddPolicy(ExportDownloadAuthorizationPolicy, policy =>
        {
            policy.AuthenticationSchemes.Add(ExportDownloadAuthenticationScheme);
            policy.RequireAuthenticatedUser();
        });

    // Add Authentication
    // Adds a "composite" handler that tries both bearer token and export download token
    // Based on:
    // https://github.com/dotnet/aspnetcore/blob/v8.0.7/src/Identity/Core/src/IdentityServiceCollectionExtensions.cs#L134-L152
    // https://github.com/dotnet/aspnetcore/blob/v8.0.7/src/Identity/Core/src/IdentityServiceCollectionExtensions.cs#L187-L213
    builder.Services
        .AddAuthentication(ApplicationAuthenticationScheme)
        .AddScheme<AuthenticationSchemeOptions, ApplicationAuthenticationHandler>(ApplicationAuthenticationScheme, null, compositeOptions =>
        {
            compositeOptions.ForwardDefault = IdentityConstants.BearerScheme;
            compositeOptions.ForwardAuthenticate = ApplicationAuthenticationScheme;
        })
        .AddBearerToken(IdentityConstants.BearerScheme)
        .AddExportDownloadToken();

    // Register ASP.NET Identity, including the needed infrastructure for the Identity API endpoints
    // See: https://learn.microsoft.com/en-us/aspnet/core/security/authentication/identity-api-authorization?view=aspnetcore-8.0#activate-identity-apis
    builder.Services
        .AddIdentityCore<ApplicationUser>()
        .AddRoles<ApplicationRole>()
        .AddRoleManager<ApplicationRoleManager>()
        .AddUserManager<ApplicationUserManager>()
        .AddEntityFrameworkStores<ApplicationDbContext>();

    builder.Services.AddHttpContextAccessor();
    builder.Services.AddScoped<SignInManager<ApplicationUser>>();
    builder.Services.AddScoped<IUserClaimsPrincipalFactory<ApplicationUser>, ApplicationClaimsPrincipalFactory>();

    // Other application services (repositories, business logic, services, etc.)
    builder.Services.AddCaching();
    builder.Services.AddRepositories();
    builder.Services.AddBusinessLogic();
    builder.Services.AddExportDownloadSecurityTokenService();
    builder.Services.AddExportService();

    // Logging
    builder.Host.UseSerilog((context, services, configuration) => configuration
        .ReadFrom.Configuration(context.Configuration)
        .ReadFrom.Services(services)
        .Enrich.FromLogContext()
        .WriteTo.Console());

    var app = builder.Build();

    // Configure the HTTP request pipeline.
    if (app.Environment.IsDevelopment())
    {
        app.UseSwagger();
        app.UseSwaggerUI();
    }

    app.UseHttpsRedirection();
    app.UseAuthorization();
    app.MapControllers();

    // Global exception handler
    app.UseExceptionHandler("/api/error");

    app.Run();
}
catch (HostAbortedException)
{
    Log.Information("Host is shutting down.");
}
catch (Exception ex)
{
    Log.Fatal(ex, "Application terminated unexpectedly.");
}
finally
{
    Log.CloseAndFlush();
}
