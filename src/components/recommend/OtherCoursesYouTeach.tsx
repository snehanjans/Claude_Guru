import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Collapse from "@mui/material/Collapse";
import useMediaQuery from "@mui/material/useMediaQuery";
import { alpha, useTheme } from "@mui/material/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import {
  demoAmbassadorPrograms,
  GURU_MENTOR_PROGRAM_IDS,
  UNIVERSITY_FLAT_USD,
  referralLinkFor,
} from "@/data/demo-ambassador";
import type { AmbassadorProgram } from "@/lib/types";
import { track, ANALYTICS_EVENTS } from "@/lib/analytics";

const EASE_OUT = "cubic-bezier(0.23, 1, 0.32, 1)";
/** How long the "Copied" state shows before reverting. */
const COPIED_MS = 2000;
/** Card width per breakpoint. On mobile the card is under half the viewport so
 *  the next one peeks in, hinting the row scrolls. */
const CARD_W = { xs: 232, sm: 244, md: 232 };

const clamp = (lines: number) => ({
  display: "-webkit-box",
  WebkitLineClamp: lines,
  WebkitBoxOrient: "vertical" as const,
  overflow: "hidden",
});

/**
 * Institution initials, used as the logo stand-in.
 * Real institution marks aren't in the repo; this keeps the lockup's shape so
 * dropping in actual logos later is a swap, not a redesign.
 */
function institutionInitials(name: string): string {
  const known = name.match(/\b(IIT|MIT|NUS|UT|SRM|SPJIMR)\b/);
  if (known) return known[1];
  const words = name.replace(/[^A-Za-z\s]/g, " ").split(/\s+/).filter(Boolean);
  const skip = new Set(["of", "the", "at", "and", "school", "business", "college", "university", "institute"]);
  const initials = words.filter((w) => !skip.has(w.toLowerCase())).slice(0, 3).map((w) => w[0]);
  return (initials.join("") || name.slice(0, 2)).toUpperCase();
}

/** Landscape banner: brand gradient + pattern wash, with the logo badge. */
function InstitutionBanner({ program, index }: { program: AmbassadorProgram; index: number }) {
  const pattern = `/course-patterns/p${(index % 6) + 1}.svg`;
  return (
    <Box
      sx={{
        position: "relative",
        // Fixed ratio, so cards stay uniform however many are in view.
        aspectRatio: "16 / 9",
        overflow: "hidden",
        background: (t) =>
          `linear-gradient(135deg, ${t.palette.primary.dark}, ${t.palette.primary.main} 62%, ${alpha(
            t.palette.secondary.main,
            0.85,
          )})`,
      }}
    >
      <Box
        component="img"
        src={pattern}
        alt=""
        aria-hidden="true"
        sx={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: 0.28,
          pointerEvents: "none",
        }}
      />
      {/* Logo badge, lower portion of the image. */}
      <Stack
        direction="row"
        alignItems="center"
        spacing={0.5}
        sx={{
          position: "absolute",
          left: 10,
          bottom: 10,
          px: 0.875,
          py: 0.5,
          borderRadius: "8px",
          bgcolor: "#fff",
          boxShadow: 1,
          maxWidth: "calc(100% - 20px)",
        }}
      >
        <SchoolOutlinedIcon sx={{ fontSize: 14, color: "primary.main", flexShrink: 0 }} />
        <Typography
          noWrap
          sx={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.04em", color: "#111" }}
        >
          {institutionInitials(program.university)}
        </Typography>
      </Stack>
    </Box>
  );
}

/* ── One course card ──────────────────────────────────────────────────────── */
function TeachCourseCard({
  program,
  index,
  onCopied,
}: {
  program: AmbassadorProgram;
  index: number;
  onCopied: (message: string) => void;
}) {
  const [copied, setCopied] = useState(false);
  const [needsManualCopy, setNeedsManualCopy] = useState(false);
  const linkRef = useRef<HTMLSpanElement>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => () => { if (timerRef.current) window.clearTimeout(timerRef.current); }, []);

  const link = referralLinkFor(program.scholarshipCode);

  const flash = () => {
    setCopied(true);
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setCopied(false), COPIED_MS);
  };

  const handleCopy = async () => {
    track(ANALYTICS_EVENTS.TEACH_LINK_COPIED, { courseId: program.id, course: program.title });
    try {
      if (!navigator.clipboard?.writeText) throw new Error("clipboard unavailable");
      await navigator.clipboard.writeText(link);
      setNeedsManualCopy(false);
      flash();
      onCopied(`Referral link for ${program.title} copied.`);
    } catch {
      // Clipboard blocked (permissions, insecure context). Reveal the link and
      // select it so the guru can copy manually rather than losing the action.
      setNeedsManualCopy(true);
      onCopied("Couldn't copy automatically. The link is selected — press Ctrl or Cmd + C.");
      window.setTimeout(() => {
        const el = linkRef.current;
        if (!el) return;
        const range = document.createRange();
        range.selectNodeContents(el);
        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(range);
      }, 0);
    }
  };

  return (
    <Card
      variant="outlined"
      sx={{
        // Matches the program cards above.
        borderRadius: "16px",
        overflow: "hidden",
        flex: "0 0 auto",
        width: CARD_W,
        scrollSnapAlign: "start",
        display: "flex",
        flexDirection: "column",
        transition: `border-color 180ms ${EASE_OUT}`,
        "@media (hover: hover)": {
          "&:hover": { borderColor: (t) => alpha(t.palette.primary.main, 0.55) },
        },
        "&:focus-within": { borderColor: (t) => alpha(t.palette.primary.main, 0.55) },
      }}
    >
      <InstitutionBanner program={program} index={index} />
      <CardContent
        sx={{ p: 1.75, display: "flex", flexDirection: "column", flex: 1, "&:last-child": { pb: 1.75 } }}
      >
        <Typography
          sx={{
            fontSize: "0.68rem",
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "text.secondary",
            ...clamp(1),
          }}
        >
          {program.university}
        </Typography>
        <Typography
          variant="subtitle2"
          sx={{ mt: 0.5, fontWeight: 700, lineHeight: 1.35, minHeight: "2.7em", ...clamp(2) }}
        >
          {program.title}
        </Typography>
        <Typography sx={{ mt: 0.75, fontSize: 12.5, color: "text.secondary" }}>
          {[program.durationLabel, program.mode].filter(Boolean).join(" · ")}
        </Typography>

        <Box sx={{ mt: "auto", pt: 1.25, textAlign: "center" }}>
          <Button
            onClick={handleCopy}
            startIcon={
              copied ? (
                <CheckRoundedIcon sx={{ fontSize: 16 }} />
              ) : (
                <ContentCopyOutlinedIcon sx={{ fontSize: 16 }} />
              )
            }
            sx={{
              textTransform: "none",
              fontWeight: 700,
              fontSize: 13,
              color: copied ? "success.main" : "primary.main",
              "&:hover": { bgcolor: "action.hover" },
              "&.Mui-focusVisible": {
                outline: (t) => `2px solid ${t.palette.primary.main}`,
                outlineOffset: 2,
              },
            }}
          >
            {copied ? "Copied" : "Copy Referral Link"}
          </Button>
          {/* Only rendered when the clipboard API failed, so there's something
              real to select and copy by hand. */}
          {needsManualCopy && (
            <Typography
              ref={linkRef}
              component="span"
              sx={{
                display: "block",
                mt: 0.5,
                fontSize: 11,
                color: "text.secondary",
                wordBreak: "break-all",
                userSelect: "all",
              }}
            >
              {link}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

/* ── Section ──────────────────────────────────────────────────────────────── */
export function OtherCoursesYouTeach() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("");
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);

  // Only programs the guru actually mentors, from the flat-bonus catalogue.
  const courses = useMemo(
    () =>
      demoAmbassadorPrograms.filter(
        (p) => p.family === "university" && GURU_MENTOR_PROGRAM_IDS.has(p.id),
      ),
    [],
  );

  const syncArrows = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    /*
     * Tolerance, not an exact 0. The row carries a couple of px of padding so
     * focus rings aren't clipped, and scroll-snap parks it a hair off zero — an
     * exact check left the "previous" arrow permanently enabled at the start.
     */
    const EDGE_SLOP = 8;
    setAtStart(el.scrollLeft <= EDGE_SLOP);
    setAtEnd(el.scrollLeft >= max - EDGE_SLOP);
  }, []);

  useEffect(() => {
    if (!open) return;
    const el = scrollerRef.current;
    if (!el) return;

    /*
     * Measuring once on rAF is not enough: the section opens behind a Collapse
     * height animation, so the first frame reports a zero-width scroller and
     * the arrows latch to "disabled at both ends" with nothing to re-trigger a
     * measurement. Observing size instead re-syncs as the row settles, and
     * covers font/image reflow and container resizes for free.
     */
    const ro = new ResizeObserver(syncArrows);
    ro.observe(el);
    // Content width changes matter too, not just the viewport of the scroller.
    Array.from(el.children).forEach((c) => ro.observe(c));

    el.addEventListener("scroll", syncArrows, { passive: true });
    window.addEventListener("resize", syncArrows);
    syncArrows();
    return () => {
      ro.disconnect();
      el.removeEventListener("scroll", syncArrows);
      window.removeEventListener("resize", syncArrows);
    };
  }, [open, syncArrows]);

  const page = (dir: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    // One visible page, but never less than a card.
    const card = el.querySelector<HTMLElement>("[data-course-card]");
    const step = Math.max(card?.offsetWidth ?? 232, el.clientWidth - 80);
    el.scrollBy({ left: dir * step, behavior: "smooth" });
    track(ANALYTICS_EVENTS.TEACH_CAROUSEL_SCROLLED, { direction: dir === 1 ? "next" : "previous" });
  };

  const toggle = () => {
    const next = !open;
    setOpen(next);
    if (next) track(ANALYTICS_EVENTS.TEACH_SECTION_EXPANDED, { courses: courses.length });
  };

  return (
    <Box
      sx={{
        mt: 2.5,
        borderRadius: "16px",
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        overflow: "hidden",
      }}
    >
      {/* Header — always visible, toggles the section. */}
      <Box
        component="button"
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-controls="other-courses-you-teach-panel"
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          textAlign: "left",
          p: { xs: 2, sm: 2.25 },
          border: 0,
          bgcolor: "transparent",
          cursor: "pointer",
          font: "inherit",
          color: "inherit",
          "&:hover": { bgcolor: "action.hover" },
          "&:focus-visible": {
            outline: (t) => `2px solid ${t.palette.primary.main}`,
            outlineOffset: -2,
          },
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            Other courses you teach
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.55 }}>
            Grab a referral link for any of them. Earn ${UNIVERSITY_FLAT_USD} for every learner who
            enrols.
          </Typography>
        </Box>
        <ExpandMoreIcon
          sx={{
            flexShrink: 0,
            color: "text.secondary",
            transition: `transform 180ms ${EASE_OUT}`,
            transform: open ? "rotate(180deg)" : "none",
            "@media (prefers-reduced-motion: reduce)": { transition: "none" },
          }}
        />
      </Box>

      <Collapse in={open} unmountOnExit>
        <Box id="other-courses-you-teach-panel" sx={{ px: { xs: 2, sm: 2.25 }, pb: 2.25 }}>
          {courses.length === 0 ? (
            <Box sx={{ py: 1 }}>
              <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.6 }}>
                You're not currently listed as a mentor on any other programs. If that's not right,{" "}
                <Box
                  component={RouterLink}
                  to="/support"
                  sx={{ color: "primary.main", fontWeight: 600, textDecoration: "none", "&:hover": { textDecoration: "underline" } }}
                >
                  let us know
                </Box>
                .
              </Typography>
            </Box>
          ) : (
            <>
              <Box sx={{ position: "relative" }}>
                {/* Arrows are desktop-only; on mobile the row is swiped. */}
                {!isMobile && (
                  <>
                    <IconButton
                      onClick={() => page(-1)}
                      disabled={atStart}
                      aria-label="Show previous courses"
                      sx={carouselArrowSx("left")}
                    >
                      <ChevronLeftRoundedIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => page(1)}
                      disabled={atEnd}
                      aria-label="Show next courses"
                      sx={carouselArrowSx("right")}
                    >
                      <ChevronRightRoundedIcon />
                    </IconButton>
                  </>
                )}

                <Box
                  ref={scrollerRef}
                  sx={{
                    display: "flex",
                    gap: 2,
                    overflowX: "auto",
                    scrollSnapType: "x mandatory",
                    // Room for the focus ring, and a touch of bleed on mobile.
                    px: "2px",
                    py: "2px",
                    scrollbarWidth: "none",
                    "&::-webkit-scrollbar": { display: "none" },
                    "@media (prefers-reduced-motion: reduce)": { scrollBehavior: "auto" },
                  }}
                >
                  {courses.map((p, i) => (
                    <Box key={p.id} data-course-card sx={{ display: "flex", flex: "0 0 auto" }}>
                      <TeachCourseCard program={p} index={i} onCopied={setStatus} />
                    </Box>
                  ))}
                </Box>
              </Box>

            </>
          )}

          {/* Footer card */}
          <Card
            variant="outlined"
            sx={{
              mt: 2,
              borderRadius: "16px",
              bgcolor: (t) =>
                t.palette.mode === "dark" ? "rgba(255,255,255,0.02)" : alpha(t.palette.grey[500], 0.05),
            }}
          >
            <CardContent sx={{ p: { xs: 2, sm: 2.25 }, "&:last-child": { pb: { xs: 2, sm: 2.25 } } }}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={{ xs: 1.5, sm: 2 }}
                alignItems={{ xs: "flex-start", sm: "center" }}
                justifyContent="space-between"
              >
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    Want to explore courses from other domains?
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.55 }}>
                    Browse every program by domain, university and duration, and grab a referral
                    link for the ones that fit your network.
                  </Typography>
                </Box>
                <Button
                  component={RouterLink}
                  to="/courses"
                  variant="outlined"
                  sx={{
                    flexShrink: 0,
                    textTransform: "none",
                    fontWeight: 700,
                    borderRadius: "10px",
                    width: { xs: "100%", sm: "auto" },
                  }}
                >
                  See all courses →
                </Button>
              </Stack>
            </CardContent>
          </Card>


          {/* Copy confirmation / clipboard-fallback guidance. */}
          <Box
            aria-live="polite"
            sx={{
              position: "absolute",
              width: "1px",
              height: "1px",
              m: "-1px",
              p: 0,
              border: 0,
              overflow: "hidden",
              clipPath: "inset(50%)",
              whiteSpace: "nowrap",
            }}
          >
            {status}
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
}

/** Floating arrow control, vertically centred over the row. */
const carouselArrowSx = (side: "left" | "right") => ({
  position: "absolute" as const,
  top: "38%",
  [side]: -10,
  zIndex: 2,
  bgcolor: "background.paper",
  border: "1px solid",
  borderColor: "divider",
  boxShadow: 2,
  "&:hover": { bgcolor: "background.paper" },
  "&.Mui-disabled": { opacity: 0, pointerEvents: "none" as const },
  "&.Mui-focusVisible": { outline: "2px solid", outlineColor: "primary.main", outlineOffset: 2 },
});
