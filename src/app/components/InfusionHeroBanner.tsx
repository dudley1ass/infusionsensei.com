import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { ChevronDown, Star, FlaskConical, BookOpen, Leaf } from 'lucide-react';

const STAT_ITEMS = [
  { icon: '🌿', value: '20+',   label: 'Strain Profiles' },
  { icon: '🍳', value: '10',    label: 'Tested Recipes' },
  { icon: '⚗️',  value: 'Live',  label: 'THC Calculator' },
  { icon: '📋', value: 'FDA',   label: 'Nutrition Facts' },
];

const FEATURE_PILLS = [
  { emoji: '🌿', text: 'Strain Selector' },
  { emoji: '⚗️',  text: 'Live THC Dosing Calculator' },
  { emoji: '🧈', text: 'Cannabutter & Oil Builder' },
  { emoji: '📖', text: 'Recipe Library' },
  { emoji: '📋', text: 'FDA Nutrition Label' },
  { emoji: '🔬', text: 'Decarb Science Guide' },
  { emoji: '🍪', text: 'Edibles · Drinks · Infusions' },
  { emoji: '🎓', text: 'Beginner to Advanced' },
];

interface InfusionHeroBannerProps {
  onScrollDown: () => void;
}

export function InfusionHeroBanner({ onScrollDown }: InfusionHeroBannerProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      const hero = heroRef.current;
      if (!hero) return;
      const rect = hero.getBoundingClientRect();
      setMousePos({
        x: ((e.clientX - rect.left) / rect.width - 0.5) * 16,
        y: ((e.clientY - rect.top) / rect.height - 0.5) * 10,
      });
    };
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);

  const particles = [
    { w: 10, h: 10, top: '22%', left: '6%',   bg: 'rgba(34,197,94,0.2)',  anim: 'infFloat1 7s ease-in-out infinite', delay: '0s' },
    { w: 6,  h: 6,  top: '62%', left: '5%',   bg: 'rgba(22,163,74,0.25)', anim: 'infFloat2 5s ease-in-out infinite', delay: '1.2s' },
    { w: 14, h: 14, top: '20%', right: '7%',  bg: 'rgba(20,83,45,0.2)',   anim: 'infFloat1 8s ease-in-out infinite', delay: '0.5s' },
    { w: 7,  h: 7,  top: '70%', right: '9%',  bg: 'rgba(34,197,94,0.2)',  anim: 'infFloat2 6s ease-in-out infinite', delay: '2s' },
    { w: 5,  h: 5,  top: '45%', left: '13%',  bg: 'rgba(22,163,74,0.18)', anim: 'infFloat1 9s ease-in-out infinite', delay: '1.5s' },
    { w: 9,  h: 9,  top: '16%', right: '24%', bg: 'rgba(20,83,45,0.15)',  anim: 'infFloat2 7s ease-in-out infinite', delay: '3s' },
  ];

  return (
    <>
      <style>{`
        @keyframes infFloat1 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50%       { transform: translateY(-16px) rotate(12deg); }
        }
        @keyframes infFloat2 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50%       { transform: translateY(13px) rotate(-9deg); }
        }
        @keyframes infFadeUp {
          from { opacity: 0; transform: translateY(26px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes infFadeDown {
          from { opacity: 0; transform: translateY(-14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes infPillScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes infRingPulse {
          0%   { transform: scale(1);    opacity: 0.55; }
          100% { transform: scale(1.45); opacity: 0; }
        }
        .inf-pill-track { animation: infPillScroll 26s linear infinite; }
        .inf-pill-track:hover { animation-play-state: paused; }
        .inf-cta-ring { position: relative; }
        .inf-cta-ring::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          border: 2px solid rgba(34,197,94,0.55);
          animation: infRingPulse 1.8s ease-out infinite;
        }
      `}</style>

      {/* Hero */}
      <div
        ref={heroRef}
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #052e16 0%, #14532d 40%, #166534 65%, #0f3d1f 100%)',
          minHeight: '510px',
        }}
      >
        {/* Leaf vein texture */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='52' height='52' viewBox='0 0 52 52' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M26 2 C26 2 10 16 10 26 C10 36 18 44 26 50 C34 44 42 36 42 26 C42 16 26 2 26 2Z M26 10 L26 50 M26 26 L10 26 M26 26 L42 26' stroke='white' stroke-width='0.5' fill='none'/%3E%3C/svg%3E")`,
            backgroundSize: '52px 52px',
          }}
        />

        {/* Radial glow */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: 'radial-gradient(ellipse 60% 55% at 50% 42%, rgba(74,222,128,0.45) 0%, transparent 70%)',
            transform: `translate(${mousePos.x * 0.3}px, ${mousePos.y * 0.3}px)`,
            transition: 'transform 0.3s ease',
          }}
        />

        {/* Floating particles */}
        {particles.map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: p.w, height: p.h,
              top: p.top, left: p.left, right: (p as { right?: string }).right,
              background: p.bg,
              animation: p.anim,
              animationDelay: p.delay,
            } as React.CSSProperties}
          />
        ))}

        {/* Content */}
        <div className="relative max-w-5xl mx-auto px-6 pt-14 pb-10">

          {/* Top badge */}
          <div
            className="flex justify-center mb-6"
            style={{ opacity: visible ? 1 : 0, animation: visible ? 'infFadeDown 0.5s ease forwards' : 'none' }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-green-300/50 bg-green-300/15 text-green-200 text-xs font-semibold tracking-wider uppercase">
              <Star className="size-3 fill-green-300 text-green-300" />
              Educational Cannabis Cooking Platform • 21+ Only
              <Star className="size-3 fill-green-300 text-green-300" />
            </div>
          </div>

          {/* Headline */}
          <div className="text-center mb-5">
            <h1
              className="font-black text-white leading-none tracking-tight mb-3"
              style={{
                fontSize: 'clamp(2.5rem, 6vw, 4.1rem)',
                opacity: visible ? 1 : 0,
                animation: visible ? 'infFadeUp 0.65s 0.1s cubic-bezier(.22,.68,0,1.2) forwards' : 'none',
                textShadow: '0 2px 24px rgba(0,0,0,0.5)',
              }}
            >
              Not Baked —
              <span
                className="block"
                style={{
                  background: 'linear-gradient(90deg, #4ade80, #22c55e, #86efac)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Engineered. 🌿
              </span>
            </h1>
            <p
              className="text-green-50 text-lg max-w-2xl mx-auto leading-relaxed"
              style={{
                opacity: visible ? 1 : 0,
                animation: visible ? 'infFadeUp 0.65s 0.22s cubic-bezier(.22,.68,0,1.2) forwards' : 'none',
              }}
            >
              The first cannabis cooking tool built around real dosing science. Calculate exact THC per serving,
              build custom cannabutter and oil infusions, and follow tested recipes — all with live calculations
              that update as you cook.
            </p>
          </div>

          {/* CTA buttons */}
          <div
            className="flex flex-col sm:flex-row gap-3 justify-center mb-8"
            style={{
              opacity: visible ? 1 : 0,
              animation: visible ? 'infFadeUp 0.65s 0.34s cubic-bezier(.22,.68,0,1.2) forwards' : 'none',
            }}
          >
            <Link
              to="/infusions"
              className="inf-cta-ring inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-white text-base transition-all duration-200 hover:scale-105 active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #16a34a, #22c55e)',
                boxShadow: '0 8px 32px rgba(34,197,94,0.4), 0 2px 8px rgba(0,0,0,0.3)',
              }}
            >
              <FlaskConical className="size-5" />
              Build My Infusion — Free
            </Link>
            <Link
              to="/recipes"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-white text-base border border-green-300/40 bg-white/10 backdrop-blur-sm transition-all duration-200 hover:bg-white/20 hover:scale-105 active:scale-95"
            >
              <BookOpen className="size-5" />
              Browse Recipes
            </Link>
          </div>

          {/* Stats */}
          <div
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8 max-w-2xl mx-auto"
            style={{
              opacity: visible ? 1 : 0,
              animation: visible ? 'infFadeUp 0.65s 0.44s cubic-bezier(.22,.68,0,1.2) forwards' : 'none',
            }}
          >
            {STAT_ITEMS.map(stat => (
              <div
                key={stat.label}
                className="text-center px-3 py-3 rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm"
              >
                <div className="text-xl mb-0.5">{stat.icon}</div>
                <div className="text-xl font-black text-green-200 leading-none">{stat.value}</div>
                <div className="text-xs text-green-100 mt-0.5 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Feature pill ticker */}
          <div
            className="overflow-hidden"
            style={{
              opacity: visible ? 1 : 0,
              animation: visible ? 'infFadeUp 0.65s 0.54s cubic-bezier(.22,.68,0,1.2) forwards' : 'none',
              maskImage: 'linear-gradient(90deg, transparent, black 10%, black 90%, transparent)',
              WebkitMaskImage: 'linear-gradient(90deg, transparent, black 10%, black 90%, transparent)',
            }}
          >
            <div className="flex gap-2 inf-pill-track w-max">
              {[...FEATURE_PILLS, ...FEATURE_PILLS].map((pill, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-green-300/35 bg-white/10 text-green-100 text-xs font-medium whitespace-nowrap"
                >
                  <span>{pill.emoji}</span>
                  <span>{pill.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll chevron */}
        <div className="flex justify-center pb-5">
          <button
            onClick={onScrollDown}
            className="text-green-200 hover:text-white transition-colors animate-bounce"
            aria-label="Scroll down"
          >
            <ChevronDown className="size-6" />
          </button>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 40" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: '40px' }}>
            <path d="M0 40 L0 22 Q240 2 480 20 Q720 38 960 18 Q1100 6 1200 20 Q1320 32 1440 18 L1440 40 Z" fill="#f0fdf4" />
          </svg>
        </div>
      </div>

      {/* Trust bar */}
      <div className="bg-green-50 border-b border-green-100 py-3">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-xs text-green-800 font-medium">
            <span className="flex items-center gap-1.5"><FlaskConical className="size-3.5 text-green-600" /> Precise THC Dosing Engine</span>
            <span className="flex items-center gap-1.5"><Leaf className="size-3.5 text-green-600" /> 20+ Cannabis Strain Profiles</span>
            <span className="flex items-center gap-1.5"><BookOpen className="size-3.5 text-green-600" /> Beginner to Advanced Guides</span>
            <span className="flex items-center gap-1.5">⭐ 100% Free · Educational Use Only</span>
          </div>
        </div>
      </div>
    </>
  );
}
