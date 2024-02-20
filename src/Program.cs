using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Npgsql;
using Serilog;
using DashAccountingSystemV2.Data;
using DashAccountingSystemV2.Extensions;
using DashAccountingSystemV2.Models;
using DashAccountingSystemV2.Security.Authentication;
using DashAccountingSystemV2.Security.Authorization;

Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .CreateBootstrapLogger();

try
{
    var builder = WebApplication.CreateBuilder(args);

    // Add services to the container.
    // MVC
    builder.Services.AddControllers();
    builder.Services.AddControllersWithViews();

    // TODO: SPA (Single Page Application) - Front-End

    // Build Connection String by including DbPassword from User Secrets
    var connectionStringBuilder = new NpgsqlConnectionStringBuilder(
        builder.Configuration.GetConnectionString("DefaultConnection"));

    connectionStringBuilder.Password = builder.Configuration["NewDbPassword"];

    var connectionString = connectionStringBuilder.ConnectionString;

    if (string.IsNullOrEmpty(connectionString))
    {
        Log.Logger.Error("Cannot start application server without connection string.");
        throw new Exception("No connection string.");
    }

    Log.Logger.Information("Using connection string: '{0}'", connectionString.MaskPassword());

    // Database Context (Entity Framework via Npgsql)
    builder.Services.AddDbContext<ApplicationDbContext>(options =>
    {
        options.UseNpgsql(connectionString);
    });

    // Authorization/Identity services
    builder.Services.AddAuthorization();

    builder.Services
        .AddDefaultIdentity<ApplicationUser>(options => options.SignIn.RequireConfirmedAccount = true)
        .AddRoles<ApplicationRole>()
        .AddRoleManager<ApplicationRoleManager>()
        .AddUserManager<ApplicationUserManager>()
        .AddEntityFrameworkStores<ApplicationDbContext>();

    builder.Services.AddScoped<IUserClaimsPrincipalFactory<ApplicationUser>, ApplicationClaimsPrincipalFactory>();

    // TODO: Other application services (repositories, business logic, services, etc.)

    var app = builder.Build();

    // Configure the HTTP request pipeline.
    if (!app.Environment.IsDevelopment())
    {
        app.UseExceptionHandler("/Home/Error");
        // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
        app.UseHsts();
    }

    app.UseHttpsRedirection();
    app.UseStaticFiles();

    app.UseRouting();
    app.UseAuthentication();
    app.UseAuthorization();

    app.MapControllerRoute(
        name: "default",
        pattern: "{controller=Home}/{action=Index}/{id?}");

    app.MapRazorPages();

    // TODO: SPA (Single Page Application) - Front-End

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