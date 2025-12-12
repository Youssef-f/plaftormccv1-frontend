"use client";

import { useEffect, useState } from "react";
import { apiDelete, apiGet } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function AdminServicesPage() {
  useAuth({ requireAdmin: true });
  const [services, setServices] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState("PENDING_REVIEW");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  async function load() {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const data = await apiGet(
        `http://localhost:8080/api/admin/services?status=${statusFilter}`,
        token
      );
      setServices(data as any[]);
    } catch (err) {
      setError(
        err instanceof Error && err.message
          ? err.message
          : "Unable to load services (403?)."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [statusFilter, token]);

  async function updateStatus(id: number, newStatus: string) {
    if (!token) return;
    setError("");
    try {
      // Backend enum values: DRAFT, PENDING_REVIEW, ACTIVE, REJECTED, DISABLED
      const url = `http://localhost:8080/api/admin/services/${id}/status`;
      await fetch(url, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });
      load();
    } catch (err) {
      setError(
        err instanceof Error && err.message
          ? err.message
          : "Unable to update status (403?)."
      );
    }
  }

  async function deleteService(id: number) {
    if (!token) return;
    setError("");
    try {
      await apiDelete(`http://localhost:8080/api/admin/services/${id}`, token);
      load();
    } catch (err) {
      setError(
        err instanceof Error && err.message
          ? err.message
          : "Unable to delete service (403?)."
      );
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 text-white">
      <div className="mx-auto max-w-6xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm uppercase tracking-[0.12em] text-slate-400">
              Admin
            </p>
            <h1 className="text-3xl font-semibold">Service moderation</h1>
            <p className="text-slate-400">
              Approve, reject, or delete services submitted by creators.
            </p>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-white/20 bg-white/5 px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/60"
          >
            <option value="PENDING_REVIEW">Pending Review</option>
            <option value="ACTIVE">Active</option>
            <option value="REJECTED">Rejected</option>
            <option value="DRAFT">Draft</option>
            <option value="DISABLED">Disabled</option>
          </select>
        </div>

        {error && (
          <div className="rounded-xl border border-rose-300/40 bg-rose-50/10 px-4 py-3 text-sm text-rose-100">
            {error}
          </div>
        )}
        {loading && <p className="text-slate-300">Loading services...</p>}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {services.map((s: any) => (
            <Card
              key={s.id}
              className="border-white/10 bg-white/5 text-white ring-1 ring-white/10"
            >
              <CardContent className="space-y-3 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-400">
                      Service #{s.id}
                    </p>
                    <h2 className="text-lg font-semibold">{s.title}</h2>
                    <p className="text-sm text-slate-300 line-clamp-3">
                      {s.description}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Owner: {s.ownerName} (ID {s.ownerId})
                    </p>
                  </div>
                  <Badge variant="outline" className="border-white/20 text-white">
                    {s.status || statusFilter}
                  </Badge>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
                  <Badge className="bg-emerald-600 text-white border-transparent">
                    ${s.price}
                  </Badge>
                  <Badge variant="outline" className="border-white/20 text-white">
                    {s.deliveryTime} days
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    className="bg-emerald-600 hover:bg-emerald-700"
                    onClick={() => updateStatus(s.id, "ACTIVE")}
                  >
                    Approve
                  </Button>
                  <Button
                    className="bg-amber-500 hover:bg-amber-600 text-white"
                    onClick={() => updateStatus(s.id, "REJECTED")}
                  >
                    Reject
                  </Button>
                  <Button
                    variant="outline"
                    className="col-span-2 border-white/30 text-white hover:bg-white/5"
                    onClick={() => deleteService(s.id)}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
