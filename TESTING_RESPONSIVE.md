# Testing Guide for Responsive Design

## Running with Podman Compose

```bash
# Build and start the services
podman-compose -f podman-compose.yml up --build

# View logs
podman-compose -f podman-compose.yml logs -f ui

# Stop services
podman-compose -f podman-compose.yml down
```

The app will be available at `http://localhost:3000`

---

## Testing Different Device Sizes & Mobile

### 1. **Browser DevTools (Recommended for Quick Testing)**

**Desktop Testing:**
- Open DevTools (F12 or Cmd+Option+I)
- Click device toggle or Ctrl+Shift+M (Cmd+Shift+M on Mac)
- Select different device presets:
  - iPhone 12/13/14 (390x844)
  - iPad (810x1080)
  - Desktop (1920x1080, 1366x768, etc.)
- Test landscape/portrait orientations

**Common Breakpoints to Test:**
- Mobile: 320px, 375px, 390px, 412px
- Tablet: 768px, 810px
- Desktop: 1024px, 1366px, 1920px

### 2. **Physical Device Testing**

**Option A: Local Network**
```bash
# Get your machine's IP
# On Mac: ifconfig | grep "inet "

# Access from mobile on same network
http://<YOUR_IP>:3000
```

**Option B: ngrok (Expose to Internet)**
```bash
# Install ngrok from https://ngrok.com
ngrok http 3000

# Share the public URL with anyone
# Useful for Instagram sharing
```

### 3. **Mobile Simulators**

**Option A: Chrome Remote Debugging**
1. Connect Android device via USB
2. Enable USB Debugging
3. In Chrome, go to `chrome://inspect`
4. View and debug real device

**Option B: iOS Safari Debugging (Mac only)**
1. Connect iPhone via USB
2. In iPhone: Settings → Safari → Advanced → Web Inspector
3. In Mac Safari: Develop menu shows connected device

### 4. **Instagram Integration Testing**

**Test Instagram Links:**
1. Update Next.js config for Instagram web crawler:
````markdown
# Guía de Pruebas para Diseño Responsivo

## Ejecutar con Podman Compose

```bash
# Construir e iniciar los servicios
podman-compose -f podman-compose.yml up --build

# Ver logs
podman-compose -f podman-compose.yml logs -f ui

# Detener servicios
podman-compose -f podman-compose.yml down
```

La aplicación estará disponible en `http://localhost:3000`

---

## Probar distintos tamaños de dispositivo y móviles

### 1. **DevTools del navegador (recomendado para pruebas rápidas)**

**Pruebas en escritorio:**
- Abrir DevTools (F12 o Cmd+Option+I)
- Activar el modo dispositivo o usar Ctrl+Shift+M (Cmd+Shift+M en Mac)
- Seleccionar distintos presets de dispositivo:
  - iPhone 12/13/14 (390x844)
  - iPad (810x1080)
  - Escritorio (1920x1080, 1366x768, etc.)
- Probar orientaciones landscape/portrait

**Puntos de corte comunes a probar:**
- Móvil: 320px, 375px, 390px, 412px
- Tablet: 768px, 810px
- Escritorio: 1024px, 1366px, 1920px

### 2. **Pruebas en dispositivos físicos**

**Opción A: Red local**
```bash
# Obtener la IP de tu máquina
# En Mac: ifconfig | grep "inet "

# Acceder desde el móvil en la misma red
http://<TU_IP>:3000
```

**Opción B: ngrok (exponer a Internet)**
```bash
# Instalar ngrok desde https://ngrok.com
ngrok http 3000

# Compartir la URL pública con quien necesites
# Útil para compartir en Instagram
```

### 3. **Simuladores móviles**

**Opción A: Depuración remota de Chrome**
1. Conectar dispositivo Android por USB
2. Habilitar USB Debugging
3. En Chrome, ir a `chrome://inspect`
4. Ver y depurar el dispositivo real

**Opción B: Depuración en Safari para iOS (solo Mac)**
1. Conectar iPhone por USB
2. En el iPhone: Ajustes → Safari → Avanzado → Web Inspector
3. En Safari de Mac: el menú Develop mostrará el dispositivo conectado

### 4. **Pruebas de integración para Instagram**

**Probar enlaces de Instagram:**
1. Actualizar la configuración de Next.js para el crawler de Instagram:

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Para compartir Open Graph correctamente
  headers: async () => {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
        ],
      },
    ];
  },
};
```

2. Compartir el enlace por DM/Stories en Instagram y verificar:
   - La imagen de vista previa carga correctamente
   - El viewport móvil se ve adecuado
   - Título/ descripción son correctos
   - El enlace dirige a la página correcta

### 5. **Pruebas automatizadas (Playwright/Cypress)**

Agregar una prueba para diseño responsivo:

```bash
npm install --save-dev @playwright/test
```

Crear `tests/responsive.spec.ts`:
```typescript
import { test, expect } from '@playwright/test';

const viewports = [
  { name: 'iPhone 12', width: 390, height: 844 },
  { name: 'iPad', width: 810, height: 1080 },
  { name: 'Desktop', width: 1920, height: 1080 },
];

for (const viewport of viewports) {
  test(`carga correctamente en ${viewport.name}`, async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
    });
    const page = await context.newPage();
    await page.goto('http://localhost:3000');
    await expect(page).toHaveTitle(/.*Isaza Rivera.*/);
    await context.close();
  });
}
```

---

## Notas de integración del backend

Puedes mantener el servicio backend en `podman-compose.yml` por ahora:

**Cuando el backend Java esté listo:**
1. Actualiza la ruta de build del servicio `backend` para apuntar a tu proyecto Java
2. Configura las variables de entorno necesarias (DATABASE_URL, etc.)
3. Los servicios se comunican a través de la red bridge `app-network`
4. Actualiza la variable `NEXT_PUBLIC_API_URL` si es necesario

**Llamadas API desde el frontend:**
```typescript
// En tus componentes Next.js
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';

fetch(`${API_URL}/api/leads`, {
  method: 'POST',
  body: JSON.stringify(formData),
})
```

El backend será accesible vía `http://backend:8081` desde dentro de la red de contenedores, pero desde tu máquina host usa `http://localhost:8081`.

---

## Referencia rápida de comandos

```bash
# Construir imágenes
podman-compose build

# Iniciar en segundo plano
podman-compose up -d

# Ver logs de un servicio específico
podman-compose logs ui
podman-compose logs backend

# Reiniciar un servicio
podman-compose restart ui

# Detener y eliminar contenedores
podman-compose down

# Detener pero conservar datos
podman-compose stop
```

````
