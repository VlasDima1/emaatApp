export const day4 = {
  en: {
    title: 'Sleep and Physical Health',
    saying: 'Health begins with a good night’s rest.',
    summary: "A lack of sleep directly affects serious physical conditions. It increases the risk of heart disease, high blood pressure, and obesity (by disrupting hunger hormones). It also raises the chances of chronic illnesses like diabetes and cancer.",
    sections: [
      { icon: 'HeartIcon', title: 'Heart Disease', content: 'Not enough sleep increases the risk of heart problems. Your heart and blood vessels repair themselves during sleep.' },
      { icon: 'BloodPressureIcon', title: 'Blood Pressure', content: 'Lack of sleep can lead to high blood pressure because it disrupts the hormones that control stress.' },
      { icon: 'WeightIcon', title: 'Obesity', content: 'Sleep affects hunger hormones. When you lack sleep, your body produces more of the hormone that makes you hungry and less of the one that makes you feel full.' },
      { icon: 'VirusIcon', title: 'Illness/Diabetes', content: 'Getting enough sleep improves your immune system, reduces inflammation, and lowers the risk of chronic diseases and diabetes.' },
      { icon: 'CancerIcon', title: 'Cancer', content: 'The risk of some types of cancer increases if you do not get enough sleep.' },
      { icon: 'SkullIcon', title: 'Risk of Death', content: 'Even the risk of dying sooner is increased by a lack of sleep.' },
    ],
    readMore: 'The consequences of not getting enough healthy sleep are huge, including costs from lost productivity, accidents, and illnesses. A lack of sleep has both immediate and long-term effects. Obesity and weight gain are linked to sleeping less than 6 hours per night.',
    quiz: [
      {
        question: 'What is a long-term consequence of sleep deprivation on your blood pressure?',
        options: [
          { text: 'It can lower it', emoji: '📉' },
          { text: 'It can raise it', emoji: '📈' },
          { text: 'It has no effect', emoji: '🤷' },
        ],
        correct: 'It can raise it',
      },
      {
        question: 'Which hormones are affected by sleep and play a role in obesity?',
        options: [
          { text: 'Stress hormones', emoji: '😟' },
          { text: 'Growth hormones', emoji: '💪' },
          { text: 'Hunger hormones', emoji: '🍔' },
        ],
        correct: 'Hunger hormones',
      },
    ],
  },
  nl: {
    title: 'Slaap en lichamelijke gezondheid',
    saying: 'Gezondheid begint bij een goede nachtrust.',
    summary: 'Een gebrek aan slaap heeft direct invloed op ernstige lichamelijke aandoeningen. Het verhoogt het risico op hart- en vaatziekten, hoge bloeddruk en overgewicht (door het verstoren van hongerhormonen). Het verhoogt ook de kans op chronische ziekten zoals suikerziekte en kanker.',
    sections: [
      { icon: 'HeartIcon', title: 'Hartziekten', content: 'Te weinig slaap verhoogt de kans op hartproblemen. Je hart en bloedvaten herstellen zichzelf tijdens de slaap.' },
      { icon: 'BloodPressureIcon', title: 'Bloeddruk', content: 'Slaapgebrek kan leiden tot een hoge bloeddruk omdat het de hormonen verstoort die stress reguleren.' },
      { icon: 'WeightIcon', title: 'Overgewicht', content: 'Slaap beïnvloedt de hongerhormonen. Bij slaaptekort maakt je lichaam meer van het hormoon aan dat je hongerig maakt en minder van het hormoon dat je een vol gevoel geeft.' },
      { icon: 'VirusIcon', title: 'Ziekte/Suikerziekte', content: 'Voldoende slaap verbetert je immuunsysteem, vermindert ontstekingen en verlaagt het risico op chronische ziekten en suikerziekte.' },
      { icon: 'CancerIcon', title: 'Kanker', content: 'Het risico op sommige soorten kanker neemt toe als je niet genoeg slaapt.' },
      { icon: 'SkullIcon', title: 'Kans op overlijden', content: 'Zelfs de kans om eerder te overlijden wordt verhoogd door een gebrek aan slaap.' },
    ],
    readMore: 'De gevolgen van onvoldoende gezonde slaap zijn enorm, inclusief kosten door verloren productiviteit, ongelukken en ziektes. Een gebrek aan slaap heeft zowel onmiddellijke als langetermijneffecten. Obesitas en gewichtstoename zijn gekoppeld aan minder dan 6 uur slaap per nacht.',
    quiz: [
      {
        question: 'Wat is een langetermijngevolg van slaaptekort op je bloeddruk?',
        options: [
          { text: 'Het kan deze verlagen', emoji: '📉' },
          { text: 'Het kan deze verhogen', emoji: '📈' },
          { text: 'Het heeft geen effect', emoji: '🤷' },
        ],
        correct: 'Het kan deze verhogen',
      },
      {
        question: 'Welke hormonen worden beïnvloed door slaap en spelen een rol bij overgewicht?',
        options: [
          { text: 'Stresshormonen', emoji: '😟' },
          { text: 'Groeihormonen', emoji: '💪' },
          { text: 'Hongerhormonen', emoji: '🍔' },
        ],
        correct: 'Hongerhormonen',
      },
    ],
  },
};