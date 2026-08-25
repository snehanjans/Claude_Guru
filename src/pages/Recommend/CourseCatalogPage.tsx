import { useDeferredValue, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
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

const EASE_OUT = "cubic-bezier(0.23, 1, 0.32, 1)";
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
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const [query, setQuery] = useState("");
  // Keeps typing responsive while the (large) grid re-filters.
  const deferredQuery = useDeferredValue(query);
  const [activeDomain, setActiveDomain] = useState<string | null>(null);
  const [status, setStatus] = useState("");

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
    <Box sx={{ mx: "auto", maxWidth: 1280 }}>
      {/* ── Page nav: logo left, search right ────────────────────────────── */}
      <Stack
        component="nav"
        direction="row"
        alignItems="center"
        spacing={2}
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 3,
          py: 1.5,
          mb: 3,
          bgcolor: "background.default",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <IconButton
          onClick={() => navigate(-1)}
          aria-label="Go back"
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

      <Grid container spacing={{ xs: 2, md: 4 }}>
        {/* ── Sidebar: heading + domain nav ──────────────────────────────── */}
        <Grid size={{ xs: 12, md: 3 }}>
          <Box sx={{ position: { md: "sticky" }, top: { md: 84 } }}>
            <Typography
              sx={{
                fontSize: "0.72rem",
                fontWeight: 800,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "primary.main",
              }}
            >
              Find your future with
            </Typography>
            <Typography variant="h5" sx={{ mt: 0.5, mb: 2, fontWeight: 800, lineHeight: 1.2 }}>
              Programs from the world's best universities
            </Typography>

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
                    <CourseCard course={c} index={i} onCopied={setStatus} />
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
                      <CourseCard course={c} index={i} onCopied={setStatus} />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            ))
          )}
        </Grid>
      </Grid>

      {/* Copy confirmations and result counts for screen readers. */}
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
        {status || (q ? `${total} course${total === 1 ? "" : "s"} found.` : "")}
      </Box>

      {!isDesktop && <Box sx={{ height: 24 }} />}
    </Box>
  );
}
