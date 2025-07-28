using System.ComponentModel.DataAnnotations.Schema;

namespace TaskApi.Models;

[Table("TM_Table")]    

public class TodoTask
{
    public int       Id          { get; set; }
    public string    Title       { get; set; } = null!;
    public string    Description { get; set; } = null!;
    public DateTime? DueDate     { get; set; }
}