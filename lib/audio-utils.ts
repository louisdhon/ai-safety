export const validateAudioBlob = (blob: Blob): boolean => {
  const ALLOWED_TYPES = ['audio/webm', 'audio/wav', 'audio/mp3', 'audio/ogg'];
  const MAX_SIZE = 10 * 1024 * 1024; // 10MB

  if (!ALLOWED_TYPES.some(type => blob.type.startsWith(type))) {
    throw new Error('Invalid audio format. Please use a supported format.');
  }

  if (blob.size > MAX_SIZE) {
    throw new Error('Audio file too large. Maximum size is 10MB.');
  }

  if (blob.size === 0) {
    throw new Error('Audio recording is empty. Please try again.');
  }

  return true;
};

export const formatAudioDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const getAudioMimeType = (): string => {
  const types = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/ogg;codecs=opus',
    'audio/wav',
  ];

  for (const type of types) {
    if (MediaRecorder.isTypeSupported(type)) {
      return type;
    }
  }

  throw new Error('No supported audio format found in this browser');
};

export const getSupportedConstraints = () => {
  const constraints: MediaTrackConstraints = {};
  const supported = navigator.mediaDevices.getSupportedConstraints();

  // Add supported constraints
  if (supported.sampleRate) {
    constraints.sampleRate = { ideal: 16000 };
  }
  if (supported.channelCount) {
    constraints.channelCount = { ideal: 1 };
  }
  if (supported.echoCancellation) {
    constraints.echoCancellation = { ideal: true };
  }
  if (supported.noiseSuppression) {
    constraints.noiseSuppression = { ideal: true };
  }
  if (supported.autoGainControl) {
    constraints.autoGainControl = { ideal: true };
  }

  return constraints;
};