/**
 * Per-program intro clips for the program referral page banner.
 *
 * Deliberately not the shared "how referrals work" set: a guru opening the
 * AI-Native HR page wants to know what *that* program is, not how the scheme
 * works. Keyed by program id, so adding a program means adding its clip here
 * rather than touching the page.
 *
 * The files under public/videos are placeholders generated for this prototype
 * (silent, with caption tracks). Replacing one is a file swap — keep a poster
 * and a .vtt beside every clip.
 *
 * A program with no entry simply shows no video panel; the banner is built to
 * cope with that rather than falling back to an unrelated clip.
 */

import type { GuruVideo } from "@/data/demo-guru-videos";

const base = "/videos";

const clip = (id: string, slug: string, title: string, blurb: string): GuruVideo => ({
  id,
  title,
  blurb,
  src: `${base}/${slug}.webm`,
  poster: `${base}/${slug}.jpg`,
  captions: `${base}/${slug}.vtt`,
  durationSec: 5,
});

export const programVideos: Record<string, GuruVideo> = {
  "ai-native-professional": clip(
    "program-ai-native-professional",
    "gl-program-ai-native-professional",
    "Inside AI-Native Professional",
    "What the program covers, and who it's for.",
  ),
  "ainp-hr": clip(
    "program-ainp-hr",
    "gl-program-ainp-hr",
    "Inside AI-Native HR Professional",
    "What the program covers, and who it's for.",
  ),
  "ainp-marketing": clip(
    "program-ainp-marketing",
    "gl-program-ainp-marketing",
    "Inside AI-Native Marketing Professional",
    "What the program covers, and who it's for.",
  ),
  "ainp-finance": clip(
    "program-ainp-finance",
    "gl-program-ainp-finance",
    "Inside AI-Native Finance Professional",
    "What the program covers, and who it's for.",
  ),
};

/** This program's intro clip, if one has been recorded. */
export const programVideoFor = (programId: string): GuruVideo | undefined => programVideos[programId];
