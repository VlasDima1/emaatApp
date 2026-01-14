
import React, { useState } from 'react';
import { DailyDataPoint } from '../types';
import { CameraIcon, ScaleIcon, LightBulbIcon, XCircleIcon } from './icons';

interface NutritionTrackerProps {
  data: DailyDataPoint[];
}

const ImageModal: React.FC<{ isOpen: boolean; onClose: () => void; imageUrl: string; title: string }> = ({ isOpen, onClose, imageUrl, title }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full overflow-hidden animate-in fade-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b border-gray-100">
                    <h3 className="font-bold text-gray-800">{title}</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 transition-colors">
                        <XCircleIcon className="h-6 w-6 text-gray-500" />
                    </button>
                </div>
                <div className="relative aspect-video bg-gray-100 flex items-center justify-center">
                    <img 
                        src={imageUrl} 
                        alt={title} 
                        className="w-full h-full object-cover" 
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://placehold.co/800x600?text=Geen+afbeelding';
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

const NutritionTracker: React.FC<NutritionTrackerProps> = ({ data }) => {
  const [selectedImage, setSelectedImage] = useState<{ url: string; title: string } | null>(null);

  // Stats
  const activeDays = data.filter(d => d.nutritionDetails);
  
  // Quiz Average
  const totalQuizScore = activeDays.reduce((acc, d) => acc + (d.nutritionDetails?.quizScore || 0), 0);
  const maxQuizScore = activeDays.length * 2;
  const quizPercentage = maxQuizScore > 0 ? Math.round((totalQuizScore / maxQuizScore) * 100) : 0;

  // Meal Log Adherence
  const totalMealsPossible = activeDays.length * 3;
  const totalMealsLogged = activeDays.reduce((acc, d) => {
      const m = d.nutritionDetails?.mealsLogged;
      return acc + (m?.breakfast ? 1 : 0) + (m?.lunch ? 1 : 0) + (m?.dinner ? 1 : 0);
  }, 0);
  const logPercentage = totalMealsPossible > 0 ? Math.round((totalMealsLogged / totalMealsPossible) * 100) : 0;

  // Weight Change (First vs Last available weight)
  const daysWithWeight = activeDays.filter(d => d.nutritionDetails?.weight !== undefined);
  let weightChange: string | null = null;
  if (daysWithWeight.length >= 2) {
      // Sort by date just in case
      const sorted = [...daysWithWeight].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      const start = sorted[0].nutritionDetails!.weight!;
      const end = sorted[sorted.length - 1].nutritionDetails!.weight!;
      const diff = end - start;
      weightChange = diff > 0 ? `+${diff.toFixed(1)} kg` : `${diff.toFixed(1)} kg`;
  }

  const handleImageClick = (date: string, type: string) => {
      // Using loremflickr for food images to make it realistic
      // Adding a random lock based on date/type to keep it consistent per item but random overall
      const seed = date.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) + type.length;
      const url = `https://loremflickr.com/800/600/food?lock=${seed}`;
      
      setSelectedImage({
          url,
          title: `${type} - ${new Date(date).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long' })}`
      });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 pb-4 border-b border-gray-100 gap-4">
        <div>
          <h3 className="text-lg font-bold text-gray-800">Voeding Dagboek</h3>
          <p className="text-sm text-gray-500">Foto logboek, wegingen en kennisquiz</p>
        </div>
        <div className="flex gap-6 flex-wrap justify-end">
            <div className="flex flex-col items-end">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Logboek</span>
                <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-blue-600">{logPercentage}%</span>
                    <span className="text-sm font-medium text-gray-400">compleet</span>
                </div>
            </div>
             <div className="flex flex-col items-end">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Quiz Score</span>
                <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-yellow-500">{quizPercentage}%</span>
                    <span className="text-sm font-medium text-gray-400">goed</span>
                </div>
            </div>
            {weightChange && (
                <div className="flex flex-col items-end">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Gewicht</span>
                    <div className="flex items-baseline gap-1">
                        <span className={`text-2xl font-bold ${parseFloat(weightChange) <= 0 ? 'text-green-600' : 'text-red-500'}`}>{weightChange}</span>
                        <span className="text-sm font-medium text-gray-400">totaal</span>
                    </div>
                </div>
            )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="text-left border-b border-gray-100">
              <th className="pb-3 pl-2 text-xs font-bold text-gray-400 uppercase tracking-wider w-20">Dag</th>
              <th className="pb-3 text-xs font-bold text-gray-400 uppercase tracking-wider w-32">
                 <div className="flex items-center gap-1.5">
                    <ScaleIcon className="h-4 w-4 text-teal-500" />
                    <span>Gewicht</span>
                 </div>
              </th>
              <th className="pb-3 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">
                 <div className="flex items-center justify-center gap-1.5">
                    <CameraIcon className="h-4 w-4 text-blue-500" />
                    <span>Foto Log (Ochtend / Middag / Avond)</span>
                 </div>
              </th>
              <th className="pb-3 text-xs font-bold text-gray-400 uppercase tracking-wider text-right pr-4">
                 <div className="flex items-center justify-end gap-1.5">
                    <LightBulbIcon className="h-4 w-4 text-yellow-500" />
                    <span>Quiz</span>
                 </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {data.map((day, index) => {
              const details = day.nutritionDetails;
              const hasData = !!details;
              
              return (
                <tr key={day.date} className="group hover:bg-gray-50 transition-colors">
                  <td className="py-4 pl-2 text-sm font-medium text-gray-500">
                    Dag {index + 1}
                  </td>
                  
                  {/* Weight */}
                  <td className="py-4">
                     {details?.weight ? (
                         <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-bold bg-teal-50 text-teal-700 border border-teal-100">
                             {details.weight} kg
                         </span>
                     ) : (
                         <span className="text-gray-300 pl-2">-</span>
                     )}
                  </td>

                  {/* Meal Photos */}
                  <td className="py-4">
                      {details ? (
                          <div className="flex justify-center gap-8">
                              {/* Breakfast */}
                              <div className="flex flex-col items-center gap-1">
                                  <button 
                                    disabled={!details.mealsLogged.breakfast}
                                    onClick={() => handleImageClick(day.date, 'Ochtend')}
                                    className={`p-1.5 rounded-lg transition-all ${details.mealsLogged.breakfast ? 'bg-blue-100 text-blue-600 hover:bg-blue-200 hover:scale-110 cursor-pointer' : 'bg-gray-100 text-gray-300 cursor-default'}`}
                                  >
                                      <CameraIcon className="h-4 w-4" />
                                  </button>
                              </div>
                              {/* Lunch */}
                              <div className="flex flex-col items-center gap-1">
                                  <button 
                                    disabled={!details.mealsLogged.lunch}
                                    onClick={() => handleImageClick(day.date, 'Middag')}
                                    className={`p-1.5 rounded-lg transition-all ${details.mealsLogged.lunch ? 'bg-blue-100 text-blue-600 hover:bg-blue-200 hover:scale-110 cursor-pointer' : 'bg-gray-100 text-gray-300 cursor-default'}`}
                                  >
                                      <CameraIcon className="h-4 w-4" />
                                  </button>
                              </div>
                              {/* Dinner */}
                              <div className="flex flex-col items-center gap-1">
                                  <button 
                                    disabled={!details.mealsLogged.dinner}
                                    onClick={() => handleImageClick(day.date, 'Avond')}
                                    className={`p-1.5 rounded-lg transition-all ${details.mealsLogged.dinner ? 'bg-blue-100 text-blue-600 hover:bg-blue-200 hover:scale-110 cursor-pointer' : 'bg-gray-100 text-gray-300 cursor-default'}`}
                                  >
                                      <CameraIcon className="h-4 w-4" />
                                  </button>
                              </div>
                          </div>
                      ) : (
                          <div className="text-center text-gray-300">-</div>
                      )}
                  </td>

                  {/* Quiz */}
                  <td className="py-4 text-right pr-4">
                    {details ? (
                       <div className="flex items-center justify-end gap-1">
                         {[...Array(2)].map((_, i) => (
                           <div 
                              key={i} 
                              className={`h-2.5 w-8 rounded-full ${i < details.quizScore ? 'bg-yellow-400' : 'bg-gray-200'}`} 
                           />
                         ))}
                         <span className="ml-2 text-xs font-medium text-gray-600 w-6 text-right">{details.quizScore}/2</span>
                       </div>
                    ) : (
                        <span className="text-gray-300">-</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Image Modal */}
      <ImageModal 
        isOpen={!!selectedImage} 
        onClose={() => setSelectedImage(null)} 
        imageUrl={selectedImage?.url || ''} 
        title={selectedImage?.title || ''} 
      />
    </div>
  );
};

export default NutritionTracker;
