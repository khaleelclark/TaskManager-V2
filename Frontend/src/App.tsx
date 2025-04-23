import React, { useState } from "react";
import Login from "./components/Login";
import TaskBoard from "./components/TaskBoard";
import { Container } from "@mui/material";

function App() {
  const [userID, setUserID] = useState<string | null>(null);
  const [taskList, setTaskList] = useState<string | null>(null);

  return (
    <Container>
      {!userID ? (
        <Login
          onLogin={(userID, taskList) => {
            setUserID(userID);
            setTaskList(taskList);
          }}
        />
      ) : (
        <TaskBoard taskList={taskList ?? ""} userID={userID} />
      )}
    </Container>
  );
}

export default App;
