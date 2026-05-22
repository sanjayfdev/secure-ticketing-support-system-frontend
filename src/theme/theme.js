import { createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#6C4CF1",
    },
    secondary: {
      main: "#111827",
    },
    background: {
      default: "#F5F7FB",
    },
  },
  typography: {
    fontFamily: "Inter, sans-serif",
  },
  shape: {
    borderRadius: 12,
  },
});

export default theme;