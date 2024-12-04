"use client";

import { Button } from '@/components/ui/button';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { useVoiceInput } from '@/hooks/use-voice-input';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface VoiceInputProps {
  onTranscription: (text: string) => void;
}

export function VoiceInput({ onTranscription }: VoiceInputProps) {
  const { isRecording, isProcessing, startRecording, stopRecording } = 
    useVoiceInput({ onTranscription });

  const buttonLabel = isProcessing 
    ? "Processing audio..." 
    : isRecording 
      ? "Stop recording" 
      : "Start voice input";

  return (
    <div className="flex items-center gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant={isRecording ? "destructive" : "secondary"}
            size="icon"
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isProcessing}
            aria-label={buttonLabel}
            className={cn(
              "transition-all duration-200",
              isRecording && "animate-pulse"
            )}
          >
            {isProcessing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isRecording ? (
              <MicOff className="h-4 w-4" />
            ) : (
              <Mic className="h-4 w-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          {buttonLabel}
        </TooltipContent>
      </Tooltip>
      
      {(isRecording || isProcessing) && (
        <span 
          className={cn(
            "text-sm text-muted-foreground",
            isRecording && "animate-pulse"
          )}
          aria-live="polite"
        >
          {buttonLabel}
        </span>
      )}
    </div>
  );
}