
import React, { FC, useState, useRef, useEffect, useMemo } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Measurement, MeasurementType, Memory, HeartRateCondition, BloodGlucoseTiming, SleepDurationMeasurement } from '../../types';
import { XIcon, CameraIcon, MicrophoneIcon, ImageIcon, PencilIcon, SwitchCameraIcon, LockIcon } from '../Icons';
import { MEASUREMENT_CONFIG } from '../../constants';

type FormData = {
    [key: string]: any;
};

// Define the interface for SpeechRecognition to be used as a type.
interface SpeechRecognition {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start(): void;
    stop(): void;
    onresult: (event: any) => void;
    onend: () => void;
    onerror: (event: any) => void;
}

declare global {
    interface Window {
        SpeechRecognition: { new(): SpeechRecognition };
        webkitSpeechRecognition: { new(): SpeechRecognition };
    }
}

// --- START OF LIFESTYLE TIPS DATA ---
const lifestylePillars: Record<string, MeasurementType[]> = {
    nutrition: ['bloodGlucose', 'bloodPressure', 'weight', 'temperature'],
    activity: ['heartRate', 'bloodPressure', 'steps', 'bloodGlucose', 'weight', 'oxygenSaturation'],
    sleep: ['heartRate', 'bloodPressure', 'bloodGlucose', 'weight', 'temperature', 'oxygenSaturation'],
    stress: ['heartRate', 'bloodPressure', 'bloodGlucose', 'weight', 'temperature', 'oxygenSaturation'],
    hydration: ['heartRate', 'bloodPressure', 'bloodGlucose', 'temperature', 'oxygenSaturation'],
    social: ['heartRate', 'bloodPressure', 'bloodGlucose', 'weight', 'steps'],
    preventive: ['bloodPressure', 'bloodGlucose', 'weight', 'temperature', 'oxygenSaturation', 'heartRate'],
};

const getRelevantPillars = (measurementType: MeasurementType) => {
    return (Object.keys(lifestylePillars) as Array<keyof typeof lifestylePillars>)
        .filter(pillar => lifestylePillars[pillar].includes(measurementType));
};
// --- END OF LIFESTYLE TIPS DATA ---


interface LogMeasurementScreenProps {
    measurementType: MeasurementType;
    measurements: Measurement[];
    onSave: (measurement: Omit<Measurement, 'id' | 'memory'>, timestamp: Date, memory?: Memory) => void;
    onClose: () => void;
}

const dateToDateTimeLocal = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return {
        date: `${year}-${month}-${day}`,
        time: `${hours}:${minutes}`,
    };
};

const dateTimeLocalToDate = (dateStr: string, timeStr: string) => {
    return new Date(`${dateStr}T${timeStr}`);
};


const LogMeasurementScreen: FC<LogMeasurementScreenProps> = ({ measurementType, measurements, onSave, onClose }) => {
    const { t, language } = useLanguage();
    const config = MEASUREMENT_CONFIG[measurementType];
    const { icon: Icon, color } = config;

    const [formData, setFormData] = useState<FormData>({});
    const [timestamp, setTimestamp] = useState(new Date());
    const [memoryMode, setMemoryMode] = useState<'none' | 'photo' | 'text'>('none');
    const [photo, setPhoto] = useState<string | null>(null);
    const [text, setText] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [isPrivate, setIsPrivate] = useState(true);
    const [showInstructions, setShowInstructions] = useState(false);
    const [selectedTip, setSelectedTip] = useState<{ pillar: string; content: string } | null>(null);
    const [validationError, setValidationError] = useState<string | null>(null);
    const [speechError, setSpeechError] = useState<string | null>(null);
    const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);

    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [currentFacingMode, setCurrentFacingMode] = useState<'user' | 'environment'>('environment');

     useEffect(() => {
        // Initialize form data based on measurement type
        switch (measurementType) {
            case 'heartRate': setFormData({ value: 60, condition: 'resting' }); break;
            case 'bloodPressure': setFormData({ systolic: 120, diastolic: 80 }); break;
            case 'bloodGlucose': setFormData({ value: 5.0, timing: 'N' }); break;
            case 'steps': setFormData({ value: 1000 }); break;
            case 'weight': setFormData({ value: 70.0 }); break;
            case 'temperature': setFormData({ value: 36.6 }); break;
            case 'oxygenSaturation': setFormData({ value: 98 }); break;
            case 'sleepDuration': setFormData({ hours: 8, minutes: 0 }); break;
            default: setFormData({});
        }
        
        // Select a random lifestyle tip
        const relevantPillars = getRelevantPillars(measurementType);
        if (relevantPillars.length > 0) {
            const randomPillar = relevantPillars[Math.floor(Math.random() * relevantPillars.length)];
            const pillarName = t(`lifestyle.pillars.${randomPillar}.name`);
            const tipContent = t(`lifestyle.tips.${measurementType}.${randomPillar}`);
            if (tipContent) {
                setSelectedTip({ pillar: pillarName, content: tipContent });
            }
        }
    }, [measurementType, t]);

    useEffect(() => {
        const getDevices = async () => {
            try {
                if (memoryMode === 'photo') {
                    const devices = await navigator.mediaDevices.enumerateDevices();
                    const videoInputs = devices.filter(d => d.kind === 'videoinput');
                    setVideoDevices(videoInputs);
                }
            } catch (err) {
                console.warn("Could not enumerate devices:", err);
            }
        };
        getDevices();
    }, [memoryMode]);


    useEffect(() => {
        if (memoryMode !== 'photo' || photo) {
            if (stream) stream.getTracks().forEach(track => track.stop());
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
                    if (videoRef.current) videoRef.current.srcObject = mediaStream;
                } else {
                    mediaStream.getTracks().forEach(track => track.stop());
                }
            } catch (err) { console.error("Error accessing camera:", err); }
        };

        enableCamera();

        return () => {
            isCancelled = true;
            if (mediaStream) mediaStream.getTracks().forEach(track => track.stop());
            if (videoRef.current) videoRef.current.srcObject = null;
            setStream(null);
        };
    }, [memoryMode, photo, currentFacingMode]);


    const handleFormChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        if (measurementType === 'sleepDuration') {
            const dateKey = timestamp.toISOString().split('T')[0];
            const hasExisting = measurements.some(m => m.type === 'sleepDuration' && m.timestamp.toISOString().split('T')[0] === dateKey);
            if (hasExisting) {
                setValidationError(t('measurements.errors.sleepExists'));
                return;
            }
        }

        let memory: Memory | undefined;
        if (photo || text.trim()) {
            memory = { isPrivate };
            if (photo) {
                memory.photoUrl = photo;
            }
            if (text.trim()) {
                memory.content = text.trim();
            }
        }
        
        const measurementData = {
            type: measurementType,
            ...formData,
        } as Omit<Measurement, 'id' | 'memory'>;
        
        onSave(measurementData, timestamp, memory);
    };

    const toggleRecording = () => {
        setSpeechError(null);
        if (isRecording) {
            recognitionRef.current?.stop();
            setIsRecording(false);
            return;
        }
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SR) {
             setSpeechError(t('addMemoryScreen.speechRecognitionError'));
             return;
        }
        
        const recognition = new SR();
        recognitionRef.current = recognition;
        recognition.lang = language;
        recognition.continuous = true;
        recognition.interimResults = true;
        
        recognition.onresult = (event: any) => {
            let final = text ? text + ' ' : '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    final += event.results[i][0].transcript;
                }
            }
            setText(final);
        };
        
        recognition.onerror = (event: any) => {
             console.error("Speech recognition error", event.error);
             setIsRecording(false);
             if (event.error === 'not-allowed') {
                setSpeechError(t('addMemoryScreen.microphonePermissionDenied'));
            } else {
                setSpeechError(t('addMemoryScreen.speechError'));
            }
        };
        
        recognition.onend = () => setIsRecording(false);
        
        try {
            recognition.start();
            setIsRecording(true);
        } catch (e) {
             console.error("Failed to start recognition", e);
             setSpeechError(t('addMemoryScreen.speechError'));
        }
    };
    
    const renderFormFields = () => {
        switch (measurementType) {
            case 'heartRate': return (
                <>
                    <label className="block text-sm font-medium text-gray-700">{t('measurements.labels.value')} ({t('measurements.types.heartRate.unit')})</label>
                    <input type="number" value={formData.value || ''} onChange={e => handleFormChange('value', parseInt(e.target.value))} className="w-full p-2 border border-gray-300 rounded-lg"/>
                    <label className="block text-sm font-medium text-gray-700 mt-2">{t('measurements.labels.condition')}</label>
                    <select value={formData.condition} onChange={e => handleFormChange('condition', e.target.value as HeartRateCondition)} className="w-full p-2 border border-gray-300 rounded-lg">
                        <option value="resting">{t('measurements.conditions.resting')}</option>
                        <option value="active">{t('measurements.conditions.active')}</option>
                        <option value="other">{t('measurements.conditions.other')}</option>
                    </select>
                </>
            );
            case 'bloodPressure': return (
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">{t('measurements.labels.systolic')}</label>
                        <input type="number" value={formData.systolic || ''} onChange={e => handleFormChange('systolic', parseInt(e.target.value))} className="w-full p-2 border border-gray-300 rounded-lg"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">{t('measurements.labels.diastolic')}</label>
                        <input type="number" value={formData.diastolic || ''} onChange={e => handleFormChange('diastolic', parseInt(e.target.value))} className="w-full p-2 border border-gray-300 rounded-lg"/>
                    </div>
                </div>
            );
            case 'bloodGlucose': {
                const bloodGlucoseTimings: BloodGlucoseTiming[] = ['N', 'NO', 'VM', 'NM', 'VA', 'NA', 'VS'];
                return (
                 <>
                    <label className="block text-sm font-medium text-gray-700">{t('measurements.labels.value')} ({t('measurements.types.bloodGlucose.unit')})</label>
                    <input type="number" step="0.1" value={formData.value || ''} onChange={e => handleFormChange('value', parseFloat(e.target.value))} className="w-full p-2 border border-gray-300 rounded-lg"/>
                    <label className="block text-sm font-medium text-gray-700 mt-2">{t('measurements.labels.timing')}</label>
                    <select value={formData.timing} onChange={e => handleFormChange('timing', e.target.value as BloodGlucoseTiming)} className="w-full p-2 border border-gray-300 rounded-lg">
                       {bloodGlucoseTimings.map(key => (
                            <option key={key} value={key}>{t(`measurements.timings.${key}`)}</option>
                       ))}
                    </select>
                </>
                );
            }
            case 'sleepDuration': return (
                 <div className="grid grid-cols-2 gap-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">{t('addMemoryScreen.hours')}</label>
                        <input type="number" value={formData.hours || ''} onChange={e => handleFormChange('hours', parseInt(e.target.value))} className="w-full p-2 border border-gray-300 rounded-lg"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">{t('addMemoryScreen.minutesAbbr')}</label>
                        <input type="number" value={formData.minutes || ''} onChange={e => handleFormChange('minutes', parseInt(e.target.value))} className="w-full p-2 border border-gray-300 rounded-lg"/>
                    </div>
                </div>
            );
            case 'steps': case 'weight': case 'temperature': case 'oxygenSaturation': return (
                <>
                    <label className="block text-sm font-medium text-gray-700">{t('measurements.labels.value')} ({t(`measurements.types.${measurementType}.unit`)})</label>
                    <input type="number" step="any" value={formData.value || ''} onChange={e => handleFormChange('value', parseFloat(e.target.value))} className="w-full p-2 border border-gray-300 rounded-lg"/>
                </>
            );
            default: return null;
        }
    };

    const renderMemoryUI = () => (
        <div className="mt-4 pt-4 border-t">
             <h4 className="font-semibold text-brand-dark mb-2 text-center">{t('addMemoryScreen.yourMemory')}</h4>
             {memoryMode === 'none' && (
                <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => setMemoryMode('photo')} className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg aspect-square hover:bg-gray-100 transition"><ImageIcon className="w-10 h-10 text-brand-primary mb-2" /><span className="font-semibold text-brand-dark">{t('addMemoryScreen.addPhoto')}</span></button>
                    <button onClick={() => setMemoryMode('text')} className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg aspect-square hover:bg-gray-100 transition"><PencilIcon className="w-10 h-10 text-brand-primary mb-2" /><span className="font-semibold text-brand-dark">{t('addMemoryScreen.addVoiceNote')}</span></button>
                </div>
             )}
             {memoryMode === 'photo' && (
                 <div className="text-center">
                    <div className="relative w-full aspect-square bg-brand-dark rounded-xl overflow-hidden mb-4 border-4 border-white/30 shadow-lg">
                        {photo ? <img src={photo} className="w-full h-full object-cover" alt="Memory" /> : <video ref={videoRef} autoPlay playsInline muted className={`w-full h-full object-cover ${currentFacingMode === 'user' ? 'scale-x-[-1]' : ''}`} />}
                        {!photo && videoDevices.length > 1 && (<button onClick={() => setCurrentFacingMode(p => p === 'user' ? 'environment' : 'user')} className="absolute bottom-4 right-4 bg-black/50 text-white p-2 rounded-full"><SwitchCameraIcon className="w-6 h-6" /></button>)}
                    </div>
                    {photo ? (<button onClick={() => setPhoto(null)} className="w-full px-4 py-2 rounded-lg bg-gray-200 text-gray-800 font-semibold">{t('addMemoryScreen.retakePhoto')}</button>) : (<button onClick={() => { if (!videoRef.current || !canvasRef.current) return; const v = videoRef.current; const c = canvasRef.current; c.width = v.videoWidth; c.height = v.videoHeight; const ctx = c.getContext('2d'); if(ctx){ if(currentFacingMode==='user'){ctx.translate(v.videoWidth,0); ctx.scale(-1,1);} ctx.drawImage(v,0,0,v.videoWidth,v.videoHeight); setPhoto(c.toDataURL('image/jpeg'));} }} disabled={!stream} className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-brand-primary text-white font-semibold"><CameraIcon className="w-5 h-5" />{t('addMemoryScreen.takePhoto')}</button>)}
                </div>
             )}
             {memoryMode === 'text' && (
                 <div>
                    <textarea value={text} onChange={(e) => setText(e.target.value)} rows={3} placeholder={t('addMemoryScreen.textPlaceholder')} className="w-full p-2 border border-gray-300 rounded-lg mb-4" />
                    {speechError && <p className="text-xs text-red-500 mb-2 text-center">{speechError}</p>}
                    <button onClick={toggleRecording} className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold ${isRecording ? 'bg-rose-500 text-white' : 'bg-gray-200 text-gray-800'}`}><MicrophoneIcon className={`w-5 h-5 ${isRecording ? 'animate-pulse' : ''}`} />{isRecording ? t('addMemoryScreen.stopRecording') : t('addMemoryScreen.startRecording')}</button>
                </div>
             )}
              {(photo || text) && (
                <div className="mt-4">
                    <label htmlFor="private-toggle-measure" className="flex items-center justify-between bg-gray-100 p-3 rounded-lg border cursor-pointer">
                        <div className="flex items-center gap-2"><LockIcon className="w-5 h-5 text-gray-600" /><span className="text-sm font-medium">{t('addMemoryScreen.privateMemory')}</span></div>
                        <div className="relative">
                            <input type="checkbox" id="private-toggle-measure" className="sr-only peer" checked={isPrivate} onChange={(e) => setIsPrivate(e.target.checked)} />
                            <div className="block w-12 h-6 rounded-full bg-gray-300 peer-checked:bg-brand-secondary transition"></div>
                            <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-6"></div>
                        </div>
                    </label>
                </div>
            )}
        </div>
    );
    
    const { date, time } = dateToDateTimeLocal(timestamp);

    return (
        <div className="min-h-screen bg-brand-light font-sans p-4 flex flex-col justify-center items-center animate-fade-in">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
                <header className="flex justify-between items-center mb-4">
                     <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full bg-gray-100 ${color}`}><Icon className="w-6 h-6" /></div>
                        <h3 className="text-2xl font-bold text-brand-dark">{t(`measurements.types.${measurementType}.name`)}</h3>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><XIcon className="w-6 h-6"/></button>
                </header>
                
                <div className="space-y-4">
                    {renderFormFields()}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">{t('measurements.timestamp')}</label>
                        <div className="grid grid-cols-2 gap-2 mt-1">
                            <input type="date" value={date} onChange={e => { setTimestamp(dateTimeLocalToDate(e.target.value, time)); setValidationError(null); }} className="w-full p-2 border border-gray-300 rounded-lg" />
                            <input type="time" value={time} onChange={e => { setTimestamp(dateTimeLocalToDate(date, e.target.value)); setValidationError(null); }} className="w-full p-2 border border-gray-300 rounded-lg" />
                        </div>
                    </div>
                </div>

                {validationError && (
                    <p className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded-md">{validationError}</p>
                )}


                <div className="mt-4">
                    <details className="group" onToggle={(e) => setShowInstructions((e.target as HTMLDetailsElement).open)}>
                        <summary className="cursor-pointer text-sm text-indigo-600 hover:underline list-none">
                            {showInstructions ? t('measurements.hideInstructions') : t('measurements.showInstructions')}
                        </summary>
                        <div className="mt-2 p-4 bg-gray-50 rounded-lg border">
                             <h4 className="font-semibold text-brand-dark mb-2">{t('measurements.instructionsTitle')}</h4>
                             <p className="text-sm text-gray-600 whitespace-pre-line mb-4 pb-4 border-b">
                                {t(`measurements.instructions.${measurementType}`)}
                            </p>
                            {selectedTip && (
                                <>
                                    <h5 className="font-semibold text-brand-dark mb-1">{t('lifestyle.tipTitle', { pillar: selectedTip.pillar })}</h5>
                                    <p className="text-sm text-gray-600">{selectedTip.content}</p>
                                </>
                            )}
                        </div>
                    </details>
                </div>

                {renderMemoryUI()}
                <canvas ref={canvasRef} className="hidden" />

                <div className="mt-6">
                    <button onClick={handleSave} className="w-full py-3 px-4 bg-brand-primary text-white font-semibold rounded-lg hover:bg-indigo-700">{t('measurements.saveButton')}</button>
                </div>
            </div>
        </div>
    );
};

export default LogMeasurementScreen;
