// lib/validations/newsletter.ts
import { z } from 'zod';

export const newsletterSchema = z.object({
  email: z.string()
    .email('Please enter a valid email address')
    .min(1, 'Email is required')
    .max(100, 'Email must be less than 100 characters')
    .transform(email => email.toLowerCase().trim())
});

export type NewsletterFormData = z.infer<typeof newsletterSchema>;