import { z } from 'zod';

export const settingsSchema = z.object({
  username: z
    .string()
    .transform((val) => val.trim())
    .pipe(
      z
        .string()
        .min(3, 'Username must be at least 3 characters')
        .max(20, 'Username must be at most 20 characters')
        .regex(
          /^[a-zA-Z0-9-]+$/,
          'Username can only contain alphanumeric characters and hyphens'
        )
    ),
  email: z
    .string()
    .transform((val) => val.trim())
    .pipe(
      z
        .string()
        .min(1, 'Email is required')
        .email('Please enter a valid RFC 5322 email address')
    ),
  notifyDigest: z.enum(['daily', 'weekly', 'never'], {
    errorMap: () => ({ message: 'Please select a valid notification frequency' }),
  }),
  marketingOptIn: z.boolean(),
});

export type SettingsFormData = z.infer<typeof settingsSchema>;

export const defaultSettings: SettingsFormData = {
  username: '',
  email: '',
  notifyDigest: 'daily',
  marketingOptIn: false,
};
