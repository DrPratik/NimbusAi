import { NextResponse } from 'next/server';
import { analyzeImageForHazards } from '@/lib/gemini';

export async function POST(req: Request) {
  try {
    const { image } = await req.json();

    if (!image) {
      return NextResponse.json({ error: 'Image is required' }, { status: 400 });
    }

    const systemPrompt = `
      You are NimbusAI's Home Safety Inspector.
      Analyze this image for potential monsoon hazards (e.g. clogged gutters, structural cracks, water pooling, low-lying electricals).
      
      CRITICAL RULE: Never invent hazards that aren't clearly visible. If you are uncertain, state it clearly.
      
      Format the output STRICTLY as a JSON object with this exact structure:
      {
        "hazardsDetected": boolean,
        "summary": "string",
        "hazards": [
          {
            "issue": "string",
            "severity": "High" | "Medium" | "Low",
            "recommendation": "string"
          }
        ],
        "confidenceScore": number // 1-100
      }
    `;

    const rawAiResponse = await analyzeImageForHazards(image, systemPrompt);
    if (!rawAiResponse) throw new Error('No response from Vision AI');
    
    const match = rawAiResponse.match(/\{[\s\S]*\}/);
    if (!match) throw new Error('Failed to parse JSON from Vision AI response');
    const analysis = JSON.parse(match[0]);

    return NextResponse.json({ analysis }, { status: 200 });
  } catch (error) {
    console.error('Inspection API Error:', error);
    return NextResponse.json({ error: 'Failed to analyze image' }, { status: 500 });
  }
}
