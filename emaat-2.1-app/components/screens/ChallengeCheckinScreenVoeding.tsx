import React, { FC, useState, useRef, useEffect, useMemo } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { ChallengeActivity } from '../../types';
import { XIcon, CameraIcon, SwitchCameraIcon, UtensilsIcon } from '../Icons';

interface ChallengeCheckinScreenVoedingProps {
    activity: ChallengeActivity;
    onComplete: (photoUrl?: string) => void;
    onClose: () => void;
}

const ChallengeCheckinScreenVoeding: FC<ChallengeCheckinScreenVoedingProps> = ({ activity, onComplete, onClose }) => {
    const { t } = useLanguage();
    const [error, setError] = useState<string | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [photo, setPhoto] = useState<string | null>(null);

    const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
    const [currentFacingMode, setCurrentFacingMode] = useState<'user' | 'environment'>('environment');
    
    const title = useMemo(() => {
        switch (activity.type) {
            case 'breakfastCheckin': return t('challengeCheckinVoeding.titleBreakfast');
            case 'lunchCheckin': return t('challengeCheckinVoeding.titleLunch');
            case 'dinnerCheckin': return t('challengeCheckinVoeding.titleDinner');
            case 'snackCheckin': return t('challengeCheckinVoeding.titleSnack');
            case 'drinkCheckin': return t('challengeCheckinVoeding.titleDrink');
            default: return 'Meal Check-in';
        }
    }, [activity.type, t]);
    
    useEffect(() => {
        const getDevices = async () => {
            try {
                const devices = await navigator.mediaDevices.enumerateDevices();
                const videoInputs = devices.filter(d => d.kind === 'videoinput');
                setVideoDevices(videoInputs);
                 if (videoInputs.length < 2) {
                    setCurrentFacingMode('user'); // Default to front camera if only one exists
                }
            } catch (err) {
                console.warn("Could not enumerate devices:", err);
            }
        };
        getDevices();
    }, []);

    useEffect(() => {
        if (photo) {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
                setStream(null);
            }
            return;
        }

        let isCancelled = false;
        let mediaStream: MediaStream | null = null;
        
        const enableCamera = async () => {
            try {
                const constraints = { video: { facingMode: currentFacingMode } };
                mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
                
                if (!isCancelled) {
                    setStream(mediaStream);
                    if (videoRef.current) {
                        videoRef.current.srcObject = mediaStream;
                    }
                } else {
                    mediaStream.getTracks().forEach(track => track.stop());
                }
            } catch (err) {
                if (!isCancelled) {
                    setError(t('welcomeScreen.cameraError'));
                }
                console.error("Error accessing camera:", err);
            }
        };

        enableCamera();

        return () => {
            isCancelled = true;
            if (mediaStream) {
                mediaStream.getTracks().forEach(track => track.stop());
            }
            if (videoRef.current) {
                videoRef.current.srcObject = null;
            }
            setStream(null);
        };
    }, [photo, currentFacingMode, t]);

    const handleTakePhoto = () => {
        if (!videoRef.current || !canvasRef.current) return;
        const v = videoRef.current; const c = canvasRef.current; c.width = v.videoWidth; c.height = v.videoHeight;
        const ctx = c.getContext('2d');
        if (ctx) { 
            if (currentFacingMode === 'user') {
                ctx.translate(v.videoWidth, 0); ctx.scale(-1, 1); 
            }
            ctx.drawImage(v, 0, 0, v.videoWidth, v.videoHeight); setPhoto(c.toDataURL('image/jpeg')); 
        }
    };
    
    const handleSwitchCamera = () => {
        setCurrentFacingMode(prev => prev === 'user' ? 'environment' : 'user');
    };

    return (
        <div className="min-h-screen bg-brand-light font-sans p-4 flex flex-col justify-center items-center animate-fade-in">
             <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
                <header className="flex justify-end items-center mb-2"><button onClick={onClose} className="text-gray-400 hover:text-gray-600"><XIcon className="w-6 h-6"/></button></header>
                <div className="text-center">
                    <div className="flex justify-center items-center gap-2 mb-4">
                        <UtensilsIcon className="w-6 h-6 text-emerald-500" />
                        <h3 className="text-2xl font-bold text-brand-dark">{title}</h3>
                    </div>
                </div>
                <div className="text-center mb-4 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                    <p className="text-sm text-emerald-800">{t('challengeCheckinVoeding.instruction')}</p>
                </div>
                {error && <p className="text-red-500 bg-red-100 p-2 rounded-lg mb-4 text-sm">{error}</p>}
                
                <div className="space-y-4">
                    <div className="text-center">
                        <div className="relative w-full aspect-square bg-brand-dark rounded-xl overflow-hidden mb-2 border-4 border-white/30 shadow-lg">
                            {photo ? <img src={photo} className="w-full h-full object-cover" alt="Meal snapshot" /> : <video ref={videoRef} autoPlay playsInline muted className={`w-full h-full object-cover ${currentFacingMode === 'user' ? 'scale-x-[-1]' : ''}`} />}
                            {!photo && videoDevices.length > 1 && (
                                <button onClick={handleSwitchCamera} className="absolute bottom-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors">
                                    <SwitchCameraIcon className="w-6 h-6" />
                                </button>
                            )}
                        </div>
                        {photo ? (<button onClick={() => setPhoto(null)} className="w-full px-4 py-2 rounded-lg bg-gray-200 text-gray-800 font-semibold">{t('addMemoryScreen.retakePhoto')}</button>) : (<button onClick={handleTakePhoto} disabled={!stream} className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-brand-primary text-white font-semibold"><CameraIcon className="w-5 h-5" />{t('addMemoryScreen.takePhoto')}</button>)}
                    </div>
                </div>

                <canvas ref={canvasRef} className="hidden"/>
                <div className="mt-6 space-y-3">
                    <button onClick={() => onComplete(photo || undefined)} disabled={!photo} className="w-full px-4 py-3 rounded-lg bg-brand-primary text-white font-semibold disabled:bg-gray-400">
                        {t('challengeCheckinVoeding.saveButton')}
                    </button>
                    <button onClick={() => onComplete(undefined)} className="w-full text-sm text-gray-500 hover:text-brand-primary">
                        {t('challengeCheckinVoeding.skipButton')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChallengeCheckinScreenVoeding;