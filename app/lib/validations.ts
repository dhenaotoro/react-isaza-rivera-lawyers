import { z } from 'zod';

// Backend RequestType enums: DIVORCED, CHILD_SUPPORT, CUSTODY, DOMESTIC_VIOLENCE, OTHER
export const CaseTypeEnum = z.enum([
  'CHILD_SUPPORT',
  'CUSTODY',
  'DOMESTIC_VIOLENCE',
  'DIVORCED',
  'OTHER',
]);

export const LeadSchema = z.object({
  caseType: CaseTypeEnum,
  name: z.string().min(1, 'nameRequired').min(2),
  city: z.string().min(1, 'cityRequired'),
  whatsapp: z.string().min(1, 'whatsappRequired').regex(/^\+?[1-9]\d{1,14}$/, 'whatsappInvalid'),
  email: z.string().email('emailInvalid').optional().or(z.literal('')),
  minors: z.boolean(),
  description: z.string().min(1, 'descriptionRequired').max(400, 'descriptionMax'),
  dataProcessing: z.boolean().refine((val) => val === true, 'dataProcessingRequired'),
  legalDisclaimer: z.boolean().refine((val) => val === true, 'disclaimerRequired'),
  isWhatsappConsent: z.boolean().optional().default(false),
});

export type Lead = z.infer<typeof LeadSchema>;

export const Step1Schema = z.object({
  caseType: CaseTypeEnum,
});

export const Step2Schema = z.object({
  name: z.string().min(1, 'nameRequired').min(2),
  city: z.string().min(1, 'cityRequired'),
  whatsapp: z.string().min(1, 'whatsappRequired').regex(/^\+?[1-9]\d{1,14}$/, 'whatsappInvalid'),
  email: z.string().email('emailInvalid').optional().or(z.literal('')),
  minors: z.boolean(),
  description: z.string().min(1, 'descriptionRequired').max(400, 'descriptionMax'),
});

export const Step3Schema = z.object({
  dataProcessing: z.boolean().refine((val) => val === true, 'dataProcessingRequired'),
  legalDisclaimer: z.boolean().refine((val) => val === true, 'disclaimerRequired'),
  isWhatsappConsent: z.boolean().optional().default(false),
});

export type Step1 = z.infer<typeof Step1Schema>;
export type Step2 = z.infer<typeof Step2Schema>;
export type Step3 = z.infer<typeof Step3Schema>;
