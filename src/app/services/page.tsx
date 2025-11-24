"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Service } from "@/lib/types";
import ServiceCard from "@/components/cards/ServiceCard";

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await api<Service[]>("/services");
        setServices(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p className="p-6">Loading services...</p>;

  if (services.length === 0)
    return (
      <p className="p-6 text-gray-500">
        No services found. Try creating one!
      </p>
    );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Available Services</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </div>
  );
}
