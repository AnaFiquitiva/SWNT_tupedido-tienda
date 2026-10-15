# Laboratorio 2 – Especificaciones de la App

App: TuPedido Tienda (pedidos para tiendas de barrio)  
Objetivo (Lab 1): que tenderos de barrio gestionen pedidos en el celular y reduzcan ≥ 20 % el tiempo de entrega y los errores en 6 meses.  


## HISTORIAS DE USUARIO

HU-01: Como tendero, quiero registrar un pedido en el celular en menos de 1 minuto, para dejar el cuaderno.  
HU-02: Como empleado, quiero ver los pedidos por estado, para saber cuál atender primero.  
HU-03: Como empleado, quiero verificar cada producto antes de marcar listo, para no entregar incompletos.  
HU-04: Como cliente, quiero un WhatsApp cuando mi pedido esté listo, para no llamar ni esperar.  
HU-05: Como dueño, quiero ver el tiempo de entrega y el % de errores, para saber si mejoro.  
HU-06: Como dueño, quiero crear usuarios a mis empleados, para saber quién atendió cada pedido.  


## GLOSARIO

- Estados: Recibido → En preparación → Listo → Entregado. Cancelado solo antes de Listo.  
- Tiempo de entrega: minutos entre Recibido y Entregado.  
- Pedido con error: entregado "Con novedad" (faltante o equivocado).  
- Línea base: indicadores de las 2 semanas previas al lanzamiento.  


## 2.1 MAPA DE COMPONENTES V1

Módulos: M1 Acceso · M2 Pedidos · M3 Seguimiento · M4 Notificaciones · M5 Indicadores  

Componentes por módulo (tipo: función):  
- M1: C1 Ingreso (UI: pide celular y código) · C2 Autenticación (Servicio: valida y asigna rol) · C3 Usuarios (Datos: cuentas, roles, tiendas)  
- M2: C4 Formulario (UI: registra pedido) · C5 Pedidos (Servicio: valida y cambia estados) · C6 Pedidos e historial (Datos: ver modelo) · C7 Productos frecuentes (Datos: sugerencias)  
- M3: C8 Tablero (UI: pedidos por estado) · C9 Verificación (UI: chequeo al alistar)  
- M4: C10 Notificaciones (Servicio: revisa autorización, Ley 1581, y reintenta 3 veces a 1, 5 y 15 min) · C11 WhatsApp (Integración: envía mensaje)  
- M5: C12 Métricas (Servicio: calcula indicadores) · C13 Panel (UI: muestra avance)  

Dependencias:  
- C1 → C2 → C3 · C4 → C7 · C4 → C5 → C6  
- C8 → C5 · C9 → C5 (habilita "Listo")  
- C5 → C10 → C11 (Listo dispara WhatsApp)  
- C13 → C12 → C6  

Modelo de datos (C6): Pedido (id, tienda, número, cliente, celular, autoriza_wa, entrega, estado, novedad) · Detalle (producto, cantidad, verificado) · Historial (estado, usuario, hora).  

Notas: MVP esencial C1–C6 y C8–C12; simple C7 y C13. Futuro: inventario, pagos Nequi.  


## 2.2 ESPECIFICACIONES (7 COMPONENTES CRÍTICOS)



## C4 – FORMULARIO DE PEDIDO


Tipo: UI | HU: HU-01  

Propósito: registrar pedidos rápido.  
Entradas: cliente y celular, productos (nombre, cantidad, unidad; sugeridos por C7), entrega (recoger/domicilio + dirección), autorización WhatsApp.  
Salidas: pedido a C5 (se guarda en C6) como Recibido; número en pantalla.  
Reglas: mínimo 1 producto con cantidad > 0; domicilio exige dirección; celular obligatorio si autoriza WhatsApp; sugiere los 20 productos más pedidos.  
Flujo: 1) "Nuevo pedido" 2) Datos del cliente 3) Productos 4) Entrega y autorización 5) Guarda.  
RNF: Rendimiento: abre en < 1 s. Seguridad: exige sesión. Accesibilidad: botones ≥ 48 dp, texto ≥ 16 sp, contraste 4,5:1 (WCAG 2.1 AA). Disponibilidad: sin conexión.  
Criterios de aceptación:  
- Dado un tendero, cuando registra un pedido de 5 productos, entonces lo guarda en < 60 s (promedio de 5 tenderos).  
- Dado un pedido sin productos, cuando toca "Guardar", entonces no se guarda y ve "Agrega un producto".  
- Dado un celular sin señal, cuando guarda un pedido, entonces queda "Pendiente" y se sincroniza < 30 s al volver la señal.  


## C5 – SERVICIO DE PEDIDOS


Tipo: Servicio | HU: HU-01, HU-02, HU-03  

Propósito: validar, guardar, listar y cambiar estados.  
Entradas: pedidos de C4; consultas y cambios de estado de C8/C9.  
Salidas: pedido e historial en C6; lista por estado; evento "Pedido Listo" a C10.  
Reglas: solo transiciones del glosario; Listo exige verificación completa en C9; cada cambio guarda usuario y hora y no se edita; al Entregar se indica si hubo novedad; cada usuario ve solo su tienda.  
Flujo: 1) Valida sesión (C2) 2) Valida datos o transición 3) Guarda en C6 4) Si es Listo, avisa a C10 5) Responde.  
RNF: Rendimiento: 95 % < 2 s en 4G. Seguridad: HTTPS (TLS 1.2+), exige token. Accesibilidad: errores en español sencillo. Confiabilidad: sin guardados parciales.  
Criterios de aceptación:  
- Dado un pedido Recibido, cuando se pasa a Entregado, entonces se rechaza.  
- Dado un pedido sin verificar, cuando se pide pasar a Listo, entonces se rechaza.  
- Dado un cambio de estado, cuando se ve el historial, entonces muestra usuario y hora.  
- Dado un pedido Listo, cuando se entrega sin indicar novedad, entonces no se guarda.  
- Dado un pedido Listo, cuando se intenta cancelar, entonces se rechaza.  
- Dado un usuario de la tienda A, cuando lista pedidos, entonces no ve los de la tienda B.  


## C8 – TABLERO POR ESTADO


Tipo: UI | HU: HU-02  

Propósito: mostrar qué pedido atender primero.  
Entradas: pedidos por estado de C5 (leídos de C6).  
Salidas: tarjetas con número, cliente y minutos de espera.  
Reglas: columnas Recibido, En preparación y Listo; más antiguo primero; > 30 min de espera = "Atrasado"; Entregados y Cancelados se ocultan.  
Flujo: 1) Abre la app 2) Ve columnas 3) Toca un pedido 4) Cambia estado o abre C9 5) Se actualiza.  
RNF: Rendimiento: carga < 2 s, refresca cada 30 s. Seguridad: solo su tienda. Accesibilidad: estado con texto, no solo color.  
Criterios de aceptación:  
- Dados pedidos de las 9:00, 9:10 y 9:20, cuando se abre el tablero, entonces aparecen en ese orden.  
- Dado un pedido con 31 min en Recibido, cuando se ve el tablero, entonces dice "Atrasado".  
- Dado un pedido de otro celular, cuando pasan 30 s, entonces aparece.  


## C9 – VERIFICACIÓN DE ALISTAMIENTO


Tipo: UI | HU: HU-03  

Propósito: reducir errores con un chequeo al alistar.  
Entradas: pedido En preparación (C5); marca y novedad por producto (agotado o cantidad distinta).  
Salidas: verificación enviada a C5; solicitud de cambio a Listo.  
Reglas: "Marcar como listo" se habilita cuando cada producto está verificado o con novedad; con novedad muestra "Informa al cliente".  
Flujo: 1) Abre el pedido 2) Marca cada producto 3) Registra novedades 4) Marca listo 5) Vuelve al tablero.  
RNF: Rendimiento: cada marca < 300 ms. Seguridad: solo su tienda. Accesibilidad: casillas ≥ 48 dp, uso con una mano.  
Criterios de aceptación:  
- Dados 3 de 4 productos marcados, cuando se ve la pantalla, entonces el botón está inactivo y dice "Falta 1".  
- Dado todo verificado, cuando se toca "Marcar como listo", entonces pasa a Listo en < 2 s.  
- Dado un producto agotado, cuando se completa la verificación, entonces aparece "Informa al cliente".  


## C11 – WHATSAPP BUSINESS


Tipo: Integración | HU: HU-04  

Propósito: avisar al cliente cuando su pedido está listo.  
Entradas: evento "Pedido Listo" desde C10 (número, nombre y celular del cliente, tienda).  
Salidas: mensaje; resultado (enviado/fallido) en C6.  
Reglas: plantilla aprobada por Meta ("Hola {nombre}, tu pedido #{n} en {tienda} está listo"); 1 mensaje por pedido; guarda cada resultado para que C10 reintente.  
Flujo: 1) Recibe evento 2) Arma plantilla 3) Envía a la API 4) Guarda resultado.  
RNF: Rendimiento: envío confirmado < 10 s. Seguridad: credenciales solo en servidor. Accesibilidad: mensaje ≤ 160 caracteres.  
Criterios de aceptación:  
- Dado un pedido autorizado, cuando pasa a Listo, entonces WhatsApp confirma el envío en < 10 s.  
- Dado un evento de C10, cuando la API falla, entonces C11 guarda "fallido".  
- Dado un pedido con mensaje enviado, cuando llega el mismo evento, entonces no se envía otro.  


## C12 – MÉTRICAS


Tipo: Servicio | HU: HU-05  

Propósito: medir el objetivo frente a la línea base.  
Entradas: historial (C6), línea base, periodo (semana/mes).  
Salidas: tiempo promedio, % de errores y avance.  
Reglas: % errores = con novedad ÷ entregados × 100; cancelados no cuentan; con < 20 entregados: "Datos insuficientes"; meta cumplida si ambos bajan ≥ 20 %.  
Flujo: 1) Elige periodo 2) Consulta C6 3) Calcula 4) Compara 5) Muestra en C13.  
RNF: Rendimiento: < 3 s para 1 mes. Seguridad: solo rol dueño. Accesibilidad: texto ("Tiempo: 12 % mejor"), no solo color. Exactitud: igual a cálculo manual.  
Criterios de aceptación:  
- Dados pedidos entregados en 20, 30 y 40 min, cuando se calcula, entonces el promedio es 30 min.  
- Dados 50 entregados y 5 con novedad, cuando se calcula, entonces el % de errores es 10 %.  
- Dada una línea base de 40 min y 10 % y un periodo con 30 min y 8 %, cuando se consulta, entonces dice "Meta cumplida".  
- Dados 15 entregados, cuando se abre el panel, entonces muestra "Datos insuficientes".  


## C2 – AUTENTICACIÓN Y ROLES


Tipo: Servicio | HU: HU-06  

Propósito: ingreso sin contraseña y control de permisos.  
Entradas: celular y código SMS (6 dígitos); datos de empleados; rol en C3.  
Salidas: sesión (token, rol, tienda); empleado creado o desactivado en C3.  
Reglas: código de un uso que vence en 5 min; 3 fallos bloquean 15 min; solo el dueño gestiona empleados y ve indicadores; desactivar cierra la sesión.  
Flujo: 1) Escribe celular 2) Recibe SMS 3) Escribe código 4) Valida rol 5) Abre el tablero.  
RNF: Rendimiento: SMS < 30 s (95 %). Seguridad: tokens firmados, códigos cifrados. Accesibilidad: lectura automática del código SMS.  
Criterios de aceptación:  
- Dado un dueño, cuando crea un empleado, entonces este puede ingresar con su código SMS.  
- Dado un empleado, cuando ingresa, entonces ve el tablero pero no los indicadores.  
- Dados 3 códigos errados, cuando intenta de nuevo, entonces ve "Intenta en 15 minutos".  
- Dado un empleado desactivado, cuando abre la app, entonces no ingresa.  


## MATRIZ DE TRAZABILIDAD

HU-01 → C4, C5 | HU-02 → C8, C5 | HU-03 → C9, C5 | HU-04 → C11 (+C10) | HU-05 → C12 (+C13) | HU-06 → C2, C5  
Consistencia: toda HU tiene componente y criterios; C12 mide el objetivo del Lab 1.  
