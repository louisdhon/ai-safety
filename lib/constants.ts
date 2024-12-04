export const AUDIO_CONSTANTS = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: ['audio/webm', 'audio/wav', 'audio/mp3'] as const,
  MAX_DURATION: 60 * 1000, // 60 seconds
  CLEANUP_DELAY: 5 * 60 * 1000, // 5 minutes
  SAMPLE_RATE: 16000,
  CHANNEL_COUNT: 1,
} as const;

export const ERROR_MESSAGES = {
  BROWSER_SUPPORT: 'Audio recording is not supported in this browser',
  FORMAT_SUPPORT: 'No supported audio format found',
  FILE_TOO_LARGE: 'Audio file too large. Maximum size is 10MB',
  EMPTY_RECORDING: 'Audio recording is empty. Please try again',
  INVALID_FORMAT: 'Invalid audio format. Please use a supported format',
  TRANSCRIPTION_FAILED: 'Failed to transcribe audio',
  UPLOAD_FAILED: 'Failed to upload audio file',
  NO_AUDIO_DATA: 'No audio data available',
  PERMISSION_DENIED: 'Microphone access was denied',
  DEVICE_NOT_FOUND: 'No microphone found',
} as const;