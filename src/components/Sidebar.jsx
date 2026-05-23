import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  Avatar,
  Chip,
  Drawer,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import {
  Link,
  useLocation,
} from "react-router-dom";

import {
  DashboardRounded,
  ConfirmationNumberRounded,
  AddCircleRounded,
  AdminPanelSettingsRounded,
  PersonRounded,
  LogoutRounded,
  LockRounded,
} from "@mui/icons-material";

import useAuthStore from "../features/auth/store/authStore";

const SIDEBAR_WIDTH = 260;

const Sidebar = ({ mobileOpen, onClose }) => {
  const location = useLocation();

  const { user, logout } = useAuthStore((state) => state);

  const theme = useTheme();

  const isMobile = useMediaQuery(
    theme.breakpoints.down("md")
  );

  const menuItems = [
    // {
    //   label: "Dashboard",
    //   icon: <DashboardRounded fontSize="small" />,
    //   path: "/",
    // },
    {
      label: "My Tickets",
      icon: <ConfirmationNumberRounded fontSize="small" />,
      path: "/my-tickets",
    },
    {
      label: "Create Ticket",
      icon: <AddCircleRounded fontSize="small" />,
      path: "/create-ticket",
    },
    {
      label: "Profile",
      icon: <PersonRounded fontSize="small" />,
      path: "/profile",
    },
  ];

  if (user?.role === "admin") {
    menuItems.unshift({
      label: "Admin Panel",
      icon: <AdminPanelSettingsRounded fontSize="small" />,
      path: "/admin",
      badge: "Admin",
    });
  }else{
    menuItems.unshift({
      label: "Dashboard",
      icon: <DashboardRounded fontSize="small" />,
      path: "/"
    });
  }

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  const sidebarContent = (
    <Box
      sx={{
        width: SIDEBAR_WIDTH,
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #0F0C29 0%, #1a1050 50%, #24243e 100%)",
        color: "white",
        display: "flex",
        flexDirection: "column",
        boxShadow: "4px 0 24px rgba(0,0,0,0.3)",
      }}
    >
      {/* Logo */}
      <Box
        sx={{
          p: 3,
          pb: 2,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <Box
          sx={{
            width: 38,
            height: 38,
            borderRadius: "10px",
            background:
              "linear-gradient(135deg, #6C4CF1, #a78bfa)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <LockRounded
            sx={{ fontSize: 20, color: "white" }}
          />
        </Box>

        <Box>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: "0.95rem",
            }}
          >
            Secure Ticketing
          </Typography>

          <Typography
            sx={{
              fontSize: "0.7rem",
              color: "rgba(255,255,255,0.45)",
            }}
          >
            & Support System
          </Typography>
        </Box>
      </Box>

      {/* Menu */}
      <List sx={{ p: 2, flex: 1 }}>
        {menuItems.map((item) => {
          const isActive =
            location.pathname === item.path;

          return (
            <ListItemButton
              key={item.label}
              component={Link}
              to={item.path}
              onClick={isMobile ? onClose : undefined}
              sx={{
                borderRadius: "12px",
                mb: 0.5,
                px: 2,
                py: 1.2,
                color: isActive
                  ? "white"
                  : "rgba(255,255,255,0.55)",
                background: isActive
                  ? "linear-gradient(135deg, rgba(108,76,241,0.9), rgba(124,99,235,0.8))"
                  : "transparent",

                "&:hover": {
                  background: isActive
                    ? "linear-gradient(135deg, rgba(108,76,241,0.9), rgba(124,99,235,0.8))"
                    : "rgba(255,255,255,0.06)",
                },
              }}
            >
              <Box sx={{ mr: 1.5 }}>
                {item.icon}
              </Box>

              <ListItemText
                primary={item.label}
              />

              {item.badge && (
                <Chip
                  label={item.badge}
                  size="small"
                />
              )}
            </ListItemButton>
          );
        })}
      </List>

      {/* User */}
      <Box
        sx={{
          p: 2,
          borderTop:
            "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            mb: 1,
          }}
        >
          <Avatar>
            {user?.name?.charAt(0) || "U"}
          </Avatar>

          <Box>
            <Typography fontSize="0.8rem">
              {user?.name}
            </Typography>

            <Typography
              fontSize="0.68rem"
              color="rgba(255,255,255,0.5)"
            >
              {user?.email}
            </Typography>
          </Box>
        </Box>

        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: "12px",
          }}
        >
          <LogoutRounded
            sx={{ fontSize: 18, mr: 1.5 }}
          />

          <ListItemText primary="Logout" />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Mobile Drawer */}

      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={onClose}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            "& .MuiDrawer-paper": {
              width: SIDEBAR_WIDTH,
              border: "none",
            },
          }}
        >
          {sidebarContent}
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          open
          sx={{
            width: SIDEBAR_WIDTH,
            flexShrink: 0,

            "& .MuiDrawer-paper": {
              width: SIDEBAR_WIDTH,
              boxSizing: "border-box",
              border: "none",
            },
          }}
        >
          {sidebarContent}
        </Drawer>
      )}
    </>
  );
};

export default Sidebar;