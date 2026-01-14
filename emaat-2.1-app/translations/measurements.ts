
export const measurementsTranslations = {
  en: {
    measurements: {
      logTitle: 'Log Measurement',
      selectTitle: 'What do you want to log?',
      saveButton: 'Save Measurement',
      instructionsTitle: 'Instructions & Tip',
      hideInstructions: 'Hide',
      showInstructions: 'Show Instructions & Tip',
      timestamp: 'Date & Time',
      types: {
        heartRate: { name: 'Heart Rate', unit: 'bpm' },
        bloodPressure: { name: 'Blood Pressure', unit: 'mmHg' },
        bloodGlucose: { name: 'Blood Glucose', unit: 'mmol/L' },
        steps: { name: 'Steps', unit: 'steps' },
        weight: { name: 'Weight', unit: 'kg' },
        temperature: { name: 'Temperature', unit: '°C' },
        oxygenSaturation: { name: 'Oxygen Saturation', unit: '%' },
        sleepDuration: { name: 'Sleep Duration', unit: '' },
        smoke: { name: 'Cigarette Logged', unit: '' },
      },
      labels: {
        value: 'Value',
        condition: 'Condition',
        systolic: 'Systolic (Upper)',
        diastolic: 'Diastolic (Lower)',
        timing: 'Time of Day',
      },
      conditions: {
        resting: 'At Rest',
        active: 'After Activity',
        other: 'Other'
      },
      timings: {
        N: 'Fasting',
        NO: 'After Breakfast',
        VM: 'Before Lunch',
        NM: 'After Lunch',
        VA: 'Before Dinner',
        NA: 'After Dinner',
        VS: 'Before Sleep'
      },
      instructions: {
        heartRate: "• Rest for at least 5 minutes before measuring.\n• Place two fingers on your wrist or neck.\n• Count the beats for 30 seconds and multiply by 2.",
        bloodPressure: "• Sit quietly for 5 minutes with your back straight and supported.\n• Place both feet flat on the floor and uncross your legs.\n• Rest your arm on a table at chest level.\n• Do not talk while measuring.",
        bloodGlucose: "• Wash your hands thoroughly with soap and water.\n• Insert a test strip into your meter.\n• Prick the side of your fingertip with the lancet.\n• Touch and hold the edge of the test strip to the drop of blood.",
        steps: "• Log the total number of steps for the day from your fitness tracker or phone.",
        weight: "• Weigh yourself in the morning, after you've emptied your bladder and before you've eaten or drunk anything.\n• Use the same scale each time.\n• Place the scale on a hard, flat surface.",
        temperature: "• Place the thermometer under your tongue, in your armpit, or use an ear or forehead thermometer as directed.\n• Wait for the beep or signal before reading.",
        oxygenSaturation: "• Rest for a few minutes before measuring.\n• Place the pulse oximeter on your index or middle finger.\n• Keep your hand still and wait for the reading to stabilize.",
      },
      errors: {
        sleepExists: 'A sleep duration log for this day already exists. You can only have one per day.'
      }
    },
    lifestyle: {
      tipTitle: 'Lifestyle Tip: {pillar}',
      pillars: {
        nutrition: {
          name: 'Balanced Nutrition',
          description: 'A nutrient-dense diet stabilizes metabolism, supports organ function, and improves energy levels.',
        },
        activity: {
          name: 'Regular Physical Activity',
          description: 'Movement improves cardiovascular health, metabolic flexibility, and mood.',
        },
        sleep: {
          name: 'Quality Sleep',
          description: 'Adequate restorative sleep regulates hormones, repairs tissue, and resets metabolic pathways.',
        },
        stress: {
          name: 'Stress Management',
          description: 'Lowering chronic stress reduces inflammation and improves emotional and physical resilience.',
        },
        hydration: {
          name: 'Hydration',
          description: 'Water supports circulation, temperature regulation, and metabolism.',
        },
        social: {
          name: 'Social Connection',
          description: 'Healthy social interactions reduce stress hormones and support mental well-being.',
        },
        preventive: {
          name: 'Preventive Care & Healthy Habits',
          description: 'Healthy habits (no smoking, moderate alcohol, regular checkups) protect long-term health.',
        },
      },
      tips: {
        bloodGlucose: {
          nutrition: 'Balanced meals with fiber, protein, and healthy fats prevent spikes after breakfast and promote stable fasting glucose.',
          activity: 'Muscles use glucose during activity, lowering post-meal glucose and improving insulin sensitivity.',
          sleep: 'Sleep deprivation increases insulin resistance, elevating fasting glucose.',
          stress: 'Stress increases glucose release from the liver, raising fasting and random glucose.',
          hydration: 'Proper hydration helps kidneys regulate glucose levels.',
          social: 'Reduced stress from good relationships improves glucose control.',
          preventive: 'Screening catches early signs of insulin resistance.',
        },
        bloodPressure: {
          nutrition: 'Low sodium, high potassium diets (e.g., fruits/vegetables) reduce systolic and diastolic levels.',
          activity: 'Exercise reduces both systolic and diastolic BP over time.',
          sleep: 'Inadequate sleep raises morning BP and prevents normal nocturnal BP dipping.',
          stress: 'Cortisol and adrenaline raise systolic and diastolic BP.',
          hydration: 'Low hydration reduces blood volume, leading to lower BP or dizziness; overhydration may lower sodium and affect BP.',
          social: 'Social support is associated with lower long-term BP.',
          preventive: 'Avoiding smoking and heavy alcohol keeps BP lower and arteries healthier.',
        },
        weight: {
          nutrition: 'Proper calorie balance supports healthy weight maintenance or gradual fat loss.',
          activity: 'Activity increases caloric expenditure and lean muscle mass.',
          sleep: 'Poor sleep alters appetite hormones (ghrelin & leptin), increasing weight gain risk.',
          stress: 'Stress promotes fat storage, especially abdominal.',
          social: 'Emotional support improves adherence to healthy eating and activity.',
          preventive: 'Preventive habits help maintain stable weight.',
        },
        temperature: {
          nutrition: 'Adequate nutrition helps maintain normal metabolic heat production.',
          sleep: 'Sleep quality is linked to natural overnight temperature regulation rhythms.',
          stress: 'Severe stress can cause mild temperature elevation.',
          hydration: 'Hydration prevents overheating and supports proper thermoregulation.',
          preventive: 'Early detection of infection or illness is easier with routine monitoring.',
        },
        heartRate: {
          activity: 'Regular exercise lowers resting heart rate, indicating a stronger cardiovascular system. Faster recovery time shows improved fitness.',
          sleep: 'Poor sleep elevates nighttime HR due to increased stress hormones.',
          stress: 'Stress elevates resting HR; relaxation lowers it.',
          hydration: 'Dehydration can increase HR at rest due to lower blood volume.',
          social: 'Positive social interactions lower resting HR.',
          preventive: 'Healthy habits keep resting HR in a normal range.',
        },
        steps: {
          activity: 'Steps track general activity level; 7k–10k/day is linked to reduced mortality.',
          social: 'Social activities often increase movement (walking with friends, group fitness).',
        },
        oxygenSaturation: {
          activity: 'Aerobic fitness helps maintain SpO₂ during exertion.',
          sleep: 'Sleep disorders (e.g., sleep apnea) cause drops in SpO₂.',
          stress: 'Breathwork and calm breathing can improve oxygenation.',
          hydration: 'Hydration supports efficient oxygen transport.',
          preventive: 'Avoiding smoking improves lung health and maintains higher SpO₂.',
        },
      },
    },
  },
  nl: {
    measurements: {
      logTitle: 'Log Meting',
      selectTitle: 'Wat wil je loggen?',
      saveButton: 'Meting Opslaan',
      instructionsTitle: 'Instructies & Tip',
      hideInstructions: 'Verberg',
      showInstructions: 'Toon Instructies & Tip',
      timestamp: 'Datum & Tijd',
      types: {
        heartRate: { name: 'Hartslag', unit: 'bpm' },
        bloodPressure: { name: 'Bloeddruk', unit: 'mmHg' },
        bloodGlucose: { name: 'Bloedsuiker', unit: 'mmol/L' },
        steps: { name: 'Stappen', unit: 'stappen' },
        weight: { name: 'Gewicht', unit: 'kg' },
        temperature: { name: 'Temperatuur', unit: '°C' },
        oxygenSaturation: { name: 'Zuurstofsaturatie', unit: '%' },
        sleepDuration: { name: 'Slaapduur', unit: '' },
        smoke: { name: 'Sigaret Gelogd', unit: '' },
      },
      labels: {
        value: 'Waarde',
        condition: 'Conditie',
        systolic: 'Systolisch (Bovendruk)',
        diastolic: 'Diastolisch (Onderdruk)',
        timing: 'Tijdstip',
      },
      conditions: {
        resting: 'In Rust',
        active: 'Na Activiteit',
        other: 'Anders'
      },
      timings: {
        N: 'Nuchter',
        NO: 'Na Ontbijt',
        VM: 'Voor Middageten',
        NM: 'Na Middageten',
        VA: 'Voor Avondeten',
        NA: 'Na Avondeten',
        VS: 'Voor Slapen'
      },
       instructions: {
        heartRate: "• Rust minstens 5 minuten voordat je meet.\n• Plaats twee vingers op je pols of in je nek.\n• Tel de slagen gedurende 30 seconden en vermenigvuldig met 2.",
        bloodPressure: "• Zit 5 minuten rustig met je rug recht en ondersteund.\n• Plaats beide voeten plat op de grond en kruis je benen niet.\n• Laat je arm rusten op een tafel op borsthoogte.\n• Praat niet tijdens het meten.",
        bloodGlucose: "• Was je handen grondig met zeep en water.\n• Plaats een teststrip in je meter.\n• Prik in de zijkant van je vingertop met de lancet.\n• Raak de rand van de teststrip aan met de druppel bloed en houd deze vast.",
        steps: "• Log het totale aantal stappen van de dag van je fitnesstracker of telefoon.",
        weight: "• Weeg jezelf 's ochtends, nadat je naar het toilet bent geweest en voordat je iets hebt gegeten of gedronken.\n• Gebruik elke keer dezelfde weegschaal.\n• Plaats de weegschaal op een harde, vlakke ondergrond.",
        temperature: "• Plaats de thermometer onder je tong, in je oksel, of gebruik een oor- of voorhoofdthermometer zoals aangegeven.\n• Wacht op de piep of het signaal voordat je de waarde afleest.",
        oxygenSaturation: "• Rust een paar minuten voordat je meet.\n• Plaats de pulsoximeter op je wijs- of middelvinger.\n• Houd je hand stil en wacht tot de meting stabiliseert.",
      },
      errors: {
        sleepExists: 'Er bestaat al een slaapduurmeting voor deze dag. Je kunt er maar één per dag hebben.'
      }
    },
    lifestyle: {
      tipTitle: 'Leefstijltip: {pillar}',
      pillars: {
        nutrition: {
          name: 'Gebalanceerde Voeding',
          description: 'Een voedzaam dieet stabiliseert het metabolisme, ondersteunt de orgaanfunctie en verbetert het energieniveau.',
        },
        activity: {
          name: 'Regelmatige Lichaamsbeweging',
          description: 'Beweging verbetert de cardiovasculaire gezondheid, metabole flexibiliteit en stemming.',
        },
        sleep: {
          name: 'Kwalitatieve Slaap',
          description: 'Voldoende herstellende slaap reguleert hormonen, herstelt weefsel en reset metabole paden.',
        },
        stress: {
          name: 'Stressmanagement',
          description: 'Het verminderen van chronische stress reduceert ontstekingen en verbetert de emotionele en fysieke veerkracht.',
        },
        hydration: {
          name: 'Hydratatie',
          description: 'Water ondersteunt de bloedsomloop, temperatuurregeling en het metabolisme.',
        },
        social: {
          name: 'Sociale Verbinding',
          description: 'Gezonde sociale interacties verminderen stresshormonen en ondersteunen het mentale welzijn.',
        },
        preventive: {
          name: 'Preventieve Zorg & Gezonde Gewoontes',
          description: 'Gezonde gewoontes (niet roken, matig alcoholgebruik, regelmatige controles) beschermen de gezondheid op lange termijn.',
        },
      },
      tips: {
        bloodGlucose: {
          nutrition: 'Gebalanceerde maaltijden met vezels, eiwitten en gezonde vetten voorkomen pieken na het ontbijt en bevorderen een stabiele nuchtere glucose.',
          activity: 'Spieren gebruiken glucose tijdens activiteit, wat de glucose na de maaltijd verlaagt en de insulinegevoeligheid verbetert.',
          sleep: 'Slaapgebrek verhoogt de insulineresistentie, wat de nuchtere glucose verhoogt.',
          stress: 'Stress verhoogt de afgifte van glucose uit de lever, wat de nuchtere en willekeurige glucose verhoogt.',
          hydration: 'Goede hydratatie helpt de nieren bij het reguleren van de glucosespiegels.',
          social: 'Verminderde stress door goede relaties verbetert de glucosecontrole.',
          preventive: 'Screening signaleert vroege tekenen van insulineresistentie.',
        },
        bloodPressure: {
          nutrition: 'Diëten met weinig natrium en veel kalium (bv. fruit/groenten) verlagen de systolische en diastolische bloeddruk.',
          activity: 'Lichaamsbeweging verlaagt na verloop van tijd zowel de systolische als de diastolische bloeddruk.',
          sleep: 'Onvoldoende slaap verhoogt de ochtendbloeddruk en voorkomt de normale nachtelijke bloeddrukdaling.',
          stress: 'Cortisol en adrenaline verhogen de systolische en diastolische bloeddruk.',
          hydration: 'Lage hydratatie vermindert het bloedvolume, wat leidt tot een lagere bloeddruk of duizeligheid; overhydratatie kan het natriumgehalte verlagen en de bloeddruk beïnvloeden.',
          social: 'Sociale steun wordt geassocieerd met een lagere bloeddruk op lange termijn.',
          preventive: 'Het vermijden van roken en zwaar alcoholgebruik houdt de bloeddruk lager en de slagaders gezonder.',
        },
        weight: {
          nutrition: 'Een juiste caloriebalans ondersteunt een gezond gewichtsbehoud of geleidelijk vetverlies.',
          activity: 'Activiteit verhoogt het calorieverbruik en de spiermassa.',
          sleep: 'Slechte slaap verstoort de eetlusthormonen (ghreline & leptine), wat het risico op gewichtstoename verhoogt.',
          stress: 'Stress bevordert de vetopslag, vooral in de buikstreek.',
          social: 'Emotionele steun verbetert de therapietrouw aan gezond eten en bewegen.',
          preventive: 'Preventieve gewoonten helpen om een stabiel gewicht te behouden.',
        },
        temperature: {
          nutrition: 'Voldoende voeding helpt bij het handhaven van een normale metabolische warmteproductie.',
          sleep: 'Slaapkwaliteit is gekoppeld aan de natuurlijke ritmes van de temperatuurregeling \'s nachts.',
          stress: 'Ernstige stress kan een lichte temperatuurverhoging veroorzaken.',
          hydration: 'Hydratatie voorkomt oververhitting en ondersteunt een goede thermoregulatie.',
          preventive: 'Vroege detectie van infecties of ziekten is gemakkelijker met routinematige controle.',
        },
        heartRate: {
          activity: 'Regelmatige lichaamsbeweging verlaagt de hartslag in rust, wat duidt op een sterker cardiovasculair systeem. Een snellere hersteltijd toont een verbeterde conditie.',
          sleep: 'Slechte slaap verhoogt de hartslag \'s nachts door verhoogde stresshormonen.',
          stress: 'Stress verhoogt de hartslag in rust; ontspanning verlaagt deze.',
          hydration: 'Uitdroging kan de hartslag in rust verhogen door een lager bloedvolume.',
          social: 'Positieve sociale interacties verlagen de hartslag in rust.',
          preventive: 'Gezonde gewoonten houden de hartslag in rust binnen een normaal bereik.',
        },
        steps: {
          activity: 'Stappen meten het algemene activiteitenniveau; 7k–10k/dag wordt in verband gebracht met een verminderde mortaliteit.',
          social: 'Sociale activiteiten leiden vaak tot meer beweging (wandelen met vrienden, groepsfitness).',
        },
        oxygenSaturation: {
          activity: 'Aerobe conditie helpt de SpO₂ op peil te houden tijdens inspanning.',
          sleep: 'Slaapstoornissen (bv. slaapapneu) veroorzaken dalingen in SpO₂.',
          stress: 'Ademhalingsoefeningen en rustig ademen kunnen de oxygenatie verbeteren.',
          hydration: 'Hydratatie ondersteunt een efficiënt zuurstoftransport.',
          preventive: 'Het vermijden van roken verbetert de longgezondheid en handhaaft een hogere SpO₂.',
        },
      },
    },
  },
  tr: {
    measurements: {
      logTitle: 'Ölçüm Kaydet',
      selectTitle: 'Ne kaydetmek istersiniz?',
      saveButton: 'Ölçümü Kaydet',
      instructionsTitle: 'Talimatlar ve İpucu',
      hideInstructions: 'Gizle',
      showInstructions: 'Talimatları ve İpucunu Göster',
      timestamp: 'Tarih ve Saat',
      types: {
        heartRate: { name: 'Kalp Atış Hızı', unit: 'bpm' },
        bloodPressure: { name: 'Tansiyon', unit: 'mmHg' },
        bloodGlucose: { name: 'Kan Şekeri', unit: 'mmol/L' },
        steps: { name: 'Adım Sayısı', unit: 'adım' },
        weight: { name: 'Kilo', unit: 'kg' },
        temperature: { name: 'Vücut Sıcaklığı', unit: '°C' },
        oxygenSaturation: { name: 'Oksijen Satürasyonu', unit: '%' },
        sleepDuration: { name: 'Uyku Süresi', unit: '' },
        smoke: { name: 'Sigara Kaydedildi', unit: '' },
      },
      labels: {
        value: 'Değer',
        condition: 'Durum',
        systolic: 'Sistolik (Büyük)',
        diastolic: 'Diyastolik (Küçük)',
        timing: 'Günün Zamanı',
      },
      conditions: {
        resting: 'Dinlenirken',
        active: 'Aktivite Sonrası',
        other: 'Diğer'
      },
      timings: {
        N: 'Açlık',
        NO: 'Kahvaltıdan Sonra',
        VM: 'Öğle Yemeğinden Önce',
        NM: 'Öğle Yemeğinden Sonra',
        VA: 'Akşam Yemeğinden Önce',
        NA: 'Akşam Yemeğinden Sonra',
        VS: 'Uykudan Önce'
      },
      instructions: {
        heartRate: "• Ölçümden önce en az 5 dakika dinlenin.\n• İki parmağınızı bileğinize veya boynunuza yerleştirin.\n• 30 saniye boyunca atışları sayın ve 2 ile çarpın.",
        bloodPressure: "• Sırtınız dik ve destekli bir şekilde 5 dakika sessizce oturun.\n• İki ayağınızı da yere düz basın ve bacaklarınızı çapraz yapmayın.\n• Kolunuzu göğüs hizasında bir masaya dayayın.\n• Ölçüm sırasında konuşmayın.",
        bloodGlucose: "• Ellerinizi sabun ve suyla iyice yıkayın.\n• Test şeridini ölçüm cihazınıza takın.\n• Lanset ile parmak ucunuzun yan tarafını delin.\n• Test şeridinin kenarını kan damlasına dokundurun ve basılı tutun.",
        steps: "• Fitness takipçinizden veya telefonunuzdan günün toplam adım sayısını kaydedin.",
        weight: "• Sabahları, tuvaletinizi yaptıktan sonra ve bir şey yiyip içmeden önce tartılın.\n• Her zaman aynı tartıyı kullanın.\n• Tartıyı sert, düz bir yüzeye yerleştirin.",
        temperature: "• Termometreyi dilinizin altına, koltuk altınıza yerleştirin veya belirtildiği şekilde kulak veya alın termometresi kullanın.\n• Okumadan önce bip sesini veya sinyali bekleyin.",
        oxygenSaturation: "• Ölçümden önce birkaç dakika dinlenin.\n• Pulse oksimetreyi işaret veya orta parmağınıza yerleştirin.\n• Elinizi sabit tutun ve okumanın stabilize olmasını bekleyin.",
      },
      errors: {
        sleepExists: 'Bu gün için zaten bir uyku süresi kaydı var. Günde sadece bir tane olabilir.'
      }
    },
    lifestyle: {
      tipTitle: 'Yaşam Tarzı İpucu: {pillar}',
      pillars: {
        nutrition: {
          name: 'Dengeli Beslenme',
          description: 'Besin açısından zengin bir diyet metabolizmayı stabilize eder, organ fonksiyonunu destekler ve enerji seviyelerini artırır.',
        },
        activity: {
          name: 'Düzenli Fiziksel Aktivite',
          description: 'Hareket, kardiyovasküler sağlığı, metabolik esnekliği ve ruh halini iyileştirir.',
        },
        sleep: {
          name: 'Kaliteli Uyku',
          description: 'Yeterli onarıcı uyku hormonları düzenler, dokuyu onarır ve metabolik yolları sıfırlar.',
        },
        stress: {
          name: 'Stres Yönetimi',
          description: 'Kronik stresi azaltmak iltihabı azaltır ve duygusal ve fiziksel dayanıklılığı artırır.',
        },
        hydration: {
          name: 'Hidrasyon',
          description: 'Su, dolaşımı, sıcaklık düzenlemesini ve metabolizmayı destekler.',
        },
        social: {
          name: 'Sosyal Bağlantı',
          description: 'Sağlıklı sosyal etkileşimler stres hormonlarını azaltır ve zihinsel refahı destekler.',
        },
        preventive: {
          name: 'Önleyici Bakım ve Sağlıklı Alışkanlıklar',
          description: 'Sağlıklı alışkanlıklar (sigara içmemek, ölçülü alkol, düzenli kontroller) uzun vadeli sağlığı korur.',
        },
      },
      tips: {
        bloodGlucose: {
          nutrition: 'Lif, protein ve sağlıklı yağlar içeren dengeli öğünler, kahvaltı sonrası ani yükselmeleri önler ve stabil açlık kan şekerini destekler.',
          activity: 'Kaslar aktivite sırasında glikoz kullanır, bu da yemek sonrası glikozu düşürür ve insülin duyarlılığını artırır.',
          sleep: 'Uyku yoksunluğu insülin direncini artırarak açlık kan şekerini yükseltir.',
          stress: 'Stres, karaciğerden glikoz salınımını artırarak açlık ve rastgele kan şekerini yükseltir.',
          hydration: 'Doğru hidrasyon, böbreklerin glikoz seviyelerini düzenlemesine yardımcı olur.',
          social: 'İyi ilişkilerden kaynaklanan azalan stres, glikoz kontrolünü iyileştirir.',
          preventive: 'Tarama, insülin direncinin erken belirtilerini yakalar.',
        },
        bloodPressure: {
          nutrition: 'Düşük sodyum, yüksek potasyumlu diyetler (ör. meyve/sebze) sistolik ve diyastolik seviyeleri düşürür.',
          activity: 'Egzersiz, zamanla hem sistolik hem de diyastolik kan basıncını düşürür.',
          sleep: 'Yetersiz uyku sabah tansiyonunu yükseltir ve normal gece tansiyon düşüşünü engeller.',
          stress: 'Kortizol ve adrenalin, sistolik ve diyastolik kan basıncını yükseltir.',
          hydration: 'Düşük hidrasyon kan hacmini azaltır, bu da daha düşük tansiyona veya baş dönmesine yol açar; aşırı hidrasyon sodyumu düşürebilir ve tansiyonu etkileyebilir.',
          social: 'Sosyal destek, daha düşük uzun vadeli tansiyon ile ilişkilidir.',
          preventive: 'Sigara ve ağır alkolden kaçınmak tansiyonu daha düşük ve atardamarları daha sağlıklı tutar.',
        },
        weight: {
          nutrition: 'Doğru kalori dengesi, sağlıklı kilo korumayı veya kademeli yağ kaybını destekler.',
          activity: 'Aktivite, kalori harcamasını ve yağsız kas kütlesini artırır.',
          sleep: 'Kötü uyku, iştah hormonlarını (ghrelin ve leptin) değiştirerek kilo alma riskini artırır.',
          stress: 'Stres, özellikle karın bölgesinde yağ depolanmasını teşvik eder.',
          social: 'Duygusal destek, sağlıklı beslenme ve aktiviteye bağlılığı artırır.',
          preventive: 'Önleyici alışkanlıklar, istikrarlı kiloyu korumaya yardımcı olur.',
        },
        temperature: {
          nutrition: 'Yeterli beslenme, normal metabolik ısı üretimini sürdürmeye yardımcı olur.',
          sleep: 'Uyku kalitesi, doğal gece sıcaklık düzenleme ritimleriyle bağlantılıdır.',
          stress: 'Şiddetli stres, hafif ateş yükselmesine neden olabilir.',
          hydration: 'Hidrasyon, aşırı ısınmayı önler ve uygun termoregülasyonu destekler.',
          preventive: 'Enfeksiyon veya hastalığın erken tespiti, rutin izleme ile daha kolaydır.',
        },
        heartRate: {
          activity: 'Düzenli egzersiz, dinlenme kalp atış hızını düşürür, bu da daha güçlü bir kardiyovasküler sistemin göstergesidir. Daha hızlı toparlanma süresi, gelişmiş kondisyonu gösterir.',
          sleep: 'Kötü uyku, artan stres hormonları nedeniyle gece kalp atış hızını yükseltir.',
          stress: 'Stres dinlenme kalp atış hızını yükseltir; rahatlama düşürür.',
          hydration: 'Dehidrasyon, düşük kan hacmi nedeniyle dinlenme anındaki kalp atış hızını artırabilir.',
          social: 'Pozitif sosyal etkileşimler dinlenme kalp atış hızını düşürür.',
          preventive: 'Sağlıklı alışkanlıklar, dinlenme kalp atış hızını normal bir aralıkta tutar.',
        },
        steps: {
          activity: 'Adımlar genel aktivite seviyesini izler; günde 7k–10k adım, azalan ölüm oranıyla bağlantılıdır.',
          social: 'Sosyal aktiviteler genellikle hareketi artırır (arkadaşlarla yürümek, grup fitness).',
        },
        oxygenSaturation: {
          activity: 'Aerobik kondisyon, efor sırasında SpO₂\'yi korumaya yardımcı olur.',
          sleep: 'Uyku bozuklukları (ör. uyku apnesi) SpO₂\'de düşüşlere neden olur.',
          stress: 'Nefes çalışması ve sakin nefes alma oksijenlenmeyi artırabilir.',
          hydration: 'Hidrasyon, verimli oksijen taşınmasını destekler.',
          preventive: 'Sigaradan kaçınmak, akciğer sağlığını iyileştirir ve daha yüksek SpO₂ sağlar.',
        },
      },
    },
  },
  fr: {
    measurements: {
      logTitle: 'Enregistrer une Mesure',
      selectTitle: 'Que voulez-vous enregistrer ?',
      saveButton: 'Enregistrer la Mesure',
      instructionsTitle: 'Instructions & Conseil',
      hideInstructions: 'Masquer',
      showInstructions: 'Afficher les Instructions & le Conseil',
      timestamp: 'Date & Heure',
      types: {
        heartRate: { name: 'Fréquence Cardiaque', unit: 'bpm' },
        bloodPressure: { name: 'Tension Artérielle', unit: 'mmHg' },
        bloodGlucose: { name: 'Glycémie', unit: 'mmol/L' },
        steps: { name: 'Pas', unit: 'pas' },
        weight: { name: 'Poids', unit: 'kg' },
        temperature: { name: 'Température', unit: '°C' },
        oxygenSaturation: { name: 'Saturation en Oxygène', unit: '%' },
        sleepDuration: { name: 'Durée du Sommeil', unit: '' },
        smoke: { name: 'Cigarette enregistrée', unit: '' },
      },
      labels: {
        value: 'Valeur',
        condition: 'Condition',
        systolic: 'Systolique (Supérieure)',
        diastolic: 'Diastolique (Inférieure)',
        timing: 'Moment de la journée',
      },
      conditions: {
        resting: 'Au Repos',
        active: 'Après Activité',
        other: 'Autre'
      },
      timings: {
        N: 'À jeun',
        NO: 'Après le petit-déjeuner',
        VM: 'Avant le déjeuner',
        NM: 'Après le déjeuner',
        VA: 'Avant le dîner',
        NA: 'Après le dîner',
        VS: 'Avant de dormir'
      },
       instructions: {
        heartRate: "• Reposez-vous au moins 5 minutes avant de mesurer.\n• Placez deux doigts sur votre poignet ou votre cou.\n• Comptez les battements pendant 30 secondes et multipliez par 2.",
        bloodPressure: "• Asseyez-vous tranquillement pendant 5 minutes, le dos droit et soutenu.\n• Placez les deux pieds à plat sur le sol et ne croisez pas les jambes.\n• Reposez votre bras sur une table au niveau de la poitrine.\n• Ne parlez pas pendant la mesure.",
        bloodGlucose: "• Lavez-vous soigneusement les mains avec de l'eau et du savon.\n• Insérez une bandelette de test dans votre lecteur.\n• Piquez le côté de votre doigt avec la lancette.\n• Touchez et maintenez le bord de la bandelette de test contre la goutte de sang.",
        steps: "• Enregistrez le nombre total de pas de la journée à partir de votre tracker d'activité ou de votre téléphone.",
        weight: "• Pesez-vous le matin, après avoir vidé votre vessie et avant d'avoir mangé ou bu quoi que ce soit.\n• Utilisez la même balance à chaque fois.\n• Placez la balance sur une surface dure et plane.",
        temperature: "• Placez le thermomètre sous votre langue, dans votre aisselle, ou utilisez un thermomètre auriculaire ou frontal comme indiqué.\n• Attendez le bip ou le signal avant de lire la valeur.",
        oxygenSaturation: "• Reposez-vous quelques minutes avant de mesurer.\n• Placez l'oxymètre de pouls sur votre index ou votre majeur.\n• Gardez votre main immobile et attendez que la lecture se stabilise.",
      },
      errors: {
        sleepExists: 'Un enregistrement de la durée du sommeil pour cette journée existe déjà. Vous ne pouvez en avoir qu\'un par jour.'
      }
    },
    lifestyle: {
      tipTitle: 'Conseil de vie : {pillar}',
      pillars: {
        nutrition: {
          name: 'Nutrition Équilibrée',
          description: 'Une alimentation riche en nutriments stabilise le métabolisme, soutient la fonction des organes et améliore les niveaux d\'énergie.',
        },
        activity: {
          name: 'Activité Physique Régulière',
          description: 'Le mouvement améliore la santé cardiovasculaire, la flexibilité métabolique et l\'humeur.',
        },
        sleep: {
          name: 'Sommeil de Qualité',
          description: 'Un sommeil réparateur adéquat régule les hormones, répare les tissus et réinitialise les voies métaboliques.',
        },
        stress: {
          name: 'Gestion du Stress',
          description: 'La réduction du stress chronique diminue l\'inflammation et améliore la résilience émotionnelle et physique.',
        },
        hydration: {
          name: 'Hydratation',
          description: 'L\'eau soutient la circulation, la régulation de la température et le métabolisme.',
        },
        social: {
          name: 'Lien Social',
          description: 'Des interactions sociales saines réduisent les hormones de stress et soutiennent le bien-être mental.',
        },
        preventive: {
          name: 'Soins Préventifs & Habitudes Saines',
          description: 'Les habitudes saines (ne pas fumer, alcool modéré, contrôles réguliers) protègent la santé à long terme.',
        },
      },
      tips: {
        bloodGlucose: {
          nutrition: 'Des repas équilibrés avec des fibres, des protéines et des graisses saines préviennent les pics après le petit-déjeuner et favorisent une glycémie à jeun stable.',
          activity: 'Les muscles utilisent le glucose pendant l\'activité, ce qui abaisse la glycémie post-prandiale et améliore la sensibilité à l\'insuline.',
          sleep: 'Le manque de sommeil augmente la résistance à l\'insuline, élevant la glycémie à jeun.',
          stress: 'Le stress augmente la libération de glucose par le foie, augmentant la glycémie à jeun et aléatoire.',
          hydration: 'Une bonne hydratation aide les reins à réguler les niveaux de glucose.',
          social: 'La réduction du stress grâce à de bonnes relations améliore le contrôle de la glycémie.',
          preventive: 'Le dépistage détecte les premiers signes de résistance à l\'insuline.',
        },
        bloodPressure: {
          nutrition: 'Les régimes faibles en sodium et riches en potassium (par ex., fruits/légumes) réduisent les niveaux systoliques et diastoliques.',
          activity: 'L\'exercice réduit à la fois la pression artérielle systolique et diastolique au fil du temps.',
          sleep: 'Un sommeil insuffisant augmente la pression artérielle matinale et empêche la baisse nocturne normale de la pression artérielle.',
          stress: 'Le cortisol et l\'adrénaline augmentent la pression artérielle systolique et diastolique.',
          hydration: 'Une faible hydratation réduit le volume sanguin, entraînant une pression artérielle plus basse ou des étourdissements ; une surhydratation peut réduire le sodium et affecter la pression artérielle.',
          social: 'Le soutien social est associé à une pression artérielle plus basse à long terme.',
          preventive: 'Éviter de fumer et de consommer beaucoup d\'alcool maintient la pression artérielle plus basse et les artères plus saines.',
        },
        weight: {
          nutrition: 'Un bon équilibre calorique favorise le maintien d\'un poids santé ou une perte de graisse progressive.',
          activity: 'L\'activité augmente la dépense calorique et la masse musculaire maigre.',
          sleep: 'Un mauvais sommeil altère les hormones de l\'appétit (ghréline et leptine), augmentant le risque de prise de poids.',
          stress: 'Le stress favorise le stockage des graisses, en particulier abdominales.',
          social: 'Le soutien émotionnel améliore l\'adhésion à une alimentation saine et à l\'activité.',
          preventive: 'Les habitudes préventives aident à maintenir un poids stable.',
        },
        temperature: {
          nutrition: 'Une nutrition adéquate aide à maintenir une production de chaleur métabolique normale.',
          sleep: 'La qualité du sommeil est liée aux rythmes naturels de régulation de la température nocturne.',
          stress: 'Un stress sévère peut provoquer une légère élévation de la température.',
          hydration: 'L\'hydratation prévient la surchauffe et soutient une thermorégulation appropriée.',
          preventive: 'La détection précoce d\'une infection ou d\'une maladie est plus facile avec une surveillance de routine.',
        },
        heartRate: {
          activity: 'L\'exercice régulier abaisse la fréquence cardiaque au repos, indiquant un système cardiovasculaire plus fort. Un temps de récupération plus rapide montre une meilleure forme physique.',
          sleep: 'Un mauvais sommeil élève la fréquence cardiaque nocturne en raison de l\'augmentation des hormones de stress.',
          stress: 'Le stress élève la fréquence cardiaque au repos ; la relaxation la diminue.',
          hydration: 'La déshydratation peut augmenter la fréquence cardiaque au repos en raison d\'un volume sanguin plus faible.',
          social: 'Les interactions sociales positives abaissent la fréquence cardiaque au repos.',
          preventive: 'Les habitudes saines maintiennent la fréquence cardiaque au repos dans une plage normale.',
        },
        steps: {
          activity: 'Les pas suivent le niveau d\'activité général ; 7k à 10k/jour est lié à une mortalité réduite.',
          social: 'Les activités sociales augmentent souvent le mouvement (marche avec des amis, fitness en groupe).',
        },
        oxygenSaturation: {
          activity: 'La forme aérobie aide à maintenir la SpO₂ pendant l\'effort.',
          sleep: 'Les troubles du sommeil (par ex., l\'apnée du sommeil) provoquent des baisses de SpO₂.',
          stress: 'La respiration consciente et calme peut améliorer l\'oxygénation.',
          hydration: 'L\'hydratation favorise un transport efficace de l\'oxygène.',
          preventive: 'Éviter de fumer améliore la santé pulmonaire et maintient une SpO₂ plus élevée.',
        },
      },
    },
  },
};
