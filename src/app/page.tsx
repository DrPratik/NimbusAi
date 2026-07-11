import React from 'react';
import { Button } from '@/components/ui/Button';
import { AssistantChat } from '@/components/AssistantChat';
import { ReadinessScore } from '@/components/ReadinessScore';
import { SituationCards } from '@/components/SituationCards';
import styles from './page.module.css';

export default function Dashboard() {
  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <div className={styles.heroText}>
          <h2>What should I do now?</h2>
          <p>Based on live weather, your location, and your family profile, here are your recommended actions.</p>
        </div>
      </section>

      <section className={styles.dashboardLayout}>
        <SituationCards />
        
        <div className={styles.assistantSidebar}>
          <ReadinessScore />
          <AssistantChat />
        </div>
      </section>
    </main>
  );
}
