import {
  Box,
  Button,
  Chip,
  CircularProgress,
  FormHelperText,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  alpha,
} from "@mui/material";
import {
  AttachFileRounded,
  CheckCircleRounded,
  CloseRounded,
  ConfirmationNumberRounded,
  InsertDriveFileRounded,
} from "@mui/icons-material";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { createTicketApi } from "../api/ticketApi";

const CATEGORIES = [
  "Technical Issue",
  "Payment Issue",
  "Certification",
  "Content Issue",
  "General Query",
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const CreateTicketPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    subject: "",
    category: "",
    description: "",
  });
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.subject.trim()) e.subject = "Subject is required.";
    else if (form.subject.length < 5)
      e.subject = "Subject must be at least 5 characters.";
    if (!form.category) e.category = "Please select a category.";
    if (!form.description.trim()) e.description = "Description is required.";
    else if (form.description.length < 20)
      e.description = "Description must be at least 20 characters.";
    return e;
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (f.size > MAX_FILE_SIZE) {
      setErrors((prev) => ({ ...prev, file: "File must be under 5MB." }));
      return;
    }
    setFile(f);
    setErrors((prev) => ({ ...prev, file: "" }));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (!f) return;
    if (f.size > MAX_FILE_SIZE) {
      setErrors((prev) => ({ ...prev, file: "File must be under 5MB." }));
      return;
    }
    setFile(f);
    setErrors((prev) => ({ ...prev, file: "" }));
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("subject", form.subject.trim());
      formData.append("category", form.category);
      formData.append("description", form.description.trim());
      if (file) formData.append("attachment", file);

      await createTicketApi(formData);
      setSuccess(true);
      setTimeout(() => navigate("/my-tickets"), 1800);
    } catch (err) {
      setErrors({ submit: err?.response?.data?.message || "Failed to create ticket. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "60vh",
          }}
        >
          <Box sx={{ textAlign: "center" }}>
            <Box
              sx={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                bgcolor: "#d1fae5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 2.5,
              }}
            >
              <CheckCircleRounded sx={{ fontSize: 40, color: "#10b981" }} />
            </Box>
            <Typography
              sx={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 700,
                fontSize: "1.4rem",
                color: "#111827",
                mb: 0.75,
              }}
            >
              Ticket Submitted!
            </Typography>
            <Typography sx={{ fontSize: "0.875rem", color: "#9ca3af" }}>
              Redirecting to your tickets…
            </Typography>
          </Box>
        </Box>
      </>
    );
  }

  return (
    <>
      {/* Page header */}
      <Box mb={3.5}>
        <Typography
          variant="h5"
          sx={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 700,
            color: "#111827",
            letterSpacing: "-0.02em",
          }}
        >
          Create Ticket
        </Typography>
        <Typography sx={{ fontSize: "0.85rem", color: "#9ca3af", mt: 0.3 }}>
          Describe your issue and we'll get back to you shortly
        </Typography>
      </Box>

      <Box sx={{ display: "flex", gap: 3, alignItems: "flex-start", flexWrap: "wrap" }}>
        {/* Main form */}
        <Paper
          elevation={0}
          sx={{
            flex: 1,
            minWidth: 320,
            borderRadius: "18px",
            border: "1px solid rgba(0,0,0,0.06)",
            bgcolor: "white",
            p: 3.5,
          }}
        >
          {/* Subject */}
          <Box mb={2.5}>
            <Label text="Subject" required />
            <TextField
              fullWidth
              placeholder="Enter ticket subject"
              value={form.subject}
              onChange={handleChange("subject")}
              error={!!errors.subject}
              helperText={errors.subject}
              inputProps={{ maxLength: 120 }}
              sx={inputSx}
            />
          </Box>

          {/* Category */}
          <Box mb={2.5}>
            <Label text="Category" required />
            <Select
              fullWidth
              displayEmpty
              value={form.category}
              onChange={handleChange("category")}
              error={!!errors.category}
              renderValue={(v) =>
                v ? (
                  v
                ) : (
                  <span style={{ color: "#9ca3af" }}>Select category</span>
                )
              }
              sx={{
                borderRadius: "10px",
                fontSize: "0.875rem",
                bgcolor: "#f9fafb",
                "& .MuiOutlinedInput-notchedOutline": {
                  border: errors.category
                    ? "1px solid #ef4444"
                    : "1px solid rgba(0,0,0,0.1)",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#6C4CF1",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#6C4CF1",
                  borderWidth: "1.5px",
                },
              }}
            >
              {CATEGORIES.map((c) => (
                <MenuItem key={c} value={c} sx={{ fontSize: "0.875rem" }}>
                  {c}
                </MenuItem>
              ))}
            </Select>
            {errors.category && (
              <FormHelperText error sx={{ ml: 1.5 }}>
                {errors.category}
              </FormHelperText>
            )}
          </Box>

          {/* Description */}
          <Box mb={2.5}>
            <Label text="Description" required />
            <TextField
              fullWidth
              multiline
              rows={5}
              placeholder="Describe your issue in detail…"
              value={form.description}
              onChange={handleChange("description")}
              error={!!errors.description}
              helperText={
                errors.description ||
                `${form.description.length}/1000 characters`
              }
              inputProps={{ maxLength: 1000 }}
              sx={{
                ...inputSx,
                "& .MuiFormHelperText-root": {
                  textAlign: errors.description ? "left" : "right",
                  color: errors.description ? "#ef4444" : "#9ca3af",
                  fontSize: "0.7rem",
                },
              }}
            />
          </Box>

          {/* File attachment */}
          <Box mb={3}>
            <Label text="Attachment" subtitle="(optional)" />
            <Box
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              sx={{
                border: `2px dashed ${errors.file ? "#ef4444" : "rgba(108,76,241,0.25)"}`,
                borderRadius: "12px",
                p: 2.5,
                textAlign: "center",
                cursor: "pointer",
                bgcolor: "#faf9ff",
                transition: "all 0.2s",
                "&:hover": {
                  borderColor: "#6C4CF1",
                  bgcolor: "#f5f3ff",
                },
              }}
            >
              {file ? (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1.5,
                  }}
                >
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: "8px",
                      bgcolor: "#ede9fe",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <InsertDriveFileRounded
                      sx={{ fontSize: 20, color: "#6C4CF1" }}
                    />
                  </Box>
                  <Box sx={{ textAlign: "left" }}>
                    <Typography
                      sx={{
                        fontSize: "0.82rem",
                        fontWeight: 600,
                        color: "#111827",
                      }}
                    >
                      {file.name}
                    </Typography>
                    <Typography sx={{ fontSize: "0.7rem", color: "#9ca3af" }}>
                      {(file.size / 1024).toFixed(1)} KB
                    </Typography>
                  </Box>
                  <Box
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                    }}
                    sx={{
                      ml: 1,
                      cursor: "pointer",
                      color: "#9ca3af",
                      "&:hover": { color: "#ef4444" },
                      display: "flex",
                    }}
                  >
                    <CloseRounded sx={{ fontSize: 18 }} />
                  </Box>
                </Box>
              ) : (
                <>
                  <AttachFileRounded
                    sx={{ fontSize: 28, color: "#c4b5fd", mb: 1 }}
                  />
                  <Typography
                    sx={{
                      fontSize: "0.82rem",
                      fontWeight: 500,
                      color: "#6C4CF1",
                    }}
                  >
                    Click to upload or drag & drop
                  </Typography>
                  <Typography sx={{ fontSize: "0.7rem", color: "#9ca3af", mt: 0.5 }}>
                    Max file size: 5MB
                  </Typography>
                </>
              )}
            </Box>
            {errors.file && (
              <FormHelperText error sx={{ ml: 1.5, mt: 0.5 }}>
                {errors.file}
              </FormHelperText>
            )}
            <input
              ref={fileInputRef}
              type="file"
              hidden
              accept="image/*,.pdf,.doc,.docx,.txt"
              onChange={handleFileChange}
            />
          </Box>

          {/* Submit error */}
          {errors.submit && (
            <Box
              sx={{
                p: 1.5,
                borderRadius: "10px",
                bgcolor: "#fef2f2",
                border: "1px solid rgba(239,68,68,0.2)",
                mb: 2.5,
              }}
            >
              <Typography sx={{ fontSize: "0.82rem", color: "#dc2626" }}>
                {errors.submit}
              </Typography>
            </Box>
          )}

          {/* Actions */}
          <Box sx={{ display: "flex", gap: 1.5 }}>
            <Button
              onClick={() => navigate(-1)}
              variant="outlined"
              sx={{
                borderRadius: "10px",
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.875rem",
                color: "#374151",
                borderColor: "rgba(0,0,0,0.15)",
                px: 2.5,
                "&:hover": {
                  borderColor: "rgba(0,0,0,0.3)",
                  bgcolor: "#f9fafb",
                },
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              disabled={loading}
              sx={{
                flex: 1,
                borderRadius: "10px",
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.875rem",
                background: "linear-gradient(135deg, #6C4CF1, #8b5cf6)",
                boxShadow: "0 4px 12px rgba(108,76,241,0.35)",
                "&:hover": {
                  background: "linear-gradient(135deg, #5b3de0, #7c3aed)",
                  boxShadow: "0 4px 18px rgba(108,76,241,0.45)",
                },
                "&.Mui-disabled": {
                  background: "#e5e7eb",
                  color: "#9ca3af",
                  boxShadow: "none",
                },
              }}
            >
              {loading ? (
                <CircularProgress size={18} sx={{ color: "white" }} />
              ) : (
                "Submit Ticket"
              )}
            </Button>
          </Box>
        </Paper>

        {/* Side info card */}
        <Box sx={{ width: { xs: "100%", lg: 280 }, flexShrink: 0 }}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: "16px",
              border: "1px solid rgba(0,0,0,0.06)",
              bgcolor: "white",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                p: 2.5,
                background: "linear-gradient(135deg, #6C4CF1, #8b5cf6)",
              }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "10px",
                  bgcolor: "rgba(255,255,255,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 1.5,
                }}
              >
                <ConfirmationNumberRounded
                  sx={{ color: "white", fontSize: 22 }}
                />
              </Box>
              <Typography
                sx={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  color: "white",
                  mb: 0.5,
                }}
              >
                Tips for a faster response
              </Typography>
              <Typography sx={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.75)" }}>
                Help us help you by being specific.
              </Typography>
            </Box>

            <Box sx={{ p: 2.5 }}>
              {[
                {
                  num: "01",
                  text: "Use a clear, descriptive subject line",
                },
                {
                  num: "02",
                  text: "Select the most relevant category",
                },
                {
                  num: "03",
                  text: "Include steps to reproduce the issue",
                },
                {
                  num: "04",
                  text: "Attach screenshots or files if helpful",
                },
              ].map((tip) => (
                <Box
                  key={tip.num}
                  sx={{
                    display: "flex",
                    gap: 1.5,
                    mb: 1.75,
                    "&:last-child": { mb: 0 },
                  }}
                >
                  <Box
                    sx={{
                      width: 26,
                      height: 26,
                      borderRadius: "8px",
                      bgcolor: "#ede9fe",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "0.65rem",
                        fontWeight: 800,
                        color: "#6C4CF1",
                        fontFamily: "'Syne', sans-serif",
                      }}
                    >
                      {tip.num}
                    </Typography>
                  </Box>
                  <Typography
                    sx={{ fontSize: "0.8rem", color: "#6b7280", lineHeight: 1.5 }}
                  >
                    {tip.text}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>

          {/* Category chips reference */}
          <Paper
            elevation={0}
            sx={{
              borderRadius: "16px",
              border: "1px solid rgba(0,0,0,0.06)",
              bgcolor: "white",
              p: 2.5,
              mt: 2,
            }}
          >
            <Typography
              sx={{
                fontSize: "0.78rem",
                fontWeight: 700,
                color: "#374151",
                mb: 1.5,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              Categories
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
              {CATEGORIES.map((c) => (
                <Chip
                  key={c}
                  label={c}
                  size="small"
                  onClick={() => {
                    setForm((prev) => ({ ...prev, category: c }));
                    setErrors((prev) => ({ ...prev, category: "" }));
                  }}
                  sx={{
                    height: 24,
                    fontSize: "0.7rem",
                    fontWeight: 500,
                    cursor: "pointer",
                    bgcolor:
                      form.category === c
                        ? alpha("#6C4CF1", 0.1)
                        : "#f3f4f6",
                    color: form.category === c ? "#6C4CF1" : "#6b7280",
                    border:
                      form.category === c
                        ? "1px solid rgba(108,76,241,0.3)"
                        : "1px solid transparent",
                    "&:hover": {
                      bgcolor: alpha("#6C4CF1", 0.08),
                      color: "#6C4CF1",
                    },
                    "& .MuiChip-label": { px: 1.2 },
                  }}
                />
              ))}
            </Box>
          </Paper>
        </Box>
      </Box>
    </>
  );
};

// Helpers
const Label = ({ text, required, subtitle }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.75 }}>
    <Typography
      sx={{ fontSize: "0.82rem", fontWeight: 600, color: "#374151" }}
    >
      {text}
    </Typography>
    {required && (
      <Typography sx={{ color: "#6C4CF1", fontSize: "0.82rem" }}>*</Typography>
    )}
    {subtitle && (
      <Typography sx={{ fontSize: "0.75rem", color: "#9ca3af" }}>
        {subtitle}
      </Typography>
    )}
  </Box>
);

const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    fontSize: "0.875rem",
    bgcolor: "#f9fafb",
    "& fieldset": { border: "1px solid rgba(0,0,0,0.1)" },
    "&:hover fieldset": { borderColor: "#6C4CF1" },
    "&.Mui-focused fieldset": {
      borderColor: "#6C4CF1",
      borderWidth: "1.5px",
    },
    "&.Mui-error fieldset": { borderColor: "#ef4444" },
  },
  "& .MuiFormHelperText-root": { fontSize: "0.72rem", ml: 0.5 },
};

export default CreateTicketPage;