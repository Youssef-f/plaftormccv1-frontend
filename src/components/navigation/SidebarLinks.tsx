"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/profile", label: "My Profile" },
  { href: "/services", label: "My Services" },
  { href: "/services/create", label: "Create Service" },
  { href: "/creators", label: "Creators" },
  { href: "/admin", label: "Admin Home" },
  { href: "/admin/services", label: "Admin Services" },
  { href: "/admin/creator-verification", label: "Creator Verification" },
];

export default function SidebarLinks() {
  const pathname = usePathname();
  const { role } = useAuth();

  return (
    <nav className="p-4 space-y-2 text-white">
      {navItems
        .filter((item) =>
          item.href.startsWith("/admin") ? role === "admin" : true
        )
        .map(({ href, label }) => {
        const active = pathname === href;

        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition ${
              active
                ? "bg-white/10 text-white"
                : "text-slate-200 hover:bg-white/5 hover:text-white"
            }`}
          >
            {label}
          </Link>
        );
        })}
    </nav>
  );
}
