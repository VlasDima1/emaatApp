
import React, { FC } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { CommunityGoal } from '../types';
import { UsersIcon, StarIcon, FireIcon } from './Icons';

interface CommunityGoalCardProps {
    goal: CommunityGoal | null;
    lastContribution?: number;
}

const CommunityGoalCard: FC<CommunityGoalCardProps> = ({ goal, lastContribution }) => {
    const { t } = useLanguage();

    if (!goal) return null;

    const progressPercent = Math.min(100, (goal.currentProgress / goal.target) * 100);
    const isComplete = goal.currentProgress >= goal.target;

    return (
        <div className="mt-4 bg-white p-3 rounded-lg shadow-sm border border-gray-100 relative overflow-hidden">
            <div className="flex justify-between items-start relative z-10">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <FireIcon className="w-4 h-4 text-orange-500" />
                        <h4 className="font-semibold text-brand-dark text-sm">{t(goal.titleKey)}</h4>
                    </div>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                         <UsersIcon className="w-3 h-3" />
                         {t('communityGoal.participants', { count: goal.participants })}
                    </p>
                </div>
                <div className="text-right">
                     <div className="flex items-center justify-end gap-1 text-[10px] font-bold text-brand-primary bg-brand-light px-2 py-0.5 rounded-full">
                         {isComplete ? t('communityGoal.completed') : `${Math.round(progressPercent)}%`}
                     </div>
                </div>
            </div>

            <div className="mt-3">
                <div className="flex justify-between text-[10px] font-medium text-gray-400 mb-1">
                    <span>{goal.currentProgress.toLocaleString()}</span>
                    <span>{t('communityGoal.target', { target: goal.target.toLocaleString(), unit: t(goal.unitKey) })}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                    <div 
                        className={`h-1.5 rounded-full transition-all duration-1000 ${isComplete ? 'bg-emerald-500' : 'bg-brand-primary'}`} 
                        style={{ width: `${progressPercent}%` }}
                    >
                    </div>
                </div>
            </div>

            {lastContribution && lastContribution > 0 && (
                <div className="mt-2 text-xs text-emerald-600 font-bold animate-pulse flex items-center gap-1">
                    <StarIcon className="w-3 h-3" />
                    {t('communityGoal.youContributed', { amount: lastContribution })}
                </div>
            )}
        </div>
    );
};

export default CommunityGoalCard;
