import {
  alpha,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
} from "@mui/material";
import {
  CheckCircleOutlineRounded,
  CloseRounded,
  ConfirmationNumberRounded,
  EditRounded,
  ErrorOutlineRounded,
  PeopleRounded,
  SearchRounded,
  TrendingUpRounded,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { getAllTicketsApi, updateTicketsApi } from "../api/adminApi";
import toast from "react-hot-toast";

/* ─── Constants ─────────────────────────────────────────────── */

const statusConfig = {
  Open:        { color: "#d97706", bg: "#fffbeb", border: "#fde68a" },
  "In Progress": { color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe" },
  Resolved:    { color: "#059669", bg: "#f0fdf4", border: "#a7f3d0" },
};

const STATUSES   = ["All Status", "Open", "In Progress", "Resolved"];
const CATEGORIES = ["All Categories", "Technical", "Payment", "Course", "Certificate", "General"];

const formatDate = (val) => {
  if (!val) return "—";
  const d = new Date(val);
  if (isNaN(d)) return val;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

/* ─── Main Component ─────────────────────────────────────────── */

const AdminDashboardPage = () => {
  const [tickets,        setTickets]        = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [error,          setError]          = useState("");
  const [filterStatus,   setFilterStatus]   = useState("All Status");
  const [filterCategory, setFilterCategory] = useState("All Categories");
  const [search,         setSearch]         = useState("");
  const [editTicket,     setEditTicket]     = useState(null);
  const [updateTicket,   setUpdateTicket]   = useState({ status: "", adminNote: "" });
  const [saving,         setSaving]         = useState(false);

  /* ── fetch ── */
  const fetchAllTickets = async () => {
    try {
      setLoading(true);
      const data = await getAllTicketsApi();
      setTickets(data.tickets ?? data.data ?? []);
    } catch (err) {
      setError("Failed to load tickets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAllTickets(); }, []);

  /* ── derived counts from live data ── */
  const counts = tickets.reduce(
    (acc, t) => {
      acc.total++;
      if (t.status === "Open")        acc.open++;
      if (t.status === "In Progress") acc.inProgress++;
      if (t.status === "Resolved")    acc.resolved++;
      return acc;
    },
    { total: 0, open: 0, inProgress: 0, resolved: 0 }
  );

  const statCards = [
    { title: "Total Tickets", value: counts.total,      icon: <ConfirmationNumberRounded />, color: "#7c3aed", bg: "#f5f3ff", border: "#ddd6fe" },
    { title: "Open",          value: counts.open,       icon: <ErrorOutlineRounded />,       color: "#d97706", bg: "#fffbeb", border: "#fde68a" },
    { title: "In Progress",   value: counts.inProgress, icon: <TrendingUpRounded />,         color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe" },
    { title: "Resolved",      value: counts.resolved,   icon: <CheckCircleOutlineRounded />, color: "#059669", bg: "#f0fdf4", border: "#a7f3d0" },
  ];

  /* ── filter ── */
  const filtered = tickets.filter((t) => {
    const matchStatus = filterStatus   === "All Status"    || t.status   === filterStatus;
    const matchCat    = filterCategory === "All Categories"|| t.category === filterCategory;
    const q           = search.toLowerCase();
    const matchSearch =
      t.subject?.toLowerCase().includes(q) ||
      t.createdBy?.name?.toLowerCase().includes(q);
    return matchStatus && matchCat && matchSearch;
  });

  /* ── edit / update ── */
  const handleEdit = (ticket) => {
    setEditTicket(ticket);
    setUpdateTicket({ status: ticket.status, adminNote: ticket.adminNote ?? "" });
  };

  const handleUpdate = async () => {
    if (!updateTicket.status) return;
    try {
      setSaving(true);
      await updateTicketsApi(editTicket._id ?? editTicket.id, {
        status:    updateTicket.status,
        adminNote: updateTicket.adminNote,
      });
       toast.success("Updated Successfully");
      // optimistic update in local state
      setTickets((prev) =>
        prev.map((t) =>
          (t._id ?? t.id) === (editTicket._id ?? editTicket.id)
            ? { ...t, status: updateTicket.status, adminNote: updateTicket.adminNote }
            : t
        )
      );
      setEditTicket(null);
    } catch (err) {
      console.error("Update failed:", err);
    } finally {
      setSaving(false);
    }
  };

  /* ── render ── */
  return (
    <Box sx={{ fontFamily: "'Plus Jakarta Sans', 'DM Sans', sans-serif" }}>

      {/* Page header */}
      <Box mb={4}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 0.5 }}>
          <Typography variant="h5" sx={{ fontFamily: "inherit", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.03em", fontSize: "1.6rem" }}>
            Admin Dashboard
          </Typography>
          <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, px: 1.2, py: 0.35, borderRadius: "7px", bgcolor: "#f5f3ff", border: "1px solid #ddd6fe" }}>
            <PeopleRounded sx={{ fontSize: 13, color: "#7c3aed" }} />
            <Typography sx={{ fontSize: "0.68rem", fontWeight: 800, color: "#7c3aed", fontFamily: "inherit" }}>Admin</Typography>
          </Box>
        </Box>
        <Typography sx={{ fontSize: "0.83rem", color: "#94a3b8", fontWeight: 500 }}>
          Manage all support tickets across the platform
        </Typography>
      </Box>

      {/* Stat cards */}
      <Grid container spacing={2.5} mb={4}>
        {statCards.map((item) => (
          <Grid item xs={6} sm={6} md={3} key={item.title}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5, borderRadius: "16px",
                border: `1.5px solid ${item.border}`,
                bgcolor: item.bg,
                transition: "all 0.22s ease",
                "&:hover": { transform: "translateY(-2px)", boxShadow: `0 8px 28px ${alpha(item.color, 0.14)}` },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                <Box>
                  <Typography sx={{ fontSize: "0.7rem", fontWeight: 700, color: "#94a3b8", mb: 0.8, letterSpacing: "0.05em", textTransform: "uppercase", fontFamily: "inherit" }}>
                    {item.title}
                  </Typography>
                  <Typography sx={{ fontSize: "2.2rem", fontWeight: 800, color: item.color, fontFamily: "inherit", lineHeight: 1 }}>
                    {loading ? "—" : item.value}
                  </Typography>
                </Box>
                <Box sx={{ width: 42, height: 42, borderRadius: "12px", bgcolor: alpha(item.color, 0.12), display: "flex", alignItems: "center", justifyContent: "center", color: item.color, "& svg": { fontSize: 21 } }}>
                  {item.icon}
                </Box>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* All Tickets card */}
      <Paper elevation={0} sx={{ borderRadius: "18px", border: "1.5px solid rgba(0,0,0,0.06)", bgcolor: "white", overflow: "hidden" }}>

        {/* Toolbar */}
        <Box sx={{ px: 3, py: 2.5, borderBottom: "1px solid #f1f5f9" }}>
          <Typography sx={{ fontFamily: "inherit", fontWeight: 800, fontSize: "1rem", color: "#0f172a", mb: 2 }}>
            All Tickets
          </Typography>
          <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>

            {/* Status filter */}
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              size="small"
              sx={{ borderRadius: "10px", fontSize: "0.82rem", minWidth: 135, fontFamily: "inherit", bgcolor: "#f8fafc", "& fieldset": { borderColor: "rgba(0,0,0,0.08)" } }}
            >
              {STATUSES.map((s) => (
                <MenuItem key={s} value={s} sx={{ fontSize: "0.82rem", fontFamily: "inherit" }}>{s}</MenuItem>
              ))}
            </Select>

            {/* Category filter */}
            <Select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              size="small"
              sx={{ borderRadius: "10px", fontSize: "0.82rem", minWidth: 155, fontFamily: "inherit", bgcolor: "#f8fafc", "& fieldset": { borderColor: "rgba(0,0,0,0.08)" } }}
            >
              {CATEGORIES.map((c) => (
                <MenuItem key={c} value={c} sx={{ fontSize: "0.82rem", fontFamily: "inherit" }}>{c}</MenuItem>
              ))}
            </Select>

            {/* Search */}
            <TextField
              placeholder="Search by subject or user…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              size="small"
              InputProps={{
                startAdornment: <InputAdornment position="start"><SearchRounded sx={{ fontSize: 17, color: "#94a3b8" }} /></InputAdornment>,
                sx: { borderRadius: "10px", fontSize: "0.82rem", fontFamily: "inherit", bgcolor: "#f8fafc", "& fieldset": { borderColor: "rgba(0,0,0,0.08)" }, "&:hover fieldset": { borderColor: "rgba(0,0,0,0.18)" } },
              }}
              sx={{ flex: 1, minWidth: 200 }}
            />
          </Box>
        </Box>

        {/* Table */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#fafafa" }}>
                {["#", "Subject", "User", "Category", "Status", "Created At", "Actions"].map((h) => (
                  <TableCell key={h} sx={{ fontSize: "0.68rem", fontWeight: 800, color: "#94a3b8", letterSpacing: "0.07em", textTransform: "uppercase", py: 1.5, borderBottom: "1px solid #f1f5f9", fontFamily: "inherit" }}>
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} sx={{ textAlign: "center", py: 7, border: 0 }}>
                    <CircularProgress size={28} sx={{ color: "#7c3aed" }} />
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={7} sx={{ textAlign: "center", py: 6, color: "#ef4444", fontSize: "0.85rem", border: 0 }}>
                    {error}
                  </TableCell>
                </TableRow>
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} sx={{ textAlign: "center", py: 8, color: "#94a3b8", fontSize: "0.85rem", border: 0, fontFamily: "inherit" }}>
                    No tickets match your filters.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((ticket, idx) => {
                  const s = statusConfig[ticket.status] ?? statusConfig["Open"];
                  const name = ticket.createdBy?.name ?? "Unknown";
                  return (
                    <TableRow
                      key={ticket._id ?? ticket.id ?? idx}
                      sx={{ "&:hover": { bgcolor: "#fafafa" }, "&:last-child td": { border: 0 }, transition: "background 0.12s" }}
                    >
                      <TableCell sx={{ color: "#cbd5e1", fontSize: "0.8rem", py: 2, fontWeight: 600, fontFamily: "inherit" }}>
                        {idx + 1}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: "0.855rem", color: "#0f172a", maxWidth: 200, fontFamily: "inherit" }}>
                        {ticket.subject}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Avatar sx={{ width: 28, height: 28, fontSize: "0.72rem", fontWeight: 700, bgcolor: "#7c3aed" }}>
                            {name.charAt(0).toUpperCase()}
                          </Avatar>
                          <Typography sx={{ fontSize: "0.8rem", color: "#475569", fontWeight: 500, fontFamily: "inherit" }}>
                            {name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "inline-flex", px: 1.2, py: 0.4, borderRadius: "6px", bgcolor: "#f8fafc", border: "1px solid #e2e8f0" }}>
                          <Typography sx={{ fontSize: "0.775rem", color: "#475569", fontWeight: 600, fontFamily: "inherit" }}>
                            {ticket.category}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, px: 1.2, py: 0.4, borderRadius: "7px", bgcolor: s.bg, border: `1px solid ${s.border}` }}>
                          <Typography sx={{ fontSize: "0.75rem", color: s.color, fontWeight: 700, fontFamily: "inherit" }}>
                            {ticket.status}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ fontSize: "0.8rem", color: "#94a3b8", fontWeight: 500, fontFamily: "inherit" }}>
                        {formatDate(ticket.createdAt)}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => handleEdit(ticket)}
                          sx={{ borderRadius: "8px", color: "#94a3b8", "&:hover": { bgcolor: "#f5f3ff", color: "#7c3aed" }, transition: "all 0.15s" }}
                        >
                          <EditRounded sx={{ fontSize: 17 }} />
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

      {/* ── Update Dialog ── */}
      <Dialog
        open={!!editTicket}
        onClose={() => !saving && setEditTicket(null)}
        PaperProps={{ sx: { borderRadius: "18px", minWidth: 400, boxShadow: "0 24px 60px rgba(0,0,0,0.14)", fontFamily: "'Plus Jakarta Sans', 'DM Sans', sans-serif" } }}
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pb: 1, fontFamily: "inherit", fontWeight: 800, fontSize: "1.05rem", color: "#0f172a" }}>
          Update Ticket
          <IconButton size="small" onClick={() => setEditTicket(null)} disabled={saving} sx={{ color: "#94a3b8", bgcolor: "#f1f5f9", borderRadius: "8px", "&:hover": { bgcolor: "#e2e8f0" } }}>
            <CloseRounded fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 1 }}>
          {/* Subject preview */}
          {editTicket && (
            <Box sx={{ p: 1.75, borderRadius: "10px", bgcolor: "#f8fafc", border: "1.5px solid #f1f5f9", mb: 2.5 }}>
              <Typography sx={{ fontSize: "0.68rem", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", mb: 0.5, fontFamily: "inherit" }}>Ticket</Typography>
              <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: "#0f172a", fontFamily: "inherit" }}>{editTicket.subject}</Typography>
            </Box>
          )}

          {/* Status select */}
          <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: "#334155", mb: 0.75, fontFamily: "inherit", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Status *
          </Typography>
          <Select
            fullWidth
            value={updateTicket.status}
            onChange={(e) => setUpdateTicket((p) => ({ ...p, status: e.target.value }))}
            size="small"
            sx={{ borderRadius: "10px", fontSize: "0.85rem", mb: 2.5, fontFamily: "inherit", "& fieldset": { borderColor: "rgba(0,0,0,0.12)" } }}
          >
            {["Open", "In Progress", "Resolved"].map((s) => (
              <MenuItem key={s} value={s} sx={{ fontSize: "0.85rem", fontFamily: "inherit" }}>{s}</MenuItem>
            ))}
          </Select>

          {/* Admin note */}
          <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: "#334155", mb: 0.75, fontFamily: "inherit", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Admin Note
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="Add a note for the user…"
            value={updateTicket.adminNote}
            onChange={(e) => setUpdateTicket((p) => ({ ...p, adminNote: e.target.value }))}
            inputProps={{ maxLength: 1000 }}
            helperText={`${updateTicket.adminNote.length}/1000`}
            sx={{
              "& .MuiOutlinedInput-root": { borderRadius: "10px", fontSize: "0.85rem", fontFamily: "inherit", "& fieldset": { borderColor: "rgba(0,0,0,0.12)" } },
              "& .MuiFormHelperText-root": { textAlign: "right", fontSize: "0.7rem", color: "#94a3b8" },
            }}
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button
            onClick={() => setEditTicket(null)}
            disabled={saving}
            variant="outlined"
            sx={{ borderRadius: "10px", textTransform: "none", fontWeight: 700, fontSize: "0.85rem", fontFamily: "inherit", color: "#475569", borderColor: "rgba(0,0,0,0.15)", "&:hover": { borderColor: "rgba(0,0,0,0.28)", bgcolor: "#f8fafc" } }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdate}
            disabled={saving || !updateTicket.status}
            variant="contained"
            sx={{
              borderRadius: "10px", textTransform: "none", fontWeight: 700, fontSize: "0.85rem", fontFamily: "inherit",
              background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
              boxShadow: "0 4px 12px rgba(124,58,237,0.35)",
              "&:hover": { background: "linear-gradient(135deg, #6d28d9, #5b21b6)" },
              "&.Mui-disabled": { opacity: 0.6 },
            }}
          >
            {saving ? <CircularProgress size={16} sx={{ color: "white" }} /> : "Update"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminDashboardPage;