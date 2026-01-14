
import React, { FC, useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { AppState, ChatMessage, Action, Goals, ChallengeId, View, Activity } from '../../types';
import { XIcon, SendIcon, SpinnerIcon, MicrophoneIcon, CodeBracketIcon, MessageCircleIcon, CheckIcon, CheckCheckIcon, SpeakerIcon } from '../Icons';
import { formatStateForChatbot, decode, decodeAudioData } from '../../utils';
import { generateChatResponse, generateChatSuggestions, generateSpeech, ChatResponseWithSuggestions, Suggestion } from '../../services/geminiService';
import { ACTIVITIES } from '../../constants';

// --- Speech Recognition Types ---
interface SpeechRecognition {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start(): void;
    stop(): void;
    abort(): void;
    onresult: (event: any) => void;
    onend: () => void;
    onerror: (event: any) => void;
}

interface ChatbotScreenProps {
    appState: AppState;
    dispatch: React.Dispatch<Action>;
    onClose: () => void;
}

const PromptModal: FC<{ prompt: string; onClose: () => void }> = ({ prompt, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                <header className="flex justify-between items-center p-4 border-b">
                    <h3 className="font-bold text-brand-dark">AI Prompt</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800"><XIcon className="w-6 h-6"/></button>
                </header>
                <div className="p-4 overflow-y-auto">
                    <pre className="text-xs text-gray-700 whitespace-pre-wrap font-sans">{prompt}</pre>
                </div>
            </div>
        </div>
    );
};


const ChatbotScreen: FC<ChatbotScreenProps> = ({ appState, dispatch, onClose }) => {
    const { t, language } = useLanguage();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [followUpSuggestions, setFollowUpSuggestions] = useState<Suggestion[]>([]);
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(true);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isInitializing, setIsInitializing] = useState(true);
    const [promptToShow, setPromptToShow] = useState<string | null>(null);
    const [isCoachMode, setIsCoachMode] = useState(false);
    
    // Speech to Text State
    const [isRecording, setIsRecording] = useState(false);
    const [speechError, setSpeechError] = useState<string | null>(null);
    const recognitionRef = useRef<SpeechRecognition | null>(null);

    // Text to Speech State
    const [playingMessageId, setPlayingMessageId] = useState<number | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const activeSourceRef = useRef<AudioBufferSourceNode | null>(null);
    const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
    
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchSuggestions = async () => {
            try {
                const context = formatStateForChatbot(appState, t);
                const generatedSuggestions = await generateChatSuggestions(context, language);
                setSuggestions(generatedSuggestions);
            } catch (error) {
                console.error("Error fetching chat suggestions:", error);
            } finally {
                setIsLoadingSuggestions(false);
            }
        };

        const timer = setTimeout(() => {
            setMessages([{ id: Date.now(), role: 'model', content: t('chatbot.welcomeMessage') }]);
            setIsInitializing(false);
            fetchSuggestions();
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    // Cleanup Audio Context on unmount
    useEffect(() => {
        return () => {
            if (activeSourceRef.current) {
                try { activeSourceRef.current.stop(); } catch (e) {}
            }
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
            if (recognitionRef.current && isRecording) {
                recognitionRef.current.abort();
            }
        };
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages, isLoading, isInitializing]);

    // --- Text to Speech Logic ---
    const stopAudio = () => {
        if (activeSourceRef.current) {
            try {
                activeSourceRef.current.stop();
            } catch (e) {
                console.warn("Error stopping audio source", e);
            }
            activeSourceRef.current = null;
        }
        setPlayingMessageId(null);
    };

    const handleTextToSpeech = async (text: string, messageId: number) => {
        if (playingMessageId === messageId) {
            stopAudio();
            return;
        }
        
        stopAudio(); // Stop any currently playing audio
        
        if (!text) return;

        try {
            setPlayingMessageId(messageId); // Optimistically set playing state to show spinner/active state
            setIsGeneratingAudio(true);

            // Initialize AudioContext on user interaction if needed
            if (!audioContextRef.current) {
                const win = window as any;
                const AC = win.AudioContext || win.webkitAudioContext;
                audioContextRef.current = new AC({ sampleRate: 24000 });
            }
            
            if (audioContextRef.current.state === 'suspended') {
                await audioContextRef.current.resume();
            }

            const base64Audio = await generateSpeech(text);
            setIsGeneratingAudio(false);

            if (!base64Audio) {
                setPlayingMessageId(null);
                return;
            }

            // Decode and Play
            const audioBytes = decode(base64Audio);
            const audioBuffer = await decodeAudioData(audioBytes, audioContextRef.current, 24000, 1);

            const source = audioContextRef.current.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(audioContextRef.current.destination);
            
            source.onended = () => {
                setPlayingMessageId(null);
                activeSourceRef.current = null;
            };

            activeSourceRef.current = source;
            source.start();

        } catch (error) {
            console.error("Error playing text to speech:", error);
            setIsGeneratingAudio(false);
            setPlayingMessageId(null);
        }
    };

    // --- Speech to Text Logic ---
    const toggleRecording = () => {
        setSpeechError(null);
        if (isRecording) {
            recognitionRef.current?.stop();
            setIsRecording(false);
            return;
        }

        const win = window as any;
        const SR = win.SpeechRecognition || win.webkitSpeechRecognition;
        if (!SR) {
            setSpeechError(t('addMemoryScreen.speechRecognitionError'));
            return;
        }

        const recognition: SpeechRecognition = new SR();
        recognition.lang = language; 
        recognition.continuous = false;
        recognition.interimResults = true;

        recognition.onresult = (event: any) => {
             let transcript = '';
             for (let i = event.resultIndex; i < event.results.length; ++i) {
                 transcript += event.results[i][0].transcript;
             }
             setInputValue(transcript);
        };
        
        recognition.onend = () => {
            setIsRecording(false);
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

        recognitionRef.current = recognition;
        try {
            recognition.start();
            setIsRecording(true);
        } catch (e) {
            console.error("Failed to start recognition", e);
             setSpeechError(t('addMemoryScreen.speechError'));
        }
    };

    const handleSendMessage = async (messageText: string) => {
        const userMessage = messageText.trim();
        if (!userMessage || isLoading) return;
        
        const messageId = Date.now();
        const newUserMessage: ChatMessage = { id: messageId, role: 'user', content: userMessage, status: 'sent' };

        const currentHistory: ChatMessage[] = [...messages, newUserMessage];
        setMessages(currentHistory);
        setInputValue('');
        setSuggestions([]);
        setFollowUpSuggestions([]);
        setIsLoading(true);

        setTimeout(() => {
            setMessages(prev => prev.map(m => m.id === messageId ? { ...m, status: 'read' } : m));
        }, 1000);

        try {
            let context = formatStateForChatbot(appState, t);
            
            // Enhance system instruction for Coach Mode
            if (isCoachMode) {
                context += `\n\nIMPORTANT: You are in 'Coach Mode'. Act as an enthusiastic, empathetic real-life lifestyle coach. 
                - Explicitly cheer the user on for their badges, streaks, and completed challenges.
                - Use the user's specific diary notes and goal details to provide highly personalized encouragement.
                - Be warm, supportive, and use emojis.
                - Keep responses concise (under 60 words) as they may be spoken aloud.`;
            }

            const response = await generateChatResponse(context, currentHistory, language);
            let historyForNextTurn = [...currentHistory];

            if (response.functionCalls && response.functionCalls.length > 0) {
                const functionCall = response.functionCalls[0];
                historyForNextTurn.push({ id: Date.now(), role: 'model' as const, content: '', functionCall });

                if (functionCall.name === 'setLifestyleGoal') {
                    const args = functionCall.args;
                    let goalKey: keyof Goals | null = null;
                    let goalData: any = null;

                     switch (args.goalType) {
                        case 'dailyWalking':
                            if (args.walkingType && args.walkingValue) { goalKey = 'dailyWalking'; goalData = { type: args.walkingType, value: args.walkingValue }; }
                            break;
                        case 'calmTime':
                            if (args.stressMinutes) { goalKey = 'calmTime'; goalData = { minutes: args.stressMinutes }; }
                            break;
                        case 'socialContact':
                             if (args.socialPeople && args.socialActivity && args.frequency) { goalKey = 'socialContact'; goalData = { people: args.socialPeople, activity: args.socialActivity, frequency: args.frequency }; }
                            break;
                        case 'realFood':
                            if (args.mealType && args.mealDescription) { goalKey = 'realFood'; goalData = { mealType: args.mealType, description: args.mealDescription }; }
                            break;
                    }

                    if (goalKey && goalData) {
                        dispatch({ type: 'UPDATE_GOAL', payload: { goalKey, goalData } });
                    }
                    
                    const functionResponsePart = { functionResponse: { name: functionCall.name, response: { result: "Goal successfully set. Please confirm this to the user and give new suggestions." } } };
                    historyForNextTurn.push({ id: Date.now(), role: 'user', content: '', functionResponse: functionResponsePart });

                    const finalResponse = await generateChatResponse(context, historyForNextTurn, language);
                    if (finalResponse.text) {
                        const modelMsgId = Date.now();
                        setMessages(prev => [...prev, { id: modelMsgId, role: 'model', content: finalResponse.text, prompt: context }]);
                        setFollowUpSuggestions(finalResponse.suggestions);
                        if (isCoachMode) {
                            handleTextToSpeech(finalResponse.text, modelMsgId);
                        }
                    }
                } else if (functionCall.name === 'startChallenge') {
                    const { challengeId } = functionCall.args as { challengeId: ChallengeId };
                    if (appState.challenge) {
                        const currentChallengeName = t(`challenge.${appState.challenge.id}.name`);
                        const newChallengeName = t(`challenge.${challengeId}.name`);
                        const confirmationMessage: ChatMessage = {
                            id: Date.now(),
                            role: 'model',
                            content: t('chatbot.replaceChallengeConfirm', { current: currentChallengeName, new: newChallengeName }),
                            action: { type: 'confirmReplaceChallenge', challengeId }
                        };
                        setMessages(prev => [...prev, confirmationMessage]);
                        if (isCoachMode) {
                           handleTextToSpeech(confirmationMessage.content, confirmationMessage.id);
                        }
                    } else {
                        dispatch({ type: 'SET_VIEW', payload: { name: 'challengeIntroPreview', challengeId } });
                    }
                }
            } else if (response.text) {
                const modelMessage: ChatMessage = { id: Date.now(), role: 'model' as const, content: response.text, prompt: context };
                setMessages(prev => [...prev, modelMessage]);
                setFollowUpSuggestions(response.suggestions);
                if (isCoachMode) {
                    handleTextToSpeech(response.text, modelMessage.id);
                }
            }
        } catch (error) {
             console.error("Error during chat message handling:", error);
             setMessages(prev => [...prev, { id: Date.now(), role: 'model', content: t('chatbot.errorMessage') }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleActionSuggestionClick = (suggestion: Suggestion) => {
        if (suggestion.actionType === 'startChallenge' && suggestion.challengeId) {
            dispatch({ type: 'SET_VIEW', payload: { name: 'challengeIntroPreview', challengeId: suggestion.challengeId } });
        } else if (suggestion.actionType === 'setGoal' && suggestion.goalType) {
            const goalKey = suggestion.goalType as keyof Goals;
            const activity = suggestion.activityId ? ACTIVITIES.find(a => a.id === suggestion.activityId) : undefined;
            if (goalKey) {
                dispatch({ type: 'SET_VIEW', payload: { name: 'setGoal', goalKey, activity, measurements: appState.measurements } });
            }
        } else {
            handleSendMessage(suggestion.text);
        }
    };


    const handleSuggestionClick = (suggestion: Suggestion) => {
        if (suggestion.isAction) {
            handleActionSuggestionClick(suggestion);
        } else {
            handleSendMessage(suggestion.text);
        }
    };

    const handleReplaceChallenge = (challengeId: ChallengeId) => {
        setMessages(prev => prev.filter(m => !m.action));
        dispatch({ type: 'STOP_CHALLENGE' });
        dispatch({ type: 'SET_VIEW', payload: { name: 'challengeIntroPreview', challengeId } });
    };

    const handleCancelReplace = () => {
        setMessages(prev => prev.filter(m => !m.action));
        handleSendMessage("No, I'd like to continue with my current challenge.");
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSendMessage(inputValue);
    };
    
    const renderSuggestions = (suggestionsToRender: Suggestion[]) => (
        <div className="mb-3 flex flex-wrap justify-center gap-2">
            {suggestionsToRender.map((s, i) => (
                <button 
                    key={i} 
                    onClick={() => handleSuggestionClick(s)} 
                    className={`px-3 py-1.5 text-sm font-semibold rounded-full transition-colors ${
                        s.isAction 
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' 
                            : 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200'
                    }`}
                >
                    {s.text}
                </button>
            ))}
        </div>
    );

    return (
        <div className="fixed inset-0 bg-brand-light z-50 flex flex-col animate-fade-in">
             {promptToShow && <PromptModal prompt={promptToShow} onClose={() => setPromptToShow(null)} />}
            <header className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-md border-b sticky top-0">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-primary text-white flex items-center justify-center">
                        <MessageCircleIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-brand-dark">{t('chatbot.title')}</h2>
                        <p className="text-xs text-gray-500">{t('chatbot.headerSubtitle')}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                     <label className="flex items-center cursor-pointer text-xs gap-2 mr-2 select-none">
                        <span className={`font-bold ${isCoachMode ? 'text-brand-primary' : 'text-gray-400'}`}>{t('chatbot.coachMode')}</span>
                        <div className="relative">
                            <input type="checkbox" className="sr-only" checked={isCoachMode} onChange={() => setIsCoachMode(!isCoachMode)} />
                            <div className={`block w-10 h-6 rounded-full ${isCoachMode ? 'bg-brand-primary' : 'bg-gray-300'}`}></div>
                            <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isCoachMode ? 'transform translate-x-4' : ''}`}></div>
                        </div>
                     </label>
                     <button onClick={onClose} className="text-gray-500 hover:text-brand-dark"><XIcon className="w-6 h-6" /></button>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto p-4 space-y-4">
                {isInitializing && (
                    <div className="flex items-end gap-3 justify-start">
                        <div className="w-8 h-8 rounded-full bg-brand-primary text-white flex items-center justify-center flex-shrink-0">
                            <MessageCircleIcon className="w-5 h-5" />
                        </div>
                        <div className="max-w-xs md:max-w-md p-3 rounded-2xl bg-white text-brand-dark rounded-bl-lg shadow-sm">
                           <div className="flex items-center gap-2">
                               <span className="text-sm text-gray-500 italic">{t('chatbot.typing')}</span>
                               <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0s' }}></span>
                               <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></span>
                               <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></span>
                           </div>
                        </div>
                    </div>
                )}
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex items-end gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.role === 'model' && (
                           <div className="w-8 h-8 rounded-full bg-brand-primary text-white flex items-center justify-center flex-shrink-0">
                                <MessageCircleIcon className="w-5 h-5" />
                            </div>
                        )}
                        <div className={`max-w-xs md:max-w-md p-3 rounded-2xl ${msg.role === 'user' ? 'bg-brand-primary text-white rounded-br-lg' : 'bg-white text-brand-dark rounded-bl-lg shadow-sm relative group'}`}>
                            <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                            
                            {msg.role === 'model' && msg.content && (
                                <div className="flex gap-2 mt-2 items-center">
                                    <button 
                                        onClick={() => handleTextToSpeech(msg.content, msg.id)}
                                        className={`p-1 rounded-full transition-colors ${playingMessageId === msg.id ? 'text-brand-primary bg-indigo-50' : 'text-gray-400 hover:text-brand-primary'}`}
                                        title={playingMessageId === msg.id ? "Stop speaking" : "Speak message"}
                                        disabled={isGeneratingAudio && playingMessageId !== msg.id}
                                    >
                                        {playingMessageId === msg.id ? (
                                            <div className="flex items-center gap-1">
                                                <span className="w-1 h-3 bg-brand-primary animate-pulse"></span>
                                                <span className="w-1 h-2 bg-brand-primary animate-pulse" style={{animationDelay:'0.1s'}}></span>
                                                <span className="w-1 h-3 bg-brand-primary animate-pulse" style={{animationDelay:'0.2s'}}></span>
                                            </div>
                                        ) : (
                                            <SpeakerIcon className="w-4 h-4" />
                                        )}
                                    </button>
                                    
                                    {msg.prompt && (
                                        <button onClick={() => setPromptToShow(msg.prompt!)} className="text-xs text-gray-500 flex items-center gap-1 hover:underline">
                                            <CodeBracketIcon className="w-4 h-4"/>
                                            {t('chatbot.showPrompt')}
                                        </button>
                                    )}
                                </div>
                            )}

                            {msg.action?.type === 'confirmReplaceChallenge' && (
                                <div className="mt-2 flex gap-2">
                                    <button onClick={() => handleReplaceChallenge(msg.action!.challengeId)} className="text-sm font-semibold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-md hover:bg-emerald-200">{t('chatbot.yesReplace')}</button>
                                    <button onClick={handleCancelReplace} className="text-sm font-semibold bg-rose-100 text-rose-800 px-3 py-1 rounded-md hover:bg-rose-200">{t('chatbot.noCancel')}</button>
                                </div>
                            )}
                             {msg.role === 'user' && msg.status && (
                                <div className="flex justify-end items-center mt-1.5">
                                    {msg.status === 'sent' && <CheckIcon className="w-4 h-4 text-indigo-200"/>}
                                    {msg.status === 'read' && <CheckCheckIcon className="w-4 h-4 text-sky-300"/>}
                                </div>
                            )}
                        </div>
                         {msg.role === 'user' && appState.currentAvatar && (
                            <img src={appState.currentAvatar} alt="User" className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                        )}
                    </div>
                ))}
                {isLoading && (
                     <div className="flex items-end gap-3 justify-start">
                        <div className="w-8 h-8 rounded-full bg-brand-primary text-white flex items-center justify-center flex-shrink-0">
                            <MessageCircleIcon className="w-5 h-5" />
                        </div>
                        <div className="max-w-xs md:max-w-md p-3 rounded-2xl bg-white text-brand-dark rounded-bl-lg shadow-sm">
                           <div className="flex items-center gap-2">
                               <span className="text-sm text-gray-500 italic">{t('chatbot.typing')}</span>
                               <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0s' }}></span>
                               <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></span>
                               <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></span>
                           </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </main>

            <footer className="p-4 bg-white/80 backdrop-blur-md border-t">
                {speechError && <div className="text-xs text-rose-500 mb-2 text-center">{speechError}</div>}
                 {(suggestions.length > 0 && messages.length <= 1 && !isLoading && !isInitializing) && (
                    isLoadingSuggestions ? (
                        <div className="text-sm text-gray-500 animate-pulse text-center mb-3">{t('loading.generatingHint')}</div>
                    ) : renderSuggestions(suggestions)
                )}
                {followUpSuggestions.length > 0 && !isLoading && renderSuggestions(followUpSuggestions)}
                <form onSubmit={handleFormSubmit} className="flex items-center gap-2">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder={t('chatbot.inputPlaceholder')}
                            className="w-full p-3 pr-10 border-2 border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-primary"
                            disabled={isLoading}
                        />
                        <button 
                            type="button"
                            onClick={toggleRecording}
                            className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 rounded-full transition-colors ${isRecording ? 'text-rose-500 bg-rose-100' : 'text-gray-400 hover:text-brand-primary hover:bg-gray-100'}`}
                            disabled={isLoading}
                        >
                            <MicrophoneIcon className={`w-5 h-5 ${isRecording ? 'animate-pulse' : ''}`} />
                        </button>
                    </div>
                    <button type="submit" disabled={isLoading || !inputValue.trim()} className="w-12 h-12 flex-shrink-0 bg-brand-primary text-white rounded-full flex items-center justify-center disabled:bg-gray-400 transition-colors">
                       {isLoading ? <SpinnerIcon className="w-6 h-6 animate-spin" /> : <SendIcon className="w-6 h-6" />}
                    </button>
                </form>
            </footer>
        </div>
    );
};

export default ChatbotScreen;
