using Microsoft.AspNetCore.Mvc;
using TaskManagerApi.Data;

[ApiController]
[Route("api/[controller]")]
public class TaskListsController : ControllerBase
{
    private readonly DatabaseHelper _dbHelper;

    public TaskListsController(DatabaseHelper dbHelper)
    {
        _dbHelper = dbHelper;
    }

    // Get all task lists for a specific user
    [HttpGet]
    public async Task<ActionResult<IEnumerable<TaskList>>> Get([FromQuery] int UserID)
    {
        string query = "SELECT * FROM TaskLists WHERE UserID = @UserID";
        var taskLists = await _dbHelper.QueryAsync<TaskList>(query, new {UserID});
        return Ok(taskLists);
    }

    // Create a new task list
    [HttpPost]
    public async Task<ActionResult<TaskList>> Create([FromBody] TaskList list)
    {
        string query = "INSERT INTO TaskLists (Title, UserID) VALUES (@Title, @UserID)";
        await _dbHelper.ExecuteAsync(query, new { list.Title, list.UserID });
        return CreatedAtAction(nameof(Get), new { list.UserID }, list);
    }

    // Update task list Title
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] TaskList updated)
    {
        string query = "UPDATE TaskLists SET Title = @Title WHERE TaskListID = @Id";
        var result = await _dbHelper.ExecuteAsync(query, new { updated.Title, Id = id });

        if (result == 0)
            return NotFound();

        return NoContent();
    }

    // Delete a task list
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        string query = "DELETE FROM TaskLists WHERE TaskListID = @Id";
        var result = await _dbHelper.ExecuteAsync(query, new { Id = id });

        if (result == 0)
            return NotFound();

        return NoContent();
    }
}