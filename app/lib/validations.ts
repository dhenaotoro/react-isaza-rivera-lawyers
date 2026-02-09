import { z } from 'zod';

// Enums RequestType del backend: DIVORCED, CHILD_SUPPORT, CUSTODY, DOMESTIC_VIOLENCE, OTHER
export const CaseTypeEnum = z.enum([
  'CHILD_SUPPORT',
  'CUSTODY',
  'DOMESTIC_VIOLENCE',
  'DIVORCED',
  'OTHER',
]);

const colombianCellRegex = /^(\+57)?3\d{9}$/;

export const LeadSchema = z.object({
  caseType: CaseTypeEnum,
  name: z.string().min(1, 'nameRequired').min(2),
  city: z.string().min(1, 'cityRequired'),
  whatsapp: z
    .string()
    .min(1, 'whatsappRequired')
    .regex(colombianCellRegex, 'whatsappInvalid'),
  email: z.string().min(1, 'emailRequired').email('emailInvalid'),
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
  whatsapp: z
    .string()
    .min(1, 'whatsappRequired')
    .regex(colombianCellRegex, 'whatsappInvalid'),
  email: z.string().min(1, 'emailRequired').email('emailInvalid'),
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
