import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Challenge } from '../types';

interface ChallengeSummaryProps {
  participantName: string;
  challenge: Challenge;
}

const ChallengeSummary: React.FC<ChallengeSummaryProps> = ({ participantName, challenge }) => {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateSummary = async () => {
      if (!challenge) return;
      setLoading(true);

      const activeData = challenge.data.filter(d => d.interactions.morning || d.interactions.midday || d.interactions.evening);
      
      // Check if challenge is active but has no data yet
      const isActiveWithNoData = challenge.status === 'active' && activeData.length === 0;
      
      if (activeData.length === 0) {
        if (isActiveWithNoData) {
          setSummary(`${participantName} is gestart met de '${challenge.domain}' challenge. Er is nog geen voortgangsdata beschikbaar. Zodra de eerste activiteiten zijn voltooid, verschijnt hier een analyse.`);
        } else {
          setSummary(`De challenge '${challenge.domain}' is nog niet gestart. Zodra ${participantName} begint, verschijnt hier een analyse van de voortgang.`);
        }
        setLoading(false);
        return;
      }
      
      const startValue = activeData[0].value;
      const currentValue = activeData[activeData.length - 1].value;
      const averageValue = activeData.reduce((acc, d) => acc + d.value, 0) / activeData.length;
      const trend = currentValue > startValue ? 'een stijgende lijn' : currentValue < startValue ? 'een dalende lijn' : 'een stabiele lijn';
      const unit = challenge.domain === 'Slaap' ? 'uur' : challenge.domain === 'Beweeg' ? 'stappen' : 'score';


      try {
        const apiKey = process.env.API_KEY || import.meta.env.VITE_GEMINI_API_KEY;
        
        if (!apiKey) {
          // No API key - provide a manual summary
          const changePercent = startValue > 0 ? ((currentValue - startValue) / startValue * 100).toFixed(0) : 0;
          const trendText = currentValue > startValue 
            ? `een stijging van ${changePercent}%` 
            : currentValue < startValue 
              ? `een daling van ${Math.abs(Number(changePercent))}%` 
              : 'geen verandering';
          
          setSummary(`• ${participantName} is actief bezig met de ${challenge.domain} challenge (${activeData.length} dagen data).
• Startwaarde: ${startValue.toFixed(1)} ${unit}, huidige waarde: ${currentValue.toFixed(1)} ${unit} (${trendText}).
• Gemiddelde over de periode: ${averageValue.toFixed(1)} ${unit}.`);
          setLoading(false);
          return;
        }
        
        const ai = new GoogleGenAI({ apiKey });
        const prompt = `
            Analyseer de voortgangsdata van deelnemer ${participantName} voor de e-health challenge '${challenge.domain}'.
            
            Data:
            - Startwaarde: ${startValue.toFixed(1)} ${unit}
            - Huidige waarde (na ${activeData.length} dagen): ${currentValue.toFixed(1)} ${unit}
            - Gemiddelde waarde: ${averageValue.toFixed(1)} ${unit}
            - Trend: ${trend}

            GEEF ALLEEN 3 KORTE, PROFESSIONELE BULLET POINTS TERUG.
            - Focus op de trend en het resultaat.
            - Wees motiverend en geef eventueel een subtiele tip.
            - Begin direct met het eerste bullet point. Geen inleidende zinnen.
            - Schrijf in het Nederlands.
        `;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });

        setSummary(response.text);
      } catch (error) {
        console.error("Error generating challenge summary:", error);
        // Provide a useful fallback summary
        const changePercent = startValue > 0 ? ((currentValue - startValue) / startValue * 100).toFixed(0) : 0;
        const trendText = currentValue > startValue 
          ? `een stijging van ${changePercent}%` 
          : currentValue < startValue 
            ? `een daling van ${Math.abs(Number(changePercent))}%` 
            : 'geen verandering';
        
        setSummary(`• ${participantName} is actief bezig met de ${challenge.domain} challenge (${activeData.length} dagen data).
• Startwaarde: ${startValue.toFixed(1)} ${unit}, huidige waarde: ${currentValue.toFixed(1)} ${unit} (${trendText}).
• Gemiddelde over de periode: ${averageValue.toFixed(1)} ${unit}.`);
      } finally {
        setLoading(false);
      }
    };

    generateSummary();
  }, [challenge, participantName]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Samenvatting & Observaties</h3>
      {loading ? (
        <div className="space-y-3 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      ) : (
        <ul className="list-disc list-outside ml-5 space-y-2 text-gray-600">
          {summary
            .split('\n')
            .filter(line => line.trim() !== '')
            .map((line, index) => (
              <li key={index}>{line.replace(/^[*-]\s*/, '')}</li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default ChallengeSummary;