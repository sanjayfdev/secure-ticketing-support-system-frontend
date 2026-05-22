import {
  alpha,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Drawer,
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
} from "@mui/material";
import {
  AddRounded,
  AttachFileRounded,
  CalendarTodayRounded,
  CategoryRounded,
  CheckCircleOutlineRounded,
  CloseRounded,
  ConfirmationNumberOutlined,
  ErrorOutlineRounded,
  InboxRounded,
  SearchRounded,
  TrendingUpRounded,
  VisibilityRounded,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyTicketsApi } from "../api/ticketApi";

const statusConfig = {
  Open: { color: "#f59e0b", bg: "#fef3c7", icon: <ErrorOutlineRounded sx={{ fontSize: 14 }} /> },
  "In Progress": { color: "#3b82f6", bg: "#dbeafe", icon: <TrendingUpRounded sx={{ fontSize: 14 }} /> },
  Resolved: { color: "#10b981", bg: "#d1fae5", icon: <CheckCircleOutlineRounded sx={{ fontSize: 14 }} /> },
};

const STATUSES = ["All", "Open", "In Progress", "Resolved"];

const MyTicketsPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [selected, setSelected] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const data = await getMyTicketsApi();
        // support both {tickets: [...]} and plain array response shapes
        setTickets(Array.isArray(data) ? data : data?.tickets ?? []);
      } catch (err) {
        setError("Failed to load tickets. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const filtered = tickets.filter((t) => {
    const matchSearch =
      t.subject?.toLowerCase().includes(search.toLowerCase()) ||
      t.category?.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      filterStatus === "All" || t.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const openDetail = (ticket) => {
    setSelected(ticket);
    setDrawerOpen(true);
  };

  // Summary counts
  const counts = tickets.reduce(
    (acc, t) => {
      acc.total++;
      if (t.status === "Open") acc.open++;
      if (t.status === "In Progress") acc.inProgress++;
      if (t.status === "Resolved") acc.resolved++;
      return acc;
    },
    { total: 0, open: 0, inProgress: 0, resolved: 0 }
  );

  const summaryCards = [
    { label: "Total", value: counts.total, color: "#6C4CF1", bg: "#ede9fe" },
    { label: "Open", value: counts.open, color: "#f59e0b", bg: "#fef3c7" },
    { label: "In Progress", value: counts.inProgress, color: "#3b82f6", bg: "#dbeafe" },
    { label: "Resolved", value: counts.resolved, color: "#10b981", bg: "#d1fae5" },
  ];

  return (
    <>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          mb: 3.5,
          flexWrap: "wrap",
          gap: 2,
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
            My Tickets
          </Typography>
          <Typography sx={{ fontSize: "0.85rem", color: "#9ca3af", mt: 0.3 }}>
            View and track all your submitted support requests
          </Typography>
        </Box>
        <Button
          component={Link}
          to="/create-ticket"
          variant="contained"
          startIcon={<AddRounded />}
          sx={{
            borderRadius: "10px",
            textTransform: "none",
            fontWeight: 600,
            fontSize: "0.875rem",
            background: "linear-gradient(135deg, #6C4CF1, #8b5cf6)",
            boxShadow: "0 4px 12px rgba(108,76,241,0.35)",
            px: 2.5,
            "&:hover": {
              background: "linear-gradient(135deg, #5b3de0, #7c3aed)",
              boxShadow: "0 4px 18px rgba(108,76,241,0.45)",
            },
          }}
        >
          New Ticket
        </Button>
      </Box>

      {/* Summary mini-cards */}
      <Box sx={{ display: "flex", gap: 2, mb: 3.5, flexWrap: "wrap" }}>
        {summaryCards.map((c) => (
          <Box
            key={c.label}
            onClick={() => setFilterStatus(c.label === "Total" ? "All" : c.label)}
            sx={{
              flex: "1 1 120px",
              p: 2,
              borderRadius: "14px",
              bgcolor: "white",
              border: `1px solid ${
                (filterStatus === c.label || (c.label === "Total" && filterStatus === "All"))
                  ? alpha(c.color, 0.4)
                  : "rgba(0,0,0,0.06)"
              }`,
              cursor: "pointer",
              transition: "all 0.2s",
              boxShadow:
                (filterStatus === c.label || (c.label === "Total" && filterStatus === "All"))
                  ? `0 4px 14px ${alpha(c.color, 0.18)}`
                  : "none",
              "&:hover": {
                borderColor: alpha(c.color, 0.35),
                boxShadow: `0 4px 14px ${alpha(c.color, 0.14)}`,
              },
            }}
          >
            <Typography
              sx={{
                fontSize: "1.6rem",
                fontWeight: 800,
                fontFamily: "'Syne', sans-serif",
                color: c.color,
                lineHeight: 1,
              }}
            >
              {loading ? "—" : c.value}
            </Typography>
            <Typography
              sx={{ fontSize: "0.75rem", color: "#9ca3af", mt: 0.5, fontWeight: 500 }}
            >
              {c.label}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Table card */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: "18px",
          border: "1px solid rgba(0,0,0,0.06)",
          bgcolor: "white",
          overflow: "hidden",
        }}
      >
        {/* Filters bar */}
        <Box
          sx={{
            px: 3,
            py: 2,
            borderBottom: "1px solid rgba(0,0,0,0.05)",
            display: "flex",
            gap: 1.5,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <TextField
            placeholder="Search tickets…"
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
                "&:hover fieldset": { borderColor: "#6C4CF1" },
                "&.Mui-focused fieldset": { borderColor: "#6C4CF1" },
              },
            }}
          />

          {/* Status filter pills */}
          <Box sx={{ display: "flex", gap: 0.75 }}>
            {STATUSES.map((s) => {
              const active = filterStatus === s;
              const cfg = statusConfig[s];
              return (
                <Box
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  sx={{
                    px: 1.5,
                    py: 0.6,
                    borderRadius: "8px",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.15s",
                    bgcolor: active
                      ? s === "All"
                        ? alpha("#6C4CF1", 0.1)
                        : alpha(cfg?.color, 0.1)
                      : "#f3f4f6",
                    color: active
                      ? s === "All"
                        ? "#6C4CF1"
                        : cfg?.color
                      : "#9ca3af",
                    border: active
                      ? `1px solid ${alpha(s === "All" ? "#6C4CF1" : cfg?.color, 0.3)}`
                      : "1px solid transparent",
                    "&:hover": {
                      bgcolor: alpha(s === "All" ? "#6C4CF1" : cfg?.color || "#6C4CF1", 0.08),
                    },
                  }}
                >
                  {s}
                </Box>
              );
            })}
          </Box>
        </Box>

        {/* Table content */}
        {loading ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              py: 8,
              gap: 1.5,
            }}
          >
            <CircularProgress size={22} sx={{ color: "#6C4CF1" }} />
            <Typography sx={{ fontSize: "0.875rem", color: "#9ca3af" }}>
              Loading tickets…
            </Typography>
          </Box>
        ) : error ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography sx={{ fontSize: "0.875rem", color: "#ef4444" }}>
              {error}
            </Typography>
          </Box>
        ) : filtered.length === 0 ? (
          <EmptyState hasTickets={tickets.length > 0} />
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "#f9fafb" }}>
                  {["#", "Subject", "Category", "Status", "Created At", ""].map(
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
                {filtered.map((ticket, idx) => {
                  const s = statusConfig[ticket.status] ?? statusConfig["Open"];
                  return (
                    <TableRow
                      key={ticket._id ?? ticket.id}
                      sx={{
                        "&:hover": { bgcolor: "#fafafa" },
                        "&:last-child td": { border: 0 },
                        transition: "background 0.15s",
                        cursor: "pointer",
                      }}
                      onClick={() => openDetail(ticket)}
                    >
                      <TableCell
                        sx={{
                          color: "#9ca3af",
                          fontSize: "0.82rem",
                          py: 2,
                          width: 40,
                        }}
                      >
                        {idx + 1}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 500,
                          fontSize: "0.85rem",
                          color: "#111827",
                          maxWidth: 220,
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: "0.85rem",
                            fontWeight: 600,
                            color: "#111827",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: 220,
                          }}
                        >
                          {ticket.subject}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ fontSize: "0.82rem", color: "#6b7280" }}>
                        {ticket.category}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={ticket.status}
                          size="small"
                          icon={
                            <Box
                              sx={{
                                color: `${s.color} !important`,
                                display: "flex",
                                ml: "6px !important",
                              }}
                            >
                              {s.icon}
                            </Box>
                          }
                          sx={{
                            bgcolor: s.bg,
                            color: s.color,
                            fontWeight: 600,
                            fontSize: "0.72rem",
                            height: 24,
                            border: `1px solid ${alpha(s.color, 0.2)}`,
                            "& .MuiChip-label": { px: 1, pl: 0.5 },
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ fontSize: "0.82rem", color: "#9ca3af" }}>
                        {formatDate(ticket.createdAt ?? ticket.date)}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          sx={{
                            borderRadius: "8px",
                            color: "#9ca3af",
                            "&:hover": { bgcolor: "#ede9fe", color: "#6C4CF1" },
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            openDetail(ticket);
                          }}
                        >
                          <VisibilityRounded sx={{ fontSize: 17 }} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Detail Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: "100vw", sm: 420 },
            bgcolor: "#f8f9fc",
            boxShadow: "-8px 0 40px rgba(0,0,0,0.1)",
          },
        }}
      >
        {selected && (
          <TicketDetail
            ticket={selected}
            onClose={() => setDrawerOpen(false)}
          />
        )}
      </Drawer>
    </>
  );
};

// ── Ticket Detail Panel ──────────────────────────────────────────────────────

const TicketDetail = ({ ticket, onClose }) => {
  const s = statusConfig[ticket.status] ?? statusConfig["Open"];

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <Box
        sx={{
          px: 3,
          py: 2.5,
          bgcolor: "white",
          borderBottom: "1px solid rgba(0,0,0,0.06)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: "10px",
              bgcolor: "#ede9fe",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ConfirmationNumberOutlined
              sx={{ fontSize: 20, color: "#6C4CF1" }}
            />
          </Box>
          <Box>
            <Typography
              sx={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 700,
                fontSize: "0.95rem",
                color: "#111827",
              }}
            >
              Ticket Details
            </Typography>
            <Typography sx={{ fontSize: "0.7rem", color: "#9ca3af" }}>
              #{(ticket._id ?? ticket.id ?? "").toString().slice(-6).toUpperCase()}
            </Typography>
          </Box>
        </Box>
        <IconButton
          size="small"
          onClick={onClose}
          sx={{
            color: "#9ca3af",
            bgcolor: "#f3f4f6",
            borderRadius: "8px",
            "&:hover": { bgcolor: "#e5e7eb" },
          }}
        >
          <CloseRounded fontSize="small" />
        </IconButton>
      </Box>

      {/* Body */}
      <Box sx={{ flex: 1, overflow: "auto", p: 3 }}>
        {/* Status badge */}
        <Box sx={{ mb: 3 }}>
          <Chip
            label={ticket.status}
            sx={{
              bgcolor: s.bg,
              color: s.color,
              fontWeight: 700,
              fontSize: "0.78rem",
              height: 28,
              border: `1px solid ${alpha(s.color, 0.25)}`,
              "& .MuiChip-label": { px: 1.5 },
            }}
          />
        </Box>

        {/* Subject */}
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            borderRadius: "14px",
            border: "1px solid rgba(0,0,0,0.06)",
            bgcolor: "white",
            mb: 2,
          }}
        >
          <Typography
            sx={{
              fontSize: "0.72rem",
              fontWeight: 700,
              color: "#9ca3af",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              mb: 0.75,
            }}
          >
            Subject
          </Typography>
          <Typography
            sx={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              fontSize: "1rem",
              color: "#111827",
              lineHeight: 1.4,
            }}
          >
            {ticket.subject}
          </Typography>
        </Paper>

        {/* Meta row */}
        <Box sx={{ display: "flex", gap: 1.5, mb: 2 }}>
          <DetailMeta
            icon={<CategoryRounded sx={{ fontSize: 15 }} />}
            label="Category"
            value={ticket.category}
          />
          <DetailMeta
            icon={<CalendarTodayRounded sx={{ fontSize: 15 }} />}
            label="Created"
            value={formatDate(ticket.createdAt ?? ticket.date)}
          />
        </Box>

        {/* Description */}
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            borderRadius: "14px",
            border: "1px solid rgba(0,0,0,0.06)",
            bgcolor: "white",
            mb: 2,
          }}
        >
          <Typography
            sx={{
              fontSize: "0.72rem",
              fontWeight: 700,
              color: "#9ca3af",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              mb: 1,
            }}
          >
            Description
          </Typography>
          <Typography
            sx={{
              fontSize: "0.875rem",
              color: "#374151",
              lineHeight: 1.7,
              whiteSpace: "pre-wrap",
            }}
          >
            {ticket.description || "No description provided."}
          </Typography>
        </Paper>

        {/* Attachment */}
        {ticket.attachment && (
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: "14px",
              border: "1px solid rgba(0,0,0,0.06)",
              bgcolor: "white",
              mb: 2,
              display: "flex",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: "8px",
                bgcolor: "#ede9fe",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <AttachFileRounded sx={{ fontSize: 18, color: "#6C4CF1" }} />
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                sx={{
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  color: "#111827",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {ticket.attachment}
              </Typography>
              <Typography sx={{ fontSize: "0.7rem", color: "#9ca3af" }}>
                Attachment
              </Typography>
            </Box>
          </Paper>
        )}

        {/* Admin note */}
        {ticket.adminNote && (
          <>
            <Divider sx={{ my: 2, borderColor: "rgba(0,0,0,0.06)" }} />
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: "14px",
                bgcolor: "#f0fdf4",
                border: "1px solid rgba(16,185,129,0.2)",
              }}
            >
              <Typography
                sx={{
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  color: "#10b981",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  mb: 0.75,
                }}
              >
                Admin Response
              </Typography>
              <Typography
                sx={{
                  fontSize: "0.875rem",
                  color: "#065f46",
                  lineHeight: 1.6,
                }}
              >
                {ticket.adminNote}
              </Typography>
            </Paper>
          </>
        )}
      </Box>
    </Box>
  );
};

// ── Sub-components ───────────────────────────────────────────────────────────

const DetailMeta = ({ icon, label, value }) => (
  <Paper
    elevation={0}
    sx={{
      flex: 1,
      p: 1.75,
      borderRadius: "12px",
      border: "1px solid rgba(0,0,0,0.06)",
      bgcolor: "white",
    }}
  >
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: 0.5, color: "#9ca3af" }}>
      {icon}
      <Typography
        sx={{
          fontSize: "0.68rem",
          fontWeight: 700,
          color: "#9ca3af",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        {label}
      </Typography>
    </Box>
    <Typography sx={{ fontSize: "0.82rem", fontWeight: 600, color: "#374151" }}>
      {value}
    </Typography>
  </Paper>
);

const EmptyState = ({ hasTickets }) => (
  <Box
    sx={{
      textAlign: "center",
      py: 9,
      px: 3,
    }}
  >
    <Box
      sx={{
        width: 60,
        height: 60,
        borderRadius: "16px",
        bgcolor: "#f3f4f6",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        mx: "auto",
        mb: 2,
      }}
    >
      <InboxRounded sx={{ fontSize: 30, color: "#d1d5db" }} />
    </Box>
    <Typography
      sx={{
        fontFamily: "'Syne', sans-serif",
        fontWeight: 700,
        fontSize: "1rem",
        color: "#374151",
        mb: 0.5,
      }}
    >
      {hasTickets ? "No matching tickets" : "No tickets yet"}
    </Typography>
    <Typography sx={{ fontSize: "0.82rem", color: "#9ca3af", mb: 2.5 }}>
      {hasTickets
        ? "Try adjusting your search or filters"
        : "Submit your first support request to get started"}
    </Typography>
    {!hasTickets && (
      <Button
        component={Link}
        to="/create-ticket"
        variant="contained"
        startIcon={<AddRounded />}
        sx={{
          borderRadius: "10px",
          textTransform: "none",
          fontWeight: 600,
          fontSize: "0.82rem",
          background: "linear-gradient(135deg, #6C4CF1, #8b5cf6)",
          boxShadow: "0 4px 12px rgba(108,76,241,0.3)",
          "&:hover": {
            background: "linear-gradient(135deg, #5b3de0, #7c3aed)",
          },
        }}
      >
        Create Ticket
      </Button>
    )}
  </Box>
);

// ── Helpers ──────────────────────────────────────────────────────────────────

const formatDate = (val) => {
  if (!val) return "—";
  const d = new Date(val);
  if (isNaN(d)) return val; // already a string like "May 24, 2025"
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default MyTicketsPage;