export const day13 = {
  en: {
    title: 'The Right Fuel',
    saying: 'The right fuel for movement and nutrition.',
    summary: 'Focuses on the optimal nutrition strategy around exercise, with advice on timing and the type of food (carbohydrates, proteins, fats) for maximum energy and recovery.',
    sections: [
      { icon: 'FoodIcon', title: 'Eating Before Exercise', content: 'The best time is between 1 to 3 hours before exercise. Avoid fatty foods and too much protein, as they take longer to digest and hinder performance. Carbohydrates are good as they release energy gradually.' },
      { icon: 'FoodIcon', title: 'During Exercise', content: 'You want to get sugars in quickly, for example, with fruit (banana) or dextrose. Ensure a gradual and regular supply of sugar, for example, through carbohydrates, because pure sugar is quickly used up after a peak.' },
      { icon: 'FoodIcon', title: 'After Exercise (Recovery)', content: 'Good to replenish reserves and consumed substances: Vitamin C for damage, proteins to repair muscle cells, and fats and sugars for energy.' },
      { icon: 'HydrationIcon', title: 'Hydration', content: 'Don\'t forget to drink enough water before and after exercise, as your body will recover less well otherwise.' },
    ],
    readMore: 'If you have just eaten, more blood goes to your intestines and your nervous system adjusts to rest and digestion, which inhibits performance. During recovery, muscle and connective tissue are repaired stronger; proteins, vitamins, and antioxidants are important then.',
    quiz: [
      {
        question: 'What type of food is best to eat 1-3 hours before exercising?',
        options: [
          { text: 'A fatty meal', emoji: '🍔' },
          { text: 'Carbohydrates', emoji: '🍌' },
          { text: 'A large portion of protein', emoji: '🍗' },
        ],
        correct: 'Carbohydrates',
      },
      {
        question: 'What is important for muscle repair after exercising?',
        options: [
          { text: 'Sugars', emoji: '🍬' },
          { text: 'Fats', emoji: '🥑' },
          { text: 'Proteins', emoji: '🥚' },
        ],
        correct: 'Proteins',
      },
    ],
  },
  nl: {
    title: 'De Juiste Brandstof',
    saying: 'De juiste brandstof. Bewegen en voeding',
    summary: 'Richt zich op de optimale voedingsstrategie rondom het sporten, met advies over timing en het type voeding (koolhydraten, eiwitten, vetten) voor maximale energie en herstel.',
    sections: [
      { icon: 'FoodIcon', title: 'Eten vóór het sporten', content: 'Beste moment is tussen 3 tot 1 uur voor het sporten. Vermijd te vet eten en te veel eiwitten, omdat die langer duren om te verteren en de prestaties langer remmen. Koolhydraten zijn goed, omdat ze geleidelijk energie afgeven.' },
      { icon: 'FoodIcon', title: 'Tijdens het sporten', content: 'Je wilt snel suikers binnenkrijgen, bijvoorbeeld met fruit (banaan) of druivensuiker. Zorg voor een geleidelijke en regelmatige aanvoer van suiker, bijvoorbeeld door koolhydraten, want pure suiker is snel weer op na een piek.' },
      { icon: 'FoodIcon', title: 'Na het sporten (Herstel)', content: 'Goed om reserves en verbruikte stoffen weer aan te vullen: Vitamine C voor beschadigingen, eiwitten om spiercellen te repareren, en vetten en suikers voor energie.' },
      { icon: 'HydrationIcon', title: 'Hydratatie', content: 'Vergeet niet voldoende water te drinken voor en na het sporten, omdat je lichaam anders minder goed herstelt.' },
    ],
    readMore: 'Als je net gegeten hebt, gaat er meer bloed naar je darmen en stelt je zenuwstelsel zich in op rust en spijsvertering, wat de prestaties remt. Tijdens herstel wordt spier- en bindweefsel sterker gerepareerd; eiwitten, vitamines en anti-oxidanten zijn dan van belang.',
    quiz: [
      {
        question: 'Welk type voeding kun je het beste eten 1-3 uur voor het sporten?',
        options: [
          { text: 'Een vette maaltijd', emoji: '🍔' },
          { text: 'Koolhydraten', emoji: '🍌' },
          { text: 'Een grote portie eiwitten', emoji: '🍗' },
        ],
        correct: 'Koolhydraten',
      },
      {
        question: 'Wat is belangrijk voor spierherstel na het sporten?',
        options: [
          { text: 'Suikers', emoji: '🍬' },
          { text: 'Vetten', emoji: '🥑' },
          { text: 'Eiwitten', emoji: '🥚' },
        ],
        correct: 'Eiwitten',
      },
    ],
  },
};
