import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Step3Form from '@/app/components/Step3Form';

describe('Step3Form Component', () => {
  const mockOnChange = vi.fn();

  const defaultFormData = {
    dataProcessing: false,
    legalDisclaimer: false,
    isWhatsappConsent: false,
  };

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('should render step 3 title and description', () => {
    render(
      <Step3Form
        formData={defaultFormData}
        onChange={mockOnChange}
      />
    );
    expect(
      screen.getByText('Paso 3 — Consentimiento + Disclaimer')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Por favor revisa y acepta los términos')
    ).toBeInTheDocument();
  });

  it('should render all consent checkboxes', () => {
    render(
      <Step3Form
        formData={defaultFormData}
        onChange={mockOnChange}
      />
    );
    expect(
      screen.getByRole('checkbox', {
        name: /Acepto tratamiento de datos personales/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', {
        name: /Acepto que esto es orientación inicial/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', {
        name: /Autorizo recibir actualizaciones por WhatsApp/i,
      })
    ).toBeInTheDocument();
  });

  it('should call onChange when dataProcessing checkbox changes', async () => {
    const user = userEvent.setup();
    render(
      <Step3Form
        formData={defaultFormData}
        onChange={mockOnChange}
      />
    );

    const dataProcessingCheckbox = screen.getByRole('checkbox', {
      name: /Acepto tratamiento de datos personales/i,
    });
    await user.click(dataProcessingCheckbox);

    expect(mockOnChange).toHaveBeenCalledWith('dataProcessing', true);
  });

  it('should call onChange when legalDisclaimer checkbox changes', async () => {
    const user = userEvent.setup();
    render(
      <Step3Form
        formData={defaultFormData}
        onChange={mockOnChange}
      />
    );

    const disclaimerCheckbox = screen.getByRole('checkbox', {
      name: /Acepto que esto es orientación inicial/i,
    });
    await user.click(disclaimerCheckbox);

    expect(mockOnChange).toHaveBeenCalledWith('legalDisclaimer', true);
  });

  it('should call onChange when whatsappConsent checkbox changes', async () => {
    const user = userEvent.setup();
    render(
      <Step3Form
        formData={defaultFormData}
        onChange={mockOnChange}
      />
    );

    const whatsappCheckbox = screen.getByRole('checkbox', {
      name: /Autorizo recibir actualizaciones por WhatsApp/i,
    });
    await user.click(whatsappCheckbox);

    expect(mockOnChange).toHaveBeenCalledWith('isWhatsappConsent', true);
  });

  it('should show checked state for true values', () => {
    const checkedData = {
      dataProcessing: true,
      legalDisclaimer: true,
      isWhatsappConsent: true,
    };

    render(
      <Step3Form
        formData={checkedData}
        onChange={mockOnChange}
      />
    );

    expect(
      screen.getByRole('checkbox', {
        name: /Acepto tratamiento de datos personales/i,
      })
    ).toBeChecked();
    expect(
      screen.getByRole('checkbox', {
        name: /Acepto que esto es orientación inicial/i,
      })
    ).toBeChecked();
    expect(
      screen.getByRole('checkbox', {
        name: /Autorizo recibir actualizaciones por WhatsApp/i,
      })
    ).toBeChecked();
  });

  it('should allow toggling checkboxes multiple times', async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <Step3Form
        formData={defaultFormData}
        onChange={mockOnChange}
      />
    );

    const dataProcessingCheckbox = screen.getByRole('checkbox', {
      name: /Acepto tratamiento de datos personales/i,
    });

    await user.click(dataProcessingCheckbox);
    expect(mockOnChange).toHaveBeenCalledWith('dataProcessing', true);

    mockOnChange.mockClear();

    rerender(
      <Step3Form
        formData={{ ...defaultFormData, dataProcessing: true }}
        onChange={mockOnChange}
      />
    );

    await user.click(dataProcessingCheckbox);
    expect(mockOnChange).toHaveBeenCalledWith('dataProcessing', false);
  });
});
