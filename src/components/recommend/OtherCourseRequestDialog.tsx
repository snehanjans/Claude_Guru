import { useEffect, useMemo, useRef, useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/material/styles";
import { keyframes } from "@mui/system";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import MarkEmailReadRoundedIcon from "@mui/icons-material/MarkEmailReadRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import {
  MIN_QUERY_LENGTH,
  SEARCH_DEBOUNCE_MS,
  ReferralRequestError,
  searchReferableCourses,
  submitReferralRequest,
} from "@/lib/referralRequest";
import type { ReferableCourse } from "@/data/demo-referable-courses";
import { track, ANALYTICS_EVENTS } from "@/lib/analytics";

const STEP_IN = keyframes`
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: none; }
`;

/** What was sent — drives the wording of the confirmation step. */
interface SentRequest {
  kind: "course" | "unmatched";
  courseTitle?: string;
  query?: string;
  email: string;
}

export interface OtherCourseRequestDialogProps {
  open: boolean;
  guruEmail: string;
  onClose: () => void;
}

export function OtherCourseRequestDialog({
  open,
  guruEmail,
  onClose,
}: OtherCourseRequestDialogProps) {
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [results, setResults] = useState<ReferableCourse[]>([]);
  const [searching, setSearching] = useState(false);
  const [selected, setSelected] = useState<ReferableCourse | null>(null);
  const [listOpen, setListOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  /**
   * Both steps live in the same Dialog instance — the dialog never closes
   * between them, so there's no second modal and no flash of the page behind.
   */
  const [sent, setSent] = useState<SentRequest | null>(null);

  const searchAbortRef = useRef<AbortController | null>(null);
  const submitAbortRef = useRef<AbortController | null>(null);

  // Reset on open; tear down any in-flight work on close.
  useEffect(() => {
    if (open) {
      setQuery("");
      setDebounced("");
      setResults([]);
      setSearching(false);
      setSelected(null);
      setListOpen(false);
      setSubmitting(false);
      setError(null);
      setSent(null);
      return;
    }
    searchAbortRef.current?.abort();
    submitAbortRef.current?.abort();
    searchAbortRef.current = null;
    submitAbortRef.current = null;
  }, [open]);

  useEffect(
    () => () => {
      searchAbortRef.current?.abort();
      submitAbortRef.current?.abort();
    },
    [],
  );

  // Debounce the input so we don't search on every keystroke.
  useEffect(() => {
    const t = window.setTimeout(() => setDebounced(query), SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(t);
  }, [query]);

  // Fetch for the settled query. Below the minimum length we search nothing and
  // keep the dropdown closed.
  useEffect(() => {
    const q = debounced.trim();
    searchAbortRef.current?.abort();

    if (q.length < MIN_QUERY_LENGTH || selected) {
      searchAbortRef.current = null;
      setResults([]);
      setSearching(false);
      return;
    }

    const controller = new AbortController();
    searchAbortRef.current = controller;
    setSearching(true);
    searchReferableCourses(q, controller.signal)
      .then((found) => {
        if (controller.signal.aborted) return;
        setResults(found);
        setSearching(false);
        setListOpen(true);
      })
      .catch(() => {
        if (controller.signal.aborted) return;
        // A failed lookup shouldn't strand the guru — fall through to the
        // no-match path so they can still submit what they typed.
        setResults([]);
        setSearching(false);
      });

    return () => controller.abort();
  }, [debounced, selected]);

  const longEnough = debounced.trim().length >= MIN_QUERY_LENGTH;
  const noMatch = longEnough && !searching && results.length === 0 && !selected;
  const canSubmit = Boolean(selected || (noMatch && debounced.trim())) && !submitting;

  /** Announced to screen readers, and mirrored visually in the empty state. */
  const statusMessage = useMemo(() => {
    if (selected) return `${selected.title} selected.`;
    if (!longEnough) return "";
    if (searching) return "Searching courses…";
    if (results.length === 0) return "No matching courses found.";
    return `${results.length} course${results.length === 1 ? "" : "s"} found.`;
  }, [selected, longEnough, searching, results.length]);

  const handleSubmit = async () => {
    // Guard as well as disable — a double-click can land two events before the
    // disabled prop repaints.
    if (submitting || !canSubmit) return;

    const kind: "course" | "unmatched" = selected ? "course" : "unmatched";
    const controller = new AbortController();
    submitAbortRef.current = controller;
    setSubmitting(true);
    setError(null);

    try {
      const { email } = await submitReferralRequest({
        kind,
        courseId: selected?.id,
        courseTitle: selected?.title,
        query: selected ? undefined : debounced.trim(),
        guruEmail,
        signal: controller.signal,
      });
      if (controller.signal.aborted) return;
      track(ANALYTICS_EVENTS.OTHER_COURSE_SUBMITTED, {
        kind,
        courseId: selected?.id,
        courseTitle: selected?.title,
        // The unmatched text is the point of the event — it tells us what to add.
        query: selected ? undefined : debounced.trim(),
      });
      // Only now — the email is actually queued.
      setSent({
        kind,
        courseTitle: selected?.title,
        query: selected ? undefined : debounced.trim(),
        email,
      });
    } catch (err) {
      if (controller.signal.aborted) return;
      // Stay open with the selection intact so Retry is one click.
      setError("Couldn't send that request. Please try again.");
      track(ANALYTICS_EVENTS.OTHER_COURSE_FAILED, {
        kind,
        courseId: selected?.id,
        query: selected ? undefined : debounced.trim(),
        reason: err instanceof ReferralRequestError ? err.message : "unexpected",
      });
    } finally {
      if (!controller.signal.aborted) setSubmitting(false);
      if (submitAbortRef.current === controller) submitAbortRef.current = null;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={submitting ? undefined : onClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="other-course-title"
      // Near-full-width on phones, and never taller than the viewport so the
      // dropdown has somewhere to go when the keyboard is up.
      PaperProps={{ sx: { m: { xs: 1.5, sm: 4 }, width: { xs: "calc(100% - 24px)", sm: "100%" } } }}
    >
      {sent ? (
        /* ── Step 2: confirmation ─────────────────────────────────────── */
        <Box
          sx={{
            animation: `${STEP_IN} 200ms ease-out`,
            "@media (prefers-reduced-motion: reduce)": { animation: "none" },
          }}
        >
          <DialogContent sx={{ textAlign: "center", pt: 4, pb: 2 }}>
            <Box
              sx={{
                width: 60,
                height: 60,
                mx: "auto",
                mb: 2,
                borderRadius: "50%",
                display: "grid",
                placeItems: "center",
                bgcolor: (t) => alpha(t.palette.success.main, 0.12),
              }}
            >
              <MarkEmailReadRoundedIcon sx={{ fontSize: 32, color: "success.main" }} />
            </Box>

            {/* Carries the dialog's accessible name on this step. */}
            <Typography
              id="other-course-title"
              variant="h6"
              component="h2"
              sx={{ fontWeight: 700, mb: 1 }}
            >
              {sent.kind === "course" ? "Your referral link is on its way" : "Request received"}
            </Typography>

            {sent.kind === "course" ? (
              <>
                <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.65 }}>
                  We've emailed your personalised referral link for{" "}
                  <Box component="span" sx={{ fontWeight: 700, color: "text.primary" }}>
                    {sent.courseTitle}
                  </Box>{" "}
                  to{" "}
                  <Box component="span" sx={{ fontWeight: 700, color: "text.primary" }}>
                    {sent.email}
                  </Box>
                  .
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ mt: 1.25, color: "text.secondary", lineHeight: 1.65 }}
                >
                  The email also includes the terms that apply to this course.
                </Typography>
              </>
            ) : (
              <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.65 }}>
                We've logged your request for{" "}
                <Box component="span" sx={{ fontWeight: 700, color: "text.primary" }}>
                  “{sent.query}”
                </Box>
                . It isn't in our catalogue yet, so the team will follow up with you at{" "}
                <Box component="span" sx={{ fontWeight: 700, color: "text.primary" }}>
                  {sent.email}
                </Box>{" "}
                — there's no automatic link for this one.
              </Typography>
            )}
          </DialogContent>

          <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
            <Button
              autoFocus
              variant="contained"
              disableElevation
              onClick={onClose}
              sx={{ textTransform: "none", fontWeight: 700, borderRadius: "10px", minWidth: 120 }}
            >
              Done
            </Button>
          </DialogActions>
        </Box>
      ) : (
        /* ── Step 1: search ───────────────────────────────────────────── */
        <>
        <DialogTitle id="other-course-title">Recommend another course</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: "text.secondary", mb: 2, lineHeight: 1.6 }}>
            Pick the course you'd like to recommend. We'll email you a personalised referral
            link for it, along with the terms that apply.
          </Typography>

          <Autocomplete
            // Filtering happens in the service, so keep the options as-given.
            filterOptions={(x) => x}
            options={results}
            value={selected}
            onChange={(_e, next) => {
              setSelected(next);
              setError(null);
              if (next) setListOpen(false);
            }}
            inputValue={query}
            onInputChange={(_e, next, reason) => {
              if (reason === "reset") return; // selection echo, not typing
              setQuery(next);
              if (selected) setSelected(null);
            }}
            open={listOpen && longEnough && !selected}
            onOpen={() => setListOpen(true)}
            onClose={() => setListOpen(false)}
            loading={searching}
            getOptionLabel={(o) => o.title}
            isOptionEqualToValue={(a, b) => a.id === b.id}
            noOptionsText={
              searching ? "Searching…" : "No matching courses — you can still send this as a request."
            }
            disabled={submitting}
            slotProps={{ listbox: { sx: { maxHeight: { xs: 200, sm: 280 } } } }}
            renderOption={(props, option) => (
              <Box component="li" {...props} key={option.id}>
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.35 }}>
                    {option.title}
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
                    {option.category} · {option.durationLabel}
                  </Typography>
                </Box>
              </Box>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                autoFocus
                label="Which course?"
                placeholder="Start typing a course name"
                helperText={`Type at least ${MIN_QUERY_LENGTH} characters to search.`}
                slotProps={{
                  input: {
                    ...params.InputProps,
                    startAdornment: (
                      <>
                        <SearchRoundedIcon sx={{ fontSize: 19, color: "text.disabled", ml: 0.5, mr: 0.5 }} />
                        {params.InputProps.startAdornment}
                      </>
                    ),
                    endAdornment: (
                      <>
                        {searching ? <CircularProgress size={16} sx={{ mr: 1 }} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  },
                }}
              />
            )}
          />

          {/* Chosen course, stated plainly, with a way back to searching. */}
          {selected && (
            <Stack
              direction="row"
              alignItems="flex-start"
              spacing={1}
              sx={{
                mt: 2,
                p: 1.5,
                borderRadius: "10px",
                border: "1px solid",
                borderColor: (t) => alpha(t.palette.success.main, 0.35),
                bgcolor: (t) => alpha(t.palette.success.main, 0.08),
              }}
            >
              <CheckCircleRoundedIcon sx={{ fontSize: 18, color: "success.main", mt: "1px" }} />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1.4 }}>
                  {selected.title}
                </Typography>
                <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
                  {selected.category} · {selected.durationLabel}
                </Typography>
              </Box>
              {/* Named "Change" rather than "Clear" so it doesn't collide with the
                  field's own clear icon, which already exposes that label. */}
              <Button
                size="small"
                disabled={submitting}
                onClick={() => {
                  setSelected(null);
                  setQuery("");
                  setDebounced("");
                }}
                sx={{ textTransform: "none", fontWeight: 600, flexShrink: 0 }}
              >
                Change
              </Button>
            </Stack>
          )}

          {/* Nothing matched — offer the raw text as a request instead. */}
          {noMatch && (
            <Stack
              direction="row"
              spacing={1}
              sx={{
                mt: 2,
                p: 1.5,
                borderRadius: "10px",
                bgcolor: (t) =>
                  t.palette.mode === "dark" ? "rgba(251,191,36,0.12)" : "rgba(217,119,6,0.09)",
                border: "1px solid",
                borderColor: (t) =>
                  t.palette.mode === "dark" ? "rgba(251,191,36,0.35)" : "rgba(217,119,6,0.28)",
              }}
            >
              <InfoOutlinedIcon sx={{ fontSize: 18, color: "var(--gl-warning-icon)", flexShrink: 0, mt: "1px" }} />
              <Typography variant="body2" sx={{ fontSize: 13, lineHeight: 1.5, color: "text.secondary" }}>
                We don't have a course matching “{debounced.trim()}” yet. Send it anyway and the
                team will look into it and get back to you — you won't get an automatic link for
                this one.
              </Typography>
            </Stack>
          )}

          {error && (
            <Typography
              variant="body2"
              sx={{ mt: 2, fontSize: 13, fontWeight: 600, color: "error.main" }}
            >
              {error}
            </Typography>
          )}

          {/* Result counts and status for screen readers. Sizes carry units — in
              sx a unitless 0–1 number is a fraction, not pixels. */}
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
            {statusMessage}
          </Box>
        </DialogContent>

        <DialogActions>
          <Button
            color="inherit"
            onClick={onClose}
            disabled={submitting}
            sx={{ textTransform: "none", fontWeight: 600 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            disableElevation
            onClick={handleSubmit}
            disabled={!canSubmit}
            startIcon={submitting ? <CircularProgress size={15} color="inherit" /> : undefined}
            sx={{ textTransform: "none", fontWeight: 700, borderRadius: "10px" }}
          >
            {submitting ? "Sending…" : error ? "Retry" : "Send"}
          </Button>
        </DialogActions>
      </>
      )}
    </Dialog>
  );
}
