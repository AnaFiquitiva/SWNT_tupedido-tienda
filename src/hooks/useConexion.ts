import { useEffect, useState } from "react";
import { sincronizarPendientes } from "@/lib/pedido";

/** Escucha la conexión y sincroniza los pedidos pendientes al volver la señal. */
export function useConexion() {
  const [enLinea, setEnLinea] = useState(true);
  useEffect(() => {
    setEnLinea(navigator.onLine);
    sincronizarPendientes(localStorage);
    const on = () => {
      setEnLinea(true);
      sincronizarPendientes(localStorage);
    };
    const off = () => setEnLinea(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);
  return enLinea;
}
