using Microsoft.EntityFrameworkCore;
using TaskApi.Data;
using TaskApi.Models;

var builder = WebApplication.CreateBuilder(args);

// ── Services ──────────────────────────────────────────────────────────────
builder.Services.AddDbContext<TaskDbContext>(opts =>
    opts.UseSqlServer(builder.Configuration.GetConnectionString("TaskDb")));

builder.Services.AddOpenApi();               
builder.Services.AddEndpointsApiExplorer();  
builder.Services.AddCors();

// ── Build ──────────────────────────────────────────────────────────────────
var app = builder.Build();

// ── Middleware ─────────────────────────────────────────────────────────────
app.UseCors(p => p
        .WithOrigins("http://localhost:3000")
        .AllowAnyMethod()
        .AllowAnyHeader());

if (app.Environment.IsDevelopment())
    app.MapOpenApi();

app.UseHttpsRedirection();

// ── Endpoints ──────────────────────────────────────────────────────────────

// GET: /tasks  → list
app.MapGet("/tasks", async (TaskDbContext db) =>
    await db.Tasks.AsNoTracking().ToListAsync());

// POST: /tasks → create
app.MapPost("/tasks", async (TaskDto dto, TaskDbContext db) =>
{
    var task = new TodoTask
    {
        Title       = dto.Title,
        Description = dto.Description,
        DueDate     = dto.DueDate
    };

    db.Tasks.Add(task);
    await db.SaveChangesAsync();

    return Results.Created($"/tasks/{task.Id}", task);
});

// DELETE: /tasks/{id} → delete
app.MapDelete("/tasks/{id:int}", async (int id, TaskDbContext db) =>
{
    var task = await db.Tasks.FindAsync(id);
    if (task is null) return Results.NotFound();

    db.Tasks.Remove(task);
    await db.SaveChangesAsync();
    return Results.Ok();
});

app.Run();