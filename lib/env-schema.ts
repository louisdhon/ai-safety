import { z } from 'zod';

export const envSchema = z.object({
  OPENAI_API_KEY: z.string().min(1, 'OpenAI API Key is required'),
  MAX_AUDIO_SIZE: z.coerce.number().positive(),
  ALLOWED_AUDIO_TYPES: z.string().transform(val => val.split(',')),
  MAX_RECORDING_DURATION: z.coerce.number().positive(),
});

export type EnvSchema = z.infer<typeof envSchema>;