import { Box, Chip, Paper, Typography, alpha } from "@mui/material";
import { ConfirmationNumberRounded } from "@mui/icons-material";
import { CATEGORIES } from "../validation/ticketSchema";

const TIPS = [
  { num: "01", text: "Use a clear, descriptive subject line" },
  { num: "02", text: "Select the most relevant category" },
  { num: "03", text: "Include steps to reproduce the issue" },
  { num: "04", text: "Attach screenshots or files if helpful" },
];

const TicketSidebar = ({ selectedCategory, onCategorySelect }) => (
  <Box sx={{ width: { xs: "100%", lg: 280 }, flexShrink: 0 }}>
    {/* Tips card */}
    <Paper
      elevation={0}
      sx={{
        borderRadius: "16px",
        border: "1px solid rgba(0,0,0,0.06)",
        bgcolor: "white",
        overflow: "hidden",
      }}
    >
      <Box sx={{ p: 2.5, background: "linear-gradient(135deg, #6C4CF1, #8b5cf6)" }}>
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
          <ConfirmationNumberRounded sx={{ color: "white", fontSize: 22 }} />
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
        {TIPS.map((tip) => (
          <Box
            key={tip.num}
            sx={{ display: "flex", gap: 1.5, mb: 1.75, "&:last-child": { mb: 0 } }}
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
            <Typography sx={{ fontSize: "0.8rem", color: "#6b7280", lineHeight: 1.5 }}>
              {tip.text}
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>

    {/* Category chips */}
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
            onClick={() => onCategorySelect(c)}
            sx={{
              height: 24,
              fontSize: "0.7rem",
              fontWeight: 500,
              cursor: "pointer",
              bgcolor: selectedCategory === c ? alpha("#6C4CF1", 0.1) : "#f3f4f6",
              color: selectedCategory === c ? "#6C4CF1" : "#6b7280",
              border:
                selectedCategory === c
                  ? "1px solid rgba(108,76,241,0.3)"
                  : "1px solid transparent",
              "&:hover": { bgcolor: alpha("#6C4CF1", 0.08), color: "#6C4CF1" },
              "& .MuiChip-label": { px: 1.2 },
            }}
          />
        ))}
      </Box>
    </Paper>
  </Box>
);

export default TicketSidebar;