# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js 16 (App Router), Tailwind CSS v4, Prisma + PostgreSQL, JWT auth (jose), WhatsApp checkout, NextAuth-style session

## Users

**Admin (owner):** Registra productos cuando compra en promoción, actualiza stock post-confirmación de pago, gestiona categorías.

**Buyer:** Navega el catálogo de bebidas, ve precios promo vs regulares, arma pedido, envía por WhatsApp.

## Product Purpose

drinkr es un marketplace de reventa de bebidas donde el admin ofrece productos a precios de promoción. El usuario encuentra marcas conocidas a mejor precio que en el supermercado, arma su pedido, y lo retira. El modelo: comprar en promo cuando aparece, revender con margen pequeño pero volumen alto.

## Positioning

"Ahorrá en tus bebidas favoritas." No sos la tienda, sos el que encontró la oferta. Marcas que la gente ya conoce, precios que no están en otro lado.

## Operating Context

- Admin va al supermercado, identifica promociones en bebidas
- Registra el producto en drinkr: nombre, categoría, presentación (botella/lata/six-pack), precio regular, precio promo, stock disponible, imagen
- Usuario abre la app, navega por categoría, ve el producto con precio promo y precio regular tachado
- Usuario arma pedido (indica qué quiere y cuánto), toca "Pedir por WhatsApp"
- Se abre WhatsApp con un mensaje pre-armado con el detalle del pedido
- Admin recibe, confirma pago por el medio que acordén (transferencia, etc.), actualiza stock
- Usuario retira en el punto acordado

Admin workflow:
- Crear/editar productos: nombre, categoría, presentación, precio regular, precio promo, stock, imagen
- Ver pedidos recibidos (por WhatsApp)
- Actualizar stock post-confirmación
- Gestionar categorías

## Capabilities and Constraints

- Catálogo multi-category: Cerveza, Gaseosa (y las que se agreguen)
- Productos con: nombre, categoría, presentación (botella/lata/six-pack/unidad), precio regular, precio promo, stock actual, imagen
- Visualización de ahorro: precio regular tachado + precio promo
- Estados de producto: disponible, sin stock
- Checkout por WhatsApp (mensaje pre-armado con pedido)
- Stock se actualiza manualmente post-confirmación de pago
- Admin panel completo: productos, categorías, pedidos (por WhatsApp link)
- Pickup only — sin delivery por ahora
- Sin pago online por ahora — todo por WhatsApp

## Brand Commitments

- Ahorro real en bebidas de marcas conocidas
- Transacciones simples, sin complicaciones
- Interfaz clara que muestra el ahorro de un vistazo

## Evidence on Hand

- No hay productos reales todavía (vacío)
- No hay imágenes de productos reales
- No hay logo ni identidad visual todavía

## Product Principles

1. **Ahorro visible** — El precio tachado y el ahorro son el centro de la experiencia
2. **Categorías extensibles** — La estructura soporta agregar categorías sin cambiar código
3. **Checkout mínimo** — WhatsApp como único canal de pedido, sin fricción de pago online
4. **Stock honesto** — El usuario sabe qué hay disponible; el admin actualiza post-confirmación
5. **Catálogo vivo** — Lo que no hay, no se muestra; rotativo según lo que consiga el admin

## Accessibility & Inclusion

WCAG AA como objetivo. No hay auditoría de accesibilidad hecha todavía.
