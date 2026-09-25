import { useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableSortLabel from "@mui/material/TableSortLabel";
import Pagination from "@mui/material/Pagination";
import { ThemeProvider } from "@mui/material/styles";

import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import SyncOutlinedIcon from "@mui/icons-material/SyncOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";

import { lightTheme } from "@/theme/theme";
import NinjaRail from "@/pages/NinjaAvailability/NinjaRail";
import { RAIL_ITEMS } from "@/pages/NinjaAvailability/railItems";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/store";
import { approveCancellation, rejectCancellation } from "@/store/slices/sessionsSlice";
import { approveQueued, rejectQueued } from "@/store/slices/opsQueueSlice";
import CancellationDrawer from "./CancellationDrawer";
import { useQueueRows, URGENT_WINDOW_HOURS, type QueueRow } from "./rows";

/**
 * Gurus › Manage Guru Requests, as the internal console renders it.
 *
 * Every measurement here comes from docs/ninja-manage-guru-requests.md, which was
 * taken off staging with devtools rather than read off a screenshot. The console
 * diverges from this project's design language on purpose (see the note on the
 * facilitator page), so these are literals, not theme tokens.
 *
 * Two things are easy to get wrong and are called out where they happen: the
 * header band's tint sits on the row rather than on <thead> or the cells, and the
 * console sets no letter-spacing anywhere while our MUI theme adds some.
 */

const BLUE = "rgb(25, 106, 229)";
const INK = "rgba(33, 33, 33, 0.92)";
const INK_SOFT = "rgba(33, 33, 33, 0.72)";
const INK_FAINT = "rgba(33, 33, 33, 0.64)";
const HAIRLINE = "rgba(33, 33, 33, 0.06)";
const WASH = "rgba(33, 33, 33, 0.04)";
const EASE = "cubic-bezier(0.4, 0, 0.2, 1)";
/** The search outline is MUI's default, not the hairline used elsewhere. */
const OUTLINE_REST = "rgba(0, 0, 0, 0.23)";

type Request = {
  id: string;
  batch: string;
  program: string;
  groups: number;
  requestedAt: string; // ISO, formatted for display
  requestedBy: string;
};

const PROGRAM = "NCAIML - Content Tagging (NCAIMLContentTagging)";

const PENDING: Request[] = [
  { id: "p1", batch: "NCAIML-July-26-B", program: PROGRAM, groups: 3, requestedAt: "2026-07-29T18:25:00", requestedBy: "Avinash Singh" },
  { id: "p2", batch: "NCAIML-Content-Tagging-Session-Automation-August'26", program: PROGRAM, groups: 1, requestedAt: "2026-07-28T14:15:00", requestedBy: "Amit Mishra" },
  { id: "p3", batch: "NCAIML-Mar-26-B", program: PROGRAM, groups: 1, requestedAt: "2026-07-23T14:06:00", requestedBy: "Jon Mathew" },
  { id: "p4", batch: "NCAIML-Content-Tagging-Session-Automation-July'26", program: PROGRAM, groups: 1, requestedAt: "2026-07-22T17:47:00", requestedBy: "Amit Mishra" },
];

const COMPLETED: Request[] = [
  { id: "c1", batch: "NCAIML-Aug-26-A", program: PROGRAM, groups: 2, requestedAt: "2026-08-17T11:56:00", requestedBy: "Amit Mishra" },
  { id: "c2", batch: "NCAIML-July-26-A", program: PROGRAM, groups: 1, requestedAt: "2026-08-11T09:32:00", requestedBy: "Avinash Singh" },
  { id: "c3", batch: "NCAIML-Jun-26-C", program: PROGRAM, groups: 4, requestedAt: "2026-08-04T16:18:00", requestedBy: "Jon Mathew" },
  { id: "c4", batch: "NCAIML-Content-Tagging-Session-Automation-June'26", program: PROGRAM, groups: 1, requestedAt: "2026-07-30T13:05:00", requestedBy: "Amit Mishra" },
  { id: "c5", batch: "NCAIML-May-26-B", program: PROGRAM, groups: 2, requestedAt: "2026-07-19T10:41:00", requestedBy: "Avinash Singh" },
  { id: "c6", batch: "NCAIML-Apr-26-A", program: PROGRAM, groups: 1, requestedAt: "2026-07-08T15:27:00", requestedBy: "Jon Mathew" },
];

/** "Jul 29, 2026, 6:25 PM" — the console's own format. */
function fmt(iso: string) {
  const d = new Date(iso);
  const date = d.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
  const time = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  return `${date}, ${time}`;
}

type SortKey = "batch" | "program" | "groups" | "requestedAt" | "requestedBy";
type TabKey = "pending" | "completed" | "cancellations";

/** Resolved only pages once it passes this; below it the group renders whole. */
const RESOLVED_PAGE_SIZE = 50;
type QueueSortKey = "guru" | "sessionTitle" | "program" | "sessionAt" | "requestedAt" | "status";

/** Workflow order for the status column, not alphabetical. */
const STATUS_RANK: Record<QueueRow["status"], number> = { pending: 0, approved: 1, rejected: 2 };

const QUEUE_COLUMNS: Array<{ key: QueueSortKey; label: string }> = [
  { key: "guru", label: "Guru" },
  { key: "sessionTitle", label: "Session" },
  { key: "program", label: "Program / Batch" },
  { key: "sessionAt", label: "Scheduled for" },
  { key: "requestedAt", label: "Requested on" },
  { key: "status", label: "Status" },
];

/**
 * Group heading inside the queue table.
 *
 * `hint` qualifies the group in a lighter weight. It is separate from `label`
 * so the count can sit against the group name: "NEEDS ACTION (3) · SESSIONS IN
 * THE NEXT 72 HOURS" cannot be misread as a deadline for Ops, which is how
 * "needs action in the next 72 hours" was landing.
 */
function SectionRow({
  label,
  count,
  hint,
  collapsed,
  onToggle,
}: {
  label: string;
  count: number;
  hint?: string;
  collapsed: boolean;
  onToggle: () => void;
}) {
  return (
    <TableRow
      onClick={onToggle}
      role="button"
      aria-expanded={!collapsed}
      sx={{ cursor: "pointer", "&:hover .section-chevron": { color: INK } }}
    >
      <TableCell
        colSpan={6}
        sx={{
          px: 2,
          py: 1,
          bgcolor: WASH,
          borderBottom: `1px solid ${HAIRLINE}`,
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          color: INK_SOFT,
          whiteSpace: "nowrap",
          userSelect: "none",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
          <ChevronRightIcon
            className="section-chevron"
            sx={{
              fontSize: 18,
              color: "rgba(33, 33, 33, 0.56)",
              transform: collapsed ? "none" : "rotate(90deg)",
              transition: `transform 0.15s ${EASE}, color 0.15s ${EASE}`,
            }}
          />
          <Box component="span">
            {label} ({count})
            {hint && (
              <Box component="span" sx={{ fontWeight: 500, color: "rgba(33, 33, 33, 0.56)" }}>
                {" · "}{hint}
              </Box>
            )}
          </Box>
        </Box>
      </TableCell>
    </TableRow>
  );
}

/** Status pill on a resolved cancellation row. */
function StatusChip({ status }: { status: QueueRow["status"] }) {
  const map = {
    pending: { label: "Pending", fg: "rgb(180, 83, 9)", bg: "rgba(180, 83, 9, 0.10)" },
    approved: { label: "Approved", fg: "rgb(21, 128, 61)", bg: "rgba(21, 128, 61, 0.10)" },
    rejected: { label: "Rejected", fg: "#c62828", bg: "rgba(198, 40, 40, 0.10)" },
  }[status];
  return (
    <Box
      component="span"
      sx={{
        display: "inline-block", px: 1, py: 0.25, borderRadius: "4px",
        fontSize: 12, fontWeight: 600, letterSpacing: "normal",
        color: map.fg, bgcolor: map.bg, whiteSpace: "nowrap",
      }}
    >
      {map.label}
    </Box>
  );
}

export default function NinjaManageGuruRequests() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [tab, setTab] = useState<TabKey>("pending");
  const [openRow, setOpenRow] = useState<QueueRow | null>(null);
  const queue = useQueueRows();
  const pendingCancellations = queue.filter((r) => r.status === "pending").length;
  const todayYmd = new Date().toISOString().slice(0, 10);

  /* Which store the decision lands in depends on where the row came from — a
     live row has a real session to mark declined, a seeded one does not. */
  const approve = (row: QueueRow) => {
    dispatch(row.source === "live"
      ? approveCancellation({ id: row.id, dateYmd: todayYmd })
      : approveQueued({ id: row.id, dateYmd: todayYmd, reason: row.reason }));
    /* Approving does not free the session by itself. Somebody still has to put
       another Guru on the activity or cancel it, and that only happens on the
       batch, so this hands them straight there with the request in tow.
       In production the request would settle when the activity is updated; the
       prototype settles it here, at the hand-off. */
    navigate(`/ninja-batch/${row.batchId}?request=${row.id}`);
  };
  const reject = (row: QueueRow, reason: string) =>
    dispatch(row.source === "live"
      ? rejectCancellation({ id: row.id, dateYmd: todayYmd, reason })
      : rejectQueued({ id: row.id, dateYmd: todayYmd, reason }));
  const [query, setQuery] = useState("");
  /* The console lands sorted by request time, newest first. */
  const [sort, setSort] = useState<{ key: SortKey; dir: "asc" | "desc" }>({ key: "requestedAt", dir: "desc" });

  const rows = tab === "completed" ? COMPLETED : PENDING;
  const groupsLabel = tab === "pending" ? "Pending Groups" : "Completed Groups";

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? rows.filter((r) => `${r.program} ${r.batch}`.toLowerCase().includes(q))
      : rows;
    return [...filtered].sort((a, b) => {
      const A = a[sort.key];
      const B = b[sort.key];
      const cmp = typeof A === "number" && typeof B === "number" ? A - B : String(A).localeCompare(String(B));
      return sort.dir === "asc" ? cmp : -cmp;
    });
  }, [rows, query, sort]);

  /* Its own sort, same shape as the other tabs'. Defaults to the session that
     runs soonest, not the request that arrived last: this is a queue for finding
     cover, and the session starting in six hours has the least slack left. */
  const [queueSort, setQueueSort] = useState<{ key: QueueSortKey; dir: "asc" | "desc" }>({
    key: "sessionAt",
    dir: "asc",
  });
  const toggleQueueSort = (key: QueueSortKey) =>
    setQueueSort((s) => (s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }));

  /* The one search box serves every tab. */
  const queueVisible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? queue.filter((r) => `${r.guru} ${r.sessionTitle} ${r.program} ${r.batch}`.toLowerCase().includes(q))
      : queue;
    const value = (r: QueueRow) => {
      switch (queueSort.key) {
        case "guru": return r.guru;
        case "sessionTitle": return r.sessionTitle;
        case "program": return `${r.program} ${r.batch}`;
        case "sessionAt": return r.sessionAt;
        case "requestedAt": return r.requestedAt;
        /* Rank rather than alphabetical, so sorting by status reads as a
           workflow order instead of "approved, pending, rejected". */
        case "status": return String(STATUS_RANK[r.status]);
      }
    };
    return [...filtered].sort((a, b) => {
      const cmp = value(a).localeCompare(value(b), undefined, { numeric: true });
      return queueSort.dir === "asc" ? cmp : -cmp;
    });
  }, [queue, query, queueSort]);

  /* Grouping is a separate axis from sort, the way Linear and Jira treat it:
     the chosen column orders rows WITHIN a group, and sorting never flattens
     the groups. A row moves group the moment it is decided, which is the point —
     these are states of work, not time buckets.
     Three groups rather than two, because "pending but not urgent" and "already
     decided" are different kinds of thing: holding them together meant a single
     date sort buried the one row still needing Ops under six closed ones. */
  /* Resolved starts closed: it is history, and it grows without limit while the
     groups above it stay small. The other two are work, so they open. */
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({ resolved: true });
  const [resolvedPage, setResolvedPage] = useState(1);
  const toggleGroup = (key: string) => setCollapsed((c) => ({ ...c, [key]: !c[key] }));
  /* A search must be able to reach into a closed group, or Ops would be told
     there are no matches while the match sits folded away. */
  const searching = query.trim().length > 0;
  const isCollapsed = (key: string) => !searching && !!collapsed[key];

  const urgentRows = queueVisible.filter((r) => r.urgent);
  const laterRows = queueVisible.filter((r) => !r.urgent && r.status === "pending");
  const decidedRows = queueVisible.filter((r) => r.status !== "pending");

  /* Resolved is the only group that grows without limit, so it is the only one
     that pages. The work groups stay whole: an urgent request hidden on page two
     would defeat the point of grouping by urgency in the first place. */
  const decidedPageCount = Math.ceil(decidedRows.length / RESOLVED_PAGE_SIZE);
  const decidedPaged =
    decidedPageCount > 1
      ? decidedRows.slice((resolvedPage - 1) * RESOLVED_PAGE_SIZE, resolvedPage * RESOLVED_PAGE_SIZE)
      : decidedRows;
  /* Filtering can shrink the group under the current page. */
  if (resolvedPage > 1 && resolvedPage > decidedPageCount) setResolvedPage(1);
  /* One group's worth of rows needs no headings at all. */
  const grouped = [urgentRows, laterRows, decidedRows].filter((g) => g.length > 0).length > 1;

  const toggleSort = (key: SortKey) =>
    setSort((s) => (s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }));

  const renderRow = (r: QueueRow) => (
    <TableRow
      key={r.id}
      onClick={() => setOpenRow(r)}
      sx={{ height: 53, cursor: "pointer", "&:hover": { bgcolor: WASH } }}
    >
      {[
        r.guru,
        r.sessionTitle,
        `${r.program} · ${r.batch}`,
        r.sessionAtLabel,
        r.requestedAtLabel,
      ].map((v, i) => (
        <TableCell
          key={i}
          sx={{
            p: 2, fontSize: 14, fontWeight: 400, lineHeight: "20.02px", letterSpacing: "normal",
            color: INK, borderBottom: `1px solid ${HAIRLINE}`, whiteSpace: "nowrap",
          }}
        >
          {v}
        </TableCell>
      ))}
      <TableCell sx={{ p: 2, borderBottom: `1px solid ${HAIRLINE}` }}>
        <StatusChip status={r.status} />
      </TableCell>
    </TableRow>
  );

  const columns: Array<{ key: SortKey; label: string }> = [
    { key: "batch", label: "Batch" },
    { key: "program", label: "Program" },
    { key: "groups", label: groupsLabel },
    { key: "requestedAt", label: "Requested on" },
    { key: "requestedBy", label: "Requested by" },
  ];

  return (
    <ThemeProvider theme={lightTheme}>
      <Box sx={{ display: "flex", height: "100vh", bgcolor: "#fff", color: INK, overflow: "hidden" }}>
        <NinjaRail items={RAIL_ITEMS} activeSubItem="Manage Guru Requests" />

        <Box sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* Top header bar */}
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="flex-end"
            spacing={1.25}
            sx={{ px: 2.5, py: 1, borderBottom: `1px solid ${HAIRLINE}`, flexShrink: 0 }}
          >
            <IconButton size="small"><BookmarkBorderOutlinedIcon sx={{ color: INK }} /></IconButton>
            <IconButton size="small"><HelpOutlineOutlinedIcon sx={{ color: INK }} /></IconButton>
            <IconButton size="small"><SyncOutlinedIcon sx={{ color: INK }} /></IconButton>
            <IconButton size="small"><NotificationsNoneOutlinedIcon sx={{ color: INK }} /></IconButton>
            <Avatar sx={{ width: 30, height: 30, bgcolor: "#19b899", fontSize: 13, fontWeight: 600 }}>S</Avatar>
          </Stack>

          <Box sx={{ flex: 1, minWidth: 0, overflowY: "auto", px: 3, py: 2.5 }}>
            {/* Header row. The console lays this out as a three-column grid,
                `1fr auto 1fr`, so the tab strip is centred on the container
                rather than sitting after the title — the equal side columns are
                what centre it, whatever the title's length. The border-bottom
                belongs to this row and runs the full content width. */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr auto 1fr",
                alignItems: "center",
                height: 49,
                borderBottom: `1px solid ${HAIRLINE}`,
                mb: 2,
              }}
            >
              <Typography
                component="h1"
                sx={{ fontSize: 16, fontWeight: 500, lineHeight: "28px", letterSpacing: "normal", color: INK }}
              >
                Manage Guru Requests
              </Typography>

              {/* The console gives tabs no hover state at all — the sliding 2px
                  indicator is the whole of the motion. */}
              <Tabs
                value={tab}
                onChange={(_, v) => setTab(v)}
                sx={{
                  minHeight: 48,
                  "& .MuiTabs-indicator": { height: 2, bgcolor: BLUE, transition: `0.3s ${EASE}` },
                }}
              >
                {(["pending", "completed", "cancellations"] as const).map((v) => (
                  <Tab
                    key={v}
                    value={v}
                    label={
                      v === "pending" ? `Pending (${PENDING.length})`
                      : v === "completed" ? `Completed (${COMPLETED.length})`
                      : `Cancellation Requests (${pendingCancellations})`
                    }
                    disableRipple
                    sx={{
                      minHeight: 48,
                      px: 3,
                      py: 1.5,
                      fontSize: 14,
                      fontWeight: 500,
                      lineHeight: "17.5px",
                      letterSpacing: "normal",
                      textTransform: "none",
                      color: INK_SOFT,
                      "&.Mui-selected": { color: BLUE },
                    }}
                  />
                ))}
              </Tabs>

              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <IconButton
                  aria-label="Refresh"
                  sx={{
                    width: 30,
                    height: 30,
                    p: "5px",
                    color: INK_FAINT,
                    transition: `background-color 0.15s ${EASE}`,
                    "&:hover": { bgcolor: WASH },
                  }}
                >
                  <RefreshIcon sx={{ fontSize: 20 }} />
                </IconButton>
              </Box>
            </Box>

            {/* Search sits right-aligned above the table. */}
            <Stack direction="row" justifyContent="flex-end" sx={{ my: 2 }}>
              <TextField
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by program, program code, or batch name"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ fontSize: 20, color: INK_FAINT }} />
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{
                  width: "100%",
                  maxWidth: 640,
                  "& .MuiOutlinedInput-root": {
                    height: 40,
                    borderRadius: "4px",
                    fontSize: 16,
                    letterSpacing: "normal",
                    color: INK,
                    "& fieldset": { borderColor: OUTLINE_REST },
                    "&.Mui-focused fieldset": { borderColor: BLUE, borderWidth: 2 },
                  },
                }}
              />
            </Stack>

            {tab === "cancellations" ? (
              <Paper variant="outlined" sx={{ borderColor: HAIRLINE, borderRadius: "4px", boxShadow: "none", overflowX: "auto", overflowY: "hidden" }}>
                <Table sx={{ borderCollapse: "collapse" }}>
                  <TableHead>
                    <TableRow sx={{ bgcolor: WASH, height: 57.68 }}>
                      {QUEUE_COLUMNS.map((c) => (
                        <TableCell
                          key={c.key}
                          sortDirection={queueSort.key === c.key ? queueSort.dir : false}
                          sx={{
                            p: 2, fontSize: 14, fontWeight: 500, lineHeight: "24px", letterSpacing: "normal",
                            color: INK, borderBottom: `1px solid ${HAIRLINE}`, bgcolor: "transparent", whiteSpace: "nowrap",
                          }}
                        >
                          <TableSortLabel
                            active={queueSort.key === c.key}
                            direction={queueSort.key === c.key ? queueSort.dir : "asc"}
                            onClick={() => toggleQueueSort(c.key)}
                            sx={{
                              "&.Mui-active": { color: INK },
                              "&:hover": { color: INK_SOFT },
                              "& .MuiTableSortLabel-icon": {
                                fontSize: 18,
                                color: `${INK} !important`,
                                transition: `opacity 0.2s ${EASE}, transform 0.2s ${EASE}`,
                              },
                            }}
                          >
                            {c.label}
                          </TableSortLabel>
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {grouped ? (
                      <>
                        {urgentRows.length > 0 && (
                          <SectionRow
                            label="Needs action"
                            count={urgentRows.length}
                            hint={`Sessions in the next ${URGENT_WINDOW_HOURS} hours`}
                            collapsed={isCollapsed("urgent")}
                            onToggle={() => toggleGroup("urgent")}
                          />
                        )}
                        {!isCollapsed("urgent") && urgentRows.map(renderRow)}

                        {laterRows.length > 0 && (
                          <SectionRow
                            label="Pending"
                            count={laterRows.length}
                            hint="Later sessions"
                            collapsed={isCollapsed("later")}
                            onToggle={() => toggleGroup("later")}
                          />
                        )}
                        {!isCollapsed("later") && laterRows.map(renderRow)}

                        {decidedRows.length > 0 && (
                          <SectionRow
                            label="Resolved"
                            count={decidedRows.length}
                            collapsed={isCollapsed("resolved")}
                            onToggle={() => toggleGroup("resolved")}
                          />
                        )}
                        {!isCollapsed("resolved") && decidedPaged.map(renderRow)}
                      </>
                    ) : (
                      queueVisible.map(renderRow)
                    )}
                    {queueVisible.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} sx={{ p: 6, textAlign: "center", fontSize: 14, color: INK_SOFT, borderBottom: "none" }}>
                          {query.trim()
                            ? `Nothing matches “${query}”.`
                            : "Nothing to review yet. When a Guru asks to cancel a session, it shows up here."}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
                {!isCollapsed("resolved") && decidedPageCount > 1 && (
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="flex-end"
                    spacing={2}
                    sx={{ px: 2, py: 1.5, borderTop: `1px solid ${HAIRLINE}` }}
                  >
                    <Typography sx={{ fontSize: 13, color: INK_SOFT, letterSpacing: "normal" }}>
                      Showing {(resolvedPage - 1) * RESOLVED_PAGE_SIZE + 1}–
                      {Math.min(resolvedPage * RESOLVED_PAGE_SIZE, decidedRows.length)} of {decidedRows.length} resolved
                    </Typography>
                    <Pagination
                      page={resolvedPage}
                      count={decidedPageCount}
                      onChange={(_, p) => setResolvedPage(p)}
                      shape="rounded"
                      size="small"
                      sx={{ "& .MuiPaginationItem-root": { fontSize: 13, letterSpacing: "normal" } }}
                    />
                  </Stack>
                )}
              </Paper>
            ) : (
            <Paper variant="outlined" sx={{ borderColor: HAIRLINE, borderRadius: "4px", boxShadow: "none", overflowX: "auto", overflowY: "hidden" }}>
              <Table sx={{ borderCollapse: "collapse" }}>
                <TableHead>
                  {/* The tint belongs to the ROW: <thead> and the cells are both
                      transparent in the console. */}
                  <TableRow sx={{ bgcolor: WASH, height: 57.68 }}>
                    {columns.map((c) => (
                      <TableCell
                        key={c.key}
                        sortDirection={sort.key === c.key ? sort.dir : false}
                        sx={{
                          p: 2,
                          fontSize: 14,
                          fontWeight: 500,
                          lineHeight: "24px",
                          letterSpacing: "normal",
                          color: INK,
                          borderBottom: `1px solid ${HAIRLINE}`,
                          bgcolor: "transparent",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <TableSortLabel
                          active={sort.key === c.key}
                          direction={sort.key === c.key ? sort.dir : "asc"}
                          onClick={() => toggleSort(c.key)}
                          sx={{
                            "&.Mui-active": { color: INK },
                            "&:hover": { color: INK_SOFT },
                            "& .MuiTableSortLabel-icon": {
                              fontSize: 18,
                              color: `${INK} !important`,
                              transition: `opacity 0.2s ${EASE}, transform 0.2s ${EASE}`,
                            },
                          }}
                        >
                          {c.label}
                        </TableSortLabel>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {visible.map((r) => (
                    <TableRow
                      key={r.id}
                      sx={{
                        height: 53,
                        cursor: "pointer",
                        "&:hover": { bgcolor: WASH },
                      }}
                    >
                      {[r.batch, r.program, String(r.groups), fmt(r.requestedAt), r.requestedBy].map((v, i) => (
                        <TableCell
                          key={i}
                          sx={{
                            p: 2,
                            fontSize: 14,
                            fontWeight: 400,
                            lineHeight: "20.02px",
                            letterSpacing: "normal",
                            color: INK,
                            borderBottom: `1px solid ${HAIRLINE}`,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {v}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}

                  {visible.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        sx={{ p: 6, textAlign: "center", fontSize: 14, color: INK_SOFT, borderBottom: "none" }}
                      >
                        No requests match “{query}”.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Paper>
            )}
          </Box>
        </Box>

        <CancellationDrawer
          row={openRow}
          onClose={() => setOpenRow(null)}
          onApprove={approve}
          onReject={reject}
        />
      </Box>
    </ThemeProvider>
  );
}
