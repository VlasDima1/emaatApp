import React, { FC, useMemo, useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { UserInfo, Gender, BadgeTier, Badge, Activity } from '../../types';
import { ACTIVITIES, BADGES } from '../../constants';
import { XIcon, AwardIcon, BellIcon, CheckCircleIcon, XCircleIcon } from '../Icons';
import LanguageSwitcher from '../LanguageSwitcher';
import ConfirmationModal from '../ConfirmationModal';

const getEarnedBadges = (activityPoints: Record<string, number>): Badge[] => {
    const earned: Badge[] = [];
    for (const badge of BADGES) {
        if ((activityPoints[badge.activityId] || 0) >= badge.threshold) {
            earned.push(badge);
        }
    }
    return earned;
};

const getTierColor = (tier: BadgeTier) => {
    switch (tier) {
        case 'bronze': return 'text-orange-500 bg-orange-100 border-orange-300';
        case 'silver': return 'text-gray-500 bg-gray-200 border-gray-300';
        case 'gold': return 'text-amber-500 bg-amber-100 border-amber-300';
        default: return 'text-gray-500 bg-gray-100 border-gray-200';
    }
}

interface AvatarDetailScreenProps {
    avatar: string | null;
    userInfo: UserInfo;
    level: number;
    points: number;
    activityPoints: Record<string, number>;
    allHabitsUnlocked: boolean;
    onUpdateUserInfo: (userInfo: UserInfo) => void;
    onToggleAllHabits: (unlocked: boolean) => void;
    onResetApp: () => void;
}

const AvatarDetailScreen: FC<AvatarDetailScreenProps> = ({ avatar, userInfo, level, points, activityPoints, allHabitsUnlocked, onUpdateUserInfo, onToggleAllHabits, onResetApp }) => {
    const { t } = useLanguage();
    const [editedInfo, setEditedInfo] = useState(userInfo);
    const earnedBadges = useMemo(() => getEarnedBadges(activityPoints), [activityPoints]);
    const [hasChanges, setHasChanges] = useState(false);
    const [heightM, setHeightM] = useState('');
    const [heightCm, setHeightCm] = useState('');
    const [isResetModalOpen, setIsResetModalOpen] = useState(false);

    useEffect(() => {
        setEditedInfo(userInfo);
        if (userInfo.height) {
            setHeightM(String(Math.floor(userInfo.height / 100)));
            setHeightCm(String(userInfo.height % 100));
        } else {
            setHeightM('');
            setHeightCm('');
        }
    }, [userInfo]);

    useEffect(() => {
        const heightInCm = (parseInt(heightM, 10) || 0) * 100 + (parseInt(heightCm, 10) || 0);
        const currentHeight = heightInCm > 0 ? heightInCm : null;
        
        const infoChanged = JSON.stringify(editedInfo) !== JSON.stringify(userInfo);
        const heightChanged = currentHeight !== userInfo.height;

        setHasChanges(infoChanged || heightChanged);
    }, [editedInfo, userInfo, heightM, heightCm]);


    const handleSave = () => { 
        const heightInCm = (parseInt(heightM, 10) || 0) * 100 + (parseInt(heightCm, 10) || 0);
        const finalUserInfo: UserInfo = {
            ...editedInfo,
            height: heightInCm > 0 ? heightInCm : null,
        };
        onUpdateUserInfo(finalUserInfo); 
        setHasChanges(false); 
    };

    const getBadgeName = (badge: Badge) => t(`badges.activities.${badge.activityId}.${badge.tier}`);
    
    const potentialBadges = useMemo(() => {
        const nextBadges: (Badge & { currentPoints: number })[] = [];
        const activityIdsWithBadges = [...new Set(BADGES.map(b => b.activityId))];

        for (const activityId of activityIdsWithBadges) {
            const highestEarnedTier = earnedBadges
                .filter(b => b.activityId === activityId)
                .reduce((highest, b) => {
                    if (!highest) return b.tier;
                    if (b.tier === 'gold') return 'gold';
                    if (b.tier === 'silver' && highest === 'bronze') return 'silver';
                    return highest;
                }, null as BadgeTier | null);

            let nextTier: BadgeTier | null = null;
            if (highestEarnedTier === null) {
                nextTier = 'bronze';
            } else if (highestEarnedTier === 'bronze') {
                nextTier = 'silver';
            } else if (highestEarnedTier === 'silver') {
                nextTier = 'gold';
            }

            if (nextTier) {
                const nextBadge = BADGES.find(b => b.activityId === activityId && b.tier === nextTier);
                if (nextBadge) {
                    nextBadges.push({
                        ...nextBadge,
                        currentPoints: activityPoints[activityId] || 0
                    });
                }
            }
        }
        return nextBadges;
    }, [activityPoints, earnedBadges]);


    const handleConfirmReset = () => {
        setIsResetModalOpen(false);
        onResetApp();
    };

    return (
        <div className="min-h-screen bg-brand-light font-sans p-4 pb-24 animate-fade-in">
             <ConfirmationModal
                isOpen={isResetModalOpen}
                onClose={() => setIsResetModalOpen(false)}
                onConfirm={handleConfirmReset}
                title={t('avatarDetailScreen.resetConfirmationTitle')}
                message={t('avatarDetailScreen.resetConfirmationMessage')}
                confirmText={t('avatarDetailScreen.resetConfirmButton')}
                cancelText={t('avatarDetailScreen.resetCancelButton')}
            />
            <header className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-brand-dark">{t('nav.settings')}</h2>
            </header>
            <div className="mt-4 max-w-md mx-auto">
                <div className="text-center">
                    <img src={avatar || ''} alt={t('miniMe.title')} className="w-32 h-32 rounded-full border-8 border-white object-cover shadow-2xl mx-auto mb-4" />
                </div>
                <div className="mt-4 space-y-3 bg-white p-4 rounded-lg shadow-sm">
                    <div>
                        <label htmlFor="settings-name" className="text-sm font-medium text-gray-700">{t('common.yourName')}</label>
                        <input id="settings-name" type="text" value={editedInfo.name} onChange={e => setEditedInfo(u => ({ ...u, name: e.target.value }))} className="w-full p-2 mt-1 border border-gray-300 rounded-lg focus:ring-brand-primary focus:border-brand-primary" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="settings-dob" className="text-sm font-medium text-gray-700">{t('welcomeScreen.dateOfBirthLabel')}</label>
                            <input id="settings-dob" type="date" value={editedInfo.dateOfBirth || ''} onChange={e => setEditedInfo(u => ({ ...u, dateOfBirth: e.target.value }))} className="w-full p-2 mt-1 border border-gray-300 rounded-lg" />
                        </div>
                        <div>
                            <label htmlFor="settings-gender" className="text-sm font-medium text-gray-700">{t('common.yourGender')}</label>
                            <select id="settings-gender" value={editedInfo.gender} onChange={e => setEditedInfo(u => ({ ...u, gender: e.target.value as Gender }))} className="w-full p-2 mt-1 border border-gray-300 rounded-lg bg-white focus:ring-brand-primary focus:border-brand-primary">
                                <option value="unspecified">{t('common.genderUnspecified')}</option>
                                <option value="female">{t('common.genderFemale')}</option>
                                <option value="male">{t('common.genderMale')}</option>
                            </select>
                        </div>
                    </div>
                     <div>
                        <label htmlFor="settings-email" className="text-sm font-medium text-gray-700">{t('welcomeScreen.emailLabel')}</label>
                        <input id="settings-email" type="email" value={editedInfo.email || ''} onChange={e => setEditedInfo(u => ({...u, email: e.target.value}))} className="w-full p-2 mt-1 border border-gray-300 rounded-lg focus:ring-brand-primary focus:border-brand-primary" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">{t('welcomeScreen.heightLabel')}</label>
                        <div className="flex gap-2 mt-1">
                            <div className="relative w-1/2">
                                <input type="number" placeholder="1" value={heightM} onChange={e => setHeightM(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg" />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">{t('welcomeScreen.heightMetersUnit')}</span>
                            </div>
                            <div className="relative w-1/2">
                                <input type="number" placeholder="75" value={heightCm} onChange={e => setHeightCm(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg" />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">{t('welcomeScreen.heightCentimetersUnit')}</span>
                            </div>
                        </div>
                    </div>
                    {hasChanges && <button onClick={handleSave} className="w-full py-2 px-4 bg-brand-primary text-white font-semibold rounded-lg hover:bg-indigo-700">{t('common.saveChanges')}</button>}
                </div>
                <div className="mt-6 pt-6 border-t bg-white p-4 rounded-lg shadow-sm">
                    <div className="text-center mb-4">
                        <p className="text-sm text-gray-500">{t('avatarDetailScreen.currentLevel')}</p><p className="text-2xl font-bold text-brand-dark">{level}</p>
                        <p className="text-sm text-gray-500">{t('avatarDetailScreen.totalPoints')}</p><p className="text-2xl font-bold text-brand-dark">{points}</p>
                    </div>
                    <h3 className="text-xl font-bold text-brand-dark text-center mb-4">{t('avatarDetailScreen.badgesTitle')}</h3>
                    {earnedBadges.length > 0 ? (
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                            {earnedBadges.map(badge => {
                                const activity = ACTIVITIES.find(a => a.id === badge.activityId); if (!activity) return null;
                                return (<div key={`${badge.activityId}-${badge.tier}`} className="flex flex-col items-center text-center"><div className={`relative p-2 rounded-full border-2 ${getTierColor(badge.tier)}`}><AwardIcon className="w-8 h-8" /><activity.icon className="w-4 h-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-80" /></div><p className="text-xs mt-1 font-semibold text-gray-600">{getBadgeName(badge)}</p></div>);
                            })}
                        </div>
                    ) : (<p className="text-center text-gray-500 text-sm">{t('avatarDetailScreen.noBadgesYet')}</p>)}
                    
                    {potentialBadges.length > 0 && (
                        <>
                            <h4 className="text-lg font-semibold text-brand-dark text-center mt-6 mb-3">{t('avatarDetailScreen.nextBadgesTitle')}</h4>
                            <div className="space-y-4">
                                {potentialBadges.map(badge => {
                                    const activity = ACTIVITIES.find(a => a.id === badge.activityId);
                                    if (!activity) return null;
                                    const progress = Math.min((badge.currentPoints / badge.threshold) * 100, 100);
                                    return (
                                        <div key={`${badge.activityId}-${badge.tier}`} className="bg-gray-50 p-3 rounded-lg border">
                                            <div className="flex items-center gap-3">
                                                <div className="relative p-2 rounded-full border-2 border-gray-300 bg-gray-200 filter grayscale">
                                                    <AwardIcon className="w-8 h-8 text-gray-500" />
                                                    <activity.icon className="w-4 h-4 text-gray-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-80" />
                                                </div>
                                                <div className="flex-grow">
                                                    <p className="font-semibold text-gray-700">{getBadgeName(badge)}</p>
                                                    <p className="text-xs text-gray-500">{t('avatarDetailScreen.badgeRequirement', { threshold: badge.threshold, activityName: t(`activities.${activity.id}.name`) })}</p>
                                                    <div className="w-full bg-gray-300 rounded-full h-2 mt-1">
                                                        <div className="bg-gray-500 h-2 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}

                    <div className="mt-6 flex flex-col items-center"><p className="text-sm text-gray-500 mb-2">{t('avatarDetailScreen.changeLanguage')}</p><LanguageSwitcher /></div>
                     <div className="mt-6 space-y-3">
                        <label htmlFor="unlock-habits" className="flex items-center justify-between bg-gray-100 p-3 rounded-lg border cursor-pointer">
                            <span className="block text-sm text-gray-900 font-medium">{t('avatarDetailScreen.activateAllHabits')}</span>
                            <div className="relative">
                                <input type="checkbox" id="unlock-habits" className="sr-only peer" checked={allHabitsUnlocked} onChange={(e) => onToggleAllHabits(e.target.checked)} />
                                <div className="block w-12 h-6 rounded-full bg-gray-300 peer-checked:bg-brand-secondary transition"></div>
                                <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform transform peer-checked:translate-x-6"></div>
                            </div>
                        </label>
                    </div>
                </div>
                 <div className="mt-8">
                    <button
                        onClick={() => setIsResetModalOpen(true)}
                        className="w-full py-2 px-4 bg-rose-50 text-rose-700 font-semibold rounded-lg hover:bg-rose-100 transition-colors border border-rose-200"
                    >
                        {t('avatarDetailScreen.resetAppButton')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AvatarDetailScreen;