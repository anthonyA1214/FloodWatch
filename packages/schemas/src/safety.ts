import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

const typeEnum = z.enum(['shelter', 'hospital']);

export const createSafetyLocationSchema = z.object({
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
  locationName: z.string(),
  address: z.string(),
  availability: z.string().optional(),
  contactNumber: z.string().optional(),
  description: z.string().optional(),
  type: typeEnum,
});

export const safetyMapPinSchema = z.object({
  id: z.number(),
  latitude: z.number(),
  longitude: z.number(),
  type: typeEnum,
});

export const safetyDetailSchema = z.object({
  id: z.number(),
  latitude: z.number(),
  longitude: z.number(),
  type: typeEnum,
  location: z.string(),
  address: z.string(),
  description: z.string().nullable(),
  availability: z.string().nullable(),
  contactNumber: z.string().nullable(),
  image: z.string().nullable(),
  createdAt: z.date(),
});

export const safetyListItem = z.object({
  id: z.number(),
  location: z.string(),
  address: z.string(),
  type: typeEnum,
  availability: z.string(),
});

export const safetyLocationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  type: typeEnum.optional(),
  q: z.string().optional(),
});

export const safetyLocationListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  types: z.preprocess(
    (val) => (typeof val === 'string' ? [val] : val),
    z.array(typeEnum).optional(),
  ),
  q: z.string().optional(),
});

export class CreateSafetyLocationDto extends createZodDto(
  createSafetyLocationSchema,
) {}
export class SafetyMapPinDto extends createZodDto(safetyMapPinSchema) {}
export class SafetyDetailDto extends createZodDto(safetyDetailSchema) {}
export class SafetyListItemDto extends createZodDto(safetyListItem) {}
export class SafetyLocationQueryDto extends createZodDto(
  safetyLocationQuerySchema,
) {}
export class SafetyLocationListQueryDto extends createZodDto(
  safetyLocationListQuerySchema,
) {}

export type CreateSafetyLocationInput = z.infer<
  typeof createSafetyLocationSchema
>;
export type SafetyMapPinInput = z.infer<typeof safetyMapPinSchema>;
export type SafetyDetailInput = z.infer<typeof safetyDetailSchema>;
export type SafetyListItemInput = z.infer<typeof safetyListItem>;
export type SafetyLocationQueryInput = z.infer<
  typeof safetyLocationQuerySchema
>;
export type SafetyLocationListQueryInput = z.infer<
  typeof safetyLocationListQuerySchema
>;
