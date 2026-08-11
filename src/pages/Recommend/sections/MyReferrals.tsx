import { Fragment, useEffect, useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/material/styles";
import type { SxProps, Theme } from "@mui/material/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import GroupAddOutlinedIcon from "@mui/icons-material/GroupAddOutlined";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import { fmtDateNice, fmtMoney, toYmd } from "@/lib/helpers";
import { type StatusVariant } from "@/components/shared/StatusChip";
import { EmptyState } from "@/components/shared/EmptyState";
import { demoAmbassadorPrograms, GURU_CURRENCY, toGuruCurrency } from "@/data/demo-ambassador";
import type { AmbassadorProgram, AmbassadorReferral } from "@/lib/types";
import { useRecommend } from "../RecommendContext";

const EASE_OUT = "cubic-bezier(0.23, 1, 0.32, 1)";
const TABULAR = { fontVariantNumeric: "tabular-nums" as const };

/* ── Time-window filter for the referral list ─────────────────────────── */
type Period = "30d" | "3m" | "6m" | "all";

const PERIOD_OPTIONS: { value: Period; label: string }[] = [
  { value: "30d", label: "Last 30 days" },
  { value: "3m", label: "Last 3 months" },
  { value: "6m", label: "Last 6 months" },
  { value: "all", label: "All time" },
];

const PERIOD_SUFFIX: Record<Period, string> = {
  "30d": "in the last 30 days",
  "3m": "in the last 3 months",
  "6m": "in the last 6 months",
  all: "all time",
};

// Inclusive lower bound (YYYY-MM-DD) for the window, or null for "all".
// ISO date strings compare lexicographically, so we filter on the string.
function cutoffYmd(period: Period): string | null {
  if (period === "all") return null;
  const d = new Date();
  if (period === "30d") d.setDate(d.getDate() - 30);
  else d.setMonth(d.getMonth() - (period === "3m" ? 3 : 6));
  return toYmd(d);
}

const PROGRAM_BY_ID = new Map<string, AmbassadorProgram>(demoAmbassadorPrograms.map((p) => [p.id, p]));

// A reward and a checkout path only exist once the learner has actually
// enrolled — before that (sent / contacted) the lead is still in progress.
const isEnrolled = (r: AmbassadorReferral) =>
  r.status === "enrolled" || r.status === "confirmed" || r.status === "paid";

/** AINP-only checkout-path label that also explains the rate, e.g. "Self-checkout · 20%". */
function pathLabel(r: AmbassadorReferral, program?: AmbassadorProgram): string | null {
  if (!isEnrolled(r) || !r.conversionPath) return null;
  const isSelf = r.conversionPath === "self_checkout";
  const pct = isSelf ? program?.bonusPctSelfCheckout : program?.bonusPctAssisted;
  const name = isSelf ? "Self-checkout" : "Assisted";
  return pct != null ? `${name} · ${pct}%` : name;
}

type S = AmbassadorReferral["status"];

const STATUS_META: Record<
  S,
  { variant: StatusVariant; dot: string; label: (r: AmbassadorReferral) => string; chipSx?: SxProps<Theme> }
> = {
  sent: {
    variant: "missed",
    dot: "var(--gl-status-missed-text)",
    label: () => "Sent",
  },
  contacted: {
    variant: "scheduled",
    dot: "var(--gl-status-scheduled-text)",
    label: () => "GL reached out",
  },
  enrolled: {
    variant: "completed",
    dot: "var(--gl-status-completed-text)",
    label: () => "Enrolled",
  },
  confirmed: {
    variant: "confirmed",
    dot: "var(--gl-status-confirmed-text)",
    label: () => "Payout confirmed",
  },
  paid: {
    variant: "confirmed",
    dot: "var(--gl-status-confirmed-text)",
    label: (r) => `Paid on ${r.paidYmd ? fmtDateNice(r.paidYmd) : "—"}`,
    // filled emerald money chip (theme-safe text color)
    chipSx: {
      bgcolor: "var(--gl-status-confirmed-text)",
      color: (t: Theme) => (t.palette.mode === "dark" ? t.palette.grey[900] : t.palette.common.white),
      borderColor: "transparent",
      fontWeight: 700,
    },
  },
  not_eligible: {
    variant: "missed",
    dot: "var(--gl-status-missed-text)",
    label: () => "Not eligible",
    chipSx: { bgcolor: "transparent" },
  },
  not_converted: {
    variant: "missed",
    dot: "var(--gl-status-missed-text)",
    label: () => "Not converted",
    chipSx: { bgcolor: "transparent" },
  },
};

// Bonuses are credited in the guru's base currency (India-based guru → INR),
// converting from the learner's payment currency.
const rewardText = (r: AmbassadorReferral) =>
  isEnrolled(r) ? fmtMoney(toGuruCurrency(r.reward, r.currency), GURU_CURRENCY) : "—";

/* ── Referral row ─────────────────────────────────────────────────────── */
function ReferralRow({ r, highlighted }: { r: AmbassadorReferral; highlighted: boolean }) {
  const [open, setOpen] = useState(false);
  const meta = STATUS_META[r.status];
  const isNotEligible = r.status === "not_eligible";
  const isNotConverted = r.status === "not_converted";
  const hasReason = isNotEligible || isNotConverted;
  const program = PROGRAM_BY_ID.get(r.programId);
  const path = pathLabel(r, program);

  return (
    <ListItem
      disablePadding
      sx={{
        display: "block",
        px: { xs: 1.5, sm: 2 },
        py: 1.25,
        bgcolor: highlighted ? (t) => alpha(t.palette.primary.main, 0.12) : "transparent",
        transition: "background-color 1200ms ease",
        "@media (prefers-reduced-motion: reduce)": { transition: "none" },
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1.5}>
        {/* status dot */}
        <Box
          aria-hidden
          sx={{
            flexShrink: 0,
            width: 9,
            height: 9,
            borderRadius: "50%",
            bgcolor: meta.dot,
            ...(hasReason && { bgcolor: "transparent", border: "1.5px solid", borderColor: meta.dot }),
          }}
        />

        {/* learner + program */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.3 }} noWrap>
            {r.learner}
            {r.learnerCountry && (
              <Box component="span" sx={{ ml: 0.75, fontWeight: 500, fontSize: "0.75rem", color: "text.secondary" }}>
                · {r.learnerCountry}
              </Box>
            )}
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap sx={{ display: "block" }}>
            {program?.title ?? "Program"}
          </Typography>
          {path && (
            <Typography
              variant="caption"
              sx={{ display: "block", color: "text.secondary", fontWeight: 600, ...TABULAR }}
            >
              {path}
            </Typography>
          )}
        </Box>

        {/* reward */}
        <Typography
          variant="body2"
          sx={{
            fontWeight: 700,
            minWidth: 52,
            textAlign: "right",
            ...TABULAR,
            color: rewardText(r) === "—" ? "text.disabled" : "text.primary",
          }}
        >
          {rewardText(r)}
        </Typography>

        {/* expand toggle for not-eligible / not-converted reason */}
        {hasReason && (
          <IconButton
            size="small"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Hide reason" : "Show reason"}
            aria-expanded={open}
            sx={{
              transition: `transform 200ms ${EASE_OUT}`,
              transform: open ? "rotate(180deg)" : "none",
              "@media (prefers-reduced-motion: reduce)": { transition: "none" },
            }}
          >
            <ExpandMoreIcon fontSize="small" />
          </IconButton>
        )}
      </Stack>

      {hasReason && (
        <Collapse in={open} unmountOnExit>
          <Box
            sx={{
              mt: 1,
              ml: 3,
              p: 1.25,
              borderRadius: "10px",
              bgcolor: "var(--gl-status-missed-bg)",
              border: "1px solid var(--gl-status-missed-border)",
            }}
          >
            <Typography variant="body2" sx={{ color: "var(--gl-status-missed-text)", lineHeight: 1.5 }}>
              {isNotEligible
                ? (r.notEligibleReason ?? "This referral was not eligible for a reward.")
                : (r.notConvertedReason ?? "The LC reached out, but this learner didn't enroll.")}
            </Typography>
          </Box>
        </Collapse>
      )}
    </ListItem>
  );
}

/* ── Section ──────────────────────────────────────────────────────────── */
export function MyReferralsSection() {
  const { referrals, highlightId, setActiveTab } = useRecommend();
  const [glow, setGlow] = useState(false);
  const [period, setPeriod] = useState<Period>("30d");

  // one-shot highlight pulse for a freshly-added referral
  useEffect(() => {
    if (!highlightId) {
      setGlow(false);
      return;
    }
    setGlow(true);
    const t = setTimeout(() => setGlow(false), 1500);
    return () => clearTimeout(t);
  }, [highlightId]);

  // Narrow the list to the selected time window (by referral date).
  const visible = useMemo(() => {
    const cutoff = cutoffYmd(period);
    return cutoff ? referrals.filter((r) => r.dateYmd >= cutoff) : referrals;
  }, [referrals, period]);

  // Learners who actually enrolled in the window (enrolled → confirmed → paid).
  const enrolledCount = useMemo(
    () =>
      visible.filter(
        (r) => r.status === "enrolled" || r.status === "confirmed" || r.status === "paid",
      ).length,
    [visible],
  );

  // Classify the windowed referrals: converted (enrolled → confirmed → paid), in
  // progress (sent / contacted), and closed without a bonus (LC-contacted but
  // not converted, or not eligible).
  const { converted, inProgress, notConverted } = useMemo(
    () => ({
      converted: visible.filter(
        (r) => r.status === "enrolled" || r.status === "confirmed" || r.status === "paid",
      ),
      inProgress: visible.filter((r) => r.status === "sent" || r.status === "contacted"),
      notConverted: visible.filter(
        (r) => r.status === "not_converted" || r.status === "not_eligible",
      ),
    }),
    [visible],
  );

  if (referrals.length === 0) {
    return (
      <EmptyState
        icon={<GroupAddOutlinedIcon />}
        title="No referrals yet"
        subtitle="Recommend a program to someone in your network — every confirmed enrollment earns a reward."
        action={
          <Button
            variant="contained"
            onClick={() => setActiveTab("programs")}
            sx={{
              textTransform: "none",
              fontWeight: 700,
              borderRadius: "10px",
              transition: `transform 130ms ${EASE_OUT}`,
              "&:active": { transform: "scale(0.97)" },
              "@media (prefers-reduced-motion: reduce)": { "&:active": { transform: "none" } },
            }}
          >
            Browse programs
          </Button>
        }
      />
    );
  }

  return (
    <Box>
      {/* enrolled-in-period summary + time-window filter */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        gap={1.5}
        flexWrap="wrap"
        sx={{ mb: 2.5 }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontSize: 20, fontWeight: 800, lineHeight: 1.1, ...TABULAR }}>
            {enrolledCount} {enrolledCount === 1 ? "learner" : "learners"} enrolled
          </Typography>
          <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mt: 0.25, flexWrap: "wrap" }}>
            <Typography variant="caption" color="text.secondary">
              {period === "all" ? "across all time" : PERIOD_SUFFIX[period]}
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              •
            </Typography>
            <AutorenewRoundedIcon sx={{ fontSize: 13, color: "text.secondary" }} />
            <Typography variant="caption" color="text.secondary">
              Refreshed every 6 hours
            </Typography>
          </Stack>
        </Box>
        <TextField
          select
          size="small"
          value={period}
          onChange={(e) => setPeriod(e.target.value as Period)}
          aria-label="Time period"
          sx={{ minWidth: 150, "& .MuiInputBase-input": { fontSize: "0.85rem", fontWeight: 600 } }}
        >
          {PERIOD_OPTIONS.map((o) => (
            <MenuItem key={o.value} value={o.value} sx={{ fontSize: "0.85rem" }}>
              {o.label}
            </MenuItem>
          ))}
        </TextField>
      </Stack>

      {/* no referrals within the selected window (but some exist outside it) */}
      {visible.length === 0 && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ py: 4, textAlign: "center" }}
        >
          No referrals {period === "all" ? "across all time" : PERIOD_SUFFIX[period]} yet.
        </Typography>
      )}

      {/* in-progress referrals */}
      {inProgress.length > 0 && (
        <Box>
          <Typography variant="subtitle2" fontWeight={700}>
            In progress
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1.25 }}>
            Speaking with a GL learning consultant.
          </Typography>
          <Card variant="outlined" sx={{ borderRadius: "16px", overflow: "hidden" }}>
            <List disablePadding>
              {inProgress.map((r, i) => (
                <Fragment key={r.id}>
                  {i > 0 && <Divider component="li" />}
                  <ReferralRow r={r} highlighted={glow && r.id === highlightId} />
                </Fragment>
              ))}
            </List>
          </Card>
        </Box>
      )}

      {/* converted referrals */}
      {converted.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.25 }}>
            Converted
          </Typography>
          <Card variant="outlined" sx={{ borderRadius: "16px", overflow: "hidden" }}>
            <List disablePadding>
              {converted.map((r, i) => (
                <Fragment key={r.id}>
                  {i > 0 && <Divider component="li" />}
                  <ReferralRow r={r} highlighted={glow && r.id === highlightId} />
                </Fragment>
              ))}
            </List>
          </Card>
        </Box>
      )}

      {/* contacted by GL, but never converted (or not eligible) */}
      {notConverted.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.25 }}>
            Not eligible or not converted
          </Typography>
          <Card variant="outlined" sx={{ borderRadius: "16px", overflow: "hidden" }}>
            <List disablePadding>
              {notConverted.map((r, i) => (
                <Fragment key={r.id}>
                  {i > 0 && <Divider component="li" />}
                  <ReferralRow r={r} highlighted={glow && r.id === highlightId} />
                </Fragment>
              ))}
            </List>
          </Card>
        </Box>
      )}
    </Box>
  );
}
