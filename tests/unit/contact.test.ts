import { describe, it, expect } from 'vitest';
import { contactSchema } from '../../src/lib/contactSchema';

describe('Contact Form Validation (Zod Schema)', () => {
  it('passes on valid input', () => {
    const validData = {
      name: 'John Doe',
      email: 'john@example.com',
      message: 'Hello, this is a valid inquiry message with enough characters.',
    };
    const result = contactSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('fails if name is too short', () => {
    const data = {
      name: 'A',
      email: 'john@example.com',
      message: 'Hello, this is a valid message.',
    };
    const result = contactSchema.safeParse(data);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toMatch(/too short/i);
    }
  });

  it('fails if name exceeds 80 characters', () => {
    const data = {
      name: 'A'.repeat(81),
      email: 'john@example.com',
      message: 'Hello, this is a valid message.',
    };
    const result = contactSchema.safeParse(data);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toMatch(/cannot exceed 80 characters/i);
    }
  });

  it('fails on invalid email format', () => {
    const invalidEmails = ['plainaddress', 'missingat.com', 'user@.com', 'user@domain'];
    for (const email of invalidEmails) {
      const result = contactSchema.safeParse({
        name: 'John Doe',
        email,
        message: 'Hello, this is a valid message.',
      });
      expect(result.success).toBe(false);
    }
  });

  it('fails if email exceeds 120 characters', () => {
    const data = {
      name: 'John Doe',
      email: 'a'.repeat(110) + '@example.com',
      message: 'Hello, this is a valid message.',
    };
    const result = contactSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it('fails if message is shorter than 10 characters', () => {
    const data = {
      name: 'John Doe',
      email: 'john@example.com',
      message: 'Short',
    };
    const result = contactSchema.safeParse(data);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toMatch(/at least 10 characters/i);
    }
  });

  it('fails if message exceeds 2000 characters', () => {
    const data = {
      name: 'John Doe',
      email: 'john@example.com',
      message: 'M'.repeat(2001),
    };
    const result = contactSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it('fails honeypot bot detection when botField is populated', () => {
    const botData = {
      name: 'Spam Bot',
      email: 'bot@spam.com',
      message: 'Spam message text over 10 chars',
      botField: 'I am a bot filling hidden fields',
    };
    const result = contactSchema.safeParse(botData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toMatch(/Bot detected/i);
    }
  });

  it('trims leading and trailing whitespace', () => {
    const data = {
      name: '  Jane Doe  ',
      email: '  jane@example.com  ',
      message: '   Valid message text with spaces at ends   ',
    };
    const result = contactSchema.safeParse(data);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe('Jane Doe');
      expect(result.data.email).toBe('jane@example.com');
      expect(result.data.message).toBe('Valid message text with spaces at ends');
    }
  });
});
