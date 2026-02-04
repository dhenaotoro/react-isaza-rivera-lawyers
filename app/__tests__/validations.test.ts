import { describe, it, expect } from 'vitest';
import {
  LeadSchema,
  Step1Schema,
  Step2Schema,
  Step3Schema,
  CaseTypeEnum,
} from '@/app/lib/validations';
import { z } from 'zod';

describe('Validation Schemas', () => {
  describe('CaseTypeEnum', () => {
    it('should validate correct case types', () => {
      const validTypes = ['child_support', 'custody', 'visitation', 'divorce'];
      validTypes.forEach((type) => {
        expect(() => CaseTypeEnum.parse(type)).not.toThrow();
      });
    });

    it('should reject invalid case types', () => {
      expect(() => CaseTypeEnum.parse('invalid_type')).toThrow();
    });
  });

  describe('Step1Schema', () => {
    it('should validate with a valid case type', () => {
      const data = { caseType: 'child_support' };
      const result = Step1Schema.parse(data);
      expect(result.caseType).toBe('child_support');
    });

    it('should reject missing case type', () => {
      const data = {};
      expect(() => Step1Schema.parse(data)).toThrow();
    });

    it('should reject invalid case type', () => {
      const data = { caseType: 'invalid' };
      expect(() => Step1Schema.parse(data)).toThrow();
    });
  });

  describe('Step2Schema', () => {
    const validData = {
      name: 'Juan García',
      city: 'Bogotá',
      whatsapp: '+573001234567',
      email: 'juan@example.com',
      minors: true,
      description: 'Necesito ayuda con la custodia',
    };

    it('should validate with all required fields', () => {
      const result = Step2Schema.parse(validData);
      expect(result.name).toBe('Juan García');
      expect(result.city).toBe('Bogotá');
      expect(result.whatsapp).toBe('+573001234567');
      expect(result.email).toBe('juan@example.com');
    });

    it('should allow empty email', () => {
      const data = { ...validData, email: '' };
      const result = Step2Schema.parse(data);
      expect(result.email).toBe('');
    });

    it('should reject invalid email format', () => {
      const data = { ...validData, email: 'not-an-email' };
      expect(() => Step2Schema.parse(data)).toThrow();
    });

    it('should reject invalid WhatsApp format', () => {
      const data = { ...validData, whatsapp: 'invalid' };
      expect(() => Step2Schema.parse(data)).toThrow();
    });

    it('should accept WhatsApp with various formats', () => {
      const validFormats = [
        '+573001234567',
        '573001234567',
        '+1234567890',
        '3001234567',
      ];
      validFormats.forEach((whatsapp) => {
        const data = { ...validData, whatsapp };
        expect(() => Step2Schema.parse(data)).not.toThrow();
      });
    });

    it('should reject description exceeding 400 characters', () => {
      const longDescription = 'a'.repeat(401);
      const data = { ...validData, description: longDescription };
      expect(() => Step2Schema.parse(data)).toThrow();
    });

    it('should allow description with exactly 400 characters', () => {
      const maxDescription = 'a'.repeat(400);
      const data = { ...validData, description: maxDescription };
      expect(() => Step2Schema.parse(data)).not.toThrow();
    });

    it('should reject missing required fields', () => {
      const fields = ['name', 'city', 'whatsapp', 'description'];
      fields.forEach((field) => {
        const data = { ...validData };
        delete (data as any)[field];
        expect(() => Step2Schema.parse(data)).toThrow();
      });
    });

    it('should reject name shorter than 2 characters', () => {
      const data = { ...validData, name: 'A' };
      expect(() => Step2Schema.parse(data)).toThrow();
    });
  });

  describe('Step3Schema', () => {
    const validData = {
      dataProcessing: true,
      legalDisclaimer: true,
      whatsappConsent: false,
    };

    it('should validate with all required consents', () => {
      const result = Step3Schema.parse(validData);
      expect(result.dataProcessing).toBe(true);
      expect(result.legalDisclaimer).toBe(true);
    });

    it('should reject when dataProcessing is false', () => {
      const data = { ...validData, dataProcessing: false };
      expect(() => Step3Schema.parse(data)).toThrow();
    });

    it('should reject when legalDisclaimer is false', () => {
      const data = { ...validData, legalDisclaimer: false };
      expect(() => Step3Schema.parse(data)).toThrow();
    });

    it('should default whatsappConsent to false if not provided', () => {
      const data = { dataProcessing: true, legalDisclaimer: true };
      const result = Step3Schema.parse(data);
      expect(result.whatsappConsent).toBe(false);
    });

    it('should allow whatsappConsent to be true', () => {
      const data = { ...validData, whatsappConsent: true };
      const result = Step3Schema.parse(data);
      expect(result.whatsappConsent).toBe(true);
    });
  });

  describe('LeadSchema', () => {
    const validLead = {
      caseType: 'divorce',
      name: 'María López',
      city: 'Medellín',
      whatsapp: '+573109876543',
      email: 'maria@example.com',
      minors: false,
      description: 'Necesito orientación sobre divorcio',
      dataProcessing: true,
      legalDisclaimer: true,
      whatsappConsent: true,
    };

    it('should validate a complete lead', () => {
      const result = LeadSchema.parse(validLead);
      expect(result.caseType).toBe('divorce');
      expect(result.name).toBe('María López');
      expect(result.dataProcessing).toBe(true);
    });

    it('should allow optional email to be empty', () => {
      const data = { ...validLead, email: '' };
      expect(() => LeadSchema.parse(data)).not.toThrow();
    });

    it('should require dataProcessing consent', () => {
      const data = { ...validLead, dataProcessing: false };
      expect(() => LeadSchema.parse(data)).toThrow();
    });

    it('should require legalDisclaimer consent', () => {
      const data = { ...validLead, legalDisclaimer: false };
      expect(() => LeadSchema.parse(data)).toThrow();
    });

    it('should validate all case types', () => {
      const caseTypes = ['child_support', 'custody', 'visitation', 'divorce'];
      caseTypes.forEach((caseType) => {
        const data = { ...validLead, caseType: caseType as any };
        expect(() => LeadSchema.parse(data)).not.toThrow();
      });
    });

    it('should reject invalid data structure', () => {
      const invalidData = {
        caseType: 'divorce',
        // Missing required fields
      };
      expect(() => LeadSchema.parse(invalidData)).toThrow();
    });
  });
});
