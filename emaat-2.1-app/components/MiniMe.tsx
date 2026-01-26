
import React, { FC, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { FireIcon, UsersIcon, ChevronDownIcon, ChevronUpIcon, AwardIcon } from './Icons';
import { POINTS_PER_LEVEL } from '../constants';
import { CommunityGoal, Badge } from '../types';

interface MiniMeProps {
  name: string;
  avatar: string | null;
  level: number;
  points: number;
  communityGoal?: CommunityGoal | null;
  lastEarnedCommunityBadge?: Badge | undefined;
  onShowDetails: () => void;
}

const MiniMe: FC<MiniMeProps> = ({ name, avatar, level, points, communityGoal, lastEarnedCommunityBadge, onShowDetails }) => {
  const { t } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);

  const pointsToNextLevel = POINTS_PER_LEVEL - (points % POINTS_PER_LEVEL);
  const progressPercent = Math.min(100, (points % POINTS_PER_LEVEL) / POINTS_PER_LEVEL * 100);
  
  const communityProgressPercent = communityGoal ? Math.min(100, Math.round((communityGoal.currentProgress / communityGoal.target) * 100)) : 0;
  const adviceKey = communityGoal ? `communityGoal.advice.${communityGoal.type}` : 'communityGoal.advice.generic';

  // Generate initials-based avatar URL as fallback
  const getInitialsAvatarUrl = (userName: string) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(userName || 'U')}&background=3B82F6&color=fff&size=100`;
  };

  const getBadgeColor = (tier: string) => {
    switch (tier) {
        case 'bronze': return 'text-orange-700 bg-orange-200 border-orange-300';
        case 'silver': return 'text-gray-700 bg-gray-200 border-gray-300';
        case 'gold': return 'text-amber-700 bg-amber-200 border-amber-300';
        case 'platinum': return 'text-slate-700 bg-slate-200 border-slate-300';
        default: return 'text-gray-700 bg-gray-100';
    }
  };
  
  const getBadgeIconColor = (tier: string) => {
    switch (tier) {
        case 'bronze': return 'text-orange-600';
        case 'silver': return 'text-gray-500';
        case 'gold': return 'text-amber-500';
        case 'platinum': return 'text-slate-500';
        default: return 'text-gray-400';
    }
  };

  return (
    <div 
        className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md sticky top-4 z-10 transition-all duration-300 overflow-hidden cursor-pointer border border-white/50 hover:shadow-lg"
        onClick={() => setIsExpanded(!isExpanded)}
    >
       {/* Main Header Row */}
       <div className="p-4 flex items-center space-x-4 relative">
          {/* Community Name Label */}
          <div className="absolute top-2 right-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>{t('communityGoal.communityName')}</span>
              {communityGoal && (
                  <span className="flex items-center gap-1 opacity-80">
                    <span>•</span>
                    <UsersIcon className="w-3 h-3" />
                    <span>{communityGoal.participants}</span>
                  </span>
              )}
          </div>
          
          <div className="flex-shrink-0 relative" onClick={(e) => { e.stopPropagation(); onShowDetails(); }}>
              <button className="block focus:outline-none focus:ring-4 focus:ring-brand-primary/50 rounded-full transition-transform transform hover:scale-105">
                  <img 
                    src={avatar || getInitialsAvatarUrl(name)} 
                    alt="eMaat" 
                    className="w-20 h-20 rounded-full border-4 border-white object-cover shadow-lg animate-heartbeat-gentle" 
                  />
              </button>
              <div className="absolute -bottom-1 -right-1 bg-brand-accent text-white w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 border-white shadow-md">{level}</div>
            </div>
          
          <div className="flex-grow pt-2">
            <h2 className="font-bold text-brand-dark text-lg mb-1">{name}'s {t('miniMe.title')}</h2>
            
            {/* Collapsed View: Compact Bars */}
            {!isExpanded && (
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                         <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-brand-primary h-2 rounded-full" style={{ width: `${progressPercent}%` }}></div></div>
                    </div>
                     <div className="flex justify-between items-center">
                        <div className="text-[10px] text-gray-500">
                            {pointsToNextLevel} {t('miniMe.pointsToNextLevel')}
                        </div>
                        {/* Small badge indicator in collapsed view */}
                        {lastEarnedCommunityBadge && (
                             <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold border ${getBadgeColor(lastEarnedCommunityBadge.tier)}`}>
                                <AwardIcon className="w-3 h-3" />
                                <span>{t(`miniMe.${lastEarnedCommunityBadge.tier}`)}</span>
                            </div>
                        )}
                     </div>
                </div>
            )}
          </div>
       </div>

       {/* Collapsed View: Community Goal Summary */}
       {!isExpanded && communityGoal && (
          <div className="px-4 pb-3 pt-0 border-t border-gray-100/50 mt-1">
              <div className="flex items-center justify-between mt-2 text-xs text-gray-600">
                  <div className="flex items-center gap-1.5">
                      <FireIcon className="w-3.5 h-3.5 text-orange-500" />
                      <span className="font-medium">{t(communityGoal.titleKey)}</span>
                  </div>
                  <span className="font-bold text-orange-600">
                      {communityGoal.currentProgress.toLocaleString()} / {communityGoal.target.toLocaleString()} {t(communityGoal.unitKey)}
                  </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1.5 overflow-hidden">
                  <div className="bg-orange-400 h-1.5 rounded-full transition-all duration-1000" style={{ width: `${communityProgressPercent}%` }} />
              </div>
          </div>
       )}

       {/* Expanded Detailed View */}
       <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="px-4 pb-6 space-y-6 border-t border-gray-100 pt-4">
                
                {/* Personal Growth Section */}
                <section>
                    <div className="flex items-center gap-2 mb-2">
                        <AwardIcon className="w-5 h-5 text-brand-primary" />
                        <h3 className="font-bold text-brand-dark">{t('miniMe.personalGoalTitle')}</h3>
                    </div>
                    <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-100">
                        <div className="flex justify-between text-xs font-semibold text-indigo-800 mb-1">
                            <span>Level {level}</span>
                            <span>Level {level + 1}</span>
                        </div>
                        <div className="w-full bg-white rounded-full h-3 mb-2 border border-indigo-100">
                            <div className="bg-brand-primary h-3 rounded-full transition-all duration-700" style={{ width: `${progressPercent}%` }}></div>
                        </div>
                        <p className="text-xs text-indigo-600 mb-2 text-center font-medium">
                            {pointsToNextLevel} {t('miniMe.pointsToNextLevel')} ({points} total)
                        </p>
                        <div className="text-xs text-gray-600 border-t border-indigo-200 pt-2 mt-2">
                            <span className="font-bold text-indigo-800">{t('miniMe.howToProgress')}</span> {t('miniMe.personalTip')}
                        </div>
                    </div>
                </section>

                {/* Community Goal Section */}
                {communityGoal && (
                    <section>
                         <div className="flex items-center justify-between mb-2">
                             <div className="flex items-center gap-2">
                                <UsersIcon className="w-5 h-5 text-orange-500" />
                                <h3 className="font-bold text-brand-dark">{t('miniMe.communityGoalTitle')}: {t(communityGoal.titleKey)}</h3>
                             </div>
                         </div>
                        <div className="bg-orange-50 p-3 rounded-lg border border-orange-100">
                             <div className="flex justify-between text-xs font-semibold text-orange-800 mb-1">
                                <span>0</span>
                                <span>{communityGoal.target.toLocaleString()} {t(communityGoal.unitKey)}</span>
                            </div>
                             <div className="w-full bg-white rounded-full h-3 mb-2 border border-orange-100">
                                <div className="bg-orange-400 h-3 rounded-full transition-all duration-700" style={{ width: `${communityProgressPercent}%` }}></div>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                                <p className="text-xs text-orange-700 font-bold">{communityGoal.currentProgress.toLocaleString()} {t(communityGoal.unitKey)} ({communityProgressPercent}%)</p>
                                <p className="text--[10px] text-orange-600 flex items-center gap-1">
                                    <UsersIcon className="w-3 h-3" /> {communityGoal.participants}
                                </p>
                            </div>
                             <div className="text-xs text-gray-600 border-t border-orange-200 pt-2 mt-2">
                                <span className="font-bold text-orange-800">{t('miniMe.howToProgress')}</span> {t(adviceKey)}
                            </div>
                             <div className="mt-2 pt-2 border-t border-orange-200">
                                <p className="text-xs text-orange-600 italic text-center">
                                    {t('communityGoal.explanation')}
                                </p>
                            </div>
                        </div>
                    </section>
                )}
                
                 {/* Last Earned Community Badge Section */}
                 {lastEarnedCommunityBadge && (
                    <section>
                        <div className="flex items-center gap-2 mb-2">
                            <AwardIcon className={`w-5 h-5 ${getBadgeIconColor(lastEarnedCommunityBadge.tier)}`} />
                            <h3 className="font-bold text-brand-dark">{t('miniMe.recentBadgeTitle')}</h3>
                        </div>
                        <div className={`p-3 rounded-lg border ${getBadgeColor(lastEarnedCommunityBadge.tier)} bg-opacity-20`}>
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-full bg-white border-2 ${getBadgeColor(lastEarnedCommunityBadge.tier)}`}>
                                     <AwardIcon className={`w-6 h-6 ${getBadgeIconColor(lastEarnedCommunityBadge.tier)}`} />
                                </div>
                                <div>
                                    <p className="font-bold text-sm">{t(`miniMe.${lastEarnedCommunityBadge.tier}`)} {t('common.level')}</p>
                                    <p className="text-xs mt-1">
                                        {t('communityGoal.compliment', { tier: t(`miniMe.${lastEarnedCommunityBadge.tier}`) })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                 )}

            </div>
       </div>

       {/* Chevron Indicator */}
       <div className="flex justify-center pb-1 pt-1 bg-gray-50/50 border-t border-gray-100">
         {isExpanded ? (
             <div className="flex flex-col items-center text-gray-400">
                <ChevronUpIcon className="w-4 h-4" />
             </div>
         ) : (
             <div className="flex flex-col items-center text-gray-400">
                <ChevronDownIcon className="w-4 h-4" />
             </div>
         )}
      </div>
    </div>
  );
};

export default MiniMe;
