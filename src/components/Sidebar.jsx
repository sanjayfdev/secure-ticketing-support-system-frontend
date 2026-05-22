import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  Avatar,
  Chip,
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

const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuthStore((state) => state);

  const menuItems = [
    {
      label: "Dashboard",
      icon: <DashboardRounded fontSize="small" />,
      path: "/",
    },
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
    menuItems.push({
      label: "Admin Panel",
      icon: <AdminPanelSettingsRounded fontSize="small" />,
      path: "/admin/tickets",
      badge: "Admin",
    });
  }

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  return (
    <Box
      sx={{
        width: 260,
        minHeight: "100vh",
        background: "linear-gradient(180deg, #0F0C29 0%, #1a1050 50%, #24243e 100%)",
        color: "white",
        position: "fixed",
        left: 0,
        top: 0,
        display: "flex",
        flexDirection: "column",
        zIndex: 1200,
        boxShadow: "4px 0 24px rgba(0,0,0,0.3)",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(108,76,241,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(108,76,241,0.08) 0%, transparent 50%)",
          pointerEvents: "none",
        },
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
            background: "linear-gradient(135deg, #6C4CF1, #a78bfa)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 12px rgba(108,76,241,0.4)",
            flexShrink: 0,
          }}
        >
          <LockRounded sx={{ fontSize: 20, color: "white" }} />
        </Box>
        <Box>
          <Typography
            sx={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              fontSize: "0.95rem",
              lineHeight: 1.2,
              letterSpacing: "-0.01em",
              color: "white",
            }}
          >
            Secure Ticketing
          </Typography>
          <Typography
            sx={{
              fontSize: "0.7rem",
              color: "rgba(255,255,255,0.45)",
              letterSpacing: "0.05em",
            }}
          >
            & Support System
          </Typography>
        </Box>
      </Box>

      {/* Nav Items */}
      <List sx={{ p: 2, flex: 1 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItemButton
              key={item.label}
              component={Link}
              to={item.path}
              sx={{
                borderRadius: "12px",
                mb: 0.5,
                px: 2,
                py: 1.2,
                color: isActive ? "white" : "rgba(255,255,255,0.55)",
                background: isActive
                  ? "linear-gradient(135deg, rgba(108,76,241,0.9), rgba(124,99,235,0.8))"
                  : "transparent",
                boxShadow: isActive
                  ? "0 4px 15px rgba(108,76,241,0.35)"
                  : "none",
                transition: "all 0.2s ease",
                "&:hover": {
                  background: isActive
                    ? "linear-gradient(135deg, rgba(108,76,241,0.9), rgba(124,99,235,0.8))"
                    : "rgba(255,255,255,0.06)",
                  color: "white",
                },
              }}
            >
              <Box
                sx={{
                  mr: 1.5,
                  display: "flex",
                  alignItems: "center",
                  color: isActive ? "white" : "rgba(255,255,255,0.5)",
                }}
              >
                {item.icon}
              </Box>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontSize: "0.875rem",
                  fontWeight: isActive ? 600 : 400,
                  fontFamily: "'DM Sans', sans-serif",
                }}
              />
              {item.badge && (
                <Chip
                  label={item.badge}
                  size="small"
                  sx={{
                    height: 18,
                    fontSize: "0.6rem",
                    bgcolor: "rgba(108,76,241,0.3)",
                    color: "#a78bfa",
                    border: "1px solid rgba(108,76,241,0.4)",
                    "& .MuiChip-label": { px: 1 },
                  }}
                />
              )}
            </ListItemButton>
          );
        })}
      </List>

      {/* User + Logout */}
      <Box
        sx={{
          p: 2,
          borderTop: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            p: 1.5,
            borderRadius: "12px",
            bgcolor: "rgba(255,255,255,0.04)",
            mb: 1,
          }}
        >
          <Avatar
            sx={{
              width: 34,
              height: 34,
              background: "linear-gradient(135deg, #6C4CF1, #a78bfa)",
              fontSize: "0.85rem",
              fontWeight: 700,
            }}
          >
            {user?.name?.charAt(0) || "U"}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: "0.8rem",
                fontWeight: 600,
                color: "white",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {user?.name || "User"}
            </Typography>
            <Typography
              sx={{
                fontSize: "0.68rem",
                color: "rgba(255,255,255,0.4)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {user?.email || ""}
            </Typography>
          </Box>
        </Box>

        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: "12px",
            px: 2,
            py: 1,
            color: "rgba(255,255,255,0.5)",
            "&:hover": {
              bgcolor: "rgba(239,68,68,0.1)",
              color: "#f87171",
            },
            transition: "all 0.2s",
          }}
        >
          <LogoutRounded sx={{ fontSize: 18, mr: 1.5 }} />
          <ListItemText
            primary="Logout"
            primaryTypographyProps={{
              fontSize: "0.875rem",
              fontFamily: "'DM Sans', sans-serif",
            }}
          />
        </ListItemButton>
      </Box>
    </Box>
  );
};

export default Sidebar;