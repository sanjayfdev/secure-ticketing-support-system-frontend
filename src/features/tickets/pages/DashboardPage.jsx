import {
  alpha,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Drawer,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
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
  ConfirmationNumberRounded,
  ErrorOutlineRounded,
  InboxRounded,
  SearchRounded,
  TrendingUpRounded,
  VisibilityRounded,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyTicketsApi } from "../api/ticketApi";

/* ─── Constants ─────────────────────────────────────────────── */

const statusConfig = {
  Open: {
    color: "#d97706",
    bg: "#fffbeb",
    border: "#fde68a",
    label: "Open",
    icon: <ErrorOutlineRounded sx={{ fontSize: 13 }} />,
  },
  "In Progress": {
    color: "#2563eb",
    bg: "#eff6ff",
    border: "#bfdbfe",
    label: "In Progress",
    icon: <TrendingUpRounded sx={{ fontSize: 13 }} />,
  },
  Resolved: {
    color: "#059669",
    bg: "#f0fdf4",
    border: "#a7f3d0",
    label: "Resolved",
    icon: <CheckCircleOutlineRounded sx={{ fontSize: 13 }} />,
  },
};

const FILTER_TABS = ["All", "Open", "In Progress", "Resolved"];

const formatDate = (val) => {
  if (!val) return "—";
  const d = new Date(val);
  if (isNaN(d)) return val;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

/* ─── Main Component ─────────────────────────────────────────── */

const DashboardPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [selected, setSelected] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await getMyTicketsApi();
        setTickets(data.tickets ?? data.data ?? []);
      } catch (err) {
        setError("Failed to load tickets.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  /* counts */
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

  const statCards = [
    { title: "Total Tickets", value: counts.total, icon: <ConfirmationNumberRounded />, color: "#7c3aed", bg: "#f5f3ff", border: "#ddd6fe", filter: "All" },
    { title: "Open", value: counts.open, icon: <ErrorOutlineRounded />, color: "#d97706", bg: "#fffbeb", border: "#fde68a", filter: "Open" },
    { title: "In Progress", value: counts.inProgress, icon: <TrendingUpRounded />, color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe", filter: "In Progress" },
    { title: "Resolved", value: counts.resolved, icon: <CheckCircleOutlineRounded />, color: "#059669", bg: "#f0fdf4", border: "#a7f3d0", filter: "Resolved" },
  ];

  /* filtered tickets */
  const filtered = tickets.filter((t) => {
    const q = search.toLowerCase();
    const matchSearch = t.subject?.toLowerCase().includes(q) || t.category?.toLowerCase().includes(q);
    const matchStatus = filterStatus === "All" || t.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const openDetail = (ticket) => { setSelected(ticket); setDrawerOpen(true); };

  return (
    <Box sx={{ fontFamily: "'Plus Jakarta Sans', 'DM Sans', sans-serif" }}>

      {/* ── Page header ── */}
      <Box sx={{ display: "flex", alignItems: { xs: "flex-start", sm: "center" }, flexDirection: { xs: "column", sm: "row" }, justifyContent: "space-between", gap: 2, mb: 4 }}>
        <Box>
          <Typography variant="h5" sx={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.03em", fontSize: "1.6rem" }}>
            Dashboard
          </Typography>
          <Typography sx={{ fontSize: "0.83rem", color: "#94a3b8", mt: 0.4, fontWeight: 500 }}>
            Manage and track your support tickets
          </Typography>
        </Box>
        <Button
          component={Link}
          to="/create-ticket"
          variant="contained"
          startIcon={<AddRounded />}
          sx={{
            borderRadius: "12px",
            textTransform: "none",
            fontWeight: 700,
            fontSize: "0.82rem",
            fontFamily: "inherit",
            background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)",
            boxShadow: "0 4px 14px rgba(124,58,237,0.38)",
            px: 2.5,
            py: 1.1,
            "&:hover": {
              background: "linear-gradient(135deg, #6d28d9 0%, #5b21b6 100%)",
              boxShadow: "0 6px 20px rgba(124,58,237,0.45)",
              transform: "translateY(-1px)",
            },
            transition: "all 0.2s ease",
          }}
        >
          Create Ticket
        </Button>
      </Box>

      {/* ── Stat cards ── */}
      <Grid container spacing={2.5} mb={4}>
        {statCards.map((item) => {
          const isActive = filterStatus === item.filter || (item.filter === "All" && filterStatus === "All");
          return (
            <Grid item xs={6} sm={6} md={3} key={item.title}>
              <Paper
                elevation={0}
                onClick={() => setFilterStatus(item.filter)}
                sx={{
                  p: 2.5,
                  borderRadius: "16px",
                  border: `1.5px solid ${isActive ? alpha(item.color, 0.45) : "rgba(0,0,0,0.06)"}`,
                  bgcolor: isActive ? item.bg : "white",
                  cursor: "pointer",
                  transition: "all 0.22s ease",
                  boxShadow: isActive ? `0 6px 24px ${alpha(item.color, 0.15)}` : "none",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: `0 8px 28px ${alpha(item.color, 0.14)}`,
                    borderColor: alpha(item.color, 0.35),
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                  <Box>
                    <Typography sx={{ fontSize: "0.7rem", fontWeight: 700, color: "#94a3b8", mb: 0.8, letterSpacing: "0.05em", textTransform: "uppercase", fontFamily: "inherit" }}>
                      {item.title}
                    </Typography>
                    <Typography sx={{ fontSize: "2.2rem", fontWeight: 800, color: isActive ? item.color : "#0f172a", fontFamily: "inherit", lineHeight: 1 }}>
                      {loading ? "—" : item.value}
                    </Typography>
                  </Box>
                  <Box sx={{ width: 42, height: 42, borderRadius: "12px", bgcolor: isActive ? alpha(item.color, 0.15) : "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", color: item.color, flexShrink: 0, "& svg": { fontSize: 21 }, transition: "all 0.2s" }}>
                    {item.icon}
                  </Box>
                </Box>
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      {/* ── Tickets table card ── */}
      <Paper elevation={0} sx={{ borderRadius: "18px", border: "1.5px solid rgba(0,0,0,0.06)", bgcolor: "white", overflow: "hidden" }}>

        {/* Toolbar */}
        <Box sx={{ px: 3, py: 2.5, borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
          <Typography sx={{ fontFamily: "inherit", fontWeight: 800, fontSize: "1rem", color: "#0f172a", mr: "auto" }}>
            My Tickets
          </Typography>

          {/* Search */}
          <TextField
            size="small"
            placeholder="Search tickets…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRounded sx={{ fontSize: 17, color: "#94a3b8" }} />
                </InputAdornment>
              ),
              sx: {
                borderRadius: "10px",
                fontSize: "0.82rem",
                fontFamily: "inherit",
                bgcolor: "#f8fafc",
                "& fieldset": { borderColor: "rgba(0,0,0,0.08)" },
                "&:hover fieldset": { borderColor: "rgba(0,0,0,0.18)" },
              },
            }}
            sx={{ width: { xs: "100%", sm: 220 } }}
          />

          {/* Filter chips */}
          <Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap" }}>
            {FILTER_TABS.map((tab) => {
              const active = filterStatus === tab;
              return (
                <Box
                  key={tab}
                  onClick={() => setFilterStatus(tab)}
                  sx={{
                    px: 1.5, py: 0.55, borderRadius: "8px", fontSize: "0.75rem", fontWeight: 700,
                    cursor: "pointer", transition: "all 0.15s", fontFamily: "inherit",
                    bgcolor: active ? "#7c3aed" : "#f1f5f9",
                    color: active ? "white" : "#64748b",
                    "&:hover": { bgcolor: active ? "#6d28d9" : "#e2e8f0" },
                  }}
                >
                  {tab}
                </Box>
              );
            })}
          </Box>
        </Box>

        {/* Table */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#fafafa" }}>
                {["#", "Subject", "Category", "Status", "Created At", "Actions"].map((h) => (
                  <TableCell
                    key={h}
                    sx={{ fontSize: "0.68rem", fontWeight: 800, color: "#94a3b8", letterSpacing: "0.07em", textTransform: "uppercase", py: 1.5, borderBottom: "1px solid #f1f5f9", fontFamily: "inherit" }}
                  >
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} sx={{ textAlign: "center", py: 7, border: 0 }}>
                    <CircularProgress size={28} sx={{ color: "#7c3aed" }} />
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={6} sx={{ textAlign: "center", py: 6, color: "#ef4444", fontSize: "0.85rem", border: 0 }}>
                    {error}
                  </TableCell>
                </TableRow>
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} sx={{ border: 0 }}>
                    <EmptyState hasTickets={tickets.length > 0} />
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((ticket, idx) => {
                  const s = statusConfig[ticket.status] ?? statusConfig["Open"];
                  return (
                    <TableRow
                      key={ticket._id ?? ticket.id ?? idx}
                      onClick={() => openDetail(ticket)}
                      sx={{ "&:hover": { bgcolor: "#fafafa" }, "&:last-child td": { border: 0 }, transition: "background 0.12s", cursor: "pointer" }}
                    >
                      <TableCell sx={{ color: "#cbd5e1", fontSize: "0.8rem", py: 2, fontFamily: "inherit", fontWeight: 600 }}>
                        {idx + 1}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: "0.855rem", color: "#0f172a", maxWidth: 240, fontFamily: "inherit" }}>
                        {ticket.subject}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "inline-flex", alignItems: "center", px: 1.2, py: 0.4, borderRadius: "6px", bgcolor: "#f8fafc", border: "1px solid #e2e8f0" }}>
                          <Typography sx={{ fontSize: "0.775rem", color: "#475569", fontWeight: 600, fontFamily: "inherit" }}>
                            {ticket.category}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, px: 1.2, py: 0.4, borderRadius: "7px", bgcolor: s.bg, border: `1px solid ${s.border}` }}>
                          <Box sx={{ color: s.color, display: "flex", alignItems: "center" }}>{s.icon}</Box>
                          <Typography sx={{ fontSize: "0.75rem", color: s.color, fontWeight: 700, fontFamily: "inherit" }}>{s.label}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ fontSize: "0.8rem", color: "#94a3b8", fontFamily: "inherit", fontWeight: 500 }}>
                        {formatDate(ticket.createdAt)}
                      </TableCell>
                      <TableCell onClick={(e) => { e.stopPropagation(); openDetail(ticket); }}>
                        <IconButton size="small" sx={{ color: "#cbd5e1", borderRadius: "8px", "&:hover": { bgcolor: "#f5f3ff", color: "#7c3aed" }, transition: "all 0.15s" }}>
                          <VisibilityRounded sx={{ fontSize: 17 }} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* ── Detail Drawer ── */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { width: { xs: "100vw", sm: 430 }, bgcolor: "#f8fafc", boxShadow: "-8px 0 48px rgba(0,0,0,0.1)" } }}
      >
        {selected && <TicketDetail ticket={selected} onClose={() => setDrawerOpen(false)} />}
      </Drawer>
    </Box>
  );
};

/* ─── Ticket Detail Drawer ───────────────────────────────────── */

const TicketDetail = ({ ticket, onClose }) => {
  const s = statusConfig[ticket.status] ?? statusConfig["Open"];

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", fontFamily: "'Plus Jakarta Sans', 'DM Sans', sans-serif" }}>
      {/* Header */}
      <Box sx={{ px: 3, py: 2.5, bgcolor: "white", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box sx={{ width: 38, height: 38, borderRadius: "11px", bgcolor: "#f5f3ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ConfirmationNumberOutlined sx={{ fontSize: 20, color: "#7c3aed" }} />
          </Box>
          <Box>
            <Typography sx={{ fontFamily: "inherit", fontWeight: 800, fontSize: "0.95rem", color: "#0f172a" }}>Ticket Details</Typography>
            <Typography sx={{ fontSize: "0.7rem", color: "#94a3b8", fontWeight: 600 }}>
              #{(ticket._id ?? ticket.id ?? "").toString().slice(-6).toUpperCase()}
            </Typography>
          </Box>
        </Box>
        <IconButton size="small" onClick={onClose} sx={{ color: "#94a3b8", bgcolor: "#f1f5f9", borderRadius: "9px", "&:hover": { bgcolor: "#e2e8f0", color: "#475569" } }}>
          <CloseRounded fontSize="small" />
        </IconButton>
      </Box>

      {/* Body */}
      <Box sx={{ flex: 1, overflow: "auto", p: 3, display: "flex", flexDirection: "column", gap: 2 }}>

        {/* Status badge */}
        <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.6, px: 1.4, py: 0.55, borderRadius: "8px", bgcolor: s.bg, border: `1.5px solid ${s.border}`, width: "fit-content" }}>
          <Box sx={{ color: s.color, display: "flex" }}>{s.icon}</Box>
          <Typography sx={{ fontSize: "0.78rem", color: s.color, fontWeight: 800, fontFamily: "inherit" }}>{ticket.status}</Typography>
        </Box>

        {/* Subject */}
        <Paper elevation={0} sx={{ p: 2.5, borderRadius: "14px", border: "1.5px solid #f1f5f9", bgcolor: "white" }}>
          <Typography sx={{ fontSize: "0.68rem", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.07em", mb: 0.8, fontFamily: "inherit" }}>
            Subject
          </Typography>
          <Typography sx={{ fontFamily: "inherit", fontWeight: 800, fontSize: "1rem", color: "#0f172a", lineHeight: 1.45 }}>
            {ticket.subject}
          </Typography>
        </Paper>

        {/* Meta */}
        <Box sx={{ display: "flex", gap: 1.5 }}>
          <DetailMeta icon={<CategoryRounded sx={{ fontSize: 14 }} />} label="Category" value={ticket.category} />
          <DetailMeta icon={<CalendarTodayRounded sx={{ fontSize: 14 }} />} label="Created" value={formatDate(ticket.createdAt ?? ticket.date)} />
        </Box>

        {/* Description */}
        <Paper elevation={0} sx={{ p: 2.5, borderRadius: "14px", border: "1.5px solid #f1f5f9", bgcolor: "white" }}>
          <Typography sx={{ fontSize: "0.68rem", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.07em", mb: 1, fontFamily: "inherit" }}>
            Description
          </Typography>
          <Typography sx={{ fontSize: "0.875rem", color: "#334155", lineHeight: 1.75, whiteSpace: "pre-wrap", fontFamily: "inherit", fontWeight: 500 }}>
            {ticket.description || "No description provided."}
          </Typography>
        </Paper>

        {/* Attachment */}
        {ticket.attachment && (
          <Paper elevation={0} sx={{ p: 2, borderRadius: "14px", border: "1.5px solid #f1f5f9", bgcolor: "white", display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box sx={{ width: 36, height: 36, borderRadius: "9px", bgcolor: "#f5f3ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <AttachFileRounded sx={{ fontSize: 18, color: "#7c3aed" }} />
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ fontSize: "0.8rem", fontWeight: 700, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontFamily: "inherit" }}>
                {ticket.attachment}
              </Typography>
              <Typography sx={{ fontSize: "0.7rem", color: "#94a3b8", fontWeight: 500 }}>Attachment</Typography>
            </Box>
          </Paper>
        )}

        {/* Admin note */}
        {ticket.adminNote && (
          <>
            <Divider sx={{ borderColor: "#f1f5f9" }} />
            <Paper elevation={0} sx={{ p: 2.5, borderRadius: "14px", bgcolor: "#f0fdf4", border: "1.5px solid #bbf7d0" }}>
              <Typography sx={{ fontSize: "0.68rem", fontWeight: 800, color: "#059669", textTransform: "uppercase", letterSpacing: "0.07em", mb: 0.8, fontFamily: "inherit" }}>
                Admin Response
              </Typography>
              <Typography sx={{ fontSize: "0.875rem", color: "#065f46", lineHeight: 1.7, fontFamily: "inherit", fontWeight: 500 }}>
                {ticket.adminNote}
              </Typography>
            </Paper>
          </>
        )}
      </Box>
    </Box>
  );
};

/* ─── Sub-components ─────────────────────────────────────────── */

const DetailMeta = ({ icon, label, value }) => (
  <Paper elevation={0} sx={{ flex: 1, p: 1.75, borderRadius: "12px", border: "1.5px solid #f1f5f9", bgcolor: "white", fontFamily: "'Plus Jakarta Sans', 'DM Sans', sans-serif" }}>
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.6, mb: 0.6, color: "#94a3b8" }}>
      {icon}
      <Typography sx={{ fontSize: "0.65rem", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: "inherit" }}>
        {label}
      </Typography>
    </Box>
    <Typography sx={{ fontSize: "0.82rem", fontWeight: 700, color: "#334155", fontFamily: "inherit" }}>{value}</Typography>
  </Paper>
);

const EmptyState = ({ hasTickets }) => (
  <Box sx={{ textAlign: "center", py: 9, px: 3, fontFamily: "'Plus Jakarta Sans', 'DM Sans', sans-serif" }}>
    <Box sx={{ width: 56, height: 56, borderRadius: "16px", bgcolor: "#f8fafc", border: "1.5px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", mx: "auto", mb: 2 }}>
      <InboxRounded sx={{ fontSize: 26, color: "#cbd5e1" }} />
    </Box>
    <Typography sx={{ fontFamily: "inherit", fontWeight: 800, fontSize: "0.95rem", color: "#334155", mb: 0.5 }}>
      {hasTickets ? "No matching tickets" : "No tickets yet"}
    </Typography>
    <Typography sx={{ fontSize: "0.8rem", color: "#94a3b8", mb: 2.5, fontWeight: 500 }}>
      {hasTickets ? "Try adjusting your search or filters" : "Submit your first support request to get started"}
    </Typography>
    {!hasTickets && (
      <Button
        component={Link}
        to="/create-ticket"
        variant="contained"
        startIcon={<AddRounded />}
        sx={{
          borderRadius: "10px", textTransform: "none", fontWeight: 700, fontSize: "0.8rem", fontFamily: "inherit",
          background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
          boxShadow: "0 4px 12px rgba(124,58,237,0.3)",
          "&:hover": { background: "linear-gradient(135deg, #6d28d9, #5b21b6)" },
        }}
      >
        Create Ticket
      </Button>
    )}
  </Box>
);

export default DashboardPage;