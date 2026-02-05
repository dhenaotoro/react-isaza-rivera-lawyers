# Testing Guide

This project uses **Vitest** for unit and component testing with **React Testing Library** for component tests.

## Setup

Tests are already configured. To install dependencies, run:

```bash
npm install
```

## Running Tests

### Run all tests
```bash
npm run test
```

### Run tests in watch mode
```bash
npm run test -- --watch
```

### Run tests with UI dashboard
```bash
npm run test:ui
```

### Generate coverage report
```bash
npm run test:coverage
```

Coverage reports will be generated in `coverage/` directory.

---

## Test Structure

```
app/
├── __tests__/
│   └── validations.test.ts         # Zod schema validation tests
├── api/
│   └── __tests__/
│       └── leads.test.ts            # API endpoint tests
└── components/
    └── __tests__/
        ├── Step1Form.test.tsx       # Case type selection form
        ├── Step2Form.test.tsx       # Basic info form
        └── Step3Form.test.tsx       # Consent & disclaimer form
```

---

## Test Coverage

````markdown
# Guía de Pruebas

Este proyecto usa **Vitest** para pruebas unitarias y de componentes con **React Testing Library** para las pruebas de componentes.

## Configuración

Las pruebas ya están configuradas. Para instalar dependencias, ejecuta:

```bash
npm install
```

## Ejecutar Pruebas

### Ejecutar todas las pruebas
```bash
npm run test
```

### Ejecutar pruebas en modo observación
```bash
npm run test -- --watch
```

### Ejecutar pruebas con interfaz UI
```bash
npm run test:ui
```

### Generar reporte de cobertura
```bash
npm run test:coverage
```

Los reportes de cobertura se generarán en el directorio `coverage/`.

---

## Estructura de Pruebas

```
app/
├── __tests__/
│   └── validations.test.ts         # Pruebas de validación de esquemas Zod
├── api/
│   └── __tests__/
│       └── leads.test.ts            # Pruebas de endpoints API
└── components/
    └── __tests__/
        ├── Step1Form.test.tsx       # Formulario de selección de tipo de caso
        ├── Step2Form.test.tsx       # Formulario de información básica
        └── Step3Form.test.tsx       # Formulario de consentimiento y aviso legal
```

---

## Cobertura de Pruebas

### 1. **Pruebas de Validación** (`app/__tests__/validations.test.ts`)
Pruebas para los esquemas Zod que garantizan la integridad de los datos:

- **CaseTypeEnum** - Tipos de caso válidos/no válidos
- **Step1Schema** - Validación de selección de tipo de caso
- **Step2Schema** - Validación de información de contacto (nombre, ciudad, WhatsApp, email, descripción)
- **Step3Schema** - Validación de consentimiento
- **LeadSchema** - Validación completa de envío de lead

**Validaciones clave:**
- Formato de WhatsApp (formato internacional)
- Formato de email
- Longitud de la descripción (máx. 400 caracteres)
- Consentimientos requeridos para procesamiento de datos y aviso legal

---

### 2. **Pruebas de Endpoints API** (`app/api/__tests__/leads.test.ts`)
Pruebas para el endpoint POST `/api/v1/leads`:

- Envío válido de lead con reenvío al backend
- Rechazo de datos inválidos
- Rechazo por falta de consentimiento
- Validación de formato de email
- Validación de formato de WhatsApp
- Validación de longitud de descripción
- Manejo de errores del backend
- Manejo de errores de red
- Campo de email vacío (permitido)

---

### 3. **Pruebas de Componentes**

#### **Pruebas de Step1Form** (`app/components/__tests__/Step1Form.test.tsx`)
- Renderiza todas las opciones de tipos de caso
- Maneja selección por radio
- Muestra el tipo de caso seleccionado correctamente
- Llama al callback `onChange` con los valores correctos

#### **Pruebas de Step2Form** (`app/components/__tests__/Step2Form.test.tsx`)
- Renderiza todos los campos del formulario
- Maneja cambios en inputs de texto
- Muestra contador de caracteres para la descripción (0/400)
- Maneja el checkbox de menores
- Muestra valores prellenados
- Actualiza el contador de caracteres dinámicamente

#### **Pruebas de Step3Form** (`app/components/__tests__/Step3Form.test.tsx`)
- Renderiza todos los checkboxes de consentimiento
- Maneja cambios de estado en los checkboxes
- Muestra el estado `checked` correcto
- Permite alternar los checkboxes

---

## Ejemplo de Prueba

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Step1Form from '@/app/components/Step1Form';

describe('Componente Step1Form', () => {
  it('debe renderizar todas las opciones de tipo de caso', () => {
    render(
      <Step1Form
        formData={{ caseType: '' }}
        onChange={vi.fn()}
      />
    );
    
    expect(screen.getByText('Cuota alimentaria')).toBeInTheDocument();
    expect(screen.getByText('Divorcio')).toBeInTheDocument();
  });

  it('debe llamar a onChange al seleccionar un tipo de caso', async () => {
    const mockOnChange = vi.fn();
    const user = userEvent.setup();
    
    render(
      <Step1Form
        formData={{ caseType: '' }}
        onChange={mockOnChange}
      />
    );

    await user.click(screen.getByRole('radio', { name: /Divorcio/i }));
    expect(mockOnChange).toHaveBeenCalledWith('caseType', 'divorce');
  });
});
```

---

## Utilidades de Prueba

### Vitest
- `describe()` - Agrupar pruebas relacionadas
- `it()` - Definir una prueba individual
- `expect()` - Afirmar resultados esperados
- `vi.fn()` - Crear funciones mock
- `beforeEach()`, `afterEach()` - Hooks de ciclo de vida de pruebas

### React Testing Library
- `render()` - Renderizar un componente
- `screen` - Consultar elementos en el DOM
- `userEvent.setup()` - Simular interacciones de usuario
- `toBeInTheDocument()` - Afirmar que el elemento existe
- `toBeChecked()` - Afirmar que un checkbox está marcado

---

## Archivos de Configuración

### `vitest.config.ts`
```typescript
// - globals: true          // Usar funciones globales de test
// - environment: jsdom     // Simular entorno de navegador
// - setupFiles             // Ejecutar setup antes de las pruebas
// - coverage               // Configuración de cobertura de código
```

### `vitest.setup.ts`
Inicializa las librerías de pruebas (matchers de Jest DOM).

---

## Buenas Prácticas

1. **Probar comportamiento, no implementación**
   - ✅ Probar lo que los usuarios ven e interactúan
   - ❌ Evitar probar el estado interno directamente

2. **Usar nombres de prueba significativos**
   ```typescript
   // Bueno
   it('debe aceptar números de WhatsApp válidos en formato internacional', () => {})
   
   // Malo
   it('whatsapp test', () => {})
   ```

3. **Probar casos límite**
   - Inputs vacíos
   - Inputs con longitud máxima
   - Formatos inválidos
   - Campos requeridos faltantes

4. **Mantener pruebas independientes**
   - Cada prueba debe funcionar de forma aislada
   - Usar `beforeEach()` para reiniciar mocks

5. **Mockear dependencias externas**
   ```typescript
   global.fetch = vi.fn();
   // Ahora fetch está mockeado y no hará llamadas reales
   ```

---

## Aserciones Comunes

```typescript
// Existencia
expect(element).toBeInTheDocument();
expect(element).toBeVisible();

// Valores
expect(input.value).toBe('expected value');
expect(screen.getByText('text')).toBeInTheDocument();

// Estados
expect(checkbox).toBeChecked();
expect(button).toBeDisabled();

// Funciones
expect(mockFn).toHaveBeenCalled();
expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
expect(mockFn).toHaveBeenCalledTimes(1);

// Errores
expect(() => schema.parse(invalid)).toThrow();
```

---

## Depuración de Pruebas

### Ejecutar un único archivo de prueba
```bash
npm run test -- app/__tests__/validations.test.ts
```

### Ejecutar pruebas que coincidan con un patrón
```bash
npm run test -- --grep "Step1Form"
```

### Depurar en VS Code
1. Agregar un breakpoint en la prueba
2. Ejecutar con `npm run test -- --inspect`
3. Abrir `chrome://inspect` en Chrome

---

## Integración CI/CD

Para GitHub Actions u otro CI:

```yaml
- name: Run tests
  run: npm run test

- name: Generate coverage
  run: npm run test:coverage

- name: Upload coverage
  uses: codecov/codecov-action@v3
```

---

## Notas

- Las pruebas son rápidas - ejecuta todo el suite en < 1 segundo
- El modo watch re-ejecuta las pruebas afectadas al cambiar archivos
- El reporte de cobertura ayuda a identificar código sin pruebas
- Todos los esquemas están completamente probados con casos positivos y negativos

````
