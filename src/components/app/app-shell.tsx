"use client";

import {
  BarChart3,
  Beef,
  Building2,
  HeartPulse,
  Layers3,
  Menu,
  ReceiptText,
  Scale,
  Sprout,
  WalletCards,
  Wheat
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

import { CreateFarmDialog } from "@/components/app/create-farm-dialog";
import { FarmSwitcher } from "@/components/app/farm-switcher";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePastureStore } from "@/features/pastures/store";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/animales", label: "Animales", icon: Beef },
  { href: "/lotes", label: "Lotes", icon: Layers3 },
  { href: "/pesajes", label: "Pesajes", icon: Scale },
  { href: "/potreros", label: "Rotacion", icon: Sprout },
  { href: "/sanidad", label: "Sanidad", icon: HeartPulse },
  { href: "/suplementacion", label: "Suplementos", icon: Wheat },
  { href: "/costos", label: "Costos", icon: WalletCards },
  { href: "/ventas", label: "Ventas", icon: ReceiptText }
];

const mobilePrimaryNav = [
  { href: "/potreros", label: "Rotacion", icon: Sprout },
  { href: "/ganado", label: "Ganado", icon: Beef },
  { href: "/costos", label: "Costos", icon: WalletCards },
  { href: "/gestion", label: "Gestion", icon: Layers3 },
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 }
];
const mobileOverflowNav = [
  { href: "/suplementacion", label: "Suplementos", icon: Wheat },
  { href: "/sanidad", label: "Sanidad", icon: HeartPulse },
  { href: "/pesajes", label: "Pesajes", icon: Scale },
  { href: "/ventas", label: "Ventas", icon: ReceiptText }
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith("/login");
  const isLoading = usePastureStore((state) => state.isLoading);
  const error = usePastureStore((state) => state.error);
  const farms = usePastureStore((state) => state.farms);
  const initializeData = usePastureStore((state) => state.initializeData);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    if (!isAuthPage) {
      void initializeData();
    }
  }, [initializeData, isAuthPage]);

  useEffect(() => {
    if (isAuthPage) {
      return;
    }

    let startY = 0;
    let armed = false;

    const handleTouchStart = (event: TouchEvent) => {
      startY = event.touches[0]?.clientY ?? 0;
      armed = window.scrollY <= 0;
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (!armed || syncing) {
        return;
      }

      const currentY = event.touches[0]?.clientY ?? 0;
      if (currentY - startY > 90 && window.scrollY <= 0) {
        armed = false;
        setSyncing(true);
        void initializeData().finally(() => {
          window.setTimeout(() => setSyncing(false), 450);
        });
      }
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [initializeData, isAuthPage, syncing]);

  if (isAuthPage) {
    return children;
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b bg-white/92 backdrop-blur">
        <div className="mx-auto grid max-w-6xl grid-cols-[2.5rem_1fr_minmax(8.5rem,38vw)] items-center gap-2 px-3 py-2 md:flex md:justify-between md:gap-3 md:px-4 md:py-3">
          <Button type="button" variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen((value) => !value)}>
            <Menu className="h-5 w-5" aria-hidden="true" />
          </Button>
          <Link href="/potreros" className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Ceba bovina</p>
            <h1 className="truncate text-base font-bold text-slate-950 md:text-lg">APP Ganadera</h1>
          </Link>
          <FarmSwitcher />
        </div>
        {mobileMenuOpen && (
          <div className="border-t bg-white px-4 py-2 md:hidden">
            <div className="grid grid-cols-2 gap-2">
              {mobileOverflowNav.map((item) => {
                const Icon = item.icon;
                const active = pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-semibold text-slate-600",
                      active && "border-emerald-200 bg-emerald-50 text-emerald-800"
                    )}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
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

      <main className="mx-auto max-w-6xl px-4 py-5 pb-24 md:pb-8">
        {syncing && (
          <div className="fixed left-1/2 top-20 z-40 -translate-x-1/2 rounded-full bg-slate-950 px-3 py-1.5 text-xs font-semibold text-white shadow-lg md:hidden">
            Sincronizando...
          </div>
        )}
        {isLoading ? (
          <div className="rounded-lg border bg-white p-4 text-sm text-slate-600 shadow-sm">Cargando datos...</div>
        ) : farms.length === 0 ? (
          <FarmSetup />
        ) : (
          <>
            {error && <div className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-800">{error}</div>}
            {children}
          </>
        )}
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t bg-white/96 shadow-soft backdrop-blur md:hidden">
        <div className="safe-bottom grid grid-cols-5 gap-1 px-2 pt-2">
          {mobilePrimaryNav.map((item) => {
            const Icon = item.icon;
            const active = pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex min-h-14 min-w-0 flex-col items-center justify-center gap-1 rounded-md text-[11px] font-medium text-slate-500",
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

function FarmSetup() {
  const [open, setOpen] = useState(true);

  return (
    <div className="mx-auto max-w-xl">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 text-emerald-700">
            <Building2 className="h-5 w-5" aria-hidden="true" />
            <p className="text-sm font-semibold uppercase tracking-wide">Configuracion inicial</p>
          </div>
          <CardTitle>Crear finca</CardTitle>
        </CardHeader>
        <CardContent>
          <Button type="button" className="w-full" onClick={() => setOpen(true)}>
            Crear finca
          </Button>
        </CardContent>
      </Card>
      <CreateFarmDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}
