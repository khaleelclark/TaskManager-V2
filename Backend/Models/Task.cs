public class Task
{
    public int TaskId { get; set; }
    public int TaskListId { get; set; }
    public string? Description { get; set; }
    public bool IsComplete { get; set; }
    public DateTime? DueDate { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
