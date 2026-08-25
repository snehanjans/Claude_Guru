import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/material/styles";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import LinkOutlinedIcon from "@mui/icons-material/LinkOutlined";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import { fmtInr, fmtUsd } from "@/lib/helpers";
import {
  GURU_REF,
  REFERRAL_BASE,
  UNIVERSITY_FLAT_INR,
  UNIVERSITY_FLAT_USD,
} from "@/data/demo-ambassador";
import { findReferableCourse, guruMentoredCourses } from "@/data/demo-referable-courses";
import { useAppDispatch } from "@/store";
import { pushToast } from "@/store/slices/toastsSlice";
import { EmptyState } from "@/components/shared/EmptyState";
import { InstitutionBanner } from "@/components/recommend/CourseCard";
import { track, ANALYTICS_EVENTS } from "@/lib/analytics";

const EASE_OUT = "cubic-bezier(0.23, 1, 0.32, 1)";
const TABULAR = { fontVariantNumeric: "tabular-nums" as const };
/** How long the copy button holds its confirmed state. */
const COPIED_MS = 1600;

/**
 * Referral page for a catalogue course.
 *
 * Deliberately lighter than the AINP program page: the catalogue is scraped
 * from mygreatlearning.com, which publishes a title, provider, duration and
 * banner — and no fee, curriculum, cohort date or FAQ. Rather than invent those,
 * this page shows what we hold and sends the guru to the program page itself for
 * the rest. It carries no Social Media Kit tab for the same reason: no
 * collateral exists for these programs, only for the AINP four.
 */
export default function CourseDetailPage() {
  const { slug = "" } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [copied, setCopied] = useState(false);

  const course = findReferableCourse(slug);

  useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(false), COPIED_MS);
    return () => window.clearTimeout(t);
  }, [copied]);

  /* Where the back link goes. The card passes the surface it was clicked on, so
     the catalogue sends them back to the catalogue and the carousel back to
     Recommend; a deep link with no state falls back to the catalogue. */
  const from = (location.state as { from?: string } | null)?.from;
  const back =
    from === "/recommend"
      ? { to: "/recommend", label: "Recommend" }
      : { to: "/recommend/courses", label: "All courses" };

  if (!course) {
    return (
      <Box sx={{ maxWidth: 840, mx: "auto" }}>
        <EmptyState
          icon={<SchoolOutlinedIcon />}
          title="Course not found"
          subtitle="This program may have been removed from the catalogue, or the link is out of date."
          action={
            <Button
              variant="contained"
              onClick={() => navigate("/recommend/courses")}
              sx={{ textTransform: "none", fontWeight: 700, borderRadius: "10px" }}
            >
              Browse all courses
            </Button>
          }
        />
      </Box>
    );
  }

  const link = `${REFERRAL_BASE}${course.slug}?ref=${GURU_REF}`;
  const programUrl = `${REFERRAL_BASE}${course.slug}`;
  // Position in the roster, so the banner's gradient fallback matches the card
  // the guru just clicked rather than restarting at the first pattern.
  const index = Math.max(0, guruMentoredCourses.findIndex((c) => c.slug === course.slug));
  const mentored = guruMentoredCourses.some((c) => c.slug === course.slug);

  const copyLink = async () => {
    track(ANALYTICS_EVENTS.COURSE_LINK_COPIED, { courseId: course.slug, course: course.title });
    try {
      if (!navigator.clipboard?.writeText) throw new Error("clipboard unavailable");
      await navigator.clipboard.writeText(link);
      setCopied(true);
      dispatch(pushToast({ title: "Copied", description: "Your referral link is on the clipboard." }));
    } catch {
      // Clipboard blocked (permissions, insecure context). The link is on screen
      // in a selectable field, so say so instead of failing silently.
      dispatch(
        pushToast({
          title: "Couldn't copy",
          description: "Select the link above and press Ctrl or Cmd + C.",
        }),
      );
    }
  };

  const facts = [
    course.durationLabel && { k: "Duration", v: course.durationLabel, icon: ScheduleOutlinedIcon },
    course.mode && { k: "Format", v: course.mode, icon: PublicOutlinedIcon },
    course.provider && { k: "Awarded by", v: course.provider, icon: SchoolOutlinedIcon },
  ].filter(Boolean) as { k: string; v: string; icon: typeof ScheduleOutlinedIcon }[];

  return (
    <Box sx={{ maxWidth: 840, mx: "auto" }}>
      <Button
        variant="text"
        startIcon={<ArrowBackRoundedIcon sx={{ fontSize: 18 }} />}
        onClick={() => navigate(back.to)}
        sx={{
          ml: -1,
          mb: 1.5,
          textTransform: "none",
          fontWeight: 600,
          color: "text.secondary",
          borderRadius: "8px",
          transition: `transform 130ms ${EASE_OUT}`,
          "&:hover": { color: "text.primary" },
          "&:active": { transform: "scale(0.97)" },
          "@media (prefers-reduced-motion: reduce)": { "&:active": { transform: "none" } },
        }}
      >
        {back.label}
      </Button>

      {/* header */}
      <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mb: 1.5 }}>
        <Chip
          label={course.providerShort ?? course.provider ?? "University"}
          size="small"
          sx={{
            height: 22,
            fontSize: "0.68rem",
            fontWeight: 700,
            borderRadius: "999px",
            color: "var(--gl-program-default-text)",
            bgcolor: "var(--gl-program-default-bg)",
          }}
        />
        {/* Only shown when true — the carousel's roster is the source. */}
        {mentored && (
          <Chip
            label="You mentor on this"
            size="small"
            sx={{
              height: 22,
              fontSize: "0.68rem",
              fontWeight: 700,
              borderRadius: "999px",
              color: "primary.main",
              bgcolor: (t) => alpha(t.palette.primary.main, 0.1),
              border: (t) => `1px solid ${alpha(t.palette.primary.main, 0.28)}`,
            }}
          />
        )}
      </Stack>
      <Typography variant="h4" sx={{ fontWeight: 800, lineHeight: 1.2, letterSpacing: "-0.015em" }}>
        {course.title}
      </Typography>

      {/* banner — the program's own marketing image, same component as the card */}
      <Box
        sx={{
          mt: 2.5,
          borderRadius: "14px",
          overflow: "hidden",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <InstitutionBanner course={course} index={index} height={{ xs: 160, sm: 220 }} />
      </Box>

      {/* facts — only what the catalogue actually publishes */}
      <Box
        sx={{
          mt: 3,
          display: "grid",
          gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", sm: "repeat(3, minmax(0, 200px))" },
          justifyContent: "start",
          columnGap: { xs: 3, sm: 4 },
          rowGap: 2.5,
        }}
      >
        {facts.map((f) => (
          <Box key={f.k} sx={{ minWidth: 0 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <f.icon sx={{ fontSize: 18, color: "text.primary", flexShrink: 0 }} />
              <Typography sx={{ fontWeight: 700, fontSize: 14 }}>{f.k}</Typography>
            </Stack>
            <Typography
              sx={{ mt: 0.5, pl: "26px", color: "text.secondary", fontSize: 14, lineHeight: 1.4, ...TABULAR }}
            >
              {f.v}
            </Typography>
          </Box>
        ))}
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* share & earn — the personalised link, and where to read the rest */}
      <Box
        sx={{
          p: { xs: 2.25, sm: 2.5 },
          borderRadius: "14px",
          bgcolor: (t) => (t.palette.mode === "dark" ? "rgba(255,255,255,0.04)" : t.palette.grey[100]),
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2, minWidth: 0 }}>
          <LocalOfferOutlinedIcon sx={{ fontSize: 18, color: "primary.main", flexShrink: 0 }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }} noWrap>
            Share &amp; earn
          </Typography>
        </Stack>

        <Typography
          sx={{
            fontSize: "0.7rem",
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "text.secondary",
            mb: 0.75,
          }}
        >
          Your personalised program page
        </Typography>
        <TextField
          fullWidth
          size="small"
          value={link}
          slotProps={{
            htmlInput: { "aria-label": "Your personalised program page link" },
            input: {
              readOnly: true,
              startAdornment: (
                <InputAdornment position="start">
                  <LinkOutlinedIcon sx={{ fontSize: 16, color: "text.disabled" }} />
                </InputAdornment>
              ),
              sx: { fontFamily: "monospace", fontSize: 12.5, borderRadius: "10px", bgcolor: "background.paper" },
              endAdornment: (
                <InputAdornment position="end">
                  <Tooltip title={copied ? "Copied" : "Copy link"}>
                    <IconButton
                      size="small"
                      aria-label="Copy referral link"
                      onClick={copyLink}
                      sx={{
                        color: copied ? "success.main" : "primary.main",
                        transition: `transform 130ms ${EASE_OUT}`,
                        "&:active": { transform: "scale(0.97)" },
                      }}
                    >
                      {copied ? <CheckRoundedIcon fontSize="small" /> : <ContentCopyOutlinedIcon fontSize="small" />}
                    </IconButton>
                  </Tooltip>
                </InputAdornment>
              ),
            },
          }}
        />
        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5 }}>
          Tagged with your ID, every visit and enrollment is identified as your referral.
        </Typography>

        <Divider sx={{ my: 1.75 }} />

        <Button
          variant="contained"
          disableElevation
          component="a"
          href={programUrl}
          target="_blank"
          rel="noopener noreferrer"
          endIcon={<OpenInNewRoundedIcon sx={{ fontSize: 16 }} />}
          sx={{
            textTransform: "none",
            fontWeight: 700,
            borderRadius: "10px",
            px: 1.75,
            py: 0.75,
            transition: `transform 130ms ${EASE_OUT}`,
            "&:active": { transform: "scale(0.97)" },
            "@media (prefers-reduced-motion: reduce)": { "&:active": { transform: "none" } },
          }}
        >
          View program page
        </Button>
        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
          Fees, cohort dates, curriculum and the current learner offer are on the program page. It
          opens untagged, so your referral link stays the one to share.
        </Typography>
      </Box>

      {/* you earn — the flat university bonus, in both learner currencies */}
      <Box
        sx={{
          mt: 2,
          mb: 2,
          p: { xs: 2, sm: 2.25 },
          borderRadius: "14px",
          bgcolor: "var(--gl-status-confirmed-bg)",
          border: "1px solid var(--gl-status-confirmed-border)",
        }}
      >
        <Typography
          sx={{
            fontSize: "0.66rem",
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "var(--gl-status-confirmed-text)",
            lineHeight: 1,
            mb: 1,
          }}
        >
          You earn
        </Typography>
        <Stack direction="row" spacing={1} alignItems="baseline">
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: 16,
              lineHeight: 1.2,
              color: "var(--gl-status-confirmed-text)",
              flexShrink: 0,
              ...TABULAR,
            }}
          >
            {fmtUsd(UNIVERSITY_FLAT_USD)}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.primary", lineHeight: 1.45 }}>
            for every learner who enrols through your link — {fmtInr(UNIVERSITY_FLAT_INR)} where the
            learner pays in rupees.
          </Typography>
        </Stack>
        <Typography variant="caption" sx={{ display: "block", mt: 1, color: "text.secondary" }}>
          Paid one month after course start, in your payout currency.
        </Typography>
      </Box>
    </Box>
  );
}
