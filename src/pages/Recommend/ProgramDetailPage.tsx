import { useEffect, useState, type ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Backdrop from "@mui/material/Backdrop";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/material/styles";
import type { SxProps, Theme } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import LinkOutlinedIcon from "@mui/icons-material/LinkOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import InstagramIcon from "@mui/icons-material/Instagram";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import ZoomOutMapRoundedIcon from "@mui/icons-material/ZoomOutMapRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import VerifiedIcon from "@mui/icons-material/Verified";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ThumbUpRoundedIcon from "@mui/icons-material/ThumbUpRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import RepeatRoundedIcon from "@mui/icons-material/RepeatRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import DoneAllRoundedIcon from "@mui/icons-material/DoneAllRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import type { SvgIconComponent } from "@mui/icons-material";
import { fmtDateNice, fmtUsd } from "@/lib/helpers";
import {
  demoAmbassadorPrograms,
  demoBroadcastCollateral,
  REFERRAL_BASE,
  GURU_REF,
  GURU_LEARNERS_IMPACTED,
} from "@/data/demo-ambassador";
import { useAppDispatch } from "@/store";
import { pushToast } from "@/store/slices/toastsSlice";
import { EmptyState } from "@/components/shared/EmptyState";

const EASE_OUT = "cubic-bezier(0.23, 1, 0.32, 1)";
const TABULAR = { fontVariantNumeric: "tabular-nums" as const };

/* Per-program share/meta image (og:image) shown in link previews. Drop the files
   into public/og/ with these names; missing files fall back to the brand gradient. */
const OG_IMAGE: Record<string, string> = {
  "ai-native-professional": "/og/ai-native-professional.png",
  "ainp-hr": "/og/ai-native-professional-for-hr.png",
  "ainp-marketing": "/og/ai-native-professional-for-marketing.png",
  "ainp-finance": "/og/ai-native-professional-for-finance.png",
};

/* Share-image thumbnail — renders the og:image, or a branded gradient if absent. */
function OgThumb({ src, label, sx }: { src?: string; label: string; sx?: SxProps<Theme> }) {
  const [err, setErr] = useState(false);
  const showImg = Boolean(src) && !err;
  return (
    <Box sx={{ overflow: "hidden", ...sx }}>
      {showImg ? (
        <Box
          component="img"
          src={src}
          alt=""
          onError={() => setErr(true)}
          sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      ) : (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "grid",
            placeItems: "center",
            textAlign: "center",
            px: 1,
            background: (t) => `linear-gradient(135deg, ${t.palette.primary.main}, ${alpha(t.palette.primary.main, 0.6)})`,
          }}
        >
          <Typography sx={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.1em", color: "#fff", lineHeight: 1.3 }}>
            {label}
          </Typography>
        </Box>
      )}
    </Box>
  );
}

/* Brand logo + colour shown next to each collateral's title. */
const PLATFORM_LOGO: Record<string, { icon: SvgIconComponent; color: string }> = {
  "asset-01": { icon: LinkedInIcon, color: "#0a66c2" },
  "asset-02": { icon: WhatsAppIcon, color: "#25d366" },
  "asset-03": { icon: EmailOutlinedIcon, color: "#ea4335" },
  "asset-04": { icon: InstagramIcon, color: "#e1306c" },
};

/* Placeholder media per collateral, sized to each platform's real image format. */
const COLLATERAL_MEDIA: Record<
  string,
  { icon: SvgIconComponent; ratio: string; size: string; centered?: boolean; maxWidth?: number }
> = {
  "asset-01": { icon: LinkedInIcon, ratio: "1.91 / 1", size: "1200 × 627" }, // LinkedIn post
  "asset-02": { icon: WhatsAppIcon, ratio: "1 / 1", size: "1080 × 1080", centered: true, maxWidth: 200 }, // WhatsApp
  "asset-03": { icon: EmailOutlinedIcon, ratio: "3 / 1", size: "600 × 200 banner" }, // Email header
  "asset-04": { icon: InstagramIcon, ratio: "9 / 16", size: "1080 × 1920", centered: true, maxWidth: 150 }, // IG story
};

/* Program brochure links (mygreatlearning.com). Programs without one fall back to
   their personalised program page. */
const BROCHURE_URLS: Record<string, string> = {
  "ai-native-professional": "https://www.mygreatlearning.com/brochures/ai-native-professional",
  "ainp-hr": "https://www.mygreatlearning.com/brochures/ai-native-professional-for-hr",
  "ainp-marketing": "https://www.mygreatlearning.com/brochures/ai-native-professional-for-marketing",
  "ainp-finance": "https://www.mygreatlearning.com/brochures/ai-native-professional-for-finance",
};

/* Each program's page URL. The Social Media Kit link appends UTM params
   (utm_campaign = the guru's code) so visits/enrollments attribute back. */
const PROGRAM_PAGE_URLS: Record<string, string> = {
  "ai-native-professional": "https://www.mygreatlearning.com/ai-native-professional",
  "ainp-hr": "https://www.mygreatlearning.com/ai-native-professional-for-hr",
  "ainp-marketing": "https://www.mygreatlearning.com/ai-native-professional-for-marketing",
  "ainp-finance": "https://www.mygreatlearning.com/ai-native-professional-for-finance",
};

/* Program-page FAQ per AINP program (from each program's mygreatlearning.com page),
   grouped as listed there. Learner-facing — distinct from the guru referral FAQ. */
type FaqGroup = { title: string; items: { q: string; a: string }[] };
const PROGRAM_FAQ: Record<string, FaqGroup[]> = {
  "ai-native-professional": [
  {
    title: "Program details",
    items: [
      {
        q: "How can working professionals use AI agents and workflow automation to reduce repetitive work and improve productivity?",
        a: "Working professionals can use AI agents and workflow automation to eliminate repetitive tasks, streamline daily operations, and focus more on strategic, high-value work. By combining AI tools with no-code automation platforms, professionals can automate reporting, research, email drafting, meeting summaries, document analysis, and cross-functional workflows. This structured 6-week online program takes you from basic AI usage to building and deploying autonomous AI agents through a hands-on, build-first approach.",
      },
      {
        q: "I have a full-time job. Can I realistically complete this without it taking over my personal life?",
        a: "Yes. The program is delivered entirely online through a combination of live expert sessions and project work. You should expect to spend approximately 3–4 hours per week.",
      },
      {
        q: "What happens if I miss a live session?",
        a: "All live sessions are recorded and made available within 24 hours. Live attendance is recommended for the build-along experience, but recordings let you stay on track.",
      },
      {
        q: "How long will I have access to the materials?",
        a: "You retain access to all learning and project files for one year after graduation, and you receive curriculum updates even after your term ends so you stay current with the latest AI tools.",
      },
      {
        q: "Will I receive a certificate?",
        a: "Yes. Upon successful completion you earn a Professional Certificate from Great Learning.",
      },
      {
        q: "How is this different from a typical AI automation course?",
        a: "It focuses on autonomous agents rather than just basic automation, follows a build-first “portfolio over paper” philosophy with functional weekly deliverables, teaches multi-tool orchestration (chaining tools like ChatGPT, Claude, Perplexity, NotebookLM, Activepieces, and Gamma), and prioritises transferable frameworks over fleeting features so your skills don't go stale as tools change.",
      },
    ],
  },
  {
    title: "Faculty, curriculum & projects",
    items: [
      {
        q: "Who will be teaching the program?",
        a: "The program is led by Dr. Pavankumar Gurazada, Director of Academics for AI at Great Learning.",
      },
      {
        q: "Which AI tools will I learn, and how do they work together?",
        a: "You'll take a tool-agnostic approach — no single ecosystem lock-in. Logic & drafting: ChatGPT, Claude, Gemini. Research: NotebookLM, Perplexity AI. Automation: Activepieces, Google Workspace. Production: Gamma, Google Vids, Lovable. You learn to chain these into real agentic systems.",
      },
      {
        q: "How do I build a portfolio in 6 weeks?",
        a: "Your portfolio grows weekly: Week 1 — a library of reliable prompt templates; Week 2 — a searchable knowledge base from your own documents; Week 3 — chained tools that turn one input into multiple outputs; Week 4 — a trigger-based system that monitors attachments, summarises, and posts to chat; Week 5 — a deployed agent that synthesises documents into a one-page brief; Week 6 — a capstone that solves a real pain point from your working life.",
      },
      {
        q: "What are the requirements for the capstone project?",
        a: "It must solve a real, recurring problem in your professional, academic, or personal life; be a functioning multi-step automated system (built on the Week 4 automation skills); include a live demonstration on Demo Day in Week 6; and follow the development timeline — you receive the brief in Week 4 and refine it with structured mentor guidance over three weeks.",
      },
    ],
  },
  {
    title: "Eligibility & admission",
    items: [
      {
        q: "I have no coding background. Is this course right for me?",
        a: "Yes. This is an AI automation course for beginners with zero coding requirements — designed to help anyone start building AI workflows and agents without prior technical experience.",
      },
      {
        q: "Can HR, Marketing, or Finance professionals take this course?",
        a: "Yes. It's designed for functional professionals across HR, Marketing, Finance, and Operations, with zero technical prerequisites. You apply each week's skills to your own professional context to solve real, everyday problems.",
      },
      {
        q: "When does the next cohort start?",
        a: "Cohorts run on a rolling schedule. Contact a Program Advisor for exact dates and to reserve your seat.",
      },
    ],
  },
  {
    title: "Fees & payment",
    items: [
      {
        q: "What is the cost of this course?",
        a: "The fee is $999 in the US or ₹50,000 + GST in India.",
      },
      {
        q: "Are there additional costs for the AI tools?",
        a: "Most tools covered have free tiers that support the coursework. Reach out to your Program Advisor for details on any additional tool costs.",
      },
      {
        q: "What if I'm not sure it's right for me before committing?",
        a: "There's a 2-week money-back guarantee. If, during the first two weeks, you decide the program isn't relevant to your role, productivity goals, or career objectives, you can request a full refund (100% back), subject to the applicable terms and conditions.",
      },
    ],
  },
  {
    title: "Career",
    items: [
      {
        q: "Will automating my own work make me more replaceable?",
        a: "Avoiding AI is increasingly the bigger career risk. Automating parts of your work raises your ability to operate at a higher strategic level. You graduate with a portfolio of working AI systems — tangible proof of the AI fluency 55% of leaders now expect as a baseline — and learn to showcase these projects to hiring managers in a dedicated career session.",
      },
      {
        q: "What will I actually build to automate tasks at work?",
        a: "You move beyond basic prompts to build agent-driven workflows that connect AI models with workplace tools like Gmail, Slack, and Google Sheets. Using no-code platforms like Activepieces, you create trigger-and-action workflows and combine tools such as Perplexity (live research) and NotebookLM (document analysis) to automate reporting, research, and communication — shipping a functional project every week.",
      },
    ],
  },
  {
    title: "General",
    items: [
      {
        q: "What are Agentic AI applications, and how are they used?",
        a: "Agentic AI applications are systems that plan, decide, and execute tasks autonomously. You'll learn to design agents for research automation, content generation, workflow execution, and decision support.",
      },
      {
        q: "Can I connect Gmail, Slack, and Google Sheets without writing any code?",
        a: "Yes. Using platforms like Activepieces with ChatGPT, you can build no-code workflows that summarise emails, update spreadsheets, generate reports, and send Slack notifications — running on triggers or schedules while you focus on higher-value work.",
      },
      {
        q: "Which AI tools should I learn first as a non-tech professional?",
        a: "Start with foundational tools like ChatGPT, Claude, and Gemini for prompting and everyday productivity. Then progress to research tools (NotebookLM, Perplexity), followed by no-code automation platforms (Activepieces, Google Workspace). The program's step-by-step approach builds you up to creating autonomous agents with no coding experience.",
      },
    ],
  },
  ],

  "ainp-hr": [
    {
      title: "Program details",
      items: [
        {
          q: "How long does it take to complete the program?",
          a: "About 30 hours over 6 weeks — roughly 4–5 hours per week, designed to fit around a full-time work schedule.",
        },
        {
          q: "Will I learn to build AI agents for HR operations?",
          a: "Yes. You'll construct practical agents for workforce monitoring, task automation, document creation, and decision support — each with mandatory human-review checkpoints before any employee-facing action.",
        },
        {
          q: "How can AI improve HR productivity?",
          a: "AI streamlines repetitive work like interview prep, performance documentation, onboarding communications, policy research, and workforce reporting, freeing HR teams to focus on strategic initiatives.",
        },
        {
          q: "Does the program cover AI candidate and CV screening?",
          a: "Yes. You build AI-assisted resume-evaluation workflows using consistent structured prompts, while final hiring decisions stay with HR professionals.",
        },
      ],
    },
    {
      title: "Curriculum & projects",
      items: [
        {
          q: "Which AI tools will HR professionals learn?",
          a: "Hands-on with ChatGPT, Claude, Gemini, NotebookLM, Gamma, Activepieces, Microsoft Excel, and Google Sheets for building HR workflows and automations.",
        },
        {
          q: "What projects will I complete?",
          a: "An HR Documentation Engine, Attrition Risk Analysis tool, Onboarding Intelligence Pack, HR Workflow Automation Suite, and Workforce Intelligence Agent — culminating in a capstone and a governance audit.",
        },
        {
          q: "Does the program cover AI in talent management?",
          a: "Yes — workforce analytics, attrition-risk assessment, employee development, onboarding, performance documentation, and workforce intelligence.",
        },
      ],
    },
    {
      title: "Eligibility & admission",
      items: [
        {
          q: "Is this suitable for HR professionals without coding experience?",
          a: "Yes. The curriculum emphasises no-code automation and workflow design using accessible tools that require no programming knowledge.",
        },
        {
          q: "Is it suitable for experienced HR professionals?",
          a: "Yes — it's tailored for HR domain experts looking to integrate AI into hiring, operations, engagement, and workforce management.",
        },
      ],
    },
    {
      title: "Fees & payment",
      items: [
        {
          q: "What is the program fee?",
          a: "$999 in the US or ₹50,000 + GST in India, with a 2-week money-back guarantee.",
        },
        {
          q: "What's included in the fee?",
          a: "Live sessions, hands-on projects, mentorship, learning support, feedback, and a Professional Certificate on completion. Most tools have free tiers; Claude needs a personal subscription.",
        },
      ],
    },
    {
      title: "Career & general",
      items: [
        {
          q: "Is AI replacing HR professionals?",
          a: "No. AI changes how HR work gets done rather than eliminating roles. The program emphasises human-in-the-loop practices — AI handles repetitive tasks while professionals make the people and compliance decisions.",
        },
        {
          q: "What roles does this support?",
          a: "HR Business Partners, Talent Acquisition specialists, HR Operations, L&D, People Analytics, Employee Relations, and HR leadership.",
        },
      ],
    },
  ],

  "ainp-marketing": [
    {
      title: "Program details",
      items: [
        {
          q: "Will learning AI agents actually improve my day-to-day marketing work?",
          a: "Yes. You'll automate repetitive tasks — like building agents that flag underperforming campaigns and streamlining competitor and market research — so you spend more time on strategy while AI handles execution and analysis.",
        },
        {
          q: "How does this differ from other AI agent courses for marketing?",
          a: "It's built specifically for marketers: marketing-specific learning across content, SEO, performance, email, brand, and market research, plus no-code AI agents and responsible-AI practices covering brand safety, copyright, and FTC compliance.",
        },
        {
          q: "How long is the program and what's the weekly commitment?",
          a: "6 weeks, about 30 hours total — roughly 4–5 hours per week, including live mentorship sessions.",
        },
        {
          q: "Can this help me create AI marketing campaigns?",
          a: "Yes — workflows spanning campaign planning, content creation, analytics, performance monitoring, and reporting.",
        },
      ],
    },
    {
      title: "Curriculum & projects",
      items: [
        {
          q: "Which AI tools do marketers actually use here?",
          a: "Claude, ChatGPT, and Gemini for content; Perplexity for research; Excel/Sheets for analysis; and Activepieces for workflow automation.",
        },
        {
          q: "What projects will I complete?",
          a: "Five hands-on projects plus a capstone: Brand Content Engine, Campaign Analytics & Action Intelligence, CMO Marketing Dashboard, Marketing Workflow Automation Suite, and a Campaign Performance Monitoring Agent.",
        },
        {
          q: "Will I learn AI agents for SEO and marketing?",
          a: "Yes — you'll build AI workflows that automate SEO content production, campaign analysis, and performance monitoring, and connect tools via Activepieces for reporting, email workflows, and competitive intelligence.",
        },
      ],
    },
    {
      title: "Eligibility & admission",
      items: [
        {
          q: "Do I need coding experience to build AI marketing agents?",
          a: "No. The program is designed for marketers with no programming background — you'll use no-code tools throughout.",
        },
        {
          q: "Can beginners in AI join?",
          a: "Yes. No prior AI or coding experience is required; the program starts with AI foundations.",
        },
      ],
    },
    {
      title: "Fees & payment",
      items: [
        {
          q: "What is the program fee?",
          a: "$999 in the US or ₹50,000 + GST in India, with a 2-week money-back guarantee.",
        },
        {
          q: "Do I need to buy AI software separately?",
          a: "Most tools used are available on free tiers. Claude requires your own subscription.",
        },
      ],
    },
    {
      title: "Career & general",
      items: [
        {
          q: "Will I build a portfolio during the program?",
          a: "Yes — every week you create reusable assets like prompt libraries, automation workflows, dashboards, and AI marketing agents.",
        },
        {
          q: "How will AI change the future of marketing?",
          a: "AI is shifting marketers from manual execution to AI-assisted decision-making. Professionals who combine marketing expertise with AI-powered workflows are better positioned for what's next.",
        },
      ],
    },
  ],

  "ainp-finance": [
    {
      title: "Program details",
      items: [
        {
          q: "What AI agents and finance workflows will I build?",
          a: "Practical assets including a Multi-Audience Variance Commentary Engine, Tax Law Research Intelligence Pack, Customer Revenue Intelligence Model, Invoice Processing Automation, and an Earnings Intelligence Agent — plus a capstone solving a real challenge from your own role, with a governance audit.",
        },
        {
          q: "How long is the program and what's the weekly commitment?",
          a: "6 weeks at roughly 4–5 hours per week, designed to fit a full-time schedule.",
        },
        {
          q: "Will I learn to build AI agents for finance teams?",
          a: "Yes — agents that automate reporting, research, invoice processing, and earnings monitoring, all with human-oversight mechanisms.",
        },
        {
          q: "How is this different from other AI agent courses for finance?",
          a: "It emphasises individual productivity with no-code tools rather than enterprise deployments. You leave each week with functional, reusable assets like research pipelines and intelligence agents.",
        },
      ],
    },
    {
      title: "Curriculum & projects",
      items: [
        {
          q: "Which AI finance tools are covered?",
          a: "ChatGPT, Claude, Gemini, Perplexity, NotebookLM, Activepieces, Microsoft Excel, and Google Sheets, applied to practical finance use cases.",
        },
        {
          q: "What real-world finance applications does it cover?",
          a: "Variance reporting, invoice-processing automation, customer revenue analysis, tax research, earnings intelligence, and AI-assisted financial communication.",
        },
        {
          q: "Does it cover modern agent-building frameworks?",
          a: "Yes — agentic AI, no-code automation, workflow design, Task-Context-Reference prompting, Retrieval-Augmented Generation, and human-in-the-loop governance.",
        },
      ],
    },
    {
      title: "Eligibility & admission",
      items: [
        {
          q: "Is this beginner-friendly for finance professionals with no coding experience?",
          a: "Yes. It explicitly targets non-programmers and requires no coding or complex-formula knowledge.",
        },
        {
          q: "Is prior AI knowledge required?",
          a: "No. It begins with AI fundamentals before advancing to workflow automation, agents, and finance-specific applications.",
        },
      ],
    },
    {
      title: "Fees & payment",
      items: [
        {
          q: "What is the program fee?",
          a: "$999 in the US or ₹50,000 + GST in India, with a 2-week money-back guarantee. Flexible payment and EMI options are available through program advisors.",
        },
        {
          q: "Does the program require paid AI software?",
          a: "Most activities use free tool versions. Claude requires a personal subscription.",
        },
      ],
    },
    {
      title: "Career & general",
      items: [
        {
          q: "Is accounting going to be replaced by AI?",
          a: "No. AI automates repetitive tasks while accountants provide professional judgment, regulatory interpretation, analysis, and strategic decisions. The program focuses on working effectively alongside AI, not replacement.",
        },
        {
          q: "How does AI improve finance productivity?",
          a: "It automates financial reporting, budgeting, variance analysis, invoice processing, research, audit documentation, and compliance monitoring — freeing you to concentrate on strategic decision-making.",
        },
      ],
    },
  ],
};

/* Small uppercase section header with a leading icon — used across the detail page. */
function SectionLabel({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
      {icon}
      <Typography
        sx={{
          fontSize: "0.72rem",
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "text.secondary",
          lineHeight: 1,
        }}
      >
        {children}
      </Typography>
    </Stack>
  );
}

/* ── Program detail page ──────────────────────────────────────────────── */
export default function ProgramDetailPage() {
  const { programId } = useParams<{ programId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [tab, setTab] = useState<"overview" | "collaterals" | "faq">("overview");
  const [faqExpanded, setFaqExpanded] = useState<string | false>("0-0");
  // Which collateral is expanded in the lightbox (asset id + label + filled caption), or null.
  const [lightbox, setLightbox] = useState<{ id: string; label: string; caption: string } | null>(
    null,
  );

  const program = demoAmbassadorPrograms.find((p) => p.id === programId) ?? null;
  // The guru shares a clean referral link — program page + ?ref=<guru id>. The
  // destination redirects it to the full utm_source/medium/campaign URL, so the
  // UTM params never surface. The learner-facing promo code is separate and
  // shared per program (program.scholarshipCode, e.g. AINP20OFF).
  const link = program ? `${PROGRAM_PAGE_URLS[program.id] ?? REFERRAL_BASE}?ref=${GURU_REF}` : "";

  // Reset to Overview whenever a different program opens.
  useEffect(() => {
    setTab("overview");
    setLightbox(null);
    setFaqExpanded("0-0");
  }, [programId]);

  if (!program) {
    return (
      <Box sx={{ maxWidth: 840, mx: "auto" }}>
        <EmptyState
          icon={<SchoolOutlinedIcon />}
          title="Program not found"
          subtitle="This program may have been removed or the link is out of date."
          action={
            <Button
              variant="contained"
              onClick={() => navigate("/recommend")}
              sx={{
                textTransform: "none",
                fontWeight: 700,
                borderRadius: "10px",
                transition: `transform 130ms ${EASE_OUT}`,
                "&:active": { transform: "scale(0.97)" },
                "@media (prefers-reduced-motion: reduce)": { "&:active": { transform: "none" } },
              }}
            >
              Back to programs
            </Button>
          }
        />
      </Box>
    );
  }

  // Fill a collateral template with this program's details (link appended for the copy payload).
  const fillCollateral = (caption: string) =>
    caption
      .replace(/\[program name\]/g, program.title)
      .replace(/\[start date\]/g, fmtDateNice(program.nextCohortYmd))
      .replace(/\[scholarship code\]/g, program.scholarshipCode)
      .replace(/\[percent off\]/g, String(program.scholarshipPct))
      .replace(/\[N learners mentored\]/g, GURU_LEARNERS_IMPACTED.toLocaleString("en-US"));

  // Same fill, but the actionable bits (program, start date, code, % off) render
  // bold for the on-screen preview. The copied text (via fillCollateral) stays plain.
  const renderCaption = (caption: string): ReactNode => {
    const parts = caption.split(
      /(\[program name\]|\[start date\]|\[scholarship code\]|\[percent off\]%|\[N learners mentored\]|\[first name\])/g,
    );
    const bold = (node: ReactNode, i: number) => (
      <Box key={i} component="span" sx={{ fontWeight: 700 }}>
        {node}
      </Box>
    );
    return parts.map((part, i) => {
      switch (part) {
        case "[program name]":
          return bold(program.title, i);
        case "[start date]":
          return bold(fmtDateNice(program.nextCohortYmd), i);
        case "[scholarship code]":
          return bold(program.scholarshipCode, i);
        case "[percent off]%":
          return bold(`${program.scholarshipPct}%`, i);
        case "[N learners mentored]":
          return GURU_LEARNERS_IMPACTED.toLocaleString("en-US");
        default:
          return part;
      }
    });
  };

  // Bold the actionable values inside an already-filled string (used for the
  // truncated LinkedIn preview text, where placeholders are already replaced).
  const renderRichText = (text: string): ReactNode => {
    const values = [
      program.title,
      fmtDateNice(program.nextCohortYmd),
      program.scholarshipCode,
      `${program.scholarshipPct}%`,
    ].filter(Boolean);
    const boldSet = new Set(values);
    const escaped = values.map((v) => v.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    const re = new RegExp(`(${escaped.join("|")})`, "g");
    return text.split(re).map((part, i) =>
      boldSet.has(part) ? (
        <Box key={i} component="span" sx={{ fontWeight: 700 }}>
          {part}
        </Box>
      ) : (
        part
      ),
    );
  };

  const copy = (key: string, value: string, description: string) => {
    navigator.clipboard.writeText(value);
    dispatch(pushToast({ title: "Copied", description }));
    setCopiedKey(key);
    window.setTimeout(() => setCopiedKey((k) => (k === key ? null : k)), 1600);
  };

  // Download the collateral image. No real creative in the demo, so we generate a
  // correctly-sized placeholder SVG and save it — a real asset would drop in here.
  const downloadImage = (assetId: string, label: string) => {
    const media = COLLATERAL_MEDIA[assetId];
    const m = media?.size.match(/(\d+)\s*[×x]\s*(\d+)/);
    const w = m ? Number(m[1]) : 1200;
    const h = m ? Number(m[2]) : 675;
    const svg =
      `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">` +
      `<rect width="100%" height="100%" fill="#eef2f7"/>` +
      `<text x="50%" y="46%" font-family="sans-serif" font-weight="700" font-size="${Math.round(Math.min(w, h) / 12)}" fill="#94a3b8" text-anchor="middle">${label}</text>` +
      `<text x="50%" y="58%" font-family="sans-serif" font-size="${Math.round(Math.min(w, h) / 20)}" fill="#cbd5e1" text-anchor="middle">${w} × ${h}</text>` +
      `</svg>`;
    const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `${program.id}-${assetId}.svg`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    dispatch(pushToast({ title: "Image downloaded", description: `${label} saved.` }));
  };

  type Collateral = { id: string; label: string; caption: string };

  // Per-platform hint shown in the message panel's info box.
  const INFO_TEXT: Record<string, string> = {
    "asset-01": "Copy this text and paste it into a new LinkedIn post.",
    "asset-02": "Copy this text and send it as a WhatsApp broadcast.",
    "asset-03": "Copy this text and paste it into your email.",
    "asset-04":
      "Add this caption as text to your story, then attach the link separately with the link sticker.",
  };

  // Shared right-hand "message to post" panel used by every collateral.
  const renderMessagePanel = (asset: Collateral, key: string, done: boolean, body: string) => (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        p: 2,
        borderRadius: "14px",
        border: "1px solid",
        borderColor: "divider",
        bgcolor: (t) => (t.palette.mode === "dark" ? "rgba(255,255,255,0.03)" : t.palette.grey[50]),
      }}
    >
      <Typography
        sx={{
          fontSize: "0.7rem",
          fontWeight: 700,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: "text.secondary",
          mb: 1,
        }}
      >
        Message to post
      </Typography>
      <Typography variant="body2" sx={{ lineHeight: 1.55, whiteSpace: "pre-line", color: "text.primary" }}>
        {renderCaption(asset.caption)}
      </Typography>
      <Typography
        variant="body2"
        sx={{ mt: 1, color: "primary.main", fontWeight: 600, wordBreak: "break-all", lineHeight: 1.45 }}
      >
        {link}
      </Typography>
      <Box sx={{ mt: "auto", pt: 2.5 }}>
        <Stack
          direction="row"
          spacing={1}
          sx={{
            p: 1.25,
            mb: 1.5,
            borderRadius: "10px",
            bgcolor: (t) => (t.palette.mode === "dark" ? "rgba(251,191,36,0.12)" : "rgba(217,119,6,0.09)"),
            border: "1px solid",
            borderColor: (t) => (t.palette.mode === "dark" ? "rgba(251,191,36,0.35)" : "rgba(217,119,6,0.28)"),
          }}
        >
          <InfoOutlinedIcon sx={{ fontSize: 18, color: "var(--gl-warning-icon)", flexShrink: 0, mt: "1px" }} />
          <Typography variant="body2" sx={{ fontSize: 13, lineHeight: 1.5, color: "text.secondary" }}>
            {INFO_TEXT[asset.id]}
          </Typography>
        </Stack>
        <Button
          fullWidth
          disableElevation
          startIcon={
            done ? <CheckRoundedIcon sx={{ fontSize: 18 }} /> : <ContentCopyOutlinedIcon sx={{ fontSize: 18 }} />
          }
          onClick={() => copy(key, body, `${asset.label} copied to clipboard.`)}
          sx={{
            py: 1,
            textTransform: "none",
            fontWeight: 700,
            borderRadius: "10px",
            color: done ? "success.main" : "primary.main",
            bgcolor: (t) =>
              done ? alpha(t.palette.success.main, 0.1) : alpha(t.palette.primary.main, 0.1),
            "&:hover": {
              bgcolor: (t) =>
                done ? alpha(t.palette.success.main, 0.16) : alpha(t.palette.primary.main, 0.16),
            },
            transition: `transform 130ms ${EASE_OUT}, background-color 130ms ${EASE_OUT}`,
            "&:active": { transform: "scale(0.99)" },
            "@media (prefers-reduced-motion: reduce)": { "&:active": { transform: "none" } },
          }}
        >
          {done ? "Copied" : "Copy text"}
        </Button>
      </Box>
    </Box>
  );

  // ── WhatsApp broadcast preview ──
  const renderWhatsApp = (asset: Collateral) => (
    <Box sx={{ borderRadius: "10px", overflow: "hidden", border: "1px solid", borderColor: "divider" }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ px: 1.25, py: 1, bgcolor: "#075e54", color: "#fff" }}>
        <Avatar sx={{ width: 32, height: 32, bgcolor: "rgba(255,255,255,0.2)", color: "#fff" }}>
          <PersonRoundedIcon sx={{ fontSize: 18 }} />
        </Avatar>
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontSize: 13, fontWeight: 700, lineHeight: 1.2 }}>Broadcast</Typography>
          <Typography sx={{ fontSize: 11, opacity: 0.8 }}>Broadcast list · 128 recipients</Typography>
        </Box>
      </Stack>
      <Box
        sx={{
          p: 1.5,
          minHeight: 220,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          bgcolor: (t) => (t.palette.mode === "dark" ? "#0b141a" : "#efeae2"),
        }}
      >
        <Box
          sx={{
            alignSelf: "flex-end",
            maxWidth: "92%",
            p: 1,
            borderRadius: "8px",
            borderTopRightRadius: 0,
            boxShadow: 1,
            bgcolor: (t) => (t.palette.mode === "dark" ? "#005c4b" : "#d9fdd3"),
            color: (t) => (t.palette.mode === "dark" ? "#e9edef" : "#111b21"),
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.75, p: 0.75, borderRadius: "6px", bgcolor: "rgba(0,0,0,0.06)" }}>
            <OgThumb src={OG_IMAGE[program.id]} label="GL" sx={{ width: 40, height: 40, flexShrink: 0, borderRadius: "4px" }} />
            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ fontSize: 11, fontWeight: 700, lineHeight: 1.25, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {program.title}
              </Typography>
              <Typography sx={{ fontSize: 10, opacity: 0.7 }}>mygreatlearning.com</Typography>
            </Box>
          </Stack>
          <Typography sx={{ fontSize: 13, lineHeight: 1.45 }}>{renderRichText(fillCollateral(asset.caption))}</Typography>
          <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={0.5} sx={{ mt: 0.25 }}>
            <Typography sx={{ fontSize: 10, opacity: 0.6 }}>12:24 PM</Typography>
            <DoneAllRoundedIcon sx={{ fontSize: 15, color: "#53bdeb" }} />
          </Stack>
        </Box>
      </Box>
    </Box>
  );

  // ── Email intro preview ──
  const renderEmail = (asset: Collateral) => (
    <Box sx={{ borderRadius: "10px", overflow: "hidden", border: "1px solid", borderColor: "divider", bgcolor: "background.paper" }}>
      <Box sx={{ p: 1.5, borderBottom: "1px solid", borderColor: "divider" }}>
        <Typography sx={{ fontSize: 15, fontWeight: 700, lineHeight: 1.3 }}>An AI program I think you&apos;d like</Typography>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1 }}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: (t) => alpha(t.palette.primary.main, 0.15), color: "primary.main" }}>
            <PersonRoundedIcon sx={{ fontSize: 18 }} />
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontSize: 13, fontWeight: 600, lineHeight: 1.2 }}>
              You{" "}
              <Box component="span" sx={{ color: "text.secondary", fontWeight: 400 }}>
                &lt;you@greatlearning.in&gt;
              </Box>
            </Typography>
            <Typography sx={{ fontSize: 12, color: "text.secondary" }}>to [first name]</Typography>
          </Box>
          <Typography sx={{ fontSize: 12, color: "text.secondary" }}>9:41 AM</Typography>
        </Stack>
      </Box>
      <Box sx={{ p: 1.5 }}>
        <Typography variant="body2" sx={{ lineHeight: 1.55, whiteSpace: "pre-line" }}>
          {renderCaption(asset.caption)}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1, color: "primary.main", fontWeight: 600, wordBreak: "break-all" }}>
          {link}
        </Typography>
      </Box>
    </Box>
  );

  // ── Instagram story preview ──
  const renderInstagram = (asset: Collateral) => (
    <Box
      sx={{
        mx: "auto",
        width: "100%",
        maxWidth: 250,
        aspectRatio: "9 / 16",
        borderRadius: "16px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        p: 1.5,
        color: "#fff",
        background: (t) => `linear-gradient(160deg, ${t.palette.primary.main}, #7c3aed 65%, #db2777)`,
      }}
    >
      <Stack direction="row" spacing={0.5} sx={{ mb: 1 }}>
        <Box sx={{ flex: 1, height: 2.5, borderRadius: 2, bgcolor: "rgba(255,255,255,0.85)" }} />
        <Box sx={{ flex: 1, height: 2.5, borderRadius: 2, bgcolor: "rgba(255,255,255,0.35)" }} />
      </Stack>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Avatar sx={{ width: 26, height: 26, border: "2px solid #fff", bgcolor: "rgba(255,255,255,0.25)", color: "#fff" }}>
          <PersonRoundedIcon sx={{ fontSize: 15 }} />
        </Avatar>
        <Typography sx={{ fontSize: 12, fontWeight: 700 }}>your_handle</Typography>
        <Typography sx={{ fontSize: 11, opacity: 0.85 }}>5h</Typography>
        <MoreHorizRoundedIcon sx={{ fontSize: 18, ml: "auto" }} />
      </Stack>
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", py: 2 }}>
        <Typography sx={{ fontSize: 15, fontWeight: 700, lineHeight: 1.4, textShadow: "0 1px 8px rgba(0,0,0,0.35)" }}>
          {renderRichText(fillCollateral(asset.caption))}
        </Typography>
      </Box>
      <Box
        sx={{
          alignSelf: "center",
          mb: 1.25,
          px: 1.25,
          py: 0.5,
          borderRadius: "999px",
          bgcolor: "#fff",
          color: "#111",
          display: "flex",
          alignItems: "center",
          gap: 0.5,
        }}
      >
        <LinkOutlinedIcon sx={{ fontSize: 14 }} />
        <Typography sx={{ fontSize: 11, fontWeight: 700 }}>mygreatlearning.com</Typography>
      </Box>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Box sx={{ flex: 1, border: "1px solid rgba(255,255,255,0.6)", borderRadius: "999px", px: 1.25, py: 0.5 }}>
          <Typography sx={{ fontSize: 11, opacity: 0.9 }}>Send message</Typography>
        </Box>
        <FavoriteBorderRoundedIcon sx={{ fontSize: 20 }} />
        <SendRoundedIcon sx={{ fontSize: 20 }} />
      </Stack>
    </Box>
  );

  // Highlight panel wrapper + message panel — shared two-pane for non-LinkedIn platforms.
  const renderTwoPane = (asset: Collateral, key: string, done: boolean, body: string, preview: ReactNode) => (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "minmax(0, 1fr) minmax(0, 1fr)" },
        gap: 2,
        alignItems: "stretch",
      }}
    >
      <Box
        sx={{
          p: { xs: 1.5, sm: 2 },
          borderRadius: "14px",
          border: "1px solid",
          borderColor: (t) => alpha(t.palette.primary.main, 0.2),
          bgcolor: (t) => alpha(t.palette.primary.main, 0.05),
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography
          sx={{
            fontSize: "0.7rem",
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "text.secondary",
            mb: 1.5,
          }}
        >
          Preview · sample post
        </Typography>
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>{preview}</Box>
      </Box>
      {renderMessagePanel(asset, key, done, body)}
    </Box>
  );

  return (
    <Box sx={{ maxWidth: 840, mx: "auto" }}>
      {/* back to catalog */}
      <Button
        variant="text"
        startIcon={<ArrowBackRoundedIcon sx={{ fontSize: 18 }} />}
        onClick={() => navigate("/recommend")}
        sx={{
          ml: -1,
          mb: 1.5,
          textTransform: "none",
          fontWeight: 600,
          color: "text.secondary",
          borderRadius: "8px",
          transition: `transform 130ms ${EASE_OUT}`,
          "&:hover": { color: "text.primary" },
          "&:active": { transform: "scale(0.97)" },
          "@media (prefers-reduced-motion: reduce)": { "&:active": { transform: "none" } },
        }}
      >
        All programs
      </Button>

      {/* header */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
        sx={{ pb: 2.5 }}
      >
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mb: 1.5 }}>
            <Chip
              label={program.family === "gl" ? "GL program" : "University"}
              size="small"
              sx={{
                height: 22,
                fontSize: "0.68rem",
                fontWeight: 700,
                borderRadius: "999px",
                color: "text.secondary",
                bgcolor: "action.hover",
              }}
            />
            {program.isNew && (
              <Chip
                label="New"
                size="small"
                sx={{
                  height: 22,
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  borderRadius: "999px",
                  color: "primary.main",
                  bgcolor: (t) => alpha(t.palette.primary.main, 0.1),
                }}
              />
            )}
          </Stack>
          <Typography variant="h4" sx={{ fontWeight: 800, lineHeight: 1.2, letterSpacing: "-0.015em" }}>
            {program.title}
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.75, color: "text.secondary" }}>
            {program.university}
          </Typography>
        </Box>
      </Stack>

      {/* section tabs */}
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={tab}
          onChange={(_e, v) => setTab(v as "overview" | "collaterals" | "faq")}
          aria-label="Program detail sections"
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{
            minHeight: 44,
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.875rem",
              minHeight: 44,
            },
            "& .MuiTabs-indicator": { height: 3, borderRadius: "3px 3px 0 0" },
          }}
        >
          <Tab label="Overview" value="overview" />
          <Tab label="Social Media Kit" value="collaterals" />
          <Tab label="Program FAQ" value="faq" />
        </Tabs>
      </Box>

      <Box sx={{ py: 3, mb: 2 }}>
        {tab === "overview" && (
          <>
            {/* lead */}
            <Typography sx={{ fontSize: 15, lineHeight: 1.65, color: "text.secondary" }}>
              {program.blurb}
            </Typography>

            {/* meta — icon / label row */}
            <Stack
              direction="row"
              spacing={{ xs: 4, sm: 6 }}
              sx={{ mt: 3, flexWrap: "wrap", rowGap: 2.5 }}
            >
              {[
                { k: "Duration", v: program.durationLabel, icon: ScheduleOutlinedIcon },
                { k: "Program fee", v: fmtUsd(program.price), icon: PaymentsOutlinedIcon },
                { k: "Format", v: program.mode, icon: PublicOutlinedIcon },
              ].map((f) => (
                <Box key={f.k}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <f.icon sx={{ fontSize: 18, color: "text.primary" }} />
                    <Typography sx={{ fontWeight: 700, fontSize: 14 }}>{f.k}</Typography>
                  </Stack>
                  <Typography
                    sx={{ mt: 0.5, pl: "26px", color: "text.secondary", fontSize: 14, ...TABULAR }}
                  >
                    {f.v}
                  </Typography>
                </Box>
              ))}
            </Stack>

            <Divider sx={{ my: 3 }} />

            {/* share & earn — personalised link, promo code, collaterals */}
            <Box
              sx={{
                p: { xs: 2.25, sm: 2.5 },
                borderRadius: "14px",
                bgcolor: (t) => (t.palette.mode === "dark" ? "rgba(255,255,255,0.04)" : t.palette.grey[100]),
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                spacing={1}
                sx={{ mb: 2 }}
              >
                <Stack direction="row" alignItems="center" spacing={1} sx={{ minWidth: 0 }}>
                  <LocalOfferOutlinedIcon sx={{ fontSize: 18, color: "primary.main", flexShrink: 0 }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }} noWrap>
                    Share &amp; earn
                  </Typography>
                </Stack>
                <Chip
                  label={`${program.scholarshipPct}% off for learners`}
                  size="small"
                  sx={{
                    height: 24,
                    fontWeight: 800,
                    fontSize: "0.74rem",
                    flexShrink: 0,
                    ...TABULAR,
                    color: "var(--gl-status-confirmed-text)",
                    bgcolor: "var(--gl-status-confirmed-bg)",
                    border: "1px solid var(--gl-status-confirmed-border)",
                  }}
                />
              </Stack>

              {/* 1 — personalised program page (id-tagged) */}
              <Typography
                sx={{
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "text.secondary",
                  mb: 0.75,
                }}
              >
                Your personalised program page
              </Typography>
              <TextField
                fullWidth
                size="small"
                value={link}
                InputProps={{
                  readOnly: true,
                  startAdornment: (
                    <InputAdornment position="start">
                      <LinkOutlinedIcon sx={{ fontSize: 16, color: "text.disabled" }} />
                    </InputAdornment>
                  ),
                  sx: { fontFamily: "monospace", fontSize: 12.5, borderRadius: "10px", bgcolor: "background.paper" },
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip title={copiedKey === "link" ? "Copied" : "Copy link"}>
                        <IconButton
                          size="small"
                          aria-label="Copy personalised page link"
                          onClick={() => copy("link", link, "Personalised page link copied to clipboard.")}
                          sx={{
                            color: copiedKey === "link" ? "success.main" : "primary.main",
                            transition: `transform 130ms ${EASE_OUT}`,
                            "&:active": { transform: "scale(0.97)" },
                          }}
                        >
                          {copiedKey === "link" ? (
                            <CheckRoundedIcon fontSize="small" />
                          ) : (
                            <ContentCopyOutlinedIcon fontSize="small" />
                          )}
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  ),
                }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5 }}>
                Tagged with your ID — every visit and enrollment is tracked back to you.
              </Typography>

              {/* 2 — learner promo code */}
              <Typography
                sx={{
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "text.secondary",
                  mt: 2,
                  mb: 0.75,
                }}
              >
                Learner promo code
              </Typography>
              <TextField
                fullWidth
                value={program.scholarshipCode}
                InputProps={{
                  readOnly: true,
                  sx: {
                    fontFamily: "monospace",
                    fontWeight: 800,
                    fontSize: 18,
                    letterSpacing: "0.03em",
                    borderRadius: "10px",
                    bgcolor: "background.paper",
                    ...TABULAR,
                  },
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip title={copiedKey === "code" ? "Copied" : "Copy code"}>
                        <IconButton
                          size="small"
                          aria-label="Copy promo code"
                          onClick={() =>
                            copy("code", program.scholarshipCode, "Promo code copied to clipboard.")
                          }
                          sx={{
                            color: copiedKey === "code" ? "success.main" : "primary.main",
                            transition: `transform 130ms ${EASE_OUT}`,
                            "&:active": { transform: "scale(0.97)" },
                          }}
                        >
                          {copiedKey === "code" ? (
                            <CheckRoundedIcon fontSize="small" />
                          ) : (
                            <ContentCopyOutlinedIcon fontSize="small" />
                          )}
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  ),
                }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5 }}>
                Learners apply this at checkout for {program.scholarshipPct}% off.
              </Typography>

              <Divider sx={{ my: 1.75 }} />

              {/* 3 — collaterals shortcut (tonal CTA) */}
              <Button
                variant="text"
                disableElevation
                endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: 18 }} />}
                onClick={() => setTab("collaterals")}
                sx={{
                  textTransform: "none",
                  fontWeight: 700,
                  color: "primary.main",
                  bgcolor: (t) => alpha(t.palette.primary.main, 0.1),
                  borderRadius: "10px",
                  px: 1.75,
                  py: 0.75,
                  "&:hover": { bgcolor: (t) => alpha(t.palette.primary.main, 0.16) },
                  transition: `transform 130ms ${EASE_OUT}, background-color 130ms ${EASE_OUT}`,
                  "&:active": { transform: "scale(0.97)" },
                  "@media (prefers-reduced-motion: reduce)": { "&:active": { transform: "none" } },
                }}
              >
                Social media kit
              </Button>
              <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
                Ready-to-post assets for LinkedIn, WhatsApp, email, and Instagram.
              </Typography>
            </Box>

            {/* earnings callout — right after Share & earn */}
            <Box
              sx={{
                mt: 2,
                p: { xs: 2, sm: 2.25 },
                borderRadius: "14px",
                bgcolor: "var(--gl-status-confirmed-bg)",
                border: "1px solid var(--gl-status-confirmed-border)",
              }}
            >
              <Typography
                sx={{
                  fontSize: "0.66rem",
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "var(--gl-status-confirmed-text)",
                  lineHeight: 1,
                  mb: 1,
                }}
              >
                You earn
              </Typography>
              <Stack spacing={0.75}>
                <Stack direction="row" spacing={1} alignItems="baseline">
                  <Typography
                    sx={{ fontWeight: 800, fontSize: 16, lineHeight: 1.2, color: "var(--gl-status-confirmed-text)", flexShrink: 0, minWidth: 44, ...TABULAR }}
                  >
                    {program.bonusPctSelfCheckout}%
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.primary", lineHeight: 1.45 }}>
                    of the program fee when your learner enrolls on their own using your link or code
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="baseline">
                  <Typography
                    sx={{ fontWeight: 800, fontSize: 16, lineHeight: 1.2, color: "var(--gl-status-confirmed-text)", flexShrink: 0, minWidth: 44, ...TABULAR }}
                  >
                    {program.bonusPctAssisted}%
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.primary", lineHeight: 1.45 }}>
                    when a GL advisor helps close the enrollment
                  </Typography>
                </Stack>
              </Stack>
              <Typography variant="caption" sx={{ display: "block", mt: 1, color: "text.secondary" }}>
                {program.payoutTiming}, in your payout currency.
              </Typography>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* what you'll learn */}
            <SectionLabel icon={<SchoolOutlinedIcon sx={{ fontSize: 18, color: "primary.main" }} />}>
              What this course teaches
            </SectionLabel>
            <Grid container columnSpacing={3} rowSpacing={2} sx={{ maxWidth: 640 }}>
              {program.curriculum.map((c, i) => (
                <Grid key={i} size={{ xs: 12, sm: 6 }}>
                  <Stack direction="row" spacing={1.25} alignItems="center">
                    <Box
                      sx={{
                        width: 5,
                        height: 5,
                        borderRadius: "50%",
                        bgcolor: "text.disabled",
                        flexShrink: 0,
                      }}
                    />
                    <Typography variant="body2" sx={{ lineHeight: 1.4 }}>
                      {c}
                    </Typography>
                  </Stack>
                </Grid>
              ))}
            </Grid>
            <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap alignItems="center" sx={{ mt: 2.5 }}>
              <Button
                variant="contained"
                component="a"
                href={BROCHURE_URLS[program.id] ?? link}
                target="_blank"
                rel="noopener noreferrer"
                endIcon={<OpenInNewRoundedIcon sx={{ fontSize: 16 }} />}
                sx={{
                  textTransform: "none",
                  fontWeight: 700,
                  borderRadius: "10px",
                  transition: `transform 130ms ${EASE_OUT}`,
                  "&:active": { transform: "scale(0.97)" },
                  "@media (prefers-reduced-motion: reduce)": { "&:active": { transform: "none" } },
                }}
              >
                View brochure
              </Button>
            </Stack>

            <Divider sx={{ my: 3 }} />

            {/* who it's for + prerequisites */}
            <SectionLabel icon={<PeopleAltOutlinedIcon sx={{ fontSize: 18, color: "primary.main" }} />}>
              Who it&rsquo;s for
            </SectionLabel>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.55, mb: 2.75 }}>
              {program.audienceLine}
            </Typography>

            <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 1.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                Prerequisites
              </Typography>
              {program.hasTechnicalPrereq && (
                <Chip
                  size="small"
                  icon={<WarningAmberIcon sx={{ fontSize: 14 }} />}
                  label="Technical prerequisites"
                  sx={{
                    height: 22,
                    fontSize: "0.7rem",
                    fontWeight: 600,
                    color: "var(--gl-warning-icon)",
                    bgcolor: (t) => alpha(t.palette.warning.main, 0.12),
                    border: (t) => `1px solid ${alpha(t.palette.warning.main, 0.26)}`,
                    "& .MuiChip-icon": { color: "var(--gl-warning-icon)", ml: 0.5 },
                  }}
                />
              )}
            </Stack>
            <Stack direction="row" flexWrap="wrap" useFlexGap spacing={0.75}>
              {program.prerequisites.map((pr, i) => (
                <Chip
                  key={i}
                  label={pr}
                  size="small"
                  variant="outlined"
                  sx={{ height: 30, fontSize: "0.78rem", borderRadius: "8px", color: "text.secondary", px: 0.5 }}
                />
              ))}
            </Stack>
          </>
        )}

        {tab === "collaterals" && (
          <>
            {/* collaterals — program-specific, pre-filled with the guru's code + link */}
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.55 }}>
              Each card shows a sample of how your post will look, next to the message to copy —
              pre-filled with your code and link for {program.title}.
            </Typography>
            <Stack spacing={1.5}>
              {demoBroadcastCollateral.map((asset) => {
                const key = `col:${asset.id}`;
                const done = copiedKey === key;
                const media = COLLATERAL_MEDIA[asset.id];
                // Full post the guru shares: the message plus their id-tagged link.
                const body = `${fillCollateral(asset.caption)}\n\n${link}`;
                // LinkedIn-style truncation of the post text for the preview.
                const postText = fillCollateral(asset.caption);
                const liIsLong = postText.length > 160;
                const liText = liIsLong ? postText.slice(0, 160).replace(/\s+\S*$/, "") : postText;
                return (
                  <Box
                    key={asset.id}
                    sx={{
                      p: 1.75,
                      borderRadius: "12px",
                      border: "1px solid",
                      borderColor: "divider",
                      bgcolor: "background.paper",
                    }}
                  >
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      spacing={1}
                      sx={{ mb: 2 }}
                    >
                      <Stack direction="row" alignItems="center" spacing={0.75}>
                        {(() => {
                          const logo = PLATFORM_LOGO[asset.id];
                          return logo ? <logo.icon sx={{ fontSize: 20, color: logo.color }} /> : null;
                        })()}
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                          {asset.label}
                        </Typography>
                      </Stack>
                    </Stack>

                    {/* LinkedIn shows a two-pane preview — the post as it will look on the
                        left, the copyable message on the right — so the guru can visualise
                        it before posting. Other platforms show a placeholder + message. */}
                    {asset.id === "asset-01" ? (
                      <Box
                        sx={{
                          display: "grid",
                          gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "minmax(0, 1fr) minmax(0, 1fr)" },
                          gap: 2,
                          alignItems: "stretch",
                        }}
                      >
                        {/* left — LinkedIn post preview inside a brand highlight panel */}
                        <Box
                          sx={{
                            p: { xs: 1.5, sm: 2 },
                            borderRadius: "14px",
                            border: "1px solid",
                            borderColor: (t) => alpha(t.palette.primary.main, 0.2),
                            bgcolor: (t) => alpha(t.palette.primary.main, 0.05),
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: "0.7rem",
                              fontWeight: 700,
                              letterSpacing: "0.06em",
                              textTransform: "uppercase",
                              color: "text.secondary",
                              mb: 1.5,
                            }}
                          >
                            Preview · sample post
                          </Typography>
                          <Box
                            sx={{
                              border: "1px solid",
                              borderColor: "divider",
                              borderRadius: "10px",
                              overflow: "hidden",
                              bgcolor: "background.paper",
                            }}
                          >
                          {/* author */}
                          <Stack direction="row" alignItems="flex-start" spacing={1.25} sx={{ p: 1.5, pb: 1 }}>
                            <Avatar
                              sx={{
                                width: 44,
                                height: 44,
                                bgcolor: (t) => alpha(t.palette.primary.main, 0.15),
                                color: "primary.main",
                              }}
                            >
                              <PersonRoundedIcon />
                            </Avatar>
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Stack direction="row" alignItems="center" spacing={0.5}>
                                <Typography sx={{ fontSize: 14, fontWeight: 700, lineHeight: 1.25 }}>You</Typography>
                                <VerifiedIcon sx={{ fontSize: 15, color: "text.secondary" }} />
                                <Typography sx={{ fontSize: 13, color: "text.secondary" }}>· 1st</Typography>
                              </Stack>
                              <Typography noWrap sx={{ fontSize: 12, color: "text.secondary", lineHeight: 1.3 }}>
                                AI Mentor · Great Learning
                              </Typography>
                              <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 0.25 }}>
                                <Typography sx={{ fontSize: 12, color: "text.secondary" }}>1w</Typography>
                                <Typography sx={{ fontSize: 12, color: "text.secondary" }}>·</Typography>
                                <PublicRoundedIcon sx={{ fontSize: 13, color: "text.secondary" }} />
                              </Stack>
                            </Box>
                            <MoreHorizRoundedIcon sx={{ color: "text.secondary" }} />
                          </Stack>

                          {/* post text */}
                          <Typography variant="body2" sx={{ px: 1.5, pb: 1.5, lineHeight: 1.5 }}>
                            {renderRichText(liText)}
                            {liIsLong && (
                              <Box component="span" sx={{ color: "text.secondary", fontWeight: 500 }}>
                                …more
                              </Box>
                            )}
                          </Typography>

                          {/* link-preview card — thumbnail + title + domain */}
                          <Divider />
                          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ p: 1.5 }}>
                            <OgThumb
                              src={OG_IMAGE[program.id]}
                              label="GREAT LEARNING"
                              sx={{ width: 112, height: 90, flexShrink: 0, borderRadius: "8px", boxShadow: 2 }}
                            />
                            <Box sx={{ minWidth: 0 }}>
                              <Typography
                                sx={{
                                  fontSize: 15,
                                  fontWeight: 700,
                                  lineHeight: 1.3,
                                  display: "-webkit-box",
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: "vertical",
                                  overflow: "hidden",
                                }}
                              >
                                {program.title}
                              </Typography>
                              <Typography sx={{ mt: 0.5, fontSize: 13, color: "text.secondary" }}>
                                mygreatlearning.com
                              </Typography>
                            </Box>
                          </Stack>

                          {/* reactions summary */}
                          <Stack
                            direction="row"
                            alignItems="center"
                            justifyContent="space-between"
                            sx={{ px: 1.5, py: 1, borderTop: "1px solid", borderColor: "divider" }}
                          >
                            <Stack direction="row" alignItems="center" spacing={0.75}>
                              <Stack direction="row">
                                <Box
                                  sx={{
                                    width: 18,
                                    height: 18,
                                    borderRadius: "50%",
                                    bgcolor: "#2f6bff",
                                    display: "grid",
                                    placeItems: "center",
                                    border: "1.5px solid",
                                    borderColor: "background.paper",
                                  }}
                                >
                                  <ThumbUpRoundedIcon sx={{ fontSize: 10, color: "#fff" }} />
                                </Box>
                                <Box
                                  sx={{
                                    width: 18,
                                    height: 18,
                                    ml: "-5px",
                                    borderRadius: "50%",
                                    bgcolor: "#f5455f",
                                    display: "grid",
                                    placeItems: "center",
                                    border: "1.5px solid",
                                    borderColor: "background.paper",
                                  }}
                                >
                                  <FavoriteRoundedIcon sx={{ fontSize: 10, color: "#fff" }} />
                                </Box>
                              </Stack>
                              <Typography sx={{ fontSize: 12, color: "text.secondary" }}>You and 47 others</Typography>
                            </Stack>
                            <Typography sx={{ fontSize: 12, color: "text.secondary" }}>12 comments</Typography>
                          </Stack>

                          {/* action bar */}
                          <Stack direction="row" sx={{ borderTop: "1px solid", borderColor: "divider" }}>
                            {(
                              [
                                { icon: ThumbUpOffAltIcon, label: "Like" },
                                { icon: ChatBubbleOutlineRoundedIcon, label: "Comment" },
                                { icon: RepeatRoundedIcon, label: "Repost" },
                                { icon: SendRoundedIcon, label: "Send" },
                              ] as { icon: SvgIconComponent; label: string }[]
                            ).map((a) => (
                              <Stack
                                key={a.label}
                                direction="row"
                                alignItems="center"
                                justifyContent="center"
                                spacing={0.75}
                                sx={{ flex: 1, py: 1, color: "text.secondary" }}
                              >
                                <a.icon sx={{ fontSize: 18 }} />
                                <Typography sx={{ fontSize: 12.5, fontWeight: 600, display: { xs: "none", sm: "block" } }}>
                                  {a.label}
                                </Typography>
                              </Stack>
                            ))}
                          </Stack>
                          </Box>
                        </Box>

                        {/* right — message to post (matches the post's full height) */}
                        <Box
                          sx={{
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            p: 2,
                            borderRadius: "14px",
                            border: "1px solid",
                            borderColor: "divider",
                            bgcolor: (t) =>
                              t.palette.mode === "dark" ? "rgba(255,255,255,0.03)" : t.palette.grey[50],
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: "0.7rem",
                              fontWeight: 700,
                              letterSpacing: "0.06em",
                              textTransform: "uppercase",
                              color: "text.secondary",
                              mb: 1,
                            }}
                          >
                            Message to post
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ lineHeight: 1.55, whiteSpace: "pre-line", color: "text.primary" }}
                          >
                            {renderCaption(asset.caption)}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ mt: 1, color: "primary.main", fontWeight: 600, wordBreak: "break-all", lineHeight: 1.45 }}
                          >
                            {link}
                          </Typography>

                          <Box sx={{ mt: "auto", pt: 2.5 }}>
                            {/* info box — how to use the message (yellow note treatment) */}
                            <Stack
                              direction="row"
                              spacing={1}
                              sx={{
                                p: 1.25,
                                mb: 1.5,
                                borderRadius: "10px",
                                bgcolor: (t) =>
                                  t.palette.mode === "dark" ? "rgba(251,191,36,0.12)" : "rgba(217,119,6,0.09)",
                                border: "1px solid",
                                borderColor: (t) =>
                                  t.palette.mode === "dark" ? "rgba(251,191,36,0.35)" : "rgba(217,119,6,0.28)",
                              }}
                            >
                              <InfoOutlinedIcon
                                sx={{ fontSize: 18, color: "var(--gl-warning-icon)", flexShrink: 0, mt: "1px" }}
                              />
                              <Typography variant="body2" sx={{ fontSize: 13, lineHeight: 1.5, color: "text.secondary" }}>
                                Copy this text and paste it into a new LinkedIn post.
                              </Typography>
                            </Stack>

                            <Button
                              fullWidth
                              disableElevation
                              startIcon={
                                done ? (
                                  <CheckRoundedIcon sx={{ fontSize: 18 }} />
                                ) : (
                                  <ContentCopyOutlinedIcon sx={{ fontSize: 18 }} />
                                )
                              }
                              onClick={() => copy(key, body, `${asset.label} copied to clipboard.`)}
                              sx={{
                                py: 1,
                                textTransform: "none",
                                fontWeight: 700,
                                borderRadius: "10px",
                                color: done ? "success.main" : "primary.main",
                                bgcolor: (t) =>
                                  done
                                    ? alpha(t.palette.success.main, 0.1)
                                    : alpha(t.palette.primary.main, 0.1),
                                "&:hover": {
                                  bgcolor: (t) =>
                                    done
                                      ? alpha(t.palette.success.main, 0.16)
                                      : alpha(t.palette.primary.main, 0.16),
                                },
                                transition: `transform 130ms ${EASE_OUT}, background-color 130ms ${EASE_OUT}`,
                                "&:active": { transform: "scale(0.99)" },
                                "@media (prefers-reduced-motion: reduce)": { "&:active": { transform: "none" } },
                              }}
                            >
                              {done ? "Copied" : "Copy text"}
                            </Button>
                          </Box>
                        </Box>
                      </Box>
                    ) : asset.id === "asset-02" ? (
                      renderTwoPane(asset, key, done, body, renderWhatsApp(asset))
                    ) : asset.id === "asset-03" ? (
                      renderTwoPane(asset, key, done, body, renderEmail(asset))
                    ) : asset.id === "asset-04" ? (
                      renderTwoPane(asset, key, done, body, renderInstagram(asset))
                    ) : (
                      <>
                        {media && (
                          <Box
                            role="button"
                            tabIndex={0}
                            aria-label={`Expand ${asset.label} preview`}
                            onClick={() => setLightbox({ id: asset.id, label: asset.label, caption: body })}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                setLightbox({ id: asset.id, label: asset.label, caption: body });
                              }
                            }}
                            sx={{
                              position: "relative",
                              mb: 1.5,
                              mx: media.centered ? "auto" : 0,
                              width: "100%",
                              maxWidth: media.maxWidth,
                              aspectRatio: media.ratio,
                              borderRadius: "10px",
                              overflow: "hidden",
                              cursor: "pointer",
                              outline: "none",
                              border: "1px dashed",
                              borderColor: "divider",
                              bgcolor: "action.hover",
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: 0.75,
                              color: "text.disabled",
                              transition: `border-color 160ms ${EASE_OUT}, background-color 160ms ${EASE_OUT}`,
                              "&:hover, &:focus-visible": {
                                borderColor: "primary.main",
                                bgcolor: (t) => alpha(t.palette.primary.main, 0.06),
                                "& .col-zoom": { opacity: 1, transform: "scale(1)" },
                              },
                            }}
                          >
                            <Box
                              className="col-zoom"
                              sx={{
                                position: "absolute",
                                top: 8,
                                right: 8,
                                zIndex: 1,
                                width: 28,
                                height: 28,
                                borderRadius: "8px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                bgcolor: "background.paper",
                                border: "1px solid",
                                borderColor: "divider",
                                color: "text.secondary",
                                opacity: 0,
                                transform: "scale(0.9)",
                                transition: `opacity 160ms ${EASE_OUT}, transform 160ms ${EASE_OUT}`,
                                "@media (hover: none)": { opacity: 1, transform: "scale(1)" },
                              }}
                            >
                              <ZoomOutMapRoundedIcon sx={{ fontSize: 16 }} />
                            </Box>
                            <Stack direction="row" alignItems="center" spacing={0.5}>
                              <ImageOutlinedIcon sx={{ fontSize: 18 }} />
                              <media.icon sx={{ fontSize: 20 }} />
                            </Stack>
                            <Typography variant="caption" sx={{ fontWeight: 600, ...TABULAR }}>
                              {media.size}
                            </Typography>
                          </Box>
                        )}
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ lineHeight: 1.5, whiteSpace: "pre-line" }}
                        >
                          {renderCaption(asset.caption)}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ mt: 1, color: "primary.main", fontWeight: 600, wordBreak: "break-all", lineHeight: 1.45 }}
                        >
                          {link}
                        </Typography>
                      </>
                    )}
                  </Box>
                );
              })}
            </Stack>
          </>
        )}

        {tab === "faq" && (
          <Box sx={{ maxWidth: 760 }}>
            {(PROGRAM_FAQ[program.id] ?? PROGRAM_FAQ["ai-native-professional"]).map((group, g) => (
              <Box key={group.title} sx={{ mb: 3.5, "&:last-of-type": { mb: 0 } }}>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, fontSize: "1.05rem", letterSpacing: "-0.01em", mb: 1.5 }}
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
                      expanded={faqExpanded === id}
                      onChange={(_e, isExpanded) => setFaqExpanded(isExpanded ? id : false)}
                      sx={{
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: "12px !important",
                        overflow: "hidden",
                        mb: 1.25,
                        "&::before": { display: "none" },
                        transition: `border-color 180ms ${EASE_OUT}`,
                        ...(faqExpanded === id && { borderColor: "primary.main" }),
                      }}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon sx={{ fontSize: 20 }} />}
                        sx={{ px: 2, minHeight: 52, "& .MuiAccordionSummary-content": { my: 1.25 } }}
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
        )}
      </Box>

      {/* collateral image lightbox */}
      <Modal
        open={Boolean(lightbox)}
        onClose={() => setLightbox(null)}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{ backdrop: { timeout: 200, sx: { bgcolor: "rgba(0,0,0,0.78)" } } }}
        sx={{ display: "flex", alignItems: "center", justifyContent: "center", p: { xs: 2, sm: 4 } }}
      >
        <Fade in={Boolean(lightbox)} timeout={200}>
          <Box sx={{ position: "relative", outline: "none", maxWidth: "100%", maxHeight: "100%" }}>
            <IconButton
              aria-label="Close preview"
              onClick={() => setLightbox(null)}
              sx={{
                position: "absolute",
                top: -14,
                right: -14,
                zIndex: 1,
                bgcolor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
                boxShadow: 2,
                transition: `transform 130ms ${EASE_OUT}`,
                "&:hover": { bgcolor: "background.paper" },
                "&:active": { transform: "scale(0.94)" },
              }}
            >
              <CloseRoundedIcon sx={{ fontSize: 20 }} />
            </IconButton>
            {lightbox &&
              (() => {
                const media = COLLATERAL_MEDIA[lightbox.id];
                if (!media) return null;
                // Fit the image within both a max width and ~62vh tall, whatever the
                // aspect ratio — portrait (IG story) and landscape (LinkedIn) both fit
                // without the modal scrolling.
                const [rw, rh] = media.ratio.split("/").map((n) => parseFloat(n));
                const ar = rw / rh;
                const boxWidth = `min(640px, 90vw, ${(62 * ar).toFixed(2)}vh)`;
                return (
                  <Box
                    sx={{
                      width: boxWidth,
                      maxHeight: "90vh",
                      overflowY: "auto",
                      borderRadius: "14px",
                      bgcolor: "background.paper",
                    }}
                  >
                    {/* enlarged placeholder image */}
                    <Box
                      sx={{
                        width: "100%",
                        aspectRatio: media.ratio,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 1.5,
                        color: "text.disabled",
                        borderBottom: "1px solid",
                        borderColor: "divider",
                      }}
                    >
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <ImageOutlinedIcon sx={{ fontSize: 34 }} />
                        <media.icon sx={{ fontSize: 38 }} />
                      </Stack>
                      <Typography sx={{ fontWeight: 700, fontSize: 18, ...TABULAR }}>{media.size}</Typography>
                    </Box>
                    {/* caption — same copy that ships with the post */}
                    <Box sx={{ p: { xs: 2, sm: 2.5 } }}>
                      <Typography
                        sx={{
                          fontSize: "0.7rem",
                          fontWeight: 700,
                          letterSpacing: "0.06em",
                          textTransform: "uppercase",
                          color: "text.secondary",
                          mb: 1,
                        }}
                      >
                        {lightbox.label}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "text.primary", lineHeight: 1.6, whiteSpace: "pre-line" }}
                      >
                        {lightbox.caption}
                      </Typography>

                      {/* actions — same as the card */}
                      <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                        <Button
                          size="small"
                          startIcon={<FileDownloadOutlinedIcon sx={{ fontSize: 16 }} />}
                          onClick={() => downloadImage(lightbox.id, lightbox.label)}
                          sx={{
                            textTransform: "none",
                            fontWeight: 600,
                            color: "text.secondary",
                            transition: `transform 130ms ${EASE_OUT}`,
                            "&:active": { transform: "scale(0.97)" },
                            "@media (prefers-reduced-motion: reduce)": { "&:active": { transform: "none" } },
                          }}
                        >
                          Download image
                        </Button>
                        <Button
                          size="small"
                          startIcon={
                            copiedKey === `lightbox:${lightbox.id}` ? (
                              <CheckRoundedIcon sx={{ fontSize: 16 }} />
                            ) : (
                              <ContentCopyOutlinedIcon sx={{ fontSize: 16 }} />
                            )
                          }
                          onClick={() =>
                            copy(`lightbox:${lightbox.id}`, lightbox.caption, `${lightbox.label} copied to clipboard.`)
                          }
                          sx={{
                            textTransform: "none",
                            fontWeight: 600,
                            color: copiedKey === `lightbox:${lightbox.id}` ? "success.main" : "primary.main",
                            transition: `transform 130ms ${EASE_OUT}`,
                            "&:active": { transform: "scale(0.97)" },
                            "@media (prefers-reduced-motion: reduce)": { "&:active": { transform: "none" } },
                          }}
                        >
                          {copiedKey === `lightbox:${lightbox.id}` ? "Copied" : "Copy text"}
                        </Button>
                      </Stack>
                    </Box>
                  </Box>
                );
              })()}
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
}
