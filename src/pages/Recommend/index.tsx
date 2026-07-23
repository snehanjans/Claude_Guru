import { useMemo, type ComponentType } from "react";
import Box from "@mui/material/Box";
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
import IosShareOutlinedIcon from "@mui/icons-material/IosShareOutlined";
import { MobilePageHeader } from "@/components/layout/MobilePageHeader";
import { fmtMoney } from "@/lib/helpers";
import { GURU_CURRENCY, toGuruCurrency } from "@/data/demo-ambassador";
import { useRecommend, type RecommendTab } from "./RecommendContext";
import { ProgramsSection } from "./sections/Programs";
import { MyReferralsSection } from "./sections/MyReferrals";
import { FaqSection } from "./sections/Faq";

const TABULAR = { fontVariantNumeric: "tabular-nums" as const };

// Section heading shown under the tabs for the active view.
const TAB_META: Record<RecommendTab, { title: string; subtitle: string }> = {
  programs: {
    title: "Programs to recommend",
    subtitle:
      "Learners automate real work with AI. Mentored, no coding needed, and money-back guaranteed.",
  },
  referrals: {
    title: "My referrals",
    subtitle: "Track everyone you've recommended and what you've earned.",
  },
  faq: {
    title: "Frequently asked questions",
    subtitle: "How referrals, bonuses, and payouts work.",
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
  const { pendingCount, enrollments, totalEarned } = useMemo(() => {
    const by = (s: string) => referrals.filter((r) => r.status === s).length;
    const locked = referrals.filter((r) => r.status === "confirmed" || r.status === "paid");
    const total = locked.reduce((sum, r) => sum + toGuruCurrency(r.reward, r.currency), 0);
    return {
      pendingCount: by("sent") + by("contacted"),
      enrollments: by("enrolled") + by("confirmed") + by("paid"),
      totalEarned: fmtMoney(total, GURU_CURRENCY),
    };
  }, [referrals]);

  // First-run: nothing sent and nothing in the pipeline → show a getting-started
  // card instead of a dead "₹0 / 0 / 0" hero. The first referral flips this off.
  const noActivity = enrollments === 0 && pendingCount === 0;

  const tabs: { label: string; value: RecommendTab }[] = [
    { label: "Programs", value: "programs" },
    { label: "My referrals", value: "referrals" },
    { label: "FAQ", value: "faq" },
  ];

  return (
    <>
      <MobilePageHeader title="Recommend" />

      {/* ── Hero — membership KPI cards ─────────────────────────────── */}
      <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mb: 1.75 }}>
        <WorkspacePremiumOutlinedIcon sx={{ fontSize: 16, color: "primary.main" }} />
        <Typography sx={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", color: "primary.main" }}>
          GL GURU COLLECTIVE
        </Typography>
      </Stack>

      {noActivity ? (
        /* ── First-run getting-started card ─────────────────────────── */
        <Box
          sx={{
            position: "relative",
            overflow: "hidden",
            borderRadius: "20px",
            border: "1px solid",
            borderColor: (t) => alpha(t.palette.primary.main, 0.16),
            bgcolor: (t) => alpha(t.palette.primary.main, 0.04),
            p: { xs: 2.5, sm: 3 },
            mb: 2.5,
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
          <Typography sx={{ fontSize: { xs: 20, sm: 22 }, fontWeight: 800, letterSpacing: "-0.02em" }}>
            Start earning with your network
          </Typography>
          <Typography sx={{ mt: 0.75, mb: 2.5, fontSize: 14, color: "text.secondary", maxWidth: 560, lineHeight: 1.55 }}>
            Recommend an AI-Native Professional program — when someone enrolls with your link or code, you earn up to
            20% of the program fee.
          </Typography>

          {/* how it works */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
              gap: { xs: 1.75, sm: 2 },
            }}
          >
            {(
              [
                { icon: IosShareOutlinedIcon, step: "1", title: "Share a program", sub: "Send your personalised link or code" },
                { icon: PeopleAltOutlinedIcon, step: "2", title: "They enroll", sub: "Your learner joins a cohort" },
                { icon: AccountBalanceWalletOutlinedIcon, step: "3", title: "You earn", sub: "Up to 20% after they complete" },
              ] as { icon: ComponentType<SvgIconProps>; step: string; title: string; sub: string }[]
            ).map((s) => (
              <Stack key={s.step} direction="row" alignItems="flex-start" spacing={1.25}>
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
                  <s.icon sx={{ fontSize: 20 }} />
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={{ fontSize: 14, fontWeight: 700, lineHeight: 1.3 }}>
                    <Box component="span" sx={{ color: "primary.main", mr: 0.5, ...TABULAR }}>
                      {s.step}
                    </Box>
                    {s.title}
                  </Typography>
                  <Typography sx={{ fontSize: 12.5, color: "text.secondary", lineHeight: 1.4 }}>{s.sub}</Typography>
                </Box>
              </Stack>
            ))}
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
            gap: 2,
            mb: 2.5,
          }}
        >
          {(
            [
              {
                icon: AccountBalanceWalletOutlinedIcon,
                title: "Earnings",
                value: totalEarned,
                unit: "this year",
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
              <Stack direction="row" alignItems="baseline" spacing={0.75}>
                <Typography
                  sx={{ fontSize: { xs: 28, sm: 32 }, fontWeight: 800, lineHeight: 1, letterSpacing: "-0.02em", ...TABULAR }}
                >
                  {c.value}
                </Typography>
                <Typography sx={{ fontSize: 13, color: "text.secondary" }}>{c.unit}</Typography>
              </Stack>
            </Box>
          ))}
        </Box>
      )}

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
