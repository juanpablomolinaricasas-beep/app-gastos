# App de gastos personales

PWA instalable para trackear gastos personales con rachas e insignias. Sin backend, sin login — todos los datos viven en `localStorage` del navegador.

## Stack

- React + TypeScript + Vite
- `vite-plugin-pwa` (manifest + service worker, funciona offline e instalable)
- `lucide-react` para íconos
- Persistencia 100% local en `localStorage`

## Desarrollo

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Deploy a GitHub Pages

El workflow `.github/workflows/deploy.yml` builda y publica `dist/` automáticamente en cada push a `main`.

Pasos únicos de configuración en el repo (Settings → Pages):
1. En **Build and deployment → Source**, elegir **GitHub Actions**.
2. Verificar que el nombre del repo coincida con el `base` configurado en `vite.config.ts` (por defecto `/app-gastos/`). Si el repo tiene otro nombre, ajustá esa constante o seteá la variable de entorno `BASE_PATH` en el workflow.

## Funcionalidad

- **Inicio**: alta rápida de gastos, botón "No voy a gastar hoy", banner de recordatorio in-app si todavía no cargaste nada hoy, y las dos rachas.
- **Resumen**: navegación por mes, desglose por categoría, listado de gastos (borrable).
- **Insignias**: rachas actuales/mejores y tiers de insignias (7/30/90/365 días) para constancia y control de gastos.
- **Ajustes**: categorías editables, ingreso quincenal + ingresos extra, notificación diaria (banner in-app) y exportación a CSV.

## Notas de diseño de datos

- Racha de constancia: días consecutivos con al menos un gasto o un "no voy a gastar" marcado. Se corta si pasa un día sin ningún registro.
- Racha de ahorro: días consecutivos en los que se tocó "no voy a gastar hoy".
- Las insignias, una vez desbloqueadas, quedan permanentes aunque la racha se corte después.
- El recordatorio diario no usa la Notification API ni el service worker para disparar avisos en background (no es confiable sin push real) — es un chequeo que corre al abrir la app y muestra un banner in-app si hoy todavía no hay registro.
