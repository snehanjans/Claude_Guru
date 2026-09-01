import { useEffect, useMemo, type ComponentType } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/material/styles";
import type { SvgIconProps } from "@mui/material/SvgIcon";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import IosShareOutlinedIcon from "@mui/icons-material/IosShareOutlined";
import HowToRegOutlinedIcon from "@mui/icons-material/HowToRegOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import { fmtMoney } from "@/lib/helpers";
import { GURU_CURRENCY, toGuruCurrency } from "@/data/demo-ambassador";
import { useRecommend, type RecommendTab } from "./RecommendContext";
import { ProgramsSection } from "./sections/Programs";
import { MyReferralsSection } from "./sections/MyReferrals";
import { FaqSection } from "./sections/Faq";
import { HeroVideoPanel } from "@/components/recommend/HeroVideoPanel";
import { track, ANALYTICS_EVENTS } from "@/lib/analytics";

const TABULAR = { fontVariantNumeric: "tabular-nums" as const };

/* How a referral works — the same three steps in both heroes. */
/** Booking page for a walkthrough of the Ambassadors scheme. */
const SCHEDULE_CALL_URL = "https://calendar.app.google/Cs6eGAekkn4688G38";

const HOW_IT_WORKS = [
  { step: "1", title: "Share a program", sub: "Share your personalised link", icon: IosShareOutlinedIcon },
  { step: "2", title: "They enroll", sub: "Your learner joins a cohort", icon: HowToRegOutlinedIcon },
  { step: "3", title: "You earn", sub: "20% via your link, 10% if an advisor closes it", icon: PaymentsOutlinedIcon },
];

/**
 * The three steps as a connected row of icon tiles.
 *
 * All three carry the same weight: this explains how a referral works, it isn't
 * a progress tracker, so nothing is dimmed as "not reached yet". The connector
 * runs from each tile to the edge of its column, which is where the next tile
 * begins — no absolute positioning, so it survives the columns being resized.
 *
 * Used in the zero-referral hero only. The hero a guru with referrals sees is
 * left exactly as it was.
 */
function HowItWorksSteps() {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "repeat(3, minmax(0, 1fr))" },
        gap: { xs: 1.25, sm: 0 },
      }}
    >
      {HOW_IT_WORKS.map((s, i) => (
        <Box
          key={s.step}
          sx={{
            minWidth: 0,
            pr: { sm: i === HOW_IT_WORKS.length - 1 ? 0 : 1.5 },
            /* Stacked icon-over-text runs to 267px on a phone — most of the
               fold for three lines of copy. Laying each step out as a row
               instead puts the icon beside its label and cuts that to ~140px,
               with nothing dropped. From `sm` up the column layout returns,
               because that is what the connector line runs along. */
            display: { xs: "flex", sm: "block" },
            alignItems: { xs: "center" },
            gap: { xs: 1.5 },
          }}
        >
          <Stack direction="row" alignItems="center" sx={{ mb: { xs: 0, sm: 1 } }}>
            <Box
              sx={{
                flexShrink: 0,
                width: 36,
                height: 36,
                borderRadius: "10px",
                display: "grid",
                placeItems: "center",
                color: "text.primary",
                bgcolor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <s.icon sx={{ fontSize: 18 }} />
            </Box>
            {/* Runs to the next tile. The negative margin cancels the column's
                gutter, which is there to keep the labels apart — without it the
                line stops a gutter short and the row reads as disconnected. */}
            {i < HOW_IT_WORKS.length - 1 && (
              <Box
                aria-hidden
                sx={{
                  display: { xs: "none", sm: "block" },
                  flex: 1,
                  height: "1px",
                  bgcolor: "divider",
                  mr: { sm: -1.5 },
                }}
              />
            )}
          </Stack>
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontSize: 14, fontWeight: 700, lineHeight: 1.3 }}>{s.title}</Typography>
            <Typography
              sx={{
                fontSize: 12.5,
                color: "text.secondary",
                lineHeight: 1.4,
                /* Step 3's subtitle is one character too wide for a phone and
                   orphans "it" onto its own line. Balancing splits it evenly
                   instead; a no-op on the two that already fit. */
                textWrap: "balance",
              }}
            >
              {s.sub}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
}

// Section heading shown under the tabs for the active view.
const TAB_META: Record<RecommendTab, { title: string; subtitle: string }> = {
  programs: {
    title: "Programs to recommend",
    subtitle:
      "Learners automate real work with AI. Mentored, no coding needed.",
  },
  referrals: {
    title: "My referrals",
    subtitle: "Track everyone you've recommended and what you've earned.",
  },
  faq: {
    title: "Frequently asked questions",
    subtitle: "How referrals, rewards, and payouts work.",
  },
};

// Provider + flow dialog live in App.tsx's RecommendScope, shared with the
// program-detail route so referrals survive navigation between the two.
export default function RecommendPage() {
  const { referrals, activeTab, setActiveTab } = useRecommend();

  // ── Derived referral stats (live off context referrals) ──
  // Bonuses are earned in each learner's currency; the hero shows ONE total,
  // converted into the guru's own payout currency.
  // Enrollments = learners who actually enrolled (enrolled → confirmed → paid);
  // Confirmed = payout confirmed or paid; Pending = still being worked (sent / contacted).
  const { pendingCount, enrollments, rejectedCount, totalEarned } = useMemo(() => {
    const by = (s: string) => referrals.filter((r) => r.status === s).length;
    const locked = referrals.filter((r) => r.status === "confirmed" || r.status === "paid");
    const total = locked.reduce((sum, r) => sum + toGuruCurrency(r.reward, r.currency), 0);
    return {
      pendingCount: by("sent") + by("contacted"),
      enrollments: by("enrolled") + by("confirmed") + by("paid"),
      rejectedCount: by("not_converted") + by("not_eligible"),
      totalEarned: fmtMoney(total, GURU_CURRENCY),
    };
  }, [referrals]);

  // First-run: nothing sent and nothing in the pipeline → show a getting-started
  // card instead of a dead "₹0 / 0 / 0" hero. The first referral flips this off.
  const noActivity = enrollments === 0 && pendingCount === 0;

  /*
   * Whether the hero carries the video panel.
   *
   * Every referral counts, whatever became of it — pipeline, enrolled, or
   * rejected — so this is the referral count and not `noActivity`, which
   * ignores the rejected ones. Derived on every render rather than stored as a
   * "new guru" flag: a guru whose only referral disappears sees the video
   * again, and one who makes their first stops seeing it from then on.
   */
  const hasAnyReferral = referrals.length > 0;

  /* Which hero this guru saw, with the count that decided it — the only way to
     check the targeting against the data afterwards. */
  useEffect(() => {
    track(ANALYTICS_EVENTS.HERO_VARIANT_SHOWN, {
      variant: hasAnyReferral ? "text_only" : "video",
      referrals: referrals.length,
    });
  }, [hasAnyReferral, referrals.length]);

  const tabs: { label: string; value: RecommendTab }[] = [
    { label: "Programs", value: "programs" },
    { label: "My referrals", value: "referrals" },
    { label: "FAQ", value: "faq" },
  ];

  return (
    <>
      {/* ── Hero — membership KPI cards ─────────────────────────────── */}
      {/* The zero-referral hero carries this inside itself, above the heading,
          so it isn't said twice. */}
      {hasAnyReferral && (
        <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mb: 1.75 }}>
          <WorkspacePremiumOutlinedIcon sx={{ fontSize: 16, color: "primary.main" }} />
          <Typography sx={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", color: "primary.main" }}>
            GREAT LEARNING AMBASSADORS
          </Typography>
        </Stack>
      )}

      {/* Getting-started card is always shown; when there's activity it narrows
          into the left column and the KPI stats sit beside it on the right. */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: noActivity ? "1fr" : { xs: "1fr", md: "1fr 1fr" },
          gap: 2,
          mb: 2.5,
          alignItems: "stretch",
        }}
      >
        {/* ── Getting-started card ─────────────────────────────────────── */}
        <Box
          sx={{
            position: "relative",
            overflow: "hidden",
            borderRadius: "20px",
            border: "1px solid",
            borderColor: (t) => alpha(t.palette.primary.main, 0.16),
            bgcolor: (t) => alpha(t.palette.primary.main, 0.04),
            p: { xs: 2.5, sm: 3 },
          }}
        >
          <Box
            aria-hidden
            sx={{
              position: "absolute",
              top: -80,
              right: -60,
              width: 260,
              height: 260,
              borderRadius: "50%",
              background: (t) =>
                `radial-gradient(closest-side, ${alpha(t.palette.primary.main, 0.08)}, transparent)`,
              pointerEvents: "none",
            }}
          />
          {/*
            * Zero referrals: video panel left, the copy below unchanged on the
            * right. One or more: no grid and no panel, so the card renders
            * exactly as it always has.
            */}
          <Box
            sx={
              hasAnyReferral
                ? undefined
                : {
                    display: "grid",
                    /* Just under half the banner, so the video reads as a panel
                       rather than a thumbnail beside the copy. */
                    gridTemplateColumns: { xs: "1fr", md: "minmax(0, 44%) minmax(0, 1fr)" },
                    gap: { xs: 2, md: 3 },
                    // Stretch, so the panel's height is the copy's height.
                    alignItems: "stretch",
                  }
            }
          >
            {!hasAnyReferral && <HeroVideoPanel />}
            <Box sx={{ minWidth: 0 }}>
          {!hasAnyReferral && (
            <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mb: 1 }}>
              <WorkspacePremiumOutlinedIcon sx={{ fontSize: 16, color: "primary.main" }} />
              <Typography sx={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", color: "primary.main" }}>
                GREAT LEARNING AMBASSADORS
              </Typography>
            </Stack>
          )}
          <Typography sx={{ fontSize: { xs: 20, sm: 22 }, fontWeight: 800, letterSpacing: "-0.02em" }}>
            Recommend, and earn on every enrollment
          </Typography>
          {/* 32px above the connected steps, which need more room than the old
              numbered row did; the hero for a guru with referrals keeps its
              original 20px. */}
          <Typography
            sx={{
              mt: 0.75,
              /* The generous bottom margin exists to clear the how-it-works
               tiles. Those are hidden on phones, so there it would just be
               a gap above the button. */
            mb: { xs: 2, sm: hasAnyReferral ? 2.5 : 4 },
              fontSize: 14,
              color: "text.secondary",
              maxWidth: 600,
              lineHeight: 1.55,
            }}
          >
            Earn 20% when your referral enrols through your link, or 10% if they book a call and a GL learning
            consultant helps them decide. That's up to $160 or ₹8,000 per enrolment.
          </Typography>

          {/* How it works. Hidden on phones: it restates the paragraph above
              in three tiles, and on a 390px screen those tiles were the
              difference between the hero fitting the fold and not. The
              explanation still reaches every reader through the copy above
              and the FAQ tab. From `sm` up there is room, so it stays. */}
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
          {hasAnyReferral ? (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
                gap: { xs: 1.75, sm: 2 },
              }}
            >
              {HOW_IT_WORKS.map((s) => (
                <Box key={s.step} sx={{ minWidth: 0 }}>
                  <Typography sx={{ fontSize: 14, fontWeight: 700, lineHeight: 1.3 }}>
                    <Box component="span" sx={{ color: "primary.main", mr: 0.5, ...TABULAR }}>
                      {s.step}
                    </Box>
                    {s.title}
                  </Typography>
                  <Typography sx={{ fontSize: 12.5, color: "text.secondary", lineHeight: 1.4 }}>{s.sub}</Typography>
                </Box>
              ))}
            </Box>
          ) : (
            <HowItWorksSteps />
          )}
          </Box>
            </Box>
          </Box>

          {/* Closing the hero: the copy above explains the scheme, this offers
              a person to ask. Sits below both columns so it reads as a footer
              to the whole banner rather than a fourth step. */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            /* Stack spacing becomes a margin-top on the second child, and it
               still applies when the first is display:none — which is the case
               on xs, so the button was carrying 12px of spacing off a hidden
               sibling. */
            spacing={{ xs: 0, sm: 2 }}
            alignItems={{ xs: "stretch", sm: "center" }}
            justifyContent="space-between"
            sx={{
              mt: { xs: 0, md: 3 },
              pt: { xs: 0, md: 2.5 },
              /* The rule separates the footer from the three tiles above it.
                 With those hidden on phones it has nothing to divide, and it
                 reads as a seam across an otherwise continuous card. */
              borderTop: { xs: "none", sm: "1px solid" },
              borderColor: "divider",
            }}
          >
            {/* The pitch here is chrome on a phone; the button is not. Hiding
                the icon and the two lines of copy keeps the only way to book a
                call while giving the hero back ~90px. */}
            <Stack
              direction="row"
              alignItems="center"
              spacing={1.5}
              sx={{ minWidth: 0, display: { xs: "none", sm: "flex" } }}
            >
              {/* Same 36px chip as the three steps above, so the footer reads as
                  part of the same banner rather than a bolted-on strip. */}
              <Box
                sx={{
                  flexShrink: 0,
                  width: 36,
                  height: 36,
                  borderRadius: "10px",
                  display: "grid",
                  placeItems: "center",
                  color: "text.primary",
                  bgcolor: "background.paper",
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <PhoneOutlinedIcon sx={{ fontSize: 18 }} />
              </Box>
              <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ fontSize: 14, fontWeight: 700, lineHeight: 1.4 }}>
                Talk to us
              </Typography>
              <Typography
                sx={{ mt: 0.25, fontSize: 13.5, color: "text.secondary", lineHeight: 1.5 }}
              >
                Want to know more about GL Ambassadors? Book a call and we&rsquo;ll walk you
                through it.
              </Typography>
              </Box>
            </Stack>
            <Button
              component="a"
              href={SCHEDULE_CALL_URL}
              target="_blank"
              rel="noopener noreferrer"
              variant="outlined"
              startIcon={<CalendarMonthOutlinedIcon sx={{ fontSize: 18 }} />}
              sx={{
                flexShrink: 0,
                textTransform: "none",
                fontWeight: 700,
                borderRadius: "10px",
              }}
            >
              Schedule a call
            </Button>
          </Stack>
        </Box>

        {/* ── KPI stats — appear once there's activity ─────────────────── */}
        {!noActivity && (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 2,
            }}
          >
            {(
              [
                {
                  icon: AccountBalanceWalletOutlinedIcon,
                  title: "Earnings",
                  value: totalEarned,
                  unit: "all time",
                },
                {
                  icon: PeopleAltOutlinedIcon,
                  title: "Enrollments",
                  value: String(enrollments),
                  unit: "total",
                },
                {
                  icon: TrendingUpOutlinedIcon,
                  title: "Pipeline",
                  value: String(pendingCount),
                  unit: "active",
                },
                {
                  icon: HighlightOffOutlinedIcon,
                  title: "Rejected",
                  value: String(rejectedCount),
                  unit: "total",
                },
              ] as {
                icon: ComponentType<SvgIconProps>;
                title: string;
                value: string;
                unit: string;
              }[]
            ).map((c) => (
              <Box
                key={c.title}
                sx={{
                  position: "relative",
                  overflow: "hidden",
                  borderRadius: "16px",
                  border: "1px solid",
                  borderColor: "divider",
                  bgcolor: "background.paper",
                  p: 2.25,
                }}
              >
                {/* faint brand corner tint (single-hue, low alpha) */}
                <Box
                  aria-hidden
                  sx={{
                    position: "absolute",
                    top: -50,
                    right: -40,
                    width: 150,
                    height: 150,
                    borderRadius: "50%",
                    background: (t) =>
                      `radial-gradient(closest-side, ${alpha(t.palette.primary.main, 0.07)}, transparent)`,
                    pointerEvents: "none",
                  }}
                />
                {/* icon chip + title */}
                <Stack direction="row" alignItems="center" spacing={1.25} sx={{ mb: 1.75 }}>
                  <Box
                    sx={{
                      width: 38,
                      height: 38,
                      borderRadius: "10px",
                      display: "grid",
                      placeItems: "center",
                      color: "primary.main",
                      bgcolor: (t) => alpha(t.palette.primary.main, 0.1),
                      flexShrink: 0,
                    }}
                  >
                    <c.icon sx={{ fontSize: 20 }} />
                  </Box>
                  <Typography sx={{ fontSize: 14, fontWeight: 600, color: "text.secondary" }}>{c.title}</Typography>
                </Stack>

                {/* headline metric + unit */}
                <Stack direction="row" alignItems="baseline" spacing={0.75} sx={{ flexWrap: "nowrap" }}>
                  <Typography
                    sx={{
                      fontSize: { xs: 26, sm: 30 },
                      fontWeight: 800,
                      lineHeight: 1,
                      letterSpacing: "-0.02em",
                      whiteSpace: "nowrap",
                      ...TABULAR,
                    }}
                  >
                    {c.value}
                  </Typography>
                  <Typography sx={{ fontSize: 13, color: "text.secondary", whiteSpace: "nowrap" }}>
                    {c.unit}
                  </Typography>
                </Stack>
              </Box>
            ))}
          </Box>
        )}
      </Box>

      {/* ── Tabs ────────────────────────────────────────────────────── */}
      <Tabs
        value={activeTab}
        onChange={(_e, v) => setActiveTab(v as RecommendTab)}
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        sx={{
          minHeight: 40,
          mb: 2.5,
          borderBottom: "1px solid",
          borderColor: "divider",
          "& .MuiTab-root": { textTransform: "none", fontSize: "0.875rem", fontWeight: 600, minHeight: 40 },
          "& .MuiTabs-indicator": { height: 3, borderRadius: "3px 3px 0 0" },
        }}
      >
        {tabs.map((t) => (
          <Tab key={t.value} label={t.label} value={t.value} />
        ))}
      </Tabs>

      {/* ── Active section ──────────────────────────────────────────── */}
      <Box sx={{ mb: 4 }}>
        {/* My referrals carries its own "N learners enrolled" header, so no title there */}
        {activeTab !== "referrals" && (
          <Box sx={{ mb: 2.5 }}>
            <Typography sx={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.015em", lineHeight: 1.2 }}>
              {TAB_META[activeTab].title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {TAB_META[activeTab].subtitle}
            </Typography>
          </Box>
        )}
        {activeTab === "programs" && <ProgramsSection />}
        {activeTab === "referrals" && <MyReferralsSection />}
        {activeTab === "faq" && <FaqSection />}
      </Box>
    </>
  );
}
