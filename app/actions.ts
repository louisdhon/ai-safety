"use server";

import { openai } from '@/lib/openai';

export async function analyzeIncidentAction(description: string) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a safety incident analysis expert. Analyze the incident description and provide: 1) Incident type classification 2) Severity level 3) Key risk factors 4) Recommended immediate actions. Format as JSON.",
        },
        {
          role: "user",
          content: description,
        },
      ],
      response_format: { type: "json_object" },
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error('Error analyzing incident:', error);
    throw new Error('Failed to analyze incident');
  }
}

export async function transcribeAudioAction(audioBlob: Blob) {
  try {
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.webm');
    formData.append('model', 'whisper-1');

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Transcription failed');
    }

    const data = await response.json();
    return { text: data.text };
  } catch (error) {
    console.error('Error transcribing audio:', error);
    throw new Error('Failed to transcribe audio');
  }
}