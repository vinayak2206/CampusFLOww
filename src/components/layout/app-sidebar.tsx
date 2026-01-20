"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Home,
  BookOpen,
  Building2,
  BrainCircuit,
  ClipboardList,
  MessageSquare,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/icons";
import { mockUser } from "@/lib/data";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { auth } from "@/firebase/auth";

const navItems = [
  { href: "/dashboard", icon: Home, label: "Dashboard" },
  { href: "/dashboard/academics", icon: BookOpen, label: "Academics" },
  { href: "/dashboard/tracker", icon: ClipboardList, label: "Tracker" },
  { href: "/dashboard/hostel", icon: Building2, label: "Hostel" },
  {
    href: "/dashboard/productivity",
    icon: BrainCircuit,
    label: "Productivity Hub",
  },
  {
    href: "/ask-doubt",
    icon: MessageSquare,
    label: "Ask a Doubt",
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [displayLabel, setDisplayLabel] = useState<string>("");

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      setPhotoUrl(user?.photoURL ?? null);
      const fallback = user?.displayName ?? user?.email ?? "";
      setDisplayLabel(fallback);
    });
    return () => unsub();
  }, []);

  const initials = useMemo(() => {
    const base = (displayLabel || "CF").trim();
    if (!base) return "CF";
    const parts = base.split(/\s+/).filter(Boolean);
    const first = parts[0]?.[0] ?? "C";
    const second = parts[1]?.[0] ?? parts[0]?.[1] ?? "F";
    return `${first}${second}`.toUpperCase();
  }, [displayLabel]);

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r border-white/10 bg-background/70 backdrop-blur-xl sm:flex">
      <TooltipProvider>
        <nav className="flex flex-1 flex-col items-center gap-4 px-2 sm:py-5">
          <Link
            href="/dashboard/profile"
            className={cn(
              "group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base overflow-hidden",
              pathname === "/dashboard/profile" && "ring-2 ring-ring",
            )}
          >
            {photoUrl ? (
              <Avatar className="h-9 w-9 md:h-8 md:w-8 rounded-full">
                <AvatarImage src={photoUrl} alt="Profile" />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>
            ) : (
              <Logo className="h-5 w-5 transition-all group-hover:scale-110" />
            )}
            <span className="sr-only">Profile</span>
          </Link>

          {navItems.map((item) => (
            <Tooltip key={item.href}>
              <TooltipTrigger asChild>
                <Link
                  href={item.href}
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8",
                    pathname === item.href &&
                      "bg-accent text-accent-foreground",
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="sr-only">{item.label}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">{item.label}</TooltipContent>
            </Tooltip>
          ))}

          <div className="mt-auto" />

          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8">
                <ThemeToggle />
              </div>
            </TooltipTrigger>
            <TooltipContent side="right">Theme</TooltipContent>
          </Tooltip>
        </nav>
      </TooltipProvider>
    </aside>
  );
}
