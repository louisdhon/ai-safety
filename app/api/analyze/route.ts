import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { description } = await req.json();

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

    return NextResponse.json(JSON.parse(response.choices[0].message.content));
  } catch (error) {
    console.error('Error analyzing incident:', error);
    return NextResponse.json(
      { error: 'Failed to analyze incident' },
      { status: 500 }
    );
  }
}