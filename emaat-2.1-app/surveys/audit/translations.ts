
export const auditTranslations = {
  en: {
    audit: {
      name: "Alcohol Use Disorders Identification Test (AUDIT)",
      description: "Screens for hazardous alcohol consumption.",
      dimensions: { score: "AUDIT Score" },
      interpretations: {
        score: {
          low: "Low-risk alcohol consumption.",
          moderate: "Hazardous alcohol use. Reducing your drinking is advised.",
          high: "Likely alcohol dependence. Further assessment and treatment are recommended.",
        },
      },
      advice: {
        score: {
          low: "You are currently drinking at a low-risk level. Continue to be mindful of your consumption.",
          moderate: "Your drinking pattern suggests a risk to your health. Consider setting limits, having alcohol-free days, and avoiding high-risk situations.",
          high: "Your score indicates that your drinking is likely causing harm, and you may be dependent. It is strongly recommended to speak with a healthcare provider about this.",
        },
      },
      questions: {
        q1: "How often do you have a drink containing alcohol?",
        q2: "How many standard drinks containing alcohol do you have on a typical day when you are drinking?",
        q3: "How often do you have six or more standard drinks on one occasion?",
        q4: "How often during the last year have you found that you were not able to stop drinking once you had started?",
        q5: "How often during the last year have you failed to do what was normally expected from you because of drinking?",
        q6: "How often during the last year have you needed a first drink in the morning to get yourself going after a heavy drinking session?",
        q7: "How often during the last year have you had a feeling of guilt or remorse after drinking?",
        q8: "How often during the last year have you been unable to remember what happened the night before because you had been drinking?",
        q9: "Have you or someone else been injured as a result of your drinking?",
        q10: "Has a relative, friend, doctor, or other health worker been concerned about your drinking or suggested you cut down?",
      },
      answers: {
        q1a0: "Never", q1a1: "Monthly or less", q1a2: "2-4 times a month", q1a3: "2-3 times a week", q1a4: "4 or more times a week",
        q2a0: "1 or 2", q2a1: "3 or 4", q2a2: "5 or 6", q2a3: "7 to 9", q2a4: "10 or more",
        q9a1: "Yes, but not in the last year", q9a2: "Yes, during the last year",
      },
    },
  },
  nl: {
    audit: {
      name: "Alcohol Use Disorders Identification Test (AUDIT)",
      description: "Screent op schadelijk alcoholgebruik.",
      dimensions: { score: "AUDIT Score" },
      interpretations: {
        score: {
          low: "Alcoholgebruik met een laag risico.",
          moderate: "Gevaarlijk alcoholgebruik. Het wordt aangeraden om minder te drinken.",
          high: "Waarschijnlijke alcoholafhankelijkheid. Verdere beoordeling en behandeling worden aanbevolen.",
        },
      },
      advice: {
        score: {
          low: "U drinkt momenteel op een laag-risico niveau. Blijf bewust van uw consumptie.",
          moderate: "Uw drinkpatroon suggereert een risico voor uw gezondheid. Overweeg limieten te stellen, alcoholvrije dagen in te lassen en risicovolle situaties te vermijden.",
          high: "Uw score geeft aan dat uw drinkgedrag waarschijnlijk schade veroorzaakt en dat u mogelijk afhankelijk bent. Het wordt sterk aanbevolen hierover te praten met een zorgverlener.",
        },
      },
      questions: {
        q1: "Hoe vaak drinkt u een drank die alcohol bevat?",
        q2: "Hoeveel standaardglazen alcohol drinkt u op een typische dag dat u drinkt?",
        q3: "Hoe vaak drinkt u zes of meer standaardglazen bij één gelegenheid?",
        q4: "Hoe vaak in het afgelopen jaar kon u niet stoppen met drinken als u eenmaal begonnen was?",
        q5: "Hoe vaak in het afgelopen jaar heeft u door drinken verzaakt te doen wat normaal van u werd verwacht?",
        q6: "Hoe vaak in het afgelopen jaar had u 's ochtends een eerste drankje nodig om op gang te komen na een avond zwaar drinken?",
        q7: "Hoe vaak in het afgelopen jaar had u een schuldgevoel of wroeging na het drinken?",
        q8: "Hoe vaak in het afgelopen jaar kon u zich niet herinneren wat er de avond ervoor was gebeurd omdat u had gedronken?",
        q9: "Bent u of is iemand anders gewond geraakt als gevolg van uw drinken?",
        q10: "Is een familielid, vriend, arts of andere gezondheidswerker bezorgd geweest over uw drinken of heeft hij/zij voorgesteld om te minderen?",
      },
      answers: {
        q1a0: "Nooit", q1a1: "Maandelijks of minder", q1a2: "2-4 keer per maand", q1a3: "2-3 keer per week", q1a4: "4 of meer keer per week",
        q2a0: "1 of 2", q2a1: "3 of 4", q2a2: "5 of 6", q2a3: "7 tot 9", q2a4: "10 of meer",
        q9a1: "Ja, maar niet in het afgelopen jaar", q9a2: "Ja, in het afgelopen jaar",
      },
    },
  },
  tr: {
    audit: {
      name: "Alkol Kullanım Bozuklukları Tanımlama Testi (AUDIT)",
      description: "Zararlı alkol tüketimini tarar.",
      dimensions: { score: "AUDIT Skoru" },
      interpretations: {
        score: {
          low: "Düşük riskli alkol tüketimi.",
          moderate: "Zararlı alkol kullanımı. İçkiyi azaltmanız tavsiye edilir.",
          high: "Muhtemel alkol bağımlılığı. Daha fazla değerlendirme ve tedavi önerilir.",
        },
      },
      advice: {
        score: {
          low: "Şu anda düşük risk seviyesinde içki içiyorsunuz. Tüketiminizin bilincinde olmaya devam edin.",
          moderate: "İçki alışkanlığınız sağlığınız için bir risk oluşturuyor. Sınırlar koymayı, alkolsüz günler geçirmeyi ve yüksek riskli durumlardan kaçınmayı düşünün.",
          high: "Puanınız, içkinizin muhtemelen zarar verdiğini ve bağımlı olabileceğinizi göstermektedir. Bu konuyu bir sağlık uzmanıyla konuşmanız şiddetle tavsiye edilir.",
        },
      },
      questions: {
        q1: "Ne sıklıkla alkol içeren bir içki içersiniz?",
        q2: "İçki içtiğiniz tipik bir günde kaç standart içki içersiniz?",
        q3: "Ne sıklıkla bir seferde altı veya daha fazla standart içki içersiniz?",
        q4: "Geçen yıl içinde ne sıklıkla içmeye başladıktan sonra duramadığınızı fark ettiniz?",
        q5: "Geçen yıl içinde ne sıklıkla içki yüzünden normalde sizden beklenenleri yapamadınız?",
        q6: "Geçen yıl içinde ne sıklıkla ağır bir içki seansından sonra kendinize gelmek için sabah ilk içkinize ihtiyaç duydunuz?",
        q7: "Geçen yıl içinde ne sıklıkla içtikten sonra suçluluk veya pişmanlık hissettiniz?",
        q8: "Geçen yıl içinde ne sıklıkla içtiğiniz için bir önceki gece olanları hatırlayamadınız?",
        q9: "Siz veya başka biri içkiniz sonucunda yaralandı mı?",
        q10: "Bir akraba, arkadaş, doktor veya başka bir sağlık çalışanı içkiniz hakkında endişelendi mi veya azaltmanızı önerdi mi?",
      },
      answers: {
        q1a0: "Asla", q1a1: "Aylık veya daha az", q1a2: "Ayda 2-4 kez", q1a3: "Haftada 2-3 kez", q1a4: "Haftada 4 veya daha fazla kez",
        q2a0: "1 veya 2", q2a1: "3 veya 4", q2a2: "5 veya 6", q2a3: "7 ila 9", q2a4: "10 veya daha fazla",
        q9a1: "Evet, ama geçen yıl değil", q9a2: "Evet, geçen yıl içinde",
      },
    },
  },
  fr: {
    audit: {
      name: "Test d'identification des troubles liés à l'usage de l'alcool (AUDIT)",
      description: "Dépiste la consommation d'alcool à risque.",
      dimensions: { score: "Score AUDIT" },
      interpretations: {
        score: {
          low: "Consommation d'alcool à faible risque.",
          moderate: "Consommation d'alcool à risque. Il est conseillé de réduire votre consommation.",
          high: "Dépendance à l'alcool probable. Une évaluation et un traitement plus approfondis sont recommandés.",
        },
      },
      advice: {
        score: {
          low: "Vous buvez actuellement à un niveau de risque faible. Continuez à être attentif à votre consommation.",
          moderate: "Votre mode de consommation suggère un risque pour votre santé. Envisagez de fixer des limites, d'avoir des jours sans alcool et d'éviter les situations à haut risque.",
          high: "Votre score indique que votre consommation d'alcool est probablement nocive et que vous pourriez être dépendant. Il est fortement recommandé d'en parler avec un professionnel de la santé.",
        },
      },
      questions: {
        q1: "À quelle fréquence buvez-vous une boisson contenant de l'alcool ?",
        q2: "Combien de verres standard contenant de l'alcool buvez-vous un jour typique où vous buvez ?",
        q3: "À quelle fréquence buvez-vous six verres standard ou plus en une seule occasion ?",
        q4: "Au cours de la dernière année, combien de fois avez-vous constaté que vous ne pouviez pas arrêter de boire une fois que vous aviez commencé ?",
        q5: "Au cours de la dernière année, combien de fois n'avez-vous pas réussi à faire ce qui était normalement attendu de vous à cause de l'alcool ?",
        q6: "Au cours de la dernière année, combien de fois avez-vous eu besoin d'un premier verre le matin pour vous remettre en route après une soirée bien arrosée ?",
        q7: "Au cours de la dernière année, combien de fois avez-vous eu un sentiment de culpabilité ou de remords après avoir bu ?",
        q8: "Au cours de la dernière année, combien de fois avez-vous été incapable de vous souvenir de ce qui s'est passé la veille parce que vous aviez bu ?",
        q9: "Vous êtes-vous blessé ou quelqu'un d'autre a-t-il été blessé à la suite de votre consommation d'alcool ?",
        q10: "Un parent, un ami, un médecin ou un autre professionnel de la santé s'est-il inquiété de votre consommation d'alcool ou vous a-t-il suggéré de réduire ?",
      },
      answers: {
        q1a0: "Jamais", q1a1: "Mensuellement ou moins", q1a2: "2-4 fois par mois", q1a3: "2-3 fois par semaine", q1a4: "4 fois ou plus par semaine",
        q2a0: "1 ou 2", q2a1: "3 ou 4", q2a2: "5 ou 6", q2a3: "7 à 9", q2a4: "10 ou plus",
        q9a1: "Oui, mais pas au cours de la dernière année", q9a2: "Oui, au cours de la dernière année",
      },
    },
  },
};
