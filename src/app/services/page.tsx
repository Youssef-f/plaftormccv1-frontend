"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Service } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";


export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [filtered, setFiltered] = useState<Service[]>([]);
const searchParams = useSearchParams();

  // search + filters
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [tagFilter, setTagFilter] = useState("");

  const router = useRouter();


  function applyTag(tag: string) {
  setTagFilter(tag);
  setSearch("");             // clear search for clarity
}


  useEffect(() => {
    async function load() {
      const data = await api<Service[]>("/services");
      setServices(data);
      setFiltered(data);
    }
    load();
  }, []);
  useEffect(() => {
  const tagFromUrl = searchParams.get("tag");
  if (tagFromUrl) {
    setTagFilter(tagFromUrl);
  }
}, [searchParams]);


  // filtering logic
  useEffect(() => {
    let result = [...services];

    // SEARCH (title, description, tags)
    if (search.trim() !== "") {
      const s = search.toLowerCase();
      result = result.filter((srv) =>
        srv.title.toLowerCase().includes(s) ||
        srv.description.toLowerCase().includes(s) ||
        srv.tags.toLowerCase().includes(s)
      );
    }

    // TAG FILTER
    if (tagFilter.trim() !== "") {
      const t = tagFilter.toLowerCase();
      result = result.filter((srv) => srv.tags.toLowerCase().includes(t));
    }

    // MIN PRICE
    if (minPrice !== "") {
      result = result.filter((srv) => srv.price >= Number(minPrice));
    }

    // MAX PRICE
    if (maxPrice !== "") {
      result = result.filter((srv) => srv.price <= Number(maxPrice));
    }

    setFiltered(result);
  }, [search, minPrice, maxPrice, tagFilter, services]);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Services</h1>

      {/* Search + Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Input
          placeholder="Search services..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Input
          placeholder="Min price"
          type="number"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />

        <Input
          placeholder="Max price"
          type="number"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />

        <Input
          placeholder="Filter by tag"
          value={tagFilter}
          onChange={(e) => setTagFilter(e.target.value)}
        />
      </div>

      {/* Services List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((service) => (
          <Card
            key={service.id}
            className="cursor-pointer hover:shadow-lg transition"
            onClick={() => router.push(`/services/${service.id}`)}
          >
            <CardContent className="p-4 space-y-2">
              <h2 className="text-xl font-semibold">{service.title}</h2>
              <p className="text-gray-600 text-sm line-clamp-2">
                {service.description}
              </p>
              <p className="font-bold">${service.price}</p>

             <div className="flex gap-1 flex-wrap">
  {service.tags.split(",").map((tag, i) => (
    <button
      key={i}
      onClick={(e) => {
        e.stopPropagation();      // prevent navigating to details
        applyTag(tag.trim());     // apply tag filter
      }}
      className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200"
    >
      {tag.trim()}
    </button>
  ))}
</div>

            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
