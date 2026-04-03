type EventParams = Record<string, string | number | boolean | null | undefined>;

const UTM_STORAGE_KEY = "is_utm_attribution";
const SESSION_MARK_KEY = "is_session_marked";
const SESSION_LANDING_KEY = "is_session_landing";

export type SessionLandingSnapshot = {
  landing_path: string;
  landing_page: string;
};

/** First URL in this tab (for GA4 custom dims / debugging). Call once per navigation batch from Layout. */
export function captureSessionLanding(pathname: string, search: string): void {
  if (typeof window === "undefined") return;
  if (sessionStorage.getItem(SESSION_LANDING_KEY)) return;
  const landing_path = `${pathname}${search || ""}`;
  const payload: SessionLandingSnapshot = {
    landing_path,
    landing_page: pathname,
  };
  sessionStorage.setItem(SESSION_LANDING_KEY, JSON.stringify(payload));
}

export function getSessionLandingSnapshot(): SessionLandingSnapshot | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(SESSION_LANDING_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SessionLandingSnapshot;
  } catch {
    return null;
  }
}

type UTMAttribution = {
  source: string;
  medium: string;
  campaign?: string;
  content?: string;
  term?: string;
};

const getAttributionFromReferrer = (): UTMAttribution => {
  const ref = document.referrer || "";
  if (!ref) return { source: "direct", medium: "none" };

  try {
    const refUrl = new URL(ref);
    const host = refUrl.hostname.toLowerCase();
    if (host.includes("google.")) return { source: "google", medium: "organic" };
    if (host.includes("bing.")) return { source: "bing", medium: "organic" };
    if (host.includes("duckduckgo.")) return { source: "duckduckgo", medium: "organic" };
    if (host.includes("yahoo.")) return { source: "yahoo", medium: "organic" };
    return { source: host.replace(/^www\./, ""), medium: "referral" };
  } catch {
    return { source: "referrer", medium: "referral" };
  }
};

export function captureUtmFromUrl(search: string): void {
  const params = new URLSearchParams(search);
  const source = params.get("utm_source");
  const medium = params.get("utm_medium");
  const campaign = params.get("utm_campaign");
  const content = params.get("utm_content");
  const term = params.get("utm_term");

  const hasUTM = !!(source || medium || campaign || content || term);
  if (hasUTM) {
    const normalizedSource = (source || "unknown").toLowerCase();
    const inferredMedium =
      medium ||
      (["tiktok", "reddit", "instagram", "facebook", "x", "twitter", "youtube", "pinterest"].includes(normalizedSource)
        ? "social"
        : undefined);
    const data: UTMAttribution = {
      source: normalizedSource,
      medium: (inferredMedium || "unknown").toLowerCase(),
      campaign: campaign || undefined,
      content: content || undefined,
      term: term || undefined,
    };
    localStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(data));
    return;
  }

  // First-touch fallback attribution to reduce unattributed events.
  if (!localStorage.getItem(UTM_STORAGE_KEY)) {
    localStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(getAttributionFromReferrer()));
  }
}

export function getStoredAttribution(): UTMAttribution {
  try {
    const raw = localStorage.getItem(UTM_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as UTMAttribution;
      if (parsed?.source && parsed?.medium) return parsed;
    }
  } catch {
    // ignore malformed storage and fallback below
  }
  return getAttributionFromReferrer();
}

export function trackEvent(name: string, params?: EventParams): void {
  if (typeof window.gtag !== "function") return;
  const attr = getStoredAttribution();
  window.gtag("event", name, {
    source: attr.source,
    medium: attr.medium,
    campaign: attr.campaign,
    content: attr.content,
    term: attr.term,
    ...params,
  });
}

export function trackPageView(path: string): void {
  if (typeof window.gtag !== "function") return;
  const attr = getStoredAttribution();
  const land = getSessionLandingSnapshot();
  window.gtag("event", "page_view", {
    page_path: path,
    session_landing_page: land?.landing_path,
    source: attr.source,
    medium: attr.medium,
    campaign: attr.campaign,
    content: attr.content,
    term: attr.term,
  });
}

export function markSessionOnce(): void {
  if (sessionStorage.getItem(SESSION_MARK_KEY)) return;
  sessionStorage.setItem(SESSION_MARK_KEY, "1");
  const landing = getSessionLandingSnapshot();
  const landing_page =
    landing?.landing_path ||
    (typeof window !== "undefined" ? `${window.location.pathname}${window.location.search}` : "/");
  trackEvent("session_started", { landing_page });
}


