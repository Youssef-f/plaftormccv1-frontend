"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Service } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import React from "react";
import { useRouter } from "next/navigation";



export default function ServiceDetails({ params }: { params: { id: string } }) {
const [service, setService] = useState<Service | null>(null);
const [loading, setLoading] = useState(true);
const router = useRouter();


useEffect(() => {
    (async () => {
    const { id } = await params;
try {
const res = await api<Service>(`/services/${id}`);
setService(res);
} catch (err) {
console.error(err);
} finally {
setLoading(false);
}
})();
}, [params.id]);


if (loading) return <p className="p-6">Loading service...</p>;
if (!service) return <p className="p-6">Service not found</p>;


const tags = service.tags?.split(",") || [];


return (
<div className="p-6 max-w-3xl mx-auto">
<Card className="shadow-md rounded-2xl">
<CardContent className="p-6 space-y-4">
<h1 className="text-3xl font-bold">{service.title}</h1>
<p className="text-gray-600">By {service.ownerName}</p>


<p>{service.description}</p>


<div className="flex gap-2 flex-wrap mt-4">
{tags.map((tag, i) => (
<span
key={i}
className="px-3 py-1 bg-gray-200 rounded-full text-sm"
>
{tag.trim()}
</span>
))}
</div>


<p className="text-2xl font-bold mt-6">${service.price}</p>
<div className="flex gap-4 mt-6">
  <button
    onClick={() => router.push(`/services/${service.id}/edit`)}
    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
  >
    Edit
  </button>

  <button
    onClick={async () => {
      if (!confirm("Are you sure you want to delete this service?")) return;

      try {
        await api(`/services/${service.id}`, { method: "DELETE" });
        router.push("/services");
      } catch (err) {
        console.error(err);
      }
    }}
    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
  >
    Delete
  </button>
</div>

</CardContent>
</Card>
</div>
);
}