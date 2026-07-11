'use client';
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import styles from './page.module.css';

interface KitItem {
  category: string;
  item: string;
  quantity: string;
  priority: string;
  reason: string;
}

export default function KitGenerator() {
  const [adults, setAdults] = useState('2');
  const [children, setChildren] = useState('0');
  const [pets, setPets] = useState('None');
  const [conditions, setConditions] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [kit, setKit] = useState<KitItem[] | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/kit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adults, children, pets, conditions })
      });
      const data = await res.json();
      if (data.kit) {
        setKit(data.kit);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.hero}>
        <h2>Emergency Kit Generator</h2>
        <p>Get a personalized monsoon survival checklist based on your family profile.</p>
      </div>

      <div className={styles.formLayout}>
        <div className={styles.inputSection}>
          <h3>Family Profile</h3>
          <div className={styles.inputGrid}>
            <div className={styles.inputGroup}>
              <label>Adults</label>
              <Input type="number" min="1" value={adults} onChange={e => setAdults(e.target.value)} />
            </div>
            <div className={styles.inputGroup}>
              <label>Children / Infants</label>
              <Input type="number" min="0" value={children} onChange={e => setChildren(e.target.value)} />
            </div>
            <div className={styles.inputGroup}>
              <label>Pets</label>
              <Input placeholder="e.g. 1 Dog, 2 Cats" value={pets} onChange={e => setPets(e.target.value)} />
            </div>
            <div className={styles.inputGroup}>
              <label>Medical Conditions</label>
              <Input placeholder="e.g. Asthma, Diabetes" value={conditions} onChange={e => setConditions(e.target.value)} />
            </div>
          </div>
          <Button onClick={handleGenerate} isLoading={loading} className={styles.generateBtn}>
            Generate My Kit
          </Button>
        </div>

        {kit && (
          <div className={styles.results}>
            <h3>Your Personalized Kit</h3>
            <div className={styles.cardsGrid}>
              {kit.map((item, idx) => (
                <Card key={idx} variant={item.priority === 'High' ? 'alert' : 'default'} className={styles.kitCard}>
                  <CardHeader>
                    <div className={styles.cardMeta}>
                      <span className={styles.category}>{item.category}</span>
                      <span className={`${styles.badge} ${styles[item.priority.toLowerCase()]}`}>
                        {item.priority}
                      </span>
                    </div>
                    <CardTitle>{item.item} (x{item.quantity})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className={styles.reason}>{item.reason}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
