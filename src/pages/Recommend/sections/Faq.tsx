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
    title: "GL Guru Ambassadors",
    items: [
      {
        q: "What is GL Guru Ambassadors?",
        a: "An exclusive referral program meant for our Gurus, where you can recommend Great Learning's AI-native for professionals program to your own network and earn on every enrolment.",
      },
      {
        q: "How do I get started?",
        a: "Taking the first step is easy. Share your personalised program page within your network with the social media channel of your choice. You can refer to the social media kit for pre-filled messages.",
      },
    ],
  },
  {
    title: "Earning and payment",
    items: [
      {
        q: "How much do I earn on a referral?",
        a: "20% of the post-discount price when a learner enrolls through you without any assistance, or 10% when a GL learning consultant helps close.",
      },
      {
        q: "When am I paid?",
        a: "Once the learner enrols, the cohort starts, and the refund window is closed.",
      },
      {
        q: "Which learners qualify for an eligible referral reward?",
        a: "All prospecting learners except those who have already been in touch with Great Learning's in the last one month.",
      },
      {
        q: "What if a learner drops out?",
        a: "If a learner drops out and is eligible for a refund, no reward is issued",
      },
      {
        q: "Can I offer my learners a discount?",
        a: "Yes, you get a discount code for your network.",
      },
    ],
  },
  {
    title: "Support and logistics",
    items: [
      {
        q: "What does GL provide to support?",
        a: "We provide you with a unique landing page, ready-to-post messages for your social channels, a discount code for learners and an ability to track the journey of your referred candidates post-expressing interest in the program.",
      },
      {
        q: "How are my referrals tracked?",
        a: "Through your unique landing page, to ensure every enrolment is credited to you.",
      },
      {
        q: "Can someone help me sell?",
        a: "A learning consultant is available when needed. A referred candidate has both the options - to self checkout after payment and to schedule a call with an LC before making the payment",
      },
      {
        q: "Who handles learner complaints or refunds?",
        a: "Great Learning does.",
      },
    ],
  },
];

export function FaqSection() {
  const [expanded, setExpanded] = useState<string | false>("0-0");

  return (
    <Box sx={{ maxWidth: 760 }}>
      {FAQ_GROUPS.map((group, g) => (
        <Box key={group.title} sx={{ mb: g < FAQ_GROUPS.length - 1 ? 3.5 : 0 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, fontSize: "1.15rem", letterSpacing: "-0.01em", mb: 1.5 }}
          >
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
                  <Typography variant="subtitle2" sx={{ fontWeight: 500, lineHeight: 1.4 }}>
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
