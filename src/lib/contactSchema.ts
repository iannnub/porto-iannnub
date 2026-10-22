import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().trim().min(2, 'Name is too short').max(80, 'Name cannot exceed 80 characters'),
  email: z
    .string()
    .trim()
    .email('Invalid email address')
    .max(120, 'Email cannot exceed 120 characters'),
  message: z
    .string()
    .trim()
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message cannot exceed 2000 characters'),
  botField: z.string().max(0, 'Bot detected').optional(),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
