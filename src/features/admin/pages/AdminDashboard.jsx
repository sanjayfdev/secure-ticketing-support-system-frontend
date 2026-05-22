import {
  Box,
  Button,
  Chip,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  alpha,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  ConfirmationNumberRounded,
  ErrorOutlineRounded,
  CheckCircleOutlineRounded,
  TrendingUpRounded,
  SearchRounded,
  EditRounded,
  PeopleRounded,
  CloseRounded,
} from "@mui/icons-material";
import { useState } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";

const stats = [
  {
    title: "Total Tickets",
    value: 18,
    icon: <ConfirmationNumberRounded />,
    color: "#6C4CF1",
    bg: "#ede9fe",
  },
  {
    title: "Open",
    value: 6,
    icon: <ErrorOutlineRounded />,
    color: "#f59e0b",
    bg: "#fef3c7",
  },
  {
    title: "In Progress",
    value: 7,
    icon: <TrendingUpRounded />,
    color: "#3b82f6",
    bg: "#dbeafe",
  },
  {
    title: "Resolved",
    value: 5,
    icon: <CheckCircleOutlineRounded />,
    color: "#10b981",
    bg: "#d1fae5",
  },
];

const initialTickets = [
  {
    id: 1,
    subject: "Unable to access course videos",
    user: "john.doe@email.com",
    category: "Technical Issue",
    status: "Open",
    date: "May 24, 2025",
  },
  {
    id: 2,
    subject: "Payment not reflecting",
    user: "alex.kim@email.com",
    category: "Payment Issue",
    status: "In Progress",
    date: "May 23, 2025",
  },
  {
    id: 3,
    subject: "Certificate not generated",
    user: "sara.lee@email.com",
    category: "Certification",
    status: "Resolved",
    date: "May 22, 2025",
  },
  {
    id: 4,
    subject: "Course content mismatch",
    user: "rohit.sharma@email.com",
    category: "Content Issue",
    status: "Open",
    date: "May 21, 2025",
  },
  {
    id: 5,
    subject: "Need help with assignment",
    user: "priya.p@email.com",
    category: "General Query",
    status: "In Progress",
    date: "May 20, 2025",
  },
];

const statusConfig = {
  Open: { color: "#f59e0b", bg: "#fef3c7" },
  "In Progress": { color: "#3b82f6", bg: "#dbeafe" },
  Resolved: { color: "#10b981", bg: "#d1fae5" },
};

const AdminDashboardPage = () => {
  const [tickets, setTickets] = useState(initialTickets);
  const [filterStatus, setFilterStatus] = useState("All Status");
  const [filterCategory, setFilterCategory] = useState("All Categories");
  const [search, setSearch] = useState("");
  const [editTicket, setEditTicket] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [adminNote, setAdminNote] = useState("");

  const filteredTickets = tickets.filter((t) => {
    const matchStatus =
      filterStatus === "All Status" || t.status === filterStatus;
    const matchCat =
      filterCategory === "All Categories" || t.category === filterCategory;
    const matchSearch =
      t.subject.toLowerCase().includes(search.toLowerCase()) ||
      t.user.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchCat && matchSearch;
  });

  const handleEdit = (ticket) => {
    setEditTicket(ticket);
    setNewStatus(ticket.status);
    setAdminNote("");
  };

  const handleUpdate = () => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === editTicket.id ? { ...t, status: newStatus } : t
      )
    );
    setEditTicket(null);
  };

  return (
    <DashboardLayout>
      {/* Page title */}
      <Box mb={3.5}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 0.5 }}>
          <Typography
            variant="h5"
            sx={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              color: "#111827",
              letterSpacing: "-0.02em",
            }}
          >
            Admin Dashboard
          </Typography>
          <Chip
            icon={<PeopleRounded sx={{ fontSize: "14px !important" }} />}
            label="Admin"
            size="small"
            sx={{
              bgcolor: "#ede9fe",
              color: "#6C4CF1",
              fontWeight: 700,
              fontSize: "0.68rem",
              height: 22,
              border: "1px solid rgba(108,76,241,0.25)",
            }}
          />
        </Box>
        <Typography sx={{ fontSize: "0.85rem", color: "#9ca3af" }}>
          Manage all support tickets across the platform
        </Typography>
      </Box>

      {/* Stats */}
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
                  alignItems: "center",
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

      {/* All Tickets */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: "18px",
          border: "1px solid rgba(0,0,0,0.06)",
          bgcolor: "white",
          overflow: "hidden",
        }}
      >
        {/* Filters */}
        <Box
          sx={{
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
              mb: 2,
            }}
          >
            All Tickets
          </Typography>
          <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              size="small"
              sx={{
                borderRadius: "10px",
                fontSize: "0.82rem",
                minWidth: 130,
                bgcolor: "#f9fafb",
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "1px solid rgba(0,0,0,0.08)",
                },
              }}
            >
              {["All Status", "Open", "In Progress", "Resolved"].map((s) => (
                <MenuItem key={s} value={s} sx={{ fontSize: "0.82rem" }}>
                  {s}
                </MenuItem>
              ))}
            </Select>

            <Select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              size="small"
              sx={{
                borderRadius: "10px",
                fontSize: "0.82rem",
                minWidth: 155,
                bgcolor: "#f9fafb",
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "1px solid rgba(0,0,0,0.08)",
                },
              }}
            >
              {[
                "All Categories",
                "Technical Issue",
                "Payment Issue",
                "Certification",
                "Content Issue",
                "General Query",
              ].map((c) => (
                <MenuItem key={c} value={c} sx={{ fontSize: "0.82rem" }}>
                  {c}
                </MenuItem>
              ))}
            </Select>

            <TextField
              placeholder="Search tickets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRounded sx={{ fontSize: 18, color: "#9ca3af" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                flex: 1,
                minWidth: 200,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  bgcolor: "#f9fafb",
                  fontSize: "0.82rem",
                  "& fieldset": { border: "1px solid rgba(0,0,0,0.08)" },
                },
              }}
            />
          </Box>
        </Box>

        {/* Table */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f9fafb" }}>
                {["#", "Subject", "User", "Category", "Status", "Created At", "Actions"].map(
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
              {filteredTickets.map((ticket, idx) => {
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
                    <TableCell sx={{ color: "#9ca3af", fontSize: "0.82rem", py: 2 }}>
                      {idx + 1}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 500,
                        fontSize: "0.85rem",
                        color: "#111827",
                        maxWidth: 180,
                      }}
                    >
                      {ticket.subject}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Avatar
                          sx={{
                            width: 26,
                            height: 26,
                            fontSize: "0.68rem",
                            fontWeight: 700,
                            background: "linear-gradient(135deg, #6C4CF1, #a78bfa)",
                          }}
                        >
                          {ticket.user.charAt(0).toUpperCase()}
                        </Avatar>
                        <Typography sx={{ fontSize: "0.8rem", color: "#6b7280" }}>
                          {ticket.user}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontSize: "0.82rem", color: "#6b7280" }}>
                      {ticket.category}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={ticket.status}
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
                    <TableCell sx={{ fontSize: "0.82rem", color: "#9ca3af" }}>
                      {ticket.date}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(ticket)}
                        sx={{
                          borderRadius: "8px",
                          color: "#9ca3af",
                          "&:hover": { bgcolor: "#ede9fe", color: "#6C4CF1" },
                        }}
                      >
                        <EditRounded sx={{ fontSize: 17 }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Update Status Dialog */}
      <Dialog
        open={!!editTicket}
        onClose={() => setEditTicket(null)}
        PaperProps={{
          sx: {
            borderRadius: "18px",
            p: 0.5,
            minWidth: 380,
            boxShadow: "0 24px 60px rgba(0,0,0,0.15)",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            pb: 1,
            fontFamily: "'Syne', sans-serif",
            fontWeight: 700,
            fontSize: "1.05rem",
            color: "#111827",
          }}
        >
          Update Ticket Status
          <IconButton
            size="small"
            onClick={() => setEditTicket(null)}
            sx={{ color: "#9ca3af" }}
          >
            <CloseRounded fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 1 }}>
          <Typography
            sx={{
              fontSize: "0.78rem",
              fontWeight: 600,
              color: "#374151",
              mb: 0.75,
            }}
          >
            Status *
          </Typography>
          <Select
            fullWidth
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            size="small"
            sx={{
              borderRadius: "10px",
              fontSize: "0.85rem",
              mb: 2.5,
              "& .MuiOutlinedInput-notchedOutline": {
                border: "1px solid rgba(0,0,0,0.12)",
              },
            }}
          >
            {["Open", "In Progress", "Resolved"].map((s) => (
              <MenuItem key={s} value={s} sx={{ fontSize: "0.85rem" }}>
                {s}
              </MenuItem>
            ))}
          </Select>

          <Typography
            sx={{
              fontSize: "0.78rem",
              fontWeight: 600,
              color: "#374151",
              mb: 0.75,
            }}
          >
            Admin Note
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="Add a note for the user..."
            value={adminNote}
            onChange={(e) => setAdminNote(e.target.value)}
            inputProps={{ maxLength: 1000 }}
            helperText={`${adminNote.length}/1000`}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
                fontSize: "0.85rem",
                "& fieldset": { border: "1px solid rgba(0,0,0,0.12)" },
              },
              "& .MuiFormHelperText-root": {
                textAlign: "right",
                fontSize: "0.7rem",
                color: "#9ca3af",
              },
            }}
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button
            onClick={() => setEditTicket(null)}
            variant="outlined"
            sx={{
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.85rem",
              color: "#374151",
              borderColor: "rgba(0,0,0,0.15)",
              "&:hover": { borderColor: "rgba(0,0,0,0.3)", bgcolor: "#f9fafb" },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdate}
            variant="contained"
            sx={{
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.85rem",
              background: "linear-gradient(135deg, #6C4CF1, #8b5cf6)",
              boxShadow: "0 4px 12px rgba(108,76,241,0.35)",
              "&:hover": {
                background: "linear-gradient(135deg, #5b3de0, #7c3aed)",
              },
            }}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
};

export default AdminDashboardPage;