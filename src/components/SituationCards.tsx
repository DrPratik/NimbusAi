'use client';
import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './ui/Card';
import { Button } from './ui/Button';
import styles from '../app/page.module.css';

interface SituationCard {
  id: number;
  title: string;
  priority: string;
  timeSensitivity: string;
  why: string;
  impact: string;
  variant: 'alert' | 'warning' | 'default';
}

export function SituationCards() {
  const [cards, setCards] = useState<SituationCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCards(lat?: number, lon?: number) {
      try {
        const url = lat && lon ? `/api/situations?lat=${lat}&lon=${lon}` : '/api/situations';
        const res = await fetch(url);
        const data = await res.json();
        if (data.cards) {
          setCards(data.cards);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          loadCards(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.warn("Geolocation denied or failed, falling back to default location.", error);
          loadCards(); // Fallback to default
        },
        { timeout: 10000 }
      );
    } else {
      loadCards(); // Fallback if geolocation isn't supported
    }
  }, []);

  if (loading) {
    return <div className={styles.loadingState}>Analyzing live weather models (Open-Meteo) to generate recommendations...</div>;
  }

  return (
    <div className={styles.cardsGrid}>
      {cards.map((card) => (
        <Card key={card.id} variant={card.variant} className={styles.actionCard}>
          <CardHeader>
            <div className={styles.cardMeta}>
              <span className={`${styles.badge} ${styles[card.priority.toLowerCase()]}`}>
                {card.priority} Priority
              </span>
              <span className={styles.timeTag}>⏳ {card.timeSensitivity}</span>
            </div>
            <CardTitle>{card.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={styles.whyText}><strong>Why:</strong> {card.why}</p>
            <p className={styles.impactText}><strong>Impact:</strong> {card.impact}</p>
          </CardContent>
          <CardFooter>
            <Button variant={card.variant === 'alert' ? 'destructive' : 'primary'} size="sm">
              Mark as Done
            </Button>
            <Button variant="ghost" size="sm">Remind Me</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
