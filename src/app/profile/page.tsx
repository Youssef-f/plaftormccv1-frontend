

"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Profile } from "@/lib/types";
import { useAuth } from "@/hooks/useAuth";

export default function ProfilePage() {
  useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState({
    displayName: "",
    bio: "",
    skills: "",
    location: "",
    avatarUrl: "",
  });

  useEffect(() => {
    (async () => {
      try {
        const res = await api<Profile>("/profile/me");
        setProfile(res);
      } catch (err) {
        setError(
          err instanceof Error && err.message
            ? err.message
            : "Unable to load profile"
        );
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function handleSave() {
    setError("");
    try {
      await api("/profile/me", {
        method: "PUT",
        body: JSON.stringify(profile),
      });
      alert("Profile updated successfully!");
    } catch (err) {
      setError(
        err instanceof Error && err.message
          ? err.message
          : "Error updating profile"
      );
    }
  }

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 text-white">
        <p className="text-slate-300">Loading profile...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 text-white">
      <div className="mx-auto max-w-3xl">
        <Card className="border-white/10 bg-white/5 text-white ring-1 ring-white/10">
          <CardContent className="p-6 space-y-4">
            <div>
              <p className="text-sm uppercase tracking-[0.12em] text-slate-400">
                Profile
              </p>
              <h1 className="text-2xl font-semibold">My profile</h1>
              <p className="text-sm text-slate-400">
                Update your public details and skills.
              </p>
            </div>

            {error && (
              <div className="rounded-xl border border-rose-300/40 bg-rose-50/10 px-4 py-3 text-sm text-rose-100">
                {error}
              </div>
            )}

            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border border-white/20">
                <AvatarFallback>
                  {profile.displayName?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>

              <Input
                placeholder="Avatar Image URL"
                value={profile.avatarUrl || ""}
                onChange={(e) =>
                  setProfile({ ...profile, avatarUrl: e.target.value })
                }
                className="flex-1 border-white/10 bg-transparent text-white placeholder:text-slate-400 focus-visible:ring-secondary/60"
              />
            </div>

            <div className="grid grid-cols-1 gap-3">
              <label className="text-sm font-semibold text-slate-200">
                Display Name
              </label>
              <Input
                className="border-white/10 bg-transparent text-white placeholder:text-slate-400 focus-visible:ring-secondary/60"
                value={profile.displayName}
                onChange={(e) =>
                  setProfile({ ...profile, displayName: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-1 gap-3">
              <label className="text-sm font-semibold text-slate-200">Bio</label>
              <Textarea
                className="border-white/10 bg-transparent text-white placeholder:text-slate-400 focus-visible:ring-secondary/60"
                value={profile.bio}
                onChange={(e) =>
                  setProfile({ ...profile, bio: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-1 gap-3">
              <label className="text-sm font-semibold text-slate-200">
                Skills (comma separated)
              </label>
              <Input
                className="border-white/10 bg-transparent text-white placeholder:text-slate-400 focus-visible:ring-secondary/60"
                value={profile.skills}
                onChange={(e) =>
                  setProfile({ ...profile, skills: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-1 gap-3">
              <label className="text-sm font-semibold text-slate-200">
                Location
              </label>
              <Input
                className="border-white/10 bg-transparent text-white placeholder:text-slate-400 focus-visible:ring-secondary/60"
                value={profile.location}
                onChange={(e) =>
                  setProfile({ ...profile, location: e.target.value })
                }
              />
            </div>

            <Button
              className="w-full bg-secondary text-slate-900 hover:bg-secondary/90"
              onClick={handleSave}
            >
              Save Changes
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
