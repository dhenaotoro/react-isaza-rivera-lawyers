# react-isaza-rivera-lawyers

Proyecto en React para solicitar asesoría legal en derecho de familia (asistente de captura de datos y envío de leads al backend).

## Contenido
- Descripción del proyecto
- Cómo empezar en desarrollo
- Build y ejecución en producción
- Uso con Docker / Podman Compose
- Ejecutar pruebas y cobertura

## Requisitos
- Node.js (18+ recomendado)
- npm
- Podman / Docker (opcional, para contenedores)

## Desarrollo local
1. Instala dependencias:

```bash
npm install
```

2. Ejecuta el servidor de desarrollo (Next.js):

```bash
npm run dev
```

La aplicación quedará disponible por defecto en `http://localhost:3000`.

## Build y ejecución (producción)
1. Crear build:

```bash
npm run build
```

2. Ejecutar la versión optimizada:

```bash
npm run start
```

## Uso con Podman Compose (recomendado si usas Podman)
El repositorio contiene `podman-compose.yml` para levantar la UI y otros servicios locales.

```bash
# Construir e iniciar (en primer plano)
podman-compose -f podman-compose.yml up --build

# Construir e iniciar en background
podman-compose -f podman-compose.yml up -d --build

# Ver logs del servicio UI
podman-compose -f podman-compose.yml logs -f ui

# Reiniciar un servicio
podman-compose -f podman-compose.yml restart ui

# Detener y eliminar contenedores
podman-compose -f podman-compose.yml down
```

Si usas Docker directamente (sin compose), puedes construir y ejecutar la imagen:

```bash
# Construir imagen (ejemplo)
docker build -t react-isaza-rivera-lawyers .

# Ejecutar contenedor enlazando puerto 3000
docker run -p 3000:3000 react-isaza-rivera-lawyers
```

## Variables de entorno
- `NEXT_PUBLIC_API_URL` o `NEXT_PUBLIC_API_BASE_URL`: URL del backend (por defecto `http://localhost:8081` en los endpoints de la API).

Configura estas variables antes de ejecutar en producción o en contenedores.

## Pruebas
El proyecto usa Vitest con React Testing Library.

Instalar dependencias (si no lo hiciste):

```bash
npm install
```

Ejecutar todas las pruebas:

```bash
npm run test
```

Modo interactivo (UI):

```bash
npm run test:ui
```

Generar reporte de cobertura:

```bash
npm run test:coverage
```

## Lint
```bash
npm run lint
```

## Notas y siguientes pasos
- Los endpoints del frontend reenvían leads a un backend Java (ver `app/api/v1/leads/route.ts`).
- Documentación de pruebas y despliegue adicional: ver `TESTING.md`, `VITEST_SETUP.md` y `TESTING_RESPONSIVE.md`.

Si quieres, puedo:
- Ejecutar la suite de pruebas localmente ahora
- Crear una rama Git y commitear los cambios
- Convertir mensajes adicionales del código al español

