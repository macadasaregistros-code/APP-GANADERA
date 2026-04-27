# APP Ganadera - Ceba Bovina

Plataforma web mobile-first para gestion de ceba bovina en Colombia.

## Modulos implementados en Fase 1

- Dashboard gerencial por finca con GMD, costo/kg, margen estimado, animales listos y atrasados.
- Animales: ingreso, estado productivo, GMD acumulada y costo/kg ganado.
- Lotes: metricas de peso, GMD, costo/kg producido y margen estimado.
- Pesajes: registro rapido y deteccion de animales atrasados.
- Sanidad: vacunas, tratamientos, retiro sanitario, mortalidad y costos asociados.
- Suplementacion: catalogo simple y registros por lote con costo por animal.
- Costos: costos por finca, lote, animal o potrero.
- Ventas: cierre por animal con utilidad neta y ROI.

- Potreros con dias maximos de pastoreo y dias de recuperacion por potrero.
- Semaforo operativo: listo, ocupado, vencido, en recuperacion y mantenimiento.
- Rotaciones con fecha sugerida de salida y snapshots historicos.
- Bitacora de potrero: guadana, cercas, siembra, fertilizacion, agua, limpieza y observaciones.
- Costo opcional en eventos de potrero, sincronizado con costos para evitar doble registro.
- Modo demo local con 2 fincas para poder revisar la UX sin Supabase configurado.

## Comandos

```bash
npm install
npm run dev
npm run typecheck
npm run build
```

## Supabase

La migracion principal esta en:

```text
supabase/migrations/202604270001_pastures_center.sql
supabase/migrations/202604270002_ceba_core.sql
```

Variables requeridas para conectar el frontend:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```
