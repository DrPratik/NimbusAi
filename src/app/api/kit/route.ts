import { NextResponse } from 'next/server';
import { generateActionableRecommendation } from '@/lib/gemini';

export async function POST(req: Request) {
  try {
    const { adults, children, pets, conditions } = await req.json();

    const systemPrompt = `
      You are NimbusAI's Emergency Kit Generator.
      Based on the user's family composition, generate a personalized monsoon survival kit.
      Format the output STRICTLY as a JSON array of objects.
      Each object must match this interface:
      {
        "category": "string (e.g. Medical, Food, Tools)",
        "item": "string",
        "quantity": "string",
        "priority": "High" | "Medium" | "Low",
        "reason": "string (Why is this needed for their specific profile during a monsoon?)"
      }
      
      Family Profile:
      Adults: ${adults || 1}
      Children/Infants: ${children || 0}
      Pets: ${pets || 'None'}
      Specific Medical Conditions: ${conditions || 'None'}
      
      Keep it practical and specific for floods/power outages.
    `;

    const rawAiResponse = await generateActionableRecommendation(systemPrompt, "Provide JSON array only.");
    if (!rawAiResponse) throw new Error("No response from AI");
    
    const match = rawAiResponse.match(/\[[\s\S]*\]/);
    if (!match) throw new Error("Failed to parse JSON");
    const kitItems = JSON.parse(match[0]);

    return NextResponse.json({ kit: kitItems }, { status: 200 });
  } catch (error) {
    console.error('Kit API Error:', error);
    return NextResponse.json({ error: 'Failed to generate kit' }, { status: 500 });
  }
}
