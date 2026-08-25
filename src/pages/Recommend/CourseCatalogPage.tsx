import { useDeferredValue, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { alpha, useTheme } from "@mui/material/styles";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import { referableCourses } from "@/data/demo-referable-courses";
import { guruMentoredCourses } from "@/data/demo-referable-courses";
import { groupByDomain, type DomainGroup } from "@/lib/courseDomains";
import { CourseCard } from "@/components/recommend/CourseCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { useScrollMemory } from "@/lib/scrollRestore";

const EASE_OUT = "cubic-bezier(0.23, 1, 0.32, 1)";
/**
 * Page gutter. 80px from md up, as specified; below that it steps down, since
 * 160px of combined padding would leave a phone with almost no content width.
 * Shared by the nav and the grid so their edges line up.
 */
const GUTTER = { xs: 2, sm: 3, md: "80px" };
/**
 * Eyebrow gradient, sampled from the marketing header on mygreatlearning.com
 * (purple into the brand navy). Not in the theme palette — it exists only here,
 * so it stays local rather than adding a one-off token.
 */
const EYEBROW_GRADIENT = {
  light: "linear-gradient(90deg, #a21caf 0%, #6d28d9 42%, #1e213f 100%)",
  dark: "linear-gradient(90deg, #e879f9 0%, #a78bfa 42%, #cbd5f5 100%)",
};
/** Rule-flanked section heading, matching the reference's section dividers. */
function SectionHeading({ label }: { label: string }) {
  return (
    <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
      <Typography
        sx={{
          fontSize: "0.72rem",
          fontWeight: 800,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "text.secondary",
          flexShrink: 0,
        }}
      >
        {label}
      </Typography>
      <Box sx={{ flex: 1, height: "1px", bgcolor: "divider" }} />
    </Stack>
  );
}

export default function CourseCatalogPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  // Keeps typing responsive while the (large) grid re-filters.
  const deferredQuery = useDeferredValue(query);
  const [activeDomain, setActiveDomain] = useState<string | null>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);

  /*
   * Long grid with no single anchor, so the offset itself is what's worth
   * keeping — a guru who opened a course two-thirds down comes back to it.
   * Which element scrolls depends on the viewport (see the root Box below), so
   * this resolves it at run time rather than assuming the container.
   */
  useScrollMemory("recommend-courses", () => {
    const el = scrollerRef.current;
    if (!el) return null;
    return getComputedStyle(el).overflowY === "auto" ? el : window;
  });

  const q = deferredQuery.trim().toLowerCase();

  const groups = useMemo<DomainGroup[]>(() => {
    const matches = q
      ? referableCourses.filter(
          (c) =>
            c.title.toLowerCase().includes(q) || (c.provider ?? "").toLowerCase().includes(q),
        )
      : referableCourses;
    return groupByDomain(matches);
  }, [q]);

  // The guru's own programs lead the page, but only when not searching or
  // filtering — otherwise they'd duplicate rows already shown below.
  const showMine = !q && !activeDomain && guruMentoredCourses.length > 0;
  const visibleGroups = activeDomain
    ? groups.filter((g) => g.domain === activeDomain)
    : groups;
  const total = groups.reduce((n, g) => n + g.courses.length, 0);

  const domains = useMemo(() => groupByDomain(referableCourses).map((g) => g.domain), []);

  return (
    /*
     * Full-bleed page: renders outside AppLayout, so there's no app rail and no
     * content width cap — it owns its whole viewport.
     *
     * It also has to own its scrolling. index.css sets `body { overflow: hidden }`
     * on desktop because AppLayout supplies the scroll container; a page outside
     * that shell therefore can't scroll the document at all. So the nav is a
     * fixed flex item and the content below it scrolls. Under 600px the global
     * rule flips to `overflow: visible` for native viewport scrolling, so there
     * the page defers to the body rather than nesting a second scroller.
     */
    <Box
      sx={{
        bgcolor: "background.default",
        display: "flex",
        flexDirection: "column",
        height: { xs: "auto", sm: "100dvh" },
        // Never taller than #root, so anything above the app shrinks this page
        // instead of pushing its bottom out of reach (see index.css).
        maxHeight: { sm: "100%" },
        overflow: { xs: "visible", sm: "hidden" },
      }}
    >
      {/* ── Top nav, spanning the page: logo left, search right ──────────── */}
      <Stack
        component="nav"
        direction="row"
        alignItems="center"
        spacing={{ xs: 1, sm: 2 }}
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          px: GUTTER,
          py: 1.5,
          bgcolor: "background.paper",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <IconButton
          // Always back to Recommend — this page can be deep-linked, so history
          // isn't a reliable way home.
          onClick={() => navigate("/recommend")}
          aria-label="Back to Recommend"
          sx={{ flexShrink: 0, "&.Mui-focusVisible": { outline: `2px solid ${theme.palette.primary.main}` } }}
        >
          <ArrowBackRoundedIcon />
        </IconButton>
        <Box
          component="img"
          src={theme.palette.mode === "dark" ? "/gl-logo-white.svg" : "/gl-logo-navy.svg"}
          alt="Great Learning"
          sx={{ height: 26, flexShrink: 0, display: { xs: "none", sm: "block" } }}
        />
        <Box sx={{ flex: 1 }} />
        <TextField
          size="small"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search courses or universities"
          sx={{ width: { xs: "100%", sm: 300, md: 360 } }}
          slotProps={{
            // On the native input, not the TextField root — an aria-label on the
            // wrapper leaves the field itself without an accessible name.
            htmlInput: { "aria-label": "Search courses" },
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon sx={{ fontSize: 19, color: "text.disabled" }} />
                </InputAdornment>
              ),
            },
          }}
        />
      </Stack>

      <Box
        ref={scrollerRef}
        className="themed-scrollbar"
        sx={{
          flex: { sm: 1 },
          minHeight: 0,
          overflowY: { xs: "visible", sm: "auto" },
          overscrollBehavior: "contain",
        }}
      >
        {/* ── Page header, centred above the grid ────────────────────────── */}
        <Box sx={{ px: GUTTER, pt: "40px", textAlign: "center" }}>
          <Typography
            sx={{
              fontSize: { xs: "0.72rem", md: "0.8rem" },
              fontWeight: 800,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              // Gradient text: paint the gradient, then clip it to the glyphs.
              backgroundImage: (t) => EYEBROW_GRADIENT[t.palette.mode],
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
              color: "transparent",
            }}
          >
            Find your future with
          </Typography>
          <Typography
            component="h1"
            sx={{
              mt: 1.25,
              mx: "auto",
              // Narrow enough that the line breaks mid-phrase like the
              // reference, rather than running the full 80px-gutter width.
              maxWidth: 640,
              fontWeight: 800,
              fontSize: { xs: "1.85rem", sm: "2.4rem", md: "3rem" },
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
            }}
          >
            Programs from the world's best universities
          </Typography>
        </Box>

        <Grid
          container
          spacing={{ xs: 2, md: 4 }}
          sx={{ px: GUTTER, pt: { xs: 3, md: 4.5 }, pb: { xs: 6, md: 10 } }}
        >
        {/* ── Sidebar: heading + domain nav ──────────────────────────────── */}
        <Grid size={{ xs: 12, md: 3 }}>
          <Box sx={{ position: { md: "sticky" }, top: { md: 8 } }}>
            <Stack component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
              {[null, ...domains].map((d) => {
                const label = d ?? "All courses";
                const selected = activeDomain === d;
                return (
                  <Box component="li" key={label}>
                    <Box
                      component="button"
                      type="button"
                      onClick={() => setActiveDomain(d)}
                      aria-current={selected ? "true" : undefined}
                      sx={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        gap: 1.25,
                        textAlign: "left",
                        px: 1.5,
                        py: 1.25,
                        border: 0,
                        borderRadius: "10px",
                        cursor: "pointer",
                        font: "inherit",
                        fontWeight: selected ? 700 : 500,
                        color: selected ? "primary.main" : "text.primary",
                        bgcolor: (t) => (selected ? alpha(t.palette.primary.main, 0.08) : "transparent"),
                        transition: `background-color 140ms ${EASE_OUT}`,
                        "&:hover": { bgcolor: "action.hover" },
                        "&:focus-visible": {
                          outline: (t) => `2px solid ${t.palette.primary.main}`,
                          outlineOffset: -2,
                        },
                      }}
                    >
                      <SchoolOutlinedIcon sx={{ fontSize: 18, flexShrink: 0, opacity: selected ? 1 : 0.55 }} />
                      <Box sx={{ flex: 1, minWidth: 0 }}>{label}</Box>
                      <ChevronRightRoundedIcon sx={{ fontSize: 18, flexShrink: 0, opacity: 0.5 }} />
                    </Box>
                  </Box>
                );
              })}
            </Stack>
          </Box>
        </Grid>

        {/* ── Course grid ────────────────────────────────────────────────── */}
        <Grid size={{ xs: 12, md: 9 }}>
          {showMine && (
            <Box sx={{ mb: 4 }}>
              <SectionHeading label="Pick up where you left off" />
              <Grid container spacing={2}>
                {guruMentoredCourses.slice(0, 3).map((c, i) => (
                  <Grid key={c.slug} size={{ xs: 12, sm: 6, lg: 4 }}>
                    <CourseCard course={c} index={i} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {total === 0 ? (
            <EmptyState
              icon={<SchoolOutlinedIcon />}
              title="No courses match that search"
              subtitle="Try a different course name or university."
            />
          ) : (
            visibleGroups.map((g) => (
              <Box key={g.domain} sx={{ mb: 4 }}>
                <SectionHeading label={g.domain} />
                <Grid container spacing={2}>
                  {g.courses.map((c, i) => (
                    <Grid key={c.slug} size={{ xs: 12, sm: 6, lg: 4 }}>
                      <CourseCard course={c} index={i} />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            ))
          )}
        </Grid>
        </Grid>
      </Box>

      {/* Result counts for screen readers, as the search filters the grid. */}
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
        {q ? `${total} course${total === 1 ? "" : "s"} found.` : ""}
      </Box>

    </Box>
  );
}
