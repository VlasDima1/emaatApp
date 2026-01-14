import React, { FC, useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { XIcon, CameraIcon, SwitchCameraIcon, SpinnerIcon } from '../Icons';

interface LogCigaretteScreenProps {
    onComplete: (photoUrl: string) => void;
    onClose: () => void;
}

const LogCigaretteScreen: FC<LogCigaretteScreenProps> = ({ onComplete, onClose }) => {
    const { t } = useLanguage();
    const [error, setError] = useState<string | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
    const [currentFacingMode, setCurrentFacingMode] = useState<'user' | 'environment'>('environment');

    useEffect(() => {
        const getDevices = async () => {
            try {
                const tempStream = await navigator.mediaDevices.getUserMedia({ video: true });
                const devices = await navigator.mediaDevices.enumerateDevices();
                const videoInputs = devices.filter(d => d.kind === 'videoinput');
                setVideoDevices(videoInputs);
                if (videoInputs.length < 2) {
                    setCurrentFacingMode('user');
                }
                tempStream.getTracks().forEach(track => track.stop());
            } catch (err) {
                console.warn("Could not enumerate devices:", err);
            }
        };
        getDevices();
    }, []);

    useEffect(() => {
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
    }, [currentFacingMode, t]);

    const handleTakePhoto = () => {
        if (!videoRef.current || !canvasRef.current || isSaving) return;
        setIsSaving(true);
        const v = videoRef.current;
        const c = canvasRef.current;
        c.width = v.videoWidth;
        c.height = v.videoHeight;
        const ctx = c.getContext('2d');
        if (ctx) { 
            if (currentFacingMode === 'user') {
                ctx.translate(v.videoWidth, 0); ctx.scale(-1, 1); 
            }
            ctx.drawImage(v, 0, 0, v.videoWidth, v.videoHeight);
            onComplete(c.toDataURL('image/jpeg'));
        } else {
            setError(t('welcomeScreen.captureError'));
            setIsSaving(false);
        }
    };
    
    const handleSwitchCamera = () => {
        setCurrentFacingMode(prev => prev === 'user' ? 'environment' : 'user');
    };

    return (
        <div className="fixed inset-0 bg-black/80 z-40 flex flex-col items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
                <header className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-brand-dark">{t('mainScreen.logSmoke')}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600" disabled={isSaving}><XIcon className="w-6 h-6"/></button>
                </header>
                <p className="text-center text-gray-600 mb-4">{t('challenge.stopRokenChallenge.logCigaretteInstruction')}</p>
                {error && <p className="text-red-500 bg-red-100 p-2 rounded-lg mb-4 text-sm">{error}</p>}
                <div className="relative w-full aspect-square bg-brand-dark rounded-xl overflow-hidden mb-4 border-4 border-white/30 shadow-lg">
                    <video ref={videoRef} autoPlay playsInline muted className={`w-full h-full object-cover ${currentFacingMode === 'user' ? 'scale-x-[-1]' : ''}`} />
                    {!stream && !error && (<div className="absolute inset-0 flex items-center justify-center bg-black/50"><p className="animate-pulse text-white">{t('loading.startingCamera')}</p></div>)}
                    {videoDevices.length > 1 && (
                        <button onClick={handleSwitchCamera} disabled={isSaving} className="absolute bottom-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors">
                            <SwitchCameraIcon className="w-6 h-6" />
                        </button>
                    )}
                </div>
                <button onClick={handleTakePhoto} disabled={!stream || isSaving} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-brand-primary text-white font-semibold text-lg disabled:bg-gray-400">
                    {isSaving ? <SpinnerIcon className="w-6 h-6 animate-spin"/> : <CameraIcon className="w-6 h-6" />}
                    <span>{isSaving ? t('loading.processingStep') : t('addMemoryScreen.takePhoto')}</span>
                </button>
                 <canvas ref={canvasRef} className="hidden"/>
            </div>
        </div>
    );
};

export default LogCigaretteScreen;
