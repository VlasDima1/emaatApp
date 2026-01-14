
export const fagerstromTranslations = {
  en: {
    fagerstrom: {
      name: "Fagerström Test for Nicotine Dependence",
      description: "Measures the level of physical addiction to nicotine.",
      dimensions: { score: "Dependence Score" },
      interpretations: {
        score: {
          low: "Low to moderate nicotine dependence.",
          moderate: "Moderate nicotine dependence.",
          high: "High nicotine dependence.",
        },
      },
      advice: {
        score: {
            low: "Your level of nicotine dependence is low. This is a great position to be in for quitting successfully. Planning and behavioral strategies can be very effective.",
            moderate: "You have a moderate level of nicotine dependence. When you decide to quit, you might benefit from nicotine replacement therapy (NRT) to manage withdrawal symptoms.",
            high: "Your score indicates a high level of physical dependence on nicotine. It is strongly recommended to seek support from a healthcare provider to create a quit plan, which may include NRT or other medications.",
        },
      },
      questions: {
        q1: "How soon after you wake up do you smoke your first cigarette?",
        q2: "Do you find it difficult to refrain from smoking in places where it is forbidden (e.g., in church, at the library, in a cinema)?",
        q3: "Which cigarette would you hate most to give up?",
        q4: "How many cigarettes per day do you smoke?",
        q5: "Do you smoke more frequently during the first hours after waking than during the rest of the day?",
        q6: "Do you smoke if you are so ill that you are in bed most of the day?",
      },
      answers: {
        q1a0: "Within 5 minutes", q1a1: "6-30 minutes", q1a2: "31-60 minutes", q1a3: "After 60 minutes",
        q3a0: "The first one in the morning", q3a1: "All others",
        q4a0: "31 or more", q4a1: "21-30", q4a2: "11-20", q4a3: "10 or less",
      },
    },
  },
  nl: {
    fagerstrom: {
      name: "Fagerström Test voor Nicotineafhankelijkheid",
      description: "Meet de mate van lichamelijke verslaving aan nicotine.",
      dimensions: { score: "Afhankelijkheidsscore" },
      interpretations: {
        score: {
          low: "Lage tot matige nicotineafhankelijkheid.",
          moderate: "Matige nicotineafhankelijkheid.",
          high: "Hoge nicotineafhankelijkheid.",
        },
      },
      advice: {
        score: {
            low: "Uw mate van nicotineafhankelijkheid is laag. Dit is een uitstekende uitgangspositie om succesvol te stoppen. Planning en gedragsstrategieën kunnen zeer effectief zijn.",
            moderate: "U heeft een matige mate van nicotineafhankelijkheid. Wanneer u besluit te stoppen, kunt u baat hebben bij nicotinevervangende therapie (NVT) om ontwenningsverschijnselen te beheersen.",
            high: "Uw score duidt op een hoge mate van lichamelijke afhankelijkheid van nicotine. Het wordt sterk aanbevolen om ondersteuning te zoeken bij een zorgverlener om een stopplan op te stellen, dat NVT of andere medicatie kan omvatten.",
        },
      },
      questions: {
        q1: "Hoe snel na het ontwaken rookt u uw eerste sigaret?",
        q2: "Vindt u het moeilijk om niet te roken op plaatsen waar het verboden is (bv. in de kerk, bibliotheek, bioscoop)?",
        q3: "Welke sigaret zou u het minst graag opgeven?",
        q4: "Hoeveel sigaretten rookt u per dag?",
        q5: "Rookt u vaker gedurende de eerste uren na het ontwaken dan gedurende de rest van de dag?",
        q6: "Rookt u als u zo ziek bent dat u het grootste deel van de dag in bed ligt?",
      },
      answers: {
        q1a0: "Binnen 5 minuten", q1a1: "6-30 minuten", q1a2: "31-60 minuten", q1a3: "Na 60 minuten",
        q3a0: "De eerste 's ochtends", q3a1: "Alle andere",
        q4a0: "31 of meer", q4a1: "21-30", q4a2: "11-20", q4a3: "10 of minder",
      },
    },
  },
  tr: {
    fagerstrom: {
      name: "Fagerström Nikotin Bağımlılık Testi",
      description: "Nikotine olan fiziksel bağımlılık düzeyini ölçer.",
      dimensions: { score: "Bağımlılık Skoru" },
      interpretations: {
        score: {
          low: "Düşük ila orta düzeyde nikotin bağımlılığı.",
          moderate: "Orta düzeyde nikotin bağımlılığı.",
          high: "Yüksek nikotin bağımlılığı.",
        },
      },
      advice: {
        score: {
            low: "Nikotin bağımlılık seviyeniz düşüktür. Bu, başarıyla bırakmak için harika bir konumdur. Planlama ve davranışsal stratejiler çok etkili olabilir.",
            moderate: "Orta düzeyde bir nikotin bağımlılığınız var. Bırakmaya karar verdiğinizde, yoksunluk belirtilerini yönetmek için nikotin replasman tedavisinden (NRT) faydalanabilirsiniz.",
            high: "Puanınız, nikotine yüksek düzeyde fiziksel bağımlılığa işaret etmektedir. NRT veya diğer ilaçları içerebilecek bir bırakma planı oluşturmak için bir sağlık uzmanından destek almanız şiddetle tavsiye edilir.",
        },
      },
      questions: {
        q1: "Uyandıktan ne kadar sonra ilk sigaranızı içersiniz?",
        q2: "Yasak olan yerlerde (örneğin kilisede, kütüphanede, sinemada) sigara içmekten kaçınmakta zorlanıyor musunuz?",
        q3: "Hangi sigarayı bırakmaktan en çok nefret edersiniz?",
        q4: "Günde kaç sigara içiyorsunuz?",
        q5: "Uyandıktan sonraki ilk saatlerde, günün geri kalanına göre daha sık mı sigara içersiniz?",
        q6: "Günün çoğunu yatakta geçirecek kadar hasta olsanız bile sigara içer misiniz?",
      },
      answers: {
        q1a0: "5 dakika içinde", q1a1: "6-30 dakika", q1a2: "31-60 dakika", q1a3: "60 dakika sonra",
        q3a0: "Sabah ilk sigara", q3a1: "Diğer hepsi",
        q4a0: "31 veya daha fazla", q4a1: "21-30", q4a2: "11-20", q4a3: "10 veya daha az",
      },
    },
  },
  fr: {
    fagerstrom: {
      name: "Test de Fagerström pour la dépendance à la nicotine",
      description: "Mesure le niveau de dépendance physique à la nicotine.",
      dimensions: { score: "Score de dépendance" },
      interpretations: {
        score: {
          low: "Dépendance à la nicotine faible à modérée.",
          moderate: "Dépendance à la nicotine modérée.",
          high: "Dépendance à la nicotine élevée.",
        },
      },
      advice: {
        score: {
          low: "Votre niveau de dépendance à la nicotine est faible. C'est une excellente position pour arrêter avec succès. La planification et les stratégies comportementales peuvent être très efficaces.",
          moderate: "Vous avez un niveau de dépendance à la nicotine modéré. Lorsque vous déciderez d'arrêter, vous pourriez bénéficier d'une thérapie de remplacement de la nicotine (TRN) pour gérer les symptômes de sevrage.",
          high: "Votre score indique un niveau élevé de dépendance physique à la nicotine. Il est fortement recommandé de chercher du soutien auprès d'un professionnel de la santé pour créer un plan d'arrêt, qui peut inclure la TRN ou d'autres médicaments.",
        },
      },
      questions: {
        q1: "Combien de temps après votre réveil fumez-vous votre première cigarette ?",
        q2: "Trouvez-vous difficile de vous abstenir de fumer dans les endroits où c'est interdit (ex: église, bibliothèque, cinéma) ?",
        q3: "À quelle cigarette renonceriez-vous le plus difficilement ?",
        q4: "Combien de cigarettes fumez-vous par jour ?",
        q5: "Fumez-vous plus fréquemment durant les premières heures après votre réveil que durant le reste de la journée ?",
        q6: "Fumez-vous si vous êtes si malade que vous êtes au lit la plupart de la journée ?",
      },
      answers: {
        q1a0: "Dans les 5 minutes", q1a1: "6-30 minutes", q1a2: "31-60 minutes", q1a3: "Après 60 minutes",
        q3a0: "La première du matin", q3a1: "Toutes les autres",
        q4a0: "31 ou plus", q4a1: "21-30", q4a2: "11-20", q4a3: "10 ou moins",
      },
    },
  },
};
