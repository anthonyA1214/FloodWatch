import { severityEnum } from './reports';
import { z } from 'zod';
import { typeEnum } from './safety';
import { createZodDto } from 'nestjs-zod';

export const searchQuerySchema = z.object({
  severities: z.preprocess(
    (val) => (typeof val === 'string' ? [val] : val),
    z.array(severityEnum).optional(),
  ),
  types: z.preprocess(
    (val) => (typeof val === 'string' ? [val] : val),
    z.array(typeEnum).optional(),
  ),
  q: z.string().optional(),
});

const reportResultSchema = z.object({
  id: z.number().int().positive(),
  latitude: z.number(),
  longitude: z.number(),
  location: z.string(),
  severity: severityEnum,
});

const safetyResultSchema = z.object({
  id: z.number().int().positive(),
  latitude: z.number(),
  longitude: z.number(),
  location: z.string(),
  type: typeEnum,
});

export class SearchQueryDto extends createZodDto(searchQuerySchema) {}
export class ReportResultDto extends createZodDto(reportResultSchema) {}
export class SafetyResultDto extends createZodDto(safetyResultSchema) {}

export type SearchQueryInput = z.infer<typeof searchQuerySchema>;
export type ReportResultInput = z.infer<typeof reportResultSchema>;
export type SafetyResultInput = z.infer<typeof safetyResultSchema>;
