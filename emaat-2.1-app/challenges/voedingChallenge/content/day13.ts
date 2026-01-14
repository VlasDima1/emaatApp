export const day13 = {
  en: {
    title: 'Malnutrition',
    saying: "No meat on the bones",
    summary: "Malnutrition can have various causes and does not always manifest as visible underweight.",
    sections: [
      { icon: 'AgeIcon', title: 'Age', content: 'As people get older, the risk of malnutrition increases.' },
      { icon: 'MemoryProblemsIcon', title: 'Memory Problems', content: 'Besides overeating, there is an increased risk of malnutrition.' },
      { icon: 'DiseaseIcon', title: 'Sickness', content: 'People who are sick have different nutritional needs that are sometimes difficult to meet. Also, with pain and medication, appetite can become so low that malnutrition occurs.' },
      { icon: 'IntakeDisorderIcon', title: 'Absorption Disorder', content: 'Some conditions can ensure that certain foods are not absorbed.' },
    ],
    readMore: 'Many factors lead to malnutrition, including a one-sided diet. Sometimes people still look overweight, but their muscle mass is already significantly decreasing. Staying healthy is not growing too much and not shrinking too much.',
    quiz: [
      {
        question: "What happens to the risk of malnutrition as people get older?",
        options: [
          { text: "It decreases", emoji: "📉" },
          { text: "It increases", emoji: "📈" },
          { text: "It stays the same", emoji: "🤷" },
        ],
        correct: "It increases",
      },
      {
        question: "Can someone who is overweight also be malnourished?",
        options: [
          { text: "No, that's impossible", emoji: "❌" },
          { text: "Yes, they can lose muscle mass while looking overweight", emoji: "🤔" },
          { text: "Only if they are very old", emoji: "👵" },
        ],
        correct: "Yes, they can lose muscle mass while looking overweight",
      },
    ],
  },
  nl: {
    title: 'Ondervoeding',
    saying: 'Geen vlees op de botten',
    summary: 'Ondervoeding kan verschillende oorzaken hebben en manifesteert zich niet altijd als zichtbaar ondergewicht.',
    sections: [
      { icon: 'AgeIcon', title: 'Leeftijd', content: 'Naarmate mensen ouder worden, neemt de kans op ondervoeding toe.' },
      { icon: 'MemoryProblemsIcon', title: 'Geheugenproblemen', content: 'Naast overeten is er een verhoogd risico op ondervoeding.' },
      { icon: 'DiseaseIcon', title: 'Ziekte', content: 'Mensen die ziek zijn, hebben een andere voedingsbehoefte die soms moeilijk te voldoen is. Ook bij pijn en medicijnen kan de eetlust zo laag worden dat ondervoeding ontstaat.' },
      { icon: 'IntakeDisorderIcon', title: 'Opnamestoornis', content: 'Sommige aandoeningen kunnen ervoor zorgen dat bepaalde voedingsmiddelen niet worden opgenomen.' },
    ],
    readMore: 'Vele factoren leiden tot ondervoeding, ook eenzijdige voeding. Soms zien mensen er nog dik uit, maar neemt hun spiermassa al flink af. Gezond blijven is niet te veel groeien en niet te veel krimpen.',
    quiz: [
      {
        question: "Wat gebeurt er met het risico op ondervoeding naarmate mensen ouder worden?",
        options: [
          { text: "Het neemt af", emoji: "📉" },
          { text: "Het neemt toe", emoji: "📈" },
          { text: "Het blijft hetzelfde", emoji: "🤷" },
        ],
        correct: "Het neemt toe",
      },
      {
        question: "Kan iemand die te zwaar is ook ondervoed zijn?",
        options: [
          { text: "Nee, dat is onmogelijk", emoji: "❌" },
          { text: "Ja, ze kunnen spiermassa verliezen terwijl ze er zwaar uitzien", emoji: "🤔" },
          { text: "Alleen als ze heel oud zijn", emoji: "👵" },
        ],
        correct: "Ja, ze kunnen spiermassa verliezen terwijl ze er zwaar uitzien",
      },
    ],
  },
};
