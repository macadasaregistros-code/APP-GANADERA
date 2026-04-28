"use client";

import { LogOut, MapPin, Plus } from "lucide-react";
import { useState } from "react";

import { CreateFarmDialog } from "@/components/app/create-farm-dialog";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { usePastureStore } from "@/features/pastures/store";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function FarmSwitcher() {
  const farms = usePastureStore((state) => state.farms);
  const selectedFarmId = usePastureStore((state) => state.selectedFarmId);
  const setSelectedFarmId = usePastureStore((state) => state.setSelectedFarmId);
  const [createFarmOpen, setCreateFarmOpen] = useState(false);

  return (
    <div className="flex min-w-0 items-center justify-end gap-1 md:gap-2">
      <label className="flex min-w-0 items-center gap-1 rounded-md border bg-white px-2 py-1.5 shadow-sm md:gap-2">
        <MapPin className="hidden h-4 w-4 shrink-0 text-emerald-700 sm:block" aria-hidden="true" />
        <span className="sr-only">Finca</span>
        <Select
          value={selectedFarmId}
          onChange={(event) => setSelectedFarmId(event.target.value)}
          className="h-8 min-w-0 max-w-24 border-0 bg-transparent px-0 text-xs shadow-none focus-visible:ring-0 md:max-w-none md:text-sm"
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
        variant="outline"
        size="icon"
        className="h-9 w-9 shrink-0 border-0 bg-transparent shadow-none"
        title="Crear finca"
        onClick={() => setCreateFarmOpen(true)}
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-9 w-9 shrink-0"
        title="Cerrar sesion"
        onClick={async () => {
          const supabase = createSupabaseBrowserClient();
          await supabase.auth.signOut();
          window.location.href = "/login";
        }}
      >
        <LogOut className="h-4 w-4" aria-hidden="true" />
      </Button>
      <CreateFarmDialog open={createFarmOpen} onOpenChange={setCreateFarmOpen} />
    </div>
  );
}
