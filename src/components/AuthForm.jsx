import { useState } from "react";
import supabaseClient from "../services/supabaseClient";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const AuthForm = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const navigate = useNavigate();

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAuth = async () => {
    setLoading(true);
    setError("");

    const { email, password } = form;

    if (isSignUp) {
      console.log({ aaaaaaaaaaaaaa: import.meta.env });

      const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: import.meta.env.VITE_REDIRECT_URL },
      });

      if (error) setError(error.message);
      else alert("Check your email for confirmation.");

      console.log({
        aaaaaa: data,
        bbbbbbb: form,
        cccccc: email,
        dddddd: password,
      });

      if (data) {
        await createUserInDatabase(email, password);
        setForm({ email: "", password: "" });
      }
    } else {
      const { error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });

      if (error) setError(error.message);
      else navigate("/dashboard");
    }

    setLoading(false);
  };

  const createUserInDatabase = async (email, password) => {
    // Insert user data into your custom 'users' table
    const { error } = await supabaseClient
      .from("users")
      .insert([{ email, password }]);

    if (error) {
      console.error("Error creating user:", error.message);
    } else {
      console.log("User successfully created in database.");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#f0f4f8",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 400,
          p: 4,
          backgroundColor: "white",
          borderRadius: 2,
          boxShadow: 3,
          textAlign: "center",
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Authentication
        </Typography>

        <TextField
          fullWidth
          label="Email"
          type="email"
          margin="normal"
          name="email"
          value={form.email}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          margin="normal"
          name="password"
          value={form.password}
          onChange={handleChange}
        />

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleAuth}
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={24} />
          ) : isSignUp ? (
            "Sign Up"
          ) : (
            "Login"
          )}
        </Button>

        <Typography variant="body2" sx={{ mt: 2 }}>
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <Button variant="text" onClick={() => setIsSignUp((prev) => !prev)}>
            {isSignUp ? "Login here" : "Sign up here"}
          </Button>
        </Typography>
      </Box>
    </Box>
  );
};

export default AuthForm;
