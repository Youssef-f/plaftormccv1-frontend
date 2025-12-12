"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { Profile, Service } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type CreatorCard = {
  id: number;
  displayName?: string;
  bio?: string;
  skills?: string;
  location?: string;
  verificationStatus?: string;
  email?: string;
  fallbackName?: string;
};

export default function CreatorsPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [creators, setCreators] = useState<CreatorCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      setError("");
      setLoading(true);
      try {
        const allServices = await api<Service[]>("/services");
        setServices(allServices);

        const ownerMeta = new Map<
          number,
          { fallbackName?: string; serviceCount: number }
        >();
        allServices.forEach((s) => {
          const existing = ownerMeta.get(s.ownerId);
          ownerMeta.set(s.ownerId, {
            fallbackName: s.ownerName,
            serviceCount: (existing?.serviceCount || 0) + 1,
          });
        });

        const uniqueOwnerIds = Array.from(ownerMeta.keys());

        const profiles = await Promise.all(
          uniqueOwnerIds.map(async (id) => {
            try {
              const profile = await api<Profile>(`/profile/${id}`);
              return { id, ...profile };
            } catch {
              const meta = ownerMeta.get(id);
              return { id, fallbackName: meta?.fallbackName };
            }
          })
        );

        const merged = profiles.map((p) => ({
          ...p,
          fallbackName: p.fallbackName ?? ownerMeta.get(p.id)?.fallbackName,
        }));

        setCreators(merged);
      } catch (err) {
        setError(
          err instanceof Error && err.message
            ? err.message
            : "Unable to load creators."
        );
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const creatorServiceCount = useMemo(() => {
    const map = new Map<number, number>();
    services.forEach((s) => {
      map.set(s.ownerId, (map.get(s.ownerId) || 0) + 1);
    });
    return map;
  }, [services]);

  function verificationLabel(status?: string) {
    const val = status?.toUpperCase();
    if (!val) return "Unverified";
    if (val.includes("APPROVED") || val.includes("VERIFIED")) return "Verified";
    if (val.includes("PENDING")) return "Pending";
    if (val.includes("REJECT")) return "Rejected";
    return "Unverified";
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 text-white">
      <div className="mx-auto max-w-6xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm uppercase tracking-[0.12em] text-slate-400">
              Marketplace
            </p>
            <h1 className="text-3xl font-semibold">Creators</h1>
            <p className="text-slate-400">
              Browse service providers and view their public profiles.
            </p>
          </div>
          <Link href="/services">
            <Button className="bg-secondary text-slate-900 hover:bg-secondary/90">
              View services
            </Button>
          </Link>
        </div>

        {error && (
          <div className="rounded-xl border border-rose-300/40 bg-rose-50/10 px-4 py-3 text-sm text-rose-100">
            {error}
          </div>
        )}
        {loading && <p className="text-slate-300">Loading creators...</p>}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {creators.map((creator) => (
            <Card
              key={creator.id}
              className="border-white/10 bg-white/5 text-white ring-1 ring-white/10"
            >
              <CardContent className="space-y-3 p-5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-400">
                      Creator #{creator.id}
                    </p>
                    <h2 className="text-lg font-semibold">
                      {creator.displayName ||
                        creator.fallbackName ||
                        "Unnamed creator"}
                    </h2>
                    <p className="text-xs text-slate-400">
                      {creator.location || "Location unknown"}
                    </p>
                    {creator.email && (
                      <p className="text-xs text-slate-400">{creator.email}</p>
                    )}
                  </div>
                  <Badge variant="outline" className="border-white/20 text-white">
                    {verificationLabel(creator.verificationStatus)}
                  </Badge>
                </div>

                {creator.bio && (
                  <p className="text-sm text-slate-300 line-clamp-3">
                    {creator.bio}
                  </p>
                )}

                <div className="flex flex-wrap gap-2 text-xs text-slate-300">
                  {creator.skills &&
                    creator.skills
                      .split(",")
                      .filter(Boolean)
                      .slice(0, 4)
                      .map((skill, idx) => (
                        <Badge
                          key={idx}
                          variant="outline"
                          className="border-white/20 text-white"
                        >
                          {skill.trim()}
                        </Badge>
                      ))}
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>
                    Services: {creatorServiceCount.get(creator.id) || 0}
                  </span>
                </div>

                <Link href={`/creators/${creator.id}`}>
                  <Button className="w-full bg-secondary text-slate-900 hover:bg-secondary/90">
                    View profile
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
