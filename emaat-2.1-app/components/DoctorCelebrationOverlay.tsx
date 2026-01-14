
import React, { FC, useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { PendingCelebration } from '../types';
import { ACTIVITIES } from '../constants';
import { StarIcon, BedIcon, DumbbellIcon, UtensilsIcon, SmokingIcon, UsersIcon, LeafIcon } from './Icons';

interface DoctorCelebrationOverlayProps {
    pendingCelebration: PendingCelebration;
    currentAvatar: string | null;
    onCommit: () => void;
    onComplete: () => void;
}

const DOCTOR_AVATAR_URL = "https://api.dicebear.com/9.x/avataaars/svg?seed=DrBrouw&clothing=blazerAndShirt&accessories=prescription02&facialHair=mustache&top=shortFlat";

const DoctorCelebrationOverlay: FC<DoctorCelebrationOverlayProps> = ({ pendingCelebration, currentAvatar, onCommit, onComplete }) => {
    const { t } = useLanguage();
    const [phase, setPhase] = useState(0); // 0: Init, 1: Enter, 2: XP, 3: Drop, 4: Exit

    useEffect(() => {
        // Sequence timing
        const t1 = setTimeout(() => setPhase(1), 100);   // Enter: 0.1s
        const t2 = setTimeout(() => setPhase(2), 1500);  // XP Push: 1.5s
        const t3 = setTimeout(() => {
            setPhase(3);                                // Drop: 3.0s
            setTimeout(onCommit, 800);                  // Commit slightly after drop starts (when it lands)
        }, 3000); 
        const t4 = setTimeout(() => setPhase(4), 5000);  // Exit: 5.0s (wait for speech bubble)
        const t5 = setTimeout(() => onComplete(), 6500); // Finish: 6.5s

        return () => {
            clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); clearTimeout(t5);
        };
    }, []);

    const activityId = pendingCelebration.type === 'step' 
        ? (pendingCelebration.payload as any).lifeStory[0].activity.id
        : (pendingCelebration.payload as any).newLifeStep.activity.id;

    const activity = ACTIVITIES.find(a => a.id === activityId);
    const Icon = activity ? activity.icon : StarIcon;
    const activityColor = activity ? activity.color : 'text-yellow-500';

    return (
        <div className="fixed inset-0 z-[200] pointer-events-none flex items-center justify-center overflow-hidden">
            {/* Background Dim (Optional, kept minimal to allow seeing app underneath) */}
            <div className={`absolute inset-0 bg-white/30 backdrop-blur-[1px] transition-opacity duration-500 ${phase >= 1 && phase < 4 ? 'opacity-100' : 'opacity-0'}`}></div>

            {/* User Avatar (Left) */}
            <div 
                className={`absolute transition-all duration-1000 ease-out transform ${phase >= 1 && phase < 4 ? 'left-10 opacity-100 translate-x-0' : '-left-40 opacity-0 -translate-x-20'}`}
                style={{ bottom: '20%' }}
            >
                {currentAvatar && (
                     <img src={currentAvatar} alt="Me" className="w-32 h-32 rounded-full border-4 border-white shadow-xl object-cover" />
                )}
            </div>

            {/* Doctor Avatar (Right) */}
            <div 
                className={`absolute transition-all duration-1000 ease-out transform flex flex-col items-center
                    ${phase === 0 ? 'right-[-200px] opacity-0' : ''}
                    ${phase === 1 ? 'right-10 opacity-100 translate-y-0' : ''}
                    ${phase === 2 ? 'right-10 -translate-y-[40vh] scale-90' : ''} 
                    ${phase === 3 ? 'right-1/2 translate-x-1/2 translate-y-0 scale-110' : ''}
                    ${phase === 4 ? 'right-[-200px] opacity-0' : ''}
                `}
                style={{ bottom: '20%' }}
            >
                {/* Speech Bubble */}
                <div className={`absolute -top-24 right-10 bg-white p-3 rounded-xl rounded-br-none shadow-lg border-2 border-indigo-100 transition-all duration-500 transform ${phase === 4 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`} style={{ width: '200px' }}>
                    <p className="text-sm font-bold text-brand-dark">{t('doctor.seeYouNextStep')}</p>
                </div>

                {/* Nodding Animation Wrapper */}
                <div className={`${phase === 1 ? 'animate-bounce' : ''}`}>
                     <img src={DOCTOR_AVATAR_URL} alt="Dr. Brouw" className="w-32 h-32 rounded-full border-4 border-indigo-500 shadow-xl bg-white" />
                </div>

                {/* Step Card (Only visible during Drop phase) */}
                <div className={`absolute top-20 transition-all duration-500 transform ${phase === 3 ? 'opacity-100 translate-y-20' : 'opacity-0 translate-y-0'}`}>
                     <div className="bg-white p-3 rounded-full shadow-2xl border-4 border-white animate-pulse">
                        <Icon className={`w-12 h-12 ${activityColor}`} />
                     </div>
                </div>
            </div>

            {/* Simulated XP Bar Interaction (Top Right) */}
             <div className={`absolute top-6 right-6 transition-all duration-500 ${phase === 2 ? 'scale-125' : 'scale-100'}`}>
                {phase === 2 && (
                     <div className="absolute -left-8 top-0 animate-ping">
                        <StarIcon className="w-8 h-8 text-yellow-400" />
                     </div>
                )}
            </div>

        </div>
    );
};

export default DoctorCelebrationOverlay;
