import { useRef, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/material/styles";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import { useAppDispatch, useAppSelector } from "@/store";
import { pushToast } from "@/store/slices/toastsSlice";
import { track, ANALYTICS_EVENTS } from "@/lib/analytics";
import {
  OtherCourseRequestDialog,
  type OtherCourseSubmitResult,
} from "./OtherCourseRequestDialog";

/**
 * Sits under the program cards for gurus who want to recommend something
 * outside the four AINP programs. Deliberately lighter than a program card —
 * it's an escape hatch, not a fifth option.
 */
export function OtherCourseStrip() {
  const dispatch = useAppDispatch();
  const guruEmail = useAppSelector((s) => s.profile.guruEmail);
  const [open, setOpen] = useState(false);
  const [confirmed, setConfirmed] = useState<OtherCourseSubmitResult | null>(null);
  // The dialog restores focus here on close, but hold the ref so the confirmation
  // path (which swaps the button out) can still hand focus back deliberately.
  const ctaRef = useRef<HTMLButtonElement>(null);

  const handleSubmitted = (result: OtherCourseSubmitResult) => {
    setOpen(false);
    setConfirmed(result);
    // Only reached once the send was accepted — never optimistic.
    dispatch(
      pushToast(
        result.kind === "course"
          ? {
              title: "Email on its way",
              description: `Your referral link for ${result.courseTitle} is heading to ${result.email}.`,
            }
          : {
              title: "Request logged",
              description: `The team will follow up at ${result.email} about “${result.query}”.`,
            },
      ),
    );
  };

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
        {confirmed ? (
          <Stack direction="row" spacing={1.25} alignItems="flex-start">
            <CheckCircleRoundedIcon sx={{ fontSize: 20, color: "success.main", mt: "1px" }} />
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                {confirmed.kind === "course" ? "Email on its way" : "Request logged"}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.6 }}>
                {confirmed.kind === "course" ? (
                  <>
                    We're sending your personalised referral link for{" "}
                    <Box component="span" sx={{ fontWeight: 700, color: "text.primary" }}>
                      {confirmed.courseTitle}
                    </Box>
                    , and the terms that apply, to your registered email address (
                    {confirmed.email}).
                  </>
                ) : (
                  <>
                    We've logged your request for{" "}
                    <Box component="span" sx={{ fontWeight: 700, color: "text.primary" }}>
                      “{confirmed.query}”
                    </Box>
                    . It isn't in the catalogue yet, so the team will follow up at your
                    registered email address ({confirmed.email}) rather than sending a link
                    automatically.
                  </>
                )}
              </Typography>
              <Button
                onClick={() => setConfirmed(null)}
                sx={{ mt: 0.5, px: 0, minWidth: 0, textTransform: "none", fontWeight: 700 }}
              >
                Recommend another course
              </Button>
            </Box>
          </Stack>
        ) : (
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
                Tell us which one and we'll email you a personalised referral link, along with
                the terms for it.
              </Typography>
            </Box>
            <Button
              ref={ctaRef}
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
        )}
      </Box>

      <OtherCourseRequestDialog
        open={open}
        guruEmail={guruEmail}
        onClose={() => setOpen(false)}
        onSubmitted={handleSubmitted}
      />
    </>
  );
}
