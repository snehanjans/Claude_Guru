/**
 * Scroll memory, so leaving a page and coming back doesn't dump the guru at the
 * top of it. Session-scoped (sessionStorage): per tab, cleared when it closes.
 *
 * Two mechanisms, because "where was I" has two different answers:
 *
 * - `rememberSection` / `takeSection` — an anchor. A section records that the
 *   guru left from it, and scrolls itself back into view when they next land on
 *   the page. Used where the page has one obvious place to return to. It's
 *   immune to async content: the section scrolls when it mounts, so a late
 *   fetch or a collapsed panel can't misplace it, which a saved pixel offset
 *   can. Read is one-shot — a later visit starts at the top as usual.
 *
 * - `useScrollMemory` — a pixel offset for a named scroller. Used where there's
 *   no single anchor, only a long list the guru was some way down.
 */

import { useEffect } from "react";

const SECTION_KEY = "guru-return-section";
const OFFSET_PREFIX = "guru-scroll:";

/* ── Section anchor ───────────────────────────────────────────────────────── */

/** Record that the guru is leaving `path` from the section with id `id`. */
export function rememberSection(path: string, id: string): void {
  try {
    sessionStorage.setItem(SECTION_KEY, `${path}#${id}`);
  } catch {
    // Private mode / storage full. Losing the position is not worth throwing.
  }
}

/**
 * The section to return to on `path`, if one was recorded. Consumes it, so it
 * only ever applies to the next arrival.
 */
export function takeSection(path: string): string | null {
  try {
    const raw = sessionStorage.getItem(SECTION_KEY);
    if (!raw) return null;
    const [storedPath, id] = raw.split("#");
    if (storedPath !== path || !id) return null;
    sessionStorage.removeItem(SECTION_KEY);
    return id;
  } catch {
    return null;
  }
}

/* ── Top of page ──────────────────────────────────────────────────────────── */

/**
 * Put `el` back at the top of whatever scrolls it.
 *
 * Client-side navigation doesn't reset scroll: the app's scroller is a
 * long-lived element around the router outlet, so a page opened from halfway
 * down another one inherits that offset. Walks up from the element rather than
 * reaching for a known selector, so it holds wherever the page is mounted, and
 * resets the window too for the mobile layout, where the document scrolls.
 */
export function scrollToTop(el: HTMLElement | null): void {
  for (let node = el?.parentElement; node; node = node.parentElement) {
    const overflow = getComputedStyle(node).overflowY;
    if ((overflow === "auto" || overflow === "scroll") && node.scrollTop > 0) node.scrollTop = 0;
  }
  if (window.scrollY > 0) window.scrollTo({ top: 0, behavior: "auto" });
}

/* ── Pixel offset ─────────────────────────────────────────────────────────── */

function read(key: string): number {
  try {
    const n = Number(sessionStorage.getItem(OFFSET_PREFIX + key));
    return Number.isFinite(n) && n > 0 ? n : 0;
  } catch {
    return 0;
  }
}

function write(key: string, top: number): void {
  try {
    sessionStorage.setItem(OFFSET_PREFIX + key, String(Math.round(top)));
  } catch {
    /* see rememberSection */
  }
}

/**
 * Remember and restore `scroller`'s offset under `key`.
 *
 * `getScroller` is called rather than taking an element because the page that
 * uses this scrolls its own container on desktop and defers to the window on
 * mobile — which of the two is live depends on the viewport.
 */
export function useScrollMemory(key: string, getScroller: () => HTMLElement | Window | null): void {
  useEffect(() => {
    const target = getScroller();
    if (!target) return;
    const isWindow = target === window;
    const el = isWindow ? document.documentElement : (target as HTMLElement);
    const scrollTo = (top: number) =>
      isWindow ? window.scrollTo({ top, behavior: "auto" }) : ((target as HTMLElement).scrollTop = top);

    /*
     * Restore across a few frames. The saved offset can exceed the scroll range
     * on the first frame — images and lazy sections are still settling — and a
     * single attempt would land short. Stops as soon as the offset takes, or
     * after ~10 frames, so a genuinely shorter page just ends up at its bottom
     * rather than retrying forever.
     */
    const want = read(key);
    let frame = 0;
    let raf = 0;
    if (want > 0) {
      const attempt = () => {
        scrollTo(want);
        const now = isWindow ? window.scrollY : el.scrollTop;
        if (Math.abs(now - want) > 2 && frame++ < 10) raf = requestAnimationFrame(attempt);
      };
      raf = requestAnimationFrame(attempt);
    }

    // Saved as it happens rather than on unmount: a route change can tear the
    // scroller down before the cleanup reads it.
    let pending = 0;
    const onScroll = () => {
      if (pending) return;
      pending = requestAnimationFrame(() => {
        pending = 0;
        write(key, isWindow ? window.scrollY : el.scrollTop);
      });
    };
    const source: HTMLElement | Window = isWindow ? window : (target as HTMLElement);
    source.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      if (pending) cancelAnimationFrame(pending);
      source.removeEventListener("scroll", onScroll);
    };
    // getScroller is a fresh closure each render; the key identifies the page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
}
