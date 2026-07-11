'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import styles from './page.module.css';

interface Place {
  name: string;
  address: string;
  distance: number;
  lat: number;
  lon: number;
}

export default function EmergencyServices() {
  const [activeCategory, setActiveCategory] = useState<'Hospital' | 'Police' | 'Shelter'>('Hospital');
  const [loading, setLoading] = useState(false);
  const [places, setPlaces] = useState<Place[]>([]);
  const [error, setError] = useState('');
  
  const [userLoc, setUserLoc] = useState<{lat: number, lon: number} | null>(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLoc({ lat: position.coords.latitude, lon: position.coords.longitude });
        },
        (err) => {
          setError('Location access denied. Please allow location access to find nearby services.');
        }
      );
    } else {
      setError('Geolocation not supported by browser.');
    }
  }, []);

  useEffect(() => {
    if (userLoc) {
      fetchServices();
    }
  }, [userLoc, activeCategory]);

  const fetchServices = async () => {
    if (!userLoc) return;
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lat: userLoc.lat, lon: userLoc.lon, category: activeCategory })
      });
      
      const data = await res.json();
      if (res.ok) {
        setPlaces(data.places);
      } else {
        setError(data.error || 'Failed to find services.');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.hero}>
        <h2>Nearby Emergency Services</h2>
        <p>Locate hospitals, police stations, and relief shelters strictly within a 5km radius.</p>
      </div>

      <div className={styles.categoryFilters}>
        <Button 
          variant={activeCategory === 'Hospital' ? 'primary' : 'outline'}
          onClick={() => setActiveCategory('Hospital')}
        >🏥 Hospitals</Button>
        <Button 
          variant={activeCategory === 'Police' ? 'primary' : 'outline'}
          onClick={() => setActiveCategory('Police')}
        >🚓 Police Stations</Button>
        <Button 
          variant={activeCategory === 'Shelter' ? 'primary' : 'outline'}
          onClick={() => setActiveCategory('Shelter')}
        >⛺ Relief Shelters</Button>
      </div>

      {error && <p className={styles.errorText}>{error}</p>}

      {loading ? (
        <div className={styles.loadingState}>Scanning area via Geoapify...</div>
      ) : (
        <div className={styles.placesGrid}>
          {places.length === 0 && !error && userLoc ? (
            <p className={styles.noResults}>No {activeCategory.toLowerCase()}s found within 5km.</p>
          ) : (
            places.map((place, idx) => (
              <Card key={idx} variant="default" className={styles.placeCard}>
                <CardHeader>
                  <CardTitle>{place.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className={styles.address}>{place.address}</p>
                  <div className={styles.meta}>
                    <span className={styles.distance}>📍 {(place.distance / 1000).toFixed(1)} km away</span>
                    <a 
                      href={`https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lon}`} 
                      target="_blank" 
                      rel="noreferrer"
                      className={styles.directionsLink}
                    >
                      Get Directions
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </main>
  );
}
