/** Production site — UTM links must use this origin so GA4 attributes sessions consistently. */
export const SITE_ORIGIN = "https://infusionsensei.com";

/** Fixed framework: keep `utm_campaign` values stable week-over-week for comparable reports. */
export const UTM_MEDIUM_SOCIAL = "social" as const;

export type UtmSource = "tiktok" | "pinterest" | "reddit";

/** Stable campaign buckets — do not rename weekly (use `utm_content` for variants). */
export type UtmCampaign =
  | "calculator"
  | "brownies"
  | "popcorn"
  | "party"
  | "recipes"
  | "launch"
  /** Granular tests — use with matching platform (see `campaignForSocialPlatform`). */
  | "reddit_wings_post"
  | "reddit_party_post"
  | "pinterest_popcorn";

/** Internal navigation: GA4 reads these on the next page load (source / medium / campaign). */
export type InternalUtmCampaign = "builder" | "recipes";

export type TrackedDestination = {
  path: string;
  label: string;
  /** Suggested default campaign for intent matching (overridable in UI). */
  defaultCampaign: UtmCampaign;
};

/** High-intent landing pages — match post hook to destination to reduce bounce. */
export const TRACKED_DESTINATIONS: TrackedDestination[] = [
  { path: "/edibles-calculator", label: "Edibles calculator", defaultCampaign: "launch" },
  { path: "/ingredients", label: "Start Here (ingredients)", defaultCampaign: "launch" },
  { path: "/recipes", label: "Recipe library", defaultCampaign: "recipes" },
  { path: "/recipes/brownies", label: "Brownies (recipe page)", defaultCampaign: "brownies" },
  { path: "/popcorn", label: "Popcorn builder", defaultCampaign: "popcorn" },
  { path: "/party-mode", label: "Party mode", defaultCampaign: "party" },
];

export const UTM_CAMPAIGN_OPTIONS: { value: UtmCampaign; label: string }[] = [
  { value: "launch", label: "launch (TikTok + Reddit default)" },
  { value: "recipes", label: "recipes (Pinterest default)" },
  { value: "calculator", label: "calculator" },
  { value: "brownies", label: "brownies" },
  { value: "popcorn", label: "popcorn" },
  { value: "party", label: "party" },
  { value: "reddit_wings_post", label: "reddit_wings_post" },
  { value: "reddit_party_post", label: "reddit_party_post" },
  { value: "pinterest_popcorn", label: "pinterest_popcorn" },
];

/**
 * Strict social defaults: Reddit + TikTok → `launch`, Pinterest → `recipes`.
 * User-selected granular test campaigns pass through unchanged.
 */
export function campaignForSocialPlatform(source: UtmSource, selected: UtmCampaign): UtmCampaign {
  const granular: UtmCampaign[] = ["reddit_wings_post", "reddit_party_post", "pinterest_popcorn"];
  if (granular.includes(selected)) return selected;
  if (source === "pinterest") return "recipes";
  return "launch";
}

/**
 * Append internal attribution for in-app CTAs (`utm_source=internal`, `utm_medium=cta`).
 * Use `campaign=builder` for recipe builder / infusions; `recipes` for library navigation.
 */
export function appendInternalUtmToPath(
  pathWithSearch: string,
  opts?: { campaign?: InternalUtmCampaign; content?: string }
): string {
  const raw = pathWithSearch.startsWith("/") ? pathWithSearch : `/${pathWithSearch}`;
  const u = new URL(raw, SITE_ORIGIN);
  u.searchParams.set("utm_source", "internal");
  u.searchParams.set("utm_medium", "cta");
  u.searchParams.set("utm_campaign", opts?.campaign ?? "builder");
  const c = opts?.content?.trim();
  if (c) u.searchParams.set("utm_content", c);
  return u.pathname + u.search;
}

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
