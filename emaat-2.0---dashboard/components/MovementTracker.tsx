
import React from 'react';
import { DailyDataPoint } from '../types';
import { SunIcon, LightBulbIcon, ShoeIcon, CheckCircleIcon, XCircleIcon } from './icons';

interface MovementTrackerProps {
  data: DailyDataPoint[];
}

const MovementTracker: React.FC<MovementTrackerProps> = ({ data }) => {
  // Get the daily goal from the latest data point that has it, or default to 10000
  const latestGoal = data.find(d => d.movementDetails)?.movementDetails?.dailyGoal || 10000;

  // Calculate average steps for days that have passed
  const activeDays = data.filter(d => d.value > 0 || (d.movementDetails && (d.movementDetails.morningExerciseCompleted || d.movementDetails.quizScore > 0)));
  const totalSteps = activeDays.reduce((acc, curr) => acc + curr.value, 0);
  const averageSteps = activeDays.length > 0 ? Math.round(totalSteps / activeDays.length) : 0;

  // Calculate days where step goal was reached
  const daysAchieved = activeDays.filter(d => {
    const goal = d.movementDetails?.dailyGoal || latestGoal;
    return d.value >= goal;
  }).length;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      {/* Header with Goal */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 pb-4 border-b border-gray-100 gap-4">
        <div>
          <h3 className="text-lg font-bold text-gray-800">Beweeg Dagboek</h3>
          <p className="text-sm text-gray-500">Voltooi de dagelijkse activiteiten</p>
        </div>
        <div className="flex gap-6 flex-wrap justify-end">
            <div className="flex flex-col items-end">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Doel Behaald</span>
                <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-green-600">{daysAchieved}</span>
                    <span className="text-sm font-medium text-gray-400">/ 14 dgn</span>
                </div>
            </div>
             <div className="flex flex-col items-end">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Gemiddeld</span>
                <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-gray-800">{averageSteps.toLocaleString()}</span>
                    <span className="text-sm font-medium text-gray-400">/dag</span>
                </div>
            </div>
            <div className="flex flex-col items-end">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Dagelijks Doel</span>
                 <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-blue-600">{latestGoal.toLocaleString()}</span>
                    <span className="text-sm font-medium text-gray-400">stappen</span>
                 </div>
            </div>
        </div>
      </div>

      {/* Grid/Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="text-left border-b border-gray-100">
              <th className="pb-3 pl-2 text-xs font-bold text-gray-400 uppercase tracking-wider w-24">Dag</th>
              <th className="pb-3 text-xs font-bold text-gray-400 uppercase tracking-wider">
                <div className="flex items-center gap-1.5">
                  <SunIcon className="h-4 w-4 text-orange-400" />
                  <span>Ochtend (Start)</span>
                </div>
              </th>
              <th className="pb-3 text-xs font-bold text-gray-400 uppercase tracking-wider">
                 <div className="flex items-center gap-1.5">
                  <LightBulbIcon className="h-4 w-4 text-yellow-500" />
                  <span>Middag (Quiz)</span>
                </div>
              </th>
              <th className="pb-3 text-xs font-bold text-gray-400 uppercase tracking-wider">
                <div className="flex items-center gap-1.5">
                  <ShoeIcon className="h-4 w-4 text-blue-500" />
                  <span>Avond (Stappen)</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {data.map((day, index) => {
               const details = day.movementDetails;
               const hasData = details || day.value > 0;

               return (
                <tr key={day.date} className="group hover:bg-gray-50 transition-colors">
                  {/* Day Column */}
                  <td className="py-4 pl-2 text-sm font-medium text-gray-500">
                    Dag {index + 1}
                  </td>

                  {/* Morning: Light Exercise */}
                  <td className="py-4">
                    {details ? (
                      <div className="flex items-center gap-2">
                        {details.morningExerciseCompleted ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                             <CheckCircleIcon className="h-3.5 w-3.5 mr-1" />
                             Gedaan
                          </span>
                        ) : (
                           hasData ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-600">
                                <XCircleIcon className="h-3.5 w-3.5 mr-1" />
                                Gemist
                              </span>
                           ) : <span className="text-gray-300">-</span>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-300 text-sm">-</span>
                    )}
                  </td>

                  {/* Midday: Quiz */}
                  <td className="py-4">
                    {details && details.quizScore !== undefined ? (
                       <div className="flex items-center gap-1">
                         {[...Array(2)].map((_, i) => (
                           <div 
                              key={i} 
                              className={`h-2.5 w-8 rounded-full ${i < details.quizScore ? 'bg-yellow-400' : 'bg-gray-200'}`} 
                           />
                         ))}
                         <span className="ml-2 text-xs font-medium text-gray-600">{details.quizScore}/2</span>
                       </div>
                    ) : (
                        <span className="text-gray-300 text-sm">-</span>
                    )}
                  </td>

                  {/* Evening: Steps */}
                  <td className="py-4 pr-2">
                    {hasData ? (
                        <div className="w-full max-w-[200px]">
                        <div className="flex justify-between items-end mb-1">
                            <span className={`text-sm font-bold ${day.value >= (details?.dailyGoal || 10000) ? 'text-green-600' : 'text-gray-700'}`}>
                            {day.value.toLocaleString()}
                            </span>
                            <span className="text-xs text-gray-400">
                            / {(details?.dailyGoal || 10000).toLocaleString()}
                            </span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                            <div 
                            className={`h-full rounded-full ${day.value >= (details?.dailyGoal || 10000) ? 'bg-green-500' : 'bg-blue-500'}`}
                            style={{ width: `${Math.min(100, (day.value / (details?.dailyGoal || 10000)) * 100)}%` }}
                            ></div>
                        </div>
                        </div>
                    ) : (
                        <span className="text-gray-300 text-sm">-</span>
                    )}
                  </td>
                </tr>
               );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MovementTracker;
