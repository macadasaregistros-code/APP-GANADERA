"use client";

import { X, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type FloatingCreateButtonProps = {
  label: string;
  onClick: () => void;
};

export function FloatingCreateButton({ label, onClick }: FloatingCreateButtonProps) {
  return (
    <Button
      type="button"
      size="icon"
      className="fixed bottom-24 right-4 z-40 h-14 w-14 rounded-full shadow-lg md:hidden"
      aria-label={label}
      title={label}
      onClick={onClick}
    >
      <span className="text-3xl leading-none">+</span>
    </Button>
  );
}

type FormPanelProps = {
  title: string;
  icon?: LucideIcon;
  open: boolean;
  onClose: () => void;
  children: ReactNode;
};

export function FormPanel({ title, icon: Icon, open, onClose, children }: FormPanelProps) {
  return (
    <div className={open ? "block" : "hidden md:block"}>
      <div className="fixed inset-0 z-50 bg-slate-950/45 px-3 py-4 backdrop-blur-sm md:static md:bg-transparent md:p-0 md:backdrop-blur-0">
        <div className="mx-auto flex min-h-full max-w-xl items-center md:block md:min-h-0 md:max-w-none">
          <Card className="max-h-[92vh] w-full overflow-y-auto">
            <CardHeader className="flex-row items-center justify-between gap-3">
              <CardTitle className="flex items-center gap-2">
                {Icon ? <Icon className="h-5 w-5 text-emerald-700" aria-hidden="true" /> : null}
                {title}
              </CardTitle>
              <Button type="button" variant="ghost" size="icon" className="md:hidden" onClick={onClose}>
                <X className="h-4 w-4" aria-hidden="true" />
              </Button>
            </CardHeader>
            <CardContent>{children}</CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
