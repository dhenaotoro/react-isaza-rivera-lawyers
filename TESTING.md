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

### 1. **Validation Tests** (`app/__tests__/validations.test.ts`)
Tests for Zod schemas ensuring data integrity:

- **CaseTypeEnum** - Valid/invalid case types
- **Step1Schema** - Case type selection validation
- **Step2Schema** - Contact info validation (name, city, WhatsApp, email, description)
- **Step3Schema** - Consent validation
- **LeadSchema** - Full lead submission validation

**Key validations:**
- WhatsApp format (international phone format)
- Email format
- Description length (max 400 characters)
- Required consents for data processing and legal disclaimer

---

### 2. **API Endpoint Tests** (`app/api/__tests__/leads.test.ts`)
Tests for the POST `/api/v1/leads` endpoint:

- Valid lead submission with backend forwarding
- Invalid data rejection
- Missing consent rejection
- Email format validation
- WhatsApp format validation
- Description length validation
- Backend error handling
- Network error handling
- Empty email field (allowed)

---

### 3. **Component Tests**

#### **Step1Form Tests** (`app/components/__tests__/Step1Form.test.tsx`)
- Renders all case type options
- Handles radio button selection
- Shows selected case type correctly
- Calls onChange callback with correct values

#### **Step2Form Tests** (`app/components/__tests__/Step2Form.test.tsx`)
- Renders all form fields
- Handles text input changes
- Displays character count for description (0/400)
- Handles minors checkbox
- Shows pre-filled values
- Updates character count dynamically

#### **Step3Form Tests** (`app/components/__tests__/Step3Form.test.tsx`)
- Renders all consent checkboxes
- Handles checkbox state changes
- Shows correct checked state
- Allows toggling checkboxes

---

## Example Test

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Step1Form from '@/app/components/Step1Form';

describe('Step1Form Component', () => {
  it('should render all case type options', () => {
    render(
      <Step1Form
        formData={{ caseType: '' }}
        onChange={vi.fn()}
      />
    );
    
    expect(screen.getByText('Cuota alimentaria')).toBeInTheDocument();
    expect(screen.getByText('Divorcio')).toBeInTheDocument();
  });

  it('should call onChange when selecting a case type', async () => {
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

## Test Utilities

### Vitest
- `describe()` - Group related tests
- `it()` - Define individual test
- `expect()` - Assert expected outcomes
- `vi.fn()` - Create mock functions
- `beforeEach()`, `afterEach()` - Test lifecycle hooks

### React Testing Library
- `render()` - Render a component
- `screen` - Query elements in the DOM
- `userEvent.setup()` - Simulate user interactions
- `toBeInTheDocument()` - Assert element exists
- `toBeChecked()` - Assert checkbox is checked

---

## Configuration Files

### `vitest.config.ts`
```typescript
- globals: true          // Use global test functions
- environment: jsdom     // Simulate browser environment
- setupFiles             // Run setup before tests
- coverage              // Code coverage settings
```

### `vitest.setup.ts`
Initializes testing libraries (Jest DOM matchers).

---

## Best Practices

1. **Test Behavior, Not Implementation**
   - ✅ Test what users see and interact with
   - ❌ Avoid testing internal state directly

2. **Use Meaningful Test Names**
   ```typescript
   // Good
   it('should accept valid WhatsApp numbers in international format', () => {})
   
   // Bad
   it('whatsapp test', () => {})
   ```

3. **Test Edge Cases**
   - Empty inputs
   - Maximum length inputs
   - Invalid formats
   - Missing required fields

4. **Keep Tests Independent**
   - Each test should work in isolation
   - Use `beforeEach()` to reset mocks

5. **Mock External Dependencies**
   ```typescript
   global.fetch = vi.fn();
   // Now fetch is mocked and won't make real network calls
   ```

---

## Common Assertions

```typescript
// Existence
expect(element).toBeInTheDocument();
expect(element).toBeVisible();

// Values
expect(input.value).toBe('expected value');
expect(screen.getByText('text')).toBeInTheDocument();

// States
expect(checkbox).toBeChecked();
expect(button).toBeDisabled();

// Functions
expect(mockFn).toHaveBeenCalled();
expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
expect(mockFn).toHaveBeenCalledTimes(1);

// Errors
expect(() => schema.parse(invalid)).toThrow();
```

---

## Debugging Tests

### Run single test file
```bash
npm run test -- app/__tests__/validations.test.ts
```

### Run tests matching a pattern
```bash
npm run test -- --grep "Step1Form"
```

### Debug in VS Code
1. Add breakpoint in test
2. Run with `npm run test -- --inspect`
3. Open `chrome://inspect` in Chrome

---

## CI/CD Integration

For GitHub Actions or similar CI:

```yaml
- name: Run tests
  run: npm run test

- name: Generate coverage
  run: npm run test:coverage

- name: Upload coverage
  uses: codecov/codecov-action@v3
```

---

## Notes

- Tests are fast - run entire suite in < 1 second
- Watch mode re-runs affected tests on file changes
- Coverage reporting helps identify untested code
- All schemas are fully tested with positive and negative cases
