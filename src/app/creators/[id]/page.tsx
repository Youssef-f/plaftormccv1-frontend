"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Profile } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function CreatorProfilePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    (async () => {
      setError("");
      try {
        const data = await api<Profile>(`/profile/${id}`);
        setProfile(data);
      } catch (err) {
        setError(
          err instanceof Error && err.message
            ? err.message
            : "Unable to load creator profile."
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 text-white">
        <p>Loading creator...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 text-white">
        <p className="text-rose-200">{error || "Creator not found."}</p>
        <Button
          variant="outline"
          className="mt-4 border-white/30 text-white hover:bg-white/5"
          onClick={() => router.push("/creators")}
        >
          Back to creators
        </Button>
      </div>
    );
  }

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
      <div className="mx-auto max-w-4xl space-y-4">
        <Card className="border-white/10 bg-white/5 text-white ring-1 ring-white/10">
          <CardContent className="space-y-4 p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  Creator #{profile.id ?? id}
                </p>
                <h1 className="text-3xl font-semibold">
                  {profile.displayName || "Unnamed creator"}
                </h1>
                {profile.location && (
                  <p className="text-sm text-slate-300">{profile.location}</p>
                )}
              </div>
              <Badge variant="outline" className="border-white/20 text-white">
                {verificationLabel(profile.verificationStatus)}
              </Badge>
            </div>

            {profile.bio && (
              <p className="text-slate-200 leading-relaxed">{profile.bio}</p>
            )}

            <div className="flex flex-wrap gap-2 text-xs text-slate-300">
              {profile.skills &&
                profile.skills
                  .split(",")
                  .filter(Boolean)
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

            <Button
              variant="outline"
              className="border-white/30 text-white hover:bg-white/5"
              onClick={() => router.push("/services")}
            >
              View marketplace
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
