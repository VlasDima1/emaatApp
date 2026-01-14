import React, { FC, useState, useRef, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Memory } from '../types';
import { CameraIcon, SwitchCameraIcon, LockIcon } from './Icons';

interface AddMemorySubformProps {
    onMemoryChange: (memory: Memory | undefined) => void;
}

const AddMemorySubform: FC<AddMemorySubformProps> = ({ onMemoryChange }) => {
    const { t, language } = useLanguage();
    const [error, setError] = useState<string | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [photo, setPhoto] = useState<string | null>(null);
    const [text, setText] = useState('');
    const [isPrivate, setIsPrivate] = useState(true);

    const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
    const [currentFacingMode, setCurrentFacingMode] = useState<'user' | 'environment'>('environment');

    // Effect to update parent component when memory data changes
    useEffect(() => {
        if (!photo && !text.trim()) {
            onMemoryChange(undefined);
            return;
        }

        const memory: Memory = { isPrivate };
        if (photo) {
            memory.photoUrl = photo;
        }
        if (text.trim()) {
            memory.content = text.trim();
        }
        onMemoryChange(memory);
    }, [photo, text, isPrivate, onMemoryChange]);

    useEffect(() => {
        const getDevices = async () => {
            try {
                // We need to request permission first for enumerateDevices to return full info
                const tempStream = await navigator.mediaDevices.getUserMedia({ video: true });
                const devices = await navigator.mediaDevices.enumerateDevices();
                const videoInputs = devices.filter(d => d.kind === 'videoinput');
                setVideoDevices(videoInputs);
                // Stop the temporary stream
                tempStream.getTracks().forEach(track => track.stop());
            } catch (err) {
                console.warn("Could not enumerate video devices:", err);
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
        if (!photo) {
            enableCamera();
        }

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
        <div className="space-y-4 pt-4 mt-4 border-t">
            <h4 className="font-semibold text-brand-dark mb-2 text-center">{t('addMemoryScreen.yourMemory')}</h4>
            {error && <p className="text-red-500 bg-red-100 p-2 rounded-lg text-sm">{error}</p>}

            {/* Photo Section */}
            <div className="text-center">
                <div className="relative w-full aspect-square bg-brand-dark rounded-xl overflow-hidden mb-2 border-4 border-white/30 shadow-lg">
                    {photo ? <img src={photo} className="w-full h-full object-cover" alt="Memory snapshot" /> : <video ref={videoRef} autoPlay playsInline muted className={`w-full h-full object-cover ${currentFacingMode === 'user' ? 'scale-x-[-1]' : ''}`} />}
                    {!photo && videoDevices.length > 1 && (
                        <button onClick={handleSwitchCamera} className="absolute bottom-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors">
                            <SwitchCameraIcon className="w-6 h-6" />
                        </button>
                    )}
                </div>
                {photo ? (<button onClick={() => setPhoto(null)} className="w-full px-4 py-2 rounded-lg bg-gray-200 text-gray-800 font-semibold">{t('addMemoryScreen.retakePhoto')}</button>) : (<button onClick={handleTakePhoto} disabled={!stream} className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-brand-primary text-white font-semibold"><CameraIcon className="w-5 h-5" />{t('addMemoryScreen.takePhoto')}</button>)}
            </div>

            {/* Text Section */}
             <div>
                <textarea value={text} onChange={(e) => setText(e.target.value)} rows={3} placeholder={t('addMemoryScreen.textPlaceholder')} className="w-full p-2 border border-gray-300 rounded-lg mb-2 focus:ring-brand-primary focus:border-brand-primary" />
            </div>

            <canvas ref={canvasRef} className="hidden"/>

            <div>
                <label htmlFor="private-toggle-subform" className="flex items-center justify-between bg-gray-100 p-3 rounded-lg border cursor-pointer">
                    <div className="flex items-center gap-2">
                        <LockIcon className="w-5 h-5 text-gray-600" />
                        <span className="block text-sm text-gray-900 font-medium">{t('addMemoryScreen.privateMemory')}</span>
                    </div>
                    <div className="relative">
                        <input type="checkbox" id="private-toggle-subform" className="sr-only peer" checked={isPrivate} onChange={(e) => setIsPrivate(e.target.checked)} />
                        <div className="block w-12 h-6 rounded-full bg-gray-300 peer-checked:bg-brand-secondary transition"></div>
                        <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform transform peer-checked:translate-x-6"></div>
                    </div>
                </label>
            </div>
        </div>
    );
};

export default AddMemorySubform;