import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const typeEnum = z.enum(['shelter', 'hospital']);

export const createSafetyLocationSchema = z.object({
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
  locationName: z.string().refine((val) => val.length > 0, {
    error: 'Location name is required.',
  }),
  address: z.string().refine((val) => val.length > 0, {
    error: 'Address is required.',
  }),
  availability: z.string().optional(),
  contactNumber: z.string().optional(),
  description: z.string().optional(),
  type: typeEnum,
});

export const safetyLocationMapPinSchema = z.object({
  id: z.number(),
  latitude: z.number(),
  longitude: z.number(),
  type: typeEnum,
});

export const safetyLocationSchema = z.object({
  id: z.number(),
  location: z.string(),
  address: z.string(),
  type: typeEnum,
});

export const safetyLocationDetailSchema = safetyLocationSchema.extend({
  latitude: z.number(),
  longitude: z.number(),
  description: z.string().nullable(),
  availability: z.string().nullable(),
  contactNumber: z.string().nullable(),
  image: z.string().nullable(),
  createdAt: z.date(),
});

export const safetyLocationListItemSchema = z.object({
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

export const updateSafetyLocationSchema = createSafetyLocationSchema.extend({
  removeImage: z
    .literal('true')
    .transform(() => true)
    .optional(),
});

export const recentSafetyLocationsSchema = safetyLocationListItemSchema;

export class CreateSafetyLocationDto extends createZodDto(
  createSafetyLocationSchema,
) {}
export class SafetyLocationMapPinDto extends createZodDto(
  safetyLocationMapPinSchema,
) {}
export class SafetyLocationDto extends createZodDto(safetyLocationSchema) {}
export class SafetyLocationDetailDto extends createZodDto(
  safetyLocationDetailSchema,
) {}
export class SafetyLocationListItemDto extends createZodDto(
  safetyLocationListItemSchema,
) {}
export class SafetyLocationQueryDto extends createZodDto(
  safetyLocationQuerySchema,
) {}
export class SafetyLocationListQueryDto extends createZodDto(
  safetyLocationListQuerySchema,
) {}
export class UpdateSafetyLocationDto extends createZodDto(
  updateSafetyLocationSchema,
) {}
export class RecentSafetyLocationsDto extends createZodDto(
  recentSafetyLocationsSchema,
) {}

export type CreateSafetyLocationInput = z.infer<
  typeof createSafetyLocationSchema
>;
export type SafetyLocationMapPinInput = z.infer<
  typeof safetyLocationMapPinSchema
>;
export type SafetyLocationInput = z.infer<typeof safetyLocationSchema>;
export type SafetyLocationDetailInput = z.infer<
  typeof safetyLocationDetailSchema
>;
export type SafetyLocationListItemInput = z.infer<
  typeof safetyLocationListItemSchema
>;
export type SafetyLocationQueryInput = z.infer<
  typeof safetyLocationQuerySchema
>;
export type SafetyLocationListQueryInput = z.infer<
  typeof safetyLocationListQuerySchema
>;
export type UpdateSafetyLocationInput = z.infer<
  typeof updateSafetyLocationSchema
>;
export type RecentSafetyLocationsInput = z.infer<
  typeof recentSafetyLocationsSchema
>;
