import React, { useState } from "react";
import Login from "./components/Login";
import TaskBoard from "./components/TaskBoard";
import { Container } from "@mui/material";

function App() {
  const [email, setEmail] = useState<string | null>(null);
  const [taskList, setTaskList] = useState<string | null>(null);

  return (
    <Container>
      {!email ? (
        <Login
          onLogin={(email, taskList) => {
            setEmail(email);
            setTaskList(taskList);
          }}
        />
      ) : (
        <TaskBoard taskList={taskList ?? ""} />
      )}
    </Container>
  );
}

export default App;
