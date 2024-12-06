import { useState, useEffect } from "react";
import supabaseClient from "../services/supabaseClient";
import {
  Box,
  Button,
  Typography,
  TextField,
  IconButton,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";

const Dashboard = () => {
  const [session, setSession] = useState(null);
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [editingTodo, setEditingTodo] = useState(null);
  const [editText, setEditText] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      setSession(session).catch((error) => {
        console.error("Error getting session:", error);
      });

      if (session) {
        fetchTodos(session.user.email);
      }
    });

    const { data: subscription } = supabaseClient.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (session) fetchTodos(session.user.email);
      }
    );

    return () => subscription.subscription.unsubscribe();
  }, []);

  // Fetch todos for the logged-in user
  const fetchTodos = async (email) => {
    try {
      const { data: user, error: userError } = await supabaseClient
        .from("users")
        .select("id")
        .eq("email", email)
        .single();

      console.log({ user });

      if (userError) {
        console.error("Error fetching user ID:", userError);
        return;
      }

      console.log({ user });

      const { data, error } = await supabaseClient
        .from("todos")
        .select("*")
        .eq("user_id", user.id)
        .order("id", { ascending: true });

      if (error) console.error("Error fetching todos:", error);
      else setTodos(data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  // Add new todo
  const handleAddTodo = async () => {
    if (!newTodo.trim()) return;

    try {
      const { data: user, error: userError } = await supabaseClient
        .from("users")
        .select("id")
        .eq("email", session.user.email)
        .single();

      if (userError) {
        console.error("Error fetching user ID:", userError);
        return;
      }

      const { data: insertedTodo, error: insertError } = await supabaseClient
        .from("todos")
        .insert([{ task: newTodo, completed: false, user_id: user.id }])
        .select();

      if (insertError) {
        console.error("Error adding todo:", insertError);
      } else {
        setTodos((prevTodos) => [...prevTodos, ...insertedTodo]);
        setNewTodo("");
      }
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  // Delete todo
  const handleDeleteTodo = async (id) => {
    try {
      const { error } = await supabaseClient
        .from("todos")
        .delete()
        .eq("id", id);
      if (error) console.error("Error deleting todo:", error);
      else setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  // Start editing a todo
  const handleEditTodo = (todo) => {
    setEditingTodo(todo.id);
    setEditText(todo.task);
  };

  // Save edited todo
  const handleSaveTodo = async (id) => {
    try {
      const { error } = await supabaseClient
        .from("todos")
        .update({ task: editText })
        .eq("id", id);

      if (error) {
        console.error("Error updating todo:", error);
      } else {
        setTodos((prevTodos) =>
          prevTodos.map((todo) =>
            todo.id === id ? { ...todo, task: editText } : todo
          )
        );
        setEditingTodo(null);
      }
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const handleLogout = async () => {
    await supabaseClient.auth.signOut();
    navigate("/");
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
      }}
    >
      {session ? (
        <>
          <Typography variant="h4" gutterBottom>
            Welcome, {session.user.email}
          </Typography>
          <Button variant="contained" color="primary" onClick={handleLogout}>
            Logout
          </Button>
          <Typography variant="h5" sx={{ mt: 4 }}>
            Add a New Task:
          </Typography>
          <TextField
            fullWidth
            sx={{ maxWidth: 600, mt: 2 }}
            placeholder="Enter your task..."
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
          />
          <Button
            variant="contained"
            color="secondary"
            sx={{ mt: 2 }}
            onClick={handleAddTodo}
          >
            Add Task
          </Button>
          {todos?.length > 0 && (
            <Typography variant="h5" sx={{ mt: 4 }}>
              Your To-Do List:
            </Typography>
          )}

          {todos?.length > 0 ? (
            <TableContainer component={Paper} sx={{ mt: 2, maxWidth: 800 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Task</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {todos.map((todo) => (
                    <TableRow key={todo.id}>
                      <TableCell>
                        {editingTodo === todo.id ? (
                          <TextField
                            fullWidth
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                          />
                        ) : (
                          <Typography>{todo.task}</Typography>
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          onClick={() =>
                            editingTodo === todo.id
                              ? handleSaveTodo(todo.id)
                              : handleEditTodo(todo)
                          }
                        >
                          {editingTodo === todo.id ? (
                            <SaveIcon />
                          ) : (
                            <EditIcon />
                          )}
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteTodo(todo.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="h5" sx={{ mt: 4 }}>
              No todos available. Please add some tasks!
            </Typography>
          )}
        </>
      ) : (
        <Typography variant="h5" color="error">
          Session not found. Please login.
        </Typography>
      )}
    </Box>
  );
};

export default Dashboard;
