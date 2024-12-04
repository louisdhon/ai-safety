import { createReadStream } from 'fs';
import { unlink } from 'fs/promises';
import { existsSync } from 'fs';
import { openai } from '@/lib/openai';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { path } = await req.json();

    if (!path) {
      return NextResponse.json(
        { error: 'No audio file path provided' },
        { status: 400 }
      );
    }

    // Verify file exists
    if (!existsSync(path)) {
      return NextResponse.json(
        { error: 'Audio file not found' },
        { status: 404 }
      );
    }

    const file = createReadStream(path);
    
    try {
      const response = await openai.audio.transcriptions.create({
        file,
        model: 'whisper-1',
        language: 'en',
        response_format: 'json',
      });

      // Clean up the file after successful transcription
      try {
        await unlink(path);
        console.log(`Cleaned up file: ${path}`);
      } catch (cleanupError) {
        console.error(`Failed to clean up file: ${path}`, cleanupError);
      }

      return NextResponse.json({ text: response.text });
    } catch (transcriptionError) {
      console.error('Transcription error:', transcriptionError);
      return NextResponse.json(
        { error: 'Failed to transcribe audio' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}