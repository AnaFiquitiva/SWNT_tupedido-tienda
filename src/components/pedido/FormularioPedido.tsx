/**
 * Formulario de Pedido (C4) — UI mobile-first, accesible (botones ≥ 48 px, texto ≥ 16 px).
 */
import { useState } from "react";
import { useConexion } from "@/hooks/useConexion";
import {
  PRODUCTOS_FRECUENTES,
  UNIDADES,
  guardarPedido,
  validarPedido,
  type DatosPedido,
  type Errores,
  type ItemPedido,
  type Pedido,
  type Unidad,
} from "@/lib/pedido";

const vacio = (): DatosPedido => ({
  cliente: "",
  celular: "",
  items: [],
  entrega: "tienda",
  direccion: "",
  whatsapp: false,
});

const nuevoId = () => Math.random().toString(36).slice(2, 10);

export function FormularioPedido({ onTerminar }: { onTerminar: () => void }) {
  const enLinea = useConexion();
  const [datos, setDatos] = useState<DatosPedido>(vacio);
  const [errores, setErrores] = useState<Errores>({});
  const [manual, setManual] = useState("");
  const [guardado, setGuardado] = useState<Pedido | null>(null);

  const set = <K extends keyof DatosPedido>(k: K, v: DatosPedido[K]) =>
    setDatos((d) => ({ ...d, [k]: v }));

  /** Un toque: agrega el producto o suma 1 si ya está. */
  const agregar = (nombre: string, unidad: Unidad) => {
    const n = nombre.trim();
    if (!n) return;
    setDatos((d) => {
      const existe = d.items.find((i) => i.nombre.toLowerCase() === n.toLowerCase());
      const items = existe
        ? d.items.map((i) => (i === existe ? { ...i, cantidad: i.cantidad + 1 } : i))
        : [...d.items, { id: nuevoId(), nombre: n, cantidad: 1, unidad }];
      return { ...d, items };
    });
    setErrores((e) => ({ ...e, items: undefined }));
  };

  const cambiarItem = (id: string, cambio: Partial<ItemPedido>) =>
    set("items", datos.items.map((i) => (i.id === id ? { ...i, ...cambio } : i)));

  const quitar = (id: string) => set("items", datos.items.filter((i) => i.id !== id));

  const enviar = (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validarPedido(datos);
    setErrores(e);
    // Lleva el foco al primer campo con error (en el orden del formulario).
    const orden: [keyof Errores, string][] = [
      ["cliente", "cliente"], ["celular", "celular"], ["items", "manual"], ["direccion", "direccion"],
    ];
    const primero = orden.find(([k]) => e[k]);
    if (primero) {
      document.getElementById(primero[1])?.focus();
      return;
    }
    setGuardado(guardarPedido(localStorage, datos, navigator.onLine));
  };

  if (guardado) {
    return (
      <section className="flex flex-col items-center gap-6 py-12 text-center" aria-live="polite">
        <p className="text-lg text-muted-foreground">Pedido guardado</p>
        <p className="font-display text-7xl font-bold text-primary">#{guardado.numero}</p>
        <p
          className={`rounded-full px-4 py-2 text-base font-semibold ${
            guardado.estado === "Recibido" ? "bg-success text-success-foreground" : "bg-warning text-warning-foreground"
          }`}
        >
          {guardado.estado}
        </p>
        {guardado.estado === "Pendiente" && (
          <p className="text-base text-muted-foreground">
            Sin señal. Se enviará solo cuando vuelva la conexión.
          </p>
        )}
        <button type="button" className="btn-primario w-full" onClick={onTerminar}>
          Registrar otro pedido
        </button>
      </section>
    );
  }

  return (
    <form onSubmit={enviar} noValidate className="flex flex-col gap-6 pb-28">
      {!enLinea && (
        <p role="status" className="rounded-lg bg-warning px-4 py-3 text-base text-warning-foreground">
          Sin conexión: el pedido se guardará como Pendiente.
        </p>
      )}

      {/* Paso 2: datos del cliente */}
      <fieldset className="flex flex-col gap-4">
        <legend className="titulo-paso">1. Cliente</legend>
        <Campo id="cliente" etiqueta="Nombre del cliente" error={errores.cliente}>
          <input id="cliente" className="entrada" value={datos.cliente} maxLength={80}
            autoComplete="name" aria-invalid={!!errores.cliente}
            onChange={(e) => set("cliente", e.target.value)} />
        </Campo>
        <Campo id="celular" etiqueta="Celular (10 dígitos)" error={errores.celular}>
          <input id="celular" className="entrada" value={datos.celular} inputMode="numeric"
            maxLength={10} aria-invalid={!!errores.celular}
            onChange={(e) => set("celular", e.target.value.replace(/\D/g, ""))} />
        </Campo>
      </fieldset>

      {/* Paso 3: productos */}
      <fieldset className="flex flex-col gap-4">
        <legend className="titulo-paso">2. Productos</legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {PRODUCTOS_FRECUENTES.map((p) => (
            <button key={p.nombre} type="button" className="btn-producto"
              onClick={() => agregar(p.nombre, p.unidad)}>
              + {p.nombre}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <label htmlFor="manual" className="sr-only">Otro producto</label>
          <input id="manual" className="entrada flex-1" placeholder="Otro producto…" value={manual}
            maxLength={60} onChange={(e) => setManual(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") { e.preventDefault(); agregar(manual, "und"); setManual(""); }
            }} />
          <button type="button" className="btn-secundario"
            onClick={() => { agregar(manual, "und"); setManual(""); }}>
            Agregar
          </button>
        </div>

        {datos.items.length > 0 && (
          <ul className="flex flex-col gap-2" aria-label="Productos del pedido">
            {datos.items.map((i) => (
              <li key={i.id} className="flex items-center gap-2 rounded-lg border bg-card p-2">
                <span className="flex-1 text-base font-medium">{i.nombre}</span>
                <label className="sr-only" htmlFor={`cant-${i.id}`}>Cantidad de {i.nombre}</label>
                <input id={`cant-${i.id}`} type="number" min={0} inputMode="decimal"
                  className="entrada w-20 text-center" value={i.cantidad}
                  onChange={(e) => cambiarItem(i.id, { cantidad: Number(e.target.value) })} />
                <label className="sr-only" htmlFor={`uni-${i.id}`}>Unidad de {i.nombre}</label>
                <select id={`uni-${i.id}`} className="entrada w-20" value={i.unidad}
                  onChange={(e) => cambiarItem(i.id, { unidad: e.target.value as Unidad })}>
                  {UNIDADES.map((u) => <option key={u}>{u}</option>)}
                </select>
                <button type="button" className="btn-icono" aria-label={`Quitar ${i.nombre}`}
                  onClick={() => quitar(i.id)}>✕</button>
              </li>
            ))}
          </ul>
        )}
        {errores.items && <p aria-live="polite" className="texto-error">{errores.items}</p>}
      </fieldset>

      {/* Paso 4: entrega y autorización */}
      <fieldset className="flex flex-col gap-4">
        <legend className="titulo-paso">3. Entrega</legend>
        <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Tipo de entrega">
          {(["tienda", "domicilio"] as const).map((t) => (
            <button key={t} type="button" role="radio" aria-checked={datos.entrega === t}
              className="btn-opcion" onClick={() => set("entrega", t)}>
              {t === "tienda" ? "Recoge en tienda" : "Domicilio"}
            </button>
          ))}
        </div>
        {datos.entrega === "domicilio" && (
          <Campo id="direccion" etiqueta="Dirección" error={errores.direccion}>
            <input id="direccion" className="entrada" value={datos.direccion} maxLength={120}
              aria-invalid={!!errores.direccion}
              onChange={(e) => set("direccion", e.target.value)} />
          </Campo>
        )}
        <label className="flex min-h-12 items-center gap-3 text-base">
          <input type="checkbox" className="size-6 accent-primary" checked={datos.whatsapp}
            onChange={(e) => set("whatsapp", e.target.checked)} />
          El cliente autoriza avisarle por WhatsApp
        </label>
      </fieldset>

      {/* Paso 5: guardar */}
      <div className="fixed inset-x-0 bottom-0 border-t bg-background p-4">
        <button type="submit" className="btn-primario mx-auto block w-full max-w-xl">
          Guardar pedido
        </button>
      </div>
    </form>
  );
}

function Campo({ id, etiqueta, error, children }: {
  id: string; etiqueta: string; error?: string | undefined; children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-base font-medium">{etiqueta}</label>
      {children}
      {error && <p aria-live="polite" className="texto-error">{error}</p>}
    </div>
  );
}
