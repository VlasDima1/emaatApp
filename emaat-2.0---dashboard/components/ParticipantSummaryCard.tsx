
import React from 'react';
import { Participant } from '../types';
import { VideoCameraIcon } from './icons';

interface ParticipantSummaryCardProps {
  participant: Participant;
}

const ParticipantSummaryCard: React.FC<ParticipantSummaryCardProps> = ({ participant }) => {
  
  const handleVideoCall = () => {
    console.log(`Starting video call with ${participant?.name}...`);
    alert(`Videogesprek starten met ${participant?.name}`);
  };

  const { name, avatarUrl, dateOfBirth, age } = participant;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            {/* Left & Center: Avatar and Info */}
            <div className="flex items-center">
                <img src={avatarUrl} alt={name} className="h-16 w-16 rounded-full object-cover flex-shrink-0" />
                <div className="ml-5">
                    <h2 className="text-2xl font-bold text-gray-900">{name}</h2>
                    <p className="text-gray-500">
                        {new Date(dateOfBirth).toLocaleDateString('nl-NL', { day: '2-digit', month: '2-digit', year: 'numeric' })} ({age} jaar)
                    </p>
                </div>
            </div>

            {/* Right side: Video call button */}
            <div className="flex-shrink-0 mt-6 md:mt-0 md:ml-6">
                <button 
                    onClick={handleVideoCall}
                    className="hidden md:flex items-center justify-center bg-green-500 text-white font-bold py-2.5 px-5 rounded-lg shadow-sm hover:bg-green-600 transition-colors"
                >
                    <VideoCameraIcon className="h-5 w-5 mr-2" />
                    Videogesprek
                </button>
            </div>
        </div>
    </div>
  );
};

export default ParticipantSummaryCard;