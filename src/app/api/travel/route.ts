import { NextResponse } from 'next/server';
import { fetchLiveWeather } from '@/lib/weather';
import { generateActionableRecommendation } from '@/lib/gemini';

async function geocodeCity(city: string) {
  try {
    const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);
    const data = await res.json();
    if (data.results && data.results.length > 0) {
      return { lat: data.results[0].latitude, lon: data.results[0].longitude, name: data.results[0].name };
    }
    return null;
  } catch (err) {
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const { destination } = await req.json();

    if (!destination) {
      return NextResponse.json({ error: 'Destination is required' }, { status: 400 });
    }

    const geo = await geocodeCity(destination);
    if (!geo) {
      return NextResponse.json({ error: 'City not found' }, { status: 404 });
    }

    const weather = await fetchLiveWeather(geo.lat, geo.lon);
    
    if (!weather) {
      return NextResponse.json({ error: 'Failed to fetch weather for destination' }, { status: 500 });
    }

    const systemPrompt = `
      You are NimbusAI's Travel Advisor.
      Evaluate if it is safe to travel to ${geo.name} based on the live weather.
      Format the output STRICTLY as a JSON object with this exact structure:
      {
        "safeToTravel": boolean,
        "recommendation": "string (Proceed, Delay, or Cancel)",
        "weatherSummary": "string (brief summary of conditions)",
        "risks": ["string", "string"],
        "alternatePlan": "string"
      }
      
      Weather at ${geo.name}:
      Temperature: ${weather.current.temperature_2m}°C
      Precipitation: ${weather.current.precipitation} mm
      Precipitation Probability (next few hours): ${weather.hourly.precipitation_probability.slice(0, 3).join(', ')}%
      Wind Speed: ${weather.current.wind_speed_10m} km/h
    `;

    const rawAiResponse = await generateActionableRecommendation(systemPrompt, "Provide JSON only.");
    if (!rawAiResponse) throw new Error('No response from AI');
    
    const match = rawAiResponse.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("Failed to parse JSON");
    const travelAdvice = JSON.parse(match[0]);

    return NextResponse.json({ advice: travelAdvice, location: geo.name }, { status: 200 });
  } catch (error) {
    console.error('Travel API Error:', error);
    return NextResponse.json({ error: 'Failed to analyze travel route' }, { status: 500 });
  }
}
