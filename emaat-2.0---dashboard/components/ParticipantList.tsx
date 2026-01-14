
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Participant } from '../types';

interface ParticipantListProps {
    participants: Participant[];
    loading: boolean;
}

const ParticipantLink: React.FC<{ participant: Participant }> = ({ participant }) => {
  return (
    <NavLink 
      to={`/participant/${participant.id}`} 
      className={({ isActive }) => 
        `block w-full text-left px-3 py-3 text-sm rounded-lg transition-all duration-200 mb-1 relative border-b border-gray-50 last:border-0 group ${
          isActive 
            ? 'bg-blue-50' 
            : 'hover:bg-gray-50'
        }`
      }
    >
      {({ isActive }) => (
        <div className="flex items-center w-full">
            {isActive && <div className="absolute left-0 top-2 bottom-2 w-1 bg-blue-600 rounded-r-full"></div>}
            
            {/* Avatar */}
            <div className="flex-shrink-0 mr-3">
                <img 
                    src={participant.avatarUrl} 
                    alt={participant.name} 
                    className="h-10 w-10 rounded-full object-cover border border-gray-200 shadow-sm"
                />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <p className={`font-semibold truncate ${isActive ? 'text-blue-700' : 'text-gray-900'}`}>
                    {participant.name}
                </p>
            </div>
        </div>
      )}
    </NavLink>
  );
};

const SkeletonLoader: React.FC = () => (
    <div className="p-4 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/2 mb-6"></div>
        <div className="space-y-4">
            {[...Array(8)].map((_, i) => (
                <div key={i} className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const ParticipantList: React.FC<ParticipantListProps> = ({ participants, loading }) => {
  if (loading) {
    return <SkeletonLoader />;
  }

  return (
    <div className="h-full overflow-y-auto relative bg-white border-r border-gray-200">
        <div className="p-4 border-b border-gray-100 sticky top-0 bg-white z-10">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-800">Deelnemers</h2>
                <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded-full">
                    {participants.length}
                </span>
            </div>
        </div>
        <nav className="p-2">
            {participants.map(participant => (
            <ParticipantLink key={participant.id} participant={participant} />
            ))}
        </nav>
    </div>
  );
};

export default ParticipantList;
