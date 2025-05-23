import { useEffect, useState } from "react";
import {
  Checkbox,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
  TextField,
  Button,
  Stack,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Confetti from "react-confetti";
import useWindowSize from "react-use/lib/useWindowSize";
import axios from "axios";

type Props = {
  taskList: {
    taskListID: string;
    title: string;
  };
};

type Task = {
  taskId: number;
  description: string;
  isComplete: boolean;
};

export default function TaskList({ taskList }: Props) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const { width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    console.log(taskList);
    axios
      .get(`http://localhost:5000/api/tasks/${taskList.taskListID}`)
      .then((res) => {
        setTasks(res.data);
        console.log(res);
      });
  }, [taskList]);

  //toggle complete - not working
  const handleToggle = (taskId: number) => {
    const updatedTasks = tasks.map((task) =>
      task.taskId === taskId ? { ...task, isComplete: !task.isComplete } : task
    );
    setTasks(updatedTasks);
    if (updatedTasks.length > 0 && updatedTasks.every((t) => t.isComplete)) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
    axios.put(`http://localhost:5000/api/tasks/${taskId}/toggle`);
  };

  //delete tasks - working
  const handleDelete = (taskId: number) => {
    setTasks(tasks.filter((task) => task.taskId !== taskId));
    axios.delete(`http://localhost:5000/api/tasks/${taskId}`);
  };

  //add tasks
  const addTask = () => {
    if (!newTask.trim()) return;

    const taskData = {
      Description: newTask,
      isComplete: false,
      TaskListId: taskList.taskListID,
    };

    axios.post("http://localhost:5000/api/tasks", taskData).then((response) => {
      const createdTask: Task = response.data;
      setTasks((prev) => [...prev, createdTask]);
      setNewTask("");
    });
  };

  //update task description - working
  const updateTaskText = (taskId: number) => {
    setTasks(
      tasks.map((t) =>
        t.taskId === taskId ? { ...t, description: editText } : t
      )
    );
    setEditingId(null);
    axios.put(`http://localhost:5000/api/tasks/description`, {
      taskId,
      description: editText,
    });
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {taskList.title} Tasks
      </Typography>
      <List dense>
        {tasks.map((task) => (
          <ListItem
            key={task.taskId}
            secondaryAction={
              <Stack direction="row" spacing={1}>
                <Tooltip title="Edit task">
                  <IconButton
                    onClick={() => {
                      setEditingId(task.taskId);
                      setEditText(task.description);
                    }}
                    size="small"
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete task">
                  <IconButton
                    onClick={() => {
                      console.log("t", task);
                      handleDelete(task.taskId);
                    }}
                    size="small"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Stack>
            }
          >
            <Checkbox
              edge="start"
              checked={task.isComplete}
              onChange={() => handleToggle(task.taskId)}
            />
            {editingId === task.taskId ? (
              <TextField
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onBlur={() => updateTaskText(task.taskId)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") updateTaskText(task.taskId);
                }}
                size="small"
                autoFocus
                fullWidth
              />
            ) : (
              <ListItemText
                primary={task.description}
                sx={{
                  textDecoration: task.isComplete ? "line-through" : "none",
                  color: task.isComplete ? "text.secondary" : "text.primary",
                }}
              />
            )}
          </ListItem>
        ))}
      </List>
      <Stack direction="row" spacing={1} mt={2}>
        <TextField
          size="small"
          placeholder="New Task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          fullWidth
        />
        <Button variant="contained" onClick={addTask}>
          Add
        </Button>
      </Stack>
      {showConfetti && <Confetti width={width} height={height} />}
    </Box>
  );
}
