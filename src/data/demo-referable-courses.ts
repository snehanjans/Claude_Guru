/**
 * Wider Great Learning catalog, searchable from the "recommend another course"
 * flow on the Recommend page.
 *
 * Distinct from `demoAmbassadorPrograms`: those four AINP programs have their own
 * cards with a ready-made referral link, so they are deliberately absent here —
 * this list is the "something else" catalog.
 *
 * `eligibleForReferral` is the gate. Ineligible courses stay in the data (so the
 * shape matches a real catalog feed) but are filtered out of search, because
 * offering a guru a course we can't pay a referral on would be a broken promise.
 */

export interface ReferableCourse {
  id: string;
  title: string;
  /** Short grouping shown under the title to disambiguate similar names. */
  category: string;
  durationLabel: string;
  eligibleForReferral: boolean;
}

export const demoReferableCourses: ReferableCourse[] = [
  // ── Data & AI ──
  { id: "rc-01", title: "PG Program in Data Science and Business Analytics", category: "Data Science", durationLabel: "12 months", eligibleForReferral: true },
  { id: "rc-02", title: "PG Program in Artificial Intelligence and Machine Learning", category: "AI & ML", durationLabel: "12 months", eligibleForReferral: true },
  { id: "rc-03", title: "Deep Learning and Computer Vision", category: "AI & ML", durationLabel: "6 months", eligibleForReferral: true },
  { id: "rc-04", title: "Natural Language Processing and Generative AI", category: "AI & ML", durationLabel: "6 months", eligibleForReferral: true },
  { id: "rc-05", title: "Business Analytics and Data Visualisation", category: "Data Science", durationLabel: "5 months", eligibleForReferral: true },
  { id: "rc-06", title: "Applied Statistics for Data Science", category: "Data Science", durationLabel: "3 months", eligibleForReferral: true },
  // Cohort closed for the year — kept in the feed, excluded from search.
  { id: "rc-07", title: "MIT Data Science and Machine Learning Certificate", category: "Data Science", durationLabel: "12 weeks", eligibleForReferral: false },

  // ── Software & Cloud ──
  { id: "rc-08", title: "PG Program in Software Engineering", category: "Software Engineering", durationLabel: "12 months", eligibleForReferral: true },
  { id: "rc-09", title: "Full Stack Software Development", category: "Software Engineering", durationLabel: "9 months", eligibleForReferral: true },
  { id: "rc-10", title: "Cloud Computing on AWS and Azure", category: "Cloud", durationLabel: "6 months", eligibleForReferral: true },
  { id: "rc-11", title: "DevOps and Site Reliability Engineering", category: "Cloud", durationLabel: "6 months", eligibleForReferral: true },
  { id: "rc-12", title: "Cybersecurity and Ethical Hacking", category: "Cybersecurity", durationLabel: "6 months", eligibleForReferral: true },

  // ── Business & Management ──
  { id: "rc-13", title: "Digital Marketing and Growth Strategy", category: "Marketing", durationLabel: "6 months", eligibleForReferral: true },
  { id: "rc-14", title: "Product Management and Strategy", category: "Management", durationLabel: "6 months", eligibleForReferral: true },
  { id: "rc-15", title: "Project Management Professional Preparation", category: "Management", durationLabel: "4 months", eligibleForReferral: true },
  { id: "rc-16", title: "Financial Analysis and Valuation", category: "Finance", durationLabel: "5 months", eligibleForReferral: true },
  { id: "rc-17", title: "Human Resource Management and People Analytics", category: "Human Resources", durationLabel: "5 months", eligibleForReferral: true },
  { id: "rc-18", title: "Supply Chain and Operations Management", category: "Operations", durationLabel: "6 months", eligibleForReferral: true },
  // Partner-run; referrals handled by the partner, not by us.
  { id: "rc-19", title: "Executive MBA in Business Leadership", category: "Management", durationLabel: "24 months", eligibleForReferral: false },

  // ── Design & Foundations ──
  { id: "rc-20", title: "UI/UX Design and Product Thinking", category: "Design", durationLabel: "5 months", eligibleForReferral: true },
  { id: "rc-21", title: "Excel and SQL for Business Reporting", category: "Data Science", durationLabel: "3 months", eligibleForReferral: true },
  { id: "rc-22", title: "Python Programming for Beginners", category: "Software Engineering", durationLabel: "3 months", eligibleForReferral: true },
];

/** Courses a guru can actually earn a referral on. */
export const referableCourses = demoReferableCourses.filter((c) => c.eligibleForReferral);
