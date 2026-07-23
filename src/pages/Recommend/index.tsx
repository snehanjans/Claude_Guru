import { useMemo } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/material/styles";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import { MobilePageHeader } from "@/components/layout/MobilePageHeader";
import { fmtMoney } from "@/lib/helpers";
import { GURU_CURRENCY, toGuruCurrency } from "@/data/demo-ambassador";
import { useRecommend, type RecommendTab } from "./RecommendContext";
import { ProgramsSection } from "./sections/Programs";
import { MyReferralsSection } from "./sections/MyReferrals";
import { FaqSection } from "./sections/Faq";

const TABULAR = { fontVariantNumeric: "tabular-nums" as const };

// Provider + flow dialog live in App.tsx's RecommendScope, shared with the
// program-detail route so referrals survive navigation between the two.
export default function RecommendPage() {
  const { referrals, activeTab, setActiveTab } = useRecommend();

  // ── Derived referral stats (live off context referrals) ──
  // Bonuses are earned in each learner's currency; the hero shows ONE total,
  // converted into the guru's own payout currency.
  // Enrollments = learners who actually enrolled (enrolled → confirmed → paid);
  // Confirmed = payout confirmed or paid; Pending = still being worked (sent / contacted).
  const { confirmedCount, pendingCount, enrollments, totalEarned } = useMemo(() => {
    const enrolled = referrals.filter(
      (r) => r.status === "enrolled" || r.status === "confirmed" || r.status === "paid",
    );
    const locked = enrolled.filter((r) => r.status === "confirmed" || r.status === "paid");
    const pending = referrals.filter((r) => r.status === "sent" || r.status === "contacted");
    const total = locked.reduce((sum, r) => sum + toGuruCurrency(r.reward, r.currency), 0);
    return {
      confirmedCount: locked.length,
      pendingCount: pending.length,
      enrollments: enrolled.length,
      totalEarned: fmtMoney(total, GURU_CURRENCY),
    };
  }, [referrals]);

  const tabs: { label: string; value: RecommendTab }[] = [
    { label: "Programs", value: "programs" },
    { label: "My referrals", value: "referrals" },
    { label: "FAQ", value: "faq" },
  ];

  return (
    <>
      <MobilePageHeader title="Recommend" />

      {/* ── Hero — membership spotlight (light) ─────────────────────── */}
      <Card
        variant="outlined"
        sx={{
          borderRadius: "20px",
          mb: 2.5,
          borderColor: (t) => alpha(t.palette.primary.main, 0.16),
          bgcolor: (t) => alpha(t.palette.primary.main, 0.04),
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* soft brand corner glow (single-hue, low alpha — not neon) */}
        <Box
          aria-hidden
          sx={{
            position: "absolute",
            top: -80,
            right: -60,
            width: 260,
            height: 260,
            borderRadius: "50%",
            background: (t) => `radial-gradient(closest-side, ${alpha(t.palette.primary.main, 0.08)}, transparent)`,
            pointerEvents: "none",
          }}
        />
        <CardContent sx={{ p: { xs: 2.5, sm: 3 }, "&:last-child": { pb: { xs: 2.5, sm: 3 } } }}>
          <Box sx={{ minWidth: 0 }}>
            <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mb: 1.25 }}>
              <WorkspacePremiumOutlinedIcon sx={{ fontSize: 16, color: "primary.main" }} />
              <Typography sx={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", color: "primary.main" }}>
                GL GURU COLLECTIVE
              </Typography>
            </Stack>

            <Typography
              sx={{ fontSize: { xs: 34, sm: 46 }, fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.03em", ...TABULAR }}
            >
              {totalEarned}
            </Typography>
            <Typography sx={{ mt: 0.75, fontSize: 13.5, color: "text.secondary" }}>
              earned this year · {confirmedCount} confirmed enrollments
            </Typography>

            {/* inline stats — divided, not boxed */}
            <Stack
              direction="row"
              spacing={2.5}
              sx={{ mt: 2, "& > *:not(:first-of-type)": { pl: 2.5, borderLeft: "1px solid", borderColor: "divider" } }}
            >
              {[
                { k: "Enrollments", v: String(enrollments) },
                { k: "Confirmed", v: String(confirmedCount) },
                { k: "Pending", v: String(pendingCount) },
              ].map((s) => (
                <Box key={s.k}>
                  <Typography sx={{ fontSize: 20, fontWeight: 700, lineHeight: 1.1, ...TABULAR }}>{s.v}</Typography>
                  <Typography sx={{ fontSize: 11, color: "text.secondary" }}>{s.k}</Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        </CardContent>
      </Card>

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
        {activeTab === "programs" && <ProgramsSection />}
        {activeTab === "referrals" && <MyReferralsSection />}
        {activeTab === "faq" && <FaqSection />}
      </Box>
    </>
  );
}
