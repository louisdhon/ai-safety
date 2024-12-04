import { z } from 'zod';

const envSchema = z.object({
  OPENAI_API_KEY: z.string().optional(),
  NEXT_PUBLIC_OPENAI_API_KEY: z.string().optional(),
  MAX_AUDIO_SIZE: z.coerce.number().positive().default(10485760),
  ALLOWED_AUDIO_TYPES: z.string().default('audio/webm,audio/wav,audio/mp3'),
  MAX_RECORDING_DURATION: z.coerce.number().positive().default(60000),
}).refine((data) => {
  // At least one of the API keys must be present
  return Boolean(data.OPENAI_API_KEY || data.NEXT_PUBLIC_OPENAI_API_KEY);
}, {
  message: "Either OPENAI_API_KEY or NEXT_PUBLIC_OPENAI_API_KEY must be provided",
  path: ["OPENAI_API_KEY"],
});

const processEnv = {
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  NEXT_PUBLIC_OPENAI_API_KEY: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  MAX_AUDIO_SIZE: process.env.MAX_AUDIO_SIZE,
  ALLOWED_AUDIO_TYPES: process.env.ALLOWED_AUDIO_TYPES,
  MAX_RECORDING_DURATION: process.env.MAX_RECORDING_DURATION,
};

const parsed = envSchema.safeParse(processEnv);

if (!parsed.success) {
  if (process.env.NODE_ENV === 'development') {
    console.error('❌ Invalid environment variables:', parsed.error.format());
  }
  throw new Error('Missing OpenAI API key. Please add OPENAI_API_KEY or NEXT_PUBLIC_OPENAI_API_KEY to your .env.local file');
}

export const env = {
  ...parsed.data,
  // Use NEXT_PUBLIC_OPENAI_API_KEY as fallback for OPENAI_API_KEY
  OPENAI_API_KEY: parsed.data.OPENAI_API_KEY || parsed.data.NEXT_PUBLIC_OPENAI_API_KEY,
};