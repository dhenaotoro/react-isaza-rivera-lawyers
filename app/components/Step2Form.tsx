'use client';

import React, { useState } from 'react';
import {
  TextField,
  Box,
  Typography,
  FormControlLabel,
  Checkbox,
} from '@mui/material';

const translations = {
  es: {
    step2: {
      title: 'Paso 2 — Datos mínimos',
      description: 'Por favor proporciona tu información de contacto',
      labels: {
        name: 'Nombre y apellido',
        city: 'Ciudad',
        whatsapp: 'Numero de celular',
        email: 'Email',
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

import { Step2Schema } from '@/app/lib/validations';
import { z } from 'zod';

const Step2Form: React.FC<Step2FormProps> = ({ formData, onChange }) => {
  const t = translations.es.step2;
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Validar campo individual
  const validateField = (field: string, value: any) => {
    try {
      // Validar solo el campo individual usando un switch para evitar problemas de tipos
      switch (field) {
        case 'name':
          Step2Schema.pick({ name: true }).parse({ name: value });
          break;
        case 'city':
          Step2Schema.pick({ city: true }).parse({ city: value });
          break;
        case 'whatsapp':
          Step2Schema.pick({ whatsapp: true }).parse({ whatsapp: value });
          break;
        case 'email':
          Step2Schema.pick({ email: true }).parse({ email: value });
          break;
        case 'minors':
          Step2Schema.pick({ minors: true }).parse({ minors: value });
          break;
        case 'description':
          Step2Schema.pick({ description: true }).parse({ description: value });
          break;
        default:
          break;
      }
      setErrors((prev) => ({ ...prev, [field]: '' }));
    } catch (err) {
      if (err instanceof z.ZodError) {
        const msg = err.errors[0]?.message;
        // Mapear mensajes
        const map: Record<string, string> = {
          whatsappInvalid:
            'Ingresa tu número con código de país. Ej: +1 415 555 1234 o +57 (300) 123-4567.',
          emailInvalid: 'El correo ingresado no es válido.',
          descriptionMax: 'La descripción no puede exceder 400 caracteres.',
        };

        if (msg && map[msg]) {
          setErrors((prev) => ({ ...prev, [field]: map[msg] }));
        } else {
          setErrors((prev) => ({ ...prev, [field]: '' }));
        }
      }
    }
  };

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
          onChange={(e) => {
            onChange('name', e.target.value);
            validateField('name', e.target.value);
          }}
          error={!!errors.name}
          helperText={errors.name}
          required
          fullWidth
          size="small"
          variant="outlined"
        />

        <TextField
          label={t.labels.city}
          placeholder={t.placeholders.city}
          value={formData.city}
          onChange={(e) => {
            onChange('city', e.target.value);
            validateField('city', e.target.value);
          }}
          error={!!errors.city}
          helperText={errors.city}
          required
          fullWidth
          size="small"
          variant="outlined"
        />

        <TextField
          label={t.labels.whatsapp}
          placeholder={t.placeholders.whatsapp}
          value={formData.whatsapp}
          onChange={(e) => {
            const sanitized = e.target.value.replace(/[^0-9+()\-\s]/g, '').slice(0, 20);
            onChange('whatsapp', sanitized);
            validateField('whatsapp', sanitized);
          }}
          error={!!errors.whatsapp}
          helperText={errors.whatsapp}
          required
          fullWidth
          size="small"
          variant="outlined"
          type="text"
          inputProps={{
            inputMode: 'numeric',
            pattern: '[0-9+()\-\s]{7,20}',
            maxLength: 20,
          }}
        />

        <TextField
          label={t.labels.email}
          placeholder={t.placeholders.email}
          value={formData.email}
          onChange={(e) => {
            onChange('email', e.target.value);
            validateField('email', e.target.value);
          }}
          error={!!errors.email}
          helperText={errors.email}
          required
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
          onChange={(e) => {
            onChange('description', e.target.value);
            validateField('description', e.target.value);
          }}
          error={!!errors.description}
          helperText={errors.description || `${formData.description.length}/400`}
          required
          fullWidth
          multiline
          rows={4}
          size="small"
          variant="outlined"
        />
      </Box>
    </Box>
  );
};

export default Step2Form;
