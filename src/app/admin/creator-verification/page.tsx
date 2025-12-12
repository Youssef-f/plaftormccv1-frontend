"use client";

import { useEffect, useState } from "react";
import { API_URL, apiGet } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function CreatorVerificationPage() {
  useAuth({ requireAdmin: true });
  const [requests, setRequests] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  async function load() {
    if (!token) return;
    setError("");
    setLoading(true);
    try {
      const data = await apiGet(
        `${API_URL}/admin/creators/verifications`,
        token
      );
      setRequests(data);
    } catch (err) {
      const message =
        err instanceof Error && err.message
          ? err.message
          : "Unable to load verification requests (403?).";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  async function approve(id: number) {
    if (!token) return;
    try {
      await fetch(
        `${API_URL}/admin/creators/verifications/${id}/approve`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      load();
    } catch (err) {
      setError("Failed to approve (403?). Confirm the logged-in account is admin.");
    }
  }

  async function reject(id: number) {
    if (!token) return;
    try {
      await fetch(
        `${API_URL}/admin/creators/verifications/${id}/reject`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      load();
    } catch (err) {
      setError("Failed to reject (403?). Confirm the logged-in account is admin.");
    }
  }

  useEffect(() => {
    load();
  }, [token]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 text-white">
      <div className="mx-auto max-w-5xl space-y-4">
        <div>
          <p className="text-sm uppercase tracking-[0.12em] text-slate-400">
            Admin
          </p>
          <h1 className="text-3xl font-semibold">Creator verifications</h1>
          <p className="text-slate-400">
            Review pending creator verification requests.
          </p>
        </div>

        {error && (
          <div className="rounded-xl border border-rose-300/40 bg-rose-50/10 px-4 py-3 text-sm text-rose-100">
            {error}
          </div>
        )}

        {loading && <p className="text-slate-300">Loading requests...</p>}
        {!loading && requests.length === 0 && (
          <p className="text-slate-300">No pending requests.</p>
        )}

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {requests.map((req: any) => (
            <div
              key={req.id}
              className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-3"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-400">
                    Request #{req.id}
                  </p>
                  <h3 className="text-lg font-semibold">
                    {req.creatorName ||
                      req.user?.displayName ||
                      req.user?.name ||
                      req.user?.username ||
                      "Unknown user"}
                  </h3>
                  <p className="text-sm text-slate-300">
                    {req.user?.email || req.creatorEmail || req.email || "No email"}
                  </p>
                </div>
                <Badge variant="outline" className="border-white/20 text-white">
                  {req.status || "PENDING"}
                </Badge>
              </div>

              {req.reason && (
                <p className="text-sm text-slate-200 leading-relaxed">
                  {req.reason}
                </p>
              )}

              <div className="grid grid-cols-2 gap-2">
                <Button
                  className="bg-emerald-600 text-white hover:bg-emerald-700"
                  onClick={() => approve(req.id)}
                >
                  Approve
                </Button>
                <Button
                  className="bg-rose-500 text-white hover:bg-rose-600"
                  onClick={() => reject(req.id)}
                >
                  Reject
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
