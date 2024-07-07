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
        builder.Configuration.GetConnectionString("DefaultConnection"));

    connectionStringBuilder.Password = builder.Configuration["NewDbPassword"];

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
    builder.Services.AddAuthorization();

    // Register the https://learn.microsoft.com/en-us/aspnet/core/security/authentication/identity-api-authorization?view=aspnetcore-8.0#activate-identity-apis
    builder.Services
        .AddIdentityApiEndpoints<ApplicationUser>()
        .AddRoles<ApplicationRole>()
        .AddRoleManager<ApplicationRoleManager>()
        .AddUserManager<ApplicationUserManager>()
        .AddEntityFrameworkStores<ApplicationDbContext>();

    builder.Services.AddScoped<IUserClaimsPrincipalFactory<ApplicationUser>, ApplicationClaimsPrincipalFactory>();

    // Other application services (repositories, business logic, services, etc.)
    builder.Services.AddRepositories();
    builder.Services.AddBusinessLogic();

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