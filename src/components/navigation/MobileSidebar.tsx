"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import SidebarLinks from "./SidebarLinks";

export default function MobileSidebar() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="md:hidden">
          <Menu size={26} />
        </button>
      </SheetTrigger>

      <SheetContent side="left" className="p-0 w-64">
        <div className="px-6 py-4 border-b">
          <h1 className="text-2xl font-bold">CreatorHub</h1>
        </div>

        {/* Mobile navigation using shared component */}
        <SidebarLinks />
      </SheetContent>
    </Sheet>
  );
}
