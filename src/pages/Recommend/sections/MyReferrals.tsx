import { Fragment, useEffect, useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/material/styles";
import type { SxProps, Theme } from "@mui/material/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import GroupAddOutlinedIcon from "@mui/icons-material/GroupAddOutlined";
import { useAppDispatch } from "@/store";
import { pushToast } from "@/store/slices/toastsSlice";
import { fmtDateNice, fmtMoney } from "@/lib/helpers";
import { StatusChip, type StatusVariant } from "@/components/shared/StatusChip";
import { EmptyState } from "@/components/shared/EmptyState";
import { demoAmbassadorPrograms, GURU_CURRENCY, toGuruCurrency } from "@/data/demo-ambassador";
import type { AmbassadorProgram, AmbassadorReferral } from "@/lib/types";
import { useRecommend } from "../RecommendContext";

const EASE_OUT = "cubic-bezier(0.23, 1, 0.32, 1)";
const TABULAR = { fontVariantNumeric: "tabular-nums" as const };

const PROGRAM_BY_ID = new Map<string, AmbassadorProgram>(demoAmbassadorPrograms.map((p) => [p.id, p]));

/** AINP-only checkout-path label that also explains the rate, e.g. "Self-checkout · 20%". */
function pathLabel(r: AmbassadorReferral, program?: AmbassadorProgram): string | null {
  if (!r.conversionPath) return null;
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
  r.status === "not_eligible" || r.status === "not_converted" || r.status === "sent"
    ? "—"
    : fmtMoney(toGuruCurrency(r.reward, r.currency), GURU_CURRENCY);

/* ── Referral row ─────────────────────────────────────────────────────── */
function ReferralRow({ r, highlighted }: { r: AmbassadorReferral; highlighted: boolean }) {
  const dispatch = useAppDispatch();
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

        {/* status */}
        <StatusChip status={meta.variant} label={meta.label(r)} sx={meta.chipSx} />

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
            {isNotEligible && (
              <Link
                component="button"
                type="button"
                variant="caption"
                onClick={() =>
                  dispatch(
                    pushToast({
                      title: "Thanks for flagging",
                      description: "The program office will take another look.",
                    }),
                  )
                }
                sx={{ mt: 0.75, fontWeight: 600 }}
              >
                Think this is wrong?
              </Link>
            )}
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

  // Classify referrals: converted (enrolled → confirmed → paid), in progress
  // (sent / contacted), and closed without a bonus (LC-contacted but not
  // converted, or not eligible).
  const { converted, inProgress, notConverted } = useMemo(
    () => ({
      converted: referrals.filter(
        (r) => r.status === "enrolled" || r.status === "confirmed" || r.status === "paid",
      ),
      inProgress: referrals.filter((r) => r.status === "sent" || r.status === "contacted"),
      notConverted: referrals.filter(
        (r) => r.status === "not_converted" || r.status === "not_eligible",
      ),
    }),
    [referrals],
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
      {/* in-progress referrals */}
      {inProgress.length > 0 && (
        <Box>
          <Typography variant="subtitle2" fontWeight={700}>
            In progress
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1.25 }}>
            Sent or being worked by GL — no enrollment yet.
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
          <Typography variant="subtitle2" fontWeight={700}>
            Converted
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1.25 }}>
            Learners who enrolled — bonuses confirmed or on the way.
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
          <Typography variant="subtitle2" fontWeight={700}>
            Contacted by GL — not converted
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1.25 }}>
            These referrals closed without an enrollment. No bonus is due.
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
