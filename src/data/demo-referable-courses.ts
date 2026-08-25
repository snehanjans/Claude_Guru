/**
 * Great Learning program catalogue.
 *
 * Pulled from the public sitemap at https://www.mygreatlearning.com/sitemap.xml
 * (gl_sitemap.xml), then read out of each page's schema.org `Course` JSON-LD —
 * `name`, `provider.name`, `hasCourseInstance.courseWorkload` — plus the page's
 * `og:image` for the card banner. Four pages carry no Course schema, so their
 * titles come from the page `h1`/breadcrumb and they have no published duration.
 *
 * Two sitemap entries were left out because they are category hub pages rather
 * than single programs: `data-analytics-essentials-online-course` ("Data Science
 * Courses") and `pg-program-cyber-security-course` ("Cyber Security Courses").
 *
 * Images are referenced from Great Learning's own CDN rather than copied into
 * the repo, so they stay in step with the site and add no binaries here. Cards
 * fall back to a brand gradient if one fails to load.
 *
 * Regenerating: fetch gl_sitemap.xml, then per program URL read the first
 * ld+json block of @type Course and the og:image meta tag. Slug is what the
 * referral link is built from.
 *
 * Captured 2026-08-24. Titles, providers, durations and
 * images are whatever the site published then — re-pull rather than hand-editing.
 */

export interface ReferableCourse {
  /** Path on mygreatlearning.com — the referral link is built from this. */
  slug: string;
  title: string;
  /** Awarding university or partner, as the page declares it. */
  provider?: string;
  /** Card-length version of `provider`; the legal names are far too long. */
  providerShort?: string;
  /** Published duration, absent where the page doesn't state one. */
  durationLabel?: string;
  /** Delivery format, e.g. "Online". */
  mode?: string;
  /** Program banner from the page's og:image, used for the card visual. */
  image?: string;
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
  { slug: "nus-accelerated-management-program", title: "Accelerated Management Program", provider: "NUS Business School", providerShort: "NUS", mode: "Online", image: "https://dtmvamahs40ux.cloudfront.net/public/seo-image/seo-image-3157-jpeg-optimizer_nus-business-school-banner.jpg", eligibleForReferral: true },
  { slug: "mit-data-science-and-machine-learning-program", title: "AI and Data Science: Leveraging Responsible AI, Data and Statistics for Practical Impact", provider: "MIT IDSS", providerShort: "MIT", durationLabel: "12 weeks", mode: "Online", image: "https://dtmvamahs40ux.cloudfront.net/public/seo-image/seo-image-769-idss-banner-img.jpg", eligibleForReferral: true },
  { slug: "ai-native-professional-for-finance", title: "AI Native Professional For Finance", provider: "Great Learning", providerShort: "Great Learning", durationLabel: "6 weeks", mode: "Blended", image: "https://dtmvamahs40ux.cloudfront.net/public/seo-image/seo-image-3277-ainp-generic-banner.jpeg", eligibleForReferral: true },
  { slug: "ai-native-professional-for-hr", title: "AI Native Professional For HR", provider: "Great Learning", providerShort: "Great Learning", durationLabel: "6 weeks", mode: "Blended", image: "https://dtmvamahs40ux.cloudfront.net/public/seo-image/seo-image-3279-ainp-generic-banner.jpeg", eligibleForReferral: true },
  { slug: "ai-native-professional-for-marketing", title: "AI Native Professional For Marketing", provider: "Great Learning", providerShort: "Great Learning", durationLabel: "6 weeks", mode: "Blended", image: "https://dtmvamahs40ux.cloudfront.net/public/seo-image/seo-image-3278-ainp-generic-banner.jpeg", eligibleForReferral: true },
  { slug: "ai-native-professional", title: "AI-Native Professional: Workflows and Agents for Productivity", provider: "Great Learning", providerShort: "Great Learning", durationLabel: "6 weeks", mode: "Blended", image: "https://dtmvamahs40ux.cloudfront.net/public/seo-image/seo-image-4228281545-asset-1776435686563 (1).jpeg", eligibleForReferral: true },
  { slug: "ai-for-leaders-course", title: "Artificial Intelligence PG Program for Leaders", provider: "McCombs School of Business at The University of Texas at Austin", providerShort: "UT Austin", durationLabel: "5 months", mode: "Blended", image: "https://dtmvamahs40ux.cloudfront.net/public/seo-image/seo-image-60-aiflcert.jpg", eligibleForReferral: true, aliasSlugs: ["artificial-intelligence-course-for-managers-leaders"] },
  { slug: "iit-bombay-certificate-in-agentic-ai", title: "Certificate in Agentic AI", provider: "IIT Bombay", providerShort: "IIT Bombay", durationLabel: "5 months", mode: "Online", image: "https://dtmvamahs40ux.cloudfront.net/public/seo-image/seo-image-4107473793-IIT-bombay-agentic-ai-completion-certificate (1).webp", eligibleForReferral: true },
  { slug: "certificate-in-ai-engineering-and-mlops", title: "Certificate in AI Engineering and MLOps", provider: "IIT Bombay", providerShort: "IIT Bombay", durationLabel: "5 months", mode: "Online", image: "https://dtmvamahs40ux.cloudfront.net/public/seo-image/seo-image-8916716974-jpeg-optimizer_AI-Engg-MLOps.jpg", eligibleForReferral: true },
  { slug: "iit-bombay-certificate-generative-ai", title: "Certificate in Generative AI", provider: "IIT Bombay", providerShort: "IIT Bombay", durationLabel: "5 months", mode: "Online", image: "https://dtmvamahs40ux.cloudfront.net/public/seo-image/seo-image-3052-iitbimage.jpeg", eligibleForReferral: true },
  { slug: "iit-bombay-certificate-leadership-with-ai", title: "Certificate in Leadership with AI", provider: "IIT Bombay", providerShort: "IIT Bombay", durationLabel: "4 months", mode: "Online", image: "https://dtmvamahs40ux.cloudfront.net/public/seo-image/seo-image-3378351958-IITB leadership final certi.jpg", eligibleForReferral: true },
  { slug: "iit-bombay-supply-chain-analytics-with-ai-ml-applications", title: "Certificate in Supply Chain Analytics with AI and ML Applications", provider: "IIT Bombay", providerShort: "IIT Bombay", durationLabel: "6 months", mode: "Online", image: "https://dtmvamahs40ux.cloudfront.net/public/seo-image/seo-image-3915841634-iitb-supply-chain-analytics-ai.jpg", eligibleForReferral: true },
  { slug: "chief-financial-officer-programme", title: "Chief Financial Officer Programme", provider: "S. P. Jain Institute of Management & Research (SPJIMR)", providerShort: "SPJIMR", durationLabel: "9 months", mode: "Blended", image: "https://dtmvamahs40ux.cloudfront.net/public/seo-image/seo-image-3890296140-asset-1778747839926_optimized_50.jpg", eligibleForReferral: true },
  { slug: "data-analytics-online-powerbi-bootcamp", title: "Data Analytics and Power BI Bootcamp", mode: "Online", image: "https://d1vwxdpzbgdqj.cloudfront.net/images/da_powerbi_bootcamp/da_powerbi_pp.jpg", eligibleForReferral: true },
  { slug: "dba-aiml-online", title: "Doctor Of Business Administration in Artificial Intelligence and Machine Learning", provider: "Walsh College", providerShort: "Walsh College", durationLabel: "36 months", mode: "Online", image: "https://d1vwxdpzbgdqj.cloudfront.net/images/dba_walsh/walsh_dba_certficate.jpg", eligibleForReferral: true },
  { slug: "mba-dba-gm-walsh", title: "Doctor of Business Administration in General Management", provider: "Walsh College", providerShort: "Walsh College", durationLabel: "36 months", mode: "Online", image: "https://d1vwxdpzbgdqj.cloudfront.net/images/dba_walsh/walsh_dba_certficate.jpg", eligibleForReferral: true },
  { slug: "iit-bombay-pg-diploma-ai-data-science", title: "e-Postgraduate Diploma (ePGD) in Artificial Intelligence and Data Science", provider: "IIT Bombay", providerShort: "IIT Bombay", durationLabel: "18 months", mode: "Online", image: "https://dtmvamahs40ux.cloudfront.net/public/seo-image/seo-image-2890-iit-bomaby-pp-banner-image.jpg", eligibleForReferral: true },
  { slug: "iit-bombay-e-postgraduate-diploma-computer-science-engineering", title: "e-Postgraduate Diploma (ePGD) in Computer Science And Engineering", provider: "IIT Bombay", providerShort: "IIT Bombay", durationLabel: "12 months", mode: "Online", image: "https://d1vwxdpzbgdqj.cloudfront.net/images/iit-bombay-pp/iit-bomaby-pp-banner-image.jpg", eligibleForReferral: true },
  { slug: "iit-bombay-e-postgraduate-diploma-e-mobility", title: "e-Postgraduate Diploma in E-Mobility", provider: "IIT Bombay", providerShort: "IIT Bombay", durationLabel: "18 months", mode: "Online", image: "https://dtmvamahs40ux.cloudfront.net/public/seo-image/seo-image-2896-iitb-certificate.jpg", eligibleForReferral: true },
  { slug: "advanced-management-programme-in-ai-leadership", title: "Executive Certificate Program in AI for Business Leaders", provider: "S. P. Jain Institute of Management & Research (SPJIMR)", providerShort: "SPJIMR", durationLabel: "7 months", mode: "Blended", image: "https://dtmvamahs40ux.cloudfront.net/public/seo-image/seo-image-3174-spjimr.jpg", eligibleForReferral: true },
  { slug: "executive-certificate-programme-in-ai-and-gen-ai-for-managers", title: "Executive Certificate Programme in Artificial Intelligence and Generative AI for Managers", provider: "S. P. Jain Institute of Management & Research (SPJIMR)", providerShort: "SPJIMR", durationLabel: "5 months", mode: "Blended", image: "https://dtmvamahs40ux.cloudfront.net/public/seo-image/seo-image-9804008865-jpeg-optimizer_spjimr cert-1.jpg", eligibleForReferral: true },
  { slug: "pg-program-management-executive", title: "Executive PG Program in Management", provider: "Great Lakes Executive Learning", providerShort: "Great Lakes", durationLabel: "12 months", mode: "Online", image: "https://dtmvamahs40ux.cloudfront.net/public/seo-image/seo-image-228-great_lakes_operations (1).jpg", eligibleForReferral: true },
  { slug: "mtech-artificial-intelligence-srm", title: "M.Tech in Artificial Intelligence", mode: "Online", eligibleForReferral: true },
  { slug: "ms-data-science-deakin-programme", title: "Master of Data Science (Global) Program", provider: "Deakin University", providerShort: "Deakin", mode: "Online", image: "https://dtmvamahs40ux.cloudfront.net/public/seo-image/seo-image-1983-deakin_banner_img (1).jpg", eligibleForReferral: true },
  { slug: "walsh-ms-aiml-online", title: "MS in Artificial Intelligence & Machine Learning", provider: "Walsh College", providerShort: "Walsh College", durationLabel: "24 months", mode: "Online", image: "https://dtmvamahs40ux.cloudfront.net/public/seo-image/seo-image-2898-walsh-pp-banner-logo.jpg", eligibleForReferral: true },
  { slug: "ms-data-science-programme", title: "MS in Data Science Programme", provider: "Northwestern University", providerShort: "Northwestern", durationLabel: "18 months", mode: "Blended", image: "https://dtmvamahs40ux.cloudfront.net/public/seo-image/seo-image-275-nu-data-science-banner.jpg", eligibleForReferral: true },
  { slug: "amrita-online-bba", title: "Online BBA from Amrita Vishwa Vidyapeetham", provider: "Amrita Online University", providerShort: "Amrita", durationLabel: "36 months", mode: "Online", image: "https://dtmvamahs40ux.cloudfront.net/public/seo-image/seo-image-3161-asset-1775023852439 (1).jpg", eligibleForReferral: true },
  { slug: "amrita-online-bca", title: "Online BCA from Amrita Vishwa Vidyapeetham", provider: "Amrita Online University", providerShort: "Amrita", durationLabel: "36 months", mode: "Online", image: "https://dtmvamahs40ux.cloudfront.net/public/seo-image/seo-image-1507461771-asset-1769748350106.jpeg", eligibleForReferral: true },
  { slug: "amrita-online-mba", title: "Online MBA from Amrita Vishwa Vidyapeetham", provider: "Amrita Online University", providerShort: "Amrita", durationLabel: "24 months", mode: "Online", image: "https://dtmvamahs40ux.cloudfront.net/public/seo-image/seo-image-0640752736-asset-1769748350106.jpeg", eligibleForReferral: true },
  { slug: "amrita-online-mca", title: "Online MCA from Amrita Vishwa Vidyapeetham", provider: "Amrita Online University", providerShort: "Amrita", durationLabel: "24 months", mode: "Online", image: "https://dtmvamahs40ux.cloudfront.net/public/seo-image/seo-image-3160-asset-1774851620255 (1).jpg", eligibleForReferral: true },
  { slug: "pg-program-artificial-intelligence-course", title: "PG Program in Artificial Intelligence & Machine Learning", provider: "McCombs School of Business at The University of Texas at Austin", providerShort: "UT Austin", durationLabel: "12 months", mode: "Blended", image: "https://dtmvamahs40ux.cloudfront.net/public/seo-image/seo-image-5-aimlcertificate1 (1).jpg", eligibleForReferral: true, aliasSlugs: ["pg-program-online-artificial-intelligence-machine-learning"] },
  { slug: "pg-program-cloud-computing-course", title: "PG Program in Cloud Computing and DevOps", provider: "Great Lakes Executive Learning", providerShort: "Great Lakes", durationLabel: "8 months", mode: "Blended", image: "https://d1vwxdpzbgdqj.cloudfront.net/s3-public-images/thumbnail-assets/Cloud.jpg", eligibleForReferral: true, aliasSlugs: ["pg-program-online-cloud-computing-course"] },
  { slug: "pg-program-data-science-business-analytics-course", title: "Post Graduate Program in Data Science with Generative AI", provider: "McCombs School of Business at The University of Texas at Austin", providerShort: "UT Austin", durationLabel: "12 months", mode: "Online", image: "https://dtmvamahs40ux.cloudfront.net/public/seo-image/seo-image-336-pgp_dsba_gen_ai_ut_certificate.jpg", eligibleForReferral: true, aliasSlugs: ["pg-program-data-science-and-business-analytics-course"] },
  { slug: "gl-pg-program-cloud-computing-course", title: "Post-Graduate Program in Cloud Computing", mode: "Online", image: "https://da6veq5nn7d7b.cloudfront.net/assets/cloud-computing/template-pp-banner-476d618890da248985d0774369ad273c39067d6d397ece4e5d1e358f9d8ca163.jpg", eligibleForReferral: true },
];

/**
 * The four AI-Native Professional programs have their own cards on the Programs
 * tab, each with a ready-made referral link, so they're excluded from the
 * course search to avoid offering the same thing twice.
 */
/**
 * Course for a slug, resolving the alternate paths some programs publish, so a
 * referral link built from an alias still finds its program.
 */
export function findReferableCourse(slug: string): ReferableCourse | undefined {
  return demoReferableCourses.find(
    (c) => c.slug === slug || c.aliasSlugs?.includes(slug),
  );
}

export const AINP_SLUGS = new Set([
  "ai-native-professional",
  "ai-native-professional-for-finance",
  "ai-native-professional-for-hr",
  "ai-native-professional-for-marketing",
]);

/** Courses offered in the course search. */
export const referableCourses = demoReferableCourses.filter(
  (c) => c.eligibleForReferral && !AINP_SLUGS.has(c.slug),
);

/**
 * Programs this guru is listed as a mentor / instructor on, beyond the AINP
 * four. This is a stand-in: no guru→program mentor mapping exists in the demo
 * data, since the Courses page derives "courses you teach" from session records
 * that aren't linked to the catalogue. Drives the "Other courses you teach"
 * carousel, so an empty roster correctly yields its empty state.
 */
export const GURU_MENTORED_SLUGS: readonly string[] = [
  "mit-data-science-and-machine-learning-program",
  "pg-program-artificial-intelligence-course",
  "ms-data-science-programme",
  "iit-bombay-pg-diploma-ai-data-science",
  "ai-for-leaders-course",
  "pg-program-management-executive",
];

/** Courses the carousel shows, in roster order. */
export const guruMentoredCourses = GURU_MENTORED_SLUGS
  .map((slug) => demoReferableCourses.find((c) => c.slug === slug))
  .filter((c): c is ReferableCourse => Boolean(c));
