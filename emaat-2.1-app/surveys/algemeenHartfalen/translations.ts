export const algemeenHartfalenTranslations = {
  en: {
    algemeenHartfalen: {
      name: "General Questionnaire (Heart Failure)",
        description: "A comprehensive assessment of your wellbeing and heart failure symptoms.",
        dimensions: {
          score: "Total Score",
          generalScore: "General Symptoms",
          heartFailureScore: "Heart Failure Symptoms",
        },
        interpretations: {
          score: {
            low: "Low symptom burden.",
            moderate: "Moderate symptom burden.",
            high: "High symptom burden.",
          },
          generalScore: {
            low: "Few general symptoms.",
            moderate: "Moderate general symptoms.",
            high: "Many general symptoms.",
          },
          heartFailureScore: {
            low: "Few heart failure symptoms.",
            moderate: "Moderate heart failure symptoms.",
            high: "Many heart failure symptoms.",
          },
        },
        advice: {
          score: {
            low: "You seem to be managing well. Keep up your healthy habits!",
            moderate: "There are some areas of concern. Discuss these with your healthcare provider.",
            high: "Your symptom burden is high. It is recommended to discuss this with your healthcare provider.",
          },
        },
        questions: {
          // General questions G1-G11
          g1: "In the past week, how often did you experience fatigue?",
          g2: "In the past week, how often did you have poor sleep?",
          g3: "In the past week, how often did you experience sadness, anxiety, frustration, shame, or other unpleasant feelings?",
          g4: "In the past week, how often did you experience medication use (e.g., tablets, inhalers, insulin) as a burden?",
          g5: "In the past week, to what extent did you feel limited in heavy physical activities (climbing stairs, hurrying, sports)?",
          g6: "In the past week, to what extent did you feel limited in moderate physical activities (walking, housework, shopping)?",
          g7: "In the past week, to what extent did you feel limited in daily activities (dressing, washing)?",
          g8: "In the past week, to what extent did you feel limited in work or social activities (outings, visiting friends and family)?",
          g9: "In the past week, to what extent did your condition negatively affect your relationships with others?",
          g10: "In the past week, to what extent did you have difficulty with intimacy and sexuality?",
          g11: "In the past week, to what extent were you worried about your future?",
          // Heart failure questions H1-H9
          h1: "In the past week, to what extent did you experience shortness of breath while lying (flat), or did you wake up because of it?",
          h2: "In the past week, to what extent did you experience shortness of breath while standing still or sitting?",
          h3: "In the past week, to what extent did you experience one of the following: dizziness, abdominal complaints, chest pain, lack of appetite, or coughing?",
          h4: "In the past week, to what extent were you anxious or worried that something would happen to your heart?",
          h5: "In the past week, to what extent did you find it bothersome to adjust your life (e.g., planning activities and medication intake, daily weighing, watching salt and fluid intake)?",
          h6: "In the past week, to what extent did you have a swollen abdomen, legs, feet, or ankles?",
          h7: "In the past three months, how often did you experience a sudden increase or decrease in weight (more than 2 kg in 3 days)?",
          h8: "In the past three months, how often were your medications adjusted due to increased symptoms?",
          h9: "In the past three months, how often were you admitted to the hospital due to symptoms?",
        },
        answers: {
          // Frequency scale (0-6)
          freq0: "Never",
          freq1: "Rarely",
          freq2: "Occasionally",
          freq3: "Regularly",
          freq4: "Very often",
          freq5: "Mostly",
          freq6: "Always",
          // Severity scale (0-6)
          sev0: "Not at all",
          sev1: "Very little",
          sev2: "A little",
          sev3: "Fairly",
          sev4: "Very",
          sev5: "Very much",
          sev6: "Completely",
          // Occurrences scale (0-4)
          occ0: "Not",
          occ1: "1 time",
          occ2: "2 times",
          occ3: "3 times",
          occ4: "4 times or more",
        },
      },
  },
  nl: {
    algemeenHartfalen: {
      name: "Algemene vragenlijst (Hartfalen)",
        description: "Een uitgebreide vragenlijst over uw welzijn en hartfalen symptomen.",
        dimensions: {
          score: "Totaalscore",
          generalScore: "Algemene Symptomen",
          heartFailureScore: "Hartfalen Symptomen",
        },
        interpretations: {
          score: {
            low: "Lage symptoomlast.",
            moderate: "Matige symptoomlast.",
            high: "Hoge symptoomlast.",
          },
          generalScore: {
            low: "Weinig algemene symptomen.",
            moderate: "Matige algemene symptomen.",
            high: "Veel algemene symptomen.",
          },
          heartFailureScore: {
            low: "Weinig hartfalen symptomen.",
            moderate: "Matige hartfalen symptomen.",
            high: "Veel hartfalen symptomen.",
          },
        },
        advice: {
          score: {
            low: "U lijkt goed om te gaan met uw aandoening. Ga zo door met uw gezonde gewoonten!",
            moderate: "Er zijn enkele aandachtspunten. Bespreek deze met uw zorgverlener.",
            high: "Uw symptoomlast is hoog. Het wordt aanbevolen dit met uw zorgverlener te bespreken.",
          },
        },
        questions: {
          // General questions G1-G11
          g1: "In de afgelopen week, hoe vaak had u last van vermoeidheid?",
          g2: "In de afgelopen week, hoe vaak had u een slechte nachtrust?",
          g3: "In de afgelopen week, hoe vaak had u last van somberheid, angst, frustratie, schaamte of andere vervelende gevoelens?",
          g4: "In de afgelopen week, hoe vaak ervaarde u het gebruik van medicijnen (bijv. tabletten, pufjes, insuline) als een last?",
          g5: "In de afgelopen week, in welke mate voelde u zich beperkt in zware lichamelijke activiteiten (trap lopen, haasten, sporten)?",
          g6: "In de afgelopen week, in welke mate voelde u zich beperkt in matige lichamelijke activiteiten (wandelen, huishoudelijk werk, boodschappen doen)?",
          g7: "In de afgelopen week, in welke mate voelde u zich beperkt in dagelijkse activiteiten (u zelf aankleden, wassen)?",
          g8: "In de afgelopen week, in welke mate voelde u zich beperkt in uw werk of sociale activiteiten (uitjes, vrienden en familie bezoeken)?",
          g9: "In de afgelopen week, in welke mate had uw aandoening een negatieve invloed op uw relatie met anderen?",
          g10: "In de afgelopen week, in welke mate had u moeite met intimiteit en seksualiteit?",
          g11: "In de afgelopen week, in welke mate maakte u zich zorgen over uw toekomst?",
          // Heart failure questions H1-H9
          h1: "In de afgelopen week, in welke mate had u last van kortademigheid bij (plat)liggen, of werd u hierdoor wakker?",
          h2: "In de afgelopen week, in welke mate had u last van kortademigheid bij stilstaan of zitten?",
          h3: "In de afgelopen week, in welke mate had u last van één van de volgende klachten: duizeligheid, buikklachten, pijn op de borst, gebrek aan eetlust of hoesten?",
          h4: "In de afgelopen week, in welke mate was u angstig of bezorgd dat er iets met uw hart zou gebeuren?",
          h5: "In de afgelopen week, in welke mate vond u het vervelend uw leven aan te passen (bijv. plannen van activiteiten en medicatie-inname, dagelijks wegen en letten op zout- en vochtinname)?",
          h6: "In de afgelopen week, in welke mate had u last van een opgezwollen buik, benen, voeten of enkels?",
          h7: "In de afgelopen drie maanden, hoe vaak had u last van een plotselinge toename of afname in gewicht (meer dan 2 kilo in 3 dagen)?",
          h8: "In de afgelopen drie maanden, hoe vaak zijn uw medicijnen aangepast door een toename van klachten?",
          h9: "In de afgelopen drie maanden, hoe vaak bent u opgenomen in het ziekenhuis door klachten?",
        },
        answers: {
          // Frequency scale (0-6)
          freq0: "Nooit",
          freq1: "Zelden",
          freq2: "Af en toe",
          freq3: "Regelmatig",
          freq4: "Heel vaak",
          freq5: "Meestal",
          freq6: "Altijd",
          // Severity scale (0-6)
          sev0: "Helemaal niet",
          sev1: "Heel weinig",
          sev2: "Een beetje",
          sev3: "Tamelijk",
          sev4: "Erg",
          sev5: "Heel erg",
          sev6: "Volledig",
          // Occurrences scale (0-4)
          occ0: "Niet",
          occ1: "1 keer",
          occ2: "2 keer",
          occ3: "3 keer",
          occ4: "4 keer of vaker",
      },
    },
  },
};