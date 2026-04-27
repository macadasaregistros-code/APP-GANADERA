"use client";

import { LogOut, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { usePastureStore } from "@/features/pastures/store";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function FarmSwitcher() {
  const farms = usePastureStore((state) => state.farms);
  const selectedFarmId = usePastureStore((state) => state.selectedFarmId);
  const setSelectedFarmId = usePastureStore((state) => state.setSelectedFarmId);

  return (
    <div className="flex min-w-0 items-center gap-2">
      <label className="flex min-w-0 items-center gap-2 rounded-md border bg-white px-2 py-1.5 shadow-sm">
        <MapPin className="h-4 w-4 shrink-0 text-emerald-700" aria-hidden="true" />
        <span className="sr-only">Finca</span>
        <Select
          value={selectedFarmId}
          onChange={(event) => setSelectedFarmId(event.target.value)}
          className="h-8 min-w-32 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
          disabled={farms.length === 0}
        >
          {farms.length === 0 ? (
            <option>Sin finca</option>
          ) : (
            farms.map((farm) => (
              <option key={farm.id} value={farm.id}>
                {farm.name}
              </option>
            ))
          )}
        </Select>
      </label>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        title="Cerrar sesion"
        onClick={async () => {
          const supabase = createSupabaseBrowserClient();
          await supabase.auth.signOut();
          window.location.href = "/login";
        }}
      >
        <LogOut className="h-4 w-4" aria-hidden="true" />
      </Button>
    </div>
  );
}
