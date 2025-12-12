

"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { CreatorStats, Profile, Service } from "@/lib/types";

type VerificationStatus = {
  id?: number;
  status?: string;
  reason?: string;
  createdAt?: string;
  updatedAt?: string;
};

type ServiceDraft = {
  title: string;
  description: string;
  tags: string;
  price: string;
  deliveryTime: string;
};

const emptyServiceDraft: ServiceDraft = {
  title: "",
  description: "",
  tags: "",
  price: "",
  deliveryTime: "",
};

export default function DashboardPage() {
  const { logout, role } = useAuth();
  const router = useRouter();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState<CreatorStats | null>(null);
  const [verification, setVerification] = useState<VerificationStatus | null>(
    null
  );
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [serviceDraft, setServiceDraft] = useState<ServiceDraft>(
    emptyServiceDraft
  );
  const [submittingService, setSubmittingService] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [verificationReason, setVerificationReason] = useState("");
  const [submittingVerification, setSubmittingVerification] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  useEffect(() => {
    loadDashboard();
  }, []);

  const myServices = useMemo(() => {
    if (!profile?.id) return [];
    return services.filter((s) => s.ownerId === profile.id);
  }, [profile, services]);

  const isVerified =
    verification?.status?.toUpperCase() === "APPROVED" ||
    profile?.verificationStatus?.toUpperCase() === "APPROVED";
  const isVerificationPending =
    verification?.status?.toUpperCase() === "PENDING" ||
    profile?.verificationStatus?.toUpperCase() === "PENDING";

  async function loadDashboard() {
    setLoading(true);
    setError("");
    try {
      const [profileRes, statsRes, verificationRes, servicesRes] =
        await Promise.allSettled([
          api<Profile>("/profile/me"),
          api<CreatorStats>("/creator/stats"),
          api<VerificationStatus>("/creator-verification/me"),
          api<Service[]>("/services"),
        ]);

      if (profileRes.status === "fulfilled") {
        setProfile(profileRes.value);
      }
      if (statsRes.status === "fulfilled") {
        setStats(statsRes.value);
      }
      if (verificationRes.status === "fulfilled") {
        setVerification(verificationRes.value);
      }
      if (servicesRes.status === "fulfilled") {
        setServices(servicesRes.value);
      }
      const failedCount = [
        profileRes,
        statsRes,
        verificationRes,
        servicesRes,
      ].filter((r) => r.status === "rejected").length;
      if (failedCount > 0) {
        setError("Some data could not be loaded. Try refreshing.");
      }
    } catch (err) {
      const message =
        err instanceof Error && err.message
          ? err.message
          : "Unable to load dashboard data.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    setLogoutLoading(true);
    try {
      await api("/auth/logout", { method: "POST" }).catch(() => null);
    } finally {
      logout();
      setLogoutLoading(false);
    }
  }

  async function handleCreateService() {
    setSubmittingService(true);
    setError("");
    if (
      !serviceDraft.title ||
      !serviceDraft.description ||
      !serviceDraft.price ||
      !serviceDraft.deliveryTime
    ) {
      setError("Please fill in title, description, price, and delivery time.");
      setSubmittingService(false);
      return;
    }
    try {
      await api("/services", {
        method: "POST",
        body: JSON.stringify({
          title: serviceDraft.title,
          description: serviceDraft.description,
          tags: serviceDraft.tags,
          price: Number(serviceDraft.price),
          deliveryTime: Number(serviceDraft.deliveryTime),
        }),
      });
      setServiceDraft(emptyServiceDraft);
      await refreshServices();
    } catch (err) {
      const message =
        err instanceof Error && err.message
          ? err.message
          : "Unable to create service.";
      setError(message);
    } finally {
      setSubmittingService(false);
    }
  }

  async function refreshServices() {
    try {
      const data = await api<Service[]>("/services");
      setServices(data);
    } catch (err) {
      const message =
        err instanceof Error && err.message
          ? err.message
          : "Unable to refresh services.";
      setError(message);
    }
  }

  function startEditing(service: Service) {
    setEditingId(service.id);
    setServiceDraft({
      title: service.title,
      description: service.description,
      tags: service.tags,
      price: String(service.price),
      deliveryTime: String(service.deliveryTime),
    });
  }

  async function handleUpdateService(id: number) {
    setSubmittingService(true);
    setError("");
    if (
      !serviceDraft.title ||
      !serviceDraft.description ||
      !serviceDraft.price ||
      !serviceDraft.deliveryTime
    ) {
      setError("Please fill in title, description, price, and delivery time.");
      setSubmittingService(false);
      return;
    }
    try {
      await api(`/services/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          title: serviceDraft.title,
          description: serviceDraft.description,
          tags: serviceDraft.tags,
          price: Number(serviceDraft.price),
          deliveryTime: Number(serviceDraft.deliveryTime),
        }),
      });
      setEditingId(null);
      setServiceDraft(emptyServiceDraft);
      await refreshServices();
    } catch (err) {
      const message =
        err instanceof Error && err.message
          ? err.message
          : "Unable to update service.";
      setError(message);
    } finally {
      setSubmittingService(false);
    }
  }

  async function handleDeleteService(id: number) {
    setSubmittingService(true);
    setError("");
    try {
      await api(`/services/${id}`, { method: "DELETE" });
      await refreshServices();
    } catch (err) {
      const message =
        err instanceof Error && err.message
          ? err.message
          : "Unable to delete service.";
      setError(message);
    } finally {
      setSubmittingService(false);
    }
  }

  async function handleSubmitVerification() {
    setSubmittingVerification(true);
    setError("");
    try {
      await api("/creator-verification", {
        method: "POST",
        body: JSON.stringify({
          reason: verificationReason || "Creator verification request",
        }),
      });
      setVerificationReason("");
      const status = await api<VerificationStatus>("/creator-verification/me");
      setVerification(status);
    } catch (err) {
      const message =
        err instanceof Error && err.message
          ? err.message
          : "Unable to submit verification request.";
      setError(message);
    } finally {
      setSubmittingVerification(false);
    }
  }

  const statsEntries = useMemo(() => {
    if (!stats) return [];
    return Object.entries(stats).map(([key, value]) => ({
      key,
      label: formatLabel(key),
      value,
    }));
  }, [stats]);

  const verificationBadge = (() => {
    const status = verification?.status || profile?.verificationStatus || "N/A";
    const normalized = status.toUpperCase();
    if (normalized.includes("APPROVED"))
      return (
        <Badge className="bg-emerald-600 text-white border-transparent">
          Approved
        </Badge>
      );
    if (normalized.includes("PENDING"))
      return (
        <Badge className="bg-amber-500 text-white border-transparent">
          Pending review
        </Badge>
      );
    if (normalized.includes("REJECT"))
      return (
        <Badge className="bg-rose-500 text-white border-transparent">
          Rejected
        </Badge>
      );
    return <Badge variant="outline">Not requested</Badge>;
  })();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <p className="text-slate-500">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 text-slate-50">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <div className="rounded-3xl bg-slate-900/70 px-6 py-5 shadow-2xl shadow-black/30 ring-1 ring-white/10 backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.12em] text-slate-400">
                Creator control center
              </p>
              <h1 className="text-3xl font-semibold text-white">
                Welcome back{profile?.displayName ? `, ${profile.displayName}` : ""}{" "}
                {role === "admin" ? "(Admin)" : ""}
              </h1>
              <p className="text-sm text-slate-400">
                Manage your profile, publish services, and track creator stats.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {verificationBadge}
              <Button
                variant="secondary"
                className="bg-secondary text-slate-900 hover:bg-secondary/90"
                onClick={() => router.push("/profile")}
              >
                Edit profile
              </Button>
              <Button
                className="bg-rose-500 hover:bg-rose-600"
                onClick={handleLogout}
                disabled={logoutLoading}
              >
                {logoutLoading ? "Signing out..." : "Logout"}
              </Button>
            </div>
          </div>
          {error && (
            <div className="mt-3 rounded-xl border border-rose-300/40 bg-rose-50/10 px-4 py-3 text-sm text-rose-100">
              {error}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
          <Card className="bg-slate-900/70 text-white ring-1 ring-white/10">
            <CardContent className="space-y-3 p-5">
              <p className="text-sm text-slate-400">Profile snapshot</p>
              <h3 className="text-xl font-semibold">
                {profile?.displayName || "Your profile"}
              </h3>
              <p className="text-sm text-slate-400">
                {profile?.bio || "Add a short bio to stand out."}
              </p>
              <div className="flex flex-wrap gap-2 text-xs text-slate-300">
                {profile?.location && (
                  <Badge variant="outline" className="border-white/20 text-white">
                    {profile.location}
                  </Badge>
                )}
                {profile?.skills && (
                  <Badge variant="outline" className="border-white/20 text-white">
                    {profile.skills}
                  </Badge>
                )}
              </div>
              <Link href="/profile">
                <Button className="w-full bg-secondary text-slate-900 hover:bg-secondary/90">
                  View full profile
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/70 text-white ring-1 ring-white/10 lg:col-span-2">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Creator analytics</p>
                  <h3 className="text-xl font-semibold">At a glance</h3>
                </div>
                <Link href="/services">
                  <Button className="bg-secondary text-slate-900 hover:bg-secondary/90" variant="secondary">
                    Browse marketplace
                  </Button>
                </Link>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
                {statsEntries.length === 0 && (
                  <p className="col-span-full text-sm text-slate-300">
                    No stats yet. Publish a service to start tracking.
                  </p>
                )}
                {statsEntries.map((entry) => (
                  <div
                    key={entry.key}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4"
                  >
                    <p className="text-xs uppercase tracking-wide text-slate-400">
                      {entry.label}
                    </p>
                    <p className="text-2xl font-semibold text-white">
                      {formatStatValue(entry.value)}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/70 text-white ring-1 ring-white/10">
            <CardContent className="space-y-3 p-5">
              <p className="text-sm text-slate-400">Verification</p>
              <h3 className="text-xl font-semibold">Creator badge</h3>
              <div className="flex items-center gap-2">{verificationBadge}</div>
              <p className="text-sm text-slate-300">
                Boost trust and visibility by getting verified. Provide context
                for the review team.
              </p>
              <Textarea
                placeholder="Tell us why you should be verified..."
                value={verificationReason}
                onChange={(e) => setVerificationReason(e.target.value)}
                className="border-white/10 bg-white/5 text-white placeholder:text-slate-400 focus-visible:ring-secondary/50"
              />
              <Button
                className="w-full bg-gradient-to-r from-secondary to-light-blue text-slate-900"
                onClick={handleSubmitVerification}
                disabled={submittingVerification || isVerified || isVerificationPending}
              >
                {isVerified
                  ? "Already verified"
                  : isVerificationPending
                    ? "Pending review"
                  : submittingVerification
                    ? "Submitting..."
                    : "Submit verification"}
              </Button>
              {verification?.reason && (
                <p className="text-xs text-slate-400">
                  Last reason: {verification.reason}
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="bg-slate-900/70 text-white ring-1 ring-white/10">
          <CardContent className="space-y-4 p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm text-slate-400">Services</p>
                <h3 className="text-xl font-semibold">Publish and manage</h3>
              </div>
              <Link href="/services">
                <Button className="bg-secondary text-slate-900 hover:bg-secondary/90" variant="secondary">
                  View marketplace
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="md:col-span-1 space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-semibold text-white">
                  Quick create
                </p>
                <Input
                  placeholder="Title"
                  value={serviceDraft.title}
                  onChange={(e) =>
                    setServiceDraft({ ...serviceDraft, title: e.target.value })
                  }
                  className="border-white/10 bg-transparent text-white placeholder:text-slate-400 focus-visible:ring-secondary/60"
                />
                <Textarea
                  placeholder="Description"
                  value={serviceDraft.description}
                  onChange={(e) =>
                    setServiceDraft({
                      ...serviceDraft,
                      description: e.target.value,
                    })
                  }
                  className="border-white/10 bg-transparent text-white placeholder:text-slate-400 focus-visible:ring-secondary/60"
                />
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    type="number"
                    min="0"
                    placeholder="Price"
                    value={serviceDraft.price}
                    onChange={(e) =>
                      setServiceDraft({ ...serviceDraft, price: e.target.value })
                    }
                    className="border-white/10 bg-transparent text-white placeholder:text-slate-400 focus-visible:ring-secondary/60"
                  />
                  <Input
                    type="number"
                    min="1"
                    placeholder="Delivery (days)"
                    value={serviceDraft.deliveryTime}
                    onChange={(e) =>
                      setServiceDraft({
                        ...serviceDraft,
                        deliveryTime: e.target.value,
                      })
                    }
                    className="border-white/10 bg-transparent text-white placeholder:text-slate-400 focus-visible:ring-secondary/60"
                  />
                </div>
                <Input
                  placeholder="Tags (comma separated)"
                  value={serviceDraft.tags}
                  onChange={(e) =>
                    setServiceDraft({ ...serviceDraft, tags: e.target.value })
                  }
                  className="border-white/10 bg-transparent text-white placeholder:text-slate-400 focus-visible:ring-secondary/60"
                />
                <Button
                  className="w-full bg-secondary text-slate-900 hover:bg-secondary/90"
                  onClick={
                    editingId ? () => handleUpdateService(editingId) : handleCreateService
                  }
                  disabled={submittingService}
                >
                  {submittingService
                    ? "Saving..."
                    : editingId
                      ? "Save changes"
                      : "Create service"}
                </Button>
                {editingId && (
                  <Button
                    variant="outline"
                    className="w-full border-white/30 text-white hover:bg-white/5"
                    onClick={() => {
                      setEditingId(null);
                      setServiceDraft(emptyServiceDraft);
                    }}
                  >
                    Cancel edit
                  </Button>
                )}
              </div>

              <div className="md:col-span-2 space-y-3">
                {profile && myServices.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-white/20 p-6 text-sm text-slate-300">
                    No services yet. Use the quick create panel to publish your
                    first offer.
                  </div>
                )}

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {myServices.map((service) => (
                    <div
                      key={service.id}
                      className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs uppercase tracking-wide text-slate-400">
                            #{service.id}
                          </p>
                          <h4 className="text-lg font-semibold text-white">
                            {service.title}
                          </h4>
                          <p className="text-sm text-slate-300 line-clamp-3">
                            {service.description}
                          </p>
                        </div>
                        <Badge variant="outline" className="border-white/20 text-white">
                          {service.ownerName || "You"}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
                        <Badge className="bg-emerald-600 text-white border-transparent">
                          ${service.price}
                        </Badge>
                        <Badge variant="outline" className="border-white/20 text-white">
                          {service.deliveryTime} days delivery
                        </Badge>
                        {service.tags &&
                          service.tags
                            .split(",")
                            .filter(Boolean)
                            .slice(0, 3)
                            .map((tag, i) => (
                              <Badge
                                key={`${service.id}-${i}`}
                                variant="outline"
                                className="border-white/20 text-white"
                              >
                                {tag.trim()}
                              </Badge>
                            ))}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="secondary"
                          className="bg-secondary text-slate-900 hover:bg-secondary/90"
                          onClick={() => startEditing(service)}
                        >
                          Edit
                        </Button>
                        <Button
                          className="bg-rose-500 hover:bg-rose-600"
                          onClick={() => handleDeleteService(service.id)}
                          disabled={submittingService}
                        >
                          Delete
                        </Button>
                        <Button
                          variant="outline"
                          className="border-white/30 text-white hover:bg-white/5"
                          onClick={() => router.push(`/services/${service.id}`)}
                        >
                          View details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/70 text-white ring-1 ring-white/10">
          <CardContent className="space-y-4 p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm text-slate-400">Explore creators</p>
                <h3 className="text-xl font-semibold">Lookup by ID</h3>
              </div>
              <Link href="/services">
                <Button className="bg-secondary text-slate-900 hover:bg-secondary/90" variant="secondary">
                  Discover services
                </Button>
              </Link>
            </div>

            <CreatorLookup />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function formatLabel(key: string) {
  return key
    .replace(/[_-]/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatStatValue(value: string | number) {
  if (typeof value === "number") {
    return new Intl.NumberFormat().format(value);
  }
  return value;
}

function CreatorLookup() {
  const [creatorId, setCreatorId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [creator, setCreator] = useState<Profile | null>(null);

  async function handleLookup() {
    if (!creatorId) return;
    setLoading(true);
    setError("");
    try {
      const data = await api<Profile>(`/profile/${creatorId}`);
      setCreator(data);
    } catch (err) {
      const message =
        err instanceof Error && err.message
          ? err.message
          : "Unable to find that creator.";
      setError(message);
      setCreator(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4">
        <p className="text-sm text-slate-300">Find a creator by ID</p>
        <div className="flex gap-2">
          <Input
            placeholder="Creator ID"
            value={creatorId}
            onChange={(e) => setCreatorId(e.target.value)}
            className="border-white/10 bg-transparent text-white placeholder:text-slate-400 focus-visible:ring-secondary/60"
          />
          <Button
            onClick={handleLookup}
            className="bg-secondary text-slate-900 hover:bg-secondary/90"
            disabled={loading}
          >
            {loading ? "Searching..." : "Lookup"}
          </Button>
        </div>
        {error && <p className="text-xs text-rose-200">{error}</p>}
      </div>

      {creator && (
        <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Creator profile
              </p>
              <h4 className="text-lg font-semibold text-white">
                {creator.displayName}
              </h4>
              <p className="text-sm text-slate-300">{creator.bio}</p>
            </div>
            {creator.location && (
              <Badge variant="outline" className="border-white/20 text-white">
                {creator.location}
              </Badge>
            )}
          </div>
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-300">
            {creator.skills &&
              creator.skills
                .split(",")
                .filter(Boolean)
                .map((skill, idx) => (
                  <Badge
                    key={`${creator.id}-${idx}`}
                    variant="outline"
                    className="border-white/20 text-white"
                  >
                    {skill.trim()}
                  </Badge>
                ))}
          </div>
        </div>
      )}
    </div>
  );
}
