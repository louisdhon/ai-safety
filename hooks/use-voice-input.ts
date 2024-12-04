"use client";

import { useState, useRef, useCallback } from 'react';
import { toast } from '@/components/ui/use-toast';
import { AudioRecorder } from '@/lib/audio-recorder';
import { validateAudioOutput } from '@/lib/audio-validation';
import { ERROR_MESSAGES, AUDIO_CONSTANTS } from '@/lib/constants';

interface UseVoiceInputProps {
  onTranscription: (text: string) => void;
}

export function useVoiceInput({ onTranscription }: UseVoiceInputProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const recorderRef = useRef<AudioRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleError = useCallback((error: Error) => {
    const message = error.message;
    
    if (message.includes('Permission denied')) {
      toast({
        title: "Permission Error",
        description: ERROR_MESSAGES.PERMISSION_DENIED,
        variant: "destructive",
      });
    } else if (message.includes('Requested device not found')) {
      toast({
        title: "Device Error",
        description: ERROR_MESSAGES.DEVICE_NOT_FOUND,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Recording Error",
        description: message,
        variant: "destructive",
      });
    }

    setIsRecording(false);
    setIsProcessing(false);
  }, []);

  const startRecording = useCallback(async () => {
    if (isRecording || isProcessing) return;

    try {
      chunksRef.current = [];
      
      if (!recorderRef.current) {
        recorderRef.current = new AudioRecorder({
          onDataAvailable: (data) => {
            chunksRef.current.push(data);
          },
          onError: handleError,
          onStart: () => {
            setIsRecording(true);
          },
          onStop: () => {
            setIsRecording(false);
            processRecording();
          },
        });
      }

      await recorderRef.current.initialize();
      recorderRef.current.start();

      // Set recording timeout
      timeoutRef.current = setTimeout(() => {
        if (recorderRef.current) {
          recorderRef.current.stop();
          toast({
            title: "Recording Stopped",
            description: `Maximum duration reached (${AUDIO_CONSTANTS.MAX_DURATION / 1000} seconds)`,
          });
        }
      }, AUDIO_CONSTANTS.MAX_DURATION);

    } catch (error) {
      handleError(error instanceof Error ? error : new Error(String(error)));
    }
  }, [isRecording, isProcessing, handleError]);

  const stopRecording = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (recorderRef.current) {
      recorderRef.current.stop();
    }
  }, []);

  const processRecording = async () => {
    if (chunksRef.current.length === 0) return;

    try {
      setIsProcessing(true);

      const audioBlob = new Blob(chunksRef.current, { 
        type: 'audio/webm' 
      });

      validateAudioOutput(audioBlob);

      const formData = new FormData();
      formData.append('file', audioBlob, 'audio.webm');

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error(ERROR_MESSAGES.UPLOAD_FAILED);
      }

      const { path } = await uploadResponse.json();

      const transcribeResponse = await fetch('/api/transcribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path }),
      });

      if (!transcribeResponse.ok) {
        throw new Error(ERROR_MESSAGES.TRANSCRIPTION_FAILED);
      }

      const { text } = await transcribeResponse.json();
      
      if (text) {
        onTranscription(text);
        toast({
          title: "Transcription Complete",
          description: "Your speech has been converted to text.",
        });
      }
    } catch (error) {
      handleError(error instanceof Error ? error : new Error(String(error)));
    } finally {
      setIsProcessing(false);
      chunksRef.current = [];
    }
  };

  return {
    isRecording,
    isProcessing,
    startRecording,
    stopRecording,
  };
}