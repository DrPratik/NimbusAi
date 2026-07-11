import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { lat, lon, category } = await req.json();

    if (!lat || !lon) {
      return NextResponse.json({ error: 'Location coordinates are required' }, { status: 400 });
    }

    const apiKey = process.env.GEOAPIFY_API_KEY || "aa457c3cc50246d6aef5ab3784b3201a";
    
    // Map our simple categories to Geoapify categories
    let geoapifyCategory = 'healthcare.hospital';
    if (category === 'Police') geoapifyCategory = 'service.police';
    if (category === 'Shelter') geoapifyCategory = 'service.social_facility.shelter';

    // filter=circle:lon,lat,radiusMeters
    const url = `https://api.geoapify.com/v2/places?categories=${geoapifyCategory}&filter=circle:${lon},${lat},5000&limit=10&apiKey=${apiKey}`;
    
    const response = await fetch(url);
    const data = await response.json();

    if (!data.features) {
      return NextResponse.json({ error: 'Failed to fetch places' }, { status: 500 });
    }

    const places = data.features.map((feature: any) => ({
      name: feature.properties.name || 'Unnamed Facility',
      address: feature.properties.address_line2 || feature.properties.street || 'Address unavailable',
      distance: feature.properties.distance,
      lat: feature.properties.lat,
      lon: feature.properties.lon,
    }));

    // Sort by distance
    places.sort((a: any, b: any) => a.distance - b.distance);

    return NextResponse.json({ places }, { status: 200 });
  } catch (error) {
    console.error('Services API Error:', error);
    return NextResponse.json({ error: 'Failed to find nearby services' }, { status: 500 });
  }
}
