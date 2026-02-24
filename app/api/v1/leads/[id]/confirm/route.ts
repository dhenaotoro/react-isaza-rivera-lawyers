import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8081';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Lead ID is required' },
        { status: 400 }
      );
    }

    // Reenviar al backend Java
    const javaBackendUrl = `${API_BASE_URL}/api/v1/leads/${id}/confirm`;

    const response = await fetch(javaBackendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      let errorMessage = 'Error from backend';
      if (errorText) {
        try {
          const parsedError = JSON.parse(errorText) as { message?: string };
          errorMessage = parsedError.message || errorMessage;
        } catch {
          errorMessage = errorText;
        }
      }
      console.error('Java backend error:', errorMessage);
      throw new Error(errorMessage);
    }

    const responseText = await response.text();
    console.log('The /confirm endpoint response:', responseText);
    if (responseText) {
      try {
        const responseData = JSON.parse(responseText) as Record<string, unknown>;
        return NextResponse.json(responseData, { status: 200 });
      } catch {
        return NextResponse.json({ message: responseText }, { status: 200 });
      }
    }

    return NextResponse.json({ message: 'Lead confirmed successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error confirming lead:', error);

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Error confirming lead',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 400 }
    );
  }
}
