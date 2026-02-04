'use client';

import Link from 'next/link';
import { Button, Container, Box, Typography } from '@mui/material';

const translations = {
  es: {
    cta: 'Empezar asesoría',
    description: 'Responde 2–3 preguntas y agenda tu turno',
  },
};

export default function LandingPage() {
  const t = translations.es;

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
      }}
    >
      <Box
        sx={{
          textAlign: 'center',
          mb: 4,
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 700,
            mb: 2,
            fontSize: { xs: '28px', sm: '32px' },
          }}
        >
          Isaza & Rivera
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: '#666',
            fontSize: { xs: '14px', sm: '16px' },
            mb: 4,
          }}
        >
          {t.description}
        </Typography>
      </Box>

      <Link href="/intake" style={{ width: '100%' }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          fullWidth
          sx={{
            py: 1.5,
            fontSize: { xs: '16px', sm: '18px' },
            fontWeight: 600,
            textTransform: 'none',
            borderRadius: '8px',
          }}
        >
          {t.cta}
        </Button>
      </Link>
    </Container>
  );
}
