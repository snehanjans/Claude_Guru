/**
 * Great Learning program catalogue.
 *
 * Pulled from the public sitemap at https://www.mygreatlearning.com/sitemap.xml
 * (gl_sitemap.xml), then read out of each page's schema.org `Course` JSON-LD —
 * `name`, `provider.name` and `hasCourseInstance.courseWorkload`. Four pages
 * carry no Course schema, so their titles come from the page `h1`/breadcrumb and
 * they have no published duration.
 *
 * Two sitemap entries were left out because they are category hub pages rather
 * than single programs: `data-analytics-essentials-online-course` ("Data Science
 * Courses") and `pg-program-cyber-security-course` ("Cyber Security Courses").
 *
 * Regenerating: fetch gl_sitemap.xml, then for each program URL read the first
 * ld+json block of @type Course. Slug is what the referral link is built from.
 *
 * Captured 2026-08-24. Titles, providers and durations are
 * whatever the site published at that moment — re-pull rather than hand-editing.
 */

export interface ReferableCourse {
  /** Path on mygreatlearning.com — the referral link is built from this. */
  slug: string;
  title: string;
  /** Awarding university or partner, where the page declares one. */
  provider?: string;
  /** Published duration, absent where the page doesn't state one. */
  durationLabel?: string;
  /**
   * Whether a guru can earn a referral on this program.
   *
   * The site does not publish referral eligibility, so this cannot be derived
   * from the catalogue — every entry is flagged eligible until the referral
   * backend supplies the real answer. Treat it as a hook, not as fact.
   */
  eligibleForReferral: boolean;
  /** Alternate paths that resolve to the same program. */
  aliasSlugs?: string[];
}

export const demoReferableCourses: ReferableCourse[] = [
  { slug: "nus-accelerated-management-program", title: "Accelerated Management Program", provider: "NUS Business School", eligibleForReferral: true },
  { slug: "mit-data-science-and-machine-learning-program", title: "AI and Data Science: Leveraging Responsible AI, Data and Statistics for Practical Impact", provider: "MIT IDSS", durationLabel: "12 weeks", eligibleForReferral: true },
  { slug: "ai-native-professional-for-finance", title: "AI Native Professional For Finance", provider: "Great Learning", durationLabel: "6 weeks", eligibleForReferral: true },
  { slug: "ai-native-professional-for-hr", title: "AI Native Professional For HR", provider: "Great Learning", durationLabel: "6 weeks", eligibleForReferral: true },
  { slug: "ai-native-professional-for-marketing", title: "AI Native Professional For Marketing", provider: "Great Learning", durationLabel: "6 weeks", eligibleForReferral: true },
  { slug: "ai-native-professional", title: "AI-Native Professional: Workflows and Agents for Productivity", provider: "Great Learning", durationLabel: "6 weeks", eligibleForReferral: true },
  { slug: "ai-for-leaders-course", title: "Artificial Intelligence PG Program for Leaders", provider: "McCombs School of Business at The University of Texas at Austin", durationLabel: "5 months", eligibleForReferral: true, aliasSlugs: ["artificial-intelligence-course-for-managers-leaders"] },
  { slug: "iit-bombay-certificate-in-agentic-ai", title: "Certificate in Agentic AI", provider: "IIT Bombay", durationLabel: "5 months", eligibleForReferral: true },
  { slug: "certificate-in-ai-engineering-and-mlops", title: "Certificate in AI Engineering and MLOps", provider: "IIT Bombay", durationLabel: "5 months", eligibleForReferral: true },
  { slug: "iit-bombay-certificate-generative-ai", title: "Certificate in Generative AI", provider: "IIT Bombay", durationLabel: "5 months", eligibleForReferral: true },
  { slug: "iit-bombay-certificate-leadership-with-ai", title: "Certificate in Leadership with AI", provider: "IIT Bombay", durationLabel: "4 months", eligibleForReferral: true },
  { slug: "iit-bombay-supply-chain-analytics-with-ai-ml-applications", title: "Certificate in Supply Chain Analytics with AI and ML Applications", provider: "IIT Bombay", durationLabel: "6 months", eligibleForReferral: true },
  { slug: "chief-financial-officer-programme", title: "Chief Financial Officer Programme", provider: "S. P. Jain Institute of Management & Research (SPJIMR)", durationLabel: "9 months", eligibleForReferral: true },
  { slug: "data-analytics-online-powerbi-bootcamp", title: "Data Analytics and Power BI Bootcamp", eligibleForReferral: true },
  { slug: "dba-aiml-online", title: "Doctor Of Business Administration in Artificial Intelligence and Machine Learning", provider: "Walsh College", durationLabel: "36 months", eligibleForReferral: true },
  { slug: "mba-dba-gm-walsh", title: "Doctor of Business Administration in General Management", provider: "Walsh College", durationLabel: "36 months", eligibleForReferral: true },
  { slug: "iit-bombay-pg-diploma-ai-data-science", title: "e-Postgraduate Diploma (ePGD) in Artificial Intelligence and Data Science", provider: "IIT Bombay", durationLabel: "18 months", eligibleForReferral: true },
  { slug: "iit-bombay-e-postgraduate-diploma-computer-science-engineering", title: "e-Postgraduate Diploma (ePGD) in Computer Science And Engineering", provider: "IIT Bombay", durationLabel: "12 months", eligibleForReferral: true },
  { slug: "iit-bombay-e-postgraduate-diploma-e-mobility", title: "e-Postgraduate Diploma in E-Mobility", provider: "IIT Bombay", durationLabel: "18 months", eligibleForReferral: true },
  { slug: "advanced-management-programme-in-ai-leadership", title: "Executive Certificate Program in AI for Business Leaders", provider: "S. P. Jain Institute of Management & Research (SPJIMR)", durationLabel: "7 months", eligibleForReferral: true },
  { slug: "executive-certificate-programme-in-ai-and-gen-ai-for-managers", title: "Executive Certificate Programme in Artificial Intelligence and Generative AI for Managers", provider: "S. P. Jain Institute of Management & Research (SPJIMR)", durationLabel: "5 months", eligibleForReferral: true },
  { slug: "pg-program-management-executive", title: "Executive PG Program in Management", provider: "Great Lakes Executive Learning", durationLabel: "12 months", eligibleForReferral: true },
  { slug: "mtech-artificial-intelligence-srm", title: "M.Tech in Artificial Intelligence", eligibleForReferral: true },
  { slug: "ms-data-science-deakin-programme", title: "Master of Data Science (Global) Program", provider: "Deakin University", eligibleForReferral: true },
  { slug: "walsh-ms-aiml-online", title: "MS in Artificial Intelligence & Machine Learning", provider: "Walsh College", durationLabel: "24 months", eligibleForReferral: true },
  { slug: "ms-data-science-programme", title: "MS in Data Science Programme", provider: "Northwestern University", durationLabel: "18 months", eligibleForReferral: true },
  { slug: "amrita-online-bba", title: "Online BBA from Amrita Vishwa Vidyapeetham", provider: "Amrita Online University", durationLabel: "36 months", eligibleForReferral: true },
  { slug: "amrita-online-bca", title: "Online BCA from Amrita Vishwa Vidyapeetham", provider: "Amrita Online University", durationLabel: "36 months", eligibleForReferral: true },
  { slug: "amrita-online-mba", title: "Online MBA from Amrita Vishwa Vidyapeetham", provider: "Amrita Online University", durationLabel: "24 months", eligibleForReferral: true },
  { slug: "amrita-online-mca", title: "Online MCA from Amrita Vishwa Vidyapeetham", provider: "Amrita Online University", durationLabel: "24 months", eligibleForReferral: true },
  { slug: "pg-program-artificial-intelligence-course", title: "PG Program in Artificial Intelligence & Machine Learning", provider: "McCombs School of Business at The University of Texas at Austin", durationLabel: "12 months", eligibleForReferral: true, aliasSlugs: ["pg-program-online-artificial-intelligence-machine-learning"] },
  { slug: "pg-program-cloud-computing-course", title: "PG Program in Cloud Computing and DevOps", provider: "Great Lakes Executive Learning", durationLabel: "8 months", eligibleForReferral: true, aliasSlugs: ["pg-program-online-cloud-computing-course"] },
  { slug: "pg-program-data-science-business-analytics-course", title: "Post Graduate Program in Data Science with Generative AI", provider: "McCombs School of Business at The University of Texas at Austin", durationLabel: "12 months", eligibleForReferral: true, aliasSlugs: ["pg-program-data-science-and-business-analytics-course"] },
  { slug: "gl-pg-program-cloud-computing-course", title: "Post-Graduate Program in Cloud Computing", eligibleForReferral: true },
];

/**
 * The four AI-Native Professional programs have their own cards on the Programs
 * tab, each with a ready-made referral link, so they're excluded from the
 * "recommend another course" search to avoid offering the same thing twice.
 */
export const AINP_SLUGS = new Set([
  "ai-native-professional",
  "ai-native-professional-for-finance",
  "ai-native-professional-for-hr",
  "ai-native-professional-for-marketing",
]);

/** Courses offered in the "recommend another course" search. */
export const referableCourses = demoReferableCourses.filter(
  (c) => c.eligibleForReferral && !AINP_SLUGS.has(c.slug),
);
