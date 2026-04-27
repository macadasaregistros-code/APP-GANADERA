"use client";

import { Building2, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { usePastureStore } from "@/features/pastures/store";

type CreateFarmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CreateFarmDialog({ open, onOpenChange }: CreateFarmDialogProps) {
  const createFarm = usePastureStore((state) => state.createFarm);
  const error = usePastureStore((state) => state.error);
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [municipality, setMunicipality] = useState("");
  const [productiveAreaHa, setProductiveAreaHa] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    try {
      await createFarm({
        name,
        department,
        municipality,
        productiveAreaHa: productiveAreaHa ? Number(productiveAreaHa) : undefined
      });
      setName("");
      setDepartment("");
      setMunicipality("");
      setProductiveAreaHa("");
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/45 px-4 py-5 backdrop-blur-sm">
      <div className="mx-auto flex min-h-full max-w-xl items-center">
        <Card className="max-h-[90vh] w-full overflow-y-auto">
          <CardHeader className="flex-row items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-emerald-700">
                <Building2 className="h-5 w-5" aria-hidden="true" />
                <p className="text-sm font-semibold uppercase tracking-wide">Finca</p>
              </div>
              <CardTitle className="mt-2">Crear finca</CardTitle>
            </div>
            <Button type="button" variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4" aria-hidden="true" />
            </Button>
          </CardHeader>
          <CardContent>
            <form className="grid gap-3" onSubmit={handleSubmit}>
              <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Nombre de la finca" required />
              <div className="grid grid-cols-2 gap-3 max-[420px]:grid-cols-1">
                <Input value={department} onChange={(event) => setDepartment(event.target.value)} placeholder="Departamento" />
                <Input value={municipality} onChange={(event) => setMunicipality(event.target.value)} placeholder="Municipio" />
              </div>
              <Input
                type="number"
                value={productiveAreaHa}
                onChange={(event) => setProductiveAreaHa(event.target.value)}
                placeholder="Area productiva ha"
              />
              {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p>}
              <Button type="submit" disabled={loading}>
                {loading ? "Creando..." : "Crear finca"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
