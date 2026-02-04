import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { POST } from '@/app/api/v1/leads/route';
import { NextRequest } from 'next/server';

// Mock fetch
global.fetch = vi.fn();

describe('POST /api/v1/leads', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const validLead = {
    caseType: 'divorce',
    name: 'Test User',
    city: 'Bogotá',
    whatsapp: '+573001234567',
    email: 'test@example.com',
    minors: false,
    description: 'Test description',
    dataProcessing: true,
    legalDisclaimer: true,
    whatsappConsent: false,
  };

  it('should accept valid lead data and forward to backend', async () => {
    const mockResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue({ id: 123, success: true }),
    };
    (global.fetch as any).mockResolvedValueOnce(mockResponse);

    const request = new NextRequest('http://localhost:3000/api/v1/leads', {
      method: 'POST',
      body: JSON.stringify(validLead),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.id).toBe(123);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/leads'),
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
    );
  });

  it('should reject invalid lead data', async () => {
    const invalidLead = {
      caseType: 'invalid',
      name: 'Test',
      // Missing required fields
    };

    const request = new NextRequest('http://localhost:3000/api/v1/leads', {
      method: 'POST',
      body: JSON.stringify(invalidLead),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);

    const data = await response.json();
    expect(data.success).toBe(false);
  });

  it('should reject lead without required consents', async () => {
    const leadWithoutConsent = {
      ...validLead,
      dataProcessing: false,
    };

    const request = new NextRequest('http://localhost:3000/api/v1/leads', {
      method: 'POST',
      body: JSON.stringify(leadWithoutConsent),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
  });

  it('should handle backend error responses', async () => {
    const mockResponse = {
      ok: false,
      json: vi.fn().mockResolvedValue({ message: 'Backend error' }),
    };
    (global.fetch as any).mockResolvedValueOnce(mockResponse);

    const request = new NextRequest('http://localhost:3000/api/v1/leads', {
      method: 'POST',
      body: JSON.stringify(validLead),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);

    const data = await response.json();
    expect(data.success).toBe(false);
  });

  it('should handle network errors', async () => {
    (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

    const request = new NextRequest('http://localhost:3000/api/v1/leads', {
      method: 'POST',
      body: JSON.stringify(validLead),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);

    const data = await response.json();
    expect(data.success).toBe(false);
  });

  it('should validate email format', async () => {
    const leadWithBadEmail = {
      ...validLead,
      email: 'not-an-email',
    };

    const request = new NextRequest('http://localhost:3000/api/v1/leads', {
      method: 'POST',
      body: JSON.stringify(leadWithBadEmail),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
  });

  it('should validate WhatsApp format', async () => {
    const leadWithBadWhatsApp = {
      ...validLead,
      whatsapp: 'invalid-whatsapp',
    };

    const request = new NextRequest('http://localhost:3000/api/v1/leads', {
      method: 'POST',
      body: JSON.stringify(leadWithBadWhatsApp),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
  });

  it('should validate description length', async () => {
    const leadWithLongDescription = {
      ...validLead,
      description: 'a'.repeat(401),
    };

    const request = new NextRequest('http://localhost:3000/api/v1/leads', {
      method: 'POST',
      body: JSON.stringify(leadWithLongDescription),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
  });

  it('should allow empty email field', async () => {
    const mockResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue({ id: 123, success: true }),
    };
    (global.fetch as any).mockResolvedValueOnce(mockResponse);

    const leadWithoutEmail = {
      ...validLead,
      email: '',
    };

    const request = new NextRequest('http://localhost:3000/api/v1/leads', {
      method: 'POST',
      body: JSON.stringify(leadWithoutEmail),
    });

    const response = await POST(request);
    expect(response.status).toBe(201);
  });
});
