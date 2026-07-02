using Projects;

var builder = DistributedApplication.CreateBuilder(args);

// Both resources run "proxyless" (IsProxied = false) so each service binds directly to a
// stable port and terminates TLS itself with the trusted local.dashaccounting.io cert:
//   - BackEnd (Kestrel):  https://local.dashaccounting.io:6002  (cert via appsettings.Development.json Kestrel:Certificates:Default)
//   - FrontEnd (CRA):     https://local.dashaccounting.io:6001  (cert + host via FrontEnd/.env.local)
// Aspire's own reverse proxy is localhost-only and would otherwise front these on random ports.

var backEnd = builder
    .AddProject<DashAccountingSystemV2_BackEnd>("BackEnd")
    // The "https" endpoint is generated from the project's launchSettings applicationUrl (port 6002).
    .WithEndpoint("https", endpoint => endpoint.IsProxied = false)
    .WithExternalHttpEndpoints();

builder
    .AddNpmApp("FrontEnd", "../../FrontEnd")
    .WithReference(backEnd)
    .WithEnvironment("BROWSER", "none") // Disable opening browser on npm start
    // Pin the port explicitly and inject it as PORT so CRA listens on 6001 (proxyless).
    .WithHttpsEndpoint(port: 6001, targetPort: 6001, env: "PORT", isProxied: false)
    .WithExternalHttpEndpoints()
    .PublishAsDockerFile();

builder.Build().Run();
