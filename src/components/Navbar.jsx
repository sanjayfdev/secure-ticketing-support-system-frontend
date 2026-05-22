import {
  AppBar,
  Avatar,
  Box,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Tooltip,
} from "@mui/material";
import {
  NotificationsRounded,
  KeyboardArrowDownRounded,
} from "@mui/icons-material";
import useAuthStore from "../features/auth/store/authStore";

const Navbar = () => {
  const { user } = useAuthStore((state) => state);

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        bgcolor: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(12px)",
        color: "#0F0C29",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
        width: { md: "calc(100% - 260px)" },
        ml: { md: "260px" },
        boxShadow: "0 1px 20px rgba(0,0,0,0.05)",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          minHeight: "64px !important",
          px: { xs: 2, md: 3 },
        }}
      >
        {/* Left: greeting */}
        <Box>
          <Typography
            sx={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              fontSize: "1rem",
              color: "#111827",
              lineHeight: 1.2,
            }}
          >
            Welcome back, {user?.name?.split(" ")[0] || "User"}! 👋
          </Typography>
          <Typography
            sx={{
              fontSize: "0.72rem",
              color: "#9ca3af",
              mt: 0.2,
            }}
          >
            Here's what's happening with your support tickets.
          </Typography>
        </Box>

        {/* Right: actions */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          {/* Notification bell */}
          <Tooltip title="Notifications">
            <IconButton
              sx={{
                width: 38,
                height: 38,
                bgcolor: "#f3f4f6",
                borderRadius: "10px",
                "&:hover": { bgcolor: "#e5e7eb" },
              }}
            >
              <Badge
                badgeContent={2}
                sx={{
                  "& .MuiBadge-badge": {
                    bgcolor: "#6C4CF1",
                    color: "white",
                    fontSize: "0.6rem",
                    minWidth: 16,
                    height: 16,
                    borderRadius: "8px",
                  },
                }}
              >
                <NotificationsRounded sx={{ fontSize: 20, color: "#374151" }} />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* User pill */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              px: 1.5,
              py: 0.75,
              borderRadius: "12px",
              bgcolor: "#f3f4f6",
              cursor: "pointer",
              transition: "all 0.2s",
              "&:hover": { bgcolor: "#e5e7eb" },
            }}
          >
            <Avatar
              sx={{
                width: 28,
                height: 28,
                background: "linear-gradient(135deg, #6C4CF1, #a78bfa)",
                fontSize: "0.75rem",
                fontWeight: 700,
              }}
            >
              {user?.name?.charAt(0) || "U"}
            </Avatar>
            <Typography
              sx={{
                fontSize: "0.825rem",
                fontWeight: 600,
                color: "#111827",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {user?.name || "User"}
            </Typography>
            <KeyboardArrowDownRounded
              sx={{ fontSize: 16, color: "#6b7280" }}
            />
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;