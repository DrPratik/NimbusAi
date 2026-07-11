import { NextResponse } from 'next/server';
import { generateActionableRecommendation } from '@/lib/gemini';

export async function POST(req: Request) {
  try {
    const { message, context } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // System prompt defining the AI Assistant's persona
    const systemPrompt = `
      You are the Emergency Assistant for NimbusAI (Monsoon Guardian).
      The user is facing a potential or active monsoon-related issue.
      You must respond strictly with:
      1. Immediate safety steps.
      2. Safety warnings.
      3. Emergency contacts if applicable.
      Always end your response with an actionable recommendation.
      Be concise, minimal, and clear. Do not hallucinate data. 
      If you do not know, say "I don't currently have enough verified information."
    `;

    const userContext = `
      User Message: "${message}"
      Additional Context: ${context || 'None'}
    `;

    // Fetch response from Gemini
    const aiResponse = await generateActionableRecommendation(systemPrompt, userContext);

    return NextResponse.json({ reply: aiResponse }, { status: 200 });
  } catch (error) {
    console.error('Assistant API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process request. Please try again.' },
      { status: 500 }
    );
  }
}
