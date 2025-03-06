import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import axios from "axios";
import {
  Lightbulb as LightbulbIcon,
  ContentCopy as CopyIcon,
  ExpandMore as ExpandMoreIcon,
  CloudUpload as CloudUploadIcon,
} from "@mui/icons-material";
import {
  AppBar,
  Toolbar,
  Button,
  Container,
  Typography,
  Box,
  Paper,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  TextField,
} from "@mui/material";

// CSS Styles
const styles = {
  heroSection: {
    backgroundImage: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    padding: "4rem 2rem",
    borderRadius: "12px",
    marginBottom: "2rem",
    textAlign: "center",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  },
  gradientButton: {
    background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
    boxShadow: "0 3px 5px 2px rgba(33, 203, 243, .3)",
    color: "white",
    padding: "12px 36px",
    transition: "transform 0.3s",
    "&:hover": {
      transform: "scale(1.05)",
    },
  },
  paper: {
    padding: "2rem",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  },
  fileUpload: {
    display: "none",
  },
  fileLabel: {
    width: "100%",
    marginBottom: "1rem",
  },
  generatedMessage: {
    position: "relative",
    padding: "1rem",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9",
    border: "1px solid #ddd",
  },
  copyIcon: {
    position: "absolute",
    right: "1rem",
    top: "1rem",
    cursor: "pointer",
  },
};

// Landing Page Component
function LandingPage() {
  const navigate = useNavigate();
  return (
    <Container maxWidth="lg" sx={{ mt: 8 }}>
      <Box sx={styles.heroSection}>
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{ fontWeight: 700 }}
        >
          Craft <span style={{ color: "#FFD700" }}>Perfect</span> Cover Letters
        </Typography>
        <Typography variant="h5" component="p" paragraph>
          AI-powered tool that creates personalized cover letters and recruiter
          messages in seconds
        </Typography>
        <Button
          variant="contained"
          startIcon={<LightbulbIcon />}
          onClick={() => navigate("/generate")}
          sx={styles.gradientButton}
        >
          Start Creating
        </Button>
      </Box>
    </Container>
  );
}

// Form Page Component
function CoverLetterForm() {
  const [jobDescription, setJobDescription] = useState("");
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState(null); // Store backend response
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !jobDescription) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("resume", file);
    formData.append("job_description", jobDescription);

    try {
      const res = await axios.post("http://localhost:8000/generate", formData);
      setResponse(res.data); // Save the response from backend
    } catch (error) {
      console.error("Error generating message:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 6 }}>
      <Paper elevation={3} sx={styles.paper}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ mb: 4, textAlign: "center" }}
        >
          Create Your Cover Letter
        </Typography>

        {/* File Upload */}
        <Box sx={{ mb: 3 }}>
          <input
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            onChange={handleFileChange}
            style={styles.fileUpload}
            id="file-upload"
          />
          <label htmlFor="file-upload">
            <Button
              variant="outlined"
              component="span"
              startIcon={<CloudUploadIcon />}
              fullWidth
              sx={styles.fileLabel}
            >
              Upload Resume
            </Button>
          </label>
          {file && (
            <Typography variant="body2" color="textSecondary">
              Selected file: {file.name}
            </Typography>
          )}
        </Box>

        {/* Job Description Input */}
        <TextField
          label="Job Description"
          multiline
          rows={6}
          fullWidth
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          variant="outlined"
          sx={{ mb: 3 }}
          helperText="Paste the job description here"
        />

        {/* Submit Button */}
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          fullWidth
          disabled={loading}
          startIcon={loading ? <CircularProgress size={24} /> : null}
        >
          {loading ? "Generating..." : "Create Cover Letter"}
        </Button>

        {/* Display Backend Response */}
        {response && (
          <Box sx={{ mt: 4 }}>
            {/* Recruiter Message */}
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1">Recruiter Message</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={styles.generatedMessage}>
                  <IconButton
                    aria-label="copy"
                    sx={styles.copyIcon}
                    onClick={() =>
                      navigator.clipboard.writeText(response.recruiter_message)
                    }
                  >
                    <CopyIcon />
                  </IconButton>
                  <Typography variant="body1" whiteSpace="pre-line">
                    {response.recruiter_message}
                  </Typography>
                </Box>
              </AccordionDetails>
            </Accordion>

            {/* Cover Letter */}
            <Accordion sx={{ mt: 2 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1">Cover Letter</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={styles.generatedMessage}>
                  <IconButton
                    aria-label="copy"
                    sx={styles.copyIcon}
                    onClick={() =>
                      navigator.clipboard.writeText(response.cover_letter)
                    }
                  >
                    <CopyIcon />
                  </IconButton>
                  <Typography variant="body1" whiteSpace="pre-line">
                    {response.cover_letter}
                  </Typography>
                </Box>
              </AccordionDetails>
            </Accordion>
          </Box>
        )}
      </Paper>
    </Container>
  );
}

// Navbar Component
function Navbar() {
  const navigate = useNavigate();
  return (
    <AppBar position="sticky" elevation={1}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography
          variant="h6"
          component="div"
          sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}
          onClick={() => navigate("/")}
        >
          <LightbulbIcon sx={{ mr: 1 }} /> ResumeAI
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button color="inherit" onClick={() => navigate("/")}>
            Home
          </Button>
          <Button color="inherit" onClick={() => navigate("/generate")}>
            Create
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

// Main App Component with Routing
export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/generate" element={<CoverLetterForm />} />
      </Routes>
    </Router>
  );
}
