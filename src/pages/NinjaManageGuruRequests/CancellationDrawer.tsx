import { useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import CloseIcon from "@mui/icons-material/Close";

import ActivityCard from "@/pages/NinjaBatch/ActivityCard";
import type { QueueRow } from "./rows";

/**
 * The detail panel behind a queue row.
 *
 * Geometry copies the console's own drawer — the one its Pending rows open —
 * rather than this project's drawer conventions: 540px, no radius, MUI
 * elevation, and the 0.225s slide it ships with. See §"Row click" in
 * docs/ninja-manage-guru-requests.md.
 *
 * Rejecting demands a note. Approving does not: the Guru already gave their
 * reason, and it is carried through to the declined session. A rejection is the
 * only outcome that leaves the Guru expected to turn up after they asked not
 * to, so it is the one that owes them an explanation.
 */

const BLUE = "rgb(25, 106, 229)";
const INK = "rgba(33, 33, 33, 0.92)";
const INK_SOFT = "rgba(33, 33, 33, 0.72)";
const HAIRLINE = "rgba(33, 33, 33, 0.06)";
const RED = "#c62828";

function Field({ label, value, href }: { label: string; value: string; href?: string }) {
  return (
    <Stack direction="row" spacing={2} sx={{ py: 0.75 }}>
      <Typography sx={{ fontSize: 12, color: INK_SOFT, width: 132, flexShrink: 0, letterSpacing: "normal" }}>
        {label}
      </Typography>
      {/* Contact rows are links: Ops reading this panel are usually deciding
          whether to ring the Guru, so the detail should be one click from being
          acted on rather than something to copy out by hand. */}
      {href ? (
        <Link href={href} underline="hover" sx={{ fontSize: 13, color: BLUE, letterSpacing: "normal", wordBreak: "break-word" }}>
          {value}
        </Link>
      ) : (
        <Typography sx={{ fontSize: 13, color: INK, letterSpacing: "normal" }}>{value}</Typography>
      )}
    </Stack>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Box sx={{ border: `1px solid ${HAIRLINE}`, borderRadius: "4px", p: 2, mb: 2, bgcolor: "#fff" }}>
      <Typography sx={{ fontSize: 14, fontWeight: 600, color: INK, mb: 1, letterSpacing: "normal" }}>
        {title}
      </Typography>
      {children}
    </Box>
  );
}

export default function CancellationDrawer({
  row,
  onClose,
  onApprove,
  onReject,
}: {
  row: QueueRow | null;
  onClose: () => void;
  onApprove: (row: QueueRow) => void;
  onReject: (row: QueueRow, reason: string) => void;
}) {
  const [rejecting, setRejecting] = useState(false);
  const [note, setNote] = useState("");

  const close = () => {
    setRejecting(false);
    setNote("");
    onClose();
  };

  const resolved = row?.status !== "pending";

  return (
    <Drawer
      anchor="right"
      open={!!row}
      onClose={close}
      slotProps={{
        paper: {
          sx: {
            width: 540,
            maxWidth: "100vw",
            borderRadius: 0,
            display: "flex",
            flexDirection: "column",
          },
        },
      }}
    >
      {row && (
        <>
          <Box sx={{ px: 3, pt: 3, pb: 2 }}>
            <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={2}>
              {/* Names the Guru, not the batch: a Guru cancels a session rather
                  than a batch, and the activity card below already carries the
                  batch. Who asked is what tells two requests apart. */}
              <Typography sx={{ fontSize: 18, fontWeight: 600, lineHeight: "23.94px", color: INK, letterSpacing: "normal" }}>
                Cancellation request from {row.guru}
              </Typography>
              <IconButton onClick={close} aria-label="Close" sx={{ mt: -0.5 }}>
                <CloseIcon />
              </IconButton>
            </Stack>
          </Box>

          <Box sx={{ flex: 1, overflowY: "auto", px: 3, pb: 2 }}>
            {/* The same card the batch page shows, so the activity Ops approve
                here is visibly the one they land on there. */}
            <Box sx={{ mb: 2 }}>
              <ActivityCard
                kind={`${row.sessionType} · Batch · ${row.program}`}
                title={row.sessionTitle}
                meta={row.sessionAtLabel}
              />
            </Box>

            <Card title="Guru">
              <Field label="Name" value={row.guru} />
              {row.guruEmail && <Field label="Email" value={row.guruEmail} href={`mailto:${row.guruEmail}`} />}
              {row.guruPhone && (
                <Field label="Mobile" value={row.guruPhone} href={`tel:${row.guruPhone.replace(/[^+\d]/g, "")}`} />
              )}
            </Card>

            <Card title="Request">
              <Field label="Requested on" value={row.requestedAtLabel} />
              <Field label="Reason given" value={row.reason || "Not given"} />
            </Card>

            {/* Once decided, the panel reports rather than asks. */}
            {resolved && (
              <Box
                sx={{
                  border: `1px solid ${HAIRLINE}`,
                  borderRadius: "4px",
                  p: 2,
                  bgcolor: "rgba(33, 33, 33, 0.04)",
                }}
              >
                <Typography sx={{ fontSize: 13, fontWeight: 600, color: INK, letterSpacing: "normal" }}>
                  {row.status === "approved" ? "Approved" : "Rejected"}
                  {row.resolvedAtLabel ? ` on ${row.resolvedAtLabel}` : ""}
                </Typography>
                {row.status === "rejected" && row.resolutionNote && (
                  <Typography sx={{ fontSize: 13, color: INK_SOFT, mt: 0.5, letterSpacing: "normal" }}>
                    {row.resolutionNote}
                  </Typography>
                )}
                {row.status === "approved" && (
                  <Typography sx={{ fontSize: 13, color: INK_SOFT, mt: 0.5, letterSpacing: "normal" }}>
                    This session now shows as unavailable on the Guru's calendar.
                  </Typography>
                )}
              </Box>
            )}

            {rejecting && !resolved && (
              <TextField
                autoFocus
                multiline
                minRows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                label="Why are you rejecting this?"
                placeholder="The Guru will see this, so let them know why they're still needed."
                sx={{
                  width: "100%",
                  "& .MuiOutlinedInput-root": { borderRadius: "4px", fontSize: 14 },
                }}
              />
            )}
          </Box>

          {/* Footer: the way out sits far left, the two decisions group right, so
              "leave this alone" is never adjacent to "decide this". */}
          <Box
            sx={{
              px: 3,
              py: 2,
              borderTop: `1px solid ${HAIRLINE}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 1.5,
              flexShrink: 0,
            }}
          >
            {resolved ? (
              <>
                <Box />
                <Button onClick={close} sx={{ fontSize: 14, fontWeight: 500, color: BLUE, px: "15px", py: "5px" }}>
                  Close
                </Button>
              </>
            ) : rejecting ? (
              <>
                <Button
                  onClick={() => { setRejecting(false); setNote(""); }}
                  sx={{ fontSize: 14, fontWeight: 500, color: BLUE, px: "15px", py: "5px" }}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  disableElevation={false}
                  disabled={!note.trim()}
                  onClick={() => { onReject(row, note.trim()); close(); }}
                  sx={{ fontSize: 14, fontWeight: 500, bgcolor: RED, px: "16px", py: "6px", "&:hover": { bgcolor: "#a81f1f" } }}
                >
                  Confirm reject
                </Button>
              </>
            ) : (
              <>
                <Button onClick={close} sx={{ fontSize: 14, fontWeight: 500, color: BLUE, px: "15px", py: "5px" }}>
                  Cancel
                </Button>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Button
                    onClick={() => setRejecting(true)}
                    sx={{ fontSize: 14, fontWeight: 500, color: RED, px: "15px", py: "5px" }}
                  >
                    Reject
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => { onApprove(row); close(); }}
                    sx={{ fontSize: 14, fontWeight: 500, bgcolor: BLUE, px: "16px", py: "6px", "&:hover": { bgcolor: "#1259c4" } }}
                  >
                    Approve and update activity
                  </Button>
                </Box>
              </>
            )}
          </Box>
        </>
      )}
    </Drawer>
  );
}
