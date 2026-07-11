describe('Gemini Response Parser logic', () => {
  it('should robustly parse JSON from markdown-wrapped AI strings', () => {
    const mockAiResponse = `
      Here are your action cards based on the severe weather:
      \`\`\`json
      [
        {
          "id": 1,
          "title": "Move Vehicle",
          "priority": "High"
        }
      ]
      \`\`\`
      Stay safe!
    `;

    // Replicate the regex logic used in the actual API route
    const match = mockAiResponse.match(/\[[\s\S]*\]/);
    expect(match).not.toBeNull();
    
    if (match) {
      const parsed = JSON.parse(match[0]);
      expect(Array.isArray(parsed)).toBe(true);
      expect(parsed[0].title).toBe('Move Vehicle');
      expect(parsed[0].priority).toBe('High');
    }
  });

  it('should robustly parse JSON objects from text-wrapped strings', () => {
    const mockAiResponse = `
      Certainly, here is the travel advisory:
      {
        "safeToTravel": false,
        "recommendation": "Delay",
        "risks": ["Flooding"]
      }
    `;

    const match = mockAiResponse.match(/\{[\s\S]*\}/);
    expect(match).not.toBeNull();
    
    if (match) {
      const parsed = JSON.parse(match[0]);
      expect(parsed.safeToTravel).toBe(false);
      expect(parsed.recommendation).toBe('Delay');
    }
  });
});
