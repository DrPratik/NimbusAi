'use client';
import React, { useState, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import styles from './page.module.css';

interface Hazard {
  issue: string;
  severity: string;
  recommendation: string;
}

interface AnalysisResult {
  hazardsDetected: boolean;
  summary: string;
  hazards: Hazard[];
  confidenceScore: number;
}

export default function HomeInspection() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image must be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setError('');
        setAnalysis(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!imagePreview) return;
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/inspection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imagePreview })
      });
      
      const data = await res.json();
      if (res.ok && data.analysis) {
        setAnalysis(data.analysis);
      } else {
        setError(data.error || 'Analysis failed.');
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
        <h2>Home Safety Inspection (Vision AI)</h2>
        <p>Upload a photo of your roof, gutters, or drainage to detect potential monsoon hazards.</p>
      </div>

      <div className={styles.uploadSection}>
        {!imagePreview ? (
          <div 
            className={styles.uploadBox}
            onClick={() => fileInputRef.current?.click()}
          >
            <p>Click to upload or take a photo</p>
            <span>JPEG or PNG up to 5MB</span>
          </div>
        ) : (
          <div className={styles.previewContainer}>
            <img src={imagePreview} alt="Upload Preview" className={styles.previewImage} />
            <div className={styles.actions}>
              <Button variant="outline" onClick={() => setImagePreview(null)}>Retake</Button>
              <Button onClick={handleAnalyze} isLoading={loading}>Analyze Hazards</Button>
            </div>
          </div>
        )}
        
        <input 
          type="file" 
          accept="image/jpeg, image/png" 
          ref={fileInputRef} 
          onChange={handleImageUpload} 
          className={styles.hiddenInput} 
        />
        
        {error && <p className={styles.errorText}>{error}</p>}
      </div>

      {analysis && (
        <div className={styles.results}>
          <Card variant={analysis.hazardsDetected ? 'alert' : 'default'}>
            <CardHeader>
              <CardTitle>AI Analysis Report (Confidence: {analysis.confidenceScore}%)</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={styles.summary}>{analysis.summary}</p>
              
              {analysis.hazardsDetected && (
                <div className={styles.hazardsList}>
                  <h4>Identified Hazards</h4>
                  {analysis.hazards.map((hazard, idx) => (
                    <div key={idx} className={styles.hazardItem}>
                      <div className={styles.hazardHeader}>
                        <span className={styles.issueName}>{hazard.issue}</span>
                        <span className={`${styles.badge} ${styles[hazard.severity.toLowerCase()]}`}>
                          {hazard.severity}
                        </span>
                      </div>
                      <p className={styles.recommendation}><strong>Fix:</strong> {hazard.recommendation}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </main>
  );
}
