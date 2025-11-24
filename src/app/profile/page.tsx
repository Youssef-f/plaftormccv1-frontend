

"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Profile } from "@/lib/types";


export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    displayName: "",
    bio: "",
    skills: "",
    location: "",
    avatarUrl: "",
  });

  // Fetch profile
  useEffect(() => {
    (async () => {
      try {
        const res = await api<Profile>("/profile/me");
        setProfile(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function handleSave() {
    try {
      await api("/profile/me", {
        method: "PUT",
        body: JSON.stringify(profile),
      });
      alert("Profile updated successfully!");
    } catch (err) {
      alert("Error updating profile");
    }
  }

  if (loading)
    return <p className="p-6 text-gray-500">Loading profile...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Card className="shadow-md rounded-2xl">
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold mb-6">My Profile</h1>

          <div className="flex items-center gap-4 mb-6">
            <Avatar className="h-20 w-20">
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
              className="flex-1"
            />
          </div>

          <label className="font-medium">Display Name</label>
          <Input
            className="mb-4"
            value={profile.displayName}
            onChange={(e) =>
              setProfile({ ...profile, displayName: e.target.value })
            }
          />

          <label className="font-medium">Bio</label>
          <Textarea
            className="mb-4"
            value={profile.bio}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
          />

          <label className="font-medium">Skills (comma separated)</label>
          <Input
            className="mb-4"
            value={profile.skills}
            onChange={(e) => setProfile({ ...profile, skills: e.target.value })}
          />

          <label className="font-medium">Location</label>
          <Input
            className="mb-6"
            value={profile.location}
            onChange={(e) =>
              setProfile({ ...profile, location: e.target.value })
            }
          />

          <Button className="w-full" onClick={handleSave}>
            Save Changes
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}