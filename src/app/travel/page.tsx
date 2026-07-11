'use client';
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import styles from './page.module.css';

interface TravelAdvice {
  safeToTravel: boolean;
  recommendation: string;
  weatherSummary: string;
  risks: string[];
  alternatePlan: string;
}

export default function TravelAdvisor() {
  const [destination, setDestination] = useState('');
  const [loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState<TravelAdvice | null>(null);
  const [error, setError] = useState('');
  const [resolvedLocation, setResolvedLocation] = useState('');

  const handleAnalyze = async () => {
    if (!destination.trim()) return;
    setLoading(true);
    setError('');
    setAdvice(null);
    
    try {
      const res = await fetch('/api/travel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destination })
      });
      const data = await res.json();
      
      if (res.ok) {
        setAdvice(data.advice);
        setResolvedLocation(data.location);
      } else {
        setError(data.error || 'Failed to analyze route');
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
        <h2>Travel Advisor</h2>
        <p>Predict road conditions and safety before you travel during the monsoon.</p>
      </div>

      <div className={styles.inputSection}>
        <div className={styles.inputGroup}>
          <label>Destination City</label>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Input 
              placeholder="e.g. Pune, Mumbai, Goa" 
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
            />
            <Button onClick={handleAnalyze} isLoading={loading}>Analyze Route</Button>
          </div>
        </div>
        {error && <p className={styles.errorText}>{error}</p>}
      </div>

      {advice && (
        <div className={styles.results}>
          <Card variant={advice.safeToTravel ? 'default' : 'alert'}>
            <CardHeader>
              <CardTitle>Analysis for {resolvedLocation}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={styles.adviceHeader}>
                <span className={`${styles.badge} ${advice.safeToTravel ? styles.safe : styles.unsafe}`}>
                  {advice.recommendation}
                </span>
              </div>
              <p className={styles.summary}>{advice.weatherSummary}</p>
              
              <div className={styles.risksSection}>
                <h4>Identified Risks</h4>
                <ul>
                  {advice.risks.map((risk, idx) => (
                    <li key={idx}>⚠️ {risk}</li>
                  ))}
                </ul>
              </div>

              <div className={styles.alternatePlan}>
                <h4>Alternate Plan</h4>
                <p>{advice.alternatePlan}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </main>
  );
}
