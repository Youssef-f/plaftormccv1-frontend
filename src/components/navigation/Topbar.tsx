"use client";

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import MobileSidebar from "./MobileSidebar";
import { useAuth } from "@/hooks/useAuth";

export default function Topbar() {
  const { logout } = useAuth();

  return (
    <header className="flex h-16 w-full items-center justify-between border-b border-white/10 bg-white/5 px-4 backdrop-blur">
      <MobileSidebar />

      <h2 className="hidden text-lg font-semibold text-white md:block">
        Dashboard
      </h2>

      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar className="border border-white/20">
            <AvatarFallback className="bg-white/10 text-white">U</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem>My Profile</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem
            className="text-red-500"
            onClick={() => logout()}
          >
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
