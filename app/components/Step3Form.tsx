'use client';

import React from 'react';
import {
  Box,
  Typography,
  FormControlLabel,
  Checkbox,
  FormControl,
  FormHelperText,
} from '@mui/material';

const translations = {
  es: {
    step3: {
      title: 'Paso 3 — Consentimiento + Disclaimer',
      description: 'Por favor revisa y acepta los términos',
      labels: {
        dataProcessing: 'Acepto tratamiento de datos personales',
        legalDisclaimer:
          'Acepto que esto es orientación inicial y la abogada confirmará viabilidad',
        whatsappConsent: 'Autorizo recibir actualizaciones por WhatsApp (Opcional)',
      },
    },
  },
};

interface Step3FormProps {
  formData: {
    dataProcessing: boolean;
    legalDisclaimer: boolean;
    isWhatsappConsent: boolean;
  };
  onChange: (field: string, value: any) => void;
}

export default function Step3Form({ formData, onChange }: Step3FormProps) {
  const t = translations.es.step3;

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
        {t.title}
      </Typography>
      <Typography variant="body2" sx={{ mb: 3, color: '#666' }}>
        {t.description}
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <FormControl component="fieldset">
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.dataProcessing}
                onChange={(e) => onChange('dataProcessing', e.target.checked)}
              />
            }
            label={
              <Typography variant="body2">
                {t.labels.dataProcessing}
              </Typography>
            }
          />
        </FormControl>

        <FormControl component="fieldset">
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.legalDisclaimer}
                onChange={(e) => onChange('legalDisclaimer', e.target.checked)}
              />
            }
            label={
              <Typography variant="body2">
                {t.labels.legalDisclaimer}
              </Typography>
            }
          />
        </FormControl>

        <FormControl component="fieldset">
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.isWhatsappConsent}
                onChange={(e) => onChange('isWhatsappConsent', e.target.checked)}
              />
            }
            label={
              <Typography variant="body2">
                {t.labels.whatsappConsent}
              </Typography>
            }
          />
        </FormControl>
      </Box>
    </Box>
  );
}
