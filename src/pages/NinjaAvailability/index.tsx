import { useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";

import { SessionsPanel, EngagementsPanel, NotesPanel, StubPanel } from "./NinjaTabPanels";
import NinjaRail from "./NinjaRail";
import { RAIL_ITEMS } from "./railItems";
import CalendarPage from "@/pages/Calendar";
/* The Guru calendar opens dialogs through the store, and GlobalDialogs is mounted
   by AppLayout — which this full-bleed route sits outside of. Without this the
   calendar would render but every session click would do nothing. */
import { GlobalDialogs } from "@/components/dialogs";
import { ThemeProvider } from "@mui/material/styles";
import { lightTheme } from "@/theme/theme";

import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import VideocamOutlinedIcon from "@mui/icons-material/VideocamOutlined";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import CodeOutlinedIcon from "@mui/icons-material/CodeOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";

import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import SyncOutlinedIcon from "@mui/icons-material/SyncOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import CloseIcon from "@mui/icons-material/Close";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";

/**
 * Pixel-static recreation of Great Learning's internal admin console screen:
 * facilitator "Aashish Chauhan" profile with the Availability tab open (Jun 2026 month grid).
 * This replicates an external tool, so its chrome and visuals are self-contained and
 * intentionally diverge from the project's own design tokens (see /marketing-dashboard
 * for the same documented exception). Static data only, no behavior.
 */

// ---- Static data ----------------------------------------------------------


const SUB_TABS = ["Engagements", "Sessions", "Notes", "Roles", "Contracts", "Calendar"] as const;
type SubTab = (typeof SUB_TABS)[number];

const PERSONAL_DETAILS: Array<{ label: string; value?: string }> = [
  { label: "Industry", value: "-" },
  { label: "Domain", value: "-" },
  { label: "Work Experience", value: "18 Yrs" },
  { label: "Tech Experience", value: "4 Yrs" },
  { label: "Country", value: "-" },
  { label: "Address", value: '"500 w. state st. 2k" illinois usa 62650' },
  { label: "Pincode", value: "-" },
  { label: "Communication skills", value: "Very Good" },
  { label: "Current company", value: "POWER Engineers, Inc." },
  { label: "Current designation", value: "A.I. / M.L. Engineer / Developer" },
  { label: "Demo guru", value: "-" },
];

const REMUNERATIONS: Array<{ label: string; value: string }> = [
  { label: "Type of Association", value: "Part time" },
  { label: "Classroom Teaching($)", value: "-" },
  { label: "Classroom Teaching Per Day($)", value: "-" },
  { label: "Online Mentoring($)", value: "70 / Hr" },
  { label: "Project Mentoring($)", value: "-" },
  { label: "Career Mentoring($)", value: "-" },
  { label: "CV review($)", value: "-" },
  { label: "Moderation($)", value: "-" },
  { label: "Custom Remuneration", value: "-" },
  { label: "Account Number", value: "aashish.chauhan@gmail.com" },
  { label: "Bank Name", value: "PayPal" },
  { label: "Branch Name", value: "-" },
  { label: "Pan Number", value: "-" },
  { label: "Cheque in name", value: "-" },
  { label: "Ifsc vode", value: "-" },
  { label: "GSTIN", value: "-" },
  { label: "Vendor Email", value: "-" },
  { label: "Provide Own Invoice", value: "-" },
];

const SKILLS = ["Data Analytics Python", "Data Visualization:Matplotlib&Seaborn(python)"];

// ---- Style constants ------------------------------------------------------

const BLUE = "#196ae5";
const NAVY = "#1b3a73";
const BORDER = "#e2e6eb";
const TEXT = "#1f2733";
const MUTED = "#5b6573";

// Thin, minimal scrollbar (matches the slim track in the reference UI).
const THIN_SCROLL = {
  scrollbarWidth: "thin" as const,
  scrollbarColor: "#c4cad2 transparent",
  "&::-webkit-scrollbar": { width: 6, height: 6 },
  "&::-webkit-scrollbar-track": { background: "transparent" },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "#c4cad2",
    borderRadius: 999,
  },
  "&::-webkit-scrollbar-thumb:hover": { backgroundColor: "#aab1bb" },
};

// ---- Sub-components --------------------------------------------------------

function DetailRow({ label, value }: { label: string; value?: React.ReactNode }) {
  return (
    <Stack direction="row" spacing={0.75} sx={{ py: 0.45, alignItems: "flex-start" }}>
      <Typography sx={{ fontSize: 13, fontWeight: 600, color: TEXT, whiteSpace: "nowrap" }}>
        {label}:
      </Typography>
      <Typography sx={{ fontSize: 13, color: MUTED }}>{value}</Typography>
    </Stack>
  );
}

function OutlinedPill({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        border: `1px solid ${BORDER}`,
        borderRadius: 999,
        px: 1.25,
        py: 0.4,
        fontSize: 12.5,
        color: TEXT,
      }}
    >
      {children}
    </Box>
  );
}

// ---- Page -----------------------------------------------------------------

export default function NinjaAvailability() {
  const [tab, setTab] = useState<SubTab>("Calendar");

  return (
    <ThemeProvider theme={lightTheme}>
    <Box sx={{ display: "flex", height: "100vh", bgcolor: "#fff", color: TEXT, overflow: "hidden" }}>
      {/* A. Left icon rail + its flyout (measured; see docs/ninja-manage-guru-requests.md) */}
      <NinjaRail items={RAIL_ITEMS} activeSubItem="GL Gurus Catalog" />

      {/* Right of rail: header + workspace */}
      <Box sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        {/* B. Top header bar */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
          spacing={1}
          sx={{ height: 56, px: 2, flexShrink: 0, bgcolor: "#fff" }}
        >
          <IconButton size="small"><BookmarkBorderOutlinedIcon sx={{ color: TEXT }} /></IconButton>
          <IconButton size="small"><HelpOutlineOutlinedIcon sx={{ color: TEXT }} /></IconButton>
          <IconButton size="small"><SyncOutlinedIcon sx={{ color: TEXT }} /></IconButton>
          <IconButton size="small"><NotificationsNoneOutlinedIcon sx={{ color: TEXT }} /></IconButton>
          <Avatar sx={{ width: 30, height: 30, bgcolor: "#19b899", fontSize: 13, fontWeight: 600 }}>
            S
          </Avatar>
        </Stack>

        {/* C. Workspace tab strip */}
        <Stack direction="row" sx={{ bgcolor: "#f4f5f7", px: 1.5, pt: 1, gap: 0.5, flexShrink: 0 }}>
          <Box
            sx={{
              px: 2,
              py: 0.9,
              fontSize: 13,
              color: MUTED,
              cursor: "default",
            }}
          >
            All Facilitators
          </Box>
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{
              px: 2,
              py: 0.9,
              bgcolor: "#fff",
              borderTopLeftRadius: 6,
              borderTopRightRadius: 6,
              border: `1px solid ${BORDER}`,
              borderBottom: "none",
              color: BLUE,
              fontSize: 13,
            }}
          >
            <span>Aashish Chauhan</span>
            <CloseIcon sx={{ fontSize: 15, color: BLUE }} />
          </Stack>
        </Stack>

        {/* D. Body: two columns */}
        <Box sx={{ flex: 1, display: "flex", minHeight: 0, borderTop: `1px solid ${BORDER}` }}>
          {/* Left column: profile + details */}
          <Box
            sx={{
              width: 404,
              flexShrink: 0,
              borderRight: `1px solid ${BORDER}`,
              overflowY: "auto",
              ...THIN_SCROLL,
            }}
          >
            {/* Blue profile header card */}
            <Box sx={{ bgcolor: NAVY, color: "#fff", p: 2.5 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Typography sx={{ fontSize: 20, fontWeight: 700 }}>Aashish Chauhan</Typography>
                <Button
                  startIcon={<EditOutlinedIcon sx={{ fontSize: 15 }} />}
                  sx={{
                    color: "#fff",
                    border: "1px solid rgba(255,255,255,0.7)",
                    borderRadius: "4px",
                    fontSize: 12,
                    px: 1.25,
                    py: 0.3,
                    "&:hover": { borderColor: "#fff", bgcolor: "rgba(255,255,255,0.08)" },
                  }}
                >
                  EDIT
                </Button>
              </Stack>
              <Typography sx={{ fontSize: 13, mt: 0.6, color: "rgba(255,255,255,0.9)" }}>
                aashish.chauhan@gmail.com · 1-7755251845
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
                <Box
                  sx={{
                    bgcolor: "#f0444c",
                    color: "#fff",
                    borderRadius: 999,
                    px: 1.5,
                    py: 0.3,
                    fontSize: 12.5,
                  }}
                >
                  Part time
                </Box>
                <Box
                  sx={{
                    bgcolor: "#3aab5a",
                    color: "#fff",
                    borderRadius: 999,
                    px: 1.5,
                    py: 0.3,
                    fontSize: 12.5,
                  }}
                >
                  Active
                </Box>
              </Stack>
            </Box>

            {/* Personal Details */}
            <Box sx={{ p: 2.5 }}>
              <Typography sx={{ fontSize: 16, fontWeight: 700, mb: 1.25 }}>Personal Details</Typography>
              {PERSONAL_DETAILS.map((row) => (
                <DetailRow key={row.label} label={row.label} value={row.value} />
              ))}

              <DetailRow
                label="Engagement Status"
                value={
                  <Box
                    component="span"
                    sx={{
                      display: "inline-block",
                      border: "1px solid #3aab5a",
                      color: "#2f8f4a",
                      borderRadius: 999,
                      px: 1.1,
                      py: 0.1,
                      fontSize: 12,
                    }}
                  >
                    Active
                  </Box>
                }
              />

              <Stack direction="row" spacing={1} sx={{ py: 0.45, alignItems: "center" }}>
                <Typography sx={{ fontSize: 13, fontWeight: 600, color: TEXT }}>Linkedin Profile:</Typography>
                <Typography sx={{ fontSize: 12, fontWeight: 600, color: BLUE, letterSpacing: 0.3 }}>
                  VIEW PROFILE
                </Typography>
                <ContentCopyOutlinedIcon sx={{ fontSize: 15, color: MUTED }} />
              </Stack>

              <Typography sx={{ fontSize: 13, fontWeight: 600, color: TEXT, mt: 1, mb: 0.6 }}>
                Primary Guru Managers:
              </Typography>
              <OutlinedPill>Monica P (monica.p2@mygreatlearning.com)</OutlinedPill>

              <Typography sx={{ fontSize: 13, fontWeight: 600, color: TEXT, mt: 1.5, mb: 0.6 }}>
                Skills:
              </Typography>
              <Stack spacing={1} alignItems="flex-start">
                {SKILLS.map((s) => (
                  <OutlinedPill key={s}>{s}</OutlinedPill>
                ))}
              </Stack>
            </Box>

            {/* Remunerations details */}
            <Box sx={{ px: 2.5, pb: 4 }}>
              <Typography sx={{ fontSize: 16, fontWeight: 700, mb: 1.25 }}>
                Remunerations details(INR)
              </Typography>
              {REMUNERATIONS.map((row) => (
                <DetailRow key={row.label} label={row.label} value={row.value} />
              ))}
            </Box>
          </Box>

          {/* Right column: tabs + availability calendar */}
          <Box sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
            {/* Sub-tabs */}
            <Stack
              direction="row"
              spacing={3}
              sx={{ px: 2.5, pt: 1.25, borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}
            >
              {SUB_TABS.map((t) => {
                const active = t === tab;
                return (
                  <Box
                    key={t}
                    onClick={() => setTab(t)}
                    sx={{
                      pb: 1,
                      fontSize: 14,
                      color: active ? BLUE : MUTED,
                      fontWeight: active ? 600 : 400,
                      borderBottom: active ? `2px solid ${BLUE}` : "2px solid transparent",
                      cursor: "pointer",
                      userSelect: "none",
                    }}
                  >
                    {t}
                  </Box>
                );
              })}
            </Stack>

            <Box sx={{ p: 2.5, flex: 1, overflowY: "auto", ...THIN_SCROLL }}>
              {tab === "Engagements" && <EngagementsPanel />}
              {tab === "Sessions" && <SessionsPanel />}
              {tab === "Notes" && <NotesPanel />}
              {(tab === "Roles" || tab === "Contracts") && <StubPanel name={tab} />}

              {tab === "Calendar" && (
                /* The Guru calendar itself, not a lookalike: the manager gets the
                   same week/day/month views, drag-to-mark, leave editing and
                   session drawers the Guru has. It sizes itself to the viewport,
                   so the tab gives it a height to fill instead. */
                <Box sx={{ height: "100%", minHeight: 620, "& > *": { height: "100%" } }}>
                  <CalendarPage managerView />
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Box>

      <GlobalDialogs />
    </Box>
    </ThemeProvider>
  );
}
