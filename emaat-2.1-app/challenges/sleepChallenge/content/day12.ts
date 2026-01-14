export const day12 = {
  en: {
    title: 'Sleep and Caffeine',
    saying: 'Coffee rules the day, but is the enemy of the night.',
    summary: "Caffeine has a direct negative effect on the amount of REM sleep you get. Since REM sleep is crucial for processing information and learning, caffeine use disrupts this important phase, even though it hasn't been proven to increase productivity.",
    sections: [
      { icon: 'NoCoffeeIcon', title: 'No Coffee', content: 'On average, you get 107 minutes of REM sleep with 8 hours of sleep per night.' },
      { icon: 'CoffeeIcon', title: '1 Cup of Coffee', content: 'On average, you get 86 minutes of REM sleep with 8 hours of sleep per night.' },
      { icon: 'CoffeeIcon', title: '2 Cups of Coffee', content: 'On average, you get 72 minutes of REM sleep with 8 hours of sleep per night.' },
      { icon: 'CoffeeIcon', title: '3 Cups of Coffee', content: 'On average, you get 66 minutes of REM sleep with 8 hours of sleep per night.' },
    ],
    readMore: 'Many people drink coffee as a stimulant. It has never been proven that caffeine increases productivity, but it does disrupt REM sleep.',
    quiz: [
      {
        question: 'Which sleep stage is mainly disrupted by caffeine?',
        options: [
          { text: 'Deep Sleep', emoji: '🛌' },
          { text: 'Light Sleep', emoji: '😴' },
          { text: 'REM Sleep', emoji: '🧠' },
        ],
        correct: 'REM Sleep',
      },
      {
        question: 'How many minutes of REM sleep do you lose on average by drinking 3 cups of coffee (based on 8 hours of sleep)?',
        options: [
          { text: 'About 20 minutes', emoji: '🤔' },
          { text: 'About 40 minutes', emoji: '😟' },
          { text: 'About 60 minutes', emoji: '😩' },
        ],
        correct: 'About 40 minutes',
      },
    ],
  },
  nl: {
    title: 'Slaap en cafeïne',
    saying: 'Koffie is de baas over de dag, maar de vijand van de nacht.',
    summary: 'Cafeïne heeft een direct negatief effect op de hoeveelheid REM-slaap. Omdat REM-slaap cruciaal is voor informatieverwerking en leren, verstoort cafeïnegebruik deze belangrijke fase, ook al is niet bewezen dat het de productiviteit verhoogt.',
    sections: [
      { icon: 'NoCoffeeIcon', title: 'Geen koffie', content: 'Gemiddeld krijg je 107 minuten REM-slaap bij 8 uur slaap per nacht.' },
      { icon: 'CoffeeIcon', title: '1 kop koffie', content: 'Gemiddeld krijg je 86 minuten REM-slaap bij 8 uur slaap per nacht.' },
      { icon: 'CoffeeIcon', title: '2 koppen koffie', content: 'Gemiddeld krijg je 72 minuten REM-slaap bij 8 uur slaap per nacht.' },
      { icon: 'CoffeeIcon', title: '3 koppen koffie', content: 'Gemiddeld krijg je 66 minuten REM-slaap bij 8 uur slaap per nacht.' },
    ],
    readMore: 'Veel mensen drinken koffie als stimulerend middel. Het is nooit bewezen dat cafeïne de productiviteit verhoogt, maar het verstoort wel de REM-slaap.',
    quiz: [
      {
        question: 'Welke slaapfase wordt voornamelijk verstoord door cafeïne?',
        options: [
          { text: 'Diepe Slaap', emoji: '🛌' },
          { text: 'Lichte Slaap', emoji: '😴' },
          { text: 'REM-slaap', emoji: '🧠' },
        ],
        correct: 'REM-slaap',
      },
      {
        question: 'Hoeveel minuten REM-slaap verlies je gemiddeld bij het drinken van 3 koppen koffie (uitgaande van 8 uur slaap)?',
        options: [
          { text: 'Ongeveer 20 minuten', emoji: '🤔' },
          { text: 'Ongeveer 40 minuten', emoji: '😟' },
          { text: 'Ongeveer 60 minuten', emoji: '😩' },
        ],
        correct: 'Ongeveer 40 minuten',
      },
    ],
  },
};