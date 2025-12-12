"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Profile, Service } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";

export default function ServiceDetails() {
  const { id } = useParams<{ id: string }>();
  const [service, setService] = useState<Service | null>(null);
  const [me, setMe] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  const tags = useMemo(() => service?.tags?.split(",") || [], [service]);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res = await api<Service>(`/services/${id}`);
        setService(res);
        await api(`/services/${id}/view`, { method: "POST" }).catch(() => null);
      } catch (err) {
        console.error(err);
        setError(
          err instanceof Error && err.message
            ? err.message
            : "Unable to load this service."
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  useEffect(() => {
    (async () => {
      try {
        const profile = await api<Profile>("/profile/me");
        setMe(profile);
      } catch {
        setMe(null);
      }
    })();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 text-white">
        <p>Loading service...</p>
      </div>
    );
  if (!service)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 text-white">
        <p>{error || "Service not found"}</p>
      </div>
    );

  const isOwner = Boolean(me?.id && service?.ownerId && me.id === service.ownerId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 text-white">
      <div className="mx-auto max-w-4xl space-y-4">
        <Card className="border-white/10 bg-white/5 text-white ring-1 ring-white/10">
          <CardContent className="space-y-4 p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  Service #{service.id}
                </p>
                <h1 className="text-3xl font-semibold">{service.title}</h1>
                <p className="text-sm text-slate-300">
                  By {service.ownerName || "Creator"}
                </p>
              </div>
              <Badge className="bg-emerald-600 text-white border-transparent">
                ${service.price}
              </Badge>
            </div>

            <p className="text-slate-200 leading-relaxed">
              {service.description}
            </p>

            <div className="flex flex-wrap gap-2">
              {tags.map((tag, i) => (
                <Badge
                  key={i}
                  variant="outline"
                  className="border-white/20 text-white"
                >
                  {tag.trim()}
                </Badge>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-300">
              <Badge variant="outline" className="border-white/20 text-white">
                Delivery: {service.deliveryTime} days
              </Badge>
              <Badge variant="outline" className="border-white/20 text-white">
                Owner ID: {service.ownerId}
              </Badge>
              <Link
                href={`/creators/${service.ownerId}`}
                className="text-secondary underline underline-offset-4"
              >
                View creator profile
              </Link>
            </div>

            <div className="flex flex-wrap gap-2">
              {isOwner && (
                <>
                  <Button
                    variant="secondary"
                    className="bg-secondary text-slate-900 hover:bg-secondary/90"
                    onClick={() => router.push(`/services/${service.id}/edit`)}
                  >
                    Edit
                  </Button>

                  <Button
                    className="bg-rose-500 hover:bg-rose-600"
                    onClick={async () => {
                      if (
                        !confirm(
                          "Are you sure you want to delete this service? This cannot be undone."
                        )
                      )
                        return;

                      try {
                        await api(`/services/${service.id}`, { method: "DELETE" });
                        router.push("/services");
                      } catch (err) {
                        setError(
                          err instanceof Error && err.message
                            ? err.message
                            : "Failed to delete service."
                        );
                      }
                    }}
                  >
                    Delete
                  </Button>
                </>
              )}

              <Button
                variant="outline"
                className="border-white/30 text-white hover:bg-white/5"
                onClick={() => router.push("/services")}
              >
                Back to marketplace
              </Button>
            </div>
            {error && (
              <p className="text-sm text-rose-200">Error: {error}</p>
            )}
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/5 text-white ring-1 ring-white/10">
          <CardContent className="space-y-3 p-6">
            <p className="text-sm text-slate-300">
              Have specific requirements? Drop them for the creator.
            </p>
            <Textarea
              placeholder="Share requirements or notes..."
              className="border-white/10 bg-transparent text-white placeholder:text-slate-400 focus-visible:ring-secondary/60"
            />
            <Button className="bg-secondary text-slate-900 hover:bg-secondary/90">
              Send request
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
