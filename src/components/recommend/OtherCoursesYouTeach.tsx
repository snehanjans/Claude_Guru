import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
import useMediaQuery from "@mui/material/useMediaQuery";
import { alpha, useTheme } from "@mui/material/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { UNIVERSITY_FLAT_USD } from "@/data/demo-ambassador";
import { guruMentoredCourses } from "@/data/demo-referable-courses";
import { CourseCard, CAROUSEL_CARD_W } from "./CourseCard";
import { track, ANALYTICS_EVENTS } from "@/lib/analytics";
import { rememberSection, takeSection } from "@/lib/scrollRestore";

const EASE_OUT = "cubic-bezier(0.23, 1, 0.32, 1)";
/** Anchor for returning here from a course or catalogue page. */
export const TEACH_SECTION_ID = "other-courses-you-teach";
/** Expanded-or-not, kept for the tab session so a return looks the same. */
const OPEN_KEY = "guru-teach-section-open";

const readOpen = () => {
  try {
    return sessionStorage.getItem(OPEN_KEY) === "1";
  } catch {
    return false;
  }
};
/* ── Section ──────────────────────────────────────────────────────────────── */
export function OtherCoursesYouTeach() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const location = useLocation();
  // Restored, not defaulted: the guru who left from an open section comes back
  // to an open one. `in` is already true at mount, so Collapse doesn't animate.
  const [open, setOpen] = useState(readOpen);
  const rootRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);

  // Only programs the guru is listed as a mentor on.
  const courses = useMemo(() => guruMentoredCourses, []);

  useEffect(() => {
    if (takeSection(location.pathname) !== TEACH_SECTION_ID) return;
    /*
     * Instant, not smooth: this runs as the page finishes loading, and gliding
     * down from the top there reads as the page moving under the guru. Scrolls
     * to the section's top, so the carousel opening below it doesn't shift it.
     */
    rootRef.current?.scrollIntoView({ block: "start", behavior: "auto" });
  }, [location.pathname]);

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
    try {
      sessionStorage.setItem(OPEN_KEY, next ? "1" : "0");
    } catch {
      // Private mode. The section still toggles; it just won't be remembered.
    }
    if (next) track(ANALYTICS_EVENTS.TEACH_SECTION_EXPANDED, { courses: courses.length });
  };

  return (
    <Box
      id={TEACH_SECTION_ID}
      ref={rootRef}
      sx={{
        mt: 2.5,
        // Breathing room above the header when scrolled back into view.
        scrollMarginTop: 12,
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
        {/* Separates the header from the content. Lives inside the Collapse and
            spans the full width, so a collapsed section stays a clean single
            row rather than carrying a stray rule along its bottom edge. */}
        <Divider />
        <Box
          id="other-courses-you-teach-panel"
          sx={{ px: { xs: 2, sm: 2.25 }, pt: { xs: 2, sm: 2.25 }, pb: 2.25 }}
        >
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
                    <Box key={p.slug} data-course-card sx={{ display: "flex", flex: "0 0 auto" }}>
                      <CourseCard
                        course={p}
                        index={i}
                        width={CAROUSEL_CARD_W}
                        returnAnchor={TEACH_SECTION_ID}
                      />
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
                    Browse every program by domain, university and duration, then request a
                    referral link for the one you want.
                  </Typography>
                </Box>
                <Button
                  component={RouterLink}
                  to="/recommend/courses"
                  onClick={() => rememberSection(location.pathname, TEACH_SECTION_ID)}
                  variant="outlined"
                  endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: 18 }} />}
                  sx={{
                    flexShrink: 0,
                    textTransform: "none",
                    fontWeight: 700,
                    borderRadius: "10px",
                    width: { xs: "100%", sm: "auto" },
                  }}
                >
                  See all courses
                </Button>
              </Stack>
            </CardContent>
          </Card>

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
