"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { useRouter, useParams } from "next/navigation";
import { Service } from "@/lib/types";

export default function EditServicePage() {
  const router = useRouter();
  const { id } = useParams();

  const [service, setService] = useState({
    title: "",
    description: "",
    price: 0,
    tags: ""
  });

  useEffect(() => {
    async function fetchService() {
      const data = await api<Service>(`/services/${id}`);
setService(data);

    }
    fetchService();
  }, [id]);

  async function handleSave() {
    await api(`/services/${id}`, {
      method: "PUT",
      body: JSON.stringify(service),
    });

    router.push(`/services/${id}`);
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <h1 className="text-3xl font-bold mb-4">Edit Service</h1>

      <Input
        value={service.title}
        onChange={(e) => setService({ ...service, title: e.target.value })}
        placeholder="Title"
      />

      <Textarea
        rows={5}
        value={service.description}
        onChange={(e) =>
          setService({ ...service, description: e.target.value })
        }
        placeholder="Description"
      />

      <Input
        type="number"
        value={service.price}
        onChange={(e) =>
          setService({ ...service, price: Number(e.target.value) })
        }
        placeholder="Price"
      />

      <Input
        value={service.tags}
        onChange={(e) => setService({ ...service, tags: e.target.value })}
        placeholder="Tags, comma-separated"
      />

      <Button onClick={handleSave}>Save Changes</Button>
    </div>
  );
}
