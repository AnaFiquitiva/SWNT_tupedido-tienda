/**
 * Lógica de negocio del Formulario de Pedido (C4) — TuPedido Tienda.
 * Sin dependencias de React: tipos, validación, consecutivo y cola sin conexión.
 */

export type Unidad = "und" | "lb" | "kg" | "paq" | "L";
export type TipoEntrega = "tienda" | "domicilio";
export type EstadoPedido = "Recibido" | "Pendiente";

export interface ItemPedido {
  id: string;
  nombre: string;
  cantidad: number;
  unidad: Unidad;
}

export interface DatosPedido {
  cliente: string;
  celular: string;
  items: ItemPedido[];
  entrega: TipoEntrega;
  direccion: string;
  whatsapp: boolean;
}

export interface Pedido extends DatosPedido {
  numero: number;
  estado: EstadoPedido;
  creadoEn: string;
}

export const UNIDADES: Unidad[] = ["und", "lb", "kg", "paq", "L"];

/** Regla 4: los 20 productos más pedidos (botones de un toque). */
export const PRODUCTOS_FRECUENTES: { nombre: string; unidad: Unidad }[] = [
  { nombre: "Arroz", unidad: "lb" },
  { nombre: "Huevos", unidad: "und" },
  { nombre: "Leche", unidad: "L" },
  { nombre: "Pan", unidad: "und" },
  { nombre: "Aceite", unidad: "L" },
  { nombre: "Azúcar", unidad: "lb" },
  { nombre: "Café", unidad: "paq" },
  { nombre: "Panela", unidad: "und" },
  { nombre: "Papa", unidad: "lb" },
  { nombre: "Plátano", unidad: "und" },
  { nombre: "Fríjol", unidad: "lb" },
  { nombre: "Lenteja", unidad: "lb" },
  { nombre: "Sal", unidad: "paq" },
  { nombre: "Gaseosa", unidad: "und" },
  { nombre: "Arepas", unidad: "paq" },
  { nombre: "Queso", unidad: "lb" },
  { nombre: "Jabón", unidad: "und" },
  { nombre: "Papel higiénico", unidad: "paq" },
  { nombre: "Chocolate", unidad: "paq" },
  { nombre: "Pasta", unidad: "paq" },
];

export type Errores = Partial<Record<"cliente" | "celular" | "items" | "direccion", string>>;

/** Valida el pedido aplicando las reglas de negocio 1–3. */
export function validarPedido(d: DatosPedido): Errores {
  const e: Errores = {};
  if (!d.cliente.trim()) e.cliente = "Escribe el nombre del cliente";
  else if (d.cliente.trim().length > 80) e.cliente = "Nombre muy largo";

  const cel = d.celular.trim();
  if (cel && !/^\d{10}$/.test(cel)) e.celular = "El celular debe tener 10 dígitos";
  else if (d.whatsapp && !cel) e.celular = "Escribe el celular para avisar por WhatsApp";

  if (!d.items.some((i) => i.nombre.trim() && i.cantidad > 0)) e.items = "Agrega un producto";

  if (d.entrega === "domicilio" && !d.direccion.trim())
    e.direccion = "Escribe la dirección del domicilio";
  return e;
}

/* ---------- Almacenamiento local (funciona sin conexión) ---------- */

const CLAVE_PEDIDOS = "tupedido:pedidos";
const CLAVE_CONSECUTIVO = "tupedido:consecutivo";

export interface Almacen {
  getItem(k: string): string | null;
  setItem(k: string, v: string): void;
}

export function leerPedidos(a: Almacen): Pedido[] {
  try {
    return JSON.parse(a.getItem(CLAVE_PEDIDOS) ?? "[]");
  } catch {
    return [];
  }
}

function escribirPedidos(a: Almacen, p: Pedido[]) {
  a.setItem(CLAVE_PEDIDOS, JSON.stringify(p));
}

/** Guarda el pedido con número consecutivo. Sin señal queda "Pendiente". */
export function guardarPedido(a: Almacen, d: DatosPedido, enLinea: boolean): Pedido {
  const numero = Number(a.getItem(CLAVE_CONSECUTIVO) ?? "0") + 1;
  a.setItem(CLAVE_CONSECUTIVO, String(numero));
  const pedido: Pedido = {
    ...d,
    items: d.items.filter((i) => i.nombre.trim() && i.cantidad > 0),
    numero,
    estado: enLinea ? "Recibido" : "Pendiente",
    creadoEn: new Date().toISOString(),
  };
  escribirPedidos(a, [...leerPedidos(a), pedido]);
  return pedido;
}

/** Sincroniza los pendientes al volver la señal. Devuelve cuántos se enviaron. */
export function sincronizarPendientes(a: Almacen): number {
  const pedidos = leerPedidos(a);
  let n = 0;
  const actualizados = pedidos.map((p) => {
    if (p.estado !== "Pendiente") return p;
    n++;
    return { ...p, estado: "Recibido" as const };
  });
  if (n) escribirPedidos(a, actualizados);
  return n;
}
