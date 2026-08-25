import { referableCourses, type ReferableCourse } from "@/data/demo-referable-courses";

/**
 * Domain grouping for the course catalogue.
 *
 * Great Learning's program pages don't publish a domain/category field, so this
 * cannot come from the catalogue data — it's a keyword classifier over the
 * course title, applied app-side. Kept here rather than baked into
 * demo-referable-courses.ts so that file stays a faithful mirror of the site,
 * and so replacing this with a real taxonomy is a single-file change.
 *
 * Order matters: the first matching rule wins, so the more specific domains are
 * listed before the broader ones (a "Data Science and Machine Learning" course
 * should land under Data Science, not AI).
 */

export const COURSE_DOMAINS = [
  "MBA and Bachelors",
  "Cyber security",
  "Cloud Computing",
  "Software Development",
  "Digital marketing",
  "Design thinking",
  "Data Science and business analytics",
  "AI and Machine learning",
  "Management",
] as const;

export type CourseDomain = (typeof COURSE_DOMAINS)[number];

const RULES: { domain: CourseDomain; test: RegExp }[] = [
  { domain: "MBA and Bachelors", test: /\b(MBA|BBA|BCA|MCA|bachelor)\b/i },
  { domain: "Cyber security", test: /\b(cyber|security|ethical hacking)\b/i },
  { domain: "Cloud Computing", test: /\b(cloud|devops|aws|azure)\b/i },
  { domain: "Software Development", test: /\b(software engineering|full stack|programming|computer science|e-mobility)\b/i },
  { domain: "Digital marketing", test: /\b(marketing|growth)\b/i },
  { domain: "Design thinking", test: /\b(design|UX|user experience)\b/i },
  { domain: "Data Science and business analytics", test: /\b(data science|analytics|statistics|business analytics|power bi|excel|sql)\b/i },
  { domain: "AI and Machine learning", test: /\b(artificial intelligence|machine learning|generative ai|agentic ai|AI|ML|MLOps)\b/i },
  { domain: "Management", test: /\b(management|leadership|leaders|financial|finance|supply chain|operations|product)\b/i },
];

/** Best-guess domain for a course, or null when nothing matches. */
export function domainFor(course: ReferableCourse): CourseDomain | null {
  const haystack = `${course.title} ${course.provider ?? ""}`;
  for (const { domain, test } of RULES) if (test.test(haystack)) return domain;
  return null;
}

export interface DomainGroup {
  domain: CourseDomain | "Other programs";
  courses: ReferableCourse[];
}

/** Courses grouped by domain, empty domains omitted, "Other" last. */
export function groupByDomain(courses: ReferableCourse[] = referableCourses): DomainGroup[] {
  const buckets = new Map<string, ReferableCourse[]>();
  const other: ReferableCourse[] = [];
  for (const c of courses) {
    const d = domainFor(c);
    if (!d) {
      other.push(c);
      continue;
    }
    const list = buckets.get(d);
    if (list) list.push(c);
    else buckets.set(d, [c]);
  }
  const groups: DomainGroup[] = COURSE_DOMAINS.filter((d) => buckets.has(d)).map((d) => ({
    domain: d,
    courses: buckets.get(d)!,
  }));
  if (other.length) groups.push({ domain: "Other programs", courses: other });
  return groups;
}
