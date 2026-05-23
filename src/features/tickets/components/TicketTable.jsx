import {
  Box, Paper, TextField, InputAdornment, alpha, CircularProgress, Typography,
  TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Chip, IconButton
} from "@mui/material";
import { SearchRounded, VisibilityRounded } from "@mui/icons-material";

const STATUSES = ["All", "Open", "In Progress", "Resolved"];

export const TicketTable = ({
  filtered, search, setSearch, filterStatus, setFilterStatus, 
  loading, error, tickets, openDetail, statusConfig, formatDate, EmptyStateComponent
}) => {
  return (
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
      <Box sx={{ px: 3, py: 2, borderBottom: "1px solid rgba(0,0,0,0.05)", display: "flex", gap: 1.5, flexWrap: "wrap", alignItems: "center" }}>
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
            flex: 1, minWidth: 200,
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px", bgcolor: "#f9fafb", fontSize: "0.82rem",
              "& fieldset": { border: "1px solid rgba(0,0,0,0.08)" },
              "&:hover fieldset": { borderColor: "#6C4CF1" },
              "&.Mui-focused fieldset": { borderColor: "#6C4CF1" },
            },
          }}
        />

        {/* Status pills */}
        <Box sx={{ display: "flex", gap: 0.75 }}>
          {STATUSES.map((s) => {
            const active = filterStatus === s;
            const cfg = statusConfig[s];
            return (
              <Box
                key={s}
                onClick={() => setFilterStatus(s)}
                sx={{
                  px: 1.5, py: 0.6, borderRadius: "8px", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer", transition: "all 0.15s",
                  bgcolor: active ? (s === "All" ? alpha("#6C4CF1", 0.1) : alpha(cfg?.color, 0.1)) : "#f3f4f6",
                  color: active ? (s === "All" ? "#6C4CF1" : cfg?.color) : "#9ca3af",
                  border: active ? `1px solid ${alpha(s === "All" ? "#6C4CF1" : cfg?.color, 0.3)}` : "1px solid transparent",
                  "&:hover": { bgcolor: alpha(s === "All" ? "#6C4CF1" : cfg?.color || "#6C4CF1", 0.08) },
                }}
              >
                {s}
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* Main content handling statuses */}
      {loading ? (
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", py: 8, gap: 1.5 }}>
          <CircularProgress size={22} sx={{ color: "#6C4CF1" }} />
          <Typography sx={{ fontSize: "0.875rem", color: "#9ca3af" }}>Loading tickets…</Typography>
        </Box>
      ) : error ? (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography sx={{ fontSize: "0.875rem", color: "#ef4444" }}>{error}</Typography>
        </Box>
      ) : filtered.length === 0 ? (
        <EmptyStateComponent hasTickets={tickets.length > 0} />
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f9fafb" }}>
                {["#", "Subject", "Category", "Status", "Created At", ""].map((h) => (
                  <TableCell key={h} sx={{ fontSize: "0.72rem", fontWeight: 700, color: "#6b7280", letterSpacing: "0.06em", textTransform: "uppercase", py: 1.5, borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((ticket, idx) => {
                const s = statusConfig[ticket.status] ?? statusConfig["Open"];
                return (
                  <TableRow key={ticket._id ?? ticket.id} sx={{ "&:hover": { bgcolor: "#fafafa" }, "&:last-child td": { border: 0 }, transition: "background 0.15s", cursor: "pointer" }} onClick={() => openDetail(ticket)}>
                    <TableCell sx={{ color: "#9ca3af", fontSize: "0.82rem", py: 2, width: 40 }}>{idx + 1}</TableCell>
                    <TableCell sx={{ fontWeight: 500, fontSize: "0.85rem", color: "#111827", maxWidth: 220 }}>
                      <Typography sx={{ fontSize: "0.85rem", fontWeight: 600, color: "#111827", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 220 }}>
                        {ticket.subject}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ fontSize: "0.82rem", color: "#6b7280" }}>{ticket.category}</TableCell>
                    <TableCell>
                      <Chip
                        label={ticket.status} size="small"
                        icon={<Box sx={{ color: `${s.color} !important`, display: "flex", ml: "6px !important" }}>{s.icon}</Box>}
                        sx={{ bgcolor: s.bg, color: s.color, fontWeight: 600, fontSize: "0.72rem", height: 24, border: `1px solid ${alpha(s.color, 0.2)}`, "& .MuiChip-label": { px: 1, pl: 0.5 } }}
                      />
                    </TableCell>
                    <TableCell sx={{ fontSize: "0.82rem", color: "#9ca3af" }}>{formatDate(ticket.createdAt ?? ticket.date)}</TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        sx={{ borderRadius: "8px", color: "#9ca3af", "&:hover": { bgcolor: "#ede9fe", color: "#6C4CF1" } }}
                        onClick={(e) => { e.stopPropagation(); openDetail(ticket); }}
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
  );
};