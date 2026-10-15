import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FormularioPedido } from "@/components/pedido/FormularioPedido";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TuPedido Tienda — Nuevo pedido" },
      { name: "description", content: "Registra pedidos de tu tienda de barrio desde el celular, rápido y sin cuaderno." },
      { property: "og:title", content: "TuPedido Tienda" },
      { property: "og:description", content: "Registra pedidos de tu tienda desde el celular." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

function Index() {
  const [abierto, setAbierto] = useState(false);
  return (
    <main className="mx-auto min-h-screen max-w-xl px-4 py-6 text-base">
      <header className="mb-6">
        <p className="font-display text-2xl font-bold text-primary">TuPedido Tienda</p>
      </header>
      {abierto ? (
        <FormularioPedido key={Date.now()} onTerminar={() => setAbierto(false)} />
      ) : (
        <section className="flex flex-col gap-4 py-16 text-center">
          <h1 className="font-display text-3xl font-bold">Adiós al cuaderno</h1>
          <p className="text-muted-foreground">Anota los pedidos de tus clientes en segundos.</p>
          <button type="button" className="btn-primario" onClick={() => setAbierto(true)}>
            Nuevo pedido
          </button>
        </section>
      )}
    </main>
  );
}
