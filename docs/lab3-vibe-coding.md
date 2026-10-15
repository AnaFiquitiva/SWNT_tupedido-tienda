# Laboratorio 3 – Implementación de componentes con Vibe Coding

**Herramienta:** Lovable · **Proyecto:** TuPedido Tienda · **Código:** este repositorio (sincronizado con Lovable)

## Parte A – Selección del componente

**Componente:** C4 – Formulario de Pedido (UI).

**Justificación:** cubre HU-01, la historia central de la app, y es la pantalla que más usa el tendero. Tiene reglas de validación, modo sin conexión y criterios medibles, lo que permite evaluar con claridad el código generado.

## Parte B – Prompt inicial

```text
Quiero que generes el código de un componente llamado: Formulario de Pedido (C4) de la app "TuPedido Tienda".
Tipo: UI
Lenguaje/Framework preferido: React + TypeScript + Tailwind CSS, diseño mobile-first.

Contexto: app para que tenderos de barrio en Colombia registren pedidos desde el celular en lugar de un cuaderno. Los usuarios tienen poca experiencia digital.

Especificación del componente:
- Propósito: registrar pedidos rápido desde el celular.
- Entradas: nombre del cliente; celular (10 dígitos); productos (nombre, cantidad, unidad), elegidos de una lista de 20 productos frecuentes o escritos a mano; tipo de entrega (recoger en tienda o domicilio + dirección); autorización para avisar por WhatsApp (sí/no).
- Salidas: pedido guardado con estado "Recibido" y número consecutivo; pantalla de confirmación con el número del pedido.
- Reglas de negocio:
  1. Mínimo 1 producto con cantidad mayor que 0.
  2. Si la entrega es a domicilio, la dirección es obligatoria.
  3. El celular es obligatorio si el cliente autoriza WhatsApp.
  4. Mostrar primero los 20 productos más pedidos como botones de un solo toque.
- Flujo principal: 1) Toca "Nuevo pedido" 2) Escribe datos del cliente 3) Agrega productos 4) Elige entrega y autorización 5) Guarda y ve el número.
- RNF clave: abre en menos de 1 s; accesibilidad WCAG 2.1 AA (botones ≥ 48 px, texto ≥ 16 px, contraste 4,5:1); solo usuarios con sesión; funciona sin conexión.
- Criterios de aceptación:
  1. Dado un tendero, cuando registra un pedido de 5 productos, entonces lo guarda en menos de 60 s y ve su número.
  2. Dado un pedido sin productos, cuando toca "Guardar", entonces no se guarda y ve "Agrega un producto".
  3. Dado un celular sin señal, cuando guarda un pedido, entonces queda "Pendiente" y se sincroniza en menos de 30 s al volver la señal.

Requerimientos adicionales para el código:
- Código modular y comentado.
- Buenas prácticas de React y TypeScript.
- Pruebas unitarias básicas incluidas.
- Documentación mínima (README corto con instrucciones de ejecución).
- Todos los textos en español.
```

## Código generado (versión inicial)

| Archivo | Contenido |
|---|---|
| `src/components/pedido/FormularioPedido.tsx` | Interfaz del formulario |
| `src/lib/pedido.ts` | Validaciones (funciones puras), guardado y sincronización |
| `src/test/pedido.test.ts` | 6 pruebas con Vitest |
| `README.md` | Instrucciones de ejecución |

Validación (`src/lib/pedido.ts`, versión inicial):

```ts
/** Valida el pedido aplicando las reglas de negocio 1–3. */
export function validarPedido(d: DatosPedido): Errores {
  const e: Errores = {};
  if (!d.cliente.trim()) e.cliente = "Escribe el nombre del cliente";
  const cel = d.celular.trim();
  if (cel && !/^\d{10}$/.test(cel)) e.celular = "El celular debe tener 10 dígitos";
  else if (d.whatsapp && !cel) e.celular = "Escribe el celular para avisar por WhatsApp";
  if (!d.items.some((i) => i.nombre.trim() && i.cantidad > 0)) e.items = "Agrega un producto";
  if (d.entrega === "domicilio" && !d.direccion.trim()) e.direccion = "Escribe la dirección del domicilio";
  return e;
}
```

Modo sin conexión (versión inicial, dentro de `FormularioPedido.tsx`):

```ts
/** Escucha la conexión y sincroniza pendientes al volver la señal. */
function useConexion() {
  const [enLinea, setEnLinea] = useState(true);
  useEffect(() => {
    setEnLinea(navigator.onLine);
    sincronizarPendientes(localStorage);
    const on = () => { setEnLinea(true); sincronizarPendientes(localStorage); };
    const off = () => setEnLinea(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    // ...
```

## Parte C – Validación del código inicial

Se probó la vista previa y se revisó el código:

| Aspecto | Resultado |
|---|---|
| Entradas y salidas | ✅ Todos los campos; muestra el número (#1) con estado "Recibido" |
| Reglas de negocio | ✅ Las 4 reglas funcionan en la vista previa |
| Validación del celular | ❌ Aceptó "1234567890", que no es un celular colombiano (debe empezar por 3) |
| RNF de sesión | ❌ El formulario no exige sesión |
| RNF de accesibilidad | ⚠️ Botones grandes y `aria-invalid`, pero sin `aria-live` ni foco en el primer error |
| Pruebas | ⚠️ 6 pruebas de lógica, ninguna de interfaz |
| Consistencia con el Lab 2 | ⚠️ El botón de confirmación decía "Listo", igual que el estado "Listo" del pedido |
| Estructura | ⚠️ Buena separación UI/lógica, pero `useConexion` estaba dentro del formulario |

## Prompt refinado

```text
Revisé el código y la vista previa. Corrige lo siguiente sin cambiar el diseño que ya funciona:

1. Celular: hoy acepta "1234567890". Valida que sea un celular colombiano: 10 dígitos que empiecen por 3 (regex ^3\d{9}$), con el mensaje "Escribe un celular de 10 dígitos que empiece por 3". Agrega una prueba para este caso.
2. Sesión (RNF): el formulario no exige sesión. Crea un hook useSesion simulado (usuario guardado localmente) y, si no hay sesión, muestra "Inicia sesión para registrar pedidos" en lugar del formulario. Agrega una prueba.
3. Pruebas de interfaz: las pruebas actuales solo cubren la lógica. Agrega pruebas con Testing Library que verifiquen en pantalla: (a) al guardar sin productos aparece "Agrega un producto"; (b) al guardar un pedido válido aparece el número del pedido.
4. Accesibilidad: anuncia los errores con aria-live="polite" y lleva el foco al primer campo con error al tocar "Guardar".
5. Confirmación: el botón "Listo" se confunde con el estado "Listo" del pedido. Cámbialo a "Registrar otro pedido".
6. Estructura: mueve el hook useConexion a src/hooks/useConexion.ts.

Actualiza el README con las pruebas nuevas.
```

## Código generado (versión refinada)

Archivos nuevos: `src/hooks/useSesion.ts`, `src/hooks/useConexion.ts`, `src/components/pedido/RequiereSesion.tsx`, `src/test/formulario-pedido.test.tsx`. Total: **12 pruebas aprobadas** (antes 6).

Prueba nueva (`src/test/pedido.test.ts`):

```ts
it("exige celular colombiano que empiece por 3", () => {
  expect(validarPedido({ ...base, celular: "1234567890" }).celular).toBe(
    "Escribe un celular de 10 dígitos que empiece por 3",
  );
  expect(validarPedido({ ...base, celular: "3101234567" }).celular).toBeUndefined();
});
```

## Parte D – Validación con criterios de aceptación

| Criterio | Versión inicial | Versión refinada |
|---|---|---|
| CA1: pedido de 5 productos en < 60 s con número | ✅ #1, Recibido | ✅ #2, consecutivo |
| CA2: sin productos muestra "Agrega un producto" | ✅ | ✅ + prueba de interfaz + foco al error |
| CA3: sin señal queda "Pendiente" y sincroniza | ✅ En código y prueba unitaria | ✅ (no se probó cortando la red en la vista previa) |
| Celular colombiano | ❌ Aceptó 1234567890 | ✅ Muestra el error y lleva el foco al campo |
| RNF sesión | ❌ | ✅ Simulada: "Inicia sesión para registrar pedidos" |
| RNF accesibilidad | ⚠️ Parcial | ✅ `aria-live` y foco al primer error |
| Pruebas | 6 de lógica | 12 (lógica + interfaz + sesión) |

**Pendiente para una siguiente iteración:** la sesión es simulada (entra sin pedir datos), no hay botón para cerrar sesión y los pedidos se guardan solo en el celular, sin servidor.

## Reflexión

**Qué funcionó:** llevar al prompt la especificación del Lab 2 (reglas numeradas y criterios Dado/Cuando/Entonces) hizo que Lovable implementara las 4 reglas y los 3 criterios desde el primer intento, con validaciones separadas y pruebas.

**Qué mejoré:** la IA cumplió lo que estaba escrito como comportamiento verificable, pero falló en lo que dejé abierto o implícito: "10 dígitos" no garantizaba un celular colombiano, "solo usuarios con sesión" lo omitió y "pruebas básicas" quedaron solo en la lógica. El prompt refinado funcionó porque señalaba cada falla con evidencia ("hoy acepta 1234567890") y el resultado esperado exacto.

**Qué aprendí:** no basta con que la IA diga que las pruebas pasan; hay que probar la aplicación y leer el código, porque la vista previa mostró fallas que las pruebas no cubrían. Guiar a la IA es iterar con criterios medibles, no solo pedir "hazlo mejor".
