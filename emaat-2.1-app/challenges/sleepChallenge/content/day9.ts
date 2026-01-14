export const day9 = {
  en: {
    title: 'Sleep, Traffic, and Alcohol',
    saying: 'Driving with lack of sleep is more dangerous than you think.',
    summary: 'Lack of sleep is a leading cause of traffic accidents, more so than alcohol or smartphone use. Alcohol seriously disrupts sleep stages; even 1-3 drinks make sleep more restless and cause more awakenings. With 4 or more drinks, sleep quality drops sharply.',
    sections: [
      { icon: 'TrafficIcon', title: 'Sleep and Traffic', content: 'Lack of sleep is the main reason for traffic accidents and makes the effect of alcohol stronger. Always be well-rested when you drive.' },
      { icon: 'AlcoholIcon', title: '0 Drinks', content: 'You sleep better without alcohol. Your nervous system is not disturbed.' },
      { icon: 'AlcoholIcon', title: '1-3 Drinks', content: 'Causes disruption: you fall asleep easier, but sleep is more restless and you wake up more often. It also makes you need to pee more often.' },
      { icon: 'AlcoholIcon', title: '4-7 Drinks', content: 'The normal sleep stages are severely disrupted. You sleep more restlessly, the quality decreases, and you wake up tired, even after 8 hours of sleep.' },
      { icon: 'AlcoholIcon', title: '8 or More Drinks', content: 'Your body is busier breaking down alcohol than sleeping. You need extra days to catch up on lost sleep.' },
    ],
    readMore: 'Lack of sleep is the main cause of traffic accidents, so always be well-rested on the road. A nightcap might help you fall asleep, but your sleep will be more restless and you will wake up more often.',
    quiz: [
      {
        question: 'What is the main cause of traffic accidents, according to the text?',
        options: [
          { text: 'Alcohol use', emoji: '🍺' },
          { text: 'Lack of sleep', emoji: '😴' },
          { text: 'Phone use', emoji: '📱' },
        ],
        correct: 'Lack of sleep',
      },
      {
        question: 'What is the effect of 1-3 alcoholic drinks on your sleep?',
        options: [
          { text: 'It makes sleep deeper', emoji: '👍' },
          { text: 'It makes sleep more restless', emoji: '👎' },
          { text: 'It has no effect', emoji: '🤷' },
        ],
        correct: 'It makes sleep more restless',
      },
    ],
  },
  nl: {
    title: 'Slaap, verkeer en alcohol',
    saying: 'Rijden met slaaptekort is gevaarlijker dan je denkt.',
    summary: 'Slaaptekort is de belangrijkste oorzaak van verkeersongelukken, meer dan alcohol- of smartphonegebruik. Alcohol verstoort de slaapfasen ernstig; zelfs 1-3 drankjes maken de slaap onrustiger en zorgen ervoor dat je vaker wakker wordt. Vanaf 4 drankjes neemt de slaapkwaliteit sterk af.',
    sections: [
      { icon: 'TrafficIcon', title: 'Slaap en verkeer', content: 'Slaaptekort is de voornaamste reden voor verkeersongelukken en versterkt het effect van alcohol. Ga altijd goed uitgerust de weg op.' },
      { icon: 'AlcoholIcon', title: '0 drankjes', content: 'Je slaapt beter zonder alcohol. Je zenuwstelsel is niet verstoord.' },
      { icon: 'AlcoholIcon', title: '1-3 drankjes', content: 'Veroorzaakt verstoring: je valt makkelijker in slaap, maar slaapt onrustiger en wordt vaker wakker. Het zorgt er ook voor dat je vaker moet plassen.' },
      { icon: 'AlcoholIcon', title: '4-7 drankjes', content: 'De normale slaapfasen zijn ernstig verstoord. Je slaapt onrustiger, de kwaliteit neemt af en je wordt moe wakker, zelfs na 8 uur slaap.' },
      { icon: 'AlcoholIcon', title: '8 of meer drankjes', content: 'Je lichaam is meer bezig met het afbreken van alcohol dan met slapen. Je hebt extra dagen nodig om de verloren slaap in te halen.' },
    ],
    readMore: 'Slaaptekort is de belangrijkste oorzaak van ongelukken in het verkeer, dus ga altijd goed uitgerust de weg op. Een slaapmutsje kan helpen bij het inslapen, maar je slaap wordt onrustiger en je wordt vaker wakker.',
    quiz: [
      {
        question: 'Wat is de belangrijkste oorzaak van verkeersongelukken, volgens de tekst?',
        options: [
          { text: 'Alcoholgebruik', emoji: '🍺' },
          { text: 'Slaaptekort', emoji: '😴' },
          { text: 'Telefoongebruik', emoji: '📱' },
        ],
        correct: 'Slaaptekort',
      },
      {
        question: 'Wat is het effect van 1-3 alcoholische drankjes op je slaap?',
        options: [
          { text: 'Het maakt de slaap dieper', emoji: '👍' },
          { text: 'Het maakt de slaap onrustiger', emoji: '👎' },
          { text: 'Het heeft geen effect', emoji: '🤷' },
        ],
        correct: 'Het maakt de slaap onrustiger',
      },
    ],
  },
};