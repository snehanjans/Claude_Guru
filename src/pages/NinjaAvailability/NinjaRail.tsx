import { useState, type ComponentType } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Popover from "@mui/material/Popover";
import ButtonBase from "@mui/material/ButtonBase";

/**
 * The console's left icon rail and the flyout it opens.
 *
 * Every number here was measured off the internal console rather than eyeballed
 * from a screenshot — see docs/ninja-manage-guru-requests.md. The details that
 * are easy to get wrong, and that an earlier version of this rail did get wrong:
 *
 *   - the icon sits in a 56×32 pill whose radius is 0 at rest and only becomes
 *     16px once it is hovered or active, so there is no pill shape until you
 *     reach for it;
 *   - the flyout opens on CLICK, not hover;
 *   - its Paper carries no elevation at all.
 *
 * The console builds its greys as alpha over near-black, so these stay in rgba()
 * form: flattening them to hex drifts once they sit over a tinted row.
 */

const BLUE = "rgb(25, 106, 229)";
const BLUE_WASH = "rgba(25, 106, 229, 0.08)";
const INK = "rgba(33, 33, 33, 0.92)";
const HAIRLINE = "rgba(33, 33, 33, 0.06)";
const HOVER_WASH = "rgba(33, 33, 33, 0.08)";
const ITEM_HOVER = "rgba(33, 33, 33, 0.04)";
const EASE = "cubic-bezier(0.4, 0, 0.2, 1)";
/** Rail width; the flyout is pinned to exactly this offset. */
const RAIL_W = 104;

export type RailItem = {
  label: string;
  Icon: ComponentType<{ sx?: object }>;
  active?: boolean;
};

/** Submenus the console actually shows. Only Gurus is documented so far. */
const SUBMENUS: Record<string, string[]> = {
  Gurus: [
    "GL Gurus Catalog",
    "Evaluation and Moderation",
    "Manage Guru Requests",
    "Faculty Calendar",
    "Published Faculty Calendar",
  ],
};

/**
 * Where a submenu row goes. Entries missing from here have no page yet, so the
 * row stays inert rather than routing somewhere that would 404 — the console
 * itself has all of them, and these get filled in as each is built.
 */
const SUBMENU_ROUTES: Record<string, string> = {
  "GL Gurus Catalog": "/ninja-availability",
  "Manage Guru Requests": "/ninja-manage-guru-requests",
};

const THIN_SCROLL = {
  scrollbarWidth: "thin" as const,
  scrollbarColor: "#c4cad2 transparent",
  "&::-webkit-scrollbar": { width: 6, height: 6 },
  "&::-webkit-scrollbar-track": { background: "transparent" },
  "&::-webkit-scrollbar-thumb": { backgroundColor: "#c4cad2", borderRadius: 999 },
  "&::-webkit-scrollbar-thumb:hover": { backgroundColor: "#aab1bb" },
};

export default function NinjaRail({
  items,
  activeLabel,
  activeSubItem,
  onSelectSubItem,
}: {
  items: RailItem[];
  /** Overrides the `active` flag baked into the shared items, so a page under a
      different section (Batches, say) can light the right icon. */
  activeLabel?: string;
  /** Highlighted row inside the open flyout. */
  activeSubItem?: string;
  onSelectSubItem?: (item: string) => void;
}) {
  const navigate = useNavigate();
  const [menu, setMenu] = useState<{ el: HTMLElement; label: string } | null>(null);
  const open = menu ? SUBMENUS[menu.label] : undefined;

  return (
    <>
      <Box
        sx={{
          width: RAIL_W,
          flexShrink: 0,
          bgcolor: "#fff",
          borderRight: `1px solid ${HAIRLINE}`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          py: 3,
          overflowY: "auto",
          zIndex: 1200,
          ...THIN_SCROLL,
        }}
      >
        <Box
          sx={{
            fontWeight: 800,
            fontSize: 26,
            color: BLUE,
            fontFamily: "Inter, sans-serif",
            mb: 2,
          }}
        >
          G
        </Box>

        {items.map(({ label, Icon, active: seeded }) => {
          const active = activeLabel ? label === activeLabel : seeded;
          const hasMenu = !!SUBMENUS[label];
          const isOpen = menu?.label === label;
          return (
            <ButtonBase
              key={label}
              disableRipple
              onClick={(e) => {
                if (!hasMenu) return;
                setMenu(isOpen ? null : { el: e.currentTarget, label });
              }}
              sx={{
                width: 89,
                py: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                cursor: "pointer",
                /* The hover wash belongs to the pill, not the whole item, so the
                   label never picks up a background of its own. */
                "&:hover .rail-pill": {
                  bgcolor: active ? BLUE_WASH : HOVER_WASH,
                  borderRadius: "16px",
                },
              }}
            >
              <Box
                className="rail-pill"
                sx={{
                  width: 56,
                  height: 32,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: active ? BLUE_WASH : "transparent",
                  borderRadius: active ? "16px" : 0,
                  transition: `background-color 0.15s ${EASE}, border-radius 0.15s ${EASE}`,
                }}
              >
                <Icon sx={{ fontSize: 24, color: active ? BLUE : INK }} />
              </Box>
              <Typography
                sx={{
                  fontSize: 12,
                  fontWeight: active ? 600 : 400,
                  lineHeight: "19.92px",
                  letterSpacing: "normal",
                  color: active ? BLUE : INK,
                  textAlign: "center",
                }}
              >
                {label}
              </Typography>
            </ButtonBase>
          );
        })}
      </Box>

      {/* Flyout. NOT anchored to the clicked item: the console pins it to the
          rail's right edge and runs it the full height of the viewport, so it
          reads as a second panel rather than as a menu hanging off a button. */}
      <Popover
        open={!!open}
        anchorReference="anchorPosition"
        anchorPosition={{ top: 0, left: RAIL_W }}
        marginThreshold={0}
        onClose={() => setMenu(null)}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              width: 300,
              height: "100vh",
              maxHeight: "100%",
              borderRadius: 0,
              bgcolor: "#fff",
              /* The console's flyout has no elevation at all. */
              boxShadow: "none",
              borderRight: `1px solid ${HAIRLINE}`,
              overflowY: "auto",
              p: 2,
            },
          },
        }}
      >
        {menu && (
          <Stack direction="row" alignItems="center" spacing={1} sx={{ px: 1, pb: 2 }}>
            {(() => {
              const Icon = items.find((i) => i.label === menu.label)?.Icon;
              return Icon ? <Icon sx={{ fontSize: 22, color: BLUE }} /> : null;
            })()}
            <Typography sx={{ fontSize: 16, fontWeight: 500, color: BLUE, letterSpacing: "normal" }}>
              {menu.label}
            </Typography>
          </Stack>
        )}

        {open?.map((sub) => {
          const isActive = sub === activeSubItem;
          return (
            <ButtonBase
              key={sub}
              disableRipple
              onClick={() => {
                setMenu(null);
                onSelectSubItem?.(sub);
                const to = SUBMENU_ROUTES[sub];
                if (to) navigate(to);
              }}
              sx={{
                width: 267,
                justifyContent: "flex-start",
                p: 1,
                borderRadius: "4px",
                bgcolor: isActive ? BLUE_WASH : "transparent",
                transition: `background-color 0.15s ${EASE}`,
                "&:hover": { bgcolor: isActive ? BLUE_WASH : ITEM_HOVER },
              }}
            >
              <Typography
                sx={{
                  fontSize: 14,
                  fontWeight: 400,
                  lineHeight: "20.02px",
                  letterSpacing: "normal",
                  color: isActive ? BLUE : INK,
                }}
              >
                {sub}
              </Typography>
            </ButtonBase>
          );
        })}
      </Popover>
    </>
  );
}
