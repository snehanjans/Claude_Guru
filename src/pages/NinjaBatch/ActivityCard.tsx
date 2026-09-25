import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import CloudDoneOutlinedIcon from "@mui/icons-material/CloudDoneOutlined";

/**
 * One row of Batch Activities, measured off the console.
 *
 * Shared with the cancellation drawer on purpose: Ops should meet the same card
 * in the queue that greets them on the batch, so the thing they approved and the
 * thing they are about to edit are visibly the same object.
 */

const BLUE_DEEP = "rgb(15, 64, 137)";
const INK = "rgba(33, 33, 33, 0.92)";
const INK_SOFT = "rgba(33, 33, 33, 0.72)";
const HAIRLINE = "rgba(33, 33, 33, 0.06)";
const WASH = "rgba(33, 33, 33, 0.04)";

export default function ActivityCard({ kind, title, meta }: { kind: string; title: string; meta: string }) {
  return (
    <Box
      sx={{
        border: `1px solid ${HAIRLINE}`,
        borderRadius: "6px",
        p: 2,
        mb: 1.5,
        display: "flex",
        gap: 2,
      }}
    >
      <Box
        sx={{
          width: 44, height: 44, borderRadius: "50%", bgcolor: WASH, flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        <GroupsOutlinedIcon sx={{ fontSize: 22, color: INK_SOFT }} />
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mb: 0.5 }}>
          <CloudDoneOutlinedIcon sx={{ fontSize: 16, color: "#37b24d" }} />
          <Typography
            sx={{
              fontSize: 10,
              fontWeight: 600,
              lineHeight: "15px",
              letterSpacing: "1.25px",
              /* The console shouts this line in CSS and stores it title-case, so
                 the casing lives here rather than in every caller's string. */
              textTransform: "uppercase",
              color: BLUE_DEEP,
            }}
          >
            {kind}
          </Typography>
        </Stack>
        <Typography sx={{ fontSize: 14, fontWeight: 500, lineHeight: "21.98px", color: INK, letterSpacing: "normal" }}>
          {title}
        </Typography>
        <Typography sx={{ fontSize: 12, fontWeight: 400, lineHeight: "19.92px", color: INK, letterSpacing: "normal" }}>
          {meta}
        </Typography>
      </Box>
    </Box>
  );
}
