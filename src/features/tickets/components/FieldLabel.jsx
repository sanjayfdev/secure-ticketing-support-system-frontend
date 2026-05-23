import { Box, Typography } from "@mui/material";

const FieldLabel = ({ text, required, subtitle }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.75 }}>
    <Typography sx={{ fontSize: "0.82rem", fontWeight: 600, color: "#374151" }}>
      {text}
    </Typography>
    {required && (
      <Typography sx={{ color: "#6C4CF1", fontSize: "0.82rem" }}>*</Typography>
    )}
    {subtitle && (
      <Typography sx={{ fontSize: "0.75rem", color: "#9ca3af" }}>{subtitle}</Typography>
    )}
  </Box>
);

export default FieldLabel;