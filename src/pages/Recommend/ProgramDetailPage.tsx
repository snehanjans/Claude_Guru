import { useEffect, useState, type ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Backdrop from "@mui/material/Backdrop";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import LinkOutlinedIcon from "@mui/icons-material/LinkOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import InstagramIcon from "@mui/icons-material/Instagram";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import ZoomOutMapRoundedIcon from "@mui/icons-material/ZoomOutMapRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import type { SvgIconComponent } from "@mui/icons-material";
import { fmtDateNice, fmtUsd } from "@/lib/helpers";
import {
  demoAmbassadorPrograms,
  demoBroadcastCollateral,
  referralLinkFor,
  GURU_LEARNERS_IMPACTED,
} from "@/data/demo-ambassador";
import { useAppDispatch } from "@/store";
import { pushToast } from "@/store/slices/toastsSlice";
import { EmptyState } from "@/components/shared/EmptyState";

const EASE_OUT = "cubic-bezier(0.23, 1, 0.32, 1)";
const TABULAR = { fontVariantNumeric: "tabular-nums" as const };

/* Placeholder media per collateral, sized to each platform's real image format. */
const COLLATERAL_MEDIA: Record<
  string,
  { icon: SvgIconComponent; ratio: string; size: string; centered?: boolean; maxWidth?: number }
> = {
  "asset-01": { icon: LinkedInIcon, ratio: "1.91 / 1", size: "1200 × 627" }, // LinkedIn post
  "asset-02": { icon: WhatsAppIcon, ratio: "1 / 1", size: "1080 × 1080", centered: true, maxWidth: 200 }, // WhatsApp
  "asset-03": { icon: EmailOutlinedIcon, ratio: "3 / 1", size: "600 × 200 banner" }, // Email header
  "asset-04": { icon: InstagramIcon, ratio: "9 / 16", size: "1080 × 1920", centered: true, maxWidth: 150 }, // IG story
};

/* Small uppercase section header with a leading icon — used across the detail page. */
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

/* ── Program detail page ──────────────────────────────────────────────── */
export default function ProgramDetailPage() {
  const { programId } = useParams<{ programId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [tab, setTab] = useState<"overview" | "collaterals">("overview");
  // Which collateral is expanded in the lightbox (asset id + label + filled caption), or null.
  const [lightbox, setLightbox] = useState<{ id: string; label: string; caption: string } | null>(
    null,
  );

  const program = demoAmbassadorPrograms.find((p) => p.id === programId) ?? null;
  const link = program ? referralLinkFor(program.scholarshipCode) : "";

  // Reset to Overview whenever a different program opens.
  useEffect(() => {
    setTab("overview");
    setLightbox(null);
  }, [programId]);

  if (!program) {
    return (
      <Box sx={{ maxWidth: 840, mx: "auto" }}>
        <EmptyState
          icon={<SchoolOutlinedIcon />}
          title="Program not found"
          subtitle="This program may have been removed or the link is out of date."
          action={
            <Button
              variant="contained"
              onClick={() => navigate("/recommend")}
              sx={{
                textTransform: "none",
                fontWeight: 700,
                borderRadius: "10px",
                transition: `transform 130ms ${EASE_OUT}`,
                "&:active": { transform: "scale(0.97)" },
                "@media (prefers-reduced-motion: reduce)": { "&:active": { transform: "none" } },
              }}
            >
              Back to programs
            </Button>
          }
        />
      </Box>
    );
  }

  // Fill a collateral template with this program's details (link appended for the copy payload).
  const fillCollateral = (caption: string) =>
    caption
      .replace(/\[program name\]/g, program.title)
      .replace(/\[start date\]/g, fmtDateNice(program.nextCohortYmd))
      .replace(/\[scholarship code\]/g, program.scholarshipCode)
      .replace(/\[percent off\]/g, String(program.scholarshipPct))
      .replace(/\[N learners mentored\]/g, GURU_LEARNERS_IMPACTED.toLocaleString("en-US"));

  const copy = (key: string, value: string, description: string) => {
    navigator.clipboard.writeText(value);
    dispatch(pushToast({ title: "Copied", description }));
    setCopiedKey(key);
    window.setTimeout(() => setCopiedKey((k) => (k === key ? null : k)), 1600);
  };

  const downloadCurriculum = () => {
    dispatch(
      pushToast({
        title: "Curriculum download started",
        description: `${program.title} — full syllabus (PDF).`,
      }),
    );
  };

  const downloadBrochure = () => {
    dispatch(
      pushToast({
        title: "Brochure download started",
        description: `${program.title} — program brochure (PDF).`,
      }),
    );
  };

  // Download the collateral image. No real creative in the demo, so we generate a
  // correctly-sized placeholder SVG and save it — a real asset would drop in here.
  const downloadImage = (assetId: string, label: string) => {
    const media = COLLATERAL_MEDIA[assetId];
    const m = media?.size.match(/(\d+)\s*[×x]\s*(\d+)/);
    const w = m ? Number(m[1]) : 1200;
    const h = m ? Number(m[2]) : 675;
    const svg =
      `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">` +
      `<rect width="100%" height="100%" fill="#eef2f7"/>` +
      `<text x="50%" y="46%" font-family="sans-serif" font-weight="700" font-size="${Math.round(Math.min(w, h) / 12)}" fill="#94a3b8" text-anchor="middle">${label}</text>` +
      `<text x="50%" y="58%" font-family="sans-serif" font-size="${Math.round(Math.min(w, h) / 20)}" fill="#cbd5e1" text-anchor="middle">${w} × ${h}</text>` +
      `</svg>`;
    const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `${program.id}-${assetId}.svg`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    dispatch(pushToast({ title: "Image downloaded", description: `${label} saved.` }));
  };

  return (
    <Box sx={{ maxWidth: 840, mx: "auto" }}>
      {/* back to catalog */}
      <Button
        variant="text"
        startIcon={<ArrowBackRoundedIcon sx={{ fontSize: 18 }} />}
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
        All programs
      </Button>

      {/* header */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
        sx={{ pb: 2.5 }}
      >
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mb: 1.5 }}>
            <Chip
              label={program.family === "gl" ? "GL program" : "University"}
              size="small"
              sx={{
                height: 22,
                fontSize: "0.68rem",
                fontWeight: 700,
                borderRadius: "999px",
                color: "text.secondary",
                bgcolor: "action.hover",
              }}
            />
            {program.isNew && (
              <Chip
                label="New"
                size="small"
                sx={{
                  height: 22,
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  borderRadius: "999px",
                  color: "primary.main",
                  bgcolor: (t) => alpha(t.palette.primary.main, 0.1),
                }}
              />
            )}
          </Stack>
          <Typography variant="h4" sx={{ fontWeight: 800, lineHeight: 1.2, letterSpacing: "-0.015em" }}>
            {program.title}
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.75, color: "text.secondary" }}>
            {program.university}
          </Typography>
        </Box>
      </Stack>

      {/* section tabs */}
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={tab}
          onChange={(_e, v) => setTab(v as "overview" | "collaterals")}
          aria-label="Program detail sections"
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
        </Tabs>
      </Box>

      <Box sx={{ py: 3, mb: 2 }}>
        {tab === "overview" && (
          <>
            {/* lead */}
            <Typography sx={{ fontSize: 15, lineHeight: 1.65, color: "text.secondary" }}>
              {program.blurb}
            </Typography>

            {/* meta — icon / label row */}
            <Stack
              direction="row"
              spacing={{ xs: 4, sm: 6 }}
              sx={{ mt: 3, flexWrap: "wrap", rowGap: 2.5 }}
            >
              {[
                { k: "Duration", v: program.durationLabel, icon: ScheduleOutlinedIcon },
                { k: "Program fee", v: fmtUsd(program.price), icon: PaymentsOutlinedIcon },
                { k: "Format", v: program.mode, icon: PublicOutlinedIcon },
              ].map((f) => (
                <Box key={f.k}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <f.icon sx={{ fontSize: 18, color: "text.primary" }} />
                    <Typography sx={{ fontWeight: 700, fontSize: 14 }}>{f.k}</Typography>
                  </Stack>
                  <Typography
                    sx={{ mt: 0.5, pl: "26px", color: "text.secondary", fontSize: 14, ...TABULAR }}
                  >
                    {f.v}
                  </Typography>
                </Box>
              ))}
            </Stack>

            <Divider sx={{ my: 3 }} />

            {/* share & earn — personalised link, discount code, collaterals */}
            <Box
              sx={{
                p: { xs: 2.25, sm: 2.5 },
                borderRadius: "14px",
                bgcolor: (t) => (t.palette.mode === "dark" ? "rgba(255,255,255,0.04)" : t.palette.grey[100]),
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                spacing={1}
                sx={{ mb: 2 }}
              >
                <Stack direction="row" alignItems="center" spacing={1} sx={{ minWidth: 0 }}>
                  <LocalOfferOutlinedIcon sx={{ fontSize: 18, color: "primary.main", flexShrink: 0 }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }} noWrap>
                    Share &amp; earn
                  </Typography>
                </Stack>
                <Chip
                  label={`${program.scholarshipPct}% off for learners`}
                  size="small"
                  sx={{
                    height: 24,
                    fontWeight: 800,
                    fontSize: "0.74rem",
                    flexShrink: 0,
                    ...TABULAR,
                    color: "var(--gl-status-confirmed-text)",
                    bgcolor: "var(--gl-status-confirmed-bg)",
                    border: "1px solid var(--gl-status-confirmed-border)",
                  }}
                />
              </Stack>

              {/* 1 — personalised program page (UTM-tagged) */}
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
                InputProps={{
                  readOnly: true,
                  startAdornment: (
                    <InputAdornment position="start">
                      <LinkOutlinedIcon sx={{ fontSize: 16, color: "text.disabled" }} />
                    </InputAdornment>
                  ),
                  sx: { fontFamily: "monospace", fontSize: 12.5, borderRadius: "10px", bgcolor: "background.paper" },
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip title={copiedKey === "link" ? "Copied" : "Copy link"}>
                        <IconButton
                          size="small"
                          aria-label="Copy personalised page link"
                          onClick={() => copy("link", link, "Personalised page link copied to clipboard.")}
                          sx={{
                            color: copiedKey === "link" ? "success.main" : "primary.main",
                            transition: `transform 130ms ${EASE_OUT}`,
                            "&:active": { transform: "scale(0.97)" },
                          }}
                        >
                          {copiedKey === "link" ? (
                            <CheckRoundedIcon fontSize="small" />
                          ) : (
                            <ContentCopyOutlinedIcon fontSize="small" />
                          )}
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  ),
                }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5 }}>
                UTM-tagged — every visit and enrollment is tracked back to you.
              </Typography>

              {/* 2 — learner discount code */}
              <Typography
                sx={{
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "text.secondary",
                  mt: 2,
                  mb: 0.75,
                }}
              >
                Learner discount code
              </Typography>
              <TextField
                fullWidth
                value={program.scholarshipCode}
                InputProps={{
                  readOnly: true,
                  sx: {
                    fontFamily: "monospace",
                    fontWeight: 800,
                    fontSize: 18,
                    letterSpacing: "0.03em",
                    borderRadius: "10px",
                    bgcolor: "background.paper",
                    ...TABULAR,
                  },
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip title={copiedKey === "code" ? "Copied" : "Copy code"}>
                        <IconButton
                          size="small"
                          aria-label="Copy discount code"
                          onClick={() =>
                            copy("code", program.scholarshipCode, "Discount code copied to clipboard.")
                          }
                          sx={{
                            color: copiedKey === "code" ? "success.main" : "primary.main",
                            transition: `transform 130ms ${EASE_OUT}`,
                            "&:active": { transform: "scale(0.97)" },
                          }}
                        >
                          {copiedKey === "code" ? (
                            <CheckRoundedIcon fontSize="small" />
                          ) : (
                            <ContentCopyOutlinedIcon fontSize="small" />
                          )}
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  ),
                }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5 }}>
                Learners apply this at checkout for {program.scholarshipPct}% off.
              </Typography>

              <Divider sx={{ my: 1.75 }} />

              {/* 3 — collaterals shortcut */}
              <Button
                variant="text"
                endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: 18 }} />}
                onClick={() => setTab("collaterals")}
                sx={{
                  ml: -1,
                  textTransform: "none",
                  fontWeight: 600,
                  color: "primary.main",
                  borderRadius: "8px",
                  transition: `transform 130ms ${EASE_OUT}`,
                  "&:active": { transform: "scale(0.97)" },
                  "@media (prefers-reduced-motion: reduce)": { "&:active": { transform: "none" } },
                }}
              >
                Social media kit
              </Button>
              <Typography variant="caption" color="text.secondary" sx={{ display: "block", ml: 0 }}>
                Ready-to-post assets for LinkedIn, WhatsApp, email, and Instagram.
              </Typography>
            </Box>

            {/* earnings callout — right after Share & earn */}
            <Box
              sx={{
                mt: 2,
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
              <Stack spacing={0.75}>
                <Stack direction="row" spacing={1} alignItems="baseline">
                  <Typography
                    sx={{ fontWeight: 800, fontSize: 16, lineHeight: 1.2, color: "var(--gl-status-confirmed-text)", flexShrink: 0, minWidth: 44, ...TABULAR }}
                  >
                    {program.bonusPctSelfCheckout}%
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.primary", lineHeight: 1.45 }}>
                    of the program fee when your learner enrolls on their own using your link or code
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="baseline">
                  <Typography
                    sx={{ fontWeight: 800, fontSize: 16, lineHeight: 1.2, color: "var(--gl-status-confirmed-text)", flexShrink: 0, minWidth: 44, ...TABULAR }}
                  >
                    {program.bonusPctAssisted}%
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.primary", lineHeight: 1.45 }}>
                    when a GL advisor helps close the enrollment
                  </Typography>
                </Stack>
              </Stack>
              <Typography variant="caption" sx={{ display: "block", mt: 1, color: "text.secondary" }}>
                {program.payoutTiming}, in your payout currency.
              </Typography>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* what you'll learn */}
            <SectionLabel icon={<SchoolOutlinedIcon sx={{ fontSize: 18, color: "primary.main" }} />}>
              What this course teaches
            </SectionLabel>
            <Grid container columnSpacing={3} rowSpacing={2} sx={{ maxWidth: 640 }}>
              {program.curriculum.map((c, i) => (
                <Grid key={i} size={{ xs: 12, sm: 6 }}>
                  <Stack direction="row" spacing={1.25} alignItems="center">
                    <Box
                      sx={{
                        width: 5,
                        height: 5,
                        borderRadius: "50%",
                        bgcolor: "text.disabled",
                        flexShrink: 0,
                      }}
                    />
                    <Typography variant="body2" sx={{ lineHeight: 1.4 }}>
                      {c}
                    </Typography>
                  </Stack>
                </Grid>
              ))}
            </Grid>
            <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap alignItems="center" sx={{ mt: 2, ml: -0.75 }}>
              <Button
                variant="text"
                startIcon={<FileDownloadOutlinedIcon sx={{ fontSize: 18 }} />}
                onClick={downloadCurriculum}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  color: "primary.main",
                  borderRadius: "8px",
                  px: 1,
                  transition: `transform 130ms ${EASE_OUT}`,
                  "&:active": { transform: "scale(0.97)" },
                  "@media (prefers-reduced-motion: reduce)": { "&:active": { transform: "none" } },
                }}
              >
                Download Curriculum
              </Button>
              <Button
                variant="text"
                startIcon={<MenuBookOutlinedIcon sx={{ fontSize: 18 }} />}
                onClick={downloadBrochure}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  color: "primary.main",
                  borderRadius: "8px",
                  px: 1,
                  transition: `transform 130ms ${EASE_OUT}`,
                  "&:active": { transform: "scale(0.97)" },
                  "@media (prefers-reduced-motion: reduce)": { "&:active": { transform: "none" } },
                }}
              >
                Download Brochure
              </Button>
            </Stack>

            <Divider sx={{ my: 3 }} />

            {/* who it's for + prerequisites */}
            <SectionLabel icon={<PeopleAltOutlinedIcon sx={{ fontSize: 18, color: "primary.main" }} />}>
              Who it&rsquo;s for
            </SectionLabel>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.55, mb: 2.75 }}>
              {program.audienceLine}
            </Typography>

            <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 1.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                Prerequisites
              </Typography>
              {program.hasTechnicalPrereq && (
                <Chip
                  size="small"
                  icon={<WarningAmberIcon sx={{ fontSize: 14 }} />}
                  label="Technical prerequisites"
                  sx={{
                    height: 22,
                    fontSize: "0.7rem",
                    fontWeight: 600,
                    color: "var(--gl-warning-icon)",
                    bgcolor: (t) => alpha(t.palette.warning.main, 0.12),
                    border: (t) => `1px solid ${alpha(t.palette.warning.main, 0.26)}`,
                    "& .MuiChip-icon": { color: "var(--gl-warning-icon)", ml: 0.5 },
                  }}
                />
              )}
            </Stack>
            <Stack direction="row" flexWrap="wrap" useFlexGap spacing={0.75}>
              {program.prerequisites.map((pr, i) => (
                <Chip
                  key={i}
                  label={pr}
                  size="small"
                  variant="outlined"
                  sx={{ height: 30, fontSize: "0.78rem", borderRadius: "8px", color: "text.secondary", px: 0.5 }}
                />
              ))}
            </Stack>
          </>
        )}

        {tab === "collaterals" && (
          <>
            {/* collaterals — program-specific, pre-filled with the guru's code + link */}
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.55 }}>
              Ready-to-share posts for {program.title}, pre-filled with your code and link.
            </Typography>
            <Stack spacing={1.5}>
              {demoBroadcastCollateral.map((asset) => {
                const key = `col:${asset.id}`;
                const done = copiedKey === key;
                const media = COLLATERAL_MEDIA[asset.id];
                // Full post the guru shares: the message plus their UTM-tagged link.
                const body = `${fillCollateral(asset.caption)}\n\n${link}`;
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
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      spacing={1}
                      sx={{ mb: 0.75 }}
                    >
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        {asset.label}
                      </Typography>
                      <Stack direction="row" spacing={0.5} sx={{ flexShrink: 0 }}>
                        <Button
                          size="small"
                          startIcon={<FileDownloadOutlinedIcon sx={{ fontSize: 16 }} />}
                          onClick={() => downloadImage(asset.id, asset.label)}
                          sx={{
                            textTransform: "none",
                            fontWeight: 600,
                            color: "text.secondary",
                            transition: `transform 130ms ${EASE_OUT}`,
                            "&:active": { transform: "scale(0.97)" },
                            "@media (prefers-reduced-motion: reduce)": { "&:active": { transform: "none" } },
                          }}
                        >
                          Download image
                        </Button>
                        <Button
                          size="small"
                          startIcon={
                            done ? (
                              <CheckRoundedIcon sx={{ fontSize: 16 }} />
                            ) : (
                              <ContentCopyOutlinedIcon sx={{ fontSize: 16 }} />
                            )
                          }
                          onClick={() => copy(key, body, `${asset.label} copied to clipboard.`)}
                          sx={{
                            textTransform: "none",
                            fontWeight: 600,
                            color: done ? "success.main" : "primary.main",
                            transition: `transform 130ms ${EASE_OUT}`,
                            "&:active": { transform: "scale(0.97)" },
                            "@media (prefers-reduced-motion: reduce)": { "&:active": { transform: "none" } },
                          }}
                        >
                          {done ? "Copied" : "Copy text"}
                        </Button>
                      </Stack>
                    </Stack>

                    {/* platform-appropriate placeholder image — click to expand */}
                    {media && (
                      <Box
                        role="button"
                        tabIndex={0}
                        aria-label={`Expand ${asset.label} preview`}
                        onClick={() =>
                          setLightbox({
                            id: asset.id,
                            label: asset.label,
                            caption: body,
                          })
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            setLightbox({
                              id: asset.id,
                              label: asset.label,
                              caption: fillCollateral(asset.caption),
                            });
                          }
                        }}
                        sx={{
                          position: "relative",
                          mb: 1.5,
                          mx: media.centered ? "auto" : 0,
                          width: "100%",
                          maxWidth: media.maxWidth,
                          aspectRatio: media.ratio,
                          borderRadius: "10px",
                          border: "1px dashed",
                          borderColor: "divider",
                          bgcolor: "action.hover",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 0.75,
                          color: "text.disabled",
                          cursor: "pointer",
                          outline: "none",
                          transition: `border-color 160ms ${EASE_OUT}, background-color 160ms ${EASE_OUT}`,
                          "&:hover, &:focus-visible": {
                            borderColor: "primary.main",
                            bgcolor: (t) => alpha(t.palette.primary.main, 0.06),
                            "& .col-zoom": { opacity: 1, transform: "scale(1)" },
                          },
                        }}
                      >
                        <Box
                          className="col-zoom"
                          sx={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            width: 28,
                            height: 28,
                            borderRadius: "8px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: "background.paper",
                            border: "1px solid",
                            borderColor: "divider",
                            color: "text.secondary",
                            opacity: 0,
                            transform: "scale(0.9)",
                            transition: `opacity 160ms ${EASE_OUT}, transform 160ms ${EASE_OUT}`,
                            "@media (hover: none)": { opacity: 1, transform: "scale(1)" },
                          }}
                        >
                          <ZoomOutMapRoundedIcon sx={{ fontSize: 16 }} />
                        </Box>
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          <ImageOutlinedIcon sx={{ fontSize: 18 }} />
                          <media.icon sx={{ fontSize: 20 }} />
                        </Stack>
                        <Typography variant="caption" sx={{ fontWeight: 600, ...TABULAR }}>
                          {media.size}
                        </Typography>
                      </Box>
                    )}

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ lineHeight: 1.5, whiteSpace: "pre-line" }}
                    >
                      {fillCollateral(asset.caption)}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ mt: 1, color: "primary.main", fontWeight: 600, wordBreak: "break-all", lineHeight: 1.45 }}
                    >
                      {link}
                    </Typography>
                  </Box>
                );
              })}
            </Stack>
          </>
        )}
      </Box>

      {/* collateral image lightbox */}
      <Modal
        open={Boolean(lightbox)}
        onClose={() => setLightbox(null)}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{ backdrop: { timeout: 200, sx: { bgcolor: "rgba(0,0,0,0.78)" } } }}
        sx={{ display: "flex", alignItems: "center", justifyContent: "center", p: { xs: 2, sm: 4 } }}
      >
        <Fade in={Boolean(lightbox)} timeout={200}>
          <Box sx={{ position: "relative", outline: "none", maxWidth: "100%", maxHeight: "100%" }}>
            <IconButton
              aria-label="Close preview"
              onClick={() => setLightbox(null)}
              sx={{
                position: "absolute",
                top: -14,
                right: -14,
                zIndex: 1,
                bgcolor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
                boxShadow: 2,
                transition: `transform 130ms ${EASE_OUT}`,
                "&:hover": { bgcolor: "background.paper" },
                "&:active": { transform: "scale(0.94)" },
              }}
            >
              <CloseRoundedIcon sx={{ fontSize: 20 }} />
            </IconButton>
            {lightbox &&
              (() => {
                const media = COLLATERAL_MEDIA[lightbox.id];
                if (!media) return null;
                // Fit the image within both a max width and ~62vh tall, whatever the
                // aspect ratio — portrait (IG story) and landscape (LinkedIn) both fit
                // without the modal scrolling.
                const [rw, rh] = media.ratio.split("/").map((n) => parseFloat(n));
                const ar = rw / rh;
                const boxWidth = `min(640px, 90vw, ${(62 * ar).toFixed(2)}vh)`;
                return (
                  <Box
                    sx={{
                      width: boxWidth,
                      maxHeight: "90vh",
                      overflowY: "auto",
                      borderRadius: "14px",
                      bgcolor: "background.paper",
                    }}
                  >
                    {/* enlarged placeholder image */}
                    <Box
                      sx={{
                        width: "100%",
                        aspectRatio: media.ratio,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 1.5,
                        color: "text.disabled",
                        borderBottom: "1px solid",
                        borderColor: "divider",
                      }}
                    >
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <ImageOutlinedIcon sx={{ fontSize: 34 }} />
                        <media.icon sx={{ fontSize: 38 }} />
                      </Stack>
                      <Typography sx={{ fontWeight: 700, fontSize: 18, ...TABULAR }}>{media.size}</Typography>
                    </Box>
                    {/* caption — same copy that ships with the post */}
                    <Box sx={{ p: { xs: 2, sm: 2.5 } }}>
                      <Typography
                        sx={{
                          fontSize: "0.7rem",
                          fontWeight: 700,
                          letterSpacing: "0.06em",
                          textTransform: "uppercase",
                          color: "text.secondary",
                          mb: 1,
                        }}
                      >
                        {lightbox.label}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "text.primary", lineHeight: 1.6, whiteSpace: "pre-line" }}
                      >
                        {lightbox.caption}
                      </Typography>

                      {/* actions — same as the card */}
                      <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                        <Button
                          size="small"
                          startIcon={<FileDownloadOutlinedIcon sx={{ fontSize: 16 }} />}
                          onClick={() => downloadImage(lightbox.id, lightbox.label)}
                          sx={{
                            textTransform: "none",
                            fontWeight: 600,
                            color: "text.secondary",
                            transition: `transform 130ms ${EASE_OUT}`,
                            "&:active": { transform: "scale(0.97)" },
                            "@media (prefers-reduced-motion: reduce)": { "&:active": { transform: "none" } },
                          }}
                        >
                          Download image
                        </Button>
                        <Button
                          size="small"
                          startIcon={
                            copiedKey === `lightbox:${lightbox.id}` ? (
                              <CheckRoundedIcon sx={{ fontSize: 16 }} />
                            ) : (
                              <ContentCopyOutlinedIcon sx={{ fontSize: 16 }} />
                            )
                          }
                          onClick={() =>
                            copy(`lightbox:${lightbox.id}`, lightbox.caption, `${lightbox.label} copied to clipboard.`)
                          }
                          sx={{
                            textTransform: "none",
                            fontWeight: 600,
                            color: copiedKey === `lightbox:${lightbox.id}` ? "success.main" : "primary.main",
                            transition: `transform 130ms ${EASE_OUT}`,
                            "&:active": { transform: "scale(0.97)" },
                            "@media (prefers-reduced-motion: reduce)": { "&:active": { transform: "none" } },
                          }}
                        >
                          {copiedKey === `lightbox:${lightbox.id}` ? "Copied" : "Copy text"}
                        </Button>
                      </Stack>
                    </Box>
                  </Box>
                );
              })()}
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
}
