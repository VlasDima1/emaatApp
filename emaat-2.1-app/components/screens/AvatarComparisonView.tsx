import React, { FC } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { ArrowRightIcon, SpinnerIcon } from '../Icons';
import { useAsset } from '../../hooks/useAsset';

interface AvatarComparisonViewProps {
    beforeAvatarKey: string;
    afterAvatarKey: string;
    onClose: () => void;
}

const AvatarImage: FC<{ assetKey: string, borderColor: string }> = ({ assetKey, borderColor }) => {
    const [avatarUrl, loading] = useAsset(assetKey);
    if (loading) {
        return <div className="w-40 h-40 md:w-64 md:h-64 rounded-full bg-gray-700 flex items-center justify-center"><SpinnerIcon className="w-12 h-12 text-white animate-spin" /></div>;
    }
    return <img src={avatarUrl || ''} alt="Avatar" className={`w-40 h-40 md:w-64 md:h-64 rounded-full border-8 ${borderColor} object-cover shadow-2xl`} />;
}

const AvatarComparisonView: FC<AvatarComparisonViewProps> = ({ beforeAvatarKey, afterAvatarKey, onClose }) => {
    const { t } = useLanguage();
    return (
        <div className="min-h-screen bg-brand-dark font-sans p-4 flex flex-col justify-center items-center animate-fade-in">
            <div className="flex-grow flex items-center justify-center gap-4 md:gap-8">
                <div className="text-center">
                    <h3 className="text-xl font-bold text-white mb-2">{t('lifeStepDetailScreen.before')}</h3>
                    <AvatarImage assetKey={beforeAvatarKey} borderColor="border-gray-400" />
                </div>
                <ArrowRightIcon className="w-10 h-10 text-white flex-shrink-0" />
                <div className="text-center">
                    <h3 className="text-xl font-bold text-white mb-2">{t('lifeStepDetailScreen.after')}</h3>
                    <AvatarImage assetKey={afterAvatarKey} borderColor="border-brand-secondary" />
                </div>
            </div>
            <div className="w-full max-w-xs mt-8">
                <button onClick={onClose} className="w-full py-3 px-4 bg-white/20 text-white font-semibold rounded-lg hover:bg-white/30 transition-colors">{t('common.closeButton')}</button>
            </div>
        </div>
    );
};

export default AvatarComparisonView;