import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/material/styles";
import { useAppSelector } from "@/store";
import { track, ANALYTICS_EVENTS } from "@/lib/analytics";
import { OtherCourseRequestDialog } from "./OtherCourseRequestDialog";

/**
 * Sits under the program cards for gurus who want to recommend something
 * outside the four AINP programs. Deliberately lighter than a program card —
 * it's an escape hatch, not a fifth option.
 *
 * Confirmation is the dialog's own second step, so there's nothing to report
 * back here.
 */
export function OtherCourseStrip() {
  const guruEmail = useAppSelector((s) => s.profile.guruEmail);
  const [open, setOpen] = useState(false);

  return (
    <>
      <Box
        sx={{
          mt: 2.5,
          p: { xs: 2, sm: 2.25 },
          borderRadius: "16px",
          border: "1px dashed",
          borderColor: "divider",
          // Lighter than the outlined program cards above it.
          bgcolor: (t) =>
            t.palette.mode === "dark" ? "rgba(255,255,255,0.02)" : alpha(t.palette.grey[500], 0.05),
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={{ xs: 1.5, sm: 2 }}
          alignItems={{ xs: "flex-start", sm: "center" }}
          justifyContent="space-between"
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              Want to recommend another course?
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.55 }}>
              Tell us which one and we'll email you a personalised referral link, along with the
              terms for it.
            </Typography>
          </Box>
          <Button
            variant="outlined"
            onClick={() => {
              track(ANALYTICS_EVENTS.OTHER_COURSE_OPENED);
              setOpen(true);
            }}
            sx={{
              flexShrink: 0,
              textTransform: "none",
              fontWeight: 700,
              borderRadius: "10px",
              width: { xs: "100%", sm: "auto" },
            }}
          >
            Get in touch
          </Button>
        </Stack>
      </Box>

      <OtherCourseRequestDialog
        open={open}
        guruEmail={guruEmail}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
