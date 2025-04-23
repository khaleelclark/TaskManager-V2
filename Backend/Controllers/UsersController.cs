using Microsoft.AspNetCore.Mvc;
using TaskManagerApi.Data;

namespace TaskManagerApi.Controllers;

[ApiController]
[Route("api/users")]
public class UsersController : ControllerBase
{
    private readonly DatabaseHelper _dbHelper;

    public UsersController(DatabaseHelper dbHelper)
    {
        _dbHelper = dbHelper;
    }

    // Get all users by user list id
    [HttpGet("{Email}")]
    public async Task<ActionResult<IEnumerable<User>>> GetByEmail(string Email)
    {
        string query = "SELECT * FROM users WHERE Email = @Email";
        var users = await _dbHelper.QueryAsync<User>(query, new { Email });
        return Ok(users);
    }

    // Create a new user
    [HttpPost]
    public async Task<ActionResult<User>> Create([FromBody] User user)
    {
        string query = "INSERT INTO Users (Email) VALUES (@Email)";
        await _dbHelper.ExecuteAsync(query, new { user.Email});
        return CreatedAtAction(nameof(GetByEmail), new { user.Email }, user);
    }
}