import { useEffect, useState, type ReactNode } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
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
import type { SvgIconComponent } from "@mui/icons-material";
import { fmtDateNice, fmtUsd, fmtInr } from "@/lib/helpers";
import { demoBroadcastCollateral, referralLinkFor } from "@/data/demo-ambassador";
import { useAppDispatch } from "@/store";
import { pushToast } from "@/store/slices/toastsSlice";
import type { AmbassadorProgram } from "@/lib/types";
import { useRecommend } from "./RecommendContext";

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

/* Small uppercase section header with a leading icon — used across the detail dialog. */
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

/* ── Program detail drawer ────────────────────────────────────────────── */
export function ProgramDetailDrawer({
  program,
  onClose,
}: {
  program: AmbassadorProgram | null;
  onClose: () => void;
}) {
  const { openFlow } = useRecommend();
  const dispatch = useAppDispatch();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [drawerTab, setDrawerTab] = useState<"overview" | "collaterals">("overview");

  const open = Boolean(program);
  const link = program ? referralLinkFor(program.scholarshipCode) : "";

  // Reset to Overview whenever a different program opens.
  useEffect(() => {
    if (program) setDrawerTab("overview");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [program?.id]);

  // Fill a collateral template with this program's details (link appended for the copy payload).
  const fillCollateral = (caption: string) =>
    !program
      ? caption
      : caption
          .replace(/\[program name\]/g, program.title)
          .replace(/\[start date\]/g, fmtDateNice(program.nextCohortYmd))
          .replace(/\[scholarship code\]/g, program.scholarshipCode)
          .replace(/\[percent off\]/g, String(program.scholarshipPct));

  const copy = (key: string, value: string, description: string) => {
    navigator.clipboard.writeText(value);
    dispatch(pushToast({ title: "Copied", description }));
    setCopiedKey(key);
    window.setTimeout(() => setCopiedKey((k) => (k === key ? null : k)), 1600);
  };

  const recommend = () => {
    if (!program) return;
    openFlow(program.id);
    onClose();
  };

  const downloadCurriculum = () => {
    if (!program) return;
    dispatch(
      pushToast({
        title: "Curriculum download started",
        description: `${program.title} — full syllabus (PDF).`,
      }),
    );
  };

  const downloadBrochure = () => {
    if (!program) return;
    dispatch(
      pushToast({
        title: "Brochure download started",
        description: `${program.title} — program brochure (PDF).`,
      }),
    );
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiDrawer-paper": {
          width: { xs: "100vw", sm: 480 },
          maxWidth: "100vw",
          boxShadow: "-4px 0 24px rgba(0,0,0,0.06)",
          borderLeft: "1px solid",
          borderColor: "divider",
        },
      }}
    >
      {program && (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
          {/* header */}
          <Box
            sx={{
              position: "relative",
              px: { xs: 2.5, sm: 3 },
              pt: { xs: 3, sm: 3.5 },
              pb: 2.5,
            }}
          >
            <IconButton
              onClick={onClose}
              size="small"
              aria-label="Close"
              sx={{
                position: "absolute",
                top: 14,
                right: 14,
                color: "text.secondary",
                transition: `transform 130ms ${EASE_OUT}`,
                "&:hover": { bgcolor: "action.hover" },
                "&:active": { transform: "scale(0.92)" },
              }}
            >
              <CloseRoundedIcon fontSize="small" />
            </IconButton>

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
            <Typography
              variant="h5"
              sx={{ fontWeight: 800, lineHeight: 1.2, letterSpacing: "-0.015em", pr: 4 }}
            >
              {program.title}
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5, color: "text.secondary" }}>
              {program.university}
            </Typography>
          </Box>

          {/* section tabs */}
          <Box sx={{ borderBottom: 1, borderColor: "divider", px: { xs: 2.5, sm: 3 } }}>
            <Tabs
              value={drawerTab}
              onChange={(_e, v) => setDrawerTab(v as "overview" | "collaterals")}
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

          <Box
            className="themed-scrollbar"
            sx={{ flex: 1, minHeight: 0, overflowY: "auto", px: { xs: 2.5, sm: 3 }, py: { xs: 2.5, sm: 3 } }}
          >
            {drawerTab === "overview" && (
              <>
            {/* lead */}
            <Typography sx={{ fontSize: 15, lineHeight: 1.65, color: "text.secondary" }}>
              {program.blurb}
            </Typography>

            {/* meta — icon / label row */}
            <Grid container columnSpacing={2} rowSpacing={2.5} sx={{ mt: 3 }}>
              {[
                { k: "Duration", v: program.durationLabel, icon: ScheduleOutlinedIcon },
                { k: "Program fee", v: fmtUsd(program.price), icon: PaymentsOutlinedIcon },
                { k: "Format", v: program.mode, icon: PublicOutlinedIcon },
              ].map((f) => (
                <Grid key={f.k} size={{ xs: 4 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <f.icon sx={{ fontSize: 18, color: "text.primary" }} />
                    <Typography sx={{ fontWeight: 700, fontSize: 14 }}>{f.k}</Typography>
                  </Stack>
                  <Typography
                    sx={{ mt: 0.5, pl: "26px", color: "text.secondary", fontSize: 14, ...TABULAR }}
                  >
                    {f.v}
                  </Typography>
                </Grid>
              ))}
            </Grid>

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
                onClick={() => setDrawerTab("collaterals")}
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
              What you&rsquo;ll learn
            </SectionLabel>
            <Grid container columnSpacing={3} rowSpacing={2}>
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

            {drawerTab === "collaterals" && (
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
                      <Button
                        size="small"
                        startIcon={
                          done ? (
                            <CheckRoundedIcon sx={{ fontSize: 16 }} />
                          ) : (
                            <ContentCopyOutlinedIcon sx={{ fontSize: 16 }} />
                          )
                        }
                        onClick={() =>
                          copy(key, `${fillCollateral(asset.caption)}\n\n${link}`, `${asset.label} copied to clipboard.`)
                        }
                        sx={{
                          textTransform: "none",
                          fontWeight: 600,
                          flexShrink: 0,
                          color: done ? "success.main" : "primary.main",
                          transition: `transform 130ms ${EASE_OUT}`,
                          "&:active": { transform: "scale(0.97)" },
                          "@media (prefers-reduced-motion: reduce)": { "&:active": { transform: "none" } },
                        }}
                      >
                        {done ? "Copied" : "Copy"}
                      </Button>
                    </Stack>

                    {/* platform-appropriate placeholder image */}
                    {media && (
                      <Box
                        sx={{
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
                        }}
                      >
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
                  </Box>
                );
              })}
            </Stack>
              </>
            )}

          </Box>

          {/* footer action bar */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              px: { xs: 2.5, sm: 3 },
              py: 2,
              gap: 1.5,
              bgcolor: "background.paper",
              borderTop: "1px solid",
              borderColor: "divider",
            }}
          >
            <Box sx={{ mr: "auto", minWidth: 0 }}>
              <Typography
                sx={{
                  fontSize: "0.66rem",
                  fontWeight: 700,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  color: "text.secondary",
                  lineHeight: 1,
                }}
              >
                You earn
              </Typography>
              <Typography
                sx={{
                  mt: 0.4,
                  fontWeight: 800,
                  fontSize: 15,
                  lineHeight: 1.2,
                  color: "var(--gl-status-confirmed-text)",
                  ...TABULAR,
                }}
              >
                {program.earningModel === "percentage"
                  ? `Up to ${program.bonusPctSelfCheckout}% of the program fee`
                  : `${fmtUsd(program.flatBonusUsd ?? 0)} / ${fmtInr(program.flatBonusInr ?? 0)} per enrollment`}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {program.payoutTiming}
              </Typography>
            </Box>
            <Button
              variant="contained"
              onClick={recommend}
              sx={{
                textTransform: "none",
                fontWeight: 700,
                borderRadius: "10px",
                flexShrink: 0,
                transition: `transform 130ms ${EASE_OUT}`,
                "&:active": { transform: "scale(0.97)" },
                "@media (prefers-reduced-motion: reduce)": { "&:active": { transform: "none" } },
              }}
            >
              Recommend this program
            </Button>
          </Box>
        </Box>
      )}
    </Drawer>
  );
}
