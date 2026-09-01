import { useState, type ReactNode } from "react";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/material/styles";
import type { SxProps, Theme } from "@mui/material/styles";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import DoneAllRoundedIcon from "@mui/icons-material/DoneAllRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import LinkOutlinedIcon from "@mui/icons-material/LinkOutlined";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";
import RepeatRoundedIcon from "@mui/icons-material/RepeatRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbUpRoundedIcon from "@mui/icons-material/ThumbUpRounded";
import VerifiedIcon from "@mui/icons-material/Verified";
import type { SvgIconComponent } from "@mui/icons-material";

/**
 * How each channel's post will look, shared by the AINP program pages and the
 * catalogue course pages.
 *
 * Display only — every preview renders the message the guru would copy, so
 * editing it updates what they see here. The pages own the message, the link and
 * the emphasis; these only draw the platform.
 */

/** Where the referral links point, shown as the source in link previews. */
const DOMAIN = "mygreatlearning.com";

/** Line clamp for preview text so a long message can't break a card. */
const clampLines = (lines: number) => ({
  display: "-webkit-box",
  WebkitLineClamp: lines,
  WebkitBoxOrient: "vertical" as const,
  overflow: "hidden",
});

interface PreviewBase {
  /** Message as displayed, edits included. */
  message: string;
  /** Optional emphasis for the actionable values inside the message. */
  highlight?: (text: string) => ReactNode;
}

const emphasise = (message: string, highlight?: (t: string) => ReactNode) =>
  highlight ? highlight(message) : message;

/* Share image thumbnail — the program's og:image, or a branded gradient if it's
   absent or fails to load, so a dead URL degrades instead of leaving a hole. */
export function OgThumb({
  src,
  label,
  sx,
}: {
  src?: string;
  label: string;
  sx?: SxProps<Theme>;
}) {
  const [err, setErr] = useState(false);
  const showImg = Boolean(src) && !err;
  return (
    <Box sx={{ overflow: "hidden", ...sx }}>
      {showImg ? (
        <Box
          component="img"
          src={src}
          alt=""
          onError={() => setErr(true)}
          sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      ) : (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "grid",
            placeItems: "center",
            textAlign: "center",
            px: 1,
            background: (t) =>
              `linear-gradient(135deg, ${t.palette.primary.main}, ${alpha(t.palette.primary.main, 0.6)})`,
          }}
        >
          <Typography sx={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.1em", color: "#fff", lineHeight: 1.3 }}>
            {label}
          </Typography>
        </Box>
      )}
    </Box>
  );
}

/* ── LinkedIn ─────────────────────────────────────────────────────────────── */

export function LinkedInPostPreview({
  message,
  title,
  ogImage,
  ogLabel = "GREAT LEARNING",
  highlight,
}: PreviewBase & { title: string; ogImage?: string; ogLabel?: string }) {
  /* LinkedIn's real feed truncates around ~200 characters; the clamp below
     approximates that at three lines so the card's height never grows with a
     longer message. */
  const isLong = message.length > 200;
  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: "10px",
        overflow: "hidden",
        bgcolor: "background.paper",
      }}
    >
      {/* author */}
      <Stack direction="row" alignItems="flex-start" spacing={1.25} sx={{ p: 1.5, pb: 1 }}>
        <Avatar
          sx={{
            width: 44,
            height: 44,
            bgcolor: (t) => alpha(t.palette.primary.main, 0.15),
            color: "primary.main",
          }}
        >
          <PersonRoundedIcon />
        </Avatar>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Typography sx={{ fontSize: 14, fontWeight: 700, lineHeight: 1.25 }}>You</Typography>
            <VerifiedIcon sx={{ fontSize: 15, color: "text.secondary" }} />
            <Typography sx={{ fontSize: 13, color: "text.secondary" }}>· 1st</Typography>
          </Stack>
          <Typography noWrap sx={{ fontSize: 12, color: "text.secondary", lineHeight: 1.3 }}>
            AI Mentor · Great Learning
          </Typography>
          <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 0.25 }}>
            <Typography sx={{ fontSize: 12, color: "text.secondary" }}>1w</Typography>
            <Typography sx={{ fontSize: 12, color: "text.secondary" }}>·</Typography>
            <PublicRoundedIcon sx={{ fontSize: 13, color: "text.secondary" }} />
          </Stack>
        </Box>
        <MoreHorizRoundedIcon sx={{ color: "text.secondary" }} />
      </Stack>

      {/* post text — the "…more" row is always reserved, so short and long
          messages render at the same height. */}
      <Box sx={{ px: 1.5, pb: 1.5 }}>
        <Typography
          variant="body2"
          sx={{
            lineHeight: 1.5,
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {emphasise(message, highlight)}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            lineHeight: 1.5,
            color: "text.secondary",
            fontWeight: 500,
            visibility: isLong ? "visible" : "hidden",
          }}
        >
          …more
        </Typography>
      </Box>

      {/* link-preview card — thumbnail + title + domain */}
      <Divider />
      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ p: 1.5 }}>
        <OgThumb
          src={ogImage}
          label={ogLabel}
          sx={{ width: 112, height: 90, flexShrink: 0, borderRadius: "8px", boxShadow: 2 }}
        />
        <Box sx={{ minWidth: 0 }}>
          <Typography
            sx={{
              fontSize: 15,
              fontWeight: 700,
              lineHeight: 1.3,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {title}
          </Typography>
          <Typography sx={{ mt: 0.5, fontSize: 13, color: "text.secondary" }}>{DOMAIN}</Typography>
        </Box>
      </Stack>

      {/* reactions summary */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ px: 1.5, py: 1, borderTop: "1px solid", borderColor: "divider" }}
      >
        <Stack direction="row" alignItems="center" spacing={0.75}>
          <Stack direction="row">
            <Box
              sx={{
                width: 18,
                height: 18,
                borderRadius: "50%",
                bgcolor: "#2f6bff",
                display: "grid",
                placeItems: "center",
                border: "1.5px solid",
                borderColor: "background.paper",
              }}
            >
              <ThumbUpRoundedIcon sx={{ fontSize: 10, color: "#fff" }} />
            </Box>
            <Box
              sx={{
                width: 18,
                height: 18,
                ml: "-5px",
                borderRadius: "50%",
                bgcolor: "#f5455f",
                display: "grid",
                placeItems: "center",
                border: "1.5px solid",
                borderColor: "background.paper",
              }}
            >
              <FavoriteRoundedIcon sx={{ fontSize: 10, color: "#fff" }} />
            </Box>
          </Stack>
          <Typography sx={{ fontSize: 12, color: "text.secondary" }}>You and 47 others</Typography>
        </Stack>
        <Typography sx={{ fontSize: 12, color: "text.secondary" }}>12 comments</Typography>
      </Stack>

      {/* action bar */}
      <Stack direction="row" sx={{ borderTop: "1px solid", borderColor: "divider" }}>
        {(
          [
            { icon: ThumbUpOffAltIcon, label: "Like" },
            { icon: ChatBubbleOutlineRoundedIcon, label: "Comment" },
            { icon: RepeatRoundedIcon, label: "Repost" },
            { icon: SendRoundedIcon, label: "Send" },
          ] as { icon: SvgIconComponent; label: string }[]
        ).map((a) => (
          <Stack
            key={a.label}
            direction="row"
            alignItems="center"
            justifyContent="center"
            spacing={0.75}
            sx={{ flex: 1, py: 1, color: "text.secondary" }}
          >
            <a.icon sx={{ fontSize: 18 }} />
            <Typography sx={{ fontSize: 12.5, fontWeight: 600, display: { xs: "none", sm: "block" } }}>
              {a.label}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
}

/* ── WhatsApp ─────────────────────────────────────────────────────────────── */

export function WhatsAppPreview({
  message,
  title,
  ogImage,
  ogLabel = "GL",
  highlight,
}: PreviewBase & { title: string; ogImage?: string; ogLabel?: string }) {
  return (
    <Box sx={{ borderRadius: "10px", overflow: "hidden", border: "1px solid", borderColor: "divider" }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ px: 1.25, py: 1, bgcolor: "#075e54", color: "#fff" }}>
        <Avatar sx={{ width: 32, height: 32, bgcolor: "rgba(255,255,255,0.2)", color: "#fff" }}>
          <PersonRoundedIcon sx={{ fontSize: 18 }} />
        </Avatar>
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontSize: 13, fontWeight: 700, lineHeight: 1.2 }}>Broadcast</Typography>
          <Typography sx={{ fontSize: 11, opacity: 0.8 }}>Broadcast list · 128 recipients</Typography>
        </Box>
      </Stack>
      <Box
        sx={{
          p: 1.5,
          minHeight: 220,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          bgcolor: (t) => (t.palette.mode === "dark" ? "#0b141a" : "#efeae2"),
        }}
      >
        <Box
          sx={{
            alignSelf: "flex-end",
            maxWidth: "92%",
            p: 1,
            borderRadius: "8px",
            borderTopRightRadius: 0,
            boxShadow: 1,
            bgcolor: (t) => (t.palette.mode === "dark" ? "#005c4b" : "#d9fdd3"),
            color: (t) => (t.palette.mode === "dark" ? "#e9edef" : "#111b21"),
          }}
        >
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ mb: 0.75, p: 0.75, borderRadius: "6px", bgcolor: "rgba(0,0,0,0.06)" }}
          >
            <OgThumb src={ogImage} label={ogLabel} sx={{ width: 40, height: 40, flexShrink: 0, borderRadius: "4px" }} />
            <Box sx={{ minWidth: 0 }}>
              <Typography
                sx={{
                  fontSize: 11,
                  fontWeight: 700,
                  lineHeight: 1.25,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {title}
              </Typography>
              <Typography sx={{ fontSize: 10, opacity: 0.7 }}>{DOMAIN}</Typography>
            </Box>
          </Stack>
          <Typography sx={{ fontSize: 13, lineHeight: 1.45, ...clampLines(8) }}>
            {emphasise(message, highlight)}
          </Typography>
          <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={0.5} sx={{ mt: 0.25 }}>
            <Typography sx={{ fontSize: 10, opacity: 0.6 }}>12:24 PM</Typography>
            <DoneAllRoundedIcon sx={{ fontSize: 15, color: "#53bdeb" }} />
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}

/* ── Email ────────────────────────────────────────────────────────────────── */

export function EmailPreview({
  message,
  subject,
  link,
  showLink,
  highlight,
}: PreviewBase & {
  subject: string;
  link: string;
  /** False once the guru's saved text carries the link inline. */
  showLink: boolean;
}) {
  return (
    <Box
      sx={{
        borderRadius: "10px",
        overflow: "hidden",
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
      }}
    >
      <Box sx={{ p: 1.5, borderBottom: "1px solid", borderColor: "divider" }}>
        <Typography sx={{ fontSize: 15, fontWeight: 700, lineHeight: 1.3 }}>{subject}</Typography>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1 }}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: (t) => alpha(t.palette.primary.main, 0.15), color: "primary.main" }}>
            <PersonRoundedIcon sx={{ fontSize: 18 }} />
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontSize: 13, fontWeight: 600, lineHeight: 1.2 }}>
              You{" "}
              <Box component="span" sx={{ color: "text.secondary", fontWeight: 400 }}>
                &lt;you@greatlearning.in&gt;
              </Box>
            </Typography>
            <Typography sx={{ fontSize: 12, color: "text.secondary" }}>to [first name]</Typography>
          </Box>
          <Typography sx={{ fontSize: 12, color: "text.secondary" }}>9:41 AM</Typography>
        </Stack>
      </Box>
      <Box sx={{ p: 1.5 }}>
        <Typography variant="body2" sx={{ lineHeight: 1.55, whiteSpace: "pre-line", ...clampLines(9) }}>
          {emphasise(message, highlight)}
        </Typography>
        {showLink && (
          <Typography variant="body2" sx={{ mt: 1, color: "primary.main", fontWeight: 600, wordBreak: "break-all" }}>
            {link}
          </Typography>
        )}
      </Box>
    </Box>
  );
}

/* ── Instagram ────────────────────────────────────────────────────────────── */

export function InstagramPreview({ message, highlight }: PreviewBase) {
  return (
    <Box
      sx={{
        mx: "auto",
        width: "100%",
        maxWidth: 250,
        aspectRatio: "9 / 16",
        borderRadius: "16px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        p: 1.5,
        color: "#fff",
        background: (t) => `linear-gradient(160deg, ${t.palette.primary.main}, #7c3aed 65%, #db2777)`,
      }}
    >
      <Stack direction="row" spacing={0.5} sx={{ mb: 1 }}>
        <Box sx={{ flex: 1, height: 2.5, borderRadius: 2, bgcolor: "rgba(255,255,255,0.85)" }} />
        <Box sx={{ flex: 1, height: 2.5, borderRadius: 2, bgcolor: "rgba(255,255,255,0.35)" }} />
      </Stack>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Avatar sx={{ width: 26, height: 26, border: "2px solid #fff", bgcolor: "rgba(255,255,255,0.25)", color: "#fff" }}>
          <PersonRoundedIcon sx={{ fontSize: 15 }} />
        </Avatar>
        <Typography sx={{ fontSize: 12, fontWeight: 700 }}>your_handle</Typography>
        <Typography sx={{ fontSize: 11, opacity: 0.85 }}>5h</Typography>
        <MoreHorizRoundedIcon sx={{ fontSize: 18, ml: "auto" }} />
      </Stack>
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", py: 2 }}>
        <Typography
          sx={{ fontSize: 15, fontWeight: 700, lineHeight: 1.4, textShadow: "0 1px 8px rgba(0,0,0,0.35)", ...clampLines(9) }}
        >
          {emphasise(message, highlight)}
        </Typography>
      </Box>
      <Box
        sx={{
          alignSelf: "center",
          mb: 1.25,
          px: 1.25,
          py: 0.5,
          borderRadius: "999px",
          bgcolor: "#fff",
          color: "#111",
          display: "flex",
          alignItems: "center",
          gap: 0.5,
        }}
      >
        <LinkOutlinedIcon sx={{ fontSize: 14 }} />
        <Typography sx={{ fontSize: 11, fontWeight: 700 }}>{DOMAIN}</Typography>
      </Box>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Box sx={{ flex: 1, border: "1px solid rgba(255,255,255,0.6)", borderRadius: "999px", px: 1.25, py: 0.5 }}>
          <Typography sx={{ fontSize: 11, opacity: 0.9 }}>Send message</Typography>
        </Box>
        <FavoriteBorderRoundedIcon sx={{ fontSize: 20 }} />
        <SendRoundedIcon sx={{ fontSize: 20 }} />
      </Stack>
    </Box>
  );
}

/* ── Wrapper ──────────────────────────────────────────────────────────────── */

/** Brand-tinted panel the preview sits in, with its "Preview · <channel>" label. */
export function PreviewPane({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Box
      sx={{
        p: { xs: 1.5, sm: 2 },
        borderRadius: "14px",
        border: "1px solid",
        borderColor: (t) => alpha(t.palette.primary.main, 0.2),
        bgcolor: (t) => alpha(t.palette.primary.main, 0.05),
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography
        sx={{
          fontSize: "0.7rem",
          fontWeight: 700,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: "text.secondary",
          mb: 1.5,
        }}
      >
        {`Preview · ${label}`}
      </Typography>
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        {children}
      </Box>
    </Box>
  );
}
