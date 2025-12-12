"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";

export default function CreateServicePage() {
  useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    tags: "",
    deliveryTime: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    setError("");
    if (
      !form.title ||
      !form.description ||
      !form.price ||
      !form.deliveryTime
    ) {
      setError("Please fill in title, description, price, and delivery time.");
      return;
    }
    setLoading(true);
    try {
      await api("/services", {
        method: "POST",
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          price: Number(form.price),
          tags: form.tags,
          deliveryTime: Number(form.deliveryTime),
        }),
      });
      router.push("/services");
    } catch (err) {
      const message =
        err instanceof Error && err.message
          ? err.message
          : "Failed to create service";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 text-white">
      <div className="mx-auto max-w-3xl">
        <Card className="border-white/10 bg-white/5 text-white ring-1 ring-white/10">
          <CardContent className="space-y-5 p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm uppercase tracking-[0.12em] text-slate-400">
                  Publish a service
                </p>
                <h1 className="text-2xl font-semibold">Create a new offer</h1>
                <p className="text-sm text-slate-400">
                  Add details for admins to review and approve.
                </p>
              </div>
              <Button
                variant="secondary"
                className="bg-secondary text-slate-900 hover:bg-secondary/90"
                onClick={() => router.push("/services")}
              >
                Back to marketplace
              </Button>
            </div>

            {error && (
              <div className="rounded-xl border border-rose-300/40 bg-rose-50/10 px-4 py-3 text-sm text-rose-100">
                {error}
              </div>
            )}

            <Input
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="border-white/10 bg-transparent text-white placeholder:text-slate-400 focus-visible:ring-secondary/60"
            />

            <Textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="border-white/10 bg-transparent text-white placeholder:text-slate-400 focus-visible:ring-secondary/60"
            />

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Input
                placeholder="Price"
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="border-white/10 bg-transparent text-white placeholder:text-slate-400 focus-visible:ring-secondary/60"
              />

              <Input
                placeholder="Delivery Time (days)"
                type="number"
                value={form.deliveryTime}
                onChange={(e) =>
                  setForm({ ...form, deliveryTime: e.target.value })
                }
                className="border-white/10 bg-transparent text-white placeholder:text-slate-400 focus-visible:ring-secondary/60"
              />
            </div>

            <Input
              placeholder="Tags (comma separated)"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              className="border-white/10 bg-transparent text-white placeholder:text-slate-400 focus-visible:ring-secondary/60"
            />

            <Button
              className="w-full bg-secondary text-slate-900 hover:bg-secondary/90"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Creating..." : "Create service"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
