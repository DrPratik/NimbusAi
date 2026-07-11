'use client';
import React, { useState } from 'react';
import { Button } from './ui/Button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './ui/Card';
import styles from './AssistantChat.module.css';

export function AssistantChat() {
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, context: 'User is located in low-lying area.' })
      });
      
      const data = await res.json();
      
      if (res.ok && data.reply) {
        setMessages(prev => [...prev, { role: 'ai', text: data.reply }]);
      } else {
        setMessages(prev => [...prev, { role: 'ai', text: "System Error: Unable to fetch verified information right now." }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: "Network Error: Could not connect to emergency services API." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={styles.chatContainer}>
      <CardHeader>
        <CardTitle>AI Emergency Assistant</CardTitle>
      </CardHeader>
      <CardContent className={styles.messagesBox}>
        {messages.length === 0 && (
          <p className={styles.emptyText}>Describe your situation (e.g. "Water entered my home, can I drive?")</p>
        )}
        {messages.map((msg, idx) => (
          <div key={idx} className={msg.role === 'user' ? styles.userBubble : styles.aiBubble}>
            {msg.text}
          </div>
        ))}
        {isLoading && <div className={styles.aiBubble}>Thinking...</div>}
      </CardContent>
      <CardFooter className={styles.inputArea}>
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask for help..."
          className={styles.inputField}
        />
        <Button onClick={handleSend} isLoading={isLoading}>Send</Button>
      </CardFooter>
    </Card>
  );
}
