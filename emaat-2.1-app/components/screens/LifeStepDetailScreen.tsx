import React, { FC, useEffect, useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { LifeStep, Language, Memory, Activity, Goals } from '../../types';
import { StarIcon, SpeakerIcon, ArrowRightIcon, SpinnerIcon } from '../Icons';
import TypewriterText from '../TypewriterText';
import { useAsset } from '../../hooks/useAsset';
import { decode, decodeAudioData } from '../../utils';
import ChallengeResultDisplay from '../ChallengeResultDisplay';

const formatDate = (date: Date, lang: Language) => new Intl.DateTimeFormat(lang === 'nl' ? 'nl-NL' : 'en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true }).format(date);

interface LifeStepDetailScreenProps {
    step: LifeStep;
    goals: Goals;
    onClose: () => void;
}

const AssetDisplay: FC<{ assetKey: string, type: 'avatar' | 'memory' }> = ({ assetKey, type }) => {
    const [url, loading] = useAsset(assetKey);
    const sizeClass = type === 'avatar' ? 'w-32 h-32' : 'w-full h-auto max-h-64';
    const bgClass = type === 'avatar' ? 'bg-gray-300' : 'bg-gray-100';

    if (loading) {
        return <div className={`${sizeClass} rounded-full flex items-center justify-center ${bgClass}`}><SpinnerIcon className="w-8 h-8 text-gray-400 animate-spin" /></div>;
    }
    if (type === 'avatar') {
        return <img src={url || ''} alt="Avatar" className={`${sizeClass} rounded-full border-4 border-white object-cover shadow-lg`} />;
    }
    return <img src={url || ''} alt="Memory" className={`${sizeClass} rounded-lg object-contain bg-gray-100`} />;
}

const MemoryDetailsDisplay: FC<{ memory: Memory, activity: Activity }> = ({ memory, activity }) => {
    const { t } = useLanguage();
    const details: {label: string, value: string}[] = [];

    if (memory.walking) {
        const key = memory.walking.unit === 'steps' ? 'addMemoryScreen.steps' : 'addMemoryScreen.minutes';
        details.push({ label: t(key), value: String(memory.walking.value) });
    }
    if (memory.duration) {
        const label = activity.id === 'sleep' ? t('addMemoryScreen.howLongDidYouSleep') : t('addMemoryScreen.duration');
        details.push({ label, value: `${memory.duration.hours}h ${memory.duration.minutes}m` });
    }
    if (memory.meal) {
        details.push({ label: t('addMemoryScreen.mealType'), value: t(`addMemoryScreen.${memory.meal.type}`) });
        details.push({ label: t('addMemoryScreen.whatDidYouEat'), value: memory.meal.description });
    }
    if (memory.social) {
        details.push({ label: t('addMemoryScreen.whatDidYouDo'), value: memory.social.description });
    }

    if (details.length === 0) return null;

    return (
        <div className="space-y-2">
            {details.map((detail, i) => (
                <div key={i}>
                    <p className="text-sm font-semibold text-gray-500">{detail.label}</p>
                    <p className="text-gray-800">{detail.value}</p>
                </div>
            ))}
        </div>
    );
};

const LifeStepDetailScreen: FC<LifeStepDetailScreenProps> = ({ step, goals, onClose }) => {
    const { t, language } = useLanguage();
    const earnedPoints = step.pointsAfter - step.pointsBefore;
    const isFromChallenge = !!step.challengeActivityId;

    return (
        <div className="min-h-screen bg-brand-light font-sans p-4 flex flex-col animate-fade-in">
            <div className="flex-grow overflow-y-auto max-w-2xl mx-auto w-full bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center gap-4 mb-4">
                    <div className={`p-3 rounded-full bg-gray-100 ${step.activity.color}`}><step.activity.icon className="w-8 h-8" /></div>
                    <div>
                        <h3 className="text-2xl font-bold text-brand-dark">{step.overrideTitle || t(`activities.${step.activity.id}.name`)}</h3>
                        <p className="text-sm text-gray-500">{formatDate(step.timestamp, language)}</p>
                    </div>
                    <div className="ml-auto text-right flex items-center gap-1 font-bold text-2xl text-brand-secondary">
                        {step.pointsDoubled && <StarIcon className="w-6 h-6 text-amber-400" />}
                        <p>+{earnedPoints} {t('common.pointsAbbreviation')}</p>
                    </div>
                </div>
                {step.memory && (
                    <div className="mb-6">
                        <h4 className="font-semibold text-brand-dark mb-2">{t('lifeStepDetailScreen.memoryDetailsTitle')}</h4>
                        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                          {step.memory.photoUrl && (<AssetDisplay assetKey={step.memory.photoUrl} type="memory" />)}
                          {step.memory.content && (<p className="text-gray-700 italic whitespace-pre-wrap">"{step.memory.content}"</p>)}
                          <MemoryDetailsDisplay memory={step.memory} activity={step.activity} />
                        </div>
                    </div>
                )}
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold text-brand-dark">{t('lifeStepDetailScreen.yourTip')}</h4>
                    </div>
                    <p className="text-gray-700 italic">"{step.nudge}"</p>
                </div>
                <div>
                    <h4 className="font-semibold text-brand-dark mb-4 text-center">{t('lifeStepDetailScreen.yourProgress')}</h4>
                    {isFromChallenge ? (
                        <ChallengeResultDisplay item={step} goals={goals} />
                    ) : (
                        <div className="text-center text-gray-500">
                           <p>Avatar updates have been disabled.</p>
                        </div>
                    )}
                </div>
            </div>
            <div className="mt-6 w-full max-w-2xl mx-auto">
                <button onClick={onClose} className="w-full py-3 px-4 bg-brand-primary text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">{t('common.closeButton')}</button>
            </div>
        </div>
    );
};

export default LifeStepDetailScreen;