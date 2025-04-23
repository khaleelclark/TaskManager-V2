import React, { useState, useEffect } from "react";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  Box,
  Button,
  TextField,
  IconButton,
  Paper,
  Stack,
  Divider,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import TaskList from "./TaskList";
import axios from "axios";

type Props = {
  taskList: any;
};

type TaskListType = {
  id: string;
  name: string;
};

export default function TaskBoard({ taskList }: Props) {
  const [selectedList, setSelectedList] = useState<TaskListType | null>(null);
  const [newListName, setNewListName] = useState("");
  const [editingListId, setEditingListId] = useState<string | null>(null);
  const [editedName, setEditedName] = useState("");

  const addTaskList = () => {
    if (newListName.trim()) {
      const newList = { id: Date.now().toString(), name: newListName };
      setTaskLists([...taskLists, newList]);
      setNewListName("");
      axios.post("/api/TaskLists", newList);
    }
  };

  const updateListName = (id: string) => {
    // setTaskLists(
    //   taskLists.map((list) =>
    //     list.taskListID === id ? { ...list, name: editedName } : list
    //   )
    // );
    setEditingListId(null);
    // await axios.put(`/api/tasklists/${id}`, { name: editedName });
  };

  return (
    <Stack direction="row" spacing={4} mt={4}>
      <Paper elevation={3} sx={{ p: 3, width: 300 }}>
        <Typography variant="h6" gutterBottom>
          Your Lists
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <List dense>
          {taskList.map((list) => (
            <ListItem
              key={list.taskListID}
              disablePadding
              secondaryAction={
                <Tooltip title="Edit list name">
                  <IconButton
                    edge="end"
                    onClick={() => {
                      setEditingListId(list.taskListID);
                      setEditedName(list.title);
                    }}
                    size="small"
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              }
            >
              {editingListId === list.taskListID ? (
                <TextField
                  size="small"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  onBlur={() => updateListName(list.taskListID)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") updateListName(list.taskListID);
                  }}
                  autoFocus
                  fullWidth
                />
              ) : (
                <ListItemButton
                  selected={selectedList?.id === list.taskListID}
                  onClick={() => {
                    setSelectedList(list);
                  }}
                >
                  <ListItemText primary={list.title} />
                </ListItemButton>
              )}
            </ListItem>
          ))}
        </List>
        <Divider sx={{ my: 2 }} />
        <Stack direction="row" spacing={1}>
          <TextField
            size="small"
            placeholder="New List"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            fullWidth
          />
          <Button variant="contained" onClick={addTaskList}>
            Add
          </Button>
        </Stack>
      </Paper>

      {selectedList && (
        <Paper elevation={3} sx={{ flexGrow: 1, p: 3 }}>
          <TaskList taskList={selectedList} />
          {/* pass in aray of tasks */}
        </Paper>
      )}
    </Stack>
  );
}
