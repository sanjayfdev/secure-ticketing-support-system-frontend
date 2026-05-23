import { Box, useMediaQuery, useTheme } from "@mui/material";

import { Outlet } from "react-router-dom";

import { useState } from "react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const SIDEBAR_WIDTH = 260;
const NAVBAR_HEIGHT = 72;

const DashboardLayout = () => {
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#F8F9FC",
      }}
    >
      {/* SIDEBAR */}

      <Sidebar mobileOpen={mobileOpen} onClose={handleDrawerToggle} />

      {/* MAIN CONTENT */}

      <Box
        sx={{
          ml: {
            md: `${SIDEBAR_WIDTH}px`,
          },

          minHeight: "100vh",

          display: "flex",

          flexDirection: "column",
        }}
      >
        {/* NAVBAR */}

        <Navbar onMenuClick={handleDrawerToggle} />

        {/* PAGE CONTENT */}

        <Box
          component="main"
          sx={{
            flex: 1,

            pt: `${NAVBAR_HEIGHT}px`,

            px: {
              xs: 2,
              sm: 3,
              md: 4,
            },

            pb: 4,

            width: "100%",

            overflowX: "hidden",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
