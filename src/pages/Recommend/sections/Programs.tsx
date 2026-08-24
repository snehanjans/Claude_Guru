import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/material/styles";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import { demoAmbassadorPrograms } from "@/data/demo-ambassador";
import { EmptyState } from "@/components/shared/EmptyState";
import { OtherCoursesYouTeach } from "@/components/recommend/OtherCoursesYouTeach";
import type { AmbassadorProgram } from "@/lib/types";

const EASE_OUT = "cubic-bezier(0.23, 1, 0.32, 1)";

const clamp = (lines: number) => ({
  display: "-webkit-box",
  WebkitLineClamp: lines,
  WebkitBoxOrient: "vertical" as const,
  overflow: "hidden",
});

/* ── Program card ─────────────────────────────────────────────────────── */
function ProgramCard({ p, onOpen }: { p: AmbassadorProgram; onOpen: () => void }) {
  const isGl = p.family === "gl";
  return (
    <Card
      variant="outlined"
      sx={{
        height: "100%",
        borderRadius: "16px",
        position: "relative",
        transition: `border-color 180ms ${EASE_OUT}, box-shadow 180ms ${EASE_OUT}`,
        "@media (hover: hover)": {
          "&:hover": {
            borderColor: (t) => alpha(t.palette.primary.main, 0.55),
            boxShadow: (t) =>
              `0 0 0 1px ${alpha(t.palette.primary.main, 0.22)}, 0 8px 20px -16px rgba(16,24,40,0.22)`,
          },
        },
      }}
    >
      <CardActionArea
        onClick={onOpen}
        disableRipple
        sx={{
          height: "100%",
          alignItems: "stretch",
          borderRadius: "16px",
          // suppress the default dark hover/press fill — the card border highlights instead
          "& .MuiCardActionArea-focusHighlight": { opacity: 0 },
          // keep a visible ring for keyboard focus (a11y)
          "&.Mui-focusVisible": {
            outline: (t) => `2px solid ${alpha(t.palette.primary.main, 0.5)}`,
            outlineOffset: "-2px",
            borderRadius: "16px",
          },
          transition: `transform 130ms ${EASE_OUT}`,
          "&:active": { transform: "scale(0.97)" },
          "@media (prefers-reduced-motion: reduce)": { "&:active": { transform: "none" } },
        }}
      >
        <CardContent
          sx={{ p: 2.25, height: "100%", display: "flex", flexDirection: "column", gap: 1 }}
        >
          {/* audience */}
          <Stack direction="row" spacing={0.75} alignItems="center">
            <Chip
              label={isGl ? (p.audience ? `For ${p.audience}s` : "For other professionals") : "University"}
              size="small"
              sx={{
                height: 22,
                fontSize: "0.68rem",
                fontWeight: 700,
                borderRadius: "999px",
                ...(isGl
                  ? {
                      color: "primary.main",
                      bgcolor: (t) => alpha(t.palette.primary.main, 0.1),
                      border: (t) => `1px solid ${alpha(t.palette.primary.main, 0.28)}`,
                    }
                  : {
                      color: "var(--gl-program-default-text)",
                      bgcolor: "var(--gl-program-default-bg)",
                      border: "1px solid transparent",
                    }),
              }}
            />
          </Stack>

          <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.25, ...clamp(2) }}>
            {p.title}
          </Typography>

          {/* meta — duration only (the other bullets were identical on every card) */}
          <Typography
            variant="caption"
            sx={{ mt: 0.25, display: "block", fontWeight: 600, color: "text.secondary" }}
          >
            {p.durationLabel}
          </Typography>

          <Box sx={{ mt: 0.75 }}>
            <Typography
              variant="overline"
              sx={{ display: "block", lineHeight: 1.6, letterSpacing: "0.08em", color: "text.secondary" }}
            >
              Best for
            </Typography>
            <Typography variant="body2" sx={{ color: "text.primary", fontWeight: 400, lineHeight: 1.4 }}>
              {p.audienceLine.replace(/^best for:\s*/i, "")}
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

/* ── Section ──────────────────────────────────────────────────────────── */
export function ProgramsSection() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // brief simulated fetch → Skeleton grid matching the real layout
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 420);
    return () => clearTimeout(t);
  }, []);

  // Catalog is GL-branded AINP programs only — university programs are not promotable.
  // Role-specific programs first; the generic "other professionals" one sits last.
  const programs = useMemo(
    () =>
      demoAmbassadorPrograms
        .filter((p) => p.family === "gl")
        .sort((a, b) => (a.audience ? 0 : 1) - (b.audience ? 0 : 1)),
    [],
  );

  return (
    <Box>
      {/* grid */}
      {loading ? (
        <Grid container spacing={2}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card variant="outlined" sx={{ borderRadius: "16px" }}>
                <CardContent sx={{ p: 2.25 }}>
                  <Skeleton
                    variant="rounded"
                    width={78}
                    height={22}
                    sx={{ borderRadius: 999, mb: 1.25 }}
                  />
                  <Skeleton variant="text" width="85%" height={26} />
                  <Skeleton variant="text" width="70%" height={20} sx={{ mb: 1 }} />
                  <Skeleton variant="text" width="55%" height={16} />
                  <Skeleton variant="text" width="45%" height={16} sx={{ mb: 1.5 }} />
                  <Skeleton
                    variant="rounded"
                    width={140}
                    height={24}
                    sx={{ borderRadius: 999 }}
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : programs.length === 0 ? (
        <EmptyState
          icon={<SchoolOutlinedIcon />}
          title="No programs available yet"
          subtitle="Nothing is open for recommendation right now. New ones open regularly."
        />
      ) : (
        <Grid container spacing={2}>
          {programs.map((p) => (
            <Grid key={p.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <ProgramCard p={p} onOpen={() => navigate(`/recommend/program/${p.id}`)} />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Referral links for the other programs this guru mentors. */}
      {!loading && <OtherCoursesYouTeach />}
    </Box>
  );
}
