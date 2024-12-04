import OpenAI from 'openai';
import { env } from './env';

const getOpenAIInstance = () => {
  if (!env.OPENAI_API_KEY) {
    console.error('OpenAI API key not found');
    return null;
  }

  try {
    return new OpenAI({
      apiKey: env.OPENAI_API_KEY,
      dangerouslyAllowBrowser: true,
    });
  } catch (error) {
    console.error('Failed to initialize OpenAI:', error);
    return null;
  }
};

export const openai = getOpenAIInstance();

export async function analyzeIncident(description: string) {
  if (!openai) {
    throw new Error('OpenAI client not initialized. Please check your API key configuration.');
  }

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
    throw new Error('Failed to analyze incident. Please check your OpenAI API key configuration.');
  }
}