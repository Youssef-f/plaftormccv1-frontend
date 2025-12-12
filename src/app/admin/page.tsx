"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export default function AdminHome() {
  useAuth({ requireAdmin: true });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 text-white">
      <div className="mx-auto max-w-5xl space-y-6">
        <div>
          <p className="text-sm uppercase tracking-[0.12em] text-slate-400">
            Admin
          </p>
          <h1 className="text-3xl font-semibold">Admin control center</h1>
          <p className="text-slate-400">
            Moderate services, verify creators, and monitor platform health.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Card className="border-white/10 bg-white/5 text-white ring-1 ring-white/10">
            <CardContent className="space-y-3 p-5">
              <p className="text-sm text-slate-300">Creator verification</p>
              <h3 className="text-xl font-semibold">
                Review pending requests
              </h3>
              <p className="text-sm text-slate-400">
                Approve or reject creator verification submissions.
              </p>
              <Link href="/admin/creator-verification">
                <Button className="bg-secondary text-slate-900 hover:bg-secondary/90">
                  Open verification queue
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/5 text-white ring-1 ring-white/10">
            <CardContent className="space-y-3 p-5">
              <p className="text-sm text-slate-300">Service moderation</p>
              <h3 className="text-xl font-semibold">Approve or reject</h3>
              <p className="text-sm text-slate-400">
                Filter by status, approve listings, or remove violations.
              </p>
              <Link href="/admin/services">
                <Button className="bg-secondary text-slate-900 hover:bg-secondary/90">
                  Manage services
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
