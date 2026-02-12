'use client';

import React from 'react';
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Box,
  Typography,
} from '@mui/material';

const translations = {
  es: {
    step1: {
      title: 'Paso 1 — Tipo de caso',
      description: 'Selecciona el tipo de caso legal',
      otherHint:
        'Si seleccionas "Otro", por favor describe tu motivo en el campo de descripción del siguiente paso.',
      options: {
        CHILD_SUPPORT: 'Cuota alimentaria',
        CUSTODY: 'Custodia / cuidado personal',
        DOMESTIC_VIOLENCE: 'Violencia doméstica',
        DIVORCED: 'Divorcio',
        OTHER: 'Otro',
      },
    },
  },
};


interface Step1FormProps {
  formData: {
    caseType: string;
  };
  onChange: (field: string, value: any) => void;
}

const Step1Form: React.FC<Step1FormProps> = ({ formData, onChange }) => {
  const t = translations.es.step1;

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
        {t.title}
      </Typography>
      <Typography variant="body2" sx={{ mb: 3, color: '#666' }}>
        {t.description}
      </Typography>

      <FormControl fullWidth>
        <RadioGroup
          value={formData.caseType}
          onChange={(e) => {
            onChange('caseType', e.target.value);
          }}
        >
          <FormControlLabel
            value="CHILD_SUPPORT"
            control={<Radio />}
            label={<Typography variant="body2">{t.options.CHILD_SUPPORT}</Typography>}
            sx={{ mb: 1 }}
          />
          <FormControlLabel
            value="CUSTODY"
            control={<Radio />}
            label={<Typography variant="body2">{t.options.CUSTODY}</Typography>}
            sx={{ mb: 1 }}
          />
          <FormControlLabel
            value="DOMESTIC_VIOLENCE"
            control={<Radio />}
            label={<Typography variant="body2">{t.options.DOMESTIC_VIOLENCE}</Typography>}
            sx={{ mb: 1 }}
          />
          <FormControlLabel
            value="DIVORCED"
            control={<Radio />}
            label={<Typography variant="body2">{t.options.DIVORCED}</Typography>}
            sx={{ mb: 1 }}
          />
          <FormControlLabel
            value="OTHER"
            control={<Radio />}
            label={<Typography variant="body2">{t.options.OTHER}</Typography>}
            sx={{ mb: 0.5 }}
          />
          {formData.caseType === 'OTHER' && (
            <Typography variant="caption" sx={{ color: '#666', ml: 4, mb: 1 }}>
              {t.otherHint}
            </Typography>
          )}
        </RadioGroup>
      </FormControl>
    </Box>
  );
};

export default Step1Form;
