/**
 * Utility for fetching real-time weather data from Open-Meteo API
 */

export interface WeatherData {
  current: {
    temperature_2m: number;
    wind_speed_10m: number;
    precipitation: number;
    weather_code: number;
  };
  hourly: {
    time: string[];
    precipitation_probability: number[];
  };
}

export async function fetchLiveWeather(lat: number, lon: number): Promise<WeatherData | null> {
  try {
    // Open-Meteo API with best_match high-resolution models
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m,precipitation,weather_code&hourly=precipitation_probability&models=best_match&timezone=auto`;
    
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`Open-Meteo API error: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch live weather:", error);
    return null;
  }
}
