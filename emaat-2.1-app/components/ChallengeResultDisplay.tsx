
import React, { FC } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Goals, LifeStep, ChallengeActivity, MorningCheckinData, EveningCheckinData, SocialMorningCheckinData, SocialEveningCheckinData, MovementMorningCheckinData, MovementEveningCheckinData, StressMorningCheckinData, StressEveningCheckinData } from '../types';
import { StarIcon } from './Icons';

interface ChallengeResultDisplayProps {
    item: Pick<LifeStep, 'challengeId' | 'challengeActivityType' | 'challengeActivityData'> | ChallengeActivity;
    goals: Goals;
}

const ChallengeResultDisplay: FC<ChallengeResultDisplayProps> = ({ item, goals }) => {
    const { t } = useLanguage();

    let type;
    let data;
    let challengeId;

    if ('type' in item) {
        // It's a ChallengeActivity
        type = item.type;
        data = item.data;
        challengeId = item.challengeId;
    } else {
        // It's a partial LifeStep
        type = item.challengeActivityType;
        data = item.challengeActivityData;
        challengeId = item.challengeId;
    }

    if (!type || !data || !challengeId) {
        return null;
    }
    
    const sleepCheckinData = (challengeId === 'sleepChallenge' && type === 'morningCheckin' && 'sleepDuration' in data) ? data as MorningCheckinData : null;
    const sleepEveningData = (challengeId === 'sleepChallenge' && type === 'eveningCheckin') ? data as EveningCheckinData : null;
    const movementMorningData = (challengeId === 'beweegChallenge' && type === 'morningCheckin' && 'didExercise' in data) ? data as MovementMorningCheckinData : null;
    const movementEveningData = (challengeId === 'beweegChallenge' && type === 'eveningCheckin' && 'steps' in data) ? data as MovementEveningCheckinData : null;
    const socialMorningData = (challengeId === 'socialChallenge' && type === 'morningCheckin' && 'emotionalState' in data) ? data as SocialMorningCheckinData : null;
    const socialEveningData = (challengeId === 'socialChallenge' && type === 'eveningCheckin' && 'interactionQuality' in data) ? data as SocialEveningCheckinData : null;
    const stressCheckinData = (challengeId === 'stressChallenge' && (type === 'morningCheckin' || type === 'eveningCheckin') && 'pulseBefore' in data) ? data as StressMorningCheckinData | StressEveningCheckinData : null;
    
    const getSocialActionText = () => {
        if (!socialMorningData) return '';
        if (socialMorningData.plannedAction === 'other') return socialMorningData.otherActionText;
        const actionKeyMap: Record<string, string> = {
            sayHello: 'challenge.socialChallenge.morningCheckin.actionOption1',
            askQuestion: 'challenge.socialChallenge.morningCheckin.actionOption2',
            startConversation: 'challenge.socialChallenge.morningCheckin.actionOption3',
            sendMessage: 'challenge.socialChallenge.morningCheckin.actionOption4',
        };
        return t(actionKeyMap[socialMorningData.plannedAction] || '');
    };
    
    return (
        <div className="space-y-2">
            {sleepCheckinData && (
                <div className="space-y-1 text-sm bg-emerald-100 p-2 rounded-md">
                    <div className="flex items-center gap-2">
                        <span className="font-medium text-emerald-800">{t('statsScreen.sleepQuality')}:</span>
                        <div className="flex">
                            {[1, 2, 3, 4, 5].map(star => (
                                <StarIcon 
                                    key={star} 
                                    className={`w-4 h-4 ${star <= sleepCheckinData.sleepQuality ? 'text-amber-400' : 'text-gray-300'}`} 
                                />
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-emerald-800">{t('statsScreen.sleepDuration')}:</span>
                        <span className="text-emerald-900 font-semibold">{sleepCheckinData.sleepDuration.hours}h {sleepCheckinData.sleepDuration.minutes}m</span>
                        {goals.regularSleep && (() => {
                            const totalMinutes = sleepCheckinData.sleepDuration.hours * 60 + sleepCheckinData.sleepDuration.minutes;
                            const [btH, btM] = goals.regularSleep.bedtime.split(':').map(Number);
                            const [wtH, wtM] = goals.regularSleep.wakeTime.split(':').map(Number);
                            let goalMinutes = ((wtH - btH) * 60 + (wtM - btM));
                            if (goalMinutes < 0) goalMinutes += 24 * 60;
                            
                            const deviation = totalMinutes - goalMinutes;
                            if (Math.abs(deviation) < 15) return null;

                            const devHours = Math.floor(Math.abs(deviation) / 60);
                            const devMinutes = Math.abs(deviation) % 60;
                            const sign = deviation > 0 ? '+' : '-';
                            const color = deviation > -15 ? 'text-emerald-600' : 'text-rose-500';

                            let deviationString = '';
                            if (devHours > 0) deviationString += `${devHours}h `;
                            if (devMinutes > 0) deviationString += `${devMinutes}m`;
                            
                            if (deviationString.trim() === '') return null;

                            return (
                                <span className={`font-semibold text-xs ${color}`}>
                                    ({sign}{deviationString.trim()})
                                </span>
                            );
                        })()}
                    </div>
                </div>
            )}
            {sleepEveningData && (
                 <div className="text-sm bg-emerald-100 p-2 rounded-md">
                    <p><span className="font-medium text-emerald-800">{t('statsScreen.eveningHabits')}:</span> <span className="font-semibold text-emerald-900">{Object.values(sleepEveningData).filter(v => v).length} / {Object.keys(sleepEveningData).length}</span></p>
                </div>
            )}
            {movementMorningData && (
                <div className="text-sm bg-emerald-100 p-2 rounded-md">
                    <p className="font-medium text-emerald-800">
                        {t('challenge.beweegChallenge.morningCheckin.title')}: <span className="font-semibold text-emerald-900">{movementMorningData.didExercise ? t('common.yes') : t('common.no')}</span>
                    </p>
                </div>
            )}
            {movementEveningData && (
                <div className="text-sm bg-emerald-100 p-2 rounded-md">
                    <p className="font-medium text-emerald-800">
                        {t('statsScreen.steps')}: <span className="font-semibold text-emerald-900">{movementEveningData.steps}</span>
                    </p>
                </div>
            )}
             {socialMorningData && (
                <div className="space-y-1 text-sm bg-emerald-100 p-2 rounded-md">
                    <p><span className="font-medium text-emerald-800">{t('challenge.socialChallenge.morningCheckin.emotionalStateLabel')}:</span> <span className="font-semibold text-emerald-900">{socialMorningData.emotionalState}/10</span></p>
                    <p><span className="font-medium text-emerald-800">{t('challenge.socialChallenge.morningCheckin.socialEnergyLabel')}:</span> <span className="font-semibold text-emerald-900">{socialMorningData.socialEnergy}/10</span></p>
                    <p><span className="font-medium text-emerald-800">{t('challenge.socialChallenge.morningCheckin.plannedActionLabel')}:</span> <span className="font-semibold text-emerald-900 italic">"{getSocialActionText()}"</span></p>
                </div>
            )}
            {socialEveningData && (
                <div className="space-y-1 text-sm bg-emerald-100 p-2 rounded-md">
                    <p><span className="font-medium text-emerald-800">{t('challenge.socialChallenge.eveningCheckin.interactionQualityLabel')}:</span> <span className="font-semibold text-emerald-900">{socialEveningData.interactionQuality}/10</span></p>
                    <p><span className="font-medium text-emerald-800">{t('challenge.socialChallenge.eveningCheckin.actionCompletedLabel')}:</span> <span className="font-semibold text-emerald-900">{t(`challenge.socialChallenge.eveningCheckin.actionCompleted${socialEveningData.actionCompleted.charAt(0).toUpperCase() + socialEveningData.actionCompleted.slice(1)}`)}</span></p>
                    <p><span className="font-medium text-emerald-800">{t('challenge.socialChallenge.eveningCheckin.socialSelfEsteemLabel')}:</span> <span className="font-semibold text-emerald-900">{socialEveningData.socialSelfEsteem}/10</span></p>
                </div>
            )}
            {stressCheckinData && (
                <div className="text-sm bg-emerald-100 p-2 rounded-md">
                    <p className="font-medium text-emerald-800">
                        {t('measurements.types.heartRate.name')}: <span className="font-semibold text-emerald-900">{stressCheckinData.pulseBefore} → {stressCheckinData.pulseAfter} bpm</span>
                    </p>
                     {'relaxationActivity' in stressCheckinData && (stressCheckinData as StressEveningCheckinData).relaxationActivity && (
                         <p className="font-medium text-emerald-800 mt-1">
                            {t('challenge.stressChallenge.eveningCheckin.activityLabel')}: <span className="font-semibold text-emerald-900 italic">"{(stressCheckinData as StressEveningCheckinData).relaxationActivity}"</span>
                        </p>
                    )}
                </div>
            )}
            {data && 'reflection' in data && (
                <p className="text-sm text-gray-600 italic bg-emerald-100 p-2 rounded-md">"{ (data as any).reflection }"</p>
            )}
        </div>
    );
};

export default ChallengeResultDisplay;
