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

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  reactStrictMode: true,
  // For proper Open Graph sharing
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

2. Share link via Instagram DM/Stories and test:
   - Preview image loads correctly
   - Mobile viewport appears proper
   - Title/description are accurate
   - Link leads to correct page

### 5. **Automated Testing (Playwright/Cypress)**

Add a test for responsive design:

```bash
npm install --save-dev @playwright/test
```

Create `tests/responsive.spec.ts`:
```typescript
import { test, expect } from '@playwright/test';

const viewports = [
  { name: 'iPhone 12', width: 390, height: 844 },
  { name: 'iPad', width: 810, height: 1080 },
  { name: 'Desktop', width: 1920, height: 1080 },
];

for (const viewport of viewports) {
  test(`loads correctly on ${viewport.name}`, async ({ browser }) => {
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

## Backend Integration Notes

You can keep the backend service in `podman-compose.yml` for now:

**When Java backend is ready:**
1. Update the `backend` service build path to point to your Java project
2. Set proper environment variables (DATABASE_URL, etc.)
3. Services communicate via the `app-network` bridge network
4. Update `NEXT_PUBLIC_API_URL` environment variable if needed

**API Calls from Frontend:**
```typescript
// In your Next.js components
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';

fetch(`${API_URL}/api/leads`, {
  method: 'POST',
  body: JSON.stringify(formData),
})
```

The backend will be accessible via `http://backend:8081` from within the container network, but from your host machine use `http://localhost:8081`.

---

## Quick Commands Reference

```bash
# Build images
podman-compose build

# Start in background
podman-compose up -d

# View specific service logs
podman-compose logs ui
podman-compose logs backend

# Restart a service
podman-compose restart ui

# Stop and remove containers
podman-compose down

# Stop but keep data
podman-compose stop
```
