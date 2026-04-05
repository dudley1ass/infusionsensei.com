import { useMemo, useState } from "react";
import { Link2, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import {
  buildTrackedUrl,
  campaignForSocialPlatform,
  TRACKED_DESTINATIONS,
  UTM_CAMPAIGN_OPTIONS,
  type UtmCampaign,
  type UtmSource,
} from "../utils/utmLinks";
import { trackEvent } from "../utils/analytics";

const PLATFORMS: { source: UtmSource; label: string }[] = [
  { source: "tiktok", label: "Copy TikTok link" },
  { source: "pinterest", label: "Copy Pinterest link" },
  { source: "reddit", label: "Copy Reddit link" },
];

type Props = {
  /** Where to show this block (for analytics). */
  placement?: string;
};

export function UtmShareLinks({ placement = "edibles-calculator" }: Props) {
  const [destIndex, setDestIndex] = useState(0);
  const [campaign, setCampaign] = useState<UtmCampaign>(TRACKED_DESTINATIONS[0].defaultCampaign ?? "launch");
  const [content, setContent] = useState("");
  const [lastCopied, setLastCopied] = useState<UtmSource | null>(null);

  const dest = TRACKED_DESTINATIONS[destIndex] ?? TRACKED_DESTINATIONS[0];

  const syncCampaignToDestination = (index: number) => {
    const d = TRACKED_DESTINATIONS[index];
    if (d) setCampaign(d.defaultCampaign);
  };

  const urls = useMemo(() => {
    const c = content.trim() || undefined;
    return {
      tiktok: buildTrackedUrl(dest.path, {
        source: "tiktok",
        campaign: campaignForSocialPlatform("tiktok", campaign),
        content: c,
      }),
      pinterest: buildTrackedUrl(dest.path, {
        source: "pinterest",
        campaign: campaignForSocialPlatform("pinterest", campaign),
        content: c,
      }),
      reddit: buildTrackedUrl(dest.path, {
        source: "reddit",
        campaign: campaignForSocialPlatform("reddit", campaign),
        content: c,
      }),
    };
  }, [dest.path, campaign, content]);

  const copy = async (source: UtmSource) => {
    const text = urls[source];
    const effectiveCampaign = campaignForSocialPlatform(source, campaign);
    try {
      await navigator.clipboard.writeText(text);
      setLastCopied(source);
      setTimeout(() => setLastCopied(null), 2000);
      toast.success("Link copied — paste in bio or post");
      trackEvent("utm_link_copied", {
        placement,
        utm_source: source,
        utm_campaign: effectiveCampaign,
        utm_campaign_selected: campaign,
        utm_content: content.trim() || undefined,
        destination_path: dest.path,
      });
    } catch {
      toast.error("Could not copy — select the URL manually");
    }
  };

  return (
    <section className="rounded-2xl border-2 border-amber-200 bg-amber-50/80 p-6 shadow-sm">
      <div className="flex items-start gap-3 mb-4">
        <div className="rounded-full bg-amber-100 p-2 shrink-0">
          <Link2 className="w-5 h-5 text-amber-800" />
        </div>
        <div>
          <h2 className="text-lg font-black text-gray-900">Share with tracking (UTM)</h2>
          <p className="text-sm text-gray-600 mt-1">
            <strong className="text-gray-800">Strict format:</strong> TikTok &amp; Reddit copy uses{" "}
            <code className="text-xs bg-white px-1 rounded">utm_medium=social</code> +{" "}
            <code className="text-xs bg-white px-1 rounded">utm_campaign=launch</code>. Pinterest copy uses{" "}
            <code className="text-xs bg-white px-1 rounded">utm_campaign=recipes</code> (unless you pick a test campaign
            below). In-app browsers often strip referrer — UTMs are the reliable signal. Use{" "}
            <strong className="text-gray-800">content</strong> for post variants (e.g.{" "}
            <code className="text-xs bg-white px-1 rounded">v1</code>).
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        <div>
          <Label className="text-xs font-bold text-gray-700">Landing page (match your hook)</Label>
          <select
            className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
            value={destIndex}
            onChange={(e) => {
              const i = Number(e.target.value);
              setDestIndex(i);
              syncCampaignToDestination(i);
            }}
          >
            {TRACKED_DESTINATIONS.map((d, i) => (
              <option key={d.path} value={i}>
                {d.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label className="text-xs font-bold text-gray-700">utm_campaign (override — TT/Reddit default launch, Pinterest default recipes)</Label>
          <select
            className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
            value={campaign}
            onChange={(e) => setCampaign(e.target.value as UtmCampaign)}
          >
            {UTM_CAMPAIGN_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-4">
        <Label htmlFor="utm-content" className="text-xs font-bold text-gray-700">
          utm_content (optional — version / hook)
        </Label>
        <Input
          id="utm-content"
          className="mt-1"
          placeholder="e.g. v1, hook_mg_per_piece"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      <div className="flex flex-col sm:flex-row flex-wrap gap-2">
        {PLATFORMS.map(({ source, label }) => (
          <Button
            key={source}
            type="button"
            variant="outline"
            className="border-amber-300 bg-white text-amber-950 hover:bg-amber-100 font-bold"
            onClick={() => copy(source)}
          >
            {lastCopied === source ? (
              <Check className="w-4 h-4 mr-2 text-green-600" />
            ) : (
              <Copy className="w-4 h-4 mr-2" />
            )}
            {label}
          </Button>
        ))}
      </div>

      <div className="text-xs text-gray-500 mt-3 space-y-1 font-mono break-all">
        <p>TikTok: {urls.tiktok}</p>
        <p>Pinterest: {urls.pinterest}</p>
        <p>Reddit: {urls.reddit}</p>
      </div>
    </section>
  );
}
