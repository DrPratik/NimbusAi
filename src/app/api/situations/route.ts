import { NextResponse } from 'next/server';
import { fetchLiveWeather } from '@/lib/weather';
import { generateActionableRecommendation } from '@/lib/gemini';
import { logger } from '@/lib/logger';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const latStr = searchParams.get('lat');
    const lonStr = searchParams.get('lon');
    
    // Default to Mumbai if no coordinates are provided
    const lat = latStr ? parseFloat(latStr) : 19.0760;
    const lon = lonStr ? parseFloat(lonStr) : 72.8777;

    const weather = await fetchLiveWeather(lat, lon);
    
    if (!weather) {
      logger.error({ lat, lon }, "Failed to fetch weather data from Open-Meteo");
      return NextResponse.json({ error: 'Failed to fetch weather data' }, { status: 500 });
    }

    // Structured logging of weather payload
    logger.info({ 
      location: { lat, lon },
      weather: weather.current 
    }, "Successfully fetched Open-Meteo weather data");

    const systemPrompt = `
      You are NimbusAI, a specialized Monsoon Guardian and Emergency Preparedness AI.
      Your ONLY purpose is to help users prepare for, survive, and recover from monsoon season, severe storms, and floods.
      
      Based on the following live weather data from Open-Meteo, generate 3 priority action cards.
      
      CRITICAL RULE: NEVER give generic summer/heat advice (like hydration or heat management). 
      If the current weather is dry and hot (0mm precipitation), you MUST frame the actions as PRE-MONSOON preparation (e.g. "Use this dry day to inspect roof leaks", "Clear your gutters before the rains arrive", "Stock up on emergency supplies"). 
      If it is raining, give active monsoon safety advice (e.g. "Avoid waterlogged roads", "Move vehicle to higher ground").
      
      Format the output STRICTLY as a JSON array of objects, with NO markdown formatting.
      Each object must match this interface:
      {
        "id": number,
        "title": string,
        "priority": "High" | "Medium" | "Low",
        "timeSensitivity": string,
        "why": string,
        "impact": string,
        "variant": "alert" | "warning" | "default"
      }
      
      Weather Context:
      Temperature: ${weather.current.temperature_2m}°C
      Wind Speed: ${weather.current.wind_speed_10m} km/h
      Current Precipitation: ${weather.current.precipitation} mm
      Precipitation Probability (next few hours): ${weather.hourly.precipitation_probability.slice(0, 3).join(', ')}%
    `;

    const rawAiResponse = await generateActionableRecommendation(systemPrompt, "Provide JSON only.");
    
    // Extract JSON array robustly using Regex in case Gemini includes conversational text
    const match = rawAiResponse.match(/\[[\s\S]*\]/);
    if (!match) {
      throw new Error("Failed to parse JSON from AI response: " + rawAiResponse);
    }
    const cards = JSON.parse(match[0]);

    return NextResponse.json({ cards, weather }, { status: 200 });
  } catch (error) {
    console.error('Situations API Error:', error);
    return NextResponse.json({ error: 'Failed to generate situations' }, { status: 500 });
  }
}
