import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Step2Form from '@/app/components/Step2Form';

describe('Step2Form Component', () => {
  const mockOnChange = vi.fn();

  const defaultFormData = {
    name: '',
    city: '',
    whatsapp: '',
    email: '',
    minors: false,
    description: '',
  };

  const renderWithState = (initialData = defaultFormData) => {
    const Wrapper = () => {
      const [data, setData] = useState(initialData);
      return (
        <Step2Form
          formData={data}
          onChange={(field, value) => {
            setData((prev) => ({ ...prev, [field]: value }));
            mockOnChange(field, value);
          }}
        />
      );
    };

    return render(<Wrapper />);
  };

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('should render step 2 title and description', () => {
    render(
      <Step2Form
        formData={defaultFormData}
        onChange={mockOnChange}
      />
    );
    expect(screen.getByText('Paso 2 — Datos mínimos')).toBeInTheDocument();
    expect(
      screen.getByText('Por favor proporciona tu información de contacto')
    ).toBeInTheDocument();
  });

  it('should render all form fields', () => {
    render(
      <Step2Form
        formData={defaultFormData}
        onChange={mockOnChange}
      />
    );
    expect(screen.getByLabelText(/Nombre y apellido/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Ciudad/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Numero de celular/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/¿Hay hijos menores\?/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Descripción corta/i)).toBeInTheDocument();
  });

  it('should call onChange when name field changes', async () => {
    const user = userEvent.setup();
    renderWithState();

    const nameInput = screen.getByLabelText(/Nombre y apellido/i);
    await user.type(nameInput, 'Juan García');

    expect(mockOnChange).toHaveBeenCalledWith('name', 'Juan García');
  });

  it('should call onChange for all form fields', async () => {
    renderWithState();

    fireEvent.change(screen.getByLabelText(/Nombre y apellido/i), {
      target: { value: 'Test' },
    });
    expect(mockOnChange).toHaveBeenCalledWith('name', 'Test');

    fireEvent.change(screen.getByLabelText(/Ciudad/i), {
      target: { value: 'Bogotá' },
    });
    expect(mockOnChange).toHaveBeenCalledWith('city', 'Bogotá');

    fireEvent.change(screen.getByLabelText(/Numero de celular/i), {
      target: { value: '+573001234567' },
    });
    expect(mockOnChange).toHaveBeenCalledWith('whatsapp', '+573001234567');

    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'test@example.com' },
    });
    expect(mockOnChange).toHaveBeenCalledWith('email', 'test@example.com');
  });

  it('should display character count for description', () => {
    render(
      <Step2Form
        formData={{ ...defaultFormData, description: 'Test description' }}
        onChange={mockOnChange}
      />
    );

    expect(screen.getByText('16/400')).toBeInTheDocument();
  });

  it('should call onChange when minors checkbox changes', async () => {
    const user = userEvent.setup();
    render(
      <Step2Form
        formData={defaultFormData}
        onChange={mockOnChange}
      />
    );

    const minorsCheckbox = screen.getByRole('checkbox', {
      name: /¿Hay hijos menores?/i,
    });
    await user.click(minorsCheckbox);

    expect(mockOnChange).toHaveBeenCalledWith('minors', true);
  });

  it('should show pre-filled values', () => {
    const filledData = {
      name: 'María López',
      city: 'Medellín',
      whatsapp: '+573109876543',
      email: 'maria@example.com',
      minors: true,
      description: 'Necesito ayuda',
    };

    render(
      <Step2Form
        formData={filledData}
        onChange={mockOnChange}
      />
    );

    expect(screen.getByDisplayValue('María López')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Medellín')).toBeInTheDocument();
    expect(screen.getByDisplayValue('+573109876543')).toBeInTheDocument();
    expect(screen.getByDisplayValue('maria@example.com')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Necesito ayuda')).toBeInTheDocument();
  });

  it('should update character count as description changes', () => {
    const { rerender } = render(
      <Step2Form
        formData={defaultFormData}
        onChange={mockOnChange}
      />
    );

    expect(screen.getByText('0/400')).toBeInTheDocument();

    const longDesc = 'a'.repeat(100);
    rerender(
      <Step2Form
        formData={{ ...defaultFormData, description: longDesc }}
        onChange={mockOnChange}
      />
    );

    expect(screen.getByText('100/400')).toBeInTheDocument();
  });
});
