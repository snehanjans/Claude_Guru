import type {
  AmbassadorProgram,
  AmbassadorReferral,
  BroadcastAsset,
  AmbassadorWebinar,
} from "@/lib/types";

// ─── GL Guru Collective / Recommend demo data (self-contained mock, no Redux slice) ─

/** Flat per-enrollment bonus for university certificates (refer-only). */
export const UNIVERSITY_FLAT_USD = 150;
export const UNIVERSITY_FLAT_INR = 15000;

/** GL AINP percentage bonus by learner checkout path. */
export const AINP_PCT_SELF_CHECKOUT = 20;
export const AINP_PCT_ASSISTED = 10;

/** Lifetime learners impacted — the Profile "LEARNERS IMPACTED" figure; also fills
    the [N learners mentored] token in social-media-kit templates. */
export const GURU_LEARNERS_IMPACTED = 7332;

/** The guru's referral id — rides on the share link as ?ref=<GURU_REF> for
    attribution. Distinct from the learner-facing promo code (per program). */
export const GURU_REF = "shome";

/** The guru's payout display currency (demo guru is India-based). Referral bonuses are
    still earned in each learner's currency; aggregates convert into this one at FX_USD_TO_INR. */
export const GURU_CURRENCY: "USD" | "INR" = "INR";
export const FX_USD_TO_INR = 84;
export const toGuruCurrency = (amount: number, currency: "USD" | "INR"): number =>
  currency === GURU_CURRENCY
    ? amount
    : GURU_CURRENCY === "INR"
      ? Math.round(amount * FX_USD_TO_INR)
      : Math.round(amount / FX_USD_TO_INR);

/** Full trackable referral URL — the Guru's per-program code rides along as a UTM campaign. */
export const REFERRAL_BASE = "https://www.mygreatlearning.com/";
export const referralLinkFor = (code: string) =>
  `${REFERRAL_BASE}?utm_source=guru&utm_medium=referral&utm_campaign=${code}`;

/** Registration link for a guru-run webinar — attribution rides on the guru's program code. */
export const webinarRegLinkFor = (webinarId: string, code: string) =>
  `https://www.mygreatlearning.com/webinar/${webinarId}?utm_source=guru&utm_medium=webinar&utm_campaign=${code}`;

/** GL-owned marketing webinar deck the guru personalises (mock). */
export const GL_WEBINAR_DECK = "https://www.mygreatlearning.com/gl-collective/webinar-deck";

export const demoAmbassadorPrograms: AmbassadorProgram[] = [
  {
    id: "ai-native-professional",
    scholarshipCode: "AINP20OFF",
    scholarshipPct: 20,
    earningModel: "percentage",
    bonusPctSelfCheckout: AINP_PCT_SELF_CHECKOUT,
    bonusPctAssisted: AINP_PCT_ASSISTED,
    payoutTiming: "Paid after course completion",
    title: "AI-Native Professional: Workflows and Agents for Productivity",
    university: "Great Learning",
    family: "gl",
    oneLiner: "Automate everyday work with AI agents",
    durationLabel: "6 Weeks",
    mode: "Mentored",
    price: 999,
    priceInr: 50000,
    nextCohortYmd: "2026-08-17",
    audienceLine: "Best for: professionals automating everyday workflows with AI",
    curriculum: [
      "AI-native work habits",
      "Prompt workflows that scale",
      "No-code agent builders",
      "Automating repetitive tasks",
      "Connecting tools & data sources",
      "Measuring productivity gains",
    ],
    prerequisites: ["No coding required"],
    hasTechnicalPrereq: false,
    isNew: true,
    blurb:
      "A 6-week mentored program on using AI agents and no-code tools to automate everyday professional work. Comes with a money-back guarantee.",
    message:
      "I'm mentoring on Great Learning's AI-Native Professional program and it's the most practical way I've seen to actually put AI agents to work in your day-to-day. It's mentored, hands-on, and backed by a money-back guarantee. Happy to answer any questions.",
  },
  {
    id: "ainp-hr",
    scholarshipCode: "AINPHR20OFF",
    scholarshipPct: 20,
    earningModel: "percentage",
    bonusPctSelfCheckout: AINP_PCT_SELF_CHECKOUT,
    bonusPctAssisted: AINP_PCT_ASSISTED,
    payoutTiming: "Paid after course completion",
    title: "AI-Native Professional: Workflows & Agents for HR Productivity",
    university: "Great Learning",
    family: "gl",
    oneLiner: "Automate recurring HR work with AI",
    durationLabel: "6 Weeks",
    mode: "Mentored",
    price: 999,
    priceInr: 50000,
    nextCohortYmd: "2026-08-31",
    audienceLine: "Best for: HR business partners, talent acquisition, and L&D professionals",
    curriculum: [
      "AI foundations & prompt engineering",
      "Workforce analytics & attrition prediction",
      "Personalized onboarding workflows",
      "No-code automation of HR processes",
      "AI agents with human review",
      "Responsible AI & governance",
    ],
    prerequisites: ["No coding required"],
    hasTechnicalPrereq: false,
    isNew: true,
    blurb:
      "A 6-week mentored program on building AI agents and no-code workflows that automate recurring HR work — with governance and human oversight. Comes with a money-back guarantee.",
    message:
      "If you work in HR, Great Learning's AI-Native Professional for HR is the most practical way I've seen to put AI agents to work on recurring HR tasks — mentored, hands-on, and no coding required. Happy to answer any questions.",
  },
  {
    id: "ainp-marketing",
    scholarshipCode: "AINPMKT20OFF",
    scholarshipPct: 20,
    earningModel: "percentage",
    bonusPctSelfCheckout: AINP_PCT_SELF_CHECKOUT,
    bonusPctAssisted: AINP_PCT_ASSISTED,
    payoutTiming: "Paid after course completion",
    title: "AI-Native Professional: Workflows & Agents for Marketing Productivity",
    university: "Great Learning",
    family: "gl",
    oneLiner: "Automate marketing work with AI agents",
    durationLabel: "6 Weeks",
    mode: "Mentored",
    price: 999,
    priceInr: 50000,
    nextCohortYmd: "2026-09-14",
    audienceLine: "Best for: content, performance, brand, and social-media marketers",
    curriculum: [
      "AI foundations & brand-voice prompts",
      "AI-powered market & competitor research",
      "Campaign analytics & dashboards",
      "No-code marketing automations",
      "Agents for performance & competitive signals",
      "Capstone: ship an AI workflow",
    ],
    prerequisites: ["No coding required"],
    hasTechnicalPrereq: false,
    isNew: true,
    blurb:
      "A 6-week mentored program on building AI agents and no-code workflows that automate recurring marketing work — research, content, campaigns, and reporting — without writing code.",
    message:
      "For marketers, Great Learning's AI-Native Professional for Marketing is a hands-on, mentored path to automating campaigns, research, and reporting with AI — no coding. Ping me if you'd like details.",
  },
  {
    id: "ainp-finance",
    scholarshipCode: "AINPFIN20OFF",
    scholarshipPct: 20,
    earningModel: "percentage",
    bonusPctSelfCheckout: AINP_PCT_SELF_CHECKOUT,
    bonusPctAssisted: AINP_PCT_ASSISTED,
    payoutTiming: "Paid after course completion",
    title: "AI-Native Professional: Workflows & Agents for Finance Productivity",
    university: "Great Learning",
    family: "gl",
    oneLiner: "Automate finance work with AI agents",
    durationLabel: "6 Weeks",
    mode: "Mentored",
    price: 999,
    priceInr: 50000,
    nextCohortYmd: "2026-09-28",
    audienceLine: "Best for: analysts, accountants, controllers, tax specialists, and auditors",
    curriculum: [
      "AI literacy & prompt engineering",
      "Regulatory research pipelines",
      "AI-assisted financial modeling",
      "No-code automation with validation",
      "Agents & responsible-AI governance",
      "Capstone: ship an AI workflow",
    ],
    prerequisites: ["No coding required"],
    hasTechnicalPrereq: false,
    isNew: true,
    blurb:
      "A 6-week mentored program on building AI agents and no-code workflows that automate recurring finance work — reporting, analysis, and compliance monitoring — with human validation.",
    message:
      "For finance teams, Great Learning's AI-Native Professional for Finance is a mentored, hands-on way to automate reporting, analysis, and compliance with AI agents — no coding. Reach out if you're curious.",
  },
  {
    id: "pg-ai-ml",
    scholarshipCode: "shome-aiml-gl",
    scholarshipPct: 12,
    earningModel: "flat",
    flatBonusUsd: UNIVERSITY_FLAT_USD,
    flatBonusInr: UNIVERSITY_FLAT_INR,
    payoutTiming: "Paid one month after course start",
    title: "PG Program in Artificial Intelligence & Machine Learning",
    university: "McCombs School of Business, UT Austin",
    family: "university",
    oneLiner: "Master AI & ML end to end",
    durationLabel: "12 Months",
    mode: "Online",
    price: 4500,
    nextCohortYmd: "2026-09-14",
    audienceLine: "Best for: professionals building a deep, long-term AI/ML career",
    curriculum: [
      "Foundations of machine learning",
      "Deep learning & neural networks",
      "Natural language processing",
      "Computer vision",
      "MLOps & deployment",
      "Capstone project",
    ],
    prerequisites: ["Comfortable with Python", "Basic statistics"],
    hasTechnicalPrereq: true,
    blurb:
      "A 12-month deep dive into machine learning, deep learning, and production AI — the #1 ranked AI program, with McCombs School of Business faculty.",
    message:
      "If you want to go deep on AI and ML with a top-ranked credential, the PG Program in AI & Machine Learning from McCombs (UT Austin) is hard to beat. I mentor on it and can vouch for the rigour. Let me know if you'd like the syllabus.",
  },
  {
    id: "epgd-ai-ds",
    scholarshipCode: "shome-epgd-gl",
    scholarshipPct: 15,
    earningModel: "flat",
    flatBonusUsd: UNIVERSITY_FLAT_USD,
    flatBonusInr: UNIVERSITY_FLAT_INR,
    payoutTiming: "Paid one month after course start",
    title: "e-Postgraduate Diploma (ePGD) in Artificial Intelligence and Data Science",
    university: "IIT Bombay",
    family: "university",
    oneLiner: "Earn an IIT Bombay AI diploma",
    durationLabel: "18 months",
    mode: "Online",
    price: 5000,
    nextCohortYmd: "2026-09-28",
    audienceLine: "Best for: engineers pursuing a formal AI & data science credential",
    curriculum: [
      "Mathematics for AI",
      "Machine learning",
      "Deep learning",
      "Data engineering",
      "AI systems at scale",
      "Industry capstone",
    ],
    prerequisites: ["Bachelor's in a technical field", "Programming familiarity"],
    hasTechnicalPrereq: true,
    blurb:
      "An 18-month postgraduate diploma in AI and data science, taught by IIT Bombay faculty.",
    message:
      "For anyone wanting a formal, faculty-taught AI credential, IIT Bombay's e-Postgraduate Diploma in AI & Data Science is a serious option. I mentor learners through it and can walk you through the structure. Happy to share more.",
  },
  {
    id: "ai-pg-leaders",
    scholarshipCode: "shome-leaders-gl",
    scholarshipPct: 18,
    earningModel: "flat",
    flatBonusUsd: UNIVERSITY_FLAT_USD,
    flatBonusInr: UNIVERSITY_FLAT_INR,
    payoutTiming: "Paid one month after course start",
    title: "Artificial Intelligence PG Program for Leaders",
    university: "McCombs School of Business, UT Austin",
    family: "university",
    oneLiner: "Lead AI strategy without coding",
    durationLabel: "5 Months",
    mode: "Online · Weekend",
    price: 3000,
    nextCohortYmd: "2026-08-24",
    audienceLine: "Best for: managers and leaders shaping AI strategy",
    curriculum: [
      "AI landscape for leaders",
      "Building an AI roadmap",
      "Data strategy & governance",
      "Responsible AI",
      "Measuring AI ROI",
    ],
    prerequisites: ["No programming experience required"],
    hasTechnicalPrereq: false,
    blurb:
      "A 5-month weekend program for leaders on AI strategy, governance, and ROI — no programming experience required, with McCombs (UT Austin) faculty.",
    message:
      "For leaders trying to make sense of AI beyond the hype, McCombs' AI PG Program for Leaders cuts straight to strategy, governance, and ROI — and needs no coding. I mentor on it and it's refreshingly practical. Let me know if you'd like details.",
  },
  {
    id: "no-code-agentic-ai",
    scholarshipCode: "shome-nocode-gl",
    scholarshipPct: 15,
    earningModel: "flat",
    flatBonusUsd: UNIVERSITY_FLAT_USD,
    flatBonusInr: UNIVERSITY_FLAT_INR,
    payoutTiming: "Paid one month after course start",
    title: "No Code and Agentic AI",
    university: "MIT Professional Education",
    family: "university",
    oneLiner: "Build agentic AI without code",
    durationLabel: "14 weeks",
    mode: "Online",
    price: 3200,
    nextCohortYmd: "2026-09-07",
    audienceLine: "Best for: professionals building agentic AI solutions without code",
    curriculum: [
      "Agentic AI foundations",
      "No-code agent platforms",
      "Designing multi-step agents",
      "Tool & API integration",
      "Evaluating agent reliability",
    ],
    prerequisites: ["No coding required"],
    hasTechnicalPrereq: false,
    isNew: true,
    blurb:
      "A 14-week program from MIT Professional Education on building agentic AI systems using no-code tools — learn directly from MIT faculty.",
    message:
      "MIT Professional Education's No Code and Agentic AI program is the clearest path I've found to building real agentic systems without writing code — and you learn from MIT faculty. I mentor learners through it. Reach out if you're curious.",
  },
];

// Rewards are per-referral in the learner's currency. AINP pays 20% (self-checkout) or
// 10% (assisted) of net cost: USD net ~$399 → $80/$40 (flagship $900 → $180/$90);
// INR net ~₹50,000 → ₹10,000/₹5,000. "not_converted" = the LC reached out but the
// learner never enrolled — no bonus is due.
export const demoAmbassadorReferrals: AmbassadorReferral[] = [
  { id: "ref-01", learner: "Ananya Rao", learnerCountry: "India", programId: "ainp-hr", dateYmd: "2026-06-24", status: "confirmed", currency: "INR", conversionPath: "self_checkout", reward: 10000 },
  { id: "ref-02", learner: "Vikram Nair", learnerCountry: "United States", programId: "ai-native-professional", dateYmd: "2026-06-21", status: "confirmed", currency: "USD", conversionPath: "self_checkout", reward: 200 },
  { id: "ref-03", learner: "Sneha Kulkarni", learnerCountry: "India", programId: "ainp-marketing", dateYmd: "2026-06-19", status: "confirmed", currency: "INR", conversionPath: "assisted", reward: 5000 },
  { id: "ref-04", learner: "Daniel Whitmore", learnerCountry: "United States", programId: "ainp-finance", dateYmd: "2026-06-17", status: "confirmed", currency: "USD", conversionPath: "assisted", reward: 100 },
  { id: "ref-05", learner: "Karthik Iyer", learnerCountry: "Singapore", programId: "ainp-marketing", dateYmd: "2026-05-28", status: "paid", currency: "USD", conversionPath: "self_checkout", reward: 200, paidYmd: "2026-06-28" },
  { id: "ref-06", learner: "Meera Joshi", learnerCountry: "India", programId: "ai-native-professional", dateYmd: "2026-05-22", status: "paid", currency: "INR", conversionPath: "self_checkout", reward: 10000, paidYmd: "2026-06-22" },
  { id: "ref-07", learner: "Arjun Sharma", learnerCountry: "UAE", programId: "ainp-hr", dateYmd: "2026-06-27", status: "enrolled", currency: "USD", conversionPath: "assisted", reward: 100, cohortYmd: "2026-08-31" },
  { id: "ref-08", learner: "Priya Desai", learnerCountry: "India", programId: "ainp-finance", dateYmd: "2026-07-01", status: "enrolled", currency: "INR", conversionPath: "self_checkout", reward: 10000, cohortYmd: "2026-09-28" },
  { id: "ref-09", learner: "Sanjay Gupta", learnerCountry: "India", programId: "ainp-marketing", dateYmd: "2026-07-03", status: "contacted", currency: "INR", conversionPath: "assisted", reward: 5000 },
  { id: "ref-10", learner: "Emily Carter", learnerCountry: "United States", programId: "ai-native-professional", dateYmd: "2026-07-05", status: "sent", currency: "USD", reward: 0 },
  { id: "ref-11", learner: "Rohan Pillai", learnerCountry: "India", programId: "ainp-hr", dateYmd: "2026-07-06", status: "sent", currency: "INR", reward: 0 },
  {
    id: "ref-12",
    learner: "Aditya Bose", learnerCountry: "United Kingdom",
    programId: "ai-native-professional",
    dateYmd: "2026-06-05",
    status: "not_eligible",
    currency: "USD",
    reward: 0,
    notEligibleReason: "Already an active GL lead — the enquiry pre-dates your referral",
  },
  // ── Contacted by GL, but never converted (no bonus due) ──
  {
    id: "ref-13",
    learner: "Farhan Qureshi", learnerCountry: "India",
    programId: "ainp-finance",
    dateYmd: "2026-06-12",
    status: "not_converted",
    currency: "INR",
    conversionPath: "assisted",
    reward: 0,
    notConvertedReason: "Spoke with the LC twice — budget approval didn't come through",
  },
  {
    id: "ref-14",
    learner: "Lauren Mitchell", learnerCountry: "United States",
    programId: "ainp-marketing",
    dateYmd: "2026-06-30",
    status: "not_converted",
    currency: "USD",
    conversionPath: "assisted",
    reward: 0,
    notConvertedReason: "Chose a self-paced alternative after the LC call",
  },
  {
    id: "ref-15",
    learner: "Deepika Reddy", learnerCountry: "India",
    programId: "ainp-hr",
    dateYmd: "2026-07-08",
    status: "not_converted",
    currency: "INR",
    conversionPath: "assisted",
    reward: 0,
    notConvertedReason: "Went quiet after the pricing discussion",
  },
];

export const demoBroadcastCollateral: BroadcastAsset[] = [
  {
    id: "asset-01",
    label: "LinkedIn post",
    caption:
      "I've mentored [N learners mentored] learners into AI roles. If you're figuring out how to start with AI, [program name] is worth a look. Happy to talk it through. Use [scholarship code] for [percent off]% off.",
  },
  {
    id: "asset-02",
    label: "WhatsApp broadcast",
    caption:
      "I've mentored [N learners mentored] learners into AI roles, so I get asked this a lot: how do I actually start with AI? My honest answer these days is [program name]. It's hands-on, short, and built for exactly that starting point. If you're curious, here's [percent off]% off with [scholarship code]. Happy to talk you through it if you want a second opinion first.",
  },
  {
    id: "asset-03",
    label: "Email intro",
    caption:
      "Hi [first name],\nI've mentored [N learners mentored] learners into AI roles at this point, and one question keeps coming up from people just starting out: where do you actually begin?\nLately my answer has been [program name], Great Learning's program for becoming AI-native. It's short, hands-on, and built for exactly that first step, not a long theory-heavy course.\nIf it's useful, here's [percent off]% off with code [scholarship code].\nHappy to talk it through if you want a second opinion before deciding.\n[Your name]",
  },
  {
    id: "asset-04",
    label: "Instagram story",
    caption:
      "\"Where do I even start with AI?\" That's the question I get most. My answer lately has been [program name]. Hands-on, beginner-friendly, built to get you working with AI, not just reading about it. [percent off]% off with code [scholarship code].",
  },
];


// Guru-run live webinars for AINP (GL family) programs — university programs don't have these.
export const demoAmbassadorWebinars: AmbassadorWebinar[] = [
  {
    id: "web-01",
    programId: "ai-native-professional",
    title: "Getting Real Work Done with AI Agents",
    dateYmd: "2026-06-25",
    start: 1110, // 6:30 PM
    end: 1170, // 7:30 PM
    description: "A live walkthrough of automating everyday tasks with no-code AI agents.",
    status: "completed",
    registered: 214,
    attended: 131,
  },
  {
    id: "web-02",
    programId: "ai-native-professional",
    title: "AI-Native 101: Automate Your Week",
    dateYmd: "2026-08-05",
    start: 1140, // 7:00 PM
    end: 1200, // 8:00 PM
    description: "An intro session on building your first AI agent workflow before the next cohort.",
    status: "scheduled",
    registered: 128,
  },
  {
    id: "web-03",
    programId: "ainp-hr",
    title: "AI for HR Teams: From Screening to Onboarding",
    dateYmd: "2026-08-12",
    start: 1080, // 6:00 PM
    end: 1140, // 7:00 PM
    description: "How HR business partners can use AI agents for screening, onboarding, and attrition analysis.",
    status: "scheduled",
    registered: 86,
  },
  {
    id: "web-04",
    programId: "ainp-marketing",
    title: "Marketing on Autopilot: Agents for Campaign Work",
    dateYmd: "2026-08-20",
    start: 1140, // 7:00 PM
    end: 1200, // 8:00 PM
    description: "A preview of no-code agent workflows for campaign research, content, and reporting.",
    status: "draft",
    registered: 0,
  },
];
