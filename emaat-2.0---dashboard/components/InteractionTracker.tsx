
import React from 'react';
import { DailyDataPoint, Domain } from '../types';

interface InteractionTrackerProps {
  data: DailyDataPoint[];
  domain?: Domain;
}

const InteractionDot: React.FC<{ completed: boolean; type: string }> = ({ completed, type }) => {
  const bgColor = completed ? 'bg-green-400' : 'bg-gray-200';
  const tooltipText = `${type}: ${completed ? 'Voltooid' : 'Gemist'}`;

  return (
    <div className="relative group flex justify-center">
      <div className={`w-2.5 h-2.5 rounded-full ${bgColor}`} />
      <div className="absolute bottom-full mb-2 w-max px-2 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
        {tooltipText}
      </div>
    </div>
  );
};

const InteractionTracker: React.FC<InteractionTrackerProps> = ({ data, domain }) => {
  const isSmokingChallenge = domain === Domain.Roken;
  
  const completedInteractions = data.reduce((acc, day) => {
    let count = (day.interactions.morning ? 1 : 0) + (day.interactions.evening ? 1 : 0);
    if (!isSmokingChallenge) {
        count += (day.interactions.midday ? 1 : 0);
    }
    return acc + count;
  }, 0);
  
  const totalInteractions = data.length * (isSmokingChallenge ? 2 : 3);

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm">
        <div className="flex justify-between items-center mb-4">
            <h4 className="font-semibold text-gray-800">Dagelijkse interacties</h4>
            <p className="text-sm font-medium text-gray-600">{completedInteractions} / {totalInteractions} voltooid</p>
        </div>
        <div className="grid grid-cols-7 gap-2">
        {data.map((day, index) => (
            <div key={day.date} className="p-2 rounded-lg bg-gray-50 border border-gray-200 flex flex-col items-center space-y-2">
                <span className="text-xs font-bold text-gray-500">{`Dag ${index + 1}`}</span>
                <div className="flex space-x-1.5">
                    <InteractionDot completed={day.interactions.morning} type="Ochtend" />
                    {!isSmokingChallenge && <InteractionDot completed={day.interactions.midday} type="Middag" />}
                    <InteractionDot completed={day.interactions.evening} type="Avond" />
                </div>
            </div>
        ))}
        </div>
    </div>
  );
};

export default InteractionTracker;
