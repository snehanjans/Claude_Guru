/**
 * Share messages for the catalogue courses — the Social Media Kit on a course's
 * referral page.
 *
 * Written for university and partner programs, which is why they aren't the AINP
 * templates in demo-ambassador.ts: those are pitched at "getting started with
 * AI" and name Great Learning as the provider, which reads wrong under a
 * Northwestern MS or an IIT Bombay diploma. These lead with the awarding
 * institution instead, and mention no discount code — the referral data holds no
 * learner promo for these programs, and offering one that doesn't exist would be
 * worse than offering none.
 *
 * Asset ids match demoBroadcastCollateral so the platform logos, the email
 * subject rule and the saved-edit keys are the same on both pages.
 *
 * Placeholders are filled on the page: [program name], [university], [duration],
 * [N learners mentored], plus [first name] and [Your name], which stay in the
 * text for the guru to replace.
 */

export interface CourseCollateralAsset {
  id: string;
  label: string;
  caption: string;
}

export const courseCollateral: CourseCollateralAsset[] = [
  {
    id: "asset-01",
    label: "LinkedIn post",
    caption:
      "I mentor on [program name] from [university], and I get asked about it often enough that it's worth a post.\n\nIt's [duration], built for people who are working full time, and the credential comes from [university] itself. If you're weighing up a serious next step rather than another short course, it's worth a look.\n\nHappy to talk it through if you're deciding — I've mentored [N learners mentored] learners at this point and can tell you honestly whether it fits.",
  },
  {
    id: "asset-02",
    label: "WhatsApp broadcast",
    caption:
      "Sharing something I get asked about a lot: [program name] from [university].\n\nI mentor on it, so I know what's in it. [duration], designed around a full-time job, and the credential is [university]'s own.\n\nIf you're thinking about a serious next step, have a look. Happy to give you an honest read on whether it fits before you decide.",
  },
  {
    id: "asset-03",
    label: "Email intro",
    caption:
      "Hi [first name],\n\nYou mentioned you were thinking about the next step in your career, so this may be useful: [program name] from [university].\n\nI mentor on the program, so I can speak to it first-hand. It runs [duration], it's built around a full-time job, and the credential comes from [university]. I've mentored [N learners mentored] learners so far, and the ones who get the most out of it are the ones who go in with a clear reason.\n\nHappy to talk it through before you decide either way.\n\n[Your name]",
  },
  {
    id: "asset-04",
    label: "Instagram story",
    caption:
      "I mentor on [program name] from [university]. [duration], built for people working full time, credential from [university]. If a serious next step is on your mind, take a look — happy to answer questions.",
  },
];

/** Default subject for the email collateral; editable per course. */
export const COURSE_EMAIL_SUBJECT = "A program worth a look, if a next step is on your mind";
