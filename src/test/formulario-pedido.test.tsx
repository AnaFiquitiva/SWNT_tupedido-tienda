import { beforeEach, describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { FormularioPedido } from "@/components/pedido/FormularioPedido";
import { RequiereSesion } from "@/components/pedido/RequiereSesion";
import { CLAVE_SESION } from "@/hooks/useSesion";

beforeEach(() => localStorage.clear());

describe("FormularioPedido (pantalla)", () => {
  it("al guardar sin productos muestra 'Agrega un producto' y enfoca el primer error", () => {
    render(<FormularioPedido onTerminar={() => {}} />);
    fireEvent.change(screen.getByLabelText("Nombre del cliente"), { target: { value: "Doña Rosa" } });
    fireEvent.click(screen.getByRole("button", { name: "Guardar pedido" }));
    expect(screen.getByText("Agrega un producto")).toBeInTheDocument();
    expect(document.activeElement).toBe(screen.getByLabelText("Otro producto"));
  });

  it("al guardar un pedido válido muestra el número del pedido", () => {
    render(<FormularioPedido onTerminar={() => {}} />);
    fireEvent.change(screen.getByLabelText("Nombre del cliente"), { target: { value: "Doña Rosa" } });
    fireEvent.click(screen.getByRole("button", { name: "+ Arroz" }));
    fireEvent.click(screen.getByRole("button", { name: "Guardar pedido" }));
    expect(screen.getByText("#1")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Registrar otro pedido" })).toBeInTheDocument();
  });
});

describe("RequiereSesion", () => {
  it("sin sesión pide iniciar sesión y oculta el contenido", async () => {
    render(<RequiereSesion><p>Formulario</p></RequiereSesion>);
    expect(await screen.findByText("Inicia sesión para registrar pedidos")).toBeInTheDocument();
    expect(screen.queryByText("Formulario")).not.toBeInTheDocument();
  });

  it("con sesión muestra el contenido", async () => {
    localStorage.setItem(CLAVE_SESION, JSON.stringify({ nombre: "Tendero" }));
    render(<RequiereSesion><p>Formulario</p></RequiereSesion>);
    expect(await screen.findByText("Formulario")).toBeInTheDocument();
  });
});
