
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Participant, Challenge, QuestionnaireResult, QuestionnaireType } from '../types';
import { getParticipantById, startOrRestartChallenge } from '../services/participantService';
import { 
    ArrowLeftIcon, VideoCameraIcon, ChevronRightIcon,
    ClipboardDocumentListIcon, FaceFrownIcon, ShieldCheckIcon, LungsIcon, ExclamationTriangleIcon, ActivityIcon, UsersIcon, AlcoholIcon, StopSmokingIcon, CheckCircleIcon
} from './icons';
import { getDomainMeta } from '../utils/domainUtils';
import ParticipantSummaryCard from './ParticipantSummaryCard';
import ChallengeView from './ChallengeDetail';
import QuestionnaireDetail from './QuestionnaireDetail';
import DashboardGrid from './DashboardGrid';

const getQuestionnaireIcon = (type: QuestionnaireType, className: string = "h-8 w-8 text-blue-500") => {
    switch (type) {
        case QuestionnaireType.PHQ9: return <FaceFrownIcon className={className} />;
        case QuestionnaireType.GAD7:
        case QuestionnaireType.HADS: return <ShieldCheckIcon className={className} />;
        case QuestionnaireType.AUDIT: return <AlcoholIcon className={className} />;
        case QuestionnaireType.Fagerstrom: return <StopSmokingIcon className={className} />; 
        case QuestionnaireType.CAT:
        case QuestionnaireType.mMRC: return <LungsIcon className={className} />;
        case QuestionnaireType.VAS: return <ExclamationTriangleIcon className={className} />;
        case QuestionnaireType.GFI: return <UsersIcon className={className} />;
        case QuestionnaireType.PAM13: return <ActivityIcon className={className} />;
        default: return <ClipboardDocumentListIcon className={className} />;
    }
}

interface ChallengeButtonProps {
  challenge: Challenge;
  onClick: () => void;
}

const ChallengeButton: React.FC<ChallengeButtonProps> = ({ challenge, onClick }) => {
    const { icon: Icon, colorClass } = getDomainMeta(challenge.domain);
    const isActive = challenge.status === 'active' || (challenge.progress > 0 && challenge.progress < 100);
    const isCompleted = challenge.status === 'completed' || challenge.progress === 100;

    return (
        <button 
            onClick={onClick}
            className={`w-full text-left bg-white p-4 rounded-xl shadow-sm transition-all duration-200 flex items-center justify-between hover:shadow-md hover:scale-[1.02] ${isActive ? 'ring-2 ring-blue-500' : ''}`}
        >
            <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${colorClass}`}>
                    {Icon && <Icon className="h-7 w-7 text-white" />}
                </div>
                <div>
                    <h4 className="font-bold text-gray-800 text-md">{challenge.domain}</h4>
                    {isActive && <span className="text-xs text-blue-600 font-medium">Actief</span>}
                    {isCompleted && <span className="text-xs text-green-600 font-medium">Voltooid</span>}
                </div>
            </div>
            <div className="flex items-center space-x-2">
                {isActive && challenge.progress > 0 && (
                    <span className="text-sm font-medium text-blue-600">{challenge.progress}%</span>
                )}
                <ChevronRightIcon className="h-6 w-6 text-gray-400" />
            </div>
        </button>
    );
};

interface QuestionnaireTileProps {
    questionnaire: QuestionnaireResult;
    onClick: () => void;
}

const QuestionnaireTile: React.FC<QuestionnaireTileProps> = ({ questionnaire, onClick }) => {
    const isCompleted = questionnaire.completed;
    
    // Dynamic styling
    const borderColor = isCompleted ? "border-transparent hover:border-blue-300" : "border-transparent hover:border-gray-300";

    return (
        <button
            onClick={onClick}
            className={`
                group relative w-full h-full flex flex-col p-5
                bg-white rounded-2xl shadow-sm border transition-all duration-300 ease-in-out
                hover:shadow-md hover:-translate-y-1 ${borderColor}
            `}
        >
            {isCompleted && (
                <div className="absolute top-5 right-5">
                    <CheckCircleIcon className="h-5 w-5 text-blue-500" />
                </div>
            )}

            <div className="flex justify-between items-start w-full mb-4 flex-grow">
                <div className={`flex flex-col items-start flex-1 ${isCompleted ? 'pr-6' : ''}`}>
                    <h4 className={`text-sm font-bold text-left mb-1 ${isCompleted ? 'text-gray-800' : 'text-gray-600'}`}>
                        {questionnaire.type}
                    </h4>
                    <p className="text-xs text-gray-500 text-left line-clamp-2 leading-relaxed min-h-[2.5em]">
                        {questionnaire.description}
                    </p>
                </div>
            </div>

            {/* Footer */}
            <div className="w-full mt-auto pt-3 border-t border-gray-50 flex items-center justify-between min-h-[30px]">
                <div className="text-[10px] text-gray-400 font-medium flex items-center">
                    {isCompleted ? (
                        questionnaire.date && <span>Ingevuld {new Date(questionnaire.date).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' })}</span>
                    ) : (
                        <span>Nog niet ingevuld</span>
                    )}
                </div>
                <ChevronRightIcon className="h-4 w-4 text-gray-300 group-hover:text-blue-500 transition-colors" />
            </div>
        </button>
    );
}

type TabType = 'measurements' | 'challenges' | 'questionnaires';

const ParticipantDetail: React.FC = () => {
  const { participantId } = useParams<{ participantId: string }>();
  const navigate = useNavigate();
  const [participant, setParticipant] = useState<Participant | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState<QuestionnaireResult | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('measurements');
  const scrollPositionRef = useRef(0);

  useEffect(() => {
    const fetchParticipant = async () => {
      if (!participantId) return;
      setLoading(true);
      setSelectedChallenge(null);
      setSelectedQuestionnaire(null);
      const data = await getParticipantById(participantId);
      setParticipant(data || null);
      setLoading(false);
    };
    fetchParticipant();
  }, [participantId]);

  // Scroll management: Scroll to top on detail view, restore scroll on back
  useEffect(() => {
    if (selectedChallenge || selectedQuestionnaire) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        const mainContainer = document.querySelector('main');
        if (mainContainer) {
            mainContainer.scrollTo({ top: 0, behavior: 'smooth' });
        }
    } else {
        // Restore scroll position
        setTimeout(() => {
            const mainContainer = document.querySelector('main');
            if (window.innerWidth >= 768 && mainContainer) {
                mainContainer.scrollTo({ top: scrollPositionRef.current, behavior: 'auto' });
            } else {
                window.scrollTo({ top: scrollPositionRef.current, behavior: 'auto' });
            }
        }, 10);
    }
  }, [selectedChallenge, selectedQuestionnaire]);
  
  const handleVideoCall = () => {
    console.log(`Starting video call with ${participant?.name}...`);
    alert(`Videogesprek starten met ${participant?.name}`);
  };
  
  const handleChallengeClick = (challenge: Challenge) => {
    // Capture scroll position
    const mainContainer = document.querySelector('main');
    if (window.innerWidth >= 768 && mainContainer) {
        scrollPositionRef.current = mainContainer.scrollTop;
    } else {
        scrollPositionRef.current = window.scrollY;
    }

    setSelectedChallenge(challenge);
    setSelectedQuestionnaire(null);
  };
  
  const handleQuestionnaireClick = (q: QuestionnaireResult) => {
      // Capture scroll position
      const mainContainer = document.querySelector('main');
      if (window.innerWidth >= 768 && mainContainer) {
          scrollPositionRef.current = mainContainer.scrollTop;
      } else {
          scrollPositionRef.current = window.scrollY;
      }

      setSelectedQuestionnaire(q);
      setSelectedChallenge(null);
  };

  const handleBack = () => {
    setSelectedChallenge(null);
    setSelectedQuestionnaire(null);
  };

  const handleChallengeUpdate = async (challengeToUpdate: Challenge) => {
    if (!participant) return;

    const isStartingNew = challengeToUpdate.progress === 0;
    const currentChallengeInProgress = participant.challenges.find(c => c.progress > 0 && c.progress < 100);
    
    let needsConfirmation = false;
    let warningMessage = '';

    if (isStartingNew) {
        if (currentChallengeInProgress) {
            needsConfirmation = true;
            warningMessage = `U staat op het punt de challenge '${challengeToUpdate.domain}' te starten. De huidige challenge '${currentChallengeInProgress.domain}' wordt gestopt en verplaatst naar 'Nieuwe challenges'. Wilt u doorgaan?`;
        } else {
            needsConfirmation = false;
        }
    } else { 
        needsConfirmation = true;
        warningMessage = `U staat op het punt de challenge '${challengeToUpdate.domain}' opnieuw te doen. Eerdere resultaten worden gewist. Weet u het zeker?`;
    }

    if (needsConfirmation && !window.confirm(warningMessage)) {
        return;
    }
    
    setLoading(true);
    const updatedParticipant = await startOrRestartChallenge(participant.id, challengeToUpdate.domain);
    if (updatedParticipant) {
        setParticipant(updatedParticipant);
        const newSelectedChallenge = updatedParticipant.challenges.find(c => c.domain === challengeToUpdate.domain);
        setSelectedChallenge(newSelectedChallenge || null);
    } else {
        alert("Er is een fout opgetreden bij het bijwerken van de challenge.");
    }
    setLoading(false);
  };

  if (loading) {
    return (
        <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Deelnemergegevens worden geladen...</p>
        </div>
    );
  }

  if (!participant) {
    return (
        <div className="flex items-center justify-center h-full">
            <p className="text-red-500">Deelnemer niet gevonden.</p>
        </div>
    );
  }

  // Filter challenges by status - use status field if available, otherwise fall back to progress
  const currentChallenges = participant.challenges.filter(c => 
    c.status === 'active' || (c.progress > 0 && c.progress < 100 && c.status !== 'completed' && c.status !== 'stopped')
  );
  const completedChallenges = participant.challenges.filter(c => 
    c.status === 'completed' || c.progress === 100
  );
  const newChallenges = participant.challenges.filter(c => 
    (c.status === 'new' || c.status === 'stopped' || !c.status) && c.progress === 0 && c.status !== 'active'
  );

  return (
    <div className="p-4 md:p-0 pb-24 md:pb-6 max-w-6xl mx-auto">
        {/* Mobile Header */}
        <div className="flex items-center mb-4 md:hidden">
            <button onClick={() => (selectedChallenge || selectedQuestionnaire) ? handleBack() : navigate('/')} className="p-2 rounded-full hover:bg-gray-200 mr-2">
            <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
            </button>
            <h2 className="text-xl font-bold text-gray-900">{participant.name}</h2>
        </div>

        {/* Participant Summary Card */}
        <ParticipantSummaryCard participant={participant} />
      
        {selectedChallenge ? (
            <ChallengeView 
                participant={participant}
                challenge={selectedChallenge}
                onBack={handleBack}
                onUpdateChallenge={handleChallengeUpdate}
            />
        ) : selectedQuestionnaire ? (
            <QuestionnaireDetail 
                questionnaire={selectedQuestionnaire}
                participantName={participant.name}
                onBack={handleBack}
            />
        ) : (
            <>
                {/* Tab Navigation */}
                <div className="flex border-b border-gray-200 mb-6 space-x-6">
                    <button 
                        onClick={() => setActiveTab('measurements')}
                        className={`pb-3 px-1 text-sm font-medium transition-colors border-b-2 ${
                            activeTab === 'measurements' 
                            ? 'border-blue-600 text-blue-600' 
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        Metingen
                    </button>
                    <button 
                        onClick={() => setActiveTab('challenges')}
                        className={`pb-3 px-1 text-sm font-medium transition-colors border-b-2 ${
                            activeTab === 'challenges' 
                            ? 'border-blue-600 text-blue-600' 
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        Challenges
                    </button>
                    <button 
                        onClick={() => setActiveTab('questionnaires')}
                        className={`pb-3 px-1 text-sm font-medium transition-colors border-b-2 ${
                            activeTab === 'questionnaires' 
                            ? 'border-blue-600 text-blue-600' 
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        Zelf-rapportage
                    </button>
                </div>

                {/* Tab Content */}
                {activeTab === 'measurements' && (
                    <div className="mb-10 animate-in fade-in duration-300">
                        <DashboardGrid 
                            participant={participant}
                        />
                    </div>
                )}

                {activeTab === 'challenges' && (
                    <div className="space-y-8 mb-10 animate-in fade-in duration-300">
                        {currentChallenges.length > 0 && (
                            <div>
                                <h4 className="text-lg font-semibold mb-4 text-gray-700">Lopende challenges</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {currentChallenges.map(challenge => (
                                        <ChallengeButton 
                                            key={challenge.domain}
                                            challenge={challenge} 
                                            onClick={() => handleChallengeClick(challenge)}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {newChallenges.length > 0 && (
                            <div>
                                <h4 className="text-lg font-semibold mb-4 text-gray-700">Nieuwe challenges</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {newChallenges.map(challenge => (
                                        <ChallengeButton 
                                            key={challenge.domain}
                                            challenge={challenge} 
                                            onClick={() => handleChallengeClick(challenge)}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        {completedChallenges.length > 0 && (
                            <div>
                                <h4 className="text-lg font-semibold mb-4 text-gray-700">Gedane challenges</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {completedChallenges.map(challenge => (
                                        <ChallengeButton 
                                            key={challenge.domain} 
                                            challenge={challenge}
                                            onClick={() => handleChallengeClick(challenge)}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
                
                {activeTab === 'questionnaires' && (
                    <div className="grid grid-cols-2 gap-4 animate-in fade-in duration-300">
                        {participant.questionnaires.map(q => (
                            <QuestionnaireTile 
                                key={q.id} 
                                questionnaire={q} 
                                onClick={() => handleQuestionnaireClick(q)} 
                            />
                        ))}
                    </div>
                )}
                
                {/* Sticky Bottom Bar for Mobile */}
                <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm p-3 border-t border-gray-200 md:hidden z-10">
                    <button 
                    onClick={handleVideoCall}
                    className="w-full flex items-center justify-center bg-green-500 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:bg-green-600 transition-colors"
                    >
                    <VideoCameraIcon className="h-6 w-6 mr-2" />
                    Videogesprek met {participant.name.split(' ')[0]}
                    </button>
                </div>
            </>
        )}
    </div>
  );
};

export default ParticipantDetail;
