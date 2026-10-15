# TuPedido Tienda

App móvil para que tenderos de barrio en Colombia registren y consulten sus pedidos desde el celular, en lugar de un cuaderno. Prototipo construido con Lovable (React + TypeScript + Tailwind) a partir de las especificaciones de los laboratorios del curso.

**Objetivo:** que tenderos de barrio gestionen pedidos en el celular y reduzcan al menos 20 % el tiempo de entrega y los errores en 6 meses.

## Entregables de los laboratorios

| Laboratorio | Documento |
|---|---|
| 1 – Comprensión del problema y objetivo | [docs/lab1-comprension-del-problema.md](docs/lab1-comprension-del-problema.md) |
| 2 – Mapa de componentes y especificaciones | [docs/lab2-especificaciones.md](docs/lab2-especificaciones.md) |
| 3 – Implementación con Vibe Coding (Lovable) | [docs/lab3-vibe-coding.md](docs/lab3-vibe-coding.md) |

## Componente implementado: C4 – Formulario de Pedido

| Archivo | Qué hace |
|---|---|
| `src/components/pedido/FormularioPedido.tsx` | Interfaz del formulario |
| `src/components/pedido/RequiereSesion.tsx` | Exige sesión antes de mostrar el formulario |
| `src/lib/pedido.ts` | Reglas de negocio, guardado y sincronización sin conexión |
| `src/hooks/useConexion.ts` · `src/hooks/useSesion.ts` | Estado de conexión y sesión simulada |
| `src/test/` | 12 pruebas (Vitest + Testing Library) |

---

# Welcome to your Lovable project

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Open your project in the [Lovable editor](https://lovable.dev) and keep building.

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: connect the project to GitHub and every change made in Lovable is committed straight to your repository.
- **Full ownership**: this code is yours. Push to your repository and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Built with

- TanStack Start
- TypeScript
- React
- Tailwind CSS

## TuPedido Tienda — Formulario de Pedido (C4)
- Lógica: `src/lib/pedido.ts` · UI: `src/components/pedido/FormularioPedido.tsx`
- Ejecutar: `bun install && bun run dev` · Pruebas: `bunx vitest run src/test/pedido.test.ts`
- Pruebas incluidas:
  - `src/test/pedido.test.ts`: reglas de negocio (productos, domicilio, WhatsApp, celular colombiano ^3\d{9}$), consecutivo y sincronización sin señal.
  - `src/test/formulario-pedido.test.tsx` (Testing Library): "Agrega un producto" y foco al guardar vacío, número del pedido al guardar, y bloqueo sin sesión.
- Sesión: simulada con `useSesion` (usuario guardado en el celular); sin sesión se muestra "Inicia sesión para registrar pedidos".
- Sin conexión: los pedidos se guardan en el celular como "Pendiente" y pasan a "Recibido" al volver la señal.
