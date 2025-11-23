

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-md rounded-2xl">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-2">My Profile</h2>
            <p className="text-gray-600 mb-4">View or update your personal info.</p>
            <Link href="/profile">
              <Button className="w-full">Go to Profile</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="shadow-md rounded-2xl">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-2">My Services</h2>
            <p className="text-gray-600 mb-4">Manage your service listings.</p>
            <Link href="/services">
              <Button className="w-full">View Services</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="shadow-md rounded-2xl">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-2">Create New Service</h2>
            <p className="text-gray-600 mb-4">Add a new service to your catalog.</p>
            <Link href="/services/create">
              <Button className="w-full">Create</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}