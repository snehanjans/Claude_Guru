import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/material/styles";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import type { ReferableCourse } from "@/data/demo-referable-courses";
import { track, ANALYTICS_EVENTS } from "@/lib/analytics";

const EASE_OUT = "cubic-bezier(0.23, 1, 0.32, 1)";

/** Carousel card width per breakpoint; on mobile the next card peeks in. */
export const CAROUSEL_CARD_W = { xs: 236, sm: 268, md: 288 };

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

/**
 * Landscape banner: the program's own marketing image, with the institution
 * badge over it. Falls back to a brand gradient + pattern wash if the remote
 * image fails, so a dead CDN URL degrades instead of leaving a blank card.
 */
function InstitutionBanner({ course, index }: { course: ReferableCourse; index: number }) {
  const [imgFailed, setImgFailed] = useState(false);
  const pattern = `/course-patterns/p${(index % 6) + 1}.svg`;
  const showImage = Boolean(course.image) && !imgFailed;
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
        src={showImage ? course.image : pattern}
        onError={() => setImgFailed(true)}
        alt=""
        aria-hidden="true"
        sx={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: showImage ? 1 : 0.28,
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
          sx={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.03em", color: "#111" }}
        >
          {course.providerShort ?? institutionInitials(course.provider ?? course.title)}
        </Typography>
      </Stack>
    </Box>
  );
}

/* ── One course card ──────────────────────────────────────────────────────── */
/**
 * Course card shared by the "Other courses you teach" carousel and the full
 * catalogue page, so the two can't drift apart. `width` lets the carousel pin a
 * fixed card size while the catalogue lets its grid decide.
 */
export function CourseCard({
  course,
  index,
  width,
}: {
  course: ReferableCourse;
  index: number;
  /** Fixed width for carousel use; omit to fill the grid cell. */
  width?: Record<string, number> | number;
}) {
  const navigate = useNavigate();
  const location = useLocation();

  /*
   * The card hands off to the course's own page rather than copying straight to
   * the clipboard: that page is where the referral link, the terms and the
   * earning are shown, so the guru sees what they're sharing before they share
   * it. `from` is carried along so the page's back link returns where they came
   * from — the carousel and the catalogue both render this card.
   */
  const openCourse = () => {
    track(ANALYTICS_EVENTS.COURSE_OPENED, {
      courseId: course.slug,
      course: course.title,
      from: location.pathname,
    });
    navigate(`/recommend/course/${course.slug}`, { state: { from: location.pathname } });
  };

  return (
    <Card
      variant="outlined"
      sx={{
        // Matches the program cards above.
        borderRadius: "16px",
        overflow: "hidden",
        flex: "0 0 auto",
        width: width ?? "100%",
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
      <InstitutionBanner course={course} index={index} />
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
          {course.providerShort ?? course.provider}
        </Typography>
        <Typography
          variant="subtitle2"
          sx={{ mt: 0.5, fontWeight: 700, lineHeight: 1.35, minHeight: "2.7em", ...clamp(2) }}
        >
          {course.title}
        </Typography>
        <Typography sx={{ mt: 0.75, fontSize: 12.5, color: "text.secondary" }}>
          {[course.durationLabel, course.mode].filter(Boolean).join(" · ")}
        </Typography>

        <Box sx={{ mt: "auto", pt: 1.25 }}>
          <Button
            fullWidth
            onClick={openCourse}
            endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: 16 }} />}
            // Names the course, so a screen reader hears which card this is.
            aria-label={`Get referral link for ${course.title}`}
            sx={{
              textTransform: "none",
              fontWeight: 700,
              fontSize: 13,
              color: "primary.main",
              "&:hover": { bgcolor: "action.hover" },
              "&.Mui-focusVisible": {
                outline: (t) => `2px solid ${t.palette.primary.main}`,
                outlineOffset: 2,
              },
            }}
          >
            Get referral link
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

