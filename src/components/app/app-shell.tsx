"use client";

import {
  BarChart3,
  Beef,
  HeartPulse,
  Layers3,
  ReceiptText,
  Scale,
  Sprout,
  WalletCards,
  Wheat
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { FarmSwitcher } from "@/components/app/farm-switcher";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/animales", label: "Animales", icon: Beef },
  { href: "/lotes", label: "Lotes", icon: Layers3 },
  { href: "/pesajes", label: "Pesajes", icon: Scale },
  { href: "/potreros", label: "Potreros", icon: Sprout },
  { href: "/sanidad", label: "Sanidad", icon: HeartPulse },
  { href: "/suplementacion", label: "Suplementos", icon: Wheat },
  { href: "/costos", label: "Costos", icon: WalletCards },
  { href: "/ventas", label: "Ventas", icon: ReceiptText }
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b bg-white/92 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <Link href="/potreros" className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Ceba bovina</p>
            <h1 className="truncate text-lg font-bold text-slate-950">APP Ganadera</h1>
          </Link>
          <FarmSwitcher />
        </div>
        <div className="hidden border-t bg-white md:block">
          <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 py-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-slate-600",
                    active && "bg-emerald-50 text-emerald-800"
                  )}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-5 pb-24 md:pb-8">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t bg-white/96 shadow-soft backdrop-blur md:hidden">
        <div className="safe-bottom flex gap-1 overflow-x-auto px-2 pt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex min-h-14 min-w-20 flex-col items-center justify-center gap-1 rounded-md text-[11px] font-medium text-slate-500",
                  active && "bg-emerald-50 text-emerald-800"
                )}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
