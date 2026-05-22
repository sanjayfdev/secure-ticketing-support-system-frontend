import { Box } from "@mui/material";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const DashboardLayout = ({ children }) => {
  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "#F8F9FC",
      }}
    >
      <Sidebar />

      <Box
        sx={{
          flex: 1,
          ml: { md: "260px" },
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Navbar />

        <Box
          sx={{
            mt: "64px",
            p: { xs: 2, md: 3.5 },
            flex: 1,
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;