"use client";

import Link from "next/link";
import { Home, User, Package, PlusCircle } from "lucide-react";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/profile", label: "My Profile", icon: User },
  { href: "/services", label: "My Services", icon: Package },
  { href: "/services/create", label: "Create Service", icon: PlusCircle },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white shadow-md border-r hidden md:block">
      <div className="px-6 py-4 border-b">
        <h1 className="text-2xl font-bold">CreatorHub</h1>
      </div>

      <nav className="p-4 space-y-2">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;

          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition ${
                active
                  ? "bg-gray-900 text-white"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
