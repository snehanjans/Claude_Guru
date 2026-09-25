import { useEffect } from "react";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import Box from "@mui/material/Box";
import { useAppSelector, useAppDispatch } from "@/store";
import { dismissToast } from "@/store/slices/toastsSlice";

export function ToastViewport() {
  const dispatch = useAppDispatch();
  const toasts = useAppSelector((s) => s.toasts.items);

  const MAX_VISIBLE = 2;

  const DEFAULT_DURATION_MS = 3500;

  /* Each toast runs its own clock. Timing only the newest meant a slow toast
     held every one beneath it on screen, and a longer duration on one message
     could not be expressed at all. */
  useEffect(() => {
    const timers = toasts
      .filter((t) => !t.persistent)
      .map((t) =>
        window.setTimeout(() => dispatch(dismissToast(t.id)), t.durationMs ?? DEFAULT_DURATION_MS),
      );
    return () => timers.forEach((id) => clearTimeout(id));
  }, [toasts, dispatch]);

  // Auto-dismiss overflow toasts, oldest first, never a persistent one
  useEffect(() => {
    if (toasts.length <= MAX_VISIBLE) return;
    const overflow = toasts
      .filter((t) => !t.persistent)
      .slice(0, toasts.length - MAX_VISIBLE);
    overflow.forEach((t) => dispatch(dismissToast(t.id)));
  }, [toasts, dispatch]);

  if (!toasts.length) return null;

  const visibleToasts = toasts.slice(-MAX_VISIBLE);

  return (
    <Box
      sx={{
        pointerEvents: "none",
        position: "fixed",
        right: 16,
        top: 16,
        zIndex: 1400,
        "@keyframes toastSlideIn": {
          "0%": { opacity: 0, transform: "translateX(12px) scale(0.96)" },
          "100%": { opacity: 1, transform: "translateX(0) scale(1)" },
        },
        "@keyframes toastFadeOut": {
          "0%": { opacity: 1, transform: "translateX(0) scale(1)" },
          "100%": { opacity: 0, transform: "translateX(8px) scale(0.96)" },
        },
      }}
    >
      <Box sx={{ width: "min(24rem, calc(100vw - 2rem))", display: "flex", flexDirection: "column", gap: 1 }}>
        {visibleToasts.map((t) => (
          <Box
            key={t.id}
            role="status"
            aria-live="polite"
            sx={{
              pointerEvents: "auto",
              borderRadius: "16px",
              border: 1,
              borderColor: t.variant === "destructive" ? "var(--gl-status-declined-border)" : "divider",
              backgroundColor: t.variant === "destructive" ? "var(--gl-status-declined-bg)" : "hsl(var(--md-surface))",
              px: 2,
              py: 1.5,
              boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
              animation: "toastSlideIn 0.3s cubic-bezier(0.22, 1, 0.36, 1) both",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 1.5 }}>
              <Box sx={{ minWidth: 0 }}>
                <Box
                  sx={{
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: t.titleTone === "danger" ? "var(--gl-status-declined-text)" : undefined,
                  }}
                >
                  {t.title}
                </Box>
                {t.description && (
                  <Box sx={{ mt: 0.5, fontSize: "0.875rem", color: "hsl(var(--md-on-surface-variant))" }}>
                    {t.description}
                  </Box>
                )}
              </Box>
              <Box
                component="button"
                type="button"
                onClick={() => dispatch(dismissToast(t.id))}
                aria-label="Dismiss"
                sx={{
                  pointerEvents: "auto",
                  display: "grid",
                  height: 32,
                  width: 32,
                  placeItems: "center",
                  borderRadius: "12px",
                  border: 1,
                  borderColor: "divider",
                  backgroundColor: "hsl(var(--md-surface))",
                  color: "hsl(var(--md-on-surface-variant))",
                  cursor: "pointer",
                  flexShrink: 0,
                  "&:hover": { backgroundColor: "hsl(var(--md-surface-container))" },
                }}
              >
                <CloseOutlinedIcon sx={{ fontSize: 16 }} />
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
