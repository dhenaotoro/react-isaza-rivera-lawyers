import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Step1Form from '@/app/components/Step1Form';

describe('Step1Form Component', () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('should render step 1 title', () => {
    render(
      <Step1Form
        formData={{ caseType: '' }}
        onChange={mockOnChange}
      />
    );
    expect(screen.getByText('Paso 1 — Tipo de caso')).toBeInTheDocument();
  });

  it('should render all case type options', () => {
    render(
      <Step1Form
        formData={{ caseType: '' }}
        onChange={mockOnChange}
      />
    );
    expect(screen.getByText('Cuota alimentaria')).toBeInTheDocument();
    expect(screen.getByText('Custodia / cuidado personal')).toBeInTheDocument();
    expect(screen.getByText('Violencia doméstica')).toBeInTheDocument();
    expect(screen.getByText('Divorcio')).toBeInTheDocument();
    expect(screen.getByText('Otro')).toBeInTheDocument();
    expect(
      screen.queryByText(
        /Si seleccionas "Otro", por favor describe tu motivo en el campo de descripción del siguiente paso\./i
      )
    ).not.toBeInTheDocument();
  });

  it('should call onChange when selecting a case type', async () => {
    const user = userEvent.setup();
    render(
      <Step1Form
        formData={{ caseType: '' }}
        onChange={mockOnChange}
      />
    );

    const divorceRadio = screen.getByRole('radio', { name: /Divorcio/i });
    await user.click(divorceRadio);

    expect(mockOnChange).toHaveBeenCalledWith('caseType', 'DIVORCED');
  });

  it('should show selected case type', () => {
    const { rerender } = render(
      <Step1Form
        formData={{ caseType: '' }}
        onChange={mockOnChange}
      />
    );

    const childSupportRadio = screen.getByRole('radio', {
      name: /Cuota alimentaria/i,
    });
    expect(childSupportRadio).not.toBeChecked();

    rerender(
      <Step1Form
        formData={{ caseType: 'CHILD_SUPPORT' }}
        onChange={mockOnChange}
      />
    );

    expect(childSupportRadio).toBeChecked();
  });

  it('should allow selecting different case types', async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <Step1Form
        formData={{ caseType: 'CHILD_SUPPORT' }}
        onChange={mockOnChange}
      />
    );

    const custodyRadio = screen.getByRole('radio', {
      name: /Custodia/i,
    });
    await user.click(custodyRadio);

    expect(mockOnChange).toHaveBeenCalledWith('caseType', 'CUSTODY');
  });

  it('should show other hint when other is selected', () => {
    render(
      <Step1Form
        formData={{ caseType: 'OTHER' }}
        onChange={mockOnChange}
      />
    );

    expect(
      screen.getByText(
        /Si seleccionas "Otro", por favor describe tu motivo en el campo de descripción del siguiente paso\./i
      )
    ).toBeInTheDocument();
  });
});
