using Microsoft.AspNetCore.Http.Headers;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Net.Http.Headers;
using Npgsql;
using Serilog;
using DashAccountingSystemV2.BusinessLogic;
using DashAccountingSystemV2.Data;
using DashAccountingSystemV2.Extensions;
using DashAccountingSystemV2.Models;
using DashAccountingSystemV2.Repositories;
using DashAccountingSystemV2.Security.Authentication;
using DashAccountingSystemV2.Security.Authorization;
using DashAccountingSystemV2.Services.Time;

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

    // SPA (Single Page Application) - Front-End
    builder.Services.AddSpaStaticFiles(configuration =>
    {
        configuration.RootPath = "ClientApp/dist";
    });

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
    builder.Services.AddTimeProvider();
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

    // ASP.NET MVC
    app.MapControllerRoute(
        name: "default",
        pattern: "{controller=Home}/{action=Index}/{id?}");

    app.MapRazorPages();

    // SPA (Single Page Application) - Front-End
    var spaPath = "/app";

    if (app.Environment.IsDevelopment())
    {
        app.MapWhen(y => y.Request.Path.StartsWithSegments(spaPath), client =>
        {
            client.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";
                spa.Options.DevServerPort = 6363;
                spa.UseReactDevelopmentServer(npmScript: "start");
            });
        });
    }
    else
    {
        app.Map(new PathString(spaPath), client =>
        {
            client.UseSpaStaticFiles();
            client.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";

                // adds no-store header to index page to prevent deployment issues (prevent linking to old .js files)
                // .js and other static resources are still cached by the browser
                spa.Options.DefaultPageStaticFileOptions = new StaticFileOptions
                {
                    OnPrepareResponse = ctx =>
                    {
                        ResponseHeaders headers = ctx.Context.Response.GetTypedHeaders();
                        headers.CacheControl = new CacheControlHeaderValue
                        {
                            NoCache = true,
                            NoStore = true,
                            MustRevalidate = true
                        };
                    }
                };
            });
        });
    }

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