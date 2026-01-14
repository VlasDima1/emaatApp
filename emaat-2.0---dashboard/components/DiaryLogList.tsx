
import React from 'react';
import { DailyDataPoint } from '../types';
import { ClipboardDocumentListIcon, CameraIcon } from './icons';

interface DiaryLogListProps {
  data: DailyDataPoint[];
}

const DiaryLogList: React.FC<DiaryLogListProps> = ({ data }) => {
  // Filter data to only include days with interactions (completed/active days)
  const activeData = data.filter(day => day.interactions.morning || day.interactions.evening);
  
  // Sort by date descending (newest first)
  const sortedData = [...activeData].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex items-center space-x-3 mb-6 border-b border-gray-100 pb-4">
        <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
            <ClipboardDocumentListIcon className="h-5 w-5" />
        </div>
        <div>
            <h3 className="text-lg font-bold text-gray-800">Dagboek & Foto Logs</h3>
            <p className="text-xs text-gray-500">Overzicht van uw logboeken en geregistreerde momenten</p>
        </div>
      </div>
      
      <div className="space-y-4">
        {sortedData.length === 0 ? (
            <p className="text-gray-500 italic text-center py-4">Nog geen logboeken ingevuld.</p>
        ) : (
            sortedData.map((day) => (
            <div key={day.date} className="relative pl-6 pb-6 border-l-2 border-gray-200 last:border-0 last:pb-0">
                <div className="absolute -left-[9px] top-0 w-4 h-4 bg-white border-2 border-blue-500 rounded-full"></div>
                
                <div className="mb-2">
                    <div className="flex items-center justify-between mb-1">
                         <h4 className="font-bold text-gray-800">
                            {new Date(day.date).toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long' })}
                        </h4>
                    </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 mb-2">
                    <p className="text-gray-700 text-sm italic mb-3">"{day.notes || "Geen notitie ingevuld."}"</p>
                    
                    <div className="flex items-center text-xs font-medium text-gray-500 bg-white px-3 py-1.5 rounded-md border border-gray-200 w-fit">
                        <span>Aantal sigaretten:</span>
                        <span className="ml-2 font-bold text-gray-800 text-sm">{day.value}</span>
                    </div>
                </div>

                {day.cigaretteLogs && day.cigaretteLogs.length > 0 && (
                  <div className="mt-3">
                    <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Gelogde fotos</h5>
                    <div className="flex flex-wrap gap-2">
                      {day.cigaretteLogs.map(log => (
                        <div key={log.id} className="flex items-center px-2 py-1.5 bg-white rounded border border-gray-200 shadow-sm transition-all hover:border-blue-300">
                           <CameraIcon className="h-3.5 w-3.5 text-blue-500 mr-1.5" />
                           <span className="text-xs font-medium text-gray-600">{log.timestamp}u</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>
            ))
        )}
      </div>
    </div>
  );
};

export default DiaryLogList;