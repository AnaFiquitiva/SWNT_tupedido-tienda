import { describe, expect, it } from "vitest";
import {
  guardarPedido, leerPedidos, sincronizarPendientes, validarPedido, type Almacen, type DatosPedido,
} from "@/lib/pedido";

const memoria = (): Almacen => {
  const m = new Map<string, string>();
  return { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => void m.set(k, v) };
};

const base: DatosPedido = {
  cliente: "Doña Rosa", celular: "", entrega: "tienda", direccion: "", whatsapp: false,
  items: [{ id: "1", nombre: "Arroz", cantidad: 2, unidad: "lb" }],
};

describe("validarPedido", () => {
  it("exige al menos un producto con cantidad > 0", () => {
    expect(validarPedido({ ...base, items: [] }).items).toBe("Agrega un producto");
    expect(validarPedido({ ...base, items: [{ ...base.items[0]!, cantidad: 0 }] }).items).toBe("Agrega un producto");
  });
  it("exige dirección a domicilio", () => {
    expect(validarPedido({ ...base, entrega: "domicilio" }).direccion).toBeDefined();
  });
  it("exige celular si autoriza WhatsApp", () => {
    expect(validarPedido({ ...base, whatsapp: true }).celular).toBeDefined();
    expect(validarPedido({ ...base, whatsapp: true, celular: "3001234567" })).toEqual({});
  });
  it("rechaza celular que no tenga 10 dígitos", () => {
    expect(validarPedido({ ...base, celular: "300" }).celular).toBeDefined();
  });
});

describe("guardarPedido", () => {
  it("asigna consecutivo y estado Recibido en línea", () => {
    const a = memoria();
    expect(guardarPedido(a, base, true)).toMatchObject({ numero: 1, estado: "Recibido" });
    expect(guardarPedido(a, base, true).numero).toBe(2);
  });
  it("sin señal queda Pendiente y se sincroniza después", () => {
    const a = memoria();
    guardarPedido(a, base, false);
    expect(leerPedidos(a)[0]!.estado).toBe("Pendiente");
    expect(sincronizarPendientes(a)).toBe(1);
    expect(leerPedidos(a)[0]!.estado).toBe("Recibido");
  });
});
