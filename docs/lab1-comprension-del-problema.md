# Laboratorio 1 – Diseñando y validando prompts para la comprensión del problema

Tema: Gestión de pedidos en pequeños comercios minoristas de Colombia  


## ETAPA 1 – INVESTIGACIÓN PROFUNDA DEL PROBLEMA


1. Prompt inicial  
Actúa como analista de procesos y mercado. Quiero investigar el problema de las demoras y la baja eficiencia en la gestión de pedidos en pequeños comercios minoristas de Colombia.  
Por favor responde:  
- ¿Qué datos o evidencias existen sobre este problema?  
- ¿A quiénes afecta principalmente?  
- ¿Cuáles son las principales causas de las demoras?  
- ¿Qué consecuencias genera para los clientes y los comercios?  
- ¿Qué soluciones o tecnologías existen actualmente?  
- ¿Por qué estas soluciones pueden no ser suficientes para los pequeños comercios?  
Presenta la información de manera clara y organizada para poder identificar posteriormente una oportunidad para desarrollar una aplicación.  

Respuesta de la IA  
El problema de las demoras en la gestión de pedidos puede estar relacionado con procesos manuales, falta de organización del inventario, comunicación ineficiente entre empleados y clientes y ausencia de herramientas digitales integradas.  
Los principales afectados son los clientes, que pueden experimentar tiempos de espera mayores, y los dueños y empleados de pequeños comercios, que deben dedicar tiempo a registrar, organizar y verificar pedidos.  
Entre las consecuencias están los errores en los pedidos, pérdida de tiempo, insatisfacción del cliente, dificultades para controlar el inventario y posibles pérdidas económicas. Actualmente existen sistemas de punto de venta, aplicaciones de pedidos y herramientas de gestión de inventario, pero algunas pueden resultar costosas, complejas o poco adaptadas a las necesidades de pequeños comercios.  

1.1 Validación de la respuesta inicial  
La respuesta es clara, pero demasiado general: no presenta datos ni fuentes, ignora el contexto colombiano que pedía el prompt y sus conclusiones servirían para cualquier país o negocio.  
Ajustes: especificar el segmento (tiendas de barrio), limitar el periodo de los datos, pedir una tabla, exigir que distinga datos comprobados de interpretaciones y agregar oportunidades para la app.  

2. Prompt refinado  
Actúa como analista especializado en transformación digital y agilidad empresarial en Colombia.  
Estoy investigando las demoras y errores en la gestión de pedidos de pequeños comercios minoristas, especialmente tiendas y supermercados de barrio.  
Responde de forma resumida en una tabla (máximo 2 líneas por categoría), usando información de los últimos 5 años:  
1. Evidencias o datos que demuestren la existencia del problema.  
2. Principales usuarios afectados.  
3. Causas del problema.  
4. Impactos en tiempo, costos, productividad y satisfacción del cliente.  
5. Soluciones tecnológicas que ya existen.  
6. Limitaciones de esas soluciones para pequeños comercios.  
7. Oportunidades que podría aprovechar una aplicación móvil o web.  
Prioriza información de Colombia y, cuando no existan datos específicos, indícalo claramente. No inventes cifras y diferencia entre datos comprobados y posibles interpretaciones.  

Respuesta de la IA  

| Aspecto | Resultado |
|---|---|
| Problema | Los procesos manuales y poco integrados pueden generar demoras, errores y dificultades para controlar los pedidos. |
| Usuarios afectados | Clientes, empleados, administradores y propietarios de pequeños comercios. |
| Causas | Registro manual, comunicación por diferentes canales, falta de integración entre pedidos e inventario y poca automatización. |
| Impacto | Mayor tiempo de atención, errores en pedidos, pérdida de productividad y posibles problemas de satisfacción del cliente. |
| Soluciones existentes | Sistemas POS, aplicaciones de pedidos, plataformas de inventario y herramientas de gestión empresarial. |
| Limitaciones | Costos, complejidad, necesidad de capacitación y funcionalidades que pueden exceder las necesidades de un pequeño comercio. |
| Oportunidad | Crear una herramienta sencilla que centralice pedidos, facilite su seguimiento y permita visualizar el estado de cada pedido. |


2.1 Validación de la respuesta refinada  
El formato mejoró: es más breve, organizada y propone una oportunidad concreta. Sin embargo, la IA no cumplió tres instrucciones: reemplazó "Evidencias" por "Problema" y no dio datos, no indicó que faltan datos específicos y no separó datos comprobados de interpretaciones. Estructura el problema, pero no demuestra que exista; por eso hice una tercera iteración.  

2.2 Tercera iteración del prompt  
Tu respuesta anterior no incluyó evidencias. Para la categoría 1, menciona solo fuentes verificables sobre tiendas de barrio o micronegocios en Colombia (entidad, año y dato). Si no conoces una fuente confiable, escribe "Sin dato verificable" en lugar de suponer.  

Respuesta de la IA  
Evidencias verificables:  
- Fenalco (2024): en Colombia operan cerca de 450.000 tiendas de barrio, que emplean a 1,1 millones de personas; más del 90 % de los hogares compra en ellas al menos dos veces al mes.  
- DANE, EMICRON (2024): el 89,1 % de los micronegocios no usó computador, tableta ni portátil; el 70,9 % sí usó teléfono celular.  
- Fenaltiendas (2026): el 49,55 % de los tenderos no usa WhatsApp ni redes sociales como canal comercial.  
- Tiempos de demora o errores en pedidos de tiendas de barrio: Sin dato verificable.  
Interpretación (no comprobada): la baja digitalización sugiere que los pedidos se gestionan de forma manual, lo que podría causar demoras y errores; su magnitud debe medirse directamente en los comercios.  

2.3 Validación de la tercera respuesta  
Esta vez la IA cumplió: citó entidad, año y dato, y reconoció que no hay cifras sobre demoras. Revisé las fuentes (Fenalco, DANE y Fenaltiendas) y confirmé los datos. Conclusión: el sector es grande, poco digitalizado y trabaja con el celular, pero la magnitud de las demoras debe medirse en campo.  


## ETAPA 2 – DEFINICIÓN CLARA DEL OBJETIVO DE LA APP


3. Prompt para definir el objetivo  
Con base en la investigación anterior, ayúdame a definir el objetivo principal de una aplicación para pequeños comercios minoristas de Colombia.  
La aplicación busca reducir las demoras y errores en la gestión de pedidos mediante una herramienta sencilla que permita registrar, organizar y consultar el estado de los pedidos.  
El objetivo debe: estar escrito en una sola frase, ser claro para cualquier usuario, estar centrado en los pequeños comercios y sus clientes, ser medible, indicar qué problema busca solucionar y evitar términos demasiado técnicos.  

Objetivo generado  
Desarrollar una aplicación que permita a pequeños comercios minoristas de Colombia gestionar y hacer seguimiento a sus pedidos, reduciendo los errores y tiempos de atención para mejorar la eficiencia del proceso y la experiencia del cliente.  

4. Validación del objetivo  

| Criterio | ¿Cumple? | Análisis |
|---|---|---|
| Claridad | Sí | Se entiende qué hará la aplicación. |
| Relevancia | Sí | Responde al problema investigado. |
| Medibilidad | No | No establece cuánto se reducirá ni en qué plazo. |
| Enfoque en usuario | Parcialmente | Empieza con "Desarrollar una aplicación": se centra en el equipo y no en lo que logra el usuario. |


4.1 Prompt de mejora  
Mejora este objetivo para que sea más claro y medible: [objetivo generado]. Mantén el enfoque en tenderos y clientes de Colombia, incluye una meta numérica y un plazo. Dame 3 versiones alternativas.  

Respuesta de la IA  
A. Ayudar a los tenderos de Colombia a organizar sus pedidos desde el celular para atender más rápido a sus clientes, reduciendo el tiempo de entrega en un 20 % en seis meses.  
B. Permitir que las tiendas de barrio registren y consulten sus pedidos de forma digital para disminuir en un 20 % los pedidos con errores durante el primer semestre de uso.  
C. Permitir que los tenderos y empleados de tiendas de barrio en Colombia registren y consulten el estado de sus pedidos desde el celular, para reducir en al menos un 20 % tanto el tiempo promedio de entrega al cliente como el número de pedidos con errores durante los primeros seis meses de uso.  

Elegí la C porque reúne al usuario (tenderos), al beneficiario (cliente), el contexto (Colombia), dos indicadores y un plazo. A solo mide tiempo y B solo errores. El uso del celular se justifica porque la mayoría de los micronegocios lo usa y casi ninguno usa computador.  

5. Objetivo final de la App  
Permitir que los tenderos y empleados de tiendas de barrio en Colombia registren y consulten el estado de sus pedidos desde el celular, para reducir en al menos un 20 % tanto el tiempo promedio de entrega al cliente como el número de pedidos con errores durante los primeros seis meses de uso.  

Validación final: es claro (lenguaje sencillo), relevante (ataca demoras y errores), medible (2 indicadores, meta del 20 % y plazo de 6 meses) y centrado en el usuario (tenderos, empleados y clientes).  
Nota: el 20 % es una meta propuesta, no un dato de la investigación. Como no hay cifras públicas de demoras, antes del lanzamiento se medirán durante dos semanas el tiempo promedio por pedido y los pedidos con errores, para establecer una línea base.  

6. Reflexión final  
Aprendí que un prompt con contexto específico (usuario, lugar, periodo, formato y restricciones) produce respuestas más útiles. Sin embargo, la IA no siempre cumple lo que se le pide: solicité evidencias y no las entregó, así que tuve que detectarlo y verificar las fuentes. Iterar es evaluar críticamente cada respuesta, no solo reescribir el prompt. La IA ayuda a estructurar, pero validar los datos es mi responsabilidad.  
