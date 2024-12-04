import { AUDIO_CONSTANTS } from './constants';
import { validateAudioInput, validateBrowserSupport } from './audio-validation';
import { toast } from '@/components/ui/use-toast';

export interface RecorderConfig {
  onDataAvailable?: (data: Blob) => void;
  onError?: (error: Error) => void;
  onStart?: () => void;
  onStop?: () => void;
}

export class AudioRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private stream: MediaStream | null = null;
  private config: RecorderConfig;

  constructor(config: RecorderConfig) {
    this.config = config;
  }

  public async initialize(): Promise<void> {
    try {
      // Check if already initialized
      if (this.mediaRecorder) {
        return;
      }

      validateBrowserSupport();
      
      const constraints: MediaTrackConstraints = {
        channelCount: { ideal: AUDIO_CONSTANTS.CHANNEL_COUNT },
        sampleRate: { ideal: AUDIO_CONSTANTS.SAMPLE_RATE },
        echoCancellation: { ideal: true },
        noiseSuppression: { ideal: true },
        autoGainControl: { ideal: true },
      };

      this.stream = await navigator.mediaDevices.getUserMedia({ 
        audio: constraints 
      });

      validateAudioInput(this.stream);

      const mimeType = this.getSupportedMimeType();
      this.mediaRecorder = new MediaRecorder(this.stream, {
        mimeType,
        audioBitsPerSecond: 128000,
      });

      this.setupEventHandlers();
    } catch (error) {
      this.handleError(error);
      throw error; // Re-throw to handle in the hook
    }
  }

  public start(): void {
    if (!this.mediaRecorder) {
      const error = new Error('Recorder not initialized');
      this.handleError(error);
      throw error;
    }

    try {
      if (this.mediaRecorder.state === 'inactive') {
        this.mediaRecorder.start();
        this.config.onStart?.();
        toast({
          title: "Recording Started",
          description: "Speak clearly into your microphone",
        });
      }
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  public stop(): void {
    if (!this.mediaRecorder) return;

    try {
      if (this.mediaRecorder.state === 'recording') {
        this.mediaRecorder.stop();
        toast({
          title: "Recording Stopped",
          description: "Processing your audio...",
        });
      }
    } catch (error) {
      this.handleError(error);
    } finally {
      this.cleanup();
    }
  }

  public cleanup(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    this.mediaRecorder = null;
  }

  private setupEventHandlers(): void {
    if (!this.mediaRecorder) return;

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        this.config.onDataAvailable?.(event.data);
      }
    };

    this.mediaRecorder.onerror = (event) => {
      this.handleError(event.error);
    };

    this.mediaRecorder.onstop = () => {
      this.config.onStop?.();
    };
  }

  private getSupportedMimeType(): string {
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
  }

  private handleError(error: unknown): void {
    const message = error instanceof Error ? error.message : String(error);
    this.config.onError?.(new Error(message));
    this.cleanup();
  }
}