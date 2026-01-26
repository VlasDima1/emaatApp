
import React from 'react';
import { Participant, Challenge, Domain } from '../types';
import ChartCard from './ChartCard';
import InteractionTracker from './InteractionTracker';
import SleepMetricsTracker from './SleepMetricsTracker';
import { ArrowLeftIcon } from './icons';
import SleepChartCard from './SleepChartCard';
import ChallengeSummary from './ChallengeSummary';
import DiaryLogList from './DiaryLogList';
import MovementTracker from './MovementTracker';
import NutritionTracker from './NutritionTracker';

interface ChallengeViewProps {
  participant: Participant;
  challenge: Challenge;
  onBack: () => void;
  onUpdateChallenge: (challenge: Challenge) => void;
}

const ChallengeView: React.FC<ChallengeViewProps> = ({ participant, challenge, onBack, onUpdateChallenge }) => {
  if (!challenge) {
    return <div className="p-6 text-center text-red-500">Challenge niet gevonden.</div>;
  }
  
  // Use status field if available, otherwise fall back to progress-based logic
  const isNewChallenge = challenge.status === 'new' || (!challenge.status && challenge.progress === 0 && !challenge.startDate);
  const isStopped = challenge.status === 'stopped';
  const isActive = challenge.status === 'active';
  const isInProgress = isActive || (!isStopped && challenge.progress > 0 && challenge.progress < 100 && challenge.status !== 'completed');
  const isCompleted = challenge.status === 'completed' || challenge.progress === 100;

  // Calculate challenge day for header
  let challengeDay = 0;
  if (isCompleted) {
      challengeDay = 14;
  } else if (isInProgress) {
      // Find the last day with any interaction to determine the current day of the challenge
      let lastDayWithInteraction = -1;
      challenge.data.forEach((day, index) => {
          // Check relevant interactions based on domain
          const hasInteraction = day.interactions.morning || day.interactions.evening || 
                                (challenge.domain !== Domain.Roken && day.interactions.midday);
          
          if (hasInteraction) {
              lastDayWithInteraction = index;
          }
      });
      // If progress is > 0 but no interactions found (e.g., just started), it's day 1
      // For active challenges with no interactions yet, also set to day 1
      challengeDay = lastDayWithInteraction + 1 > 0 ? lastDayWithInteraction + 1 : 1;
  } else if (isActive) {
      // Active challenge just started (0 progress but active status)
      challengeDay = 1;
  }
  const challengeDayText = challengeDay > 0 ? `Dag ${challengeDay} / 14` : 'Nog niet gestart';

  return (
    <div>
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4 min-w-0">
                <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-200 flex-shrink-0">
                    <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
                </button>
                <h2 className="text-3xl font-bold text-gray-900 truncate">{challenge.domain}</h2>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0 ml-auto">
                {(challengeDay > 0 || isActive) && !isStopped && (
                     <div className="bg-blue-100 text-blue-800 text-sm font-bold px-4 py-1.5 rounded-full flex items-center">
                        {isInProgress && (
                            <>
                                <span>In uitvoering</span>
                                <span className="mx-2 text-blue-400 font-light">|</span>
                            </>
                        )}
                         {isCompleted && (
                             <>
                                <span>Voltooid</span>
                                <span className="mx-2 text-blue-400 font-light">|</span>
                             </>
                         )}
                        <span>{challengeDayText}</span>
                    </div>
                )}
                
                {isNewChallenge && (
                     <button 
                        onClick={() => onUpdateChallenge && onUpdateChallenge(challenge)}
                        className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-sm hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-sm whitespace-nowrap"
                    >
                        Start deze challenge
                    </button>
                )}
            </div>
        </div>

        <div className="mb-8">
            <ChallengeSummary participantName={participant.name} challenge={challenge} />
        </div>

        {/* Domain Specific Trackers */}
        <div className="mb-8">
            {challenge.domain === Domain.Beweeg ? (
                <MovementTracker data={challenge.data} />
            ) : challenge.domain === Domain.Voeding ? (
                <NutritionTracker data={challenge.data} />
            ) : (
                <InteractionTracker data={challenge.data} domain={challenge.domain} />
            )}
        </div>

        <div className="mb-8">
            {challenge.domain === Domain.Slaap ? (
                <SleepChartCard data={challenge.data} />
            ) : challenge.domain === Domain.Roken ? (
                <DiaryLogList data={challenge.data} />
            ) : challenge.domain === Domain.Beweeg || challenge.domain === Domain.Voeding ? (
                null
            ) : (
                <ChartCard challenge={challenge} />
            )}
        </div>

        {challenge.domain === Domain.Slaap && (
            <div className="mb-8">
                <SleepMetricsTracker data={challenge.data} />
            </div>
        )}
    </div>
  );
};

export default ChallengeView;
