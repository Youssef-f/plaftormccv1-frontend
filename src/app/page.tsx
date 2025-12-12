"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    title: "Dual workspace",
    desc: "Creators manage services, admins moderate and verify—one account, two tailored experiences.",
  },
  {
    title: "Service marketplace",
    desc: "Rich listings with tags, pricing, delivery times, and per-service analytics.",
  },
  {
    title: "Trust & verification",
    desc: "Creator verification pipeline with admin review and clear status for buyers.",
  },
];

const pricing = [
  {
    name: "Starter",
    price: "$0",
    cta: "Get started",
    points: ["Publish up to 3 services", "Basic analytics", "Email support"],
  },
  {
    name: "Pro",
    price: "$19/mo",
    cta: "Upgrade to Pro",
    highlighted: true,
    points: ["Unlimited services", "Advanced insights", "Priority support", "Verification fast-track"],
  },
  {
    name: "Team",
    price: "$49/mo",
    cta: "Talk to us",
    points: ["Seats for your team", "Admin delegation", "Custom AI workflows"],
  },
];

const aiAddons = [
  {
    title: "Smart service copy",
    desc: "AI drafts compelling titles and descriptions tuned to your niche.",
  },
  {
    title: "Auto-tagging",
    desc: "Intelligent tagging to boost discovery across the marketplace.",
  },
  {
    title: "Dynamic pricing",
    desc: "Price recommendations based on demand, competition, and performance.",
  },
  {
    title: "Visual polish",
    desc: "Generate on-brand banners and visuals for your listings.",
  },
];

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const pricingRef = useRef<HTMLDivElement[]>([]);
  const aiRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        heroRef.current,
        { opacity: 0, y: 40, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 1, ease: "power3.out" }
      );

      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.fromTo(
          card,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: 0.1 * i,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 80%",
            },
          }
        );
      });

      pricingRef.current.forEach((card) => {
        if (!card) return;
        gsap.fromTo(
          card,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
            },
          }
        );
      });

      aiRef.current.forEach((item) => {
        if (!item) return;
        gsap.fromTo(
          item,
          { opacity: 0, x: -30 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: item, start: "top 85%" },
          }
        );
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-secondary/20 blur-[140px]" />
          <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-light-blue/10 blur-[140px]" />
        </div>

        {/* Hero */}
        <section
          ref={heroRef}
          className="relative mx-auto flex max-w-6xl flex-col gap-8 px-6 pb-20 pt-24"
        >
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
            Platform CC · Unified creator + admin control
          </div>
          <div className="max-w-3xl space-y-4">
            <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
              Launch services, build trust, and moderate with confidence.
            </h1>
            <p className="text-lg text-slate-300">
              Platform CC brings creators and admins into one streamlined control
              center—publish services, manage profiles, approve verifications, and
              unlock AI add-ons built to scale your marketplace.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/login"
              className="rounded-xl bg-secondary px-6 py-3 text-slate-900 font-semibold shadow-lg shadow-secondary/30 hover:bg-secondary/90"
            >
              Sign in to your workspace
            </Link>
            <Link
              href="/services"
              className="rounded-xl border border-white/20 px-6 py-3 font-semibold text-white hover:bg-white/10"
            >
              Explore marketplace
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {features.map((f, i) => (
              <div
                key={f.title}
                ref={(el) => {
                  cardsRef.current[i] = el as HTMLDivElement;
                }}
                className="rounded-2xl border border-white/10 bg-white/5 p-5"
              >
                <p className="text-sm uppercase tracking-[0.12em] text-slate-400">
                  {f.title}
                </p>
                <p className="mt-2 text-slate-200">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Marketplace preview */}
        <section className="relative mx-auto max-w-6xl px-6 py-12">
          <div className="grid grid-cols-1 gap-6 rounded-3xl border border-white/10 bg-white/5 p-6 lg:grid-cols-2">
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.12em] text-slate-400">
                Marketplace
              </p>
              <h2 className="text-3xl font-semibold">Designed for conversion</h2>
              <p className="text-slate-300">
                Beautiful service cards, inline filters, and owner profiles keep
                buyers engaged. Verified creators rise to the top with clear badges
                and trust signals.
              </p>
              <div className="flex flex-wrap gap-2 text-xs text-slate-200">
                <span className="rounded-full border border-white/20 px-3 py-1">
                  Tag filters
                </span>
                <span className="rounded-full border border-white/20 px-3 py-1">
                  Price controls
                </span>
                <span className="rounded-full border border-white/20 px-3 py-1">
                  Owner profiles
                </span>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800/60 to-slate-900/60 p-5 shadow-xl shadow-black/20">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-white/10 bg-white/5 p-4"
                  >
                    <p className="text-xs uppercase tracking-wide text-slate-400">
                      Service #{i}
                    </p>
                    <h3 className="text-lg font-semibold text-white">
                      Premium editing
                    </h3>
                    <p className="text-sm text-slate-300 line-clamp-2">
                      Crisp delivery, compelling copy, and trustworthy verification.
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1 text-xs text-slate-200">
                      <span className="rounded-full border border-white/20 px-2 py-1">
                        video
                      </span>
                      <span className="rounded-full border border-white/20 px-2 py-1">
                        editing
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="relative mx-auto max-w-6xl px-6 py-12">
          <div className="mb-6 space-y-2">
            <p className="text-sm uppercase tracking-[0.12em] text-slate-400">
              Pricing
            </p>
            <h2 className="text-3xl font-semibold">Choose your lane</h2>
            <p className="text-slate-300">
              Simple plans for creators and teams. Switch anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {pricing.map((plan, i) => (
              <div
                key={plan.name}
                ref={(el) => {
                  pricingRef.current[i] = el as HTMLDivElement;
                }}
                className={`rounded-2xl border border-white/10 bg-white/5 p-6 ${
                  plan.highlighted ? "shadow-2xl shadow-secondary/20 ring-1 ring-secondary/30" : ""
                }`}
              >
                <p className="text-sm uppercase tracking-[0.12em] text-slate-400">
                  {plan.name}
                </p>
                <h3 className="mt-2 text-3xl font-semibold">{plan.price}</h3>
                <ul className="mt-4 space-y-2 text-sm text-slate-200">
                  {plan.points.map((p) => (
                    <li key={p}>• {p}</li>
                  ))}
                </ul>
                <Link
                  href="/login"
                  className={`mt-6 inline-flex w-full items-center justify-center rounded-xl px-4 py-3 font-semibold ${
                    plan.highlighted
                      ? "bg-secondary text-slate-900 hover:bg-secondary/90"
                      : "border border-white/20 text-white hover:bg-white/10"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* AI add-ons */}
        <section className="relative mx-auto max-w-6xl px-6 py-12">
          <div className="mb-6 space-y-2">
            <p className="text-sm uppercase tracking-[0.12em] text-slate-400">
              Upcoming AI add-ons
            </p>
            <h2 className="text-3xl font-semibold">Built to boost every listing</h2>
            <p className="text-slate-300">
              We are shipping AI-powered enhancements to help creators stand out and
              admins moderate faster.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {aiAddons.map((addon, i) => (
              <div
                key={addon.title}
                ref={(el) => {
                  aiRef.current[i] = el as HTMLDivElement;
                }}
                className="rounded-2xl border border-white/10 bg-white/5 p-5"
              >
                <p className="text-sm uppercase tracking-wide text-slate-400">
                  Coming soon
                </p>
                <h3 className="text-xl font-semibold text-white">{addon.title}</h3>
                <p className="text-slate-300">{addon.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="relative mx-auto max-w-6xl px-6 pb-20">
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-secondary/20 via-light-blue/10 to-slate-900 p-8 shadow-xl">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-3">
                <p className="text-sm uppercase tracking-[0.12em] text-slate-800">
                  Ready?
                </p>
                <h3 className="text-3xl font-semibold text-slate-900">
                  Launch your control center today.
                </h3>
                <p className="text-slate-800">
                  Publish services, track performance, and let admins verify your best
                  creators.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 self-center">
                <Link
                  href="/login"
                  className="rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white shadow-lg shadow-black/20 hover:bg-slate-800"
                >
                  Go to dashboard
                </Link>
                <Link
                  href="/services"
                  className="rounded-xl border border-slate-900 px-6 py-3 font-semibold text-slate-900 hover:bg-slate-900/10"
                >
                  Browse services
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
