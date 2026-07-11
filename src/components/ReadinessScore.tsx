'use client';
import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import styles from './ReadinessScore.module.css';

interface ReadinessData {
  score: number;
  locationScore: number;
  familyScore: number;
  suppliesScore: number;
}

export function ReadinessScore() {
  const [data, setData] = useState<ReadinessData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchScore() {
      try {
        const res = await fetch('/api/readiness');
        const json = await res.json();
        if (json.readiness) {
          setData(json.readiness);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchScore();
  }, []);

  if (loading) {
    return <Card className={styles.container}><CardContent>Loading score...</CardContent></Card>;
  }

  if (!data) return null;

  return (
    <Card className={styles.container}>
      <CardHeader>
        <CardTitle>AI Readiness Score</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={styles.scoreCircle}>
          <span className={styles.scoreValue}>{data.score}</span>
          <span className={styles.scoreLabel}>/ 100</span>
        </div>
        <div className={styles.metrics}>
          <div className={styles.metric}>
            <span>Location Risk</span>
            <div className={styles.bar}><div className={styles.fill} style={{width: `${data.locationScore}%`}} /></div>
          </div>
          <div className={styles.metric}>
            <span>Family Profile</span>
            <div className={styles.bar}><div className={styles.fill} style={{width: `${data.familyScore}%`}} /></div>
          </div>
          <div className={styles.metric}>
            <span>Emergency Supplies</span>
            <div className={styles.bar}><div className={styles.fill} style={{width: `${data.suppliesScore}%`}} /></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
