import { useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const EASE_OUT = "cubic-bezier(0.23, 1, 0.32, 1)";

const FAQ_GROUPS: { title: string; items: { q: string; a: string }[] }[] = [
  {
    title: "Joining and eligibility",
    items: [
      {
        q: "What is GL Guru Collective?",
        a: "A program where you promote GL's AINP to your own network and earn on the enrollments, and can also run and teach your own cohort.",
      },
      {
        q: "Who can join?",
        a: "Gurus who have taught GenAI in the last 6 months. The wider set of GL AI Gurus can also refer and opt in.",
      },
      {
        q: "Do I have to teach a cohort, or can I just refer?",
        a: "Either. You can refer learners, or form and teach your own cohort.",
      },
      {
        q: "How do I get started?",
        a: "You are selected, complete a short onboarding on the AINP content and how to teach it, and receive your kit.",
      },
    ],
  },
  {
    title: "Earning and payment",
    items: [
      {
        q: "How much do I earn on a referral?",
        a: "20% of the post-discount price when a learner enrolls on your own message, or 10% when a learning consultant helps close.",
      },
      {
        q: "Do I earn for teaching a cohort?",
        a: "Yes, hourly teaching pay per your contract, for the whole cohort you teach.",
      },
      {
        q: "When am I paid?",
        a: "After the learner completes the program.",
      },
      {
        q: "Which learners qualify for a bonus?",
        a: "New or previously unconverted learners whose GL lead is more than 3 months old.",
      },
      {
        q: "What if a learner drops out?",
        a: "Dropouts before the payout point are not paid.",
      },
    ],
  },
  {
    title: "Support and logistics",
    items: [
      {
        q: "What does GL provide?",
        a: "Collaterals to promote, a customisable landing page, the curriculum, platform, payments, and certification.",
      },
      {
        q: "How are my referrals tracked?",
        a: "Through your unique referral code and a dedicated lead source, so every enrollment is credited to you.",
      },
      {
        q: "Does someone help me sell?",
        a: "A learning consultant is available when needed, but the aim is for learners to convert on your own message.",
      },
      {
        q: "Who handles learner complaints or refunds?",
        a: "GL does.",
      },
    ],
  },
];

export function FaqSection() {
  const [expanded, setExpanded] = useState<string | false>("0-0");

  return (
    <Box sx={{ maxWidth: 760 }}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.55 }}>
        Everything about how referrals, bonuses, and payouts work in the GL Guru Collective.
      </Typography>

      {FAQ_GROUPS.map((group, g) => (
        <Box key={group.title} sx={{ mb: g < FAQ_GROUPS.length - 1 ? 3.5 : 0 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.25 }}>
            {group.title}
          </Typography>
          {group.items.map((f, i) => {
            const id = `${g}-${i}`;
            return (
              <Accordion
                key={id}
                disableGutters
                elevation={0}
                expanded={expanded === id}
                onChange={(_e, isExpanded) => setExpanded(isExpanded ? id : false)}
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: "12px !important",
                  overflow: "hidden",
                  mb: 1.25,
                  "&::before": { display: "none" },
                  transition: `border-color 180ms ${EASE_OUT}`,
                  ...(expanded === id && { borderColor: "primary.main" }),
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ fontSize: 20 }} />}
                  sx={{
                    px: 2,
                    minHeight: 52,
                    "& .MuiAccordionSummary-content": { my: 1.25 },
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1.4 }}>
                    {f.q}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ px: 2, pt: 0, pb: 2 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    {f.a}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            );
          })}
        </Box>
      ))}
    </Box>
  );
}
