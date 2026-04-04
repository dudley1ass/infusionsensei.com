/** Production site — UTM links must use this origin so GA4 attributes sessions consistently. */
export const SITE_ORIGIN = "https://infusionsensei.com";

/** Fixed framework: keep `utm_campaign` values stable week-over-week for comparable reports. */
export const UTM_MEDIUM_SOCIAL = "social" as const;

export type UtmSource = "tiktok" | "pinterest" | "reddit";

/** Stable campaign buckets — do not rename weekly (use `utm_content` for variants). */
export type UtmCampaign = "calculator" | "brownies" | "popcorn" | "party" | "recipes";

export type TrackedDestination = {
  path: string;
  label: string;
  /** Suggested default campaign for intent matching (overridable in UI). */
  defaultCampaign: UtmCampaign;
};

/** High-intent landing pages — match post hook to destination to reduce bounce. */
export const TRACKED_DESTINATIONS: TrackedDestination[] = [
  { path: "/edibles-calculator", label: "Edibles calculator", defaultCampaign: "calculator" },
  { path: "/ingredients", label: "Start Here (ingredients)", defaultCampaign: "calculator" },
  { path: "/recipes", label: "Recipe library", defaultCampaign: "recipes" },
  { path: "/recipes/brownies", label: "Brownies (recipe page)", defaultCampaign: "brownies" },
  { path: "/popcorn", label: "Popcorn builder", defaultCampaign: "popcorn" },
  { path: "/party-mode", label: "Party mode", defaultCampaign: "party" },
];

export const UTM_CAMPAIGN_OPTIONS: { value: UtmCampaign; label: string }[] = [
  { value: "calculator", label: "calculator" },
  { value: "brownies", label: "brownies" },
  { value: "popcorn", label: "popcorn" },
  { value: "party", label: "party" },
  { value: "recipes", label: "recipes" },
];

/**
 * Build a full HTTPS URL with UTM params. Always use for TikTok / Pinterest / Reddit bio & posts
 * (in-app browsers often strip referrer — UTMs are the reliable signal).
 */
export function buildTrackedUrl(
  pathname: string,
  opts: { source: UtmSource; campaign: UtmCampaign; content?: string }
): string {
  const u = new URL(pathname.startsWith("/") ? pathname : `/${pathname}`, SITE_ORIGIN);
  u.searchParams.set("utm_source", opts.source);
  u.searchParams.set("utm_medium", UTM_MEDIUM_SOCIAL);
  u.searchParams.set("utm_campaign", opts.campaign);
  const c = opts.content?.trim();
  if (c) u.searchParams.set("utm_content", c);
  return u.toString();
}
