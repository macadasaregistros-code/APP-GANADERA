import type { ReactNode } from "react";

import { Label } from "@/components/ui/label";

export function FormField({
  label,
  error,
  children
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-1.5">
      <Label>{label}</Label>
      {children}
      {error ? <p className="text-xs font-medium text-red-600">{error}</p> : null}
    </div>
  );
}
