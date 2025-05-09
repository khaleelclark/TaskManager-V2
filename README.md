# Task Manager

This is a task manager that I created for the final project of my Advanced Database course.

For the backend I used a simple .NET backend that is connected with SQL Server.
For the frontend I used React and Typescript.

This project was supposed to showcase my ability to use a database in a real world enviornment.

Upon entering your email, you will be directed to your personalized task page. This page is uniquely associated with your account. From here, you can:

* Create new task lists to organize your work.
* Modify the names of your existing task lists.
* Delete task lists as needed.

Within each task list, you have the following capabilities:

* Add new tasks to the list.
* Change the names or descriptions of existing tasks.
* Delete tasks that are no longer required.

All modifications made to your task lists and tasks are automatically saved.

Note - You will have to set up your own instance of SQL Server and hook it up to the application yourself to run the backend. dotnet build dotnet run
To run the frontend you will need to pnpm install, and pnpm run dev

**Backend:**

1.  Install the .NET SDK installed on your system.
2.  Set up your own instance of SQL Server.
3.  Configure the backend to connect to your SQL Server instance.
4.  Change directory to the backend directory in your terminal.
5.  Run the following commands:
    ```bash
    dotnet build
    dotnet run
    ```

**Frontend:**

1.  Ensure you have Node.js and pnpm installed on your system.
2.  Change directory to the frontend directory in your terminal.
3.  Install the project dependencies:
    ```bash
    pnpm install
    ```
4.  Start the development server:
    ```bash
    pnpm run dev
    ```
