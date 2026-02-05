import { NextRequest, NextResponse } from 'next/server';
import { LeadSchema } from '@/app/lib/validations';

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
    
    // El backend devuelve: { id, status, calendlyUrl, whatsappUrl }
    // Pasar al frontend tal cual
    return NextResponse.json(responseData, { status: 201 });
  } catch (error) {
    console.error('Error processing lead:', error);

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Error processing lead',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 400 }
    );
  }
}
