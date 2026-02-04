'use client';

import React, { useState } from 'react';
import {
  Container,
  Box,
  Button,
  Stepper,
  Step,
  StepLabel,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import Step1Form from './Step1Form';
import Step2Form from './Step2Form';
import Step3Form from './Step3Form';
import {
  Step1,
  Step2,
  Step3,
  LeadSchema,
  Step1Schema,
  Step2Schema,
  Step3Schema,
} from '@/app/lib/validations';

const translations = {
  es: {
    title: 'Solicitud de Asesoría Legal',
    steps: ['Tipo de caso', 'Datos mínimos', 'Consentimiento'],
    buttons: {
      next: 'Siguiente',
      previous: 'Anterior',
      submit: 'Guardar y agendar turno',
    },
    success: '¡Tu solicitud ha sido enviada exitosamente!',
    successMessage: 'Pronto recibirás un mensaje de confirmación con los detalles de tu cita.',
    scheduleLabel: 'Agendar cita:',
    whatsappLabel: 'Recibir actualizaciones:',
    error: 'Hubo un error al enviar tu solicitud. Intenta de nuevo.',
  },
};

export default function IntakeWizard() {
  const t = translations.es;
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [apiResponse, setApiResponse] = useState<{
    id: string;
    status: string;
    calendlyUrl?: string;
    whatsappUrl?: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    caseType: '',
    name: '',
    city: '',
    whatsapp: '',
    email: '',
    minors: false,
    description: '',
    dataProcessing: false,
    legalDisclaimer: false,
    isWhatsappConsent: false,
  });

  const handleNext = async () => {
    try {
      setError(null);

      if (activeStep === 0) {
        // Validate Step 1
        const step1Data: Step1 = { caseType: formData.caseType as any };
        Step1Schema.parse(step1Data);
      } else if (activeStep === 1) {
        // Validate Step 2
        const step2Data: Step2 = {
          name: formData.name,
          city: formData.city,
          whatsapp: formData.whatsapp,
          email: formData.email,
          minors: formData.minors,
          description: formData.description,
        };
        Step2Schema.parse(step2Data);
      } else if (activeStep === 2) {
        // Validate Step 3 and submit
        const step3Data: Step3 = {
          dataProcessing: formData.dataProcessing,
          legalDisclaimer: formData.legalDisclaimer,
          isWhatsappConsent: formData.isWhatsappConsent,
        };
        Step3Schema.parse(step3Data);

        // Final validation and submission
        const fullData = {
          ...formData,
          email: formData.email || undefined,
        };

        const validatedData = LeadSchema.parse(fullData);

        // Submit to API
        setLoading(true);
        const response = await fetch('/api/v1/leads', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(validatedData),
        });

        if (!response.ok) {
          throw new Error(t.error);
        }

        const data = await response.json();
        setApiResponse(data);
        setSuccess(true);
        return;
      }

      setActiveStep((prevStep) => prevStep + 1);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Validation error. Please check your inputs.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
    setError(null);
  };

  const handleFormChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (success) {
    return (
      <Container
        maxWidth="sm"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          padding: '20px',
          py: 4,
        }}
      >
        <Alert severity="success" sx={{ width: '100%', mb: 3 }}>
          {t.success}
        </Alert>
        <Typography variant="body2" sx={{ mb: 3, textAlign: 'center', color: '#666' }}>
          {t.successMessage}
        </Typography>

        {apiResponse && (
          <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
            {apiResponse.calendlyUrl && (
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  {t.scheduleLabel}
                </Typography>
                <Button
                  href={apiResponse.calendlyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ textTransform: 'none', borderRadius: '8px' }}
                >
                  Agendar cita en Calendly
                </Button>
              </Box>
            )}

            {apiResponse.whatsappUrl && (
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  {t.whatsappLabel}
                </Typography>
                <Button
                  href={apiResponse.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outlined"
                  color="primary"
                  fullWidth
                  sx={{ textTransform: 'none', borderRadius: '8px' }}
                >
                  Contactar por WhatsApp
                </Button>
              </Box>
            )}
          </Box>
        )}
      </Container>
    );
  }

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        padding: '20px',
        py: 4,
      }}
    >
      <Typography
        variant="h5"
        component="h1"
        sx={{
          fontWeight: 700,
          mb: 4,
          textAlign: 'center',
        }}
      >
        {t.title}
      </Typography>

      <Stepper
        activeStep={activeStep}
        sx={{
          mb: 4,
        }}
      >
        {t.steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ flex: 1, mb: 4 }}>
        {activeStep === 0 && (
          <Step1Form formData={formData} onChange={handleFormChange} />
        )}
        {activeStep === 1 && (
          <Step2Form formData={formData} onChange={handleFormChange} />
        )}
        {activeStep === 2 && (
          <Step3Form formData={formData} onChange={handleFormChange} />
        )}
      </Box>

      <Box
        sx={{
          display: 'flex',
          gap: 2,
          justifyContent: 'space-between',
        }}
      >
        <Button
          disabled={activeStep === 0 || loading}
          onClick={handleBack}
          variant="outlined"
          sx={{
            flex: 1,
            textTransform: 'none',
            borderRadius: '8px',
          }}
        >
          {t.buttons.previous}
        </Button>
        <Button
          onClick={handleNext}
          variant="contained"
          color="primary"
          disabled={loading}
          sx={{
            flex: 1,
            textTransform: 'none',
            borderRadius: '8px',
          }}
        >
          {loading ? (
            <CircularProgress size={24} />
          ) : activeStep === 2 ? (
            t.buttons.submit
          ) : (
            t.buttons.next
          )}
        </Button>
      </Box>
    </Container>
  );
}
