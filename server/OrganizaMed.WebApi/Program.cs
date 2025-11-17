using OrganizaMed.WebApi.Config;
using Serilog;

namespace OrganizaMed.WebApi;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // Logging [env NEWRELIC_LICENSE_KEY]
        builder.Services.ConfigureSerilog(builder.Logging, builder.Configuration);

        // Database Provider [env SQL_CONNECTION_STRING]
        builder.Services.ConfigureDbContext(builder.Configuration, builder.Environment);

        // Validation
        builder.Services.ConfigureFluentValidation();

        // Services
        builder.Services.ConfigureRepositories();
        builder.Services.ConfigureMediatR();

        // Auth [env JWT_GENERATION_KEY, JWT_AUDIENCE_DOMAIN]
        builder.Services.ConfigureIdentityProviders();
        builder.Services.ConfigureJwtAuthentication(builder.Configuration);

        // Controllers
        builder.Services.ConfigureControllersWithFilters();

        // API Documentation 
        builder.Services.ConfigureOpenApiAuthHeaders();

        // CORS [env CORS_ALLOWED_ORIGINS]
        builder.Services.ConfigureCorsPolicy(builder.Environment, builder.Configuration);

        var app = builder.Build();

        app.UseGlobalExceptionHandler();

        app.AutoMigrateDatabase();

        app.UseSwagger();

        app.UseSwaggerUI();

        app.UseHttpsRedirection();

        app.UseCors();

        app.UseAuthentication();

        app.UseAuthorization();

        app.MapControllers();

        try
        {
            app.Run();
        }
        catch (Exception ex)
        {
            Log.Fatal("Ocorreu um erro fatal durante a execu��o da aplicação: {@Excecao}", ex);
        }
    }
}
