import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Copy, CheckCheck } from "lucide-react";

const PAGES = [
  { label: "🏠 Homepage", path: "/" },
  { label: "🍗 Wing Sauces", path: "/wings" },
  { label: "🍿 Popcorn", path: "/popcorn" },
  { label: "☕ Coffee", path: "/coffee" },
  { label: "🍟 Fries", path: "/fries" },
  { label: "📖 Recipes", path: "/recipes" },
  { label: "🧪 My Infusions", path: "/infusions" },
  { label: "🔧 Create Recipe", path: "/ingredients" },
  { label: "📚 Learn", path: "/learn" },
];

const SOURCES = [
  { label: "TikTok", value: "tiktok", medium: "social" },
  { label: "Instagram", value: "instagram", medium: "social" },
  { label: "Reddit", value: "reddit", medium: "social" },
  { label: "Pinterest", value: "pinterest", medium: "social" },
  { label: "Facebook", value: "facebook", medium: "social" },
  { label: "Twitter/X", value: "twitter", medium: "social" },
  { label: "YouTube", value: "youtube", medium: "social" },
  { label: "Google Organic", value: "google", medium: "organic" },
  { label: "Google Ads", value: "google", medium: "cpc" },
  { label: "Email", value: "email", medium: "email" },
  { label: "Direct / Bio Link", value: "direct", medium: "referral" },
];

const PRESET_CAMPAIGNS = [
  "wing-sauces-launch", "popcorn-launch", "coffee-launch", "fries-launch",
  "thc-calculator", "recipe-builder", "weekly-post", "viral-content"
];

export function UTMBuilder() {
  const [page, setPage] = useState("/");
  const [source, setSource] = useState("tiktok");
  const [medium, setMedium] = useState("social");
  const [campaign, setCampaign] = useState("");
  const [content, setContent] = useState("");
  const [copied, setCopied] = useState(false);

  const selectedSource = SOURCES.find(s => s.value === source && s.medium === medium) || SOURCES[0];

  const buildURL = () => {
    const base = `https://infusionsensei.com${page}`;
    const params = new URLSearchParams();
    params.set("utm_source", source);
    params.set("utm_medium", medium);
    if (campaign) params.set("utm_campaign", campaign);
    if (content) params.set("utm_content", content);
    return `${base}?${params.toString()}`;
  };

  const url = buildURL();

  const copy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <Helmet><title>UTM Link Builder | Infusion Sensei</title></Helmet>

      <div className="bg-gradient-to-br from-green-700 to-green-900 rounded-3xl p-8 text-white">
        <h1 className="text-3xl font-black mb-2">🔗 UTM Link Builder</h1>
        <p className="text-green-200">Build tracked links for every post so GA shows TikTok, Reddit, Instagram — not "not set".</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-6">

        {/* Page */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">1. Which page are you linking to?</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {PAGES.map(p => (
              <button key={p.path} onClick={() => setPage(p.path)}
                className={`px-3 py-2 rounded-xl text-sm font-semibold border-2 transition-all text-left ${page === p.path ? "bg-green-600 text-white border-green-600" : "border-gray-200 text-gray-700 hover:border-green-400"}`}>
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Source */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">2. Where are you posting?</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {SOURCES.map(s => (
              <button key={`${s.value}-${s.medium}`}
                onClick={() => { setSource(s.value); setMedium(s.medium); }}
                className={`px-3 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${source === s.value && medium === s.medium ? "bg-blue-600 text-white border-blue-600" : "border-gray-200 text-gray-700 hover:border-blue-400"}`}>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Campaign */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">3. Campaign name <span className="text-gray-400 font-normal">(optional but recommended)</span></label>
          <div className="flex flex-wrap gap-2 mb-2">
            {PRESET_CAMPAIGNS.map(c => (
              <button key={c} onClick={() => setCampaign(c)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${campaign === c ? "bg-gray-800 text-white border-gray-800" : "border-gray-200 text-gray-600 hover:border-gray-400"}`}>
                {c}
              </button>
            ))}
          </div>
          <input value={campaign} onChange={e => setCampaign(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
            placeholder="or type your own e.g. holiday-sale"
            className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-400" />
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">4. Content label <span className="text-gray-400 font-normal">(optional — use to A/B test posts)</span></label>
          <input value={content} onChange={e => setContent(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
            placeholder="e.g. video-1, bio-link, story-swipe"
            className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-400" />
        </div>
      </div>

      {/* Output */}
      <div className="bg-gray-950 rounded-2xl p-5 border border-gray-800">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Your Tracked Link</p>
          <button onClick={copy} className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${copied ? "bg-green-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}>
            {copied ? <><CheckCheck className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy Link</>}
          </button>
        </div>
        <p className="text-green-400 text-sm font-mono break-all">{url}</p>
      </div>

      {/* What you'll see in GA */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h2 className="font-black text-gray-900 mb-4">📊 What you'll see in Google Analytics</h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Source", value: source },
            { label: "Medium", value: medium },
            { label: "Campaign", value: campaign || "(not set)" },
            { label: "Content", value: content || "(not set)" },
          ].map(({label, value}) => (
            <div key={label} className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-500 font-semibold uppercase">{label}</p>
              <p className={`font-black text-sm mt-0.5 ${value === "(not set)" ? "text-gray-400" : "text-green-700"}`}>{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-sm font-bold text-blue-800 mb-2">📍 Where to find this in GA4</p>
          <p className="text-xs text-blue-700">Reports → Acquisition → Traffic Acquisition → Session source/medium</p>
          <p className="text-xs text-blue-700 mt-1">Or: Reports → Acquisition → Traffic Acquisition → Session campaign</p>
        </div>
      </div>

      {/* UTM cheat sheet */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h2 className="font-black text-gray-900 mb-4">🧠 UTM Quick Reference</h2>
        <div className="space-y-2 text-sm">
          {[
            { post: "TikTok bio link → Homepage", url: `https://infusionsensei.com/?utm_source=tiktok&utm_medium=social&utm_campaign=bio-link` },
            { post: "TikTok video → Wing Sauces", url: `https://infusionsensei.com/wings?utm_source=tiktok&utm_medium=social&utm_campaign=wing-sauces-launch` },
            { post: "Reddit post → Popcorn", url: `https://infusionsensei.com/popcorn?utm_source=reddit&utm_medium=social&utm_campaign=popcorn-launch` },
            { post: "Instagram story → THC Calculator", url: `https://infusionsensei.com/ingredients?utm_source=instagram&utm_medium=social&utm_campaign=thc-calculator` },
            { post: "Pinterest pin → Recipe page", url: `https://infusionsensei.com/recipes?utm_source=pinterest&utm_medium=social&utm_campaign=recipe-pins` },
          ].map(({post, url}) => (
            <div key={post} className="bg-gray-50 rounded-xl p-3">
              <p className="font-semibold text-gray-700 text-xs mb-1">{post}</p>
              <div className="flex items-center gap-2">
                <p className="text-green-700 font-mono text-xs flex-1 break-all">{url}</p>
                <button onClick={() => { navigator.clipboard.writeText(url); }} className="flex-shrink-0 text-xs bg-gray-200 hover:bg-green-100 text-gray-600 hover:text-green-700 px-2 py-1 rounded-lg transition-colors">Copy</button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
