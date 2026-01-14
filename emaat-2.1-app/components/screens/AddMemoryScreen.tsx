import React, { FC, useState, useRef, useEffect, useMemo } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
// FIX: Changed WalkingGoal and SleepGoal to their correct counterparts DailyWalkingGoal and RegularSleepGoal to fix import errors.
import { Activity, Memory, Goals, DailyWalkingGoal, RegularSleepGoal, WalkingDetails, DurationDetails, MealDetails, SocialDetails, ChallengeActivity } from '../../types';
import { XIcon, CameraIcon, PencilIcon, SwitchCameraIcon, BedIcon, LockIcon } from '../Icons';
import { formatGoalText } from '../../utils';

interface AddMemoryScreenProps {
    avatar: string | null;
    activityInfo: Activity | ChallengeActivity;
    goal: Goals[keyof Goals] | undefined;
    onComplete: (memory?: Memory) => void;
    onClose: () => void;
}

const AddMemoryScreen: FC<AddMemoryScreenProps> = ({ avatar, activityInfo, goal, onComplete, onClose }) => {
    const { t, language } = useLanguage();
    const [error, setError] = useState<string | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [photo, setPhoto] = useState<string | null>(null);
    const [text, setText] = useState('');
    const [hint, setHint] = useState<string | null>(null);
    const [isHintLoading, setIsHintLoading] = useState(true);
    const [isPrivate, setIsPrivate] = useState(true);

    const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
    const [currentFacingMode, setCurrentFacingMode] = useState<'user' | 'environment'>('user');
    
    // State for detailed memory logging
    const [walkingDetails, setWalkingDetails] = useState<WalkingDetails>({ unit: 'minutes', value: 0 });
    const [durationDetails, setDurationDetails] = useState<DurationDetails>({ hours: 0, minutes: 30 });
    const [mealDetails, setMealDetails] = useState<MealDetails>({ type: 'lunch', description: '' });
    const [socialDetails, setSocialDetails] = useState<SocialDetails>({ description: '' });

    const isChallenge = 'challengeId' in activityInfo;
    const activity = isChallenge ? null : activityInfo as Activity;
    
    const activityName = useMemo(() => {
        if (isChallenge) {
            return t('challenge.sleepChallenge.name');
        }
        return t(`activities.${(activityInfo as Activity).id}.name`);
    }, [activityInfo, isChallenge, t]);

    const goalText = useMemo(() => (goal && activity ? formatGoalText(activity, goal, t) : null), [activity, goal, t]);
    
    useEffect(() => {
        const getDevices = async () => {
            try {
                const devices = await navigator.mediaDevices.enumerateDevices();
                const videoInputs = devices.filter(d => d.kind === 'videoinput');
                setVideoDevices(videoInputs);
            } catch (err) {
                console.warn("Could not enumerate devices:", err);
            }
        };
        getDevices();
    }, []);

    useEffect(() => {
      // FIX: The logic here was based on old, non-existent goal types.
      // It's updated to use the correct `DailyWalkingGoal` and its properties.
      // The logic for the 'sleep' activity goal was removed as the activity itself no longer exists.
      if (goal && activity) {
        if (activity.id === 'nature' && 'minutes' in goal) {
          const wg = goal as DailyWalkingGoal;
          setWalkingDetails({ unit: 'minutes', value: wg.minutes });
        }
      }
    }, [goal, activity]);

    useEffect(() => {
        setIsHintLoading(true);
        const timer = setTimeout(() => {
            setHint(t('addMemoryScreen.hintFallback'));
            setIsHintLoading(false);
        }, 1200);
        return () => clearTimeout(timer);
    }, [t]);

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

    const handleSave = () => {
        const details: Partial<Omit<Memory, 'photoUrl' | 'content'>> = {};

        if (!isChallenge && activity) {
            switch (activity.id) {
                case 'nature': details.walking = walkingDetails; break;
                case 'exercise':
                case 'hobby':
                case 'relax':
                case 'read': details.duration = durationDetails; break;
                case 'meal': details.meal = mealDetails; break;
                case 'social': details.social = socialDetails; break;
            }
        }

        if (!photo && !text.trim() && Object.keys(details).length === 0) {
            onComplete(undefined);
            return;
        }

        const memory: Memory = {
            isPrivate,
            ...details,
        };

        if (photo) {
            memory.photoUrl = photo;
        }
        if (text.trim()) {
            memory.content = text.trim();
        }

        onComplete(memory);
    };
    
    const renderDetailsForm = () => {
      if (!activity) return null;
      switch (activity.id) {
        case 'nature': return (
          <div className="grid grid-cols-2 gap-2 items-center">
              <div className="flex rounded-md shadow-sm">
                  <button onClick={() => setWalkingDetails(d => ({...d, unit: 'minutes'}))} className={`px-3 py-2 text-sm rounded-l-md flex-1 border ${walkingDetails.unit === 'minutes' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 border-gray-300'}`}>{t('addMemoryScreen.minutes')}</button>
                  <button onClick={() => setWalkingDetails(d => ({...d, unit: 'steps'}))} className={`px-3 py-2 text-sm rounded-r-md flex-1 border ${walkingDetails.unit === 'steps' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 border-gray-300'}`}>{t('addMemoryScreen.steps')}</button>
              </div>
              <input type="number" value={walkingDetails.value} onChange={e => setWalkingDetails(d => ({...d, value: parseInt(e.target.value, 10) || 0}))} className="w-full p-2 border border-gray-300 rounded-lg"/>
          </div>);
        case 'exercise': case 'hobby': case 'relax': case 'read': return (
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('addMemoryScreen.duration')}</label>
                <div className="grid grid-cols-2 gap-2">
                    <div className="relative"><input type="number" value={durationDetails.hours} onChange={e => setDurationDetails(d => ({ ...d, hours: parseInt(e.target.value, 10) || 0 }))} className="w-full p-2 border border-gray-300 rounded-lg" /><span className="absolute right-2 top-2 text-gray-500">{t('addMemoryScreen.hours')}</span></div>
                    <div className="relative"><input type="number" value={durationDetails.minutes} onChange={e => setDurationDetails(d => ({ ...d, minutes: parseInt(e.target.value, 10) || 0 }))} className="w-full p-2 border border-gray-300 rounded-lg" /><span className="absolute right-2 top-2 text-gray-500">{t('addMemoryScreen.minutesAbbr')}</span></div>
                </div>
            </div>
        );
        case 'meal': return (
          <div className="space-y-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('addMemoryScreen.mealType')}</label>
              <select value={mealDetails.type} onChange={e => setMealDetails(d => ({...d, type: e.target.value as MealDetails['type']}))} className="w-full p-2 border border-gray-300 rounded-lg">
                <option value="breakfast">{t('addMemoryScreen.breakfast')}</option>
                <option value="lunch">{t('addMemoryScreen.lunch')}</option>
                <option value="dinner">{t('addMemoryScreen.dinner')}</option>
                <option value="snack">{t('addMemoryScreen.snack')}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('addMemoryScreen.whatDidYouEat')}</label>
              <input type="text" value={mealDetails.description} onChange={e => setMealDetails(d => ({...d, description: e.target.value}))} placeholder={t('addMemoryScreen.whatDidYouEatPlaceholder')} className="w-full p-2 border border-gray-300 rounded-lg"/>
            </div>
          </div>
        );
        case 'social': return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('addMemoryScreen.whatDidYouDo')}</label>
            <input type="text" value={socialDetails.description} onChange={e => setSocialDetails(d => ({...d, description: e.target.value}))} placeholder={t('addMemoryScreen.whatDidYouDoPlaceholder')} className="w-full p-2 border border-gray-300 rounded-lg"/>
          </div>
        );
        default: return null;
      }
    };
    
    const ActivityIcon = isChallenge ? BedIcon : (activityInfo as Activity).icon;
    const iconColor = isChallenge ? 'text-indigo-500' : (activityInfo as Activity).color;

    return (
        <div className="min-h-screen bg-brand-light font-sans p-4 flex flex-col justify-center items-center animate-fade-in">
             <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
                <header className="flex justify-end items-center mb-2"><button onClick={onClose} className="text-gray-400 hover:text-gray-600"><XIcon className="w-6 h-6"/></button></header>
                <div className="text-center">
                    <div className="relative w-24 h-24 mx-auto mb-4">
                        <img src={avatar || ''} alt="eMaat" className="w-full h-full rounded-full border-4 border-white object-cover shadow-lg" />
                    </div>
                    <h3 className="text-2xl font-bold text-brand-dark mb-2">{t('addMemoryScreen.title')}</h3>
                    <div className="flex justify-center items-center gap-2 mb-4"><ActivityIcon className={`w-5 h-5 ${iconColor}`} /><p className="font-semibold text-gray-600">{activityName}</p></div>
                </div>
                <div className="text-center mb-4 p-3 bg-indigo-50 rounded-lg border border-indigo-200 min-h-[88px] flex flex-col items-center justify-center">
                    {goalText && <div className="mb-2 w-full"><p className="text-xs font-semibold text-indigo-500">{t('addMemoryScreen.yourGoalReminder')}</p><p className="text-sm text-indigo-800">{goalText}</p></div>}
                    {isHintLoading && (<div className={`w-full ${goalText ? 'border-t border-indigo-200 pt-2 mt-2' : ''}`}><p className="text-sm text-indigo-500">{t('loading.generatingHint')}</p><div className="w-full bg-gray-200 rounded-full h-2 mt-2"><div className="bg-gradient-to-r from-purple-400 to-pink-500 h-2 rounded-full" style={{ animation: 'progress-bar-fill 1200ms ease-out forwards' }}></div></div></div>)}
                    {!isHintLoading && hint && (<div className={`w-full ${goalText ? 'border-t border-indigo-200 pt-2 mt-2' : ''}`}><p className="text-sm text-indigo-700 italic">"{hint}"</p></div>)}
                </div>
                {error && <p className="text-red-500 bg-red-100 p-2 rounded-lg mb-4 text-sm">{error}</p>}
                
                <div className="space-y-4">
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
                </div>

                {!isChallenge && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h4 className="font-semibold text-brand-dark mb-2 text-center">{t('addMemoryScreen.logDetailsTitle')}</h4>
                      {renderDetailsForm()}
                    </div>
                )}
                <canvas ref={canvasRef} className="hidden"/>
                <div className="mt-4">
                    <label htmlFor="private-toggle" className="flex items-center justify-between bg-gray-100 p-3 rounded-lg border cursor-pointer">
                        <div className="flex items-center gap-2">
                            <LockIcon className="w-5 h-5 text-gray-600" />
                            <span className="block text-sm text-gray-900 font-medium">{t('addMemoryScreen.privateMemory')}</span>
                        </div>
                        <div className="relative">
                            <input type="checkbox" id="private-toggle" className="sr-only peer" checked={isPrivate} onChange={(e) => setIsPrivate(e.target.checked)} />
                            <div className="block w-12 h-6 rounded-full bg-gray-300 peer-checked:bg-brand-secondary transition"></div>
                            <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform transform peer-checked:translate-x-6"></div>
                        </div>
                    </label>
                </div>
                <div className="mt-6 space-y-3">
                    <button onClick={handleSave} className="w-full px-4 py-3 rounded-lg bg-brand-primary text-white font-semibold">{t('addMemoryScreen.saveMemory')}</button>
                    <button onClick={() => onComplete()} className="w-full text-sm text-gray-500 hover:text-brand-primary">{t('addMemoryScreen.skipButton')}</button>
                </div>
            </div>
        </div>
    );
};

export default AddMemoryScreen;