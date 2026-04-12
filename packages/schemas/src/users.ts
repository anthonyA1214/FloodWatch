import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const usersSchema = z.object({
  id: z.number(),
  email: z.email(),
  role: z.enum(['admin', 'user']),
  status: z.enum(['active', 'blocked']),
  name: z.string(),
  profilePicture: z.string().optional(),
  homeAddress: z.string().optional(),
  joinDate: z.string(),
});

export const getMeSchema = z.object({
  id: z.number(),
  email: z.email(),
  role: z.enum(['admin', 'user']),
  status: z.enum(['active', 'blocked']),
  firstName: z.string(),
  lastName: z.string(),
  name: z.string().min(1),
  profilePicture: z.string().optional(),
  homeAddress: z.string().optional(),
  createdAt: z.string(),
});

export const updateProfileSchema = z.object({
  firstName: z.string().min(1, 'First name is required.').optional(),
  lastName: z.string().min(1, 'Last name is required.').optional(),
  homeAddress: z.string().optional(),
  profilePicture: z.string().optional(),
});

export const userQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  status: z.enum(['active', 'blocked']).optional(),
  q: z.string().optional(),
});

export const createAdminSchema = z
  .object({
    first_name: z
      .string()
      .refine((val) => val.length > 0, {
        error: 'First name is required.',
        abort: true,
      })
      .max(50, 'First name cannot exceed 50 characters.'),
    last_name: z
      .string()
      .refine((val) => val.length > 0, {
        error: 'Last name is required.',
        abort: true,
      })
      .max(50, 'Last name cannot exceed 50 characters.'),
    home_address: z
      .string()
      .refine((val) => val.length > 0, {
        error: 'Home address is required.',
        abort: true,
      })
      .refine((val) => val.length >= 6, {
        error: 'Home address must be at least 5 characters long.',
        abort: true,
      }),
    email: z.email('Please enter a valid email address.'),
    password: z
      .string()
      .refine((val) => val.length > 0, {
        error: 'Password is required.',
        abort: true,
      })
      .refine((val) => val.length >= 6, {
        error: 'Password must be at least 6 characters long.',
        abort: true,
      }),
    confirm_password: z.string(),
  })
  .refine(
    (data) => {
      return data.confirm_password.length > 0;
    },
    {
      error: 'Confirm password is required.',
      path: ['confirm_password'],
    },
  )
  .refine(
    (data) => {
      if (!data.confirm_password) return true; // skip if empty
      return data.password === data.confirm_password;
    },
    {
      error: 'Passwords do not match.',
      path: ['confirm_password'],
    },
  );

export class UsersDto extends createZodDto(usersSchema) {}
export class GetMeDto extends createZodDto(getMeSchema) {}
export class UpdateProfileDto extends createZodDto(updateProfileSchema) {}
export class UserQueryDto extends createZodDto(userQuerySchema) {}
export class CreateAdminDto extends createZodDto(createAdminSchema) {}

export type UsersInput = z.infer<typeof usersSchema>;
export type GetMeInput = z.infer<typeof getMeSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type UserQueryInput = z.infer<typeof userQuerySchema>;
export type CreateAdminInput = z.infer<typeof createAdminSchema>;
