import { useEffect, useRef, useState, type ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
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
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import type { SvgIconComponent } from "@mui/icons-material";
import { fmtInr, fmtUsd } from "@/lib/helpers";
import {
  GURU_REF,
  REFERRAL_BASE,
  UNIVERSITY_FLAT_INR,
  UNIVERSITY_FLAT_USD,
} from "@/data/demo-ambassador";
import { findReferableCourse, guruMentoredCourses } from "@/data/demo-referable-courses";
import { courseDetailFor } from "@/data/demo-course-details";
import { courseFaqFor } from "@/data/demo-course-faq";
import { courseCollateral, COURSE_EMAIL_SUBJECT } from "@/data/demo-course-collateral";
import { GURU_LEARNERS_IMPACTED } from "@/data/demo-ambassador";
import { useAppDispatch, useAppSelector } from "@/store";
import { pushToast } from "@/store/slices/toastsSlice";
import { saveCollateralEdit, collateralEditKey } from "@/store/slices/collateralEditsSlice";
import { MessageEditDialog } from "@/components/recommend/MessageEditDialog";
import { CollateralMessagePanel } from "@/components/recommend/CollateralMessagePanel";
import {
  EmailPreview,
  InstagramPreview,
  LinkedInPostPreview,
  PreviewPane,
  WhatsAppPreview,
} from "@/components/recommend/CollateralPreviews";
import { EmptyState } from "@/components/shared/EmptyState";
import { track, ANALYTICS_EVENTS } from "@/lib/analytics";
import { scrollToTop } from "@/lib/scrollRestore";
import { BRAND } from "@/theme/brandColors";

const EASE_OUT = "cubic-bezier(0.23, 1, 0.32, 1)";
const TABULAR = { fontVariantNumeric: "tabular-nums" as const };
/** How long the copy button holds its confirmed state. */
const COPIED_MS = 1600;

/* Same asset ids as the AINP kit, so logos, the subject rule and the saved-edit
   keys line up across both pages. */
const PLATFORM_LOGO: Record<string, { icon: SvgIconComponent; color: string }> = {
  "asset-01": { icon: LinkedInIcon, color: BRAND.linkedin },
  "asset-02": { icon: WhatsAppIcon, color: BRAND.whatsapp },
  "asset-03": { icon: EmailOutlinedIcon, color: BRAND.gmail },
  "asset-04": { icon: InstagramIcon, color: BRAND.instagram },
};

/** Channels whose collateral carries an editable subject line. */
const SUBJECT_ASSET_IDS = new Set(["asset-03"]);

/** How to use each channel's message. */
const INFO_TEXT: Record<string, string> = {
  "asset-01": "Copy this text and paste it into a new LinkedIn post.",
  "asset-02": "Copy this text and send it as a WhatsApp broadcast.",
  "asset-03": "Copy this text and paste it into your email.",
  "asset-04":
    "Add this caption as text to your story, then attach the link separately with the link sticker.",
};

type CourseTab = "overview" | "collaterals" | "faq";

/** Eyebrow inside the earnings callout — used for both of its halves. */
const CALLOUT_LABEL = {
  fontSize: "0.66rem",
  fontWeight: 700,
  letterSpacing: "0.06em",
  textTransform: "uppercase" as const,
  color: "var(--gl-status-confirmed-text)",
  lineHeight: 1,
  mb: 1,
};

/** Small uppercase section heading, as used on the AINP program page. */
function SectionLabel({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
      {icon}
      <Typography
        sx={{
          fontSize: "0.72rem",
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "text.secondary",
          lineHeight: 1,
        }}
      >
        {children}
      </Typography>
    </Stack>
  );
}

/**
 * Referral page for a catalogue course.
 *
 * Carries the AINP page's sections that this catalogue can actually fill: the
 * overview line, the facts row, Share & earn, what the guru earns, the program
 * highlights and the brochure. The overview and highlights are the program
 * page's own copy (see demo-course-details.ts).
 *
 * Still absent, and not invented: the fee and cohort date the pages don't
 * publish uniformly, and the Social Media Kit and FAQ tabs — no collateral or
 * referral FAQ exists for these programs, only for the AINP four.
 */
export default function CourseDetailPage() {
  const { slug = "" } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [copied, setCopied] = useState(false);
  const [tab, setTab] = useState<CourseTab>("overview");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [editingAssetId, setEditingAssetId] = useState<string | null>(null);
  const [faqExpanded, setFaqExpanded] = useState<string | false>(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const collateralEdits = useAppSelector((st) => st.collateralEdits.edits);

  const course = findReferableCourse(slug);

  // Opened from a card partway down a long page, this would otherwise inherit
  // that page's scroll offset and start mid-page. A referral page always opens
  // at the top; coming *back* is what restores a position, not going in.
  useEffect(() => {
    scrollToTop(rootRef.current);
  }, [slug]);

  useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(false), COPIED_MS);
    return () => window.clearTimeout(t);
  }, [copied]);

  if (!course) {
    return (
      <Box ref={rootRef} sx={{ maxWidth: 840, mx: "auto" }}>
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
  const detail = courseDetailFor(course.slug);
  // Most programs publish a brochure page; the rest put it behind a lead form on
  // the program page, so that page is the fallback — as on the AINP page.
  const brochureUrl = detail?.brochureUrl ?? programUrl;
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

  /* ── Social Media Kit ──────────────────────────────────────────────────
     Same shape as the AINP kit: a generated message per channel, the guru's
     saved edit taking precedence, and the referral link appended to the copy
     payload until an edit carries it inline. Edits persist under the course
     slug, in the same store the AINP collateral uses.                       */

  const fill = (caption: string) =>
    caption
      .replace(/\[program name\]/g, course.title)
      .replace(/\[university\]/g, course.providerShort ?? course.provider ?? "the university")
      .replace(/\[duration\]/g, course.durationLabel ?? "a part-time program")
      .replace(/\[N learners mentored\]/g, GURU_LEARNERS_IMPACTED.toLocaleString("en-US"));

  const editFor = (assetId: string) => collateralEdits[collateralEditKey(course.slug, assetId)];
  /** What gets copied: the saved version, or the message plus the link. */
  const payloadFor = (assetId: string, caption: string) =>
    editFor(assetId)?.body ?? `${fill(caption)}\n\n${link}`;
  const displayFor = (assetId: string, caption: string) =>
    editFor(assetId)?.body ?? fill(caption);
  const subjectFor = (assetId: string) => editFor(assetId)?.subject ?? COURSE_EMAIL_SUBJECT;

  /* Bold the program and the institution inside a filled message — the AINP
     page does the same, so the guru's eye lands on what the post is about. */
  const highlightCourse = (text: string): ReactNode => {
    const values = [course.title, course.providerShort ?? course.provider].filter(Boolean) as string[];
    if (values.length === 0) return text;
    const escaped = values.map((v) => v.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    const bold = new Set(values);
    return text.split(new RegExp(`(${escaped.join("|")})`, "g")).map((part, i) =>
      bold.has(part) ? (
        <Box key={i} component="span" sx={{ fontWeight: 700 }}>
          {part}
        </Box>
      ) : (
        part
      ),
    );
  };

  const copyCollateral = (key: string, value: string, description: string) => {
    navigator.clipboard?.writeText(value);
    dispatch(pushToast({ title: "Copied", description }));
    setCopiedKey(key);
    window.setTimeout(() => setCopiedKey((k) => (k === key ? null : k)), COPIED_MS);
  };

  /* Phrases the AI polish must reproduce verbatim — the program and the awarding
     institution, plus the mailmerge placeholders the guru fills in by hand. */
  const protectedPhrases = [
    course.title,
    course.providerShort ?? course.provider,
    "[first name]",
    "[Your name]",
  ].filter(Boolean) as string[];

  /** The channel's mock-up, filled with this course's message and share image. */
  const previewFor = (assetId: string, caption: string): ReactNode => {
    const message = displayFor(assetId, caption);
    const ogLabel = (course.providerShort ?? course.provider ?? "Great Learning").toUpperCase();
    switch (assetId) {
      case "asset-01":
        return (
          <LinkedInPostPreview
            message={message}
            title={course.title}
            ogImage={course.image}
            ogLabel={ogLabel}
            highlight={highlightCourse}
          />
        );
      case "asset-02":
        return (
          <WhatsAppPreview
            message={message}
            title={course.title}
            ogImage={course.image}
            ogLabel={course.providerShort ?? "GL"}
            highlight={highlightCourse}
          />
        );
      case "asset-03":
        return (
          <EmailPreview
            message={message}
            subject={subjectFor(assetId)}
            link={link}
            showLink={!editFor(assetId)}
            highlight={highlightCourse}
          />
        );
      default:
        return <InstagramPreview message={message} highlight={highlightCourse} />;
    }
  };

  const faqGroups = courseFaqFor(course.slug);

  const facts = [
    course.durationLabel && { k: "Duration", v: course.durationLabel, icon: ScheduleOutlinedIcon },
    course.mode && { k: "Format", v: course.mode, icon: PublicOutlinedIcon },
    course.provider && { k: "Awarded by", v: course.provider, icon: SchoolOutlinedIcon },
  ].filter(Boolean) as { k: string; v: string; icon: typeof ScheduleOutlinedIcon }[];

  return (
    <Box ref={rootRef} sx={{ maxWidth: 840, mx: "auto" }}>
      <Button
        variant="text"
        startIcon={<ArrowBackRoundedIcon sx={{ fontSize: 18 }} />}
        /* Labelled "All courses" but pointing at Recommend, on purpose: that's
           the guru's home for referrals and where every course they can share is
           listed. Leaving from the carousel also returns them to that section. */
        onClick={() => navigate("/recommend")}
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
        All courses
      </Button>

      {/* header — the awarding institution is in the facts row below, so the
          only chip here is the guru's own relationship to the program. Rendered
          conditionally rather than always, so a program they don't teach doesn't
          leave a gap above the title. */}
      {mentored && (
        <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mb: 1.5 }}>
          <Chip
            label="Programs you've taught"
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
        </Stack>
      )}
      <Typography variant="h4" sx={{ fontWeight: 800, lineHeight: 1.2, letterSpacing: "-0.015em" }}>
        {course.title}
      </Typography>

      {/* section tabs — same set as the AINP program page */}
      <Box sx={{ mt: 2.5, borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={tab}
          onChange={(_e, v) => setTab(v as CourseTab)}
          aria-label="Course detail sections"
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{
            minHeight: 44,
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.875rem",
              minHeight: 44,
            },
            "& .MuiTabs-indicator": { height: 3, borderRadius: "3px 3px 0 0" },
          }}
        >
          <Tab label="Overview" value="overview" />
          <Tab label="Social Media Kit" value="collaterals" />
          <Tab label="Program FAQ" value="faq" />
        </Tabs>
      </Box>

      <Box sx={{ py: 3 }}>
      {tab === "overview" && (
        <>
      {/* the program page's own one-liner */}
      {detail?.overview && (
        <Typography sx={{ fontSize: 15, lineHeight: 1.65, color: "text.secondary" }}>
          {detail.overview}
        </Typography>
      )}

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
          p: { xs: 2, sm: 2.25 },
          borderRadius: "14px",
          bgcolor: "var(--gl-status-confirmed-bg)",
          border: "1px solid var(--gl-status-confirmed-border)",
        }}
      >
        <Typography sx={CALLOUT_LABEL}>You earn</Typography>
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
          <Typography variant="body2" sx={{ color: "text.primary", lineHeight: 1.45, ...TABULAR }}>
            for every learner who enrols through your link. ({fmtInr(UNIVERSITY_FLAT_INR)} in INR)
          </Typography>
        </Stack>
        <Typography variant="caption" sx={{ display: "block", mt: 1, color: "text.secondary" }}>
          Paid one month after course start, in your payout currency.
        </Typography>

        {/* The learner's side of the same referral — same callout, since the two
            are one offer rather than two unrelated facts. */}
        <Box
          sx={{
            mt: 1.75,
            pt: 1.75,
            borderTop: "1px solid var(--gl-status-confirmed-border)",
          }}
        >
          <Typography sx={CALLOUT_LABEL}>Your learner gets</Typography>
          <Typography variant="body2" sx={{ color: "text.primary", lineHeight: 1.45 }}>
            A scholarship applied at checkout, reducing their program fee.
          </Typography>
        </Box>
      </Box>

      {/* program highlights — the section of that name on the program page */}
      {detail?.highlights.length ? (
        <>
          <Divider sx={{ my: 3 }} />
          <SectionLabel icon={<SchoolOutlinedIcon sx={{ fontSize: 18, color: "primary.main" }} />}>
            Program highlights
          </SectionLabel>
          <Grid container columnSpacing={3} rowSpacing={2} sx={{ maxWidth: 720 }}>
            {detail.highlights.map((h) => (
              <Grid key={h.title} size={{ xs: 12, sm: 6 }}>
                <Stack direction="row" spacing={1.25}>
                  {/* The dot centres on the title's first line rather than the
                      row's top edge: the wrapper is exactly body2's line box
                      (0.875rem × 1.4), so it stays aligned if the type scale
                      changes. A margin here would be overridden by Stack's own
                      spacing rules. */}
                  <Box
                    sx={{
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      fontSize: "0.875rem",
                      height: "1.4em",
                    }}
                  >
                    <Box
                      sx={{ width: 5, height: 5, borderRadius: "50%", bgcolor: "text.disabled" }}
                    />
                  </Box>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1.4 }}>
                      {h.title}
                    </Typography>
                    {/* Some pages publish a title only. */}
                    {h.detail && (
                      <Typography
                        sx={{ mt: 0.25, fontSize: 13.5, lineHeight: 1.5, color: "text.secondary" }}
                      >
                        {h.detail}
                      </Typography>
                    )}
                  </Box>
                </Stack>
              </Grid>
            ))}
          </Grid>
        </>
      ) : null}

      <Box sx={{ mt: 2.5, mb: 2 }}>
        <Button
          variant="contained"
          component="a"
          href={brochureUrl}
          target="_blank"
          rel="noopener noreferrer"
          endIcon={<OpenInNewRoundedIcon sx={{ fontSize: 16 }} />}
          sx={{
            textTransform: "none",
            fontWeight: 700,
            borderRadius: "10px",
            transition: `transform 130ms ${EASE_OUT}`,
            "&:active": { transform: "scale(0.97)" },
            "@media (prefers-reduced-motion: reduce)": { "&:active": { transform: "none" } },
          }}
        >
          View brochure
        </Button>
      </Box>
        </>
      )}

      {/* ── Social Media Kit ──────────────────────────────────────────────── */}
      {tab === "collaterals" && (
        <>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.55 }}>
            Ready-to-post messages for {course.title}, pre-filled with your referral link. Edit any
            of them before you share.
          </Typography>
          <Stack spacing={1.5}>
            {courseCollateral.map((asset) => {
              const key = `col:${asset.id}`;
              const logo = PLATFORM_LOGO[asset.id];
              return (
                <Box
                  key={asset.id}
                  sx={{
                    p: 1.75,
                    borderRadius: "12px",
                    border: "1px solid",
                    borderColor: "divider",
                    bgcolor: "background.paper",
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mb: 2 }}>
                    {logo && <logo.icon sx={{ fontSize: 20, color: logo.color }} />}
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      {asset.label}
                    </Typography>
                  </Stack>
                  {/* Preview beside the message, same components and layout as
                      the AINP kit — the mock-up shows this course's own share
                      image and title, so what the guru sees is their post. */}
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "minmax(0, 1fr) minmax(0, 1fr)" },
                      gap: 2,
                      alignItems: "stretch",
                    }}
                  >
                    <PreviewPane label={asset.label.split(" ")[0]}>
                      {previewFor(asset.id, asset.caption)}
                    </PreviewPane>
                    <CollateralMessagePanel
                      message={displayFor(asset.id, asset.caption)}
                      subject={SUBJECT_ASSET_IDS.has(asset.id) ? subjectFor(asset.id) : undefined}
                      link={link}
                      edited={Boolean(editFor(asset.id))}
                      info={INFO_TEXT[asset.id]}
                      variant={asset.id === "asset-01" ? "linkedin" : "default"}
                      copied={copiedKey === key}
                      onEdit={() => setEditingAssetId(asset.id)}
                      onCopy={() =>
                        copyCollateral(
                          key,
                          payloadFor(asset.id, asset.caption),
                          `${asset.label} copied to clipboard.`,
                        )
                      }
                    />
                  </Box>
                </Box>
              );
            })}
          </Stack>
        </>
      )}

      {/* ── Program FAQ — the program page's own answers ──────────────────── */}
      {tab === "faq" && (
        <Box sx={{ maxWidth: 760 }}>
          {faqGroups.length === 0 ? (
            <EmptyState
              icon={<SchoolOutlinedIcon />}
              title="This program's FAQ isn't available here yet"
              subtitle="Its questions and answers live on the program page."
              action={
                <Button
                  variant="contained"
                  component="a"
                  href={programUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  endIcon={<OpenInNewRoundedIcon sx={{ fontSize: 16 }} />}
                  sx={{ textTransform: "none", fontWeight: 700, borderRadius: "10px" }}
                >
                  Open the program page
                </Button>
              }
            />
          ) : (
            faqGroups.map((group, g) => (
              <Box key={group.title} sx={{ mb: 3.5, "&:last-of-type": { mb: 0 } }}>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, fontSize: "1.05rem", letterSpacing: "-0.01em", mb: 1.5 }}
                >
                  {group.title}
                </Typography>
                {group.items.map((f, i) => {
                  const id = `${g}-${i}`;
                  return (
                    <Accordion
                      key={id}
                      disableGutters
                      elevation={0}
                      expanded={faqExpanded === id}
                      onChange={(_e, isExpanded) => setFaqExpanded(isExpanded ? id : false)}
                      sx={{
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: "12px !important",
                        overflow: "hidden",
                        mb: 1.25,
                        "&::before": { display: "none" },
                        transition: `border-color 180ms ${EASE_OUT}`,
                        ...(faqExpanded === id && { borderColor: "primary.main" }),
                      }}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon sx={{ fontSize: 20 }} />}
                        sx={{ px: 2, minHeight: 52, "& .MuiAccordionSummary-content": { my: 1.25 } }}
                      >
                        <Typography variant="subtitle2" sx={{ fontWeight: 500, lineHeight: 1.4 }}>
                          {f.q}
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails sx={{ px: 2, pt: 0, pb: 2 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                          {f.a}
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                  );
                })}
              </Box>
            ))
          )}
        </Box>
      )}
      </Box>

      {/* One editor serves all four channels — which one it edits is whatever
          `editingAssetId` points at. */}
      {(() => {
        const asset = courseCollateral.find((a) => a.id === editingAssetId);
        if (!asset) return null;
        const hasSubject = SUBJECT_ASSET_IDS.has(asset.id);
        return (
          <MessageEditDialog
            open
            channelLabel={asset.label}
            programId={course.slug}
            initialBody={payloadFor(asset.id, asset.caption)}
            initialSubject={hasSubject ? subjectFor(asset.id) : undefined}
            referralLink={link}
            protectedPhrases={protectedPhrases}
            onClose={() => setEditingAssetId(null)}
            onSave={({ body, subject }) => {
              dispatch(
                saveCollateralEdit({
                  programId: course.slug,
                  assetId: asset.id,
                  body,
                  subject: hasSubject ? subject : undefined,
                }),
              );
              setEditingAssetId(null);
            }}
          />
        );
      })()}
    </Box>
  );
}
