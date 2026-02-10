import { NextRequest, NextResponse } from 'next/server';
import { LeadSchema } from '@/app/lib/validations';
import z from 'zod';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8081';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validar el cuerpo de la petición
    const validatedData = LeadSchema.parse(body);

    // Mapear la estructura del frontend al DTO del backend Java
    const [firstName, ...rest] = validatedData.name.trim().split(/\s+/);
    // Asegurar que lastName requerido por el backend no quede vacío: usar firstName cuando solo hay una palabra
    const lastName = rest.join(' ') || firstName;

    const payloadForBackend = {
      firstName,
      lastName,
      phone: validatedData.whatsapp,
      requestType: validatedData.caseType,
      summary: validatedData.description,
      city: validatedData.city,
      email: validatedData.email || null,
      hasMinors: validatedData.minors,
      dataProcessingConsent: validatedData.dataProcessing,
      legalDisclaimer: validatedData.legalDisclaimer,
      whatsappConsent: validatedData.isWhatsappConsent ?? false,
      source: 'web',
    };

    // Registrar payload saliente para depuración
    console.log('Forwarding lead to Java backend:', payloadForBackend);

    // Reenviar al backend Java
    const javaBackendUrl = `${API_BASE_URL}/api/v1/leads`;

    const response = await fetch(javaBackendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payloadForBackend),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Java backend error:', errorData);
      throw new Error(errorData.message || 'Error from backend');
    }

    const responseData = await response.json();

    // El backend devuelve: { id }
    return NextResponse.json(responseData, { status: 201 });
  } catch (error) {
    console.error('Error processing lead:', error);

    let userMessage = 'Error procesando el registro.';
    // Detectar error de Zod
    if (error instanceof z.ZodError) {
      const errorToCheck =(error as unknown as z.ZodError)
      const emailError = errorToCheck.errors.find(e => e.message === 'emailInvalid');
      if (emailError) {
        userMessage = 'El correo ingresado no es válido.';
      } else {
        userMessage = errorToCheck.errors.map(e => {
          if (e.message === 'emailInvalid') return 'El correo ingresado no es válido.';
          if (e.message === 'whatsappInvalid') return 'El número de WhatsApp no es válido.';
          if (e.message === 'descriptionMax') return 'La descripción no puede exceder 400 caracteres.';
          if (e.message === 'nameRequired') return 'El nombre es obligatorio.';
          if (e.message === 'cityRequired') return 'La ciudad es obligatoria.';
          if (e.message === 'whatsappRequired') return 'El número de WhatsApp es obligatorio.';
          if (e.message === 'descriptionRequired') return 'La descripción es obligatoria.';
          if (e.message === 'dataProcessingRequired') return 'Debes aceptar el consentimiento de datos.';
          if (e.message === 'disclaimerRequired') return 'Debes aceptar el aviso legal.';
          return 'Campo inválido: ' + e.path.join('.');
        }).join(' ');
      }
    } else if (error instanceof Error && error.message === 'emailInvalid') {
      userMessage = 'El correo ingresado no es válido.';
    } else if (error instanceof Error) {
      userMessage = error.message;
    }

    return NextResponse.json(
      {
        success: false,
        message: userMessage,
        error: userMessage,
      },
      { status: 400 }
    );
  }
}
