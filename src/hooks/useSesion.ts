import { useCallback, useEffect, useState } from "react";

/** Clave donde se guarda el usuario simulado en el celular. */
export const CLAVE_SESION = "tupedido:sesion";

export interface Usuario {
  nombre: string;
}

/**
 * Sesión simulada (usuario guardado localmente).
 * Se lee en useEffect para no romper el renderizado en servidor.
 */
export function useSesion() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CLAVE_SESION);
      setUsuario(raw ? (JSON.parse(raw) as Usuario) : null);
    } catch {
      setUsuario(null);
    }
    setCargando(false);
  }, []);

  const iniciar = useCallback((nombre: string) => {
    const u = { nombre: nombre.trim() || "Tendero" };
    localStorage.setItem(CLAVE_SESION, JSON.stringify(u));
    setUsuario(u);
  }, []);

  const cerrar = useCallback(() => {
    localStorage.removeItem(CLAVE_SESION);
    setUsuario(null);
  }, []);

  return { usuario, cargando, iniciar, cerrar };
}
