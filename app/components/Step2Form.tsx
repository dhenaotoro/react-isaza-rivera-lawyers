'use client';

import React from 'react';
import {
  TextField,
  Box,
  Typography,
  FormControlLabel,
  Checkbox,
  FormHelperText,
  FormControl,
} from '@mui/material';

const translations = {
  es: {
    step2: {
      title: 'Paso 2 — Datos mínimos',
      description: 'Por favor proporciona tu información de contacto',
      labels: {
        name: 'Nombre y apellido',
        city: 'Ciudad',
        whatsapp: 'WhatsApp',
        email: 'Email (opcional, pero recomendado)',
        minors: '¿Hay hijos menores?',
        description: 'Descripción corta (máx 400 caracteres)',
      },
      placeholders: {
        name: 'Ingresa tu nombre completo',
        city: 'Ingresa tu ciudad',
        whatsapp: 'Ingresa tu número de WhatsApp',
        email: 'Ingresa tu correo electrónico',
        description: 'Describe tu situación brevemente...',
      },
    },
  },
};

interface Step2FormProps {
  formData: {
    name: string;
    city: string;
    whatsapp: string;
    email: string;
    minors: boolean;
    description: string;
  };
  onChange: (field: string, value: any) => void;
}

export default function Step2Form({ formData, onChange }: Step2FormProps) {
  const t = translations.es.step2;

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
        {t.title}
      </Typography>
      <Typography variant="body2" sx={{ mb: 3, color: '#666' }}>
        {t.description}
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label={t.labels.name}
          placeholder={t.placeholders.name}
          value={formData.name}
          onChange={(e) => onChange('name', e.target.value)}
          fullWidth
          size="small"
          variant="outlined"
        />

        <TextField
          label={t.labels.city}
          placeholder={t.placeholders.city}
          value={formData.city}
          onChange={(e) => onChange('city', e.target.value)}
          fullWidth
          size="small"
          variant="outlined"
        />

        <TextField
          label={t.labels.whatsapp}
          placeholder={t.placeholders.whatsapp}
          value={formData.whatsapp}
          onChange={(e) => onChange('whatsapp', e.target.value)}
          fullWidth
          size="small"
          variant="outlined"
          type="tel"
        />

        <TextField
          label={t.labels.email}
          placeholder={t.placeholders.email}
          value={formData.email}
          onChange={(e) => onChange('email', e.target.value)}
          fullWidth
          size="small"
          variant="outlined"
          type="email"
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={formData.minors}
              onChange={(e) => onChange('minors', e.target.checked)}
            />
          }
          label={<Typography variant="body2">{t.labels.minors}</Typography>}
        />

        <TextField
          label={t.labels.description}
          placeholder={t.placeholders.description}
          value={formData.description}
          onChange={(e) => onChange('description', e.target.value)}
          fullWidth
          multiline
          rows={4}
          size="small"
          variant="outlined"
          helperText={`${formData.description.length}/400`}
        />
      </Box>
    </Box>
  );
}
