import { useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useAppSelector } from "@/store";

const EASE_OUT = "cubic-bezier(0.23, 1, 0.32, 1)";

const FAQ_GROUPS: { title: string; items: { q: string; a: string }[] }[] = [
  {
    title: "Great Learning Ambassadors",
    items: [
      {
        q: "What is the Great Learning Ambassadors program?",
        a: "The Great Learning Ambassadors program is an exclusive referral program meant for our Great Learning Gurus, where you can recommend Great Learning's AI-native for professionals program to individuals within your own network and earn when they enrol successfully.",
      },
      {
        q: "How do I get started?",
        a: "Every program card on your dashboard has a personalised program page tagged to your ID, you may copy the link and share it. You can post it anywhere: WhatsApp, LinkedIn, email, or any other channel your network uses. Anyone who enrols through your page counts as your referral, whether they enrol directly or first book a call with a learning consultant.",
      },
    ],
  },
  {
    title: "Earning and payment",
    items: [
      {
        q: "How much do I earn on a referral?",
        a: "You earn 20% of the actual collected and realized program fees after any applicable discounts when a referral enrols without any assistance from a GL learning consultant. If a referral schedules a call to know more about the program and a GL learning consultant helps the prospecting learner, you will earn 10% as a referral reward. Discounts are offered to learners from time to time based on the promotions running at that time.",
      },
      {
        q: "What is an eligible referral?",
        a: "The referral scheme applies to new or inactive prospective learners enrolling in Great Learning programs. The referral would not be eligible for referral fee if Great Learning has engaged in the prior 2 month period with the prospective learner through its own outreach efforts and its counsellors have been supporting the prospective learner's decision making at any time during this month.",
      },
      {
        q: "How can I see the progress/status of my referred candidates?",
        a: "You can check out the status of all of your referred candidates in the tab “My referrals”. It is updated once every 6 hours.",
      },
      {
        q: "When am I paid?",
        a: "Your reward is confirmed once your referral has enrolled, joined their cohort, and paid the full course fee. This usually takes about 3 weeks from the cohort start. Eligible rewards are paid out monthly, alongside your regular Guru payments.",
      },
      {
        q: "What if a learner drops out?",
        a: "If your referral drops out and is eligible for a refund, no reward is issued. Some learners also pay in two installments in such cases, your reward is credited once they've paid the full course fee.",
      },
      {
        q: "Can I offer my referrals a promo code?",
        a: "Yes, you get a 20% promo code that you can share with all your referrals. They can apply this code during fee payment to get a 20% off in the program fees.",
      },
    ],
  },
  {
    title: "Support and logistics",
    items: [
      {
        q: "What does Great Learning provide to support during the referral process?",
        a: "We provide you with a personalized program page, ready to share posts and messages; a 20% promo code for all your referrals; and a dashboard where you can track every referral from interest to enrollment.",
      },
      {
        q: "How are my referrals tracked?",
        a: "Through your personalised program page. Every enrollment that comes through it is automatically credited to you.",
      },
      {
        q: "Can someone help my referrals if they have more questions?",
        a: "Yes. A GL learning consultant is available if your referral wants to talk before enrolling. They can also enroll online themselves if they don't need help. We encourage you to share enough information for learners to make an informed decision.",
      },
      {
        q: "Who handles learner complaints or refunds?",
        a: "Great Learning does. You are not responsible for handling this.",
      },
    ],
  },
];

const NO_PROMO_ANSWERS: Record<string, string> = {
  "Can I offer my referrals a promo code?":
    "Yes. Your referrals get 20% off by applying the promo code shown on the program page.",
  "What does Great Learning provide to support during the referral process?":
    "We provide you with a personalized program page, ready to share posts and messages; a 20% promo code your referrals can claim on the program page; and a dashboard where you can track every referral from interest to enrollment.",
};

export function FaqSection() {
  const [expanded, setExpanded] = useState<string | false>("0-0");
  const noPromoCode = useAppSelector((s) => s.devPanel.noPromoCode);

  const groups = noPromoCode
    ? FAQ_GROUPS.map((group) => ({
        ...group,
        items: group.items.map((item) =>
          NO_PROMO_ANSWERS[item.q] ? { ...item, a: NO_PROMO_ANSWERS[item.q] } : item,
        ),
      }))
    : FAQ_GROUPS;

  return (
    <Box sx={{ maxWidth: 760 }}>
      {groups.map((group, g) => (
        <Box key={group.title} sx={{ mb: g < groups.length - 1 ? 3.5 : 0 }}>
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
