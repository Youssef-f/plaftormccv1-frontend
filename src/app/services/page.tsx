"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { Service } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [filtered, setFiltered] = useState<Service[]>([]);
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();

  const tagFromUrl = useMemo(() => searchParams.get("tag"), [searchParams]);

  function applyTag(tag: string) {
    setTagFilter(tag);
    setSearch("");
  }

  useEffect(() => {
    if (tagFromUrl) {
      setTagFilter(tagFromUrl);
    }
  }, [tagFromUrl]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await api<Service[]>("/services");
        setServices(data);
        setFiltered(data);
      } catch (err) {
        const message =
          err instanceof Error && err.message
            ? err.message
            : "Unable to load services.";
        setError(message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  useEffect(() => {
    let result = [...services];

    if (search.trim() !== "") {
      const s = search.toLowerCase();
      result = result.filter(
        (srv) =>
          srv.title.toLowerCase().includes(s) ||
          srv.description.toLowerCase().includes(s) ||
          srv.tags.toLowerCase().includes(s)
      );
    }

    if (tagFilter.trim() !== "") {
      const t = tagFilter.toLowerCase();
      result = result.filter((srv) => srv.tags.toLowerCase().includes(t));
    }

    if (minPrice !== "") {
      result = result.filter((srv) => srv.price >= Number(minPrice));
    }

    if (maxPrice !== "") {
      result = result.filter((srv) => srv.price <= Number(maxPrice));
    }

    setFiltered(result);
  }, [search, minPrice, maxPrice, tagFilter, services]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 text-white">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm uppercase tracking-[0.12em] text-slate-400">
              Marketplace
            </p>
            <h1 className="text-3xl font-semibold text-white">Services</h1>
            <p className="text-slate-400">
              Browse and filter creators by tags, price, and keywords.
            </p>
          </div>
          <Button
            className="bg-secondary text-slate-900 hover:bg-secondary/90"
            onClick={() => router.push("/services/create")}
          >
            Publish a service
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
          <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4 lg:col-span-3">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
              <Input
                placeholder="Search services..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border-white/10 bg-transparent text-white placeholder:text-slate-400 focus-visible:ring-secondary/60"
              />

              <Input
                placeholder="Min price"
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="border-white/10 bg-transparent text-white placeholder:text-slate-400 focus-visible:ring-secondary/60"
              />

              <Input
                placeholder="Max price"
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="border-white/10 bg-transparent text-white placeholder:text-slate-400 focus-visible:ring-secondary/60"
              />

              <Input
                placeholder="Filter by tag"
                value={tagFilter}
                onChange={(e) => setTagFilter(e.target.value)}
                className="border-white/10 bg-transparent text-white placeholder:text-slate-400 focus-visible:ring-secondary/60"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm text-slate-300">Active filters</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {tagFilter && (
                <Badge
                  variant="outline"
                  className="border-white/30 text-white"
                  onClick={() => setTagFilter("")}
                >
                  Tag: {tagFilter}
                </Badge>
              )}
              {search && (
                <Badge
                  variant="outline"
                  className="border-white/30 text-white"
                  onClick={() => setSearch("")}
                >
                  Search: {search}
                </Badge>
              )}
              {!tagFilter && !search && (
                <p className="text-xs text-slate-400">None</p>
              )}
            </div>
          </div>
        </div>

        {loading && (
          <p className="text-slate-300">Loading services...</p>
        )}
        {error && (
          <div className="rounded-xl border border-rose-300/40 bg-rose-50/10 px-4 py-3 text-sm text-rose-100">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((service) => (
            <Card
              key={service.id}
              className="cursor-pointer border-white/10 bg-white/5 text-white shadow-lg shadow-black/10 transition hover:-translate-y-1 hover:border-white/30 hover:shadow-black/30"
              onClick={() => router.push(`/services/${service.id}`)}
            >
              <CardContent className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-400">
                      {service.ownerName || "Creator"}
                    </p>
                    <h2 className="text-xl font-semibold text-white">
                      {service.title}
                    </h2>
                  </div>
                  <Badge className="bg-emerald-600 text-white border-transparent">
                    ${service.price}
                  </Badge>
                </div>
                <p className="text-sm text-slate-300 line-clamp-3">
                  {service.description}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {service.tags.split(",").map((tag, i) => (
                    <button
                      key={i}
                      onClick={(e) => {
                        e.stopPropagation();
                        applyTag(tag.trim());
                      }}
                      className="rounded-full border border-white/15 bg-white/5 px-2 py-1 text-xs text-slate-200 transition hover:border-secondary hover:text-secondary"
                    >
                      {tag.trim()}
                    </button>
                  ))}
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Delivery: {service.deliveryTime} days</span>
                  <span>ID #{service.id}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
