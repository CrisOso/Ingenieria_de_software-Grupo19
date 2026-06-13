-- ============================================================
-- Migración para alinear la base de datos con el código BrewFlow
-- Ejecutar UNA sola vez en pgAdmin sobre la base de datos brewflow_db
-- ============================================================

-- 1. Renombrar la columna de contraseña al nombre que usa el código
ALTER TABLE public.usuario
    RENAME COLUMN "usuario_contraseña" TO usuario_contrasena_hash;

-- 2. Agregar columna de intentos fallidos (necesaria para el bloqueo de cuenta - RF-02)
ALTER TABLE public.usuario
    ADD COLUMN IF NOT EXISTS usuario_intentos_fallidos INTEGER NOT NULL DEFAULT 0;

-- 3. Convertir el estado de USUARIO de ENUM a texto y usar el vocabulario del código
ALTER TABLE public.usuario
    ALTER COLUMN usuario_estado_cuenta DROP DEFAULT;
ALTER TABLE public.usuario
    ALTER COLUMN usuario_estado_cuenta TYPE VARCHAR(20)
    USING usuario_estado_cuenta::text;
UPDATE public.usuario SET usuario_estado_cuenta = 'ACTIVO'    WHERE usuario_estado_cuenta = 'activo';
UPDATE public.usuario SET usuario_estado_cuenta = 'BLOQUEADO' WHERE usuario_estado_cuenta = 'inactivo';
ALTER TABLE public.usuario
    ALTER COLUMN usuario_estado_cuenta SET DEFAULT 'ACTIVO';

-- 4. Convertir el estado de MESA de ENUM a texto y usar el vocabulario del código
ALTER TABLE public.mesa
    ALTER COLUMN mesa_estado DROP DEFAULT;
ALTER TABLE public.mesa
    ALTER COLUMN mesa_estado TYPE VARCHAR(20)
    USING mesa_estado::text;
UPDATE public.mesa SET mesa_estado = 'LIBRE'      WHERE mesa_estado = 'disponible';
UPDATE public.mesa SET mesa_estado = 'OCUPADA'    WHERE mesa_estado = 'ocupada';
UPDATE public.mesa SET mesa_estado = 'POR_PAGAR'  WHERE mesa_estado = 'reservada';
UPDATE public.mesa SET mesa_estado = 'MANTENCION' WHERE mesa_estado = 'inactiva';
ALTER TABLE public.mesa
    ALTER COLUMN mesa_estado SET DEFAULT 'LIBRE';

-- ============================================================
-- NOTA: los 3 usuarios de prueba tienen la contraseña en texto plano ('1234'),
-- pero el login usa bcrypt. Esos usuarios NO podrán iniciar sesión hasta que
-- crees usuarios nuevos por la app (que sí cifra), o reemplaces el hash a mano.
-- ============================================================
