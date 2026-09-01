import type { ReactNode } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/material/styles";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

const EASE_OUT = "cubic-bezier(0.23, 1, 0.32, 1)";
/** Clip length on the card; the full text is one click away in the editor. */
const CLIP_CHARS = 280;

export interface CollateralMessagePanelProps {
  /** Text as displayed — the guru's saved version, or the generated message. */
  message: string;
  /** Subject line, for the channels that have one (email). */
  subject?: string;
  /** The guru's referral link. */
  link: string;
  /**
   * Whether the guru has saved an edit. Once they have, the link lives inline in
   * their text, so the panel stops showing it as a separate line.
   */
  edited: boolean;
  /** Per-channel instruction, e.g. how to attach the link on Instagram. */
  info: string;
  /** LinkedIn gets the solid share CTA; the rest get a tonal "Copy text". */
  variant?: "linkedin" | "default";
  /** True while the copy confirmation is showing. */
  copied: boolean;
  onEdit: () => void;
  onCopy: () => void;
  /**
   * Optional emphasis for the actionable values (program name, code, dates)
   * inside the displayed text. Plain text when omitted.
   */
  highlight?: (text: string) => ReactNode;
}

/**
 * The "message to post" panel shared by every channel of the Social Media Kit,
 * on both the AINP program pages and the catalogue course pages — so the edit
 * affordance, the clipping and the copy behaviour can't drift between them.
 *
 * Presentational: the message, the saved edits and the copy all belong to the
 * page, which passes them in.
 */
export function CollateralMessagePanel({
  message,
  subject,
  link,
  edited,
  info,
  variant = "default",
  copied,
  onEdit,
  onCopy,
  highlight,
}: CollateralMessagePanelProps) {
  const isLinkedIn = variant === "linkedin";
  const isLong = message.length > CLIP_CHARS;
  const shown = isLong ? message.slice(0, CLIP_CHARS).replace(/\s+\S*$/, "") : message;

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        p: 2,
        borderRadius: "14px",
        border: "1px solid",
        borderColor: "divider",
        bgcolor: (t) => (t.palette.mode === "dark" ? "rgba(255,255,255,0.03)" : t.palette.grey[50]),
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={1}
        sx={{ mb: "20px" }}
      >
        <Typography
          sx={{
            fontSize: "0.7rem",
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "text.secondary",
            lineHeight: 1,
          }}
        >
          Message to post
        </Typography>
        <Button
          disableElevation
          onClick={onEdit}
          startIcon={<EditOutlinedIcon sx={{ fontSize: 17 }} />}
          sx={{
            minWidth: 0,
            py: 0.625,
            px: 1.5,
            fontSize: 14,
            fontWeight: 700,
            textTransform: "none",
            borderRadius: "8px",
            color: "primary.main",
            bgcolor: (t) => alpha(t.palette.primary.main, 0.1),
            "&:hover": { bgcolor: (t) => alpha(t.palette.primary.main, 0.16) },
          }}
        >
          Edit
        </Button>
      </Stack>

      {subject && (
        <Typography
          variant="body2"
          sx={{ mb: 1, color: "text.primary", fontWeight: 700, lineHeight: 1.45 }}
        >
          {subject}
        </Typography>
      )}

      <Typography
        variant="body2"
        sx={{ lineHeight: 1.55, whiteSpace: "pre-line", color: "text.primary" }}
      >
        {highlight ? highlight(shown) : shown}
        {isLong && (
          <>
            {"… "}
            <Box
              component="span"
              role="button"
              tabIndex={0}
              onClick={onEdit}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onEdit();
                }
              }}
              sx={{
                color: "primary.main",
                fontWeight: 700,
                cursor: "pointer",
                outline: "none",
                "&:hover, &:focus-visible": { textDecoration: "underline" },
              }}
            >
              Read more
            </Box>
          </>
        )}
      </Typography>

      {/* Before an edit the link is shown as its own non-editable line. Once
          edited it lives inline in the saved text, so showing it again here
          would duplicate it. */}
      {!edited && (
        <Typography
          variant="body2"
          sx={{ mt: 1, color: "primary.main", fontWeight: 600, wordBreak: "break-all", lineHeight: 1.45 }}
        >
          {link}
        </Typography>
      )}

      <Box sx={{ mt: "auto", pt: 2.5 }}>
        <Stack
          direction="row"
          spacing={1}
          sx={{
            p: 1.25,
            mb: 1.5,
            borderRadius: "10px",
            bgcolor: (t) => (t.palette.mode === "dark" ? "rgba(251,191,36,0.12)" : "rgba(217,119,6,0.09)"),
            border: "1px solid",
            borderColor: (t) => (t.palette.mode === "dark" ? "rgba(251,191,36,0.35)" : "rgba(217,119,6,0.28)"),
          }}
        >
          <InfoOutlinedIcon sx={{ fontSize: 18, color: "var(--gl-warning-icon)", flexShrink: 0, mt: "1px" }} />
          <Typography variant="body2" sx={{ fontSize: 13, lineHeight: 1.5, color: "text.secondary" }}>
            {info}
          </Typography>
        </Stack>
        {/* Each channel keeps the copy button it already had — LinkedIn's solid
            share CTA, a tonal "Copy text" everywhere else — and all of them
            copy the guru's edited version. */}
        <Button
          fullWidth
          disableElevation
          variant={isLinkedIn ? "contained" : "text"}
          color={copied ? "success" : "primary"}
          startIcon={
            copied ? (
              <CheckRoundedIcon sx={{ fontSize: 18 }} />
            ) : isLinkedIn ? (
              <LinkedInIcon sx={{ fontSize: 20 }} />
            ) : (
              <ContentCopyOutlinedIcon sx={{ fontSize: 18 }} />
            )
          }
          onClick={onCopy}
          sx={{
            py: 1,
            textTransform: "none",
            fontWeight: 700,
            borderRadius: "10px",
            ...(isLinkedIn
              ? {}
              : {
                  color: copied ? "success.main" : "primary.main",
                  bgcolor: (t) =>
                    copied ? alpha(t.palette.success.main, 0.1) : alpha(t.palette.primary.main, 0.1),
                  "&:hover": {
                    bgcolor: (t) =>
                      copied
                        ? alpha(t.palette.success.main, 0.16)
                        : alpha(t.palette.primary.main, 0.16),
                  },
                }),
            transition: `transform 130ms ${EASE_OUT}, background-color 130ms ${EASE_OUT}`,
            "&:active": { transform: "scale(0.99)" },
            "@media (prefers-reduced-motion: reduce)": { "&:active": { transform: "none" } },
          }}
        >
          {copied ? "Copied" : isLinkedIn ? "Copy and Share on LinkedIn" : "Copy text"}
        </Button>
      </Box>
    </Box>
  );
}
