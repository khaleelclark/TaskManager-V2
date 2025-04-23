import { useState } from "react";
import axios from "axios";
import {
  Button,
  TextField,
  Typography,
  Paper,
  Box,
  Stack,
} from "@mui/material";

type Props = {
  onLogin: (email: string, taskList: any) => void;
};

export default function Login({ onLogin }: Props) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    // Optionally add email format check here
    setError("");
    axios.get(`http://localhost:5000/api/users/${email}`).then((res) => {
      console.log(res);
      if (res.data.length == 0)
        axios.post(`http://localhost:5000/api/users`, { email: email });
      else
        axios
          .get(
            `http://localhost:5000/api/TaskLists?UserID=${res.data[0].userID}`
          )
          .then((res2) => onLogin(email, res2.data)); //set state  & display tasks
    });
  };

  return (
    <Box
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      bgcolor="#f5f5f5"
    >
      <Paper elevation={4} sx={{ padding: 4, width: 350 }}>
        <Typography variant="h5" gutterBottom>
          Welcome to Task Manager
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Sign in with your email to get started
        </Typography>

        <Stack spacing={2} mt={2}>
          <TextField
            label="Email"
            type="email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleLogin();
            }}
            error={!!error}
            helperText={error}
            fullWidth
          />

          <Button
            onClick={handleLogin}
            variant="contained"
            fullWidth
            size="large"
          >
            Continue
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
