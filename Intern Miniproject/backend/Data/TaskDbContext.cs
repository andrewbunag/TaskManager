using Microsoft.EntityFrameworkCore;
using TaskApi.Models;

namespace TaskApi.Data;

public class TaskDbContext : DbContext
{
    public TaskDbContext(DbContextOptions<TaskDbContext> opts) : base(opts) { }
    public DbSet<TodoTask> Tasks => Set<TodoTask>();   // maps to TM_Table
}
