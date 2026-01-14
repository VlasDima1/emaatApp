import React, { FC, useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { FireIcon } from './Icons';

interface StreakCounterProps {
  streak: number;
  lastActivityDate: string | null;
}

const StreakCounter: FC<StreakCounterProps> = ({ streak, lastActivityDate }) => {
  const { t } = useLanguage();
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    if (streak > 0) {
      const timer = setInterval(() => {
        const now = new Date();
        const todayStr = now.toISOString().split('T')[0];
        
        const targetDate = new Date();
        
        // If last activity was today, the deadline is TOMORROW night.
        // If last activity was NOT today (yesterday or earlier), the deadline is TONIGHT.
        if (lastActivityDate === todayStr) {
             targetDate.setDate(targetDate.getDate() + 1);
        }
        
        // Set the time to the very end of the target day
        targetDate.setHours(23, 59, 59, 999);

        const diff = targetDate.getTime() - now.getTime();

        if (diff <= 0) {
          setTimeLeft("00:00:00");
          clearInterval(timer);
          return;
        }

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        setTimeLeft(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [streak, lastActivityDate]);

  if (streak === 0) {
    return null;
  }

  return (
    <div className="mt-4 bg-white/80 backdrop-blur-sm p-3 rounded-xl shadow-md flex items-center justify-center space-x-4">
      <FireIcon className="w-7 h-7 text-amber-500" />
      <div className="text-center">
        <p className="font-semibold text-sm text-brand-dark">{t('streak.title')}</p>
        <p className="text-xs text-gray-600">{t('streak.days', { count: streak })}</p>
      </div>
      <div className="text-center pl-4 border-l border-gray-200">
        <p className="font-mono font-bold text-base text-brand-dark tracking-wider">{timeLeft}</p>
        <p className="text-xs text-gray-600">{t('streak.timeLeft')}</p>
      </div>
    </div>
  );
};

export default StreakCounter;