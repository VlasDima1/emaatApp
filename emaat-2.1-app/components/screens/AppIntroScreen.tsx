



import React, { FC, useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { ArrowRightIcon, QrCodeIcon, XIcon } from '../Icons';

interface AppIntroScreenProps {
    onContinue: () => void;
}

const AppIntroScreen: FC<AppIntroScreenProps> = ({ onContinue }) => {
    const { t } = useLanguage();
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [isScanning, setIsScanning] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);

    const handleContinue = () => {
        const trimmedCode = code.trim();
        if (trimmedCode.toLowerCase() === 'demo' || trimmedCode.length > 0) {
            onContinue();
        } else {
            setError(t('appIntroScreen.errorCodeInvalid'));
        }
    };

    useEffect(() => {
        if (isScanning) {
            let activeStream: MediaStream | null = null;
            const startCamera = async () => {
                try {
                    const constraints = { video: { facingMode: 'environment' } };
                    const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
                    activeStream = mediaStream;
                    setStream(mediaStream);
                    if (videoRef.current) {
                        videoRef.current.srcObject = mediaStream;
                    }
                } catch (err) {
                    console.error("Error accessing camera:", err);
                    setError(t('appIntroScreen.cameraPermission'));
                    setIsScanning(false);
                }
            };
            startCamera();

            // Simulate scan success after 2 seconds for demonstration
            const scanTimer = setTimeout(() => {
                setCode('demo');
                setIsScanning(false);
                // Stop stream
                if (activeStream) {
                    activeStream.getTracks().forEach(track => track.stop());
                }
                // Optional: feedback
                // alert(t('appIntroScreen.codeScanned')); 
            }, 2000);

            return () => {
                clearTimeout(scanTimer);
                if (activeStream) {
                    activeStream.getTracks().forEach(track => track.stop());
                }
            };
        } else {
             if (stream) {
                stream.getTracks().forEach(track => track.stop());
                setStream(null);
            }
        }
    }, [isScanning, t]);

    const handleCloseScanner = () => {
        setIsScanning(false);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-brand-light font-sans p-4">
            {isScanning && (
                <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center">
                    <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover" />
                    
                    <div className="absolute inset-0 border-[50px] border-black/50 flex items-center justify-center">
                         <div className="w-64 h-64 border-2 border-white/70 relative">
                             <div className="absolute top-0 left-0 w-full h-1 bg-red-500/80 animate-[scan_2s_infinite]"></div>
                         </div>
                    </div>
                    
                    <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center bg-gradient-to-b from-black/70 to-transparent">
                         <p className="text-white font-semibold">{t('appIntroScreen.scanQrCode')}</p>
                         <button onClick={handleCloseScanner} className="p-2 bg-white/20 rounded-full text-white hover:bg-white/30">
                             <XIcon className="w-6 h-6" />
                         </button>
                    </div>
                    
                    <div className="absolute bottom-10 text-white text-sm bg-black/60 px-4 py-2 rounded-full">
                        Scanning...
                    </div>

                    <style>{`
                        @keyframes scan {
                            0% { top: 0; opacity: 0; }
                            10% { opacity: 1; }
                            90% { opacity: 1; }
                            100% { top: 100%; opacity: 0; }
                        }
                    `}</style>
                </div>
            )}

            <div className="text-center bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
                <h1 className="text-4xl md:text-5xl font-bold text-brand-dark mb-2">{t('appIntroScreen.title')}</h1>
                <p className="text-base text-gray-600 mb-6">{t('appIntroScreen.description')}</p>
                
                <div className="space-y-4 text-left mb-6">
                    <div>
                        <label htmlFor="code-input" className="block text-sm font-medium text-gray-700 mb-1">{t('appIntroScreen.codeLabel')}</label>
                        <div className="flex gap-2">
                            <input 
                                id="code-input" 
                                type="text" 
                                placeholder={t('appIntroScreen.codePlaceholder')} 
                                value={code} 
                                onChange={e => { setCode(e.target.value); setError(''); }} 
                                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-brand-primary focus:border-brand-primary" 
                            />
                            <button 
                                onClick={() => setIsScanning(true)}
                                className="p-3 bg-gray-100 text-gray-600 rounded-lg border border-gray-300 hover:bg-gray-200 transition-colors"
                                aria-label={t('appIntroScreen.scanQrCode')}
                                title={t('appIntroScreen.scanQrCode')}
                            >
                                <QrCodeIcon className="w-6 h-6" />
                            </button>
                        </div>
                         <p className="text-xs text-gray-500 mt-1">{t('appIntroScreen.demoInfo')}</p>
                         {error && <p className="text-xs text-rose-500 mt-1">{error}</p>}
                    </div>
                </div>

                <button 
                    onClick={handleContinue}
                    disabled={!code.trim()}
                    className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl cursor-pointer bg-brand-primary text-white font-bold text-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-70 transition-all duration-300"
                >
                    <span>{t('appIntroScreen.continueButton')}</span>
                    <ArrowRightIcon className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
};

export default AppIntroScreen;
