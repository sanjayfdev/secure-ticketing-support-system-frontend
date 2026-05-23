import { Box, Typography } from "@mui/material";
import { CheckCircleRounded } from "@mui/icons-material";

const TicketSuccess = () => (
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
);

export default TicketSuccess;