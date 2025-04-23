using TaskManagerApi.Data;

var builder = WebApplication.CreateBuilder(args);

builder.WebHost.UseUrls("http://0.0.0.0:5000");

// Register services
builder.Services.AddControllers();
builder.Services.AddSingleton<DatabaseHelper>();

// Add Swagger services
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAnyOrigin", policy =>
    {
        policy.AllowAnyOrigin()  // ⚠️ Allows requests from any domain
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// Enable Swagger in development
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "Task Manager API v1");
        options.RoutePrefix = string.Empty; // Swagger UI at root
    });
}

//app.UseHttpsRedirection();

app.UseRouting();
app.UseCors("AllowAnyOrigin");
app.UseAuthorization();
app.MapControllers();


app.Run();
