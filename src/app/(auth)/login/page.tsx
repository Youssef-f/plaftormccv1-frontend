"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { api } from "@/lib/api";
import { detectRoleFromToken, persistSession } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import logoImg from "../../../../public/platformcc-logo.png";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const helperText = useMemo(
    () => [
      "Single entry for creators and admins",
      "Secure session with role-aware routing",
      "Stay signed in across reviews and bookings",
    ],
    []
  );

  async function handleLogin(e?: FormEvent) {
    e?.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await api<{ token: string }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      const role = detectRoleFromToken(data.token);
      persistSession(data.token, role);
      router.push(role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      const message =
        err instanceof Error && err.message
          ? err.message
          : "Login failed. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#021018] via-[#0a2734] to-[#0f4f6a] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-10 -top-10 h-72 w-72 rounded-full bg-secondary/30 blur-[120px]" />
        <div className="absolute bottom-10 right-0 h-80 w-80 rounded-full bg-light-blue/25 blur-[120px]" />
      </div>

      <div className="relative mx-auto grid max-w-5xl grid-cols-1 items-center gap-10 px-6 py-12 md:grid-cols-2 lg:px-12">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-secondary" />
            <p className="text-sm font-medium text-white/80">
              Unified access for creators and admins
            </p>
          </div>

          <div className="space-y-4">
            <h1 className="text-3xl font-semibold leading-tight md:text-4xl">
              Welcome back to Platform CC
            </h1>
            <p className="max-w-xl text-base text-white/70">
              Sign in once and we will route you to the right workspace. Admins
              head straight to moderation tools; creators land on their
              dashboard.
            </p>
          </div>

          <div className="rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur">
            <div className="mb-4 flex items-center gap-3">
              <div className="relative h-12 w-12 overflow-hidden rounded-xl border border-white/10 bg-white/10">
                <Image
                  src={logoImg}
                  alt="Platform logo"
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.12em] text-white/60">
                  Platform control center
                </p>
                <p className="text-lg font-semibold text-white">
                  Secure single sign-in
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {helperText.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/75"
                >
                  <span className="h-2 w-2 rounded-full bg-secondary" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/15 bg-white/90 p-8 text-slate-900 shadow-2xl shadow-black/20 backdrop-blur">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Access your workspace
              </p>
              <h2 className="text-2xl font-bold text-slate-900">
                Sign in to continue
              </h2>
            </div>
            <span className="rounded-full bg-secondary/15 px-3 py-1 text-xs font-semibold text-secondary">
              Admin + User
            </span>
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleLogin}>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                Email
              </label>
              <Input
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className="h-11 border-slate-200 bg-white text-slate-900 focus-visible:ring-2 focus-visible:ring-secondary/60"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                Password
              </label>
              <Input
                type="password"
                autoComplete="current-password"
                placeholder="Your password"
                className="h-11 border-slate-200 bg-white text-slate-900 focus-visible:ring-2 focus-visible:ring-secondary/60"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="mt-2 h-11 w-full bg-gradient-to-r from-secondary to-light-blue text-base font-semibold text-white shadow-lg shadow-secondary/30 hover:from-secondary/90 hover:to-light-blue/90"
              onClick={handleLogin}
            >
              {loading ? "Signing you in..." : "Continue"}
            </Button>
          </form>

          <p className="mt-6 text-xs text-slate-500">
            Use the same account for admin and creator access. We detect your
            permissions and send you to the right destination automatically.
          </p>
        </div>
      </div>
    </div>
  );
}
