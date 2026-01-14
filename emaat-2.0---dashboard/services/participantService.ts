
import { Participant, Domain, Challenge, DailyDataPoint, SleepDataDetails, VitalityMeasurement, QuestionnaireType, QuestionnaireResult, CigaretteLog, QuestionnaireItem, MovementDataDetails, NutritionDataDetails } from '../types';
import { HEALTH_DOMAINS } from '../constants';

const NAMES = [
  "Emily Carter", "Benjamin Hayes", "Olivia Rodriguez", "Liam Goldberg", "Sophia Chen",
  "Noah Patel", "Ava Williams", "James Ibrahim", "Isabella Martinez", "William Garcia"
];

const STREET_NAMES = ["Hoofdstraat", "Kerkstraat", "Dorpsstraat", "Molenweg", "Julianastraat", "Nieuwstraat", "Sportlaan", "Wilhelminalaan", "Eikenlaan", "Berkenweg"];
const CITIES = ["Amsterdam", "Rotterdam", "Utrecht", "Den Haag", "Eindhoven", "Groningen", "Maastricht", "Arnhem", "Breda", "Tilburg"];

const SMOKING_LOGS = [
    "Veel trek na de koffie, maar volgehouden.",
    "Stress op het werk, helaas 1 gerookt.",
    "Ging goed vandaag, weinig aandrang.",
    "Moeilijk momentje in de avond.",
    "Trots! Hele dag niet gerookt.",
    "Afleiding gezocht in wandelen, hielp goed.",
    "Feestje gehad, was lastig maar gelukt.",
    "Ochtend was zwaar, daarna ging het beter."
];

// Mock questions for 4DKL (50 items) - 1 on 1 from PDF
const FOUR_DKL_QUESTIONS = [
    "duizeligheid of een licht gevoel in het hoofd?",
    "pijnlijke spieren?",
    "flauw vallen?",
    "pijn in de nek?",
    "pijn in de rug?",
    "overmatige transpiratie?",
    "hartkloppingen?",
    "hoofdpijn?",
    "een opgeblazen gevoel in de buik?",
    "wazig zien of vlekken voor de ogen zien?",
    "benauwdheid?",
    "misselijkheid of een maag die ‘van streek’ is?",
    "pijn in de buik of maagstreek?",
    "tintelingen in de vingers?",
    "een drukkend of beklemmend gevoel op de borst?",
    "pijn in de borst?",
    "neerslachtigheid?",
    "zomaar plotseling schrikken?",
    "piekeren?",
    "onrustig slapen?",
    "onbestemde angst-gevoelens?",
    "lusteloosheid?",
    "beven in gezelschap van andere mensen?",
    "angst- of paniek-aanvallen?",
    "gespannen?",
    "snel geïrriteerd?",
    "angstig?",
    "dat alles zinloos is?",
    "dat u tot niets meer kunt komen?",
    "dat het leven niet de moeite waard is?",
    "dat u geen belangstelling meer kunt opbrengen voor de mensen en dingen om u heen?",
    "dat u ’t niet meer aankunt?",
    "dat het beter zou zijn als u maar dood was?",
    "dat u nergens meer plezier in kunt hebben?",
    "dat er geen uitweg is uit uw situatie?",
    "dat u er niet meer tegenop kunt?",
    "dat u nergens meer zin in hebt?",
    "moeite met helder denken?",
    "moeite om in slaap te komen?",
    "angst om alleen het huis uit te gaan?",
    "snel emotioneel?",
    "angstig voor iets waarvoor u helemaal niet bang zou hoeven te zijn? (bijvoorbeeld dieren, hoogten, kleine ruimten)",
    "bang om te reizen in bussen, treinen of trams?",
    "bang om in verlegenheid te raken in gezelschap van andere mensen?",
    "Hebt u de afgelopen week weleens een gevoel of u door een onbekend gevaar bedreigd wordt?",
    "Denkt u de afgelopen week weleens “was ik maar dood”?",
    "Schieten u de afgelopen week weleens beelden in gedachten over (een) aangrijpende gebeurtenis(sen) die u hebt meegemaakt?",
    "Moet u de afgelopen week weleens uw best doen om gedachten of herinneringen aan (een) aangrijpende gebeurtenis(sen) van u af te zetten?",
    "Moet u de afgelopen week bepaalde plaatsen vermijden omdat u er angstig van wordt?",
    "Moet u de afgelopen week sommige handelingen een aantal keren herhalen voordat u iets anders kunt gaan doen?"
];

// GAD-7 Questions (Dutch)
const GAD7_QUESTIONS = [
    "U nerveus, angstig of gespannen voelen",
    "Niet kunnen stoppen met piekeren of het niet onder controle kunnen houden",
    "Te veel piekeren over verschillende dingen",
    "Moeite hebben met ontspannen",
    "Zo rusteloos zijn dat het moeilijk is om stil te zitten",
    "Snel geïrriteerd of prikkelbaar worden",
    "Bang voelen alsof er iets vreselijks zou kunnen gebeuren"
];

// --- Helper Functions for Data Generation ---

const generateDailyData = (domain: Domain, days: number): DailyDataPoint[] => {
  const data: DailyDataPoint[] = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateString = date.toISOString().split('T')[0];
    let value = 0;
    let interactions = { morning: false, midday: false, evening: false };
    let details: SleepDataDetails | undefined = undefined;
    let movementDetails: MovementDataDetails | undefined = undefined;
    let nutritionDetails: NutritionDataDetails | undefined = undefined;
    let cigaretteLogs: CigaretteLog[] | undefined = undefined;

    switch (domain) {
      case Domain.Slaap:
        value = Math.floor(Math.random() * 5) + 5; // 5-9 hours
        details = {
          wentToBedOnTime: Math.random() > 0.3,
          noAlcoholOrCoffee: Math.random() > 0.2,
          darkAndQuiet: Math.random() > 0.1,
          goodTemperature: Math.random() > 0.2,
          didMoveToday: Math.random() > 0.4,
          noScreenTime: Math.random() > 0.5,
          relaxingActivity: Math.random() > 0.6,
        };
        break;
      case Domain.Beweeg:
        value = Math.floor(Math.random() * 10000) + 2000; // 2k-12k steps
        // Generate movement details
        const morningDone = Math.random() > 0.4;
        const quizScore = Math.floor(Math.random() * 3); // 0, 1, 2
        
        movementDetails = {
            dailyGoal: 10000,
            morningExerciseCompleted: morningDone,
            quizScore: quizScore
        };

        // Sync generic interactions for the summary view
        interactions = {
            morning: morningDone,
            midday: quizScore > 0, 
            evening: value > 0 // did steps
        };
        break;
      case Domain.Voeding:
        // Day number in the 14-day cycle (1 to 14)
        const dayNum = days - i; 

        // Generate Weight for days 1, 7, 14
        let weight: number | undefined;
        if (dayNum === 1 || dayNum === 7 || dayNum === 14) {
             // Simulate small weight loss: starting ~82kg, dropping slightly
             weight = 82.5 - ((dayNum - 1) * 0.05) + (Math.random() * 0.4 - 0.2);
             weight = parseFloat(weight.toFixed(1));
        }

        const mealsLogged = {
            breakfast: Math.random() > 0.15,
            lunch: Math.random() > 0.15,
            dinner: Math.random() > 0.15
        };

        const nutrQuizScore = Math.floor(Math.random() * 3); // 0-2

        nutritionDetails = {
            weight,
            mealsLogged,
            quizScore: nutrQuizScore
        };
        
        // For generic chart value, use meals logged count (0-3)
        value = (mealsLogged.breakfast ? 1 : 0) + (mealsLogged.lunch ? 1 : 0) + (mealsLogged.dinner ? 1 : 0);
        
        interactions = {
            morning: mealsLogged.breakfast,
            midday: nutrQuizScore > 0, // Assume valid interaction if quiz done
            evening: mealsLogged.dinner
        };
        break;
      case Domain.Stress:
      case Domain.Sociaal:
      case Domain.Ontspanning:
      case Domain.Zingeving:
        value = Math.floor(Math.random() * 10) + 1; // Score 1-10
        break;
      case Domain.Roken:
        value = Math.floor(Math.random() * 10); // 0-10 cigarettes
        cigaretteLogs = [];
        if (value > 0) {
            for(let k = 0; k < value; k++) {
                const h = Math.floor(Math.random() * 15) + 7; // 7am to 10pm
                const m = Math.floor(Math.random() * 60);
                cigaretteLogs.push({
                    id: `log-${dateString}-${k}`,
                    timestamp: `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
                });
            }
            cigaretteLogs.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
        }
        break;
      case Domain.Alcohol:
        value = Math.floor(Math.random() * 5); // 0-4 units
        break;
      case Domain.Financien:
        value = Math.floor(Math.random() * 3) + 1; // Score 1-3
        break;
      default:
        value = Math.floor(Math.random() * 10) + 1; // Score 1-10
    }
    
    // If generic interactions weren't set by Beweeg or Voeding logic, set default empty
    if (domain !== Domain.Beweeg && domain !== Domain.Voeding) {
        interactions = { morning: false, midday: false, evening: false };
    }

    data.push({ 
        date: dateString, 
        value, 
        interactions, 
        details,
        movementDetails,
        nutritionDetails,
        cigaretteLogs 
    });
  }
  return data;
};

const generateChallenges = (currentChallengeIndex: number): Challenge[] => {
  return HEALTH_DOMAINS.map((domain, index) => {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - (currentChallengeIndex - index) * 14);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 14);
    
    const data = generateDailyData(domain, 14);
    let progress = 0;
    
    const interactionsPerDay = domain === Domain.Roken ? 2 : 3;
    const totalInteractions = 14 * interactionsPerDay;

    if (index < currentChallengeIndex) { // Completed challenge
      progress = 100;
      data.forEach(d => { 
          if (domain !== Domain.Beweeg && domain !== Domain.Voeding) { 
             d.interactions = { morning: true, midday: domain !== Domain.Roken, evening: true };
          }
          if (domain === Domain.Roken) {
              d.notes = SMOKING_LOGS[Math.floor(Math.random() * SMOKING_LOGS.length)];
          }
      });
    } else if (index === currentChallengeIndex) { // In-progress challenge
      data.forEach((d, dayIndex) => {
        if (dayIndex < 7) {
          if (domain !== Domain.Beweeg && domain !== Domain.Voeding) { 
              d.interactions = {
                morning: Math.random() > 0.3,
                midday: domain !== Domain.Roken && Math.random() > 0.3,
                evening: Math.random() > 0.3,
              };
          }
          if (domain === Domain.Roken && (d.interactions.morning || d.interactions.evening)) {
             d.notes = SMOKING_LOGS[Math.floor(Math.random() * SMOKING_LOGS.length)];
          }
        } else if (domain === Domain.Beweeg || domain === Domain.Voeding) {
            // Future days shouldn't have data
            if (dayIndex >= 7) {
                d.value = 0;
                if (d.movementDetails) {
                    d.movementDetails.quizScore = 0;
                    d.movementDetails.morningExerciseCompleted = false;
                }
                if (d.nutritionDetails) {
                    d.nutritionDetails.quizScore = 0;
                    d.nutritionDetails.mealsLogged = { breakfast: false, lunch: false, dinner: false };
                    d.nutritionDetails.weight = undefined; // Don't show future weights
                }
                d.interactions = { morning: false, midday: false, evening: false };
            }
        }
      });
      
      const completedInteractions = data.reduce((acc, day) => {
          let count = (day.interactions.morning ? 1 : 0) + (day.interactions.evening ? 1 : 0);
          if (domain !== Domain.Roken) {
              count += (day.interactions.midday ? 1 : 0);
          }
          return acc + count;
      }, 0);
      progress = Math.round((completedInteractions / totalInteractions) * 100);
    } else { // New challenge
      progress = 0;
    }

    return {
      domain,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      progress,
      data,
    };
  });
};

const generateVitalityMeasurements = (count: number): VitalityMeasurement[] => {
  const measurements: VitalityMeasurement[] = [];
  const today = new Date();
  
  let weight = 75 + (Math.random() * 20 - 10);
  let systolic = 120 + (Math.random() * 20 - 10);
  let diastolic = 80 + (Math.random() * 10 - 5);
  let heartRate = 70 + (Math.random() * 10 - 5);
  let sugar = 5.5 + (Math.random() * 1 - 0.5);
  let temp = 37.0;

  for (let i = 0; i < count; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - (i * Math.floor(Math.random() * 5 + 2)));
    
    weight += (Math.random() * 0.5 - 0.25);
    systolic += (Math.random() * 6 - 3);
    diastolic += (Math.random() * 4 - 2);
    heartRate += Math.floor(Math.random() * 8 - 4);
    sugar += (Math.random() * 0.6 - 0.3);
    temp = 36.6 + Math.random() * 0.6;

    measurements.push({
      id: `vit-${i}`,
      date: date.toISOString().split('T')[0],
      time: `${Math.floor(Math.random() * 12 + 8).toString().padStart(2, '0')}-${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
      weight: parseFloat(weight.toFixed(1)),
      bloodPressureSystolic: Math.round(systolic),
      bloodPressureDiastolic: Math.round(diastolic),
      heartRate: Math.round(heartRate),
      temperature: parseFloat(temp.toFixed(1)),
      bloodSugar: parseFloat(sugar.toFixed(1)),
    });
  }
  return measurements.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

const getQuestionnaireMeta = (type: QuestionnaireType): { description: string; maxScore: number } => {
    switch (type) {
        case QuestionnaireType.FourDKL: return { description: "Meet distress, depressie, angst en somatisatie.", maxScore: 50 }; // Note: 50 items total, scoring is per scale
        case QuestionnaireType.PHQ9: return { description: "Screent op symptomen van depressie.", maxScore: 27 };
        case QuestionnaireType.GAD7: return { description: "Screent op symptomen van angst.", maxScore: 21 };
        case QuestionnaireType.HADS: return { description: "Screent op symptomen van zowel angst als depressie.", maxScore: 42 };
        case QuestionnaireType.AUDIT: return { description: "Screent op schadelijk alcoholgebruik.", maxScore: 40 };
        case QuestionnaireType.Fagerstrom: return { description: "Meet de mate van lichamelijke verslaving aan nicotine.", maxScore: 10 };
        case QuestionnaireType.CAT: return { description: "Meet de impact van COPD op uw leven.", maxScore: 40 };
        case QuestionnaireType.mMRC: return { description: "Gradeert de mate van kortademigheid.", maxScore: 4 };
        case QuestionnaireType.VAS: return { description: "Meet de intensiteit van uw pijn.", maxScore: 10 };
        case QuestionnaireType.GFI: return { description: "Screent op kwetsbaarheid bij ouderen.", maxScore: 15 };
        case QuestionnaireType.PAM13: return { description: "Meet uw kennis, vaardigheden en vertrouwen voor zelfmanagement.", maxScore: 100 };
        default: return { description: "", maxScore: 0 };
    }
}

const generateAnswers = (type: QuestionnaireType): QuestionnaireItem[] | undefined => {
    if (type === QuestionnaireType.FourDKL) {
        return FOUR_DKL_QUESTIONS.map((q, i) => {
            const score = Math.floor(Math.random() * 3); // 0, 1, 2
            const labels = ["Nee", "Soms", "Regelmatig of vaker"];
            return {
                id: `q-${i}`,
                question: `${i + 1}. ${q}`,
                answerLabel: labels[score],
                score: score
            };
        });
    }
    
    if (type === QuestionnaireType.GAD7) {
        const labels = ["Helemaal niet", "Meerdere dagen", "Meer dan de helft van de dagen", "Bijna elke dag"];
        return GAD7_QUESTIONS.map((q, i) => {
            const score = Math.floor(Math.random() * 4); // 0, 1, 2, 3
            return {
                id: `gad7-${i}`,
                question: `${i + 1}. ${q}`,
                answerLabel: labels[score],
                score: score
            };
        });
    }

    return undefined;
}

const get4DKLInterpretation = (dimension: string, score: number): { label: string, details: string } => {
    switch (dimension) {
        case 'Distress':
            if (score <= 10) return { label: 'Laag', details: 'Normale spanningen; in principe geen actie nodig.' };
            if (score <= 20) return { label: 'Matig verhoogd', details: 'Verhoogde spanningen met de dreiging van disfunctioneren; stressreductie is wenselijk.' };
            return { label: 'Sterk verhoogd', details: 'Ernstige spanningen met grote kans op disfunctioneren (ziekteverzuim); stressreductie is aangewezen.' };
        case 'Depressie':
            if (score <= 2) return { label: 'Laag', details: 'Waarschijnlijk geen depressieve stoornis.' };
            if (score <= 5) return { label: 'Matig verhoogd', details: 'Mogelijke depressieve stoornis; aanzien en na enkele weken herevalueren; eventueel depressiediagnostiek.' };
            return { label: 'Sterk verhoogd', details: 'Relatief grote kans op een depressieve stoornis; depressiediagnostiek is aangewezen.' };
        case 'Angst':
            if (score <= 3) return { label: 'Laag', details: 'Waarschijnlijk geen angststoornis.' };
            if (score <= 9) return { label: 'Matig verhoogd', details: 'Mogelijke angststoornis; aanzien en na enkele weken herevalueren; eventueel diagnostiek van angststoornissen.' };
            return { label: 'Sterk verhoogd', details: 'Relatief grote kans op één of meer angststoornissen; diagnostiek van angststoornissen is aangewezen.' };
        case 'Somatisatie':
            if (score <= 10) return { label: 'Laag', details: 'Relatief normale lichamelijke spanningsklachten.' };
            if (score <= 20) return { label: 'Matig verhoogd', details: 'Mogelijke somatisatie met dreigend disfunctioneren; bespreken met patiënt.' };
            return { label: 'Sterk verhoogd', details: 'Grote kans op somatisatie; bespreken met patiënt, overweeg cognitieve gedragstherapie of verwijzing.' };
        default:
            return { label: '', details: '' };
    }
};

const generateQuestionnaires = (age: number): QuestionnaireResult[] => {
    const types = Object.values(QuestionnaireType);
    return types.map((type, index) => {
        const { description, maxScore } = getQuestionnaireMeta(type);
        const completed = Math.random() > 0.5;
        let score = completed ? Math.floor(Math.random() * (maxScore + 1)) : undefined;
        
        let resultLabel = '';
        let subScores = undefined;
        let answers = undefined;

        if (completed) {
            answers = generateAnswers(type);
            
            // If we have answers, update the total score to match the sum of answers
            if (answers && answers.length > 0) {
                score = answers.reduce((acc, curr) => acc + curr.score, 0);
            }

            if (score !== undefined) {
                const ratio = score / maxScore;
                if (ratio < 0.3) resultLabel = "Laag risico";
                else if (ratio < 0.7) resultLabel = "Matig risico";
                else resultLabel = "Verhoogd risico";

                // Specific logic for 4DKL
                if (type === QuestionnaireType.FourDKL) {
                    const distressScore = Math.floor(Math.random() * 33); // Max 32
                    const depressionScore = Math.floor(Math.random() * 13); // Max 12
                    const anxietyScore = Math.floor(Math.random() * 25); // Max 24
                    const somatizationScore = Math.floor(Math.random() * 33); // Max 32
                    
                    // Adjust main score to roughly reflect distress or total items (generic fallback for list view)
                    score = Math.min(50, Math.floor((distressScore + depressionScore + anxietyScore + somatizationScore) / 2)); 

                    const distressInfo = get4DKLInterpretation('Distress', distressScore);
                    const depressieInfo = get4DKLInterpretation('Depressie', depressionScore);
                    const angstInfo = get4DKLInterpretation('Angst', anxietyScore);
                    const somatisatieInfo = get4DKLInterpretation('Somatisatie', somatizationScore);

                    subScores = [
                        { 
                            label: 'Distress', 
                            score: distressScore, 
                            max: 32, 
                            threshold: 10,
                            interpretation: distressInfo.label,
                            interpretationDetails: distressInfo.details
                        },
                        { 
                            label: 'Depressie', 
                            score: depressionScore, 
                            max: 12, 
                            threshold: 2,
                            interpretation: depressieInfo.label,
                            interpretationDetails: depressieInfo.details
                        },
                        { 
                            label: 'Angst', 
                            score: anxietyScore, 
                            max: 24, 
                            threshold: 3,
                            interpretation: angstInfo.label,
                            interpretationDetails: angstInfo.details
                        },
                        { 
                            label: 'Somatisatie', 
                            score: somatizationScore, 
                            max: 32, 
                            threshold: 10,
                            interpretation: somatisatieInfo.label,
                            interpretationDetails: somatisatieInfo.details
                        }
                    ];
                    
                    // Update label based on subscores roughly (if any is elevated)
                    if (subScores.some(s => s.score > s.threshold)) {
                        resultLabel = "Verhoogd risico";
                    } else {
                        resultLabel = "Laag risico";
                    }
                }
            }
        }

        // Random date in last 6 months
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 180));

        return {
            id: `q-${index}`,
            type,
            description,
            completed,
            score,
            maxScore,
            resultLabel: completed ? resultLabel : undefined,
            date: completed ? date.toISOString().split('T')[0] : undefined,
            subScores,
            answers
        };
    });
};

const generateDob = (age: number): string => {
    const today = new Date();
    const birthYear = today.getFullYear() - age;
    const birthMonth = Math.floor(Math.random() * 12);
    const birthDay = Math.floor(Math.random() * 28) + 1;
    const birthDate = new Date(birthYear, birthMonth, birthDay);
    return birthDate.toISOString().split('T')[0];
};

const generateMockParticipants = (): Participant[] => {
    return NAMES.map((name, index) => {
        const age = Math.floor(Math.random() * 40) + 25; 
        const firstName = name.split(' ')[0].toLowerCase();
        const lastName = name.split(' ')[1].toLowerCase();

        // Randomize the current challenge to ensure some participants have completed challenges
        const currentChallengeIndex = Math.floor(Math.random() * HEALTH_DOMAINS.length);
        
        const challenges = generateChallenges(currentChallengeIndex);
        const overallProgress = Math.round(challenges.filter(c => c.progress === 100).length / HEALTH_DOMAINS.length * 100);
        
        return {
            id: `${index + 1}`,
            name,
            avatarUrl: `https://picsum.photos/seed/${name.replace(' ','')}/200/200`,
            age,
            dateOfBirth: generateDob(age),
            height: Math.floor(Math.random() * 30) + 160, 
            address: `${STREET_NAMES[index % STREET_NAMES.length]} ${Math.floor(Math.random() * 150) + 1}, ${Math.floor(1000 + Math.random() * 9000)} AB ${CITIES[index % CITIES.length]}`,
            phone: `06 ${Math.floor(10000000 + Math.random() * 90000000)}`,
            email: `${firstName}.${lastName}@email.com`,
            currentChallenge: HEALTH_DOMAINS[currentChallengeIndex],
            overallProgress,
            challenges,
            vitalityMeasurements: generateVitalityMeasurements(3),
            questionnaires: generateQuestionnaires(age),
        };
    });
}

// --- In-Memory State Management ---

let mockParticipants: Participant[] = generateMockParticipants();

const resetChallenge = (challenge: Challenge): Challenge => {
    const newData = generateDailyData(challenge.domain, 14);
    return {
        ...challenge,
        progress: 0,
        data: newData,
    };
};

// --- Exported Service Functions ---

// Check if we should use the API (when authenticated)
const useApi = (): boolean => {
    return !!localStorage.getItem('gp_token');
};

export const startOrRestartChallenge = async (participantId: string, challengeDomain: Domain): Promise<Participant | undefined> => {
    // If using API, call the prescribe endpoint
    if (useApi()) {
        try {
            const { apiService } = await import('./apiService');
            // Map domain to challenge type
            const domainToType: Record<Domain, string> = {
                [Domain.Slaap]: 'sleep',
                [Domain.Beweeg]: 'movement',
                [Domain.Voeding]: 'nutrition',
                [Domain.Roken]: 'smoking',
                [Domain.Sociaal]: 'social',
                [Domain.Stress]: 'stress',
                [Domain.Alcohol]: 'nutrition',
                [Domain.Ontspanning]: 'stress',
                [Domain.Zingeving]: 'social',
                [Domain.Financien]: 'social',
            };
            const type = domainToType[challengeDomain] || 'sleep';
            await apiService.prescribeChallenge(participantId, type);
            // Refetch participant data
            return getParticipantById(participantId);
        } catch (error) {
            console.error('API Error:', error);
            // Fall back to mock
        }
    }

    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const participantIndex = mockParticipants.findIndex(p => p.id === participantId);
    if (participantIndex === -1) return undefined;

    const updatedParticipant = JSON.parse(JSON.stringify(mockParticipants[participantIndex]));
    
    const today = new Date();
    const startDateStr = today.toISOString().split('T')[0];
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + 14);
    const endDateStr = endDate.toISOString().split('T')[0];

    // Reset currently active challenge
    const currentChallengeIndex = updatedParticipant.challenges.findIndex((c: Challenge) => c.progress > 0 && c.progress < 100);
    if (currentChallengeIndex > -1) {
        updatedParticipant.challenges[currentChallengeIndex] = resetChallenge(updatedParticipant.challenges[currentChallengeIndex]);
    }
    
    // Start new challenge
    const targetChallengeIndex = updatedParticipant.challenges.findIndex((c: Challenge) => c.domain === challengeDomain);
    if (targetChallengeIndex > -1) {
        updatedParticipant.challenges[targetChallengeIndex] = resetChallenge(updatedParticipant.challenges[targetChallengeIndex]);
        updatedParticipant.challenges[targetChallengeIndex].progress = 1;
        updatedParticipant.challenges[targetChallengeIndex].startDate = startDateStr;
        updatedParticipant.challenges[targetChallengeIndex].endDate = endDateStr;
    }

    updatedParticipant.currentChallenge = challengeDomain;
    updatedParticipant.overallProgress = Math.round(updatedParticipant.challenges.filter((c: Challenge) => c.progress === 100).length / HEALTH_DOMAINS.length * 100);

    mockParticipants[participantIndex] = updatedParticipant;
    
    return updatedParticipant;
};

export const getParticipants = async (): Promise<Participant[]> => {
    // Try API first if authenticated
    if (useApi()) {
        try {
            const { apiService } = await import('./apiService');
            const response = await apiService.getPatients(1, 100);
            if (response.success && response.data?.patients) {
                // Transform API response to Participant format
                return response.data.patients.map((p: any) => ({
                    id: p.id,
                    name: p.name || 'Onbekend',
                    avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name || 'U')}&background=random`,
                    age: 0,
                    dateOfBirth: '',
                    height: 0,
                    address: '',
                    phone: '',
                    email: p.email || '',
                    currentChallenge: Domain.Slaap,
                    overallProgress: 0,
                    challenges: [],
                    vitalityMeasurements: [],
                    questionnaires: [],
                }));
            }
        } catch (error) {
            console.error('API Error, falling back to mock:', error);
        }
    }

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockParticipants;
};

export const getParticipantById = async (id: string): Promise<Participant | undefined> => {
    // Try API first if authenticated
    if (useApi()) {
        try {
            const { apiService } = await import('./apiService');
            const response = await apiService.getPatientDetail(id);
            if (response.success && response.data) {
                const p = response.data;
                
                // Get additional data
                const [challengesRes, measurementsRes, surveysRes] = await Promise.all([
                    apiService.getPatientChallenges(id),
                    apiService.getPatientMeasurements(id),
                    apiService.getPatientSurveys(id)
                ]);

                // Transform challenges
                const challenges: Challenge[] = (challengesRes.data || []).map((c: any) => ({
                    domain: mapChallengeIdToDomain(c.challengeId || c.type),
                    startDate: c.startDate?.split('T')[0] || '',
                    endDate: c.endDate?.split('T')[0] || '',
                    progress: c.status === 'completed' ? 100 : (c.status === 'stopped' ? 0 : (c.progress || 0)),
                    status: c.status || 'new',
                    data: []
                }));

                // Transform measurements to vitality
                const vitalityMeasurements: VitalityMeasurement[] = (measurementsRes.data || []).map((m: any) => {
                    const base = {
                        id: m.id,
                        date: m.timestamp?.split('T')[0] || '',
                        time: m.timestamp?.split('T')[1]?.substring(0, 5) || '00:00',
                    };
                    
                    switch (m.type) {
                        case 'weight':
                            return { ...base, weight: Number(m.value) };
                        case 'bloodPressure':
                            return { 
                                ...base, 
                                bloodPressureSystolic: m.systolic,
                                bloodPressureDiastolic: m.diastolic 
                            };
                        case 'bloodGlucose':
                            return { ...base, bloodSugar: Number(m.value) };
                        case 'heartRate':
                            return { ...base, heartRate: Number(m.value) };
                        case 'temperature':
                            return { ...base, temperature: Number(m.value) };
                        case 'steps':
                            return { ...base, steps: Number(m.value) };
                        case 'sleepDuration':
                            // sleepDuration stores hours in Hours field or value
                            const hours = m.hours !== undefined ? Number(m.hours) : Number(m.value);
                            const minutes = m.minutes !== undefined ? Number(m.minutes) : 0;
                            return { ...base, sleepHours: hours + (minutes / 60) };
                        default:
                            return base;
                    }
                });

                // Transform surveys to questionnaires
                const questionnaires: QuestionnaireResult[] = (surveysRes.data || []).map((s: any) => ({
                    id: s.id,
                    type: mapSurveyTypeToQuestionnaire(s.type),
                    description: s.type.toUpperCase(),
                    completed: true,
                    date: s.completedAt?.split('T')[0],
                    score: s.score,
                    maxScore: 100,
                    resultLabel: s.interpretation || '',
                    answers: []
                }));

                return {
                    id: p.id,
                    name: p.name || 'Onbekend',
                    avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name || 'U')}&background=random`,
                    age: p.dateOfBirth ? calculateAge(p.dateOfBirth) : 0,
                    dateOfBirth: p.dateOfBirth || '',
                    height: p.initialBMI?.height || 0,
                    address: '',
                    phone: '',
                    email: p.email || '',
                    currentChallenge: challenges.find(c => c.progress > 0 && c.progress < 100)?.domain || Domain.Slaap,
                    overallProgress: challenges.length > 0 ? Math.round(challenges.filter(c => c.progress === 100).length / HEALTH_DOMAINS.length * 100) : 0,
                    // Merge API challenges with all domains - show all domains with their status
                    challenges: HEALTH_DOMAINS.map(d => {
                        const apiChallenge = challenges.find(c => c.domain === d);
                        return apiChallenge || {
                            domain: d,
                            startDate: '',
                            endDate: '',
                            progress: 0,
                            data: []
                        };
                    }),
                    vitalityMeasurements,
                    questionnaires,
                };
            }
        } catch (error) {
            console.error('API Error, falling back to mock:', error);
        }
    }

    await new Promise(resolve => setTimeout(resolve, 300));
    const participant = mockParticipants.find(p => p.id === id);
    return participant;
};

// Helper functions
function mapTypeToChallenge(type: string): Domain {
    const map: Record<string, Domain> = {
        'sleep': Domain.Slaap,
        'movement': Domain.Beweeg,
        'nutrition': Domain.Voeding,
        'smoking': Domain.Roken,
        'social': Domain.Sociaal,
        'stress': Domain.Stress,
    };
    return map[type] || Domain.Slaap;
}

function mapChallengeIdToDomain(challengeId: string): Domain {
    const map: Record<string, Domain> = {
        'sleepChallenge': Domain.Slaap,
        'beweegChallenge': Domain.Beweeg,
        'voedingChallenge': Domain.Voeding,
        'stopRokenChallenge': Domain.Roken,
        'socialChallenge': Domain.Sociaal,
        'stressChallenge': Domain.Stress,
        // Also support legacy type names
        'sleep': Domain.Slaap,
        'movement': Domain.Beweeg,
        'nutrition': Domain.Voeding,
        'smoking': Domain.Roken,
        'social': Domain.Sociaal,
        'stress': Domain.Stress,
    };
    return map[challengeId] || Domain.Slaap;
}

function mapSurveyTypeToQuestionnaire(type: string): QuestionnaireType {
    const map: Record<string, QuestionnaireType> = {
        'phq9': QuestionnaireType.PHQ9,
        'gad7': QuestionnaireType.GAD7,
        'audit': QuestionnaireType.AUDIT,
        'fagerstrom': QuestionnaireType.Fagerstrom,
    };
    return map[type] || QuestionnaireType.PHQ9;
}

function calculateAge(dateOfBirth: string): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}
