import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const logInSchema = z.object({
  email: z.email('Please enter a valid email address'),
  password: z
    .string()
    .refine((val) => val.length > 0, {
      error: 'Password is required',
      abort: true,
    })
    .refine((val) => val.length >= 8, {
      error: 'Password must be at least 8 characters long',
      abort: true,
    })
    .refine((val) => /[A-Z]/.test(val), {
      error: 'Password must contain at least one uppercase letter',
      abort: false,
    })
    .refine((val) => /[a-z]/.test(val), {
      error: 'Password must contain at least one lowercase letter',
      abort: false,
    })
    .refine((val) => /\d/.test(val), {
      error: 'Password must contain at least one number',
      abort: false,
    })
    .refine((val) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(val), {
      error: 'Password must contain at least one special character',
      abort: false,
    }),
});

export const signUpSchema = z
  .object({
    first_name: z
      .string()
      .refine((val) => val.length > 0, {
        error: 'First name is required',
        abort: true,
      })
      .max(50, 'First name cannot exceed 50 characters'),
    last_name: z
      .string()
      .refine((val) => val.length > 0, {
        error: 'Last name is required',
        abort: true,
      })
      .max(50, 'Last name cannot exceed 50 characters'),
    home_address: z
      .string()
      .refine((val) => val.length > 0, {
        error: 'Home address is required',
        abort: true,
      })
      .refine((val) => val.length >= 6, {
        error: 'Home address must be at least 5 characters long',
        abort: true,
      }),
    email: z.email('Please enter a valid email address'),
    password: z
      .string()
      .refine((val) => val.length > 0, {
        error: 'Password is required',
        abort: true,
      })
      .refine((val) => val.length >= 8, {
        error: 'Password must be at least 8 characters long',
        abort: true,
      })
      .refine((val) => /[A-Z]/.test(val), {
        error: 'Password must contain at least one uppercase letter',
        abort: false,
      })
      .refine((val) => /[a-z]/.test(val), {
        error: 'Password must contain at least one lowercase letter',
        abort: false,
      })
      .refine((val) => /\d/.test(val), {
        error: 'Password must contain at least one number',
        abort: false,
      })
      .refine((val) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(val), {
        error: 'Password must contain at least one special character',
        abort: false,
      }),
    confirm_password: z.string('Please confirm your password'),
  })
  .refine((data) => data.password === data.confirm_password, {
    error: 'Passwords do not match',
    path: ['confirm_password'],
  });

export const sendOtpSchema = z.object({
  email: z.email('Please enter a valid email address'),
});

export const verifyOtpSchema = z.object({
  email: z.email('Please enter a valid email address'),
  otp: z
    .string()
    .refine((val) => val.length > 0, {
      error: 'OTP is required',
      abort: true,
    })
    .refine((val) => /^\d{6}$/.test(val), {
      error: 'OTP must be a 6-digit number',
      abort: true,
    }),
});

export const resetPasswordSchema = z
  .object({
    resetSessionId: z.uuid('Invalid reset session ID'),
    new_password: z
      .string()
      .refine((val) => val.length > 0, {
        error: 'New password is required',
        abort: true,
      })
      .refine((val) => val.length >= 8, {
        error: 'New password must be at least 8 characters long',
        abort: true,
      })
      .refine((val) => /[A-Z]/.test(val), {
        error: 'New password must contain at least one uppercase letter',
        abort: false,
      })
      .refine((val) => /[a-z]/.test(val), {
        error: 'New password must contain at least one lowercase letter',
        abort: false,
      })
      .refine((val) => /\d/.test(val), {
        error: 'New password must contain at least one number',
        abort: false,
      })
      .refine((val) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(val), {
        error: 'New password must contain at least one special character',
        abort: false,
      }),
    confirm_new_password: z.string('Please confirm your new password'),
  })
  .refine(
    (data) => {
      return data.confirm_new_password.length > 0;
    },
    {
      error: 'Confirm password is required.',
      path: ['confirm_new_password'],
    },
  )
  .refine(
    (data) => {
      if (!data.confirm_new_password) return true; // skip if empty
      return data.new_password === data.confirm_new_password;
    },
    {
      error: 'Passwords do not match.',
      path: ['confirm_new_password'],
    },
  );

export const resendOtpSchema = z.object({
  email: z.email('Please enter a valid email address'),
});

export const verifyOtpSecureSchema = z.object({
  otp: z
    .string()
    .refine((val) => val.length > 0, {
      error: 'OTP is required',
      abort: true,
    })
    .refine((val) => /^\d{6}$/.test(val), {
      error: 'OTP must be a 6-digit number',
      abort: true,
    }),
});

export const changePasswordSchema = z
  .object({
    resetSessionId: z.uuid('Invalid reset session ID'),
    new_password: z
      .string()
      .refine((val) => val.length > 0, {
        error: 'New password is required',
        abort: true,
      })
      .refine((val) => val.length >= 6, {
        error: 'New password must be at least 6 characters long',
        abort: true,
      }),
    confirm_new_password: z.string('Please confirm your new password'),
  })
  .refine((data) => data.new_password === data.confirm_new_password, {
    error: 'Passwords do not match',
    path: ['confirm_new_password'],
  });

export const setPasswordSchema = z
  .object({
    new_password: z
      .string()
      .refine((val) => val.length > 0, {
        error: 'New password is required',
        abort: true,
      })
      .refine((val) => val.length >= 6, {
        error: 'New password must be at least 6 characters long',
        abort: true,
      }),
    confirm_new_password: z.string('Please confirm your new password'),
  })
  .refine((data) => data.new_password === data.confirm_new_password, {
    error: 'Passwords do not match',
    path: ['confirm_new_password'],
  });

export class LogInDto extends createZodDto(logInSchema) {}
export class SignUpDto extends createZodDto(signUpSchema) {}
export class SendOtpDto extends createZodDto(sendOtpSchema) {}
export class VerifyOtpDto extends createZodDto(verifyOtpSchema) {}
export class ResetPasswordDto extends createZodDto(resetPasswordSchema) {}
export class ResendOtpDto extends createZodDto(resendOtpSchema) {}
export class VerifyOtpSecureDto extends createZodDto(verifyOtpSecureSchema) {}
export class ChangePasswordDto extends createZodDto(changePasswordSchema) {}
export class SetPasswordDto extends createZodDto(setPasswordSchema) {}

export type LogInInput = z.infer<typeof logInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
export type SendOtpInput = z.infer<typeof sendOtpSchema>;
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type ResendOtpInput = z.infer<typeof resendOtpSchema>;
export type VerifyOtpSecureInput = z.infer<typeof verifyOtpSecureSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type SetPasswordInput = z.infer<typeof setPasswordSchema>;
