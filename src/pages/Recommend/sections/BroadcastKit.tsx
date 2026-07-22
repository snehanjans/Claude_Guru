import { useMemo, useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import PlayCircleOutlineRoundedIcon from "@mui/icons-material/PlayCircleOutlineRounded";
import QrCode2OutlinedIcon from "@mui/icons-material/QrCode2Outlined";
import LinkOutlinedIcon from "@mui/icons-material/LinkOutlined";
import CollectionsBookmarkOutlinedIcon from "@mui/icons-material/CollectionsBookmarkOutlined";
import InsightsOutlinedIcon from "@mui/icons-material/InsightsOutlined";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import { useAppDispatch } from "@/store";
import { pushToast } from "@/store/slices/toastsSlice";
import { fmtDateNice } from "@/lib/helpers";
import {
  demoAmbassadorPrograms,
  demoBroadcastCollateral,
  demoBroadcastPerf,
  referralLinkFor,
  GURU_LEARNERS_IMPACTED,
} from "@/data/demo-ambassador";

const EASE_OUT = "cubic-bezier(0.23, 1, 0.32, 1)";
const TABULAR = { fontVariantNumeric: "tabular-nums" as const };

const TACTILE = {
  transition: `transform 130ms ${EASE_OUT}`,
  "&:active": { transform: "scale(0.97)" },
};

const HOVER_LIFT = {
  transition: `transform 180ms ${EASE_OUT}, box-shadow 180ms ${EASE_OUT}`,
  "@media (hover: hover)": {
    "&:hover": { transform: "translateY(-3px)", boxShadow: "0 10px 24px -12px rgba(0,0,0,0.28)" },
  },
  "@media (prefers-reduced-motion: reduce)": {
    transition: "none",
    "&:hover": { transform: "none" },
  },
};

/** Deterministic pseudo-QR module grid (no barcode library) — visual placeholder only. */
function buildQrMatrix(seed: string, size = 9): boolean[][] {
  const matrix: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));
  let hash = 7;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      hash = (hash * 1103515245 + 12345) >>> 0;
      matrix[r][c] = (hash >>> 16) % 2 === 0;
    }
  }
  const stampFinder = (r0: number, c0: number) => {
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) matrix[r0 + r][c0 + c] = true;
  };
  stampFinder(0, 0);
  stampFinder(0, size - 3);
  stampFinder(size - 3, 0);
  return matrix;
}

function QrPlaceholder({ seed }: { seed: string }) {
  const size = 9;
  const cell = 8;
  const matrix = useMemo(() => buildQrMatrix(seed, size), [seed]);
  return (
    <Box
      sx={{
        p: 1,
        borderRadius: "10px",
        bgcolor: "#fff",
        border: "1px solid",
        borderColor: "divider",
        display: "inline-flex",
        flexShrink: 0,
      }}
    >
      <svg
        width={size * cell}
        height={size * cell}
        role="img"
        aria-label="Demo QR placeholder for your referral link"
      >
        {matrix.map((row, r) =>
          row.map(
            (on, c) =>
              on && <rect key={`${r}-${c}`} x={c * cell} y={r * cell} width={cell} height={cell} fill="#14284d" />,
          ),
        )}
      </svg>
    </Box>
  );
}

function CopyIconButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <Tooltip title={active ? "Copied" : label}>
      <IconButton size="small" aria-label={label} onClick={onClick} sx={{ ...TACTILE, color: active ? "success.main" : "text.secondary" }}>
        {active ? <CheckRoundedIcon fontSize="small" /> : <ContentCopyOutlinedIcon fontSize="small" />}
      </IconButton>
    </Tooltip>
  );
}

export function BroadcastKitSection() {
  const dispatch = useAppDispatch();
  const [programId, setProgramId] = useState(demoAmbassadorPrograms[0].id);
  const [linkCopied, setLinkCopied] = useState(false);
  const [captions, setCaptions] = useState<Record<string, string>>(() =>
    Object.fromEntries(demoBroadcastCollateral.map((a) => [a.id, a.caption])),
  );
  const [copiedAssetId, setCopiedAssetId] = useState<string | null>(null);

  const program =
    demoAmbassadorPrograms.find((p) => p.id === programId) ?? demoAmbassadorPrograms[0];
  const link = referralLinkFor(program.scholarshipCode);

  const copy = (value: string, description: string, onDone: () => void) => {
    navigator.clipboard.writeText(value);
    dispatch(pushToast({ title: "Copied", description }));
    onDone();
  };

  const copyLink = () => {
    copy(link, "Referral link copied to clipboard.", () => {
      setLinkCopied(true);
      window.setTimeout(() => setLinkCopied(false), 1600);
    });
  };

  // Fill the caption's placeholders with the picked program's details and append the link.
  const fillCaption = (caption: string) =>
    caption
      .replace(/\[program name\]/g, program.title)
      .replace(/\[start date\]/g, fmtDateNice(program.nextCohortYmd))
      .replace(/\[scholarship code\]/g, program.scholarshipCode)
      .replace(/\[percent off\]/g, String(program.scholarshipPct))
      .replace(/\[N learners mentored\]/g, GURU_LEARNERS_IMPACTED.toLocaleString("en-US")) + `\n\n${link}`;

  const copyCaption = (id: string, label: string) => {
    copy(fillCaption(captions[id] ?? ""), `${label} caption copied to clipboard.`, () => {
      setCopiedAssetId(id);
      window.setTimeout(() => setCopiedAssetId((k) => (k === id ? null : k)), 1600);
    });
  };

  const perfTiles = [
    { key: "clicks", label: "Link clicks", value: demoBroadcastPerf.clicks },
    { key: "signups", label: "Sign-ups", value: demoBroadcastPerf.signups },
    { key: "enrollments", label: "Enrollments", value: demoBroadcastPerf.enrollments },
  ];

  return (
    <Stack spacing={3} sx={{ maxWidth: 920 }}>
      {/* ── My link ─────────────────────────────────────────────────── */}
      <Card variant="outlined" sx={{ borderRadius: "16px" }}>
        <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
            <LinkOutlinedIcon sx={{ fontSize: 18, color: "text.secondary" }} />
            <Typography variant="subtitle2" fontWeight={700}>
              My link
            </Typography>
          </Stack>
          <TextField
            select
            fullWidth
            size="small"
            label="Program"
            value={programId}
            onChange={(e) => setProgramId(e.target.value)}
            sx={{ mb: 2, "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
          >
            {demoAmbassadorPrograms.map((p) => (
              <MenuItem key={p.id} value={p.id}>
                <ListItemText
                  primary={p.title}
                  secondary={`${p.scholarshipPct}% off · ${p.scholarshipCode}`}
                  primaryTypographyProps={{ fontWeight: 600, noWrap: true }}
                  secondaryTypographyProps={{ variant: "caption" }}
                />
              </MenuItem>
            ))}
          </TextField>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ xs: "flex-start", sm: "center" }}>
            <QrPlaceholder seed={link} />
            <Box sx={{ flex: 1, minWidth: 0, width: "100%" }}>
              <TextField
                fullWidth
                size="small"
                value={link}
                InputProps={{
                  readOnly: true,
                  sx: { fontFamily: "monospace", fontSize: 13.5, borderRadius: "10px" },
                  endAdornment: (
                    <InputAdornment position="end">
                      <CopyIconButton active={linkCopied} onClick={copyLink} label="Copy referral link" />
                    </InputAdornment>
                  ),
                }}
              />
              <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mt: 1 }}>
                <QrCode2OutlinedIcon sx={{ fontSize: 14, color: "text.disabled" }} />
                <Typography variant="caption" color="text.secondary">
                  Demo QR for illustration — not a scannable code.
                </Typography>
              </Stack>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* ── Collateral library ─────────────────────────────────────────── */}
      <Box>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
          <CollectionsBookmarkOutlinedIcon sx={{ fontSize: 18, color: "text.secondary" }} />
          <Typography variant="subtitle2" fontWeight={700}>
            Collateral library
          </Typography>
        </Stack>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 1.5, display: "block" }}>
          Copying fills in {program.title}&rsquo;s details and appends your link.
        </Typography>
        <Grid container spacing={2}>
          {demoBroadcastCollateral.map((asset) => (
            <Grid key={asset.id} size={{ xs: 12, sm: 6, lg: 4 }}>
              <Card
                variant="outlined"
                sx={{ borderRadius: "16px", height: "100%", display: "flex", flexDirection: "column", ...HOVER_LIFT }}
              >
                <CardContent sx={{ p: 2.25, display: "flex", flexDirection: "column", flex: 1 }}>
                  <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
                    {asset.label}
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    minRows={4}
                    size="small"
                    value={captions[asset.id]}
                    onChange={(e) => setCaptions((prev) => ({ ...prev, [asset.id]: e.target.value }))}
                    sx={{ flex: 1, "& .MuiInputBase-root": { fontSize: 13, alignItems: "flex-start" } }}
                  />
                  <Stack direction="row" justifyContent="flex-end" sx={{ mt: 1 }}>
                    <Button
                      size="small"
                      startIcon={
                        copiedAssetId === asset.id ? (
                          <CheckRoundedIcon fontSize="small" />
                        ) : (
                          <ContentCopyOutlinedIcon fontSize="small" />
                        )
                      }
                      onClick={() => copyCaption(asset.id, asset.label)}
                      color={copiedAssetId === asset.id ? "success" : "primary"}
                      sx={{ textTransform: "none", fontWeight: 600, ...TACTILE }}
                    >
                      {copiedAssetId === asset.id ? "Copied" : "Copy caption"}
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* ── Highlight clips ───────────────────────────────────────────── */}
      <Box>
        <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5 }}>
          Highlight clips
        </Typography>
        <Alert severity="warning" icon={<WarningAmberRoundedIcon fontSize="small" />} sx={{ mb: 2, borderRadius: "12px" }}>
          GL-branded programs only — university content can't be used in highlight clips.
        </Alert>
        <Grid container spacing={2}>
          {["30s cohort recap", "60s mentor intro"].map((title) => (
            <Grid key={title} size={{ xs: 12, sm: 6 }}>
              <Card variant="outlined" sx={{ borderRadius: "16px", overflow: "hidden" }}>
                <Box
                  sx={{
                    position: "relative",
                    aspectRatio: "16 / 9",
                    bgcolor: "action.hover",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <PlayCircleOutlineRoundedIcon sx={{ fontSize: 40, color: "text.disabled" }} />
                  <Chip
                    label="Coming soon"
                    size="small"
                    sx={{ position: "absolute", top: 10, right: 10, fontWeight: 600 }}
                  />
                </Box>
                <CardContent sx={{ py: 1.5 }}>
                  <Typography variant="body2" fontWeight={600}>
                    {title}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* ── Performance ───────────────────────────────────────────────── */}
      <Box>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
          <InsightsOutlinedIcon sx={{ fontSize: 18, color: "text.secondary" }} />
          <Typography variant="subtitle2" fontWeight={700}>
            Performance
          </Typography>
        </Stack>
        <Grid container spacing={2}>
          {perfTiles.map((tile) => (
            <Grid key={tile.key} size={{ xs: 12, sm: 4 }}>
              <Card variant="outlined" sx={{ borderRadius: "16px" }}>
                <CardContent sx={{ p: 2.25 }}>
                  <Typography sx={{ fontSize: 28, fontWeight: 800, lineHeight: 1.1, ...TABULAR }}>
                    {tile.value.toLocaleString("en-US")}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {tile.label}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Divider sx={{ mt: 2 }} />
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1.5, display: "block" }}>
          Clicks and sign-ups are attributed to your link; enrollments are confirmed and appear in My referrals.
        </Typography>
      </Box>
    </Stack>
  );
}
