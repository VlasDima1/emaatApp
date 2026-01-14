


import React, { FC, useState, useRef, useEffect } from 'react';
import { UserInfo, Gender } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { CameraIcon, SpinnerIcon, SwitchCameraIcon } from '../Icons';
import { calculateAge } from '../../utils';

interface OnboardingUserInfoScreenProps {
    onOnboardingComplete: (userInfo: UserInfo, imageDataUrl: string, weight: number | null, height: number | null) => void;
    isGenerating: boolean;
}

const OnboardingUserInfoScreen: FC<OnboardingUserInfoScreenProps> = ({ onOnboardingComplete, isGenerating }) => {
    const { t } = useLanguage();
    const [error, setError] = useState<string | null>(null);
    const [userInfo, setUserInfo] = useState<Partial<UserInfo>>({ name: '', dateOfBirth: null, gender: 'unspecified', email: '' });
    const [weight, setWeight] = useState<number | null>(null);
    const [heightM, setHeightM] = useState('');
    const [heightCm, setHeightCm] = useState('');
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
    const [currentFacingMode, setCurrentFacingMode] = useState<'user' | 'environment'>('user');

    useEffect(() => {
        const getDevices = async () => {
            try {
                const tempStream = await navigator.mediaDevices.getUserMedia({ video: true });
                const devices = await navigator.mediaDevices.enumerateDevices();
                const videoInputs = devices.filter(d => d.kind === 'videoinput');
                setVideoDevices(videoInputs);
                tempStream.getTracks().forEach(track => track.stop());
            } catch (err) {
                console.warn("Could not enumerate video devices:", err);
            }
        };
        getDevices();
    }, []);

    useEffect(() => {
        let activeStream: MediaStream | null = null;
        const enableCamera = async () => {
            try {
                const constraints = { video: { facingMode: currentFacingMode } };
                const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
                activeStream = mediaStream;
                setStream(mediaStream);
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                }
            } catch (err) {
                console.error("Error accessing camera:", err);
                setError(t('welcomeScreen.cameraError'));
            }
        };
        enableCamera();
        return () => {
            if (activeStream) {
                activeStream.getTracks().forEach(track => track.stop());
            }
        };
    }, [t, currentFacingMode]);

    const handleSwitchCamera = () => {
        setCurrentFacingMode(prev => prev === 'user' ? 'environment' : 'user');
    };

    const handleTakePhoto = () => {
        if (!videoRef.current || !canvasRef.current || isGenerating) return;
        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext('2d');
        if (context) {
            if (currentFacingMode === 'user') {
                context.translate(video.videoWidth, 0);
                context.scale(-1, 1);
            }
            context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
            
            const heightInCm = (parseInt(heightM, 10) || 0) * 100 + (parseInt(heightCm, 10) || 0);

            const finalUserInfo: UserInfo = {
                name: userInfo.name?.trim() === '' ? t('common.defaultUserName') : userInfo.name!.trim(),
                gender: userInfo.gender || 'unspecified',
                dateOfBirth: userInfo.dateOfBirth,
                email: userInfo.email,
                age: calculateAge(userInfo.dateOfBirth),
                height: heightInCm > 0 ? heightInCm : null,
            };

            onOnboardingComplete(finalUserInfo, canvas.toDataURL('image/jpeg'), weight, finalUserInfo.height);
            
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        } else {
            setError(t('welcomeScreen.captureError'));
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-brand-light font-sans p-4">
            <div className="text-center bg-white p-6 rounded-2xl shadow-xl max-w-md w-full">
                <h1 className="text-4xl md:text-5xl font-bold text-brand-dark mb-2">{t('welcomeScreen.title')}</h1>
                <p className="text-lg md:text-xl mb-4 text-gray-600">{t('welcomeScreen.nameSubtitle')}</p>
                <div className="space-y-4 text-left mb-6">
                    <div>
                        <label htmlFor="name-input" className="block text-sm font-medium text-gray-700 mb-1">{t('common.yourName')}</label>
                        <input id="name-input" type="text" placeholder={t('welcomeScreen.namePlaceholder')} value={userInfo.name} onChange={e => setUserInfo(u => ({ ...u, name: e.target.value }))} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-brand-primary focus:border-brand-primary" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="dob-input" className="block text-sm font-medium text-gray-700 mb-1">{t('welcomeScreen.dateOfBirthLabel')}</label>
                            <input id="dob-input" type="date" value={userInfo.dateOfBirth || ''} onChange={e => setUserInfo(u => ({ ...u, dateOfBirth: e.target.value }))} className="w-full p-3 border border-gray-300 rounded-lg" />
                        </div>
                        <div>
                            <label htmlFor="gender-select" className="block text-sm font-medium text-gray-700 mb-1">{t('common.yourGender')}</label>
                            <select id="gender-select" value={userInfo.gender} onChange={e => setUserInfo(u => ({ ...u, gender: e.target.value as Gender }))} className="w-full p-3 border border-gray-300 rounded-lg bg-white">
                                <option value="unspecified">{t('common.genderUnspecified')}</option>
                                <option value="female">{t('common.genderFemale')}</option>
                                <option value="male">{t('common.genderMale')}</option>
                            </select>
                        </div>
                    </div>
                     <div>
                        <label htmlFor="email-input" className="block text-sm font-medium text-gray-700 mb-1">{t('welcomeScreen.emailLabel')}</label>
                        <input id="email-input" type="email" placeholder={t('welcomeScreen.emailPlaceholder')} value={userInfo.email || ''} onChange={e => setUserInfo(u => ({ ...u, email: e.target.value }))} className="w-full p-3 border border-gray-300 rounded-lg" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="weight-input" className="block text-sm font-medium text-gray-700 mb-1">{t('welcomeScreen.weightLabel')}</label>
                            <div className="relative">
                                <input id="weight-input" type="number" step="0.1" placeholder="70.0" value={weight || ''} onChange={e => setWeight(e.target.value === '' ? null : parseFloat(e.target.value))} className="w-full p-3 border border-gray-300 rounded-lg" />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">{t('welcomeScreen.weightUnit')}</span>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('welcomeScreen.heightLabel')}</label>
                            <div className="flex gap-2">
                                <div className="relative w-1/2">
                                    <input type="number" placeholder="1" value={heightM} onChange={e => setHeightM(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg" />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">{t('welcomeScreen.heightMetersUnit')}</span>
                                </div>
                                <div className="relative w-1/2">
                                    <input type="number" placeholder="75" value={heightCm} onChange={e => setHeightCm(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg" />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">{t('welcomeScreen.heightCentimetersUnit')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <p className="text-lg md:text-xl mb-4 text-gray-600">{t('welcomeScreen.photoSubtitle')}</p>
                <div className="relative w-full aspect-square bg-brand-dark rounded-xl overflow-hidden mb-6 border-4 border-white shadow-lg">
                    <video ref={videoRef} autoPlay playsInline muted className={`w-full h-full object-cover ${currentFacingMode === 'user' ? 'scale-x-[-1]' : ''}`} />
                    {videoDevices.length > 1 && (
                        <button 
                            onClick={handleSwitchCamera} 
                            className="absolute bottom-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors z-10"
                            aria-label="Switch camera"
                        >
                            <SwitchCameraIcon className="w-6 h-6" />
                        </button>
                    )}
                    {!stream && !error && (<div className="absolute inset-0 flex items-center justify-center bg-black/50"><p className="animate-pulse text-white">{t('loading.startingCamera')}</p></div>)}
                </div>
                <canvas ref={canvasRef} className="hidden" />
                <button onClick={handleTakePhoto} disabled={!stream || !!error || isGenerating} className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl cursor-pointer bg-brand-primary text-white font-bold text-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-70 transition-all duration-300">
                    {isGenerating ? <SpinnerIcon className="w-6 h-6 animate-spin" /> : <CameraIcon className="w-6 h-6" />}
                    <span>{isGenerating ? t('loading.creatingAvatar') : t('welcomeScreen.createButton')}</span>
                </button>
                {error && <p className="mt-4 text-rose-500 bg-rose-100 p-3 rounded-lg">{error}</p>}
            </div>
        </div>
    );
};

export default OnboardingUserInfoScreen;