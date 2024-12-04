import { AUDIO_CONSTANTS, ERROR_MESSAGES } from './constants';
import { env } from './env';

export const validateAudioInput = (stream: MediaStream): void => {
  const track = stream.getAudioTracks()[0];
  if (!track) {
    throw new Error(ERROR_MESSAGES.DEVICE_NOT_FOUND);
  }

  const settings = track.getSettings();
  if (!settings.deviceId) {
    throw new Error(ERROR_MESSAGES.DEVICE_NOT_FOUND);
  }
};

export const validateAudioOutput = (blob: Blob): void => {
  if (!blob) {
    throw new Error(ERROR_MESSAGES.NO_AUDIO_DATA);
  }

  if (blob.size === 0) {
    throw new Error(ERROR_MESSAGES.EMPTY_RECORDING);
  }

  if (blob.size > env.MAX_AUDIO_SIZE) {
    throw new Error(ERROR_MESSAGES.FILE_TOO_LARGE);
  }

  if (!env.ALLOWED_AUDIO_TYPES.some(type => blob.type.startsWith(type))) {
    throw new Error(ERROR_MESSAGES.INVALID_FORMAT);
  }
};

export const validateBrowserSupport = (): void => {
  if (!navigator?.mediaDevices?.getUserMedia) {
    throw new Error(ERROR_MESSAGES.BROWSER_SUPPORT);
  }

  if (!window.MediaRecorder) {
    throw new Error(ERROR_MESSAGES.BROWSER_SUPPORT);
  }
};