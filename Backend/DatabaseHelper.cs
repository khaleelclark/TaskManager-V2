using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System.Data;
using System.Threading.Tasks;

namespace TaskManagerApi.Data
{
    public class DatabaseHelper
    {
        private readonly string _connectionString;

        public DatabaseHelper(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        // Create a SQL connection
        private SqlConnection CreateConnection()
        {
            return new SqlConnection(_connectionString);
        }

        // Execute SQL command (e.g., INSERT, UPDATE, DELETE)
        public async Task<int> ExecuteAsync(string query, object parameters = null)
        {
            using (var connection = CreateConnection())
            {
                await connection.OpenAsync();
                using (var command = new SqlCommand(query, connection))
                {
                    AddParameters(command, parameters);
                    return await command.ExecuteNonQueryAsync();
                }
            }
        }

        // Query a single result (e.g., SELECT that returns a single value)
        public async Task<T> QuerySingleOrDefaultAsync<T>(string query, object parameters = null)
        {
            using (var connection = CreateConnection())
            {
                await connection.OpenAsync();
                using (var command = new SqlCommand(query, connection))
                {
                    AddParameters(command, parameters);
                    var result = await command.ExecuteScalarAsync();
                    return result != null ? (T)result : default;
                }
            }
        }

        // Query multiple results (e.g., SELECT that returns multiple rows)
        public async Task<IEnumerable<T>> QueryAsync<T>(string query, object parameters = null)
        {
            var results = new List<T>();
            using (var connection = CreateConnection())
            {
                await connection.OpenAsync();
                using (var command = new SqlCommand(query, connection))
                {
                    AddParameters(command, parameters);
                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            results.Add(MapReaderToEntity<T>(reader));
                        }
                    }
                }
            }
            return results;
        }

        // Helper method to add parameters to SQL command
        private void AddParameters(SqlCommand command, object parameters)
        {
            if (parameters != null)
            {
                foreach (var prop in parameters.GetType().GetProperties())
                {
                    var paramName = "@" + prop.Name;
                    var paramValue = prop.GetValue(parameters);
                    command.Parameters.AddWithValue(paramName, paramValue ?? DBNull.Value);
                }
            }
        }

        // Helper method to map a SQL data reader row to an entity (e.g., TaskList or TaskItem)
        private T MapReaderToEntity<T>(SqlDataReader reader)
{
    var entity = Activator.CreateInstance<T>();
    var columns = Enumerable.Range(0, reader.FieldCount)
                            .Select(reader.GetName)
                            .ToHashSet(StringComparer.OrdinalIgnoreCase);

    foreach (var prop in entity.GetType().GetProperties())
    {
        var columnName = prop.Name;
        if (columns.Contains(columnName) && reader[columnName] != DBNull.Value)
        {
            prop.SetValue(entity, reader[columnName]);
        }
    }
    return entity;
}
    }
}