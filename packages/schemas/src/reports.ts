import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

const severityEnum = z.enum(['low', 'moderate', 'high', 'critical']);

export const reportFloodAlertSchema = z.object({
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
  range: z.coerce.number(),
  description: z.string().optional(),
  severity: severityEnum,
});

export const createFloodAlertSchema = z.object({
  locationName: z.string(),
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
  range: z.coerce.number(),
  description: z.string().optional(),
  severity: severityEnum,
});

export const reportMapPinSchema = z.object({
  id: z.number(),
  latitude: z.number(),
  longitude: z.number(),
  range: z.number(),
  severity: severityEnum,
  status: z.enum(['verified', 'unverified']),
});

export const reportDetailSchema = z.object({
  id: z.number(),
  location: z.string(),
  description: z.string().nullable(),
  latitude: z.number(),
  longitude: z.number(),
  range: z.number(),
  severity: severityEnum,
  status: z.enum(['verified', 'unverified']),
  image: z.string().nullable(),
  confirms: z.number(),
  denies: z.number(),
  reportedAt: z.date(),
  isAdmin: z.boolean(),
  reporter: z
    .object({
      id: z.number(),
      email: z.string(),
      name: z.string(),
      profilePicture: z.string().nullable(),
    })
    .nullable(),
  verifier: z
    .object({
      id: z.number(),
      email: z.string(),
      name: z.string(),
      profilePicture: z.string().nullable(),
    })
    .nullable(),
});

export const reportListItemSchema = z.object({
  id: z.number(),
  location: z.string(),
  description: z.string().nullable(),
  severity: severityEnum,
  reportedAt: z.date(),
});

export const reportQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  status: z.enum(['unverified', 'verified']).optional(),
  q: z.string().optional(),
});

export const reportListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  severities: z.preprocess(
    (val) => (typeof val === 'string' ? [val] : val),
    z.array(severityEnum).optional(),
  ),
  q: z.string().optional(),
});

export class ReportFloodAlertDto extends createZodDto(reportFloodAlertSchema) {}
export class CreateFloodAlertDto extends createZodDto(createFloodAlertSchema) {}
export class ReportMapPinDto extends createZodDto(reportMapPinSchema) {}
export class ReportDetailDto extends createZodDto(reportDetailSchema) {}
export class ReportListItemDto extends createZodDto(reportListItemSchema) {}
export class ReportQueryDto extends createZodDto(reportQuerySchema) {}
export class ReportListQueryDto extends createZodDto(reportListQuerySchema) {}

export type ReportFloodAlertInput = z.infer<typeof reportFloodAlertSchema>;
export type CreateFloodAlertInput = z.infer<typeof createFloodAlertSchema>;
export type ReportMapPinInput = z.infer<typeof reportMapPinSchema>;
export type ReportDetailInput = z.infer<typeof reportDetailSchema>;
export type ReportListItemInput = z.infer<typeof reportListItemSchema>;
export type ReportQueryInput = z.infer<typeof reportQuerySchema>;
export type ReportListQueryInput = z.infer<typeof reportListQuerySchema>;
