# BrewFlow - Incremento 1

Esta versión implementa en código el alcance  desde UR 1.1 hasta UR 4.3 del Documento 0.

## 1. Requisitos implementados

- **UR 1.1:** login con correo institucional `@brewflow.cl`, contraseña, verificación contra PostgreSQL y estado `activo` antes de permitir acceso.
- **UR 1.2:** perfiles diferenciados: `admin`, `operador_inventario`, `encargado_rrhh`, `supervisor` y `colaborador`, con middleware de permisos por rol.
- **UR 2.1:** registro de unidades de medida personalizadas con identificador único y clasificación.
- **UR 2.2:** registro de proveedores con identificación, contacto y condiciones comerciales, evitando duplicidad por RUT.
- **UR 2.3:** gestión de ubicaciones físicas jerárquicas de bodega: zona, estante, nivel y posición.
- **UR 3.1:** registro de productos perecibles con código único, nombre, categoría, unidad de medida y estado activo/inactivo.
- **UR 3.2:** asociación producto-lote-proveedor mediante integridad referencial.
- **UR 3.3:** registro de lotes por producto, fecha de ingreso, vencimiento y cantidad disponible.
- **UR 4.1:** validación de fecha de vencimiento válida.
- **UR 4.2:** registro de ingreso de stock con producto, cantidad, lote, proveedor y fecha.
- **UR 4.3:** registro de salidas por venta, consumo interno, merma, descarte o ajuste.

## 2. Instalación

1. Restaurar primero `brewflow.sql` en PostgreSQL.
2. Revisar el archivo `.env`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=12345
DB_NAME=brewflow_db
JWT_SECRET=brewflow_dev_secret
PORT=8080
```

3. Instalar dependencias y ejecutar:

```bash
npm install
npm start
```

4. Abrir:

```text
http://localhost:8080/login.html
```

Usuario inicial de pruebas:

```
Correo: carlos@brewflow.cl
Contraseña: 1234
Rol: admin
```

## 3. Pantallas principales

- `login.html`: inicio de sesión.
- `dashboard.html`: resumen operativo.
- `usuarios.html`: usuarios y perfiles.
- `unidades.html`: unidades de medida personalizadas.
- `proveedores.html`: proveedores.
- `ubicaciones.html`: ubicaciones jerárquicas de bodega.
- `productos.html`: productos perecibles.
- `lotes.html`: registro y consulta de lotes.
- `ingresos.html`: ingreso de stock.
- `salidas.html`: salida de stock.
- `movimientos.html`: historial de ingresos y salidas.
- `salon.html`: visualización de mesas.

## 4. Orden sugerido para probar la demo

1. Iniciar sesión con `carlos@brewflow.cl / 1234`.
2. Registrar una unidad de medida, por ejemplo `barril`.
3. Registrar un proveedor nuevo.
4. Crear una ubicación de bodega.
5. Registrar un producto perecible activo.
6. Registrar un ingreso de stock indicando producto, cantidad, lote, proveedor y fecha.
7. Verificar que el producto aumenta su stock en el dashboard o en productos.
8. Registrar una salida de stock por venta, merma, descarte o consumo interno.
9. Revisar el historial de movimientos.
10. Crear un usuario con rol `operador_inventario`, cerrar sesión y probar que puede acceder a inventario pero no a gestión de usuarios.

## 5. Verificación directa en PostgreSQL

Algunas consultas útiles:

```sql
SELECT * FROM public.unidad_medida_personalizada ORDER BY unidad_medida_id DESC;
SELECT * FROM public.proveedor ORDER BY proveedor_id DESC;
SELECT * FROM public.ubicacion_bodega ORDER BY ubicacion_id DESC;
SELECT producto_codigo, producto_nombre, producto_stock_actual FROM public.producto ORDER BY producto_id DESC;
SELECT lote_codigo, producto_id, proveedor_id, lote_cantidad_disponible FROM public.lote ORDER BY lote_id DESC;
SELECT movimiento_tipo, movimiento_motivo, movimiento_cantidad, producto_id, lote_id FROM public.movimiento_stock ORDER BY movimiento_id DESC;
```
