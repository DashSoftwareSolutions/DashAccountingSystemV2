using Projects;

var builder = DistributedApplication.CreateBuilder(args);

var backEnd = builder
    .AddProject<DashAccountingSystemV2_BackEnd>("BackEnd")
    .WithExternalHttpEndpoints();

builder
    .AddNpmApp("FrontEnd", "../../FrontEnd")
    .WithReference(backEnd)
    .WithEnvironment("BROWSER", "none") // Disable opening browser on npm start
    .WithHttpsEndpoint(env: "PORT")
    .WithExternalHttpEndpoints()
    .PublishAsDockerFile();

builder.Build().Run();
