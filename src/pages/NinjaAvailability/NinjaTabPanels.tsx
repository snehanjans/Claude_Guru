import { useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import CloudDoneOutlinedIcon from "@mui/icons-material/CloudDoneOutlined";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import NoteAddOutlinedIcon from "@mui/icons-material/NoteAddOutlined";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";

/**
 * The console's other Gurus tabs. Content mirrors the internal tool rather than
 * this project's design language, for the reason given on the page component.
 *
 * Roles and Contracts are stubs: both error out in the console itself
 * ("Something went wrong"), so there is nothing to copy yet.
 */

const BLUE = "#196ae5";
const BORDER = "#e2e6eb";
const MUTED = "#5b6573";
const GREEN = "#1a8a4b";
/* Session cards: the kind/batch line is navy and only its cloud icon is green,
   and the two link buttons carry a blue-tinted border rather than the grey one
   used elsewhere on the page. */
const NAVY = "#1b3a73";
const BTN_BORDER = "#bfd6f6";
const ICON_BG = "#f1f3f5";
/* Measured off the console with devtools rather than guessed: it sets body and
   secondary text as alpha-on-near-black, and uses no extra tracking anywhere —
   an earlier pass here was a size or two large, a weight heavy and letter-spaced,
   which is what made the cards read as a different design. */
const INK = "rgba(33, 33, 33, 0.92)";
const INK_SOFT = "rgba(33, 33, 33, 0.72)";

// ---- Sessions ---------------------------------------------------------------

type GuruSession = {
  id: string;
  kind: string;
  batch: string;
  title: string;
  from: string;
  to: string;
  learners: number;
  submitted: number;
};

const SCHEDULED_SESSIONS: GuruSession[] = [
  {
    id: "s1", kind: "MODERATION", batch: "PGP DSBA JUNE 23",
    title: "PGP DSBA June 23 Career Enhancement · SQL Project - Guided.....",
    from: "Mar 25, 2027", to: "Jun 30, 2027", learners: 36, submitted: 0,
  },
  {
    id: "s2", kind: "MODERATION", batch: "PGPDSBA ONLINE JAN22",
    title: "PGPDSBA Program Overview New Online Jan22 · Azure Labs",
    from: "Oct 31, 2026", to: "Mar 01, 2027", learners: 85, submitted: 0,
  },
  {
    id: "s3", kind: "MODERATION", batch: "MIT-IDSS-DSML MARCH23",
    title: "MIT-IDSS-DSML-March23 Foundations Of Data Science · Graded Individual Assignment - 001",
    from: "Sep 17, 2026", to: "Sep 30, 2026", learners: 0, submitted: 0,
  },
];

function SessionCardRow({ s }: { s: GuruSession }) {
  const pct = s.learners > 0 ? (s.submitted / s.learners) * 100 : 100;
  return (
    <Box
      sx={{
        border: `1px solid ${BORDER}`,
        borderRadius: "8px",
        p: 2.5,
        mb: 2.5,
        display: "flex",
        gap: 2,
        bgcolor: "#fff",
      }}
    >
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          bgcolor: ICON_BG,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <AssignmentTurnedInOutlinedIcon sx={{ fontSize: 20, color: INK }} />
      </Box>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.25 }}>
          <CloudDoneOutlinedIcon sx={{ fontSize: 16, color: "#37b24d" }} />
          <Typography sx={{ fontSize: 12, fontWeight: 600, color: NAVY, letterSpacing: "normal" }}>
            {s.kind} · {s.batch}
          </Typography>
        </Stack>

        <Typography sx={{ fontSize: 14, fontWeight: 500, color: INK, mb: 0.75, lineHeight: "22px", letterSpacing: "normal" }}>
          {s.title}
        </Typography>

        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
          <Typography sx={{ fontSize: 12, color: INK_SOFT, lineHeight: "20px", letterSpacing: "normal" }}>
            {s.from} - {s.to} · {s.learners} {s.learners === 1 ? "Learner" : "Learners"} ·
          </Typography>
          <LinearProgress
            variant="determinate"
            value={pct}
            sx={{
              width: 64,
              height: 7,
              borderRadius: 99,
              bgcolor: "#c5dcf7",
              "& .MuiLinearProgress-bar": { bgcolor: BLUE, borderRadius: 99 },
            }}
          />
          <Typography sx={{ fontSize: 12, color: INK_SOFT, lineHeight: "20px", letterSpacing: "normal" }}>
            {s.submitted}/{s.learners} Submitted
          </Typography>
        </Stack>

        <Stack direction="row" spacing={1.25}>
          {["QC Link", "Speedgrader"].map((l) => (
            <Button
              key={l}
              sx={{
                border: `1px solid ${BTN_BORDER}`,
                borderRadius: "4px",
                color: BLUE,
                fontSize: 13,
                fontWeight: 500,
                letterSpacing: "normal",
                textTransform: "uppercase",
                px: 1.75,
                py: 0.6,
                lineHeight: 1.6,
                "&:hover": { bgcolor: "#eef5ff", borderColor: BLUE },
              }}
            >
              {l}
            </Button>
          ))}
        </Stack>
      </Box>

      <NoteAddOutlinedIcon sx={{ fontSize: 20, color: INK_SOFT, flexShrink: 0 }} />
    </Box>
  );
}

export function SessionsPanel() {
  const [sub, setSub] = useState<"SCHEDULED" | "COMPLETED">("SCHEDULED");
  return (
    <Box>
      <Typography sx={{ fontSize: 18, fontWeight: 600, color: INK, mb: 1.5, letterSpacing: "normal" }}>Guru Sessions</Typography>
      <Stack direction="row" spacing={3} sx={{ borderBottom: `1px solid ${BORDER}`, mb: 2 }}>
        {(["SCHEDULED", "COMPLETED"] as const).map((t) => (
          <Box
            key={t}
            onClick={() => setSub(t)}
            sx={{
              pb: 1, fontSize: 14, fontWeight: 500, letterSpacing: "normal", cursor: "pointer",
              color: sub === t ? BLUE : MUTED,
              borderBottom: sub === t ? `2px solid ${BLUE}` : "2px solid transparent",
            }}
          >
            {t}
          </Box>
        ))}
      </Stack>
      {sub === "SCHEDULED" ? (
        SCHEDULED_SESSIONS.map((s) => <SessionCardRow key={s.id} s={s} />)
      ) : (
        <EmptyState title="No completed sessions" body="Sessions show up here once they've finished." />
      )}
    </Box>
  );
}

// ---- Engagements ------------------------------------------------------------

const ENGAGEMENT_HOURS = [
  { m: "Dec 25", Course: 0, Career: 0 }, { m: "Jan 26", Course: 0, Career: 0 },
  { m: "Feb 26", Course: 0, Career: 0 }, { m: "Mar 26", Course: 0, Career: 0 },
  { m: "Apr 26", Course: 0, Career: 0 }, { m: "May 26", Course: 0, Career: 0 },
  { m: "Jun 26", Course: 0, Career: 0 }, { m: "Jul 26", Course: 0, Career: 0 },
  { m: "Aug 26", Course: 0, Career: 0 }, { m: "Sep 26", Course: 0, Career: 0 },
];

const MODERATION_DATA = [
  { m: "Sep 25", assigned: 0, graded: 0 }, { m: "Oct 25", assigned: 0, graded: 0 },
  { m: "Nov 25", assigned: 0, graded: 0 }, { m: "Dec 25", assigned: 0, graded: 0 },
  { m: "Jan 26", assigned: 0, graded: 0 }, { m: "Feb 26", assigned: 0, graded: 0 },
  { m: "Mar 26", assigned: 0, graded: 0 }, { m: "Apr 26", assigned: 0, graded: 0 },
  { m: "May 26", assigned: 0, graded: 0 }, { m: "Jun 26", assigned: 0, graded: 0 },
  { m: "Jul 26", assigned: 0, graded: 0 }, { m: "Aug 26", assigned: 4, graded: 0 },
];

const PERFORMANCE = [
  { program: "PGPCC", course: "Cloud Foundations", meta: "1 Sessions · 1 Reviews", score: 4 },
  { program: "PGP-DSBA", course: "Program Overview-DSBA-UT", meta: "2 Sessions · 2 Reviews", score: 5 },
];

export function EngagementsPanel() {
  return (
    <Box>
      <Typography sx={{ fontSize: 13, color: MUTED, mb: 1.5 }}>Last 1 Year</Typography>

      <Box sx={{ border: `1px solid ${BORDER}`, borderRadius: "4px", mb: 3 }}>
        <Box sx={{ display: "flex", px: 2, py: 1.25, borderBottom: `1px solid ${BORDER}` }}>
          <Box sx={{ flex: 1 }} />
          {["Rating", "Engagement Hours", "Engagement Count", "Learners Attended"].map((h) => (
            <Typography key={h} sx={{ flex: 1, fontSize: 12.5, fontWeight: 600, textAlign: "center" }}>
              {h}
            </Typography>
          ))}
        </Box>
        <Box sx={{ display: "flex", px: 2, py: 1.5, alignItems: "center" }}>
          <Typography sx={{ flex: 1, fontSize: 13.5, fontWeight: 600 }}>Mentoring</Typography>
          {["4.67", "0", "3", "1"].map((v, i) => (
            <Typography key={i} sx={{ flex: 1, fontSize: 13.5, textAlign: "center" }}>{v}</Typography>
          ))}
        </Box>
      </Box>

      <Typography sx={{ fontSize: 15, fontWeight: 700, mb: 1.25 }}>Performance</Typography>
      <Box sx={{ border: `1px solid ${BORDER}`, borderRadius: "4px", mb: 3 }}>
        {PERFORMANCE.map((p, i) => (
          <Stack
            key={p.program}
            direction="row"
            alignItems="center"
            sx={{ px: 2, py: 1.5, borderTop: i ? `1px solid ${BORDER}` : "none" }}
          >
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ fontSize: 12, color: MUTED }}>{p.program}</Typography>
              <Typography sx={{ fontSize: 13.5, fontWeight: 600 }}>{p.course}</Typography>
              <Typography sx={{ fontSize: 12, color: MUTED }}>{p.meta}</Typography>
            </Box>
            <Typography sx={{ fontSize: 16, fontWeight: 700 }}>{p.score}</Typography>
          </Stack>
        ))}
      </Box>

      <ChartCard title="Engagement Count (in Hrs)">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={ENGAGEMENT_HOURS}>
            <CartesianGrid strokeDasharray="3 3" stroke={BORDER} vertical={false} />
            <XAxis dataKey="m" tick={{ fontSize: 11, fill: MUTED }} />
            <YAxis tick={{ fontSize: 11, fill: MUTED }} tickFormatter={(v) => `${v} Hrs`} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="Course" fill={BLUE} />
            <Bar dataKey="Career" fill="#8b5cf6" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Completed Moderations Data">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={MODERATION_DATA}>
            <CartesianGrid strokeDasharray="3 3" stroke={BORDER} vertical={false} />
            <XAxis dataKey="m" tick={{ fontSize: 11, fill: MUTED }} />
            <YAxis tick={{ fontSize: 11, fill: MUTED }} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="assigned" name="Number of assessments assigned" fill={BLUE} />
            <Bar dataKey="graded" name="Number of learners graded" fill={GREEN} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </Box>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Box sx={{ border: `1px solid ${BORDER}`, borderRadius: "4px", p: 2, mb: 3 }}>
      <Typography sx={{ fontSize: 13.5, fontWeight: 600, mb: 1.5 }}>{title}</Typography>
      {children}
    </Box>
  );
}

// ---- Notes ------------------------------------------------------------------

export function NotesPanel() {
  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography sx={{ fontSize: 18, fontWeight: 700 }}>Notes</Typography>
        <Button
          startIcon={<NoteAddOutlinedIcon sx={{ fontSize: 16 }} />}
          sx={{
            color: BLUE, border: `1px solid ${BLUE}`, borderRadius: "4px",
            fontSize: 13, fontWeight: 600, px: 1.5, "&:hover": { bgcolor: "#e7f0ff" },
          }}
        >
          NOTE
        </Button>
      </Stack>
      <EmptyState
        title="No Notes Added"
        body="It looks like no notes have been added yet. Please add notes as needed or check back later."
      />
    </Box>
  );
}

// ---- Roles / Contracts (stubs) ----------------------------------------------

export function StubPanel({ name }: { name: string }) {
  return (
    <EmptyState
      title={`${name} isn't ready yet`}
      body={`${name} isn't loading in the console at the moment, so there was nothing to copy from. We'll build it once it is.`}
    />
  );
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <Box sx={{ textAlign: "center", py: 8, px: 3 }}>
      <Typography sx={{ fontSize: 16, fontWeight: 600, mb: 1 }}>{title}</Typography>
      <Typography sx={{ fontSize: 13.5, color: MUTED, maxWidth: 420, mx: "auto" }}>{body}</Typography>
    </Box>
  );
}
