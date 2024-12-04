"use client";

import { toast } from '@/components/ui/use-toast';
import { validateAudioBlob, getAudioMimeType, getSupportedConstraints } from './audio-utils';
import { ERROR_MESSAGES, AUDIO_CONSTANTS } from './constants';

export interface AudioServiceResponse {
  success: boolean;
  text?: string;
  error?: string;
}

export class AudioService {
  private mediaRecorder: MediaRecorder | null = null;
  private chunks: Blob[] = [];
  private stream: MediaStream | null = null;
  private recordingTimeout: NodeJS.Timeout | null = null;

  public async startRecording(): Promise<boolean> {
    try {
      await this.validateBrowserSupport();
      await this.setupMediaRecorder();
      this.startRecordingTimer();
      return true;
    } catch (error) {
      this.handleError('Failed to start recording', error);
      return false;
    }
  }

  private async validateBrowserSupport(): Promise<void> {
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error(ERROR_MESSAGES.BROWSER_SUPPORT);
    }

    if (!MediaRecorder.isTypeSupported(getAudioMimeType())) {
      throw new Error(ERROR_MESSAGES.FORMAT_SUPPORT);
    }
  }

  private async setupMediaRecorder(): Promise<void> {
    const constraints = getSupportedConstraints();
    this.stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        ...constraints,
        channelCount: { ideal: AUDIO_CONSTANTS.CHANNEL_COUNT },
        sampleRate: { ideal: AUDIO_CONSTANTS.SAMPLE_RATE },
        echoCancellation: { ideal: true },
        noiseSuppression: { ideal: true },
      }
    });

    this.mediaRecorder = new MediaRecorder(this.stream, {
      mimeType: getAudioMimeType(),
      audioBitsPerSecond: 128000
    });

    this.chunks = [];
    this.setupRecordingHandlers();
    this.mediaRecorder.start();
  }

  private startRecordingTimer(): void {
    this.recordingTimeout = setTimeout(() => {
      if (this.mediaRecorder?.state === 'recording') {
        this.stopRecording();
        toast({
          title: "Recording Stopped",
          description: `Maximum recording duration reached (${AUDIO_CONSTANTS.MAX_DURATION / 1000} seconds)`
        });
      }
    }, AUDIO_CONSTANTS.MAX_DURATION);
  }

  public stopRecording(): void {
    try {
      if (this.mediaRecorder?.state === 'recording') {
        this.mediaRecorder.stop();
      }
    } catch (error) {
      this.handleError('Error stopping recording', error);
    } finally {
      this.cleanup();
    }
  }

  public async processRecording(): Promise<AudioServiceResponse> {
    try {
      if (this.chunks.length === 0) {
        throw new Error(ERROR_MESSAGES.NO_AUDIO_DATA);
      }

      const audioBlob = new Blob(this.chunks, { type: getAudioMimeType() });
      validateAudioBlob(audioBlob);

      const formData = new FormData();
      formData.append('file', audioBlob, 'audio.webm');

      const uploadResponse = await this.uploadAudio(formData);
      const transcription = await this.transcribeAudio(uploadResponse.path);

      return { success: true, text: transcription.text };
    } catch (error) {
      return this.handleProcessingError(error);
    } finally {
      this.chunks = [];
    }
  }

  private async uploadAudio(formData: FormData): Promise<{ path: string }> {
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || ERROR_MESSAGES.UPLOAD_FAILED);
    }

    return response.json();
  }

  private async transcribeAudio(path: string): Promise<{ text: string }> {
    const response = await fetch('/api/transcribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || ERROR_MESSAGES.TRANSCRIPTION_FAILED);
    }

    const result = await response.json();
    if (!result.text || typeof result.text !== 'string') {
      throw new Error(ERROR_MESSAGES.TRANSCRIPTION_FAILED);
    }

    return result;
  }

  private cleanup(): void {
    if (this.recordingTimeout) {
      clearTimeout(this.recordingTimeout);
      this.recordingTimeout = null;
    }

    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }

    this.mediaRecorder = null;
  }

  private setupRecordingHandlers(): void {
    if (!this.mediaRecorder) return;

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        this.chunks.push(event.data);
      }
    };

    this.mediaRecorder.onerror = (event) => {
      this.handleError('Recording error', event.error);
    };

    this.mediaRecorder.onstart = () => {
      toast({
        title: "Recording Started",
        description: "Speak clearly into your microphone"
      });
    };

    this.mediaRecorder.onstop = () => {
      this.cleanup();
    };
  }

  private handleError(context: string, error: unknown): void {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`${context}:`, error);
    toast({
      title: "Recording Error",
      description: message,
      variant: "destructive"
    });
    this.cleanup();
  }

  private handleProcessingError(error: unknown): AudioServiceResponse {
    const message = error instanceof Error ? error.message : ERROR_MESSAGES.TRANSCRIPTION_FAILED;
    return { success: false, error: message };
  }
}