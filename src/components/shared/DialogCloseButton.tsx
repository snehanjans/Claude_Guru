import IconButton, { type IconButtonProps } from "@mui/material/IconButton";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

/**
 * The close affordance for every modal, dialog and drawer: a bordered rounded
 * square, not a bare icon.
 *
 * Defined once because these had drifted badly — three different icon sets
 * (CloseOutlined / CloseRounded / Close), four icon sizes (14–20px) and a mix of
 * bordered and borderless treatments across a dozen surfaces. New dialogs should
 * use this rather than hand-rolling another one.
 *
 * Not for non-modal dismissals — toasts, removable chips and inline banners have
 * their own, smaller affordances.
 */
export function DialogCloseButton({ sx, ...rest }: IconButtonProps) {
  return (
    <IconButton
      size="small"
      aria-label="Close"
      {...rest}
      sx={{
        border: 1,
        borderColor: "divider",
        borderRadius: "8px",
        p: 0.75,
        flexShrink: 0,
        color: "text.secondary",
        ...sx,
      }}
    >
      <CloseOutlinedIcon sx={{ fontSize: 16 }} />
    </IconButton>
  );
}
