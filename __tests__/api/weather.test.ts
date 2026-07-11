import { fetchLiveWeather } from '@/lib/weather';

global.fetch = jest.fn();

describe('Weather API Integration', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully fetch weather data for given coordinates', async () => {
    const mockResponse = {
      current: {
        temperature_2m: 28,
        precipitation: 5.5,
        wind_speed_10m: 15,
      },
      hourly: {
        precipitation_probability: [80, 90, 100],
      }
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const weather = await fetchLiveWeather(19.0760, 72.8777);
    
    expect(weather).not.toBeNull();
    expect(weather?.current.temperature_2m).toBe(28);
    expect(weather?.hourly.precipitation_probability.length).toBeGreaterThan(0);
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('should handle network failures gracefully', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network Error'));

    const weather = await fetchLiveWeather(19.0760, 72.8777);
    
    expect(weather).toBeNull();
  });
});
