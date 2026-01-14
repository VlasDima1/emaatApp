import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { CameraIcon, SwitchCameraIcon } from '../Icons';
import { Gender } from '../../types';

interface RegisterData {
    name: string;
    email: string;
    password: string;
    accessCode: string;
    dateOfBirth?: string;
    gender?: Gender;
    height?: number;
    weight?: number;
    photoDataUrl?: string;
}

interface RegisterScreenProps {
    onSwitchToLogin: () => void;
    onRegister: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
    onSkip: () => void;
}

const RegisterScreen: React.FC<RegisterScreenProps> = ({ onSwitchToLogin, onRegister, onSkip }) => {
    const { t } = useLanguage();
    
    // Form state
    const [step, setStep] = useState<'credentials' | 'profile' | 'photo'>('credentials');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [accessCode, setAccessCode] = useState('');
    
    // Profile state
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [gender, setGender] = useState<Gender>('unspecified');
    const [weight, setWeight] = useState<string>('');
    const [heightM, setHeightM] = useState('');
    const [heightCm, setHeightCm] = useState('');
    
    // Photo state
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
    const [currentFacingMode, setCurrentFacingMode] = useState<'user' | 'environment'>('user');
    const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
    
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Get video devices
    useEffect(() => {
        if (step === 'photo' && !capturedPhoto) {
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
        }
    }, [step, capturedPhoto]);

    // Enable camera when on photo step
    useEffect(() => {
        let activeStream: MediaStream | null = null;
        
        if (step === 'photo' && !capturedPhoto) {
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
                    setError(t('welcomeScreen.cameraError') || 'Kon camera niet starten');
                }
            };
            enableCamera();
        }
        
        return () => {
            if (activeStream) {
                activeStream.getTracks().forEach(track => track.stop());
            }
        };
    }, [step, currentFacingMode, capturedPhoto, t]);

    const handleSwitchCamera = () => {
        setCurrentFacingMode(prev => prev === 'user' ? 'environment' : 'user');
    };

    const handleTakePhoto = () => {
        if (!videoRef.current || !canvasRef.current) return;
        
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
            const photoData = canvas.toDataURL('image/jpeg', 0.8);
            setCapturedPhoto(photoData);
            
            // Stop camera
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
                setStream(null);
            }
        }
    };

    const handleRetakePhoto = () => {
        setCapturedPhoto(null);
    };

    const validateCredentials = (): boolean => {
        if (!name.trim()) {
            setError('Vul uw naam in.');
            return false;
        }
        if (!email.trim()) {
            setError('Vul uw e-mailadres in.');
            return false;
        }
        if (!accessCode.trim()) {
            setError('Vul de toegangscode van uw huisarts in.');
            return false;
        }
        if (password !== confirmPassword) {
            setError('Wachtwoorden komen niet overeen.');
            return false;
        }
        if (password.length < 6) {
            setError('Wachtwoord moet minimaal 6 tekens bevatten.');
            return false;
        }
        return true;
    };

    const handleNextFromCredentials = () => {
        setError('');
        if (validateCredentials()) {
            setStep('profile');
        }
    };

    const handleNextFromProfile = () => {
        setError('');
        setStep('photo');
    };

    const handleSubmit = async () => {
        setError('');
        setIsLoading(true);

        // Calculate height in cm
        const heightInCm = (parseInt(heightM, 10) || 0) * 100 + (parseInt(heightCm, 10) || 0);
        const weightValue = weight ? parseFloat(weight) : undefined;

        const registerData: RegisterData = {
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password,
            accessCode: accessCode.toUpperCase(),
            dateOfBirth: dateOfBirth || undefined,
            gender,
            height: heightInCm > 0 ? heightInCm : undefined,
            weight: weightValue,
            photoDataUrl: capturedPhoto || undefined
        };

        const result = await onRegister(registerData);
        
        if (result.success) {
            setSuccess(true);
        } else {
            setError(result.error || 'Registratie mislukt. Probeer het opnieuw.');
        }
        
        setIsLoading(false);
    };

    const handleSkipPhoto = async () => {
        // Submit without photo
        await handleSubmit();
    };

    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                            <span className="text-3xl">✓</span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Aangemaakt!</h2>
                        <p className="text-gray-600 mb-6">
                            Je account is succesvol aangemaakt. Je kunt nu inloggen met je e-mailadres en wachtwoord.
                        </p>
                        <button
                            onClick={onSwitchToLogin}
                            className="w-full py-3 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium rounded-xl transition-all"
                        >
                            Naar Inloggen
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Step indicator
    const StepIndicator = () => (
        <div className="flex justify-center mb-6">
            <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${step === 'credentials' ? 'bg-indigo-600' : 'bg-indigo-300'}`} />
                <div className={`w-8 h-0.5 ${step !== 'credentials' ? 'bg-indigo-600' : 'bg-gray-300'}`} />
                <div className={`w-3 h-3 rounded-full ${step === 'profile' ? 'bg-indigo-600' : step === 'photo' ? 'bg-indigo-300' : 'bg-gray-300'}`} />
                <div className={`w-8 h-0.5 ${step === 'photo' ? 'bg-indigo-600' : 'bg-gray-300'}`} />
                <div className={`w-3 h-3 rounded-full ${step === 'photo' ? 'bg-indigo-600' : 'bg-gray-300'}`} />
            </div>
        </div>
    );

    // Step 1: Credentials
    if (step === 'credentials') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-3 shadow-lg">
                            <span className="text-3xl">🌟</span>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">eMAAT</h1>
                        <p className="text-gray-600 mt-1">Nieuw Account Aanmaken</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl p-6">
                        <StepIndicator />
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Stap 1: Inloggegevens</h2>
                        
                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Volledige Naam *</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Jan Jansen"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">E-mailadres *</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="naam@voorbeeld.nl"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Toegangscode * <span className="text-gray-500 font-normal">(van uw huisarts)</span>
                                </label>
                                <input
                                    type="text"
                                    value={accessCode}
                                    onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono uppercase"
                                    placeholder="XXXXXXXX"
                                    maxLength={8}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Wachtwoord *</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Minimaal 6 tekens"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Bevestig Wachtwoord *</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Herhaal wachtwoord"
                                />
                            </div>

                            <button
                                onClick={handleNextFromCredentials}
                                className="w-full py-3 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium rounded-xl transition-all shadow-lg"
                            >
                                Volgende →
                            </button>
                        </div>

                        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                            <p className="text-sm text-gray-600">
                                Heeft u al een account?{' '}
                                <button onClick={onSwitchToLogin} className="text-indigo-600 hover:text-indigo-800 font-medium">
                                    Inloggen
                                </button>
                            </p>
                        </div>
                    </div>

                    <div className="mt-4 text-center">
                        <button onClick={onSkip} className="text-gray-500 hover:text-gray-700 text-sm underline">
                            Doorgaan zonder account (alleen lokaal)
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Step 2: Profile
    if (step === 'profile') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-3 shadow-lg">
                            <span className="text-3xl">📋</span>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">Persoonlijke Gegevens</h1>
                        <p className="text-gray-600 mt-1">Voor een persoonlijke ervaring</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl p-6">
                        <StepIndicator />
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Stap 2: Profiel (optioneel)</h2>
                        
                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Geboortedatum</label>
                                    <input
                                        type="date"
                                        value={dateOfBirth}
                                        onChange={(e) => setDateOfBirth(e.target.value)}
                                        className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Geslacht</label>
                                    <select
                                        value={gender}
                                        onChange={(e) => setGender(e.target.value as Gender)}
                                        className="w-full px-3 py-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option value="unspecified">Niet opgegeven</option>
                                        <option value="female">Vrouw</option>
                                        <option value="male">Man</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Gewicht (kg)</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={weight}
                                        onChange={(e) => setWeight(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                                        placeholder="70.0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Lengte</label>
                                    <div className="flex gap-2">
                                        <div className="relative flex-1">
                                            <input
                                                type="number"
                                                value={heightM}
                                                onChange={(e) => setHeightM(e.target.value)}
                                                className="w-full px-3 py-3 border border-gray-300 rounded-xl"
                                                placeholder="1"
                                            />
                                            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-sm">m</span>
                                        </div>
                                        <div className="relative flex-1">
                                            <input
                                                type="number"
                                                value={heightCm}
                                                onChange={(e) => setHeightCm(e.target.value)}
                                                className="w-full px-3 py-3 border border-gray-300 rounded-xl"
                                                placeholder="75"
                                            />
                                            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-sm">cm</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setStep('credentials')}
                                    className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all"
                                >
                                    ← Terug
                                </button>
                                <button
                                    onClick={handleNextFromProfile}
                                    className="flex-1 py-3 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium rounded-xl transition-all shadow-lg"
                                >
                                    Volgende →
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Step 3: Photo
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-3 shadow-lg">
                        <span className="text-3xl">📸</span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Profielfoto</h1>
                    <p className="text-gray-600 mt-1">Maak een foto voor je avatar</p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-6">
                    <StepIndicator />
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Stap 3: Foto (optioneel)</h2>
                    
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    {capturedPhoto ? (
                        // Show captured photo
                        <div className="space-y-4">
                            <div className="relative w-full aspect-square bg-gray-100 rounded-xl overflow-hidden">
                                <img src={capturedPhoto} alt="Captured" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={handleRetakePhoto}
                                    className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all"
                                >
                                    Opnieuw maken
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={isLoading}
                                    className="flex-1 py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium rounded-xl transition-all shadow-lg disabled:opacity-50"
                                >
                                    {isLoading ? 'Bezig...' : 'Registreren ✓'}
                                </button>
                            </div>
                        </div>
                    ) : (
                        // Show camera
                        <div className="space-y-4">
                            <div className="relative w-full aspect-square bg-gray-900 rounded-xl overflow-hidden">
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    playsInline
                                    muted
                                    className={`w-full h-full object-cover ${currentFacingMode === 'user' ? 'scale-x-[-1]' : ''}`}
                                />
                                {videoDevices.length > 1 && (
                                    <button
                                        onClick={handleSwitchCamera}
                                        className="absolute bottom-3 right-3 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                                    >
                                        <SwitchCameraIcon className="w-5 h-5" />
                                    </button>
                                )}
                                {!stream && !error && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                                        <p className="text-white animate-pulse">Camera starten...</p>
                                    </div>
                                )}
                            </div>
                            <canvas ref={canvasRef} className="hidden" />
                            
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setStep('profile')}
                                    className="py-3 px-4 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all"
                                >
                                    ← Terug
                                </button>
                                <button
                                    onClick={handleTakePhoto}
                                    disabled={!stream}
                                    className="flex-1 py-3 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium rounded-xl transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    <CameraIcon className="w-5 h-5" />
                                    Foto maken
                                </button>
                            </div>
                            
                            <button
                                onClick={handleSkipPhoto}
                                disabled={isLoading}
                                className="w-full py-3 px-4 text-gray-600 hover:text-gray-800 font-medium rounded-xl transition-all border border-dashed border-gray-300 hover:border-gray-400"
                            >
                                {isLoading ? 'Bezig...' : 'Overslaan en registreren'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RegisterScreen;
