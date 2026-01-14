import { GoogleGenAI, Modality, Type, GenerateContentResponse, FunctionDeclaration, Content } from "@google/genai";
import { Language, Quiz, UserInfo, Activity, ChatMessage, ChallengeId } from '../types';
import { Goals, DailyWalkingGoal } from '../goals';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export interface Suggestion {
    text: string;
    isAction?: boolean;
    actionType?: 'startChallenge' | 'setGoal';
    challengeId?: ChallengeId;
    goalType?: keyof Omit<Goals, 'movementChallenge' | 'voedingChallenge' | 'stopRokenChallenge' | 'socialChallenge'>;
    activityId?: string;
}

export interface ChatResponseWithSuggestions {
    text: string;
    suggestions: Suggestion[];
    functionCalls?: any[];
}

const dataUrlToBase64 = (dataUrl: string) => dataUrl.split(',')[1];

// --- Retry Logic ---
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  retries = 5, // Increased retries for 429s
  initialDelay = 2000,
  factor = 2
): Promise<T> {
  let currentDelay = initialDelay;

  for (let i = 0; i < retries; i++) {
    try {
      return await operation();
    } catch (error: any) {
      // Enhanced error parsing for Google API errors
      const statusCode = error?.status || error?.response?.status || error?.code || error?.error?.code;
      const errorMessage = error?.message || error?.error?.message || JSON.stringify(error);
      
      // Check for 429 (Too Many Requests / Resource Exhausted) or 503 (Service Unavailable)
      const is429 = 
        statusCode === 429 || 
        (typeof errorMessage === 'string' && (
            errorMessage.includes('429') || 
            errorMessage.includes('RESOURCE_EXHAUSTED') ||
            errorMessage.includes('Resource has been exhausted')
        ));

      const isRetryable = is429 || statusCode === 503;
      
      if (!isRetryable || i === retries - 1) {
        throw error;
      }

      // If it's a 429, wait at least 5 seconds to let quota replenish
      const delayTime = is429 ? Math.max(currentDelay, 5000) : currentDelay;

      console.warn(`API call failed with status ${statusCode || 'unknown'}. Retrying in ${delayTime}ms... (Attempt ${i + 1}/${retries})`);
      
      // Add jitter to prevent thundering herd
      const jitter = Math.random() * 1000;
      await delay(delayTime + jitter);
      
      currentDelay = delayTime * factor;
    }
  }
  throw new Error('Max retries exceeded');
}
// -------------------

export const generateAvatar = async (photoDataUrl: string, userInfo: UserInfo): Promise<string> => {
    try {
        const imagePart = {
            inlineData: {
                mimeType: 'image/jpeg',
                data: dataUrlToBase64(photoDataUrl),
            },
        };

        const ageInfo = userInfo.age ? `The user is ${userInfo.age} years old.` : '';
        const genderInfo = userInfo.gender && userInfo.gender !== 'unspecified' ? `The user is a ${userInfo.gender}.` : '';

        const textPart = {
            text: `Create a simple, friendly cartoon avatar from this photo. Style: modern vector art. ${ageInfo} ${genderInfo}`
        };

        const response = await retryWithBackoff<GenerateContentResponse>(() => ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [imagePart, textPart] },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        }));
        
        const partWithInlineData = response?.candidates?.[0]?.content?.parts?.find(p => p.inlineData);

        if (partWithInlineData?.inlineData?.data) {
            const base64ImageBytes: string = partWithInlineData.inlineData.data;
            return `data:image/png;base64,${base64ImageBytes}`;
        }
        
        const finishReason = response?.candidates?.[0]?.finishReason;
        const safetyRatings = response?.candidates?.[0]?.safetyRatings;
        console.warn(`Could not generate avatar. API response was missing image data. Finish Reason: ${finishReason}. Safety Ratings: ${JSON.stringify(safetyRatings)}. Falling back to original photo.`);
        return photoDataUrl;

    } catch (error) {
        console.warn("Error generating avatar (falling back to photo):", JSON.stringify(error, null, 2));
        // Fallback to the original photo if avatar generation fails
        return photoDataUrl;
    }
};

export const getBraintainmentNudge = async (
    activityName: string,
    language: Language,
    userInfo: UserInfo,
    goalText: string | null,
    memoryDetailsText: string | null,
): Promise<string> => {
    const langInstruction = language === 'nl' ? 'in Dutch' : 'in English';
    let prompt = `You are a friendly and supportive AI lifestyle coach. The user just completed an activity: "${activityName}".
    User info: Age ${userInfo.age}, Gender ${userInfo.gender}.
    Generate a single, short (under 25 words), encouraging, and personalized braintainment tip related to the activity.
    The response must be a single string of plain text, without any markdown or special formatting.
    Respond ${langInstruction}.`;

    if (goalText) {
        prompt += `\nTheir current goal for this is: "${goalText}". Relate the tip to their goal.`;
    }
    if (memoryDetailsText) {
        prompt += `\nThey provided these details about the activity: "${memoryDetailsText}". Use these details to make the tip more specific.`;
    }

    try {
        const response = await retryWithBackoff<GenerateContentResponse>(() => ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        }));
        return response.text?.trim() || (language === 'nl' ? 'Goed gedaan! Blijf zo doorgaan.' : 'Great job! Keep it up.');
    } catch (error) {
        console.warn("Error generating braintainment nudge (using fallback):", error);
        return language === 'nl' ? 'Goed gedaan! Blijf zo doorgaan.' : 'Great job! Keep it up.';
    }
};

export const generateQuizQuestion = async (nudge: string, activityName: string, language: Language): Promise<Quiz | null> => {
    const langInstruction = language === 'nl' ? 'in het Nederlands' : 'in English';

    const quizSchema = {
        type: Type.OBJECT,
        properties: {
            question: {
                type: Type.STRING,
                description: "A multiple-choice question about the provided tip.",
            },
            options: {
                type: Type.ARRAY,
                description: "An array of 3 possible answers.",
                items: {
                    type: Type.OBJECT,
                    properties: {
                        text: { type: Type.STRING },
                        emoji: { type: Type.STRING, description: "A single emoji for the option." },
                    },
                    required: ["text", "emoji"],
                },
            },
            correctOption: {
                type: Type.STRING,
                description: "The exact text of the correct answer from the options array.",
            },
        },
        required: ["question", "options", "correctOption"],
    };
    
    const prompt = `Based on this previous braintainment tip about "${activityName}", create one multiple-choice quiz question to test the user's memory of it.
    The question should have 3 plausible options, but only one correct answer.
    The tip was: "${nudge}"
    Respond ${langInstruction}.`;

    try {
        const response = await retryWithBackoff<GenerateContentResponse>(() => ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: quizSchema,
            },
        }));
        
        const text = response.text;
        if (text) {
             const jsonStart = text.indexOf('{');
             const jsonEnd = text.lastIndexOf('}');
             if (jsonStart !== -1 && jsonEnd !== -1) {
                const jsonString = text.substring(jsonStart, jsonEnd + 1);
                const parsed = JSON.parse(jsonString);
                if (parsed.question && Array.isArray(parsed.options) && parsed.options.length === 3 && parsed.correctOption) {
                    return parsed as Quiz;
                }
             }
        }
        return null;
    } catch (error) {
        console.warn("Error generating quiz question:", error);
        return null;
    }
};

export const generateUpdatedAvatar = async (
    currentAvatar: string,
    activity: Activity,
    goal: Goals[keyof Goals] | undefined,
    memoryPhotoData: string | null
): Promise<string> => {
    try {
        const imagePart = {
            inlineData: {
                mimeType: 'image/png', // assuming avatar is png
                data: dataUrlToBase64(currentAvatar),
            },
        };

        let prompt = `Slightly update this friendly cartoon avatar to reflect that the person just completed the activity: "${activity.id}". Make them look a bit happier and more energetic. Keep the style consistent. The change should be subtle.`;

        const contents: any = { parts: [imagePart, { text: prompt }] };

        if (memoryPhotoData) {
            contents.parts.push({
                inlineData: {
                    mimeType: 'image/jpeg',
                    data: dataUrlToBase64(memoryPhotoData),
                }
            });
            contents.parts[1].text += ' If an image of the activity is provided, you can subtly incorporate an element from it.';
        }

        const response = await retryWithBackoff<GenerateContentResponse>(() => ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents,
            config: {
                responseModalities: [Modality.IMAGE],
            },
        }));

        const partWithInlineData = response?.candidates?.[0]?.content?.parts?.find(p => p.inlineData);

        if (partWithInlineData?.inlineData?.data) {
            const base64ImageBytes: string = partWithInlineData.inlineData.data;
            return `data:image/png;base64,${base64ImageBytes}`;
        }
        
        console.warn(`Could not generate updated avatar. Falling back to original.`);
        return currentAvatar;

    } catch (error) {
        console.warn("Error generating updated avatar:", JSON.stringify(error, null, 2));
        return currentAvatar;
    }
};

export const generateSpeech = async (text: string): Promise<string | null> => {
    try {
        const response = await retryWithBackoff<GenerateContentResponse>(() => ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                      prebuiltVoiceConfig: { voiceName: 'Kore' },
                    },
                },
            },
        }));
        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        return base64Audio || null;
    } catch (error) {
        console.warn("Error generating speech:", error);
        return null;
    }
};

const setLifestyleGoalDeclaration: FunctionDeclaration = {
  name: 'setLifestyleGoal',
  description: "Sets or updates a user's lifestyle goal based on the available goal types.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      goalType: {
        type: Type.STRING,
        description: "The type of goal to set.",
        enum: ['dailyWalking', 'movingBreaks', 'strength', 'regularSleep', 'screenOff', 'realFood', 'fruitVeg', 'water', 'alcohol', 'calmTime', 'socialContact', 'timeOutside', 'smoking', 'weight']
      },
      // We'll accept dynamic arguments based on the goal type, but for the schema definition, we keep it simple or use 'object' if the SDK allows flexible schemas.
      // Since we process the args dynamically in the chat handler, this minimal definition is often sufficient for the model to understand the intent.
      // To be more precise, we could define all possible parameters for all goals here, but it would be a very large schema.
      // The model is usually smart enough to extract relevant parameters if instructed or if it infers them.
      // For now, let's add some common ones to help it.
      walkingType: { type: Type.STRING, description: "For dailyWalking: e.g. 'brisk', 'casual'" },
      walkingValue: { type: Type.NUMBER, description: "For dailyWalking: minutes" },
      stressMinutes: { type: Type.NUMBER, description: "For calmTime: minutes" },
      hobbyName: { type: Type.STRING },
      sportName: { type: Type.STRING },
      bookTitle: { type: Type.STRING },
      socialPeople: { type: Type.STRING },
      socialActivity: { type: Type.STRING },
      frequency: { type: Type.NUMBER },
      mealType: { type: Type.STRING },
      mealDescription: { type: Type.STRING },
    },
    required: ['goalType']
  }
};

const startChallengeDeclaration: FunctionDeclaration = {
  name: 'startChallenge',
  description: "Starts a guided lifestyle challenge for the user. Use this when the user expresses a desire to work on a goal that corresponds to one of the available challenges (sleep, movement, nutrition, quitting smoking, social skills, stress).",
  parameters: {
    type: Type.OBJECT,
    properties: {
      challengeId: {
        type: Type.STRING,
        description: "The ID of the challenge to start.",
        enum: ['sleepChallenge', 'beweegChallenge', 'voedingChallenge', 'stopRokenChallenge', 'socialChallenge', 'stressChallenge']
      },
    },
    required: ['challengeId']
  }
};

const suggestionSchema = {
    type: Type.OBJECT,
    properties: {
        text: { type: Type.STRING, description: "The suggestion text for the user." },
        isAction: { type: Type.BOOLEAN, description: "Set to true if this suggestion is a direct action the user can take in the app." },
        actionType: { type: Type.STRING, description: "If an action, specify the type.", enum: ['startChallenge', 'setGoal'] },
        challengeId: { type: Type.STRING, description: "If action is 'startChallenge', the ID of the challenge.", enum: ['sleepChallenge', 'beweegChallenge', 'voedingChallenge', 'stopRokenChallenge', 'socialChallenge', 'stressChallenge'] },
        goalType: { type: Type.STRING, description: "If action is 'setGoal', the type of goal.", enum: ['dailyWalking', 'movingBreaks', 'strength', 'regularSleep', 'screenOff', 'realFood', 'fruitVeg', 'water', 'alcohol', 'calmTime', 'socialContact', 'timeOutside', 'smoking', 'weight'] },
        activityId: { type: Type.STRING, description: "If action is 'setGoal', the related activity ID for navigation (e.g. 'nature' for 'dailyWalking' goal)." }
    },
    required: ["text", "isAction"]
};

const chatResponseSchema = {
    type: Type.OBJECT,
    properties: {
        response: {
            type: Type.STRING,
            description: "The conversational response to the user."
        },
        suggestions: {
            type: Type.ARRAY,
            items: suggestionSchema,
            description: "An array of exactly 3 follow-up suggestions."
        }
    },
    required: ["response", "suggestions"]
};

export const generateChatResponse = async (context: string, history: ChatMessage[], language: Language): Promise<ChatResponseWithSuggestions> => {
    const languageInstruction = language === 'nl' ? 'Antwoord in het Nederlands.' : 'Answer in English.';

    const contents: Content[] = history.map(msg => {
        const parts = [];
        if (msg.content) {
            parts.push({ text: msg.content });
        }
        if (msg.functionCall) {
            parts.push({ functionCall: msg.functionCall });
        }
        if (msg.functionResponse) {
             parts.push({ functionResponse: msg.functionResponse });
        }
        return { role: msg.role, parts };
    }).filter(c => c.parts.length > 0);

    const fallbackResponse = {
        text: language === 'nl' ? "Sorry, er is een fout opgetreden. Probeer het later opnieuw." : "Sorry, an error occurred. Please try again later.",
        suggestions: [],
    };

    try {
        const response = await retryWithBackoff<GenerateContentResponse>(() => ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents,
            config: {
                systemInstruction: `You are eMaat, a friendly and supportive AI lifestyle coach.
Your goal is to help the user reflect on their health journey based on the data provided from their app.
Analyze the provided context about the user's state, and their chat history.
Answer the user's questions in a supportive, encouraging, and brief manner (under 80 words).
Do not give medical advice. If asked for medical advice, gently refer the user to a healthcare professional.
When the user wants to set a new lifestyle goal, use the 'setLifestyleGoal' function.
When the user expresses a desire to work on a goal that corresponds to an available challenge (sleep, movement, nutrition, smoking, social skills), use the 'startChallenge' function.

If you are not calling a function, your entire response MUST be a single, valid JSON object, without any markdown formatting (like \`\`\`json). The JSON object must have a key "response" containing your conversational text as a string, and a key "suggestions" containing an array of exactly 3 suggestion objects.
Each suggestion object must have a "text" (string) and "isAction" (boolean) key. If "isAction" is true, it must also include an "actionType" ('startChallenge' or 'setGoal') and the corresponding "challengeId" or "goalType".

After your text response, YOU MUST provide exactly 3 follow-up suggestions in the 'suggestions' field. 
Two suggestions should be questions phrased from the user's perspective, asking for advice or reflection on their journey (e.g., "What can I do to improve my sleep quality?", "Based on my activity, what should I focus on?").
One suggestion MUST be an actionable item (isAction: true) for the user to either start a challenge or set a new goal.

Here is the user's data summary:
${context}
${languageInstruction}`,
                tools: [{ functionDeclarations: [setLifestyleGoalDeclaration, startChallengeDeclaration] }],
            },
        }));

        if (response.functionCalls && response.functionCalls.length > 0) {
            return {
                text: '',
                suggestions: [],
                functionCalls: response.functionCalls,
            };
        }
        
        const text = response.text;
        if (text) {
            try {
              // FIX: The Gemini API may return conversational text before the JSON object.
              // This extracts the JSON object from the response string.
              const jsonStart = text.indexOf('{');
              const jsonEnd = text.lastIndexOf('}');
              
              if (jsonStart !== -1 && jsonEnd !== -1) {
                  const jsonString = text.substring(jsonStart, jsonEnd + 1);
                  const parsed = JSON.parse(jsonString) as { response: string, suggestions: Suggestion[] };
                  if (parsed) {
                      // The API response sometimes duplicates the conversational text inside and outside the JSON.
                      // Use the JSON `response` field as the single source of truth.
                      return {
                          text: parsed.response || '',
                          suggestions: parsed.suggestions || [],
                      };
                  }
              } else {
                  console.error("Failed to find JSON in chat response:", text);
                  // If no JSON found, return the whole text as response, without suggestions.
                  return { ...fallbackResponse, text: text || fallbackResponse.text };
              }
            } catch (e) {
                console.error("Failed to parse chat response as JSON:", text, e);
                // In case of parsing error, return the raw text to at least show something to the user.
                return { ...fallbackResponse, text: text || fallbackResponse.text };
            }
        }
        
        return fallbackResponse;

    } catch (error) {
        console.warn("Error generating chat response (using fallback):", JSON.stringify(error, null, 2));
        return fallbackResponse;
    }
};

const suggestionsSchema = {
    type: Type.OBJECT,
    properties: {
        suggestions: {
            type: Type.ARRAY,
            items: suggestionSchema,
            description: "An array of exactly 3 questions or actions."
        }
    },
    required: ["suggestions"]
};

export const generateChatSuggestions = async (context: string, language: Language): Promise<Suggestion[]> => {
    const fallbackSuggestions: Suggestion[] = [
        { text: language === 'nl' ? "Hoe deed ik het vorige week?" : "How did I do last week?" },
        { text: language === 'nl' ? "Wat was mijn laatste meting?" : "What was my last measurement?" },
        { text: language === 'nl' ? "Waar moet ik me vandaag op richten?" : "What should I focus on today?", isAction: true, actionType: 'setGoal', goalType: 'dailyWalking', activityId: 'nature' },
    ];
    try {
        const languageInstruction = language === 'nl' ? 'in Dutch' : 'in English';
        const prompt = `Based on the user's data summary, generate exactly 3 short, relevant, and engaging suggestions for a user to start a conversation with their AI coach.
        - The suggestions should be phrased from the user's perspective, asking for advice, tips, or reflections related to their data (e.g., "How can I improve...?", "What was my best...?").
        - One suggestion MUST be an actionable item (isAction: true) for the user to either start a challenge or set a new goal.
        The suggestions must be ${languageInstruction}.
        
        User data summary:
        ${context}`;

        const response = await retryWithBackoff<GenerateContentResponse>(() => ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: suggestionsSchema,
            },
        }));

        const text = response.text;
        if (text) {
            try {
                // FIX: Extract JSON object from the response string, which might contain extra text or markdown fences.
                const jsonStart = text.indexOf('{');
                const jsonEnd = text.lastIndexOf('}');
                if (jsonStart !== -1 && jsonEnd !== -1) {
                    const jsonString = text.substring(jsonStart, jsonEnd + 1);
                    const data = JSON.parse(jsonString) as { suggestions: Suggestion[] };
                    if (data.suggestions && Array.isArray(data.suggestions) && data.suggestions.length > 0) {
                        return data.suggestions.slice(0, 3);
                    }
                } else {
                     console.error("Failed to find JSON in chat suggestions response:", text);
                }
            } catch (e) {
                 console.error("Error parsing chat suggestions JSON:", text, e);
            }
        }
        return fallbackSuggestions;
    } catch (error) {
        // Downgrade to warn so we don't alarm the user in the console, as we have fallbacks.
        console.warn("Error generating chat suggestions (using fallback):", error);
        return fallbackSuggestions;
    }
};