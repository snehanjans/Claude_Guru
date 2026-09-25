import { useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { ThemeProvider } from "@mui/material/styles";
import { useParams, useSearchParams } from "react-router-dom";

import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import SyncOutlinedIcon from "@mui/icons-material/SyncOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import ChecklistOutlinedIcon from "@mui/icons-material/ChecklistOutlined";

import { lightTheme } from "@/theme/theme";
import NinjaRail from "@/pages/NinjaAvailability/NinjaRail";
import { RAIL_ITEMS } from "@/pages/NinjaAvailability/railItems";
import { demoCancellationQueue } from "@/data/demo-cancellation-queue";
import ActivityCard from "./ActivityCard";

/**
 * Batch › Engagement, as the console lays it out: an indigo batch card and
 * Basic Details down the left, Batch Activities down the right.
 *
 * Approving a cancellation does not free the session on its own. Somebody still
 * has to put another Guru on the activity or cancel it, and that happens here,
 * so the hand-off from the Ops queue lands on the screen where the work is. The
 * activity in question is listed plainly, with no treatment of its own — it
 * reads as one of the batch's activities, because that is what it is.
 *
 * Measured off staging with devtools. Two controls resisted a clean selector,
 * the activities filter and its refresh button, so those carry the page's own
 * tokens rather than their own readings.
 */

const BLUE = "rgb(25, 106, 229)";
const BLUE_DEEP = "rgb(15, 64, 137)";
const INDIGO = "rgb(57, 73, 171)";
const INK = "rgba(33, 33, 33, 0.92)";
const INK_SOFT = "rgba(33, 33, 33, 0.72)";
const ON_INDIGO = "rgba(255, 255, 255, 0.72)";
const HAIRLINE = "rgba(33, 33, 33, 0.06)";
const WASH = "rgba(33, 33, 33, 0.04)";
const EASE = "cubic-bezier(0.4, 0, 0.2, 1)";

/** The left column is a fixed 454px; activities take the rest. */
const LEFT_W = 454;

const BATCH_TABS = ["Engagement", "Learners", "Groups", "Courses", "Content Delivery", "More"];

const BASIC_DETAILS: Array<[string, string]> = [
  ["Program Type", "Regular"],
  ["Batch SIS ID", "AIMentorTestingBatch1"],
  ["Program Code", "AIMentorTestingProgram"],
  ["Specialisations", "-"],
  ["Support Email", "admissions_support@greatlearning.in"],
  ["Support Phone", "+91 8448092407 / +91 8448092043 / +91 8448498157"],
  ["WhatsApp Group Set", "Not set"],
];

const CARD_ACTIONS = [
  { label: "GRADEBOOK DATA", Icon: DownloadOutlinedIcon },
  { label: "COMPLETION CRITERIA", Icon: ChecklistOutlinedIcon },
  { label: "VIEW AS LEARNER", Icon: VisibilityOutlinedIcon },
  { label: "SCHEDULE A CALL", Icon: ContentCopyOutlinedIcon },
];

export default function NinjaBatchPage() {
  const { batchId } = useParams();
  const [params] = useSearchParams();
  const [sub, setSub] = useState<"scheduled" | "completed">("scheduled");

  /* The queue passes the request along so the activity that prompted the
     hand-off is the one shown, rather than leaving Ops to hunt for it. */
  const request = demoCancellationQueue.find((q) => q.id === params.get("request"));
  const batchName = request?.batch ?? "AIMentorTestingBatch";

  const metaFor = (iso: string) => {
    const d = new Date(iso);
    return `${d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })} · 2 hr · Mandatory · Zoom · Meeting`;
  };

  return (
    <ThemeProvider theme={lightTheme}>
      <Box sx={{ display: "flex", height: "100vh", bgcolor: "#fff", color: INK, overflow: "hidden" }}>
        <NinjaRail items={RAIL_ITEMS} activeLabel="Batches" />

        <Box sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* Top bar carries the batch name on this screen, not just the icons. */}
          <Stack direction="row" alignItems="center" spacing={1.25} sx={{ px: 2, py: 1.25, flexShrink: 0 }}>
            <Typography sx={{ fontSize: 16, fontWeight: 500, lineHeight: "28px", color: INK, letterSpacing: "normal", flex: 1 }}>
              {batchName}
            </Typography>
            <IconButton size="small"><BookmarkBorderOutlinedIcon sx={{ color: INK }} /></IconButton>
            <IconButton size="small"><HelpOutlineOutlinedIcon sx={{ color: INK }} /></IconButton>
            <IconButton size="small"><SyncOutlinedIcon sx={{ color: INK }} /></IconButton>
            <IconButton size="small"><NotificationsNoneOutlinedIcon sx={{ color: INK }} /></IconButton>
            <Avatar sx={{ width: 32, height: 32, bgcolor: "rgb(29, 201, 169)", fontSize: 13, fontWeight: 600 }}>S</Avatar>
          </Stack>

          <Stack direction="row" sx={{ borderBottom: `1px solid ${HAIRLINE}`, flexShrink: 0 }}>
            {BATCH_TABS.map((t, i) => (
              <Box
                key={t}
                sx={{
                  px: 2, py: 1.5, minHeight: 40, boxSizing: "border-box",
                  fontSize: 14, fontWeight: 500, lineHeight: "17.5px", letterSpacing: "normal", cursor: "pointer",
                  color: i === 0 ? BLUE : INK_SOFT,
                  borderBottom: i === 0 ? `2px solid ${BLUE}` : "2px solid transparent",
                }}
              >
                {t}{t === "More" ? " ▾" : ""}
              </Box>
            ))}
          </Stack>

          <Box sx={{ flex: 1, minWidth: 0, overflowY: "auto", px: 1, py: 1 }}>
            <Stack direction="row" spacing={2} alignItems="flex-start">
              {/* LEFT: batch card + basic details */}
              <Box sx={{ width: LEFT_W, flexShrink: 0 }}>
                <Box sx={{ bgcolor: INDIGO, color: "#fff", p: 3, borderRadius: "8px 8px 0 0" }}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <BookmarkBorderOutlinedIcon sx={{ fontSize: 22 }} />
                    <Typography sx={{ fontSize: 24, fontWeight: 600, lineHeight: "28px", letterSpacing: "normal" }}>
                      {batchName}
                    </Typography>
                  </Stack>

                  <Stack direction="row" spacing={1} sx={{ mt: 1.25 }}>
                    {["Active", "Mentored", "Combined"].map((c, i) => (
                      <Box
                        key={c}
                        sx={{
                          height: 24, display: "flex", alignItems: "center", px: 1.25,
                          borderRadius: "16px", fontSize: 12, fontWeight: 600, letterSpacing: "normal",
                          bgcolor: i === 0 ? "#fff" : "rgba(255,255,255,0.18)",
                          color: i === 0 ? INDIGO : "#fff",
                        }}
                      >
                        {c}
                      </Box>
                    ))}
                  </Stack>

                  <Typography sx={{ fontSize: 14, lineHeight: "20.02px", color: ON_INDIGO, mt: 2, letterSpacing: "normal" }}>
                    {request?.program ?? "AI Mentor Testing Program"} · 7 Courses
                  </Typography>
                  <Typography sx={{ fontSize: 14, lineHeight: "20.02px", color: ON_INDIGO, mt: 0.5, letterSpacing: "normal" }}>
                    Tue, Apr 21, 2026 - Wed, Mar 31, 2027
                  </Typography>

                  <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5, mt: 2 }}>
                    {CARD_ACTIONS.map(({ label, Icon }) => (
                      <Button
                        key={label}
                        startIcon={<Icon sx={{ fontSize: 18 }} />}
                        sx={{
                          border: "1px solid #fff", borderRadius: "4px", color: "#fff",
                          fontSize: 14, fontWeight: 500, lineHeight: "24.5px", px: "15px", py: "5px",
                          letterSpacing: "normal", whiteSpace: "nowrap",
                          "&:hover": { bgcolor: "rgba(255,255,255,0.12)" },
                        }}
                      >
                        {label}
                      </Button>
                    ))}
                  </Box>
                </Box>

                <Box sx={{ border: `1px solid ${HAIRLINE}`, borderTop: "none", borderRadius: "0 0 8px 8px" }}>
                  <Typography sx={{ fontSize: 16, fontWeight: 500, lineHeight: "28px", color: INK, letterSpacing: "normal", px: 2, py: 1.5 }}>
                    Basic Details
                  </Typography>
                  {BASIC_DETAILS.map(([label, value], i) => (
                    <Stack
                      key={label}
                      direction="row"
                      spacing={1}
                      sx={{ px: 2, py: 1, bgcolor: i % 2 === 0 ? WASH : "transparent" }}
                    >
                      <Typography sx={{ fontSize: 14, lineHeight: "21.98px", color: INK_SOFT, width: 136, flexShrink: 0, letterSpacing: "normal" }}>
                        {label}
                      </Typography>
                      <Typography sx={{ fontSize: 14, lineHeight: "20.02px", color: INK, letterSpacing: "normal" }}>
                        {value}
                      </Typography>
                    </Stack>
                  ))}
                </Box>
              </Box>

              {/* RIGHT: batch activities */}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 0.5 }}>
                  <Typography sx={{ fontSize: 18, fontWeight: 600, lineHeight: "24.012px", color: INK, letterSpacing: "normal", flex: 1 }}>
                    Batch Activities
                  </Typography>
                  <Button
                    startIcon={<AddIcon sx={{ fontSize: 18 }} />}
                    sx={{
                      border: `1px solid rgba(25, 106, 229, 0.5)`, borderRadius: "4px", color: BLUE,
                      fontSize: 13, fontWeight: 500, lineHeight: "22.75px", px: 2, py: "3px",
                      letterSpacing: "normal",
                      "&:hover": { border: `1px solid ${BLUE}`, bgcolor: "rgba(25, 106, 229, 0.04)" },
                    }}
                  >
                    ACTIVITY
                  </Button>
                  <IconButton size="small" sx={{ color: INK }}><MoreVertIcon /></IconButton>
                </Stack>

                <Tabs
                  value={sub}
                  onChange={(_, v) => setSub(v)}
                  sx={{
                    minHeight: 40,
                    borderBottom: `1px solid ${HAIRLINE}`,
                    mb: 2,
                    "& .MuiTabs-indicator": { height: 2, bgcolor: BLUE, transition: `0.3s ${EASE}` },
                  }}
                >
                  {(["scheduled", "completed"] as const).map((v) => (
                    <Tab
                      key={v}
                      value={v}
                      disableRipple
                      label={v === "scheduled" ? "Scheduled" : "Completed"}
                      sx={{
                        minHeight: 40, px: 2, py: 1.5, fontSize: 14, fontWeight: 500, lineHeight: "17.5px",
                        letterSpacing: "normal", textTransform: "none", color: INK_SOFT,
                        "&.Mui-selected": { color: BLUE },
                      }}
                    />
                  ))}
                </Tabs>

                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                  <Select
                    size="small"
                    value="all"
                    sx={{ fontSize: 14, height: 40, minWidth: 180, borderRadius: "4px", "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(0,0,0,0.23)" } }}
                  >
                    <MenuItem value="all" sx={{ fontSize: 14 }}>All Activities</MenuItem>
                  </Select>
                  <IconButton
                    aria-label="Refresh"
                    sx={{
                      border: `1px solid rgba(25, 106, 229, 0.5)`, borderRadius: "4px", color: BLUE, width: 44, height: 40,
                      transition: `background-color 0.15s ${EASE}`, "&:hover": { bgcolor: "rgba(25, 106, 229, 0.04)" },
                    }}
                  >
                    <RefreshIcon sx={{ fontSize: 20 }} />
                  </IconButton>
                </Stack>

                {sub === "scheduled" ? (
                  <>
                    <Typography
                      sx={{ fontSize: 10, fontWeight: 600, lineHeight: "16.6px", letterSpacing: "0.833px", textTransform: "uppercase", color: BLUE, mb: 1 }}
                    >
                      Ongoing activity
                    </Typography>
                    {request && (
                      <ActivityCard
                        kind={`${request.sessionType} · Batch · ${request.program}`}
                        title={request.sessionTitle}
                        meta={metaFor(request.sessionAt)}
                      />
                    )}
                    <ActivityCard
                      kind="Online class · Batch · Program overview"
                      title="engagement"
                      meta="Fri, Sep 25 · 2 hr · Mandatory · Zoom · Meeting"
                    />
                  </>
                ) : (
                  <Typography sx={{ fontSize: 14, color: INK_SOFT, py: 6, textAlign: "center", letterSpacing: "normal" }}>
                    Nothing completed in this batch yet.
                  </Typography>
                )}
              </Box>
            </Stack>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
