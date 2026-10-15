import type { ReactNode } from "react";
import { useSesion } from "@/hooks/useSesion";

/** Muestra el contenido solo si hay sesión; si no, pide iniciarla. */
export function RequiereSesion({ children }: { children: ReactNode }) {
  const { usuario, cargando, iniciar } = useSesion();
  if (cargando) return null;
  if (!usuario) {
    return (
      <section className="flex flex-col gap-4 py-16 text-center">
        <p className="font-display text-2xl font-bold">Inicia sesión para registrar pedidos</p>
        <button type="button" className="btn-primario" onClick={() => iniciar("Tendero")}>
          Iniciar sesión
        </button>
      </section>
    );
  }
  return <>{children}</>;
}
