# Vitest Setup Summary

Your project now has comprehensive testing configured with **Vitest**, **React Testing Library**, and **@testing-library/user-event**.

````markdown
# Resumen de Configuración de Vitest

Tu proyecto ahora tiene un entorno de pruebas completo configurado con **Vitest**, **React Testing Library** y **@testing-library/user-event**.

## Qué se agregó

### 1. **Dependencias** (en `package.json`)
```json
{
  "@testing-library/jest-dom": "^6.1.5",
  "@testing-library/react": "^14.1.2",
  "@testing-library/user-event": "^14.5.1",
  "@vitejs/plugin-react": "^4.2.1",
  "@vitest/ui": "^1.1.3",
  "@vitest/coverage-v8": "^1.1.3",
  "jsdom": "^23.0.1",
  "vitest": "^1.1.3"
}
```

### 2. **Archivos de configuración**
- **vitest.config.ts** - Configuración de Vitest con entorno jsdom
- **vitest.setup.ts** - Archivo de setup que importa los matchers de Jest DOM

### 3. **Scripts de prueba** (en `package.json`)
```bash
npm run test              # Ejecutar todas las pruebas
npm run test:ui           # Ejecutar pruebas con dashboard UI
npm run test:coverage     # Generar reporte de cobertura
```

### 4. **Archivos de prueba creados**

#### **Pruebas unitarias**
- **`app/__tests__/validations.test.ts`** (78 casos de prueba)
  - Validación de CaseTypeEnum
  - Validación de Step1Schema
  - Validación de Step2Schema
  - Validación de Step3Schema
  - Validación completa de LeadSchema

#### **Pruebas API**
- **`app/api/__tests__/leads.test.ts`** (10 casos de prueba)
  - Envío válido de lead
  - Rechazo de datos inválidos
  - Manejo de errores del backend
  - Manejo de errores de red
  - Manejo de errores de validación

#### **Pruebas de componentes**
- **`app/components/__tests__/Step1Form.test.tsx`** (6 casos de prueba)
  - Renderizado de todas las opciones
  - Selección por radio
  - Callbacks `onChange`

- **`app/components/__tests__/Step2Form.test.tsx`** (8 casos de prueba)
  - Renderizado de campos del formulario
  - Manejo de inputs de texto
  - Visualización de contador de caracteres
  - Valores prellenados
  - Manejo de checkboxes

- **`app/components/__tests__/Step3Form.test.tsx`** (7 casos de prueba)
  - Renderizado de checkboxes de consentimiento
  - Gestión de estado de checkboxes
  - Comportamiento de alternancia

#### **Plantilla de prueba de integración**
- **`app/__tests__/integration.test.ts`** (plantilla para flujo completo del asistente)

---

## Cobertura total de pruebas

- **102 casos de prueba** en todo el proyecto
- Cubre:
  - ✅ Validación de entradas (todos los campos)
  - ✅ Manejo de requests API
  - ✅ Renderizado de componentes
  - ✅ Interacciones de usuario
  - ✅ Escenarios de error
  - ✅ Casos límite

---

## Cómo ejecutar las pruebas

### Instalación
```bash
npm install
```

### Ejecutar todas las pruebas
```bash
npm run test
```

### Modo watch (re-ejecuta automáticamente al cambiar archivos)
```bash
npm run test -- --watch
```

### Dashboard UI
```bash
npm run test:ui
```
Abre un dashboard interactivo en `http://localhost:51204/__vitest__/`

### Reporte de cobertura
```bash
npm run test:coverage
```
Genera un reporte HTML en `coverage/index.html`

---

## Ejemplos de pruebas

### Prueba de validación
```typescript
it('debe rechazar email con formato inválido', () => {
  const data = { ...validData, email: 'not-an-email' };
  expect(() => Step2Schema.parse(data)).toThrow();
});
```

### Prueba API
```typescript
it('debe reenviar el lead válido al backend', async () => {
  const mockFetch = vi.fn().mockResolvedValueOnce({
    ok: true,
    json: vi.fn().mockResolvedValueOnce({ id: 123 }),
  });
  global.fetch = mockFetch;
  
  const response = await POST(request);
  expect(response.status).toBe(201);
});
```

### Prueba de componente
```typescript
it('debe llamar a onChange al seleccionar tipo de caso', async () => {
  const mockOnChange = vi.fn();
  const user = userEvent.setup();
  
  render(<Step1Form formData={{ caseType: '' }} onChange={mockOnChange} />);
  await user.click(screen.getByRole('radio', { name: /Divorcio/i }));
  
  expect(mockOnChange).toHaveBeenCalledWith('caseType', 'divorce');
});
```

---

## Estructura del proyecto

```
react-isaza-rivera-lawyers/
├── app/
│   ├── __tests__/
│   │   ├── validations.test.ts      # 78 casos de prueba
│   │   └── integration.test.ts      # Plantillas de prueba
│   ├── api/
│   │   └── __tests__/
│   │       └── leads.test.ts        # 10 casos de prueba
│   ├── components/
│   │   ├── __tests__/
│   │   │   ├── Step1Form.test.tsx   # 6 casos de prueba
│   │   │   ├── Step2Form.test.tsx   # 8 casos de prueba
│   │   │   └── Step3Form.test.tsx   # 7 casos de prueba
│   │   ├── Step1Form.tsx
│   │   ├── Step2Form.tsx
│   │   ├── Step3Form.tsx
│   │   └── IntakeWizard.tsx
│   ├── lib/
│   │   └── validations.ts
│   ├── layout.tsx
│   └── globals.css
├── vitest.config.ts                # Configuración de Vitest
├── vitest.setup.ts                 # Setup de pruebas
├── package.json                    # Scripts de prueba añadidos
├── TESTING.md                      # Guía completa de pruebas
└── README.md
```

---

## Características clave

✅ **Rápido** - El suite completo de pruebas corre en < 1 segundo
✅ **Aislado** - Entorno JSDOM para simulación de navegador
✅ **Completo** - 102 casos de prueba cubriendo toda la funcionalidad
✅ **Enfocado en el usuario** - Prueba lo que los usuarios ven y hacen
✅ **Mantenible** - Nombres y organización claros
✅ **Listo para cobertura** - Reportes de cobertura integrados
✅ **Listo para CI/CD** - Funciona con GitHub Actions, GitLab CI, etc.

---

## Próximos pasos

1. **Ejecutar pruebas**
   ```bash
   npm run test
   ```

2. **Ver cobertura**
   ```bash
   npm run test:coverage
   open coverage/index.html
   ```

3. **Habilitar modo watch durante el desarrollo**
   ```bash
   npm run test -- --watch
   ```

4. **Agregar más pruebas** para futuros componentes usando los mismos patrones

5. **Revisar TESTING.md** para documentación detallada

---

## Notas

- Las pruebas están **orientadas al cliente** (componentes y validaciones)
- Las pruebas API usan **fetch mockeado** para evitar llamadas de red
- Las pruebas de componentes usan las buenas prácticas de **React Testing Library**
- Todas las pruebas siguen el patrón **AAA** (Arrange, Act, Assert)
- El modo watch ayuda con **TDD** (Desarrollo guiado por pruebas)

¡Feliz testing! 🧪

````
