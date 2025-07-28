namespace TaskApi.Models;

public class TaskDto
{
    public string    Title       { get; set; } = null!;
    public string    Description { get; set; } = null!;
    public DateTime? DueDate     { get; set; }
}