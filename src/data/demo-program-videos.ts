/**
 * Per-program clips for the program referral page banner.
 *
 * Deliberately not the shared "how referrals work" set: a guru opening the
 * AI-Native HR page wants to know what *that* program is, and how to talk about
 * it. Each program has two — what the program covers, then how to pitch it —
 * and the banner's thumbnail opens both in the shared player.
 *
 * Keyed by program id, so adding a program means adding its clips here rather
 * than touching the page. The list is what drives the player: give a program
 * one clip and the modal drops its navigation; give it three and it gains a
 * step. A program with no entry shows no video panel at all.
 *
 * The files under public/videos are placeholders generated for this prototype
 * (silent, with caption tracks). Replacing one is a file swap — keep a poster
 * and a .vtt beside every clip.
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

const set = (programId: string, slugPart: string, label: string): GuruVideo[] => [
  clip(
    `program-${programId}-intro`,
    `gl-program-${slugPart}`,
    `Inside ${label}`,
    "What the program covers, and who it's for.",
  ),
  clip(
    `program-${programId}-pitch`,
    `gl-pitch-${slugPart}`,
    `How to pitch ${label}`,
    "Who it fits, and what to say when you share it.",
  ),
];

export const programVideos: Record<string, GuruVideo[]> = {
  "ai-native-professional": set(
    "ai-native-professional",
    "ai-native-professional",
    "AI-Native Professional",
  ),
  "ainp-hr": set("ainp-hr", "ainp-hr", "AI-Native HR Professional"),
  "ainp-marketing": set("ainp-marketing", "ainp-marketing", "AI-Native Marketing Professional"),
  "ainp-finance": set("ainp-finance", "ainp-finance", "AI-Native Finance Professional"),
};

/** This program's clips, in the order the player steps through them. */
export const programVideosFor = (programId: string): GuruVideo[] => programVideos[programId] ?? [];
