import {
  Box,
  Button,
  Chip,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  alpha,
} from "@mui/material";
import {
  AddRounded,
  ConfirmationNumberRounded,
  ErrorOutlineRounded,
  CheckCircleOutlineRounded,
  VisibilityRounded,
  TrendingUpRounded,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { useEffect, useState } from "react";
import { getMyTicketsApi } from "../api/ticketApi";

const stats = [
  {
    title: "Total Tickets",
    value: 5,
    icon: <ConfirmationNumberRounded />,
    color: "#6C4CF1",
    bg: "#ede9fe",
    trend: "+2 this week",
  },
  {
    title: "Open",
    value: 2,
    icon: <ErrorOutlineRounded />,
    color: "#f59e0b",
    bg: "#fef3c7",
    trend: "Needs attention",
  },
  {
    title: "In Progress",
    value: 2,
    icon: <TrendingUpRounded />,
    color: "#3b82f6",
    bg: "#dbeafe",
    trend: "Being handled",
  },
  {
    title: "Resolved",
    value: 1,
    icon: <CheckCircleOutlineRounded />,
    color: "#10b981",
    bg: "#d1fae5",
    trend: "All clear",
  },
];

const tickets = [
  {
    id: 1,
    subject: "Unable to access course videos",
    category: "Technical Issue",
    status: "Open",
    date: "May 24, 2025",
  },
  {
    id: 2,
    subject: "Payment not reflecting in dashboard",
    category: "Payment Issue",
    status: "In Progress",
    date: "May 23, 2025",
  },
  {
    id: 3,
    subject: "Certificate not generated",
    category: "Certification",
    status: "Resolved",
    date: "May 22, 2025",
  },
  {
    id: 4,
    subject: "Course content mismatch",
    category: "Content Issue",
    status: "Open",
    date: "May 21, 2025",
  },
  {
    id: 5,
    subject: "Need help with assignment",
    category: "General Query",
    status: "In Progress",
    date: "May 20, 2025",
  },
];
const statusConfig = {
  Open: { color: "#f59e0b", bg: "#fef3c7", label: "Open" },
  "In Progress": { color: "#3b82f6", bg: "#dbeafe", label: "In Progress" },
  Resolved: { color: "#10b981", bg: "#d1fae5", label: "Resolved" },
};

const DashboardPage = () => {
  const [ticketData, setTicketData] = useState(tickets);
  
  const fetchTickets = async () => {
  try {
    const data = await getMyTicketsApi();
    setTicketData(data.tickets);
  } catch (error) {
    console.error("Error fetching tickets:", error);
  }
};

// useEffect(()=>{
// fetchTickets();
// },[])

  return (
    <>
      {/* Header row */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3.5,
        }}
      >
        <Box>
          <Typography
            variant="h5"
            sx={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              color: "#111827",
              letterSpacing: "-0.02em",
            }}
          >
            Dashboard
          </Typography>
          <Typography sx={{ fontSize: "0.85rem", color: "#9ca3af", mt: 0.3 }}>
            Manage and track your support tickets
          </Typography>
        </Box>
      </Box>

      {/* Stat cards */}
      <Grid container spacing={2.5} mb={3.5}>
        {stats.map((item) => (
          <Grid item xs={12} sm={6} md={3} key={item.title}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: "16px",
                border: "1px solid rgba(0,0,0,0.06)",
                bgcolor: "white",
                transition: "all 0.25s ease",
                "&:hover": {
                  transform: "translateY(-3px)",
                  boxShadow: "0 12px 32px rgba(0,0,0,0.08)",
                  borderColor: "transparent",
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography
                    sx={{
                      fontSize: "0.78rem",
                      fontWeight: 500,
                      color: "#9ca3af",
                      mb: 0.75,
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    {item.title}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "2rem",
                      fontWeight: 800,
                      color: "#111827",
                      fontFamily: "'Syne', sans-serif",
                      lineHeight: 1,
                    }}
                  >
                    {item.value}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "0.7rem",
                      color: item.color,
                      mt: 0.75,
                      fontWeight: 500,
                    }}
                  >
                    {item.trend}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: "12px",
                    bgcolor: item.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: item.color,
                    flexShrink: 0,
                    "& svg": { fontSize: 22 },
                  }}
                >
                  {item.icon}
                </Box>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Tickets table */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: "18px",
          border: "1px solid rgba(0,0,0,0.06)",
          bgcolor: "white",
          overflow: "hidden",
        }}
      >
        {/* Table header row */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 3,
            py: 2.5,
            borderBottom: "1px solid rgba(0,0,0,0.05)",
          }}
        >
          <Typography
            sx={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              fontSize: "1rem",
              color: "#111827",
            }}
          >
            My Tickets
          </Typography>
          <Button
            component={Link}
            to="/create-ticket"
            variant="contained"
            startIcon={<AddRounded />}
            size="small"
            sx={{
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.8rem",
              background: "linear-gradient(135deg, #6C4CF1, #8b5cf6)",
              boxShadow: "0 4px 12px rgba(108,76,241,0.35)",
              px: 2,
              py: 0.9,
              "&:hover": {
                background: "linear-gradient(135deg, #5b3de0, #7c3aed)",
                boxShadow: "0 4px 18px rgba(108,76,241,0.45)",
              },
            }}
          >
            Create Ticket
          </Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f9fafb" }}>
                {["#", "Subject", "Category", "Status", "Created At", "Actions"].map(
                  (h) => (
                    <TableCell
                      key={h}
                      sx={{
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        color: "#6b7280",
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        py: 1.5,
                        borderBottom: "1px solid rgba(0,0,0,0.06)",
                      }}
                    >
                      {h}
                    </TableCell>
                  )
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {ticketData && ticketData.map((ticket, idx) => {
                const s = statusConfig[ticket.status];
                return (
                  <TableRow
                    key={ticket.id}
                    sx={{
                      "&:hover": { bgcolor: "#f9fafb" },
                      "&:last-child td": { border: 0 },
                      transition: "background 0.15s",
                    }}
                  >
                    <TableCell
                      sx={{ color: "#9ca3af", fontSize: "0.82rem", py: 2 }}
                    >
                      {idx + 1}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 500,
                        fontSize: "0.85rem",
                        color: "#111827",
                        maxWidth: 200,
                      }}
                    >
                      {ticket.subject}
                    </TableCell>
                    <TableCell
                      sx={{ fontSize: "0.82rem", color: "#6b7280" }}
                    >
                      {ticket.category}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={s.label}
                        size="small"
                        sx={{
                          bgcolor: s.bg,
                          color: s.color,
                          fontWeight: 600,
                          fontSize: "0.72rem",
                          height: 24,
                          border: `1px solid ${alpha(s.color, 0.2)}`,
                          "& .MuiChip-label": { px: 1.2 },
                        }}
                      />
                    </TableCell>
                    <TableCell
                      sx={{ fontSize: "0.82rem", color: "#9ca3af" }}
                    >
                      {ticket.date}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        sx={{
                          color: "#9ca3af",
                          borderRadius: "8px",
                          "&:hover": {
                            bgcolor: "#ede9fe",
                            color: "#6C4CF1",
                          },
                        }}
                      >
                        <VisibilityRounded sx={{ fontSize: 18 }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  );
};

export default DashboardPage;