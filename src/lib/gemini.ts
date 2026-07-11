import { GoogleGenAI } from "@google/genai";

// Lazy initialization pattern — the client is only created when first needed at runtime.
// This prevents the build-time crash when environment variables aren't yet injected
// (e.g., during Docker `npm run build` on Render).
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (aiClient) return aiClient;
  
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY environment variable. Please set it in your deployment environment.");
  }
  
  aiClient = new GoogleGenAI({ apiKey });
  return aiClient;
}

/**
 * Executes a prompt against Gemini Flash-Lite ensuring strict constraints
 * as required by the Master Development Context (no hallucinations, actionable outputs).
 */
export async function generateActionableRecommendation(systemPrompt: string, userContext: string) {
  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-lite",
      contents: [
        {
          role: "user",
          parts: [{ text: `${systemPrompt}\n\nContext:\n${userContext}` }]
        }
      ],
      config: {
        temperature: 0.1, 
        systemInstruction: "You are NimbusAI (Monsoon Guardian). You MUST end every response with actionable recommendations. If data is unavailable, say 'I don't currently have enough verified information.' Never hallucinate.",
      }
    });
    
    return response.text;
  } catch (error) {
    console.error("AI Generation Error:", error);
    throw new Error("Failed to generate AI recommendation. Please try again.");
  }
}

/**
 * Multimodal analysis for Home Safety Inspection (Feature 6).
 */
export async function analyzeImageForHazards(base64Image: string, systemPrompt: string) {
  try {
    const ai = getAiClient();
    // Strip the data:image prefix if present
    const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg);base64,/, "");
    
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-lite",
      contents: [
        {
          role: "user",
          parts: [
            { text: systemPrompt },
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: cleanBase64
              }
            }
          ]
        }
      ],
      config: {
        temperature: 0.1,
      }
    });
    
    return response.text;
  } catch (error) {
    console.error("Vision AI Error:", error);
    throw new Error("Failed to analyze image.");
  }
}
