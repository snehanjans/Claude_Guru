import { useEffect, useMemo, useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { alpha, useTheme } from "@mui/material/styles";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import RedeemOutlinedIcon from "@mui/icons-material/RedeemOutlined";
import { useAppDispatch } from "@/store";
import { pushToast } from "@/store/slices/toastsSlice";
import { fmtDateNice, fmtUsd, fmtInr } from "@/lib/helpers";
import { demoAmbassadorPrograms } from "@/data/demo-ambassador";
import type { AmbassadorProgram } from "@/lib/types";
import { useRecommend } from "./RecommendContext";

const EASE_OUT = "cubic-bezier(0.23, 1, 0.32, 1)";
const TABULAR = { fontVariantNumeric: "tabular-nums" as const };

/** What the Guru earns on a program, for the confirm summary. */
function earningValue(p: AmbassadorProgram): string {
  return p.earningModel === "percentage"
    ? `Up to ${p.bonusPctSelfCheckout}% of the program fee`
    : `${fmtUsd(p.flatBonusUsd ?? 0)} / ${fmtInr(p.flatBonusInr ?? 0)}`;
}

const STEPS = ["Contact", "Confirm"];

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
// 7+ digits after stripping formatting characters
const isPhone = (v: string) => /^[+()\-\s.\d]+$/.test(v.trim()) && v.replace(/\D/g, "").length >= 7;

const tactile = {
  transition: `transform 130ms ${EASE_OUT}`,
  "&:active": { transform: "scale(0.97)" },
  "@media (prefers-reduced-motion: reduce)": { "&:active": { transform: "none" } },
};

export function RecommendFlowDialog() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useAppDispatch();
  const { flowOpen, flowProgramId, closeFlow, addReferral, referrals } = useRecommend();

  const [step, setStep] = useState(0);
  const [program, setProgram] = useState<AmbassadorProgram | null>(null);
  const [contact, setContact] = useState("");
  const [firstName, setFirstName] = useState("");
  const [touched, setTouched] = useState(false);

  // Sync + reset whenever the dialog opens (or the seeded program changes).
  useEffect(() => {
    if (flowOpen) {
      setStep(0);
      setContact("");
      setFirstName("");
      setTouched(false);
      setProgram(demoAmbassadorPrograms.find((p) => p.id === flowProgramId) ?? null);
    }
  }, [flowOpen, flowProgramId]);

  const contactValid = isEmail(contact) || isPhone(contact);

  // Identity we will store as the referral learner — used for duplicate detection.
  const identity = (firstName.trim() || contact.trim()).toLowerCase();
  const isDuplicate = useMemo(
    () => identity.length > 0 && referrals.some((r) => r.learner.trim().toLowerCase() === identity),
    [identity, referrals],
  );

  const contactError = touched && contact.length > 0 && !contactValid;
  const duplicateError = touched && contactValid && isDuplicate;
  const canAdvance = Boolean(program) && contactValid && !isDuplicate;

  const contactHelper = contactError
    ? "Enter a valid email address or phone number."
    : duplicateError
      ? "You have already recommended a program to this contact."
      : "We will reach out to them — you are done after this step.";

  const handleNext = () => {
    setTouched(true);
    if (canAdvance) setStep(1);
  };

  const handleSend = () => {
    if (!program || !canAdvance) return;
    addReferral({ learner: firstName.trim() || contact.trim(), programId: program.id });
    closeFlow();
    dispatch(
      pushToast({ title: "Recommendation sent", description: "Track it in My referrals." }),
    );
  };

  return (
    <Dialog
      open={flowOpen}
      onClose={closeFlow}
      fullScreen={isMobile}
      maxWidth={false}
      slotProps={{
        paper: { sx: { borderRadius: isMobile ? 0 : "18px", width: "100%", maxWidth: 480 } },
      }}
    >
      {/* header + stepper */}
      <Box sx={{ p: 2.5, pb: 1.5 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Recommend a program
          </Typography>
          <IconButton onClick={closeFlow} size="small" aria-label="Close" sx={{ mt: -0.5, mr: -0.5 }}>
            <CloseRoundedIcon fontSize="small" />
          </IconButton>
        </Stack>
        <Stepper activeStep={step} sx={{ "& .MuiStepLabel-label": { fontWeight: 600 } }}>
          {STEPS.map((s) => (
            <Step key={s}>
              <StepLabel>{s}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
      <Divider />

      <DialogContent className="themed-scrollbar" sx={{ p: 2.5 }}>
        {step === 0 ? (
          <Stack spacing={2.25}>
            <Autocomplete
              options={demoAmbassadorPrograms.filter((p) => p.family === "gl")}
              value={program}
              onChange={(_e, v) => setProgram(v)}
              getOptionLabel={(o) => o.title}
              isOptionEqualToValue={(o, v) => o.id === v.id}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Program"
                  helperText={touched && !program ? "Choose a program to recommend." : " "}
                  error={touched && !program}
                />
              )}
            />
            <TextField
              autoFocus
              label="Their email or phone"
              placeholder="name@email.com or +1 312 847 1928"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              onBlur={() => setTouched(true)}
              error={contactError || duplicateError}
              helperText={contactHelper}
              fullWidth
            />
            <TextField
              label="First name (optional)"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              fullWidth
            />
          </Stack>
        ) : (
          <Stack spacing={2}>
            <Card variant="outlined" sx={{ borderRadius: "14px" }}>
              <CardContent sx={{ p: 2 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                  Recommending
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.3, mt: 0.25 }}>
                  {program?.title}
                </Typography>
                <Divider sx={{ my: 1.5 }} />
                <Stack spacing={0.75}>
                  <Row label="To" value={firstName.trim() || contact.trim()} />
                  <Row label="Contact" value={contact.trim()} />
                  {program && (
                    <Row
                      label="Next cohort"
                      value={fmtDateNice(program.nextCohortYmd)}
                      tabular
                    />
                  )}
                  {program && <Row label="Scholarship code" value={program.scholarshipCode} tabular />}
                  {program && <Row label="You earn" value={earningValue(program)} tabular />}
                  {program && <Row label="Payout" value={program.payoutTiming} />}
                </Stack>
              </CardContent>
            </Card>

            <Stack
              direction="row"
              spacing={1.25}
              alignItems="flex-start"
              sx={{
                p: 1.5,
                borderRadius: "12px",
                bgcolor: (t) => alpha(t.palette.primary.main, 0.07),
                border: (t) => `1px solid ${alpha(t.palette.primary.main, 0.18)}`,
              }}
            >
              <RedeemOutlinedIcon sx={{ fontSize: 20, color: "primary.main", mt: 0.25 }} />
              <Typography variant="body2" sx={{ lineHeight: 1.5 }}>
                They will receive your scholarship:{" "}
                <Box component="span" sx={{ fontWeight: 700 }}>
                  {program?.scholarshipPct}% off {program?.title}
                </Box>
                {" "}with code{" "}
                <Box component="span" sx={{ fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
                  {program?.scholarshipCode}
                </Box>
                .
              </Typography>
            </Stack>
          </Stack>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          position: "sticky",
          bottom: 0,
          px: 2.5,
          py: 1.75,
          gap: 1,
          bgcolor: "background.paper",
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        {step === 1 && (
          <Button
            onClick={() => setStep(0)}
            sx={{ textTransform: "none", fontWeight: 600, mr: "auto", ...tactile }}
          >
            Back
          </Button>
        )}
        {step === 0 ? (
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={!canAdvance}
            sx={{ textTransform: "none", fontWeight: 700, borderRadius: "10px", ...tactile }}
          >
            Next
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={handleSend}
            sx={{ textTransform: "none", fontWeight: 700, borderRadius: "10px", ...tactile }}
          >
            Send recommendation
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

function Row({ label, value, tabular }: { label: string; value: string; tabular?: boolean }) {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="baseline" spacing={2}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography
        variant="body2"
        sx={{ fontWeight: 600, textAlign: "right", minWidth: 0, ...(tabular ? TABULAR : {}) }}
      >
        {value}
      </Typography>
    </Stack>
  );
}
