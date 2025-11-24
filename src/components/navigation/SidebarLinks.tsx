"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/profile", label: "My Profile" },
  { href: "/services", label: "My Services" },
  { href: "/services/create", label: "Create Service" },
];

export default function SidebarLinks() {
  const pathname = usePathname();

  return (
    <nav className="p-4 space-y-2">
      {navItems.map(({ href, label }) => {
        const active = pathname === href;

        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition ${
              active
                ? "bg-gray-900 text-white"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
