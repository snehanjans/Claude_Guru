/**
 * Vimeo Player SDK loading, shared by every surface that embeds a clip.
 *
 * The script is fetched once and shared through a single promise. Two players
 * mounting at the same time — the Home card's muted preview and the modal, say
 * — would otherwise each append the script and race.
 */

export interface VimeoPlayer {
  on: (event: string, cb: () => void) => void;
  destroy: () => Promise<void>;
}

export interface VimeoPlayerOptions {
  id: number;
  autoplay?: boolean;
  responsive?: boolean;
  dnt?: boolean;
  title?: boolean;
  byline?: boolean;
  portrait?: boolean;
  pip?: boolean;
  transparent?: boolean;
  /**
   * Vimeo's "background" mode: autoplays, loops, mutes, and hides every last
   * piece of player chrome. Exactly a preview tile, and the one way to get a
   * clean frame on a free account — at the cost of controls and audio, which
   * is why it belongs on the card and not in the modal.
   */
  background?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
}

export type VimeoPlayerCtor = new (
  el: HTMLElement,
  opts: VimeoPlayerOptions,
) => VimeoPlayer;

declare global {
  interface Window {
    Vimeo?: { Player: VimeoPlayerCtor };
  }
}

let sdkPromise: Promise<VimeoPlayerCtor> | null = null;

export function loadVimeoSdk(): Promise<VimeoPlayerCtor> {
  if (window.Vimeo?.Player) return Promise.resolve(window.Vimeo.Player);
  if (sdkPromise) return sdkPromise;

  sdkPromise = new Promise<VimeoPlayerCtor>((resolve, reject) => {
    const tag = document.createElement("script");
    tag.src = "https://player.vimeo.com/api/player.js";
    tag.onload = () => resolve((window.Vimeo as { Player: VimeoPlayerCtor }).Player);
    tag.onerror = () => {
      /* Let the next caller try again rather than caching the failure. */
      sdkPromise = null;
      reject(new Error("Vimeo SDK failed to load"));
    };
    document.head.appendChild(tag);
  });
  return sdkPromise;
}

/**
 * Sizing for a container whose iframe is injected by the SDK.
 *
 * It has to live on the wrapper, not the node handed to the SDK: that node is
 * the SDK's to own, and the iframe it injects carries its own width/height
 * attributes, which overflow whatever is around it. Styling `& iframe` from
 * the parent is what actually constrains it.
 */
export const vimeoFrameSx = {
  position: "relative" as const,
  width: "100%",
  aspectRatio: "16 / 9",
  overflow: "hidden",
  "& iframe": {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    border: 0,
    display: "block",
  },
  /* `responsive: true` adds a padding-top wrapper of its own; the absolutely
     positioned iframe above does the work, so flatten it. */
  "& > div": { position: "static", paddingTop: "0 !important" },
};
