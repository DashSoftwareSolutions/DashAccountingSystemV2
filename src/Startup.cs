using System;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
// using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Hosting;
using Npgsql;
using Serilog;
using DashAccountingSystemV2.BusinessLogic;
using DashAccountingSystemV2.Data;
using DashAccountingSystemV2.Extensions;
using DashAccountingSystemV2.Models;
using DashAccountingSystemV2.Repositories;
using DashAccountingSystemV2.Security.Authentication;
using DashAccountingSystemV2.Security.Authorization;
using DashAccountingSystemV2.Security.ExportDownloads;
using DashAccountingSystemV2.Services.Caching;
using DashAccountingSystemV2.Services.Export;
using DashAccountingSystemV2.Services.Template;
using DashAccountingSystemV2.Services.Time;
using static DashAccountingSystemV2.Security.Constants;

namespace DashAccountingSystemV2
{
    public class Startup
    {
        //private readonly ILogger _logger;
        private string _connectionString = null;

        public Startup(IConfiguration configuration/*, ILogger<Startup> logger*/)
        {
            Configuration = configuration;
            //_logger = logger;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // Logging
            services.AddLogging();

            // TEMP - Direct Serilog Logger
            Log.Logger = new LoggerConfiguration()
               .MinimumLevel.Debug()
               .WriteTo.Console()
               .CreateLogger();

            // Build Connection String by including DbPassword from User Secrets
            var builder = new NpgsqlConnectionStringBuilder(
                Configuration.GetConnectionString("DefaultConnection"));
            builder.Password = Configuration["DbPassword"];
            _connectionString = builder.ConnectionString;

            if (string.IsNullOrEmpty(_connectionString))
            {
                //_logger.LogCritical("Cannot start application server without connection string.");
                Log.Logger.Error("Cannot start application server without connection string.");
                throw new Exception("No connection string.");
            }

            //_logger.LogInformation("Using connection string: '{0}'", _connectionString.MaskPassword());
            Log.Logger.Information("Using connection string: '{0}'", _connectionString.MaskPassword());

            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseNpgsql(
                    _connectionString,
                    options => options.SetPostgresVersion(new Version(9, 6))
                ));

            services.AddDatabaseDeveloperPageExceptionFilter();

            services
                .AddDefaultIdentity<ApplicationUser>(options => options.SignIn.RequireConfirmedAccount = true)
                .AddRoles<ApplicationRole>()
                .AddRoleManager<ApplicationRoleManager>()
                .AddUserManager<ApplicationUserManager>()
                .AddEntityFrameworkStores<ApplicationDbContext>()
                .AddDefaultTokenProviders();

            services.AddScoped<IUserClaimsPrincipalFactory<ApplicationUser>, ApplicationClaimsPrincipalFactory>();

            services.AddCaching();
            services.AddTimeProvider();
            services.AddRepositories();
            services.AddBusinessLogic();

            services.AddTemplateService();
            services.AddExportDownloadSecurityTokenService();
            services.AddExportService();

            services.AddIdentityServer()
                .AddApiAuthorization<ApplicationUser, ApplicationDbContext>();

            services.AddAuthentication()
                .AddIdentityServerJwt()
                .AddExportDownloadToken();

            // Add Authorization Policy for Export Download Token authentication
            services.AddAuthorization(options =>
            {
                options.AddPolicy(ExportDownloadAuthorizationPolicy, policy =>
                {
                    policy.AuthenticationSchemes.Add(ExportDownloadAuthenticationScheme);
                    policy.RequireAuthenticatedUser();
                });
            });

            services
                .AddControllersWithViews()
                .AddNewtonsoftJson();

            services.AddRazorPages();

            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/build";
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseMigrationsEndPoint();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();

            app.UseRouting();

            app.UseAuthentication();
            app.UseIdentityServer();
            app.UseAuthorization();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller}/{action=Index}/{id?}");
                endpoints.MapRazorPages();
            });

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseReactDevelopmentServer(npmScript: "start");
                }
            });
        }
    }
}
