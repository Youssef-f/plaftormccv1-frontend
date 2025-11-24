"use client";
import { useState } from "react";
import { api } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";


export default function CreateServicePage() {
const [form, setForm] = useState({
title: "",
description: "",
price: "",
tags: "",
deliveryTime: "",
});


async function handleSubmit() {
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
alert("Service created successfully!");
window.location.href = "/services";
} catch (err) {
alert("Failed to create service");
}
}


return (
<div className="p-6 max-w-2xl mx-auto">
<Card className="shadow-md rounded-2xl">
<CardContent className="p-6 space-y-4">
<h1 className="text-2xl font-bold mb-4">Create a New Service</h1>


<Input
placeholder="Title"
value={form.title}
onChange={(e) => setForm({ ...form, title: e.target.value })}
/>


<Textarea
placeholder="Description"
value={form.description}
onChange={(e) => setForm({ ...form, description: e.target.value })}
/>


<Input
placeholder="Price"
value={form.price}
onChange={(e) => setForm({ ...form, price: e.target.value })}
/>


<Input
placeholder="Tags (comma separated)"
value={form.tags}
onChange={(e) => setForm({ ...form, tags: e.target.value })}
/>


<Input
placeholder="Delivery Time (days)"
value={form.deliveryTime}
onChange={(e) => setForm({ ...form, deliveryTime: e.target.value })}
/>


<Button className="w-full" onClick={handleSubmit}>
Create Service
</Button>
</CardContent>
</Card>
</div>
);
}