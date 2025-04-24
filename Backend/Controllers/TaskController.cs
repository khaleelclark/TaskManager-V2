using Microsoft.AspNetCore.Mvc;
using TaskManagerApi.Data;

namespace TaskManagerApi.Controllers;

[ApiController]
[Route("api/tasks")]
public class TasksController : ControllerBase
{
    private readonly DatabaseHelper _dbHelper;

    public TasksController(DatabaseHelper dbHelper)
    {
        _dbHelper = dbHelper;
    }

    // Get all tasks by task list id
    [HttpGet("{TaskListId:int}")]
    public async Task<ActionResult<IEnumerable<Task>>> GetByTaskListId(int TaskListId)
    {
        string query = "SELECT * FROM tasks WHERE TaskListId = @TaskListId";
        var tasks = await _dbHelper.QueryAsync<Task>(query, new { TaskListId });
        return Ok(tasks);
    }

    // Create a new task
    [HttpPost]
    public async Task<ActionResult<Task>> Create([FromBody] Task task)
    {
        string query = "INSERT INTO Tasks (Description, TaskListId, IsComplete) VALUES (@Description, @TaskListId, @IsComplete)";
        await _dbHelper.ExecuteAsync(query, new { task.Description, task.TaskListId, task.IsComplete });
        return CreatedAtAction(nameof(GetByTaskListId), new { task.TaskListId }, task);
    }

    // Update task Description
    [HttpPut("description")]
    public async Task<IActionResult> UpdateDescription([FromBody] Task updated)
    {
        string query = "UPDATE Tasks SET Description = @Description WHERE TaskId = @TaskId";
        var result = await _dbHelper.ExecuteAsync(query, new { updated.Description, updated.TaskId });

        if (result == 0)
            return NotFound();

        return NoContent();
    }

    // Toggle task completion
    [HttpPut("{TaskId}/toggle")]
   public async Task<IActionResult> Toggle([FromBody] Task updated)
    {
        string query = "UPDATE Tasks SET IsComplete = @IsComplete WHERE TaskId = @TaskId";
        var result = await _dbHelper.ExecuteAsync(query, new { updated.IsComplete, updated.TaskId });

        if (result == 0)
            return NotFound();

        return NoContent();
    }


    // Delete a task
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        string query = "DELETE FROM Tasks WHERE TaskId = @Id";
        var result = await _dbHelper.ExecuteAsync(query, new { Id = id });

        if (result == 0)
            return NotFound();

        return NoContent();
    }
}