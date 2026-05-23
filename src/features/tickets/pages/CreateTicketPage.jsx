import {
  Box,
  Button,
  CircularProgress,
  FormHelperText,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { ticketSchema, CATEGORIES } from "../validation/ticketSchema";
import { createTicketApi } from "../api/ticketApi";
import FieldLabel from "../components/FieldLabel";
import FileUpload from "../components/FileUpload";
import TicketSuccess from "../components/TicketSuccess";
import TicketSidebar from "../components/Ticketsidebar";

// Shared input styles
const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    fontSize: "0.875rem",
    bgcolor: "#f9fafb",
    "& fieldset": { border: "1px solid rgba(0,0,0,0.1)" },
    "&:hover fieldset": { borderColor: "#6C4CF1" },
    "&.Mui-focused fieldset": { borderColor: "#6C4CF1", borderWidth: "1.5px" },
    "&.Mui-error fieldset": { borderColor: "#ef4444" },
  },
  "& .MuiFormHelperText-root": { fontSize: "0.72rem", ml: 0.5 },
};

const CreateTicketPage = () => {
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      subject: "",
      category: "",
      description: "",
      attachment: null,
    },
  });

  const selectedCategory = watch("category");

  const onSubmit = async (data) => {
    debugger;
    setSubmitError("");
    try {
      // const formData = new FormData();
      // formData.append("subject", data.subject);
      // formData.append("category", data.category);
      // formData.append("description", data.description);
      // if (data.attachment) formData.append("attachment", data.attachment);
      // console.log(Object.fromEntries(formData));
      await createTicketApi({
        subject: data.subject,
        description: data.description,
        category: data.category,
      });
      setSuccess(true);
      setTimeout(() => navigate("/my-tickets"), 1800);
    } catch (err) {
      setSubmitError(
        err?.response?.data?.message ||
          "Failed to create ticket. Please try again.",
      );
    }
  };

  if (success) return <TicketSuccess />;

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

      <Box
        sx={{
          display: "flex",
          gap: 3,
          alignItems: "flex-start",
          flexWrap: "wrap",
        }}
      >
        {/* Main form */}
        <Paper
          elevation={0}
          component="form"
          onSubmit={handleSubmit(onSubmit)}
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
            <FieldLabel text="Subject" required />
            <TextField
              fullWidth
              placeholder="Enter ticket subject"
              error={!!errors.subject}
              helperText={errors.subject?.message}
              inputProps={{ maxLength: 120 }}
              sx={inputSx}
              {...register("subject")}
            />
          </Box>

          {/* Category */}
          <Box mb={2.5}>
            <FieldLabel text="Category" required />
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  fullWidth
                  displayEmpty
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
              )}
            />
            {errors.category && (
              <FormHelperText error sx={{ ml: 1.5 }}>
                {errors.category.message}
              </FormHelperText>
            )}
          </Box>

          {/* Description */}
          <Box mb={2.5}>
            <FieldLabel text="Description" required />
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  multiline
                  rows={5}
                  placeholder="Describe your issue in detail…"
                  error={!!errors.description}
                  helperText={
                    errors.description?.message ||
                    `${field.value.length}/1000 characters`
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
              )}
            />
          </Box>

          {/* File upload */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle">
              File upload won't work backend implementation needed!
            </Typography>
            <FileUpload control={control} />
          </Box>

          {/* Submit error */}
          {submitError && (
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
                {submitError}
              </Typography>
            </Box>
          )}

          {/* Actions */}
          <Box sx={{ display: "flex", gap: 1.5 }}>
            <Button
              type="button"
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
              type="submit"
              variant="contained"
              disabled={isSubmitting}
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
              {isSubmitting ? (
                <CircularProgress size={18} sx={{ color: "white" }} />
              ) : (
                "Submit Ticket"
              )}
            </Button>
          </Box>
        </Paper>

        {/* Sidebar */}
        <TicketSidebar
          selectedCategory={selectedCategory}
          onCategorySelect={(c) =>
            setValue("category", c, { shouldValidate: true })
          }
        />
      </Box>
    </>
  );
};

export default CreateTicketPage;
