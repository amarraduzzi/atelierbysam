// Talen: Frans (de teksten in de HTML), Engels en Arabisch.
// De Franse tekst is de sleutel: DICT["Franse tekst"] = ["English", "العربية"].
// Ontbreekt een vertaling, dan blijft de Franse tekst staan (nooit een lege plek).
// Taalkeuze: ?lang=en in het adres, anders de keuze van de bezoeker (onthouden), anders de taal van zijn telefoon, anders Frans.
(function () {
  const SUP = ["fr", "en", "ar"];
  function pick() {
    try {
      const u = new URLSearchParams(location.search).get("lang");
      if (SUP.includes(u)) { localStorage.setItem("lang", u); return u; }
      const s = localStorage.getItem("lang");
      if (SUP.includes(s)) return s;
    } catch (_) {}
    const n = ((navigator.language || "fr") + "").slice(0, 2).toLowerCase();
    return n === "ar" ? "ar" : n === "en" ? "en" : "fr";
  }
  const LANG = pick();
  const html = document.documentElement;
  html.lang = LANG;
  html.dir = LANG === "ar" ? "rtl" : "ltr";
  if (LANG === "ar") {
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Tajawal:wght@300;400;500&display=swap";
    document.head.appendChild(l);
  }

  const DICT = {
    // ----- navigatie en kop -----
    "L’Atelier": ["The Atelier", "الأتيليه"],
    "L’histoire": ["The story", "الحكاية"],
    "La carte": ["Menu", "قائمة الطعام"],
    "Galerie": ["Gallery", "المعرض"],
    "Infos": ["Info", "معلومات"],
    "Réserver": ["Book", "احجز"],
    "Accueil": ["Home", "الرئيسية"],
    "L’Atelier by Sam — accueil": ["L’Atelier by Sam — home", "L’Atelier by Sam — الرئيسية"],
    "Menu": ["Menu", "القائمة"],
    "L’Atelier by Sam — Salon de thé & brunch, Agdal Rabat": ["L’Atelier by Sam — Tea room & brunch, Agdal Rabat", "L’Atelier by Sam — صالون شاي وبرانش، أكدال الرباط"],
    "L’Atelier by Sam, salon de thé et brunch à Agdal, Rabat. Une table élégante pour prendre son temps.": ["L’Atelier by Sam, a tea room and brunch spot in Agdal, Rabat. An elegant table to take your time.", "L’Atelier by Sam، صالون شاي وبرانش في أكدال بالرباط. مائدة أنيقة لتأخذ وقتك."],
    "L’Atelier by Sam — salon de thé et brunch à Agdal, Rabat": ["L’Atelier by Sam — tea room and brunch in Agdal, Rabat", "L’Atelier by Sam — صالون شاي وبرانش في أكدال، الرباط"],
    // ----- accueil -----
    "Salon de thé & brunch": ["Tea room & brunch", "صالون شاي وبرانش"],
    "Agdal, Rabat · 10h – 21h": ["Agdal, Rabat · 10am – 9pm", "أكدال، الرباط · 10:00 – 21:00"],
    "Au menu": ["On the menu", "على القائمة"],
    "Toast Avocado": ["Avocado Toast", "توست أفوكادو"],
    "Pain céréales, houmous poivron, avocat, burrata, feta": ["Multigrain bread, red pepper hummus, avocado, burrata, feta", "خبز الحبوب، حمص بالفلفل، أفوكادو، بوراتا، فيتا"],
    "Chic Salmon": ["Chic Salmon", "تشيك سلمون"],
    "Croissant, saumon fumé, œuf poché, salade": ["Croissant, smoked salmon, poached egg, salad", "كرواسان، سلمون مدخن، بيض مسلوق، سلطة"],
    "Pancakes": ["Pancakes", "بانكيك"],
    "Fruits rouges, banane Nutella ou pistache": ["Red berries, banana Nutella or pistachio", "توت أحمر، موز نوتيلا أو فستق"],
    "Voir toute la carte": ["See the full menu", "اطّلع على القائمة كاملة"],
    "Brunch": ["Brunch", "برانش"],
    "Un brunch soigné, un thé bien infusé,": ["A thoughtful brunch, a well-brewed tea,", "برانش أنيق، وشاي منقوع كما ينبغي،"],
    "et le temps de s’asseoir.": ["and time to sit down.", "ووقتٌ للجلوس."],
    "Réserver une table": ["Book a table", "احجز طاولة"],
    "Voir la carte": ["See the menu", "اطّلع على القائمة"],
    "Salon de thé · Brunch · Agdal, Rabat ·": ["Tea room · Brunch · Agdal, Rabat ·", null],
    "Faites défiler": ["Scroll", "مرّر للأسفل"],
    "Atelier": ["Atelier", "الأتيليه"],
    "Une table pensée": ["A table conceived", "مائدة مُصمَّمة"],
    "comme un atelier": ["like a workshop", "كأنها أتيليه"],
    "Chez Sam, chaque assiette est préparée avec soin : des produits frais, des gestes précis, et un cadre calme pour se retrouver. Du premier café au dernier thé, on prend son temps.": ["At Sam’s, every plate is prepared with care: fresh produce, precise movements, and a calm setting to meet. From the first coffee to the last tea, we take our time.", "عند سام، يُحضَّر كل طبق بعناية: مكوّنات طازجة، وحركات دقيقة، وأجواء هادئة للّقاء. من أول قهوة إلى آخر كأس شاي، نأخذ وقتنا."],
    "Brunch sucré ou salé, pâtisseries, boissons chaudes et froides : une carte courte, faite maison.": ["Sweet or savoury brunch, pastries, hot and cold drinks: a short, homemade menu.", "برانش حلو أو مالح، معجنات، ومشروبات ساخنة وباردة: قائمة قصيرة، بصنع منزلي."],
    "Thé": ["Tea", "الشاي"],
    "Pâtisserie": ["Pastry", "المعجنات"],
    "Café": ["Coffee", "القهوة"],
    "Patio": ["Patio", "الباحة"],
    "À table.": ["Let’s eat.", "إلى المائدة."],
    // ----- Sam -----
    "Le mot de Sam": ["Sam’s word", "كلمة سام"],
    "« Pour moi, recevoir, c’est faire en sorte que chacun se sente à sa place. »": ["“For me, hosting means making everyone feel they belong.”", "«بالنسبة لي، الاستقبال هو أن يشعر كل واحد بأنه في مكانه.»"],
    "Tout commence en 2003, à Orléans, avec mon premier restaurant. Depuis, une conviction ne m’a jamais quitté : un restaurant se juge autant à ses plats qu’à la façon dont on s’y sent.": ["It all began in 2003, in Orléans, with my first restaurant. Ever since, one conviction has stayed with me: a restaurant is judged as much by its dishes as by how people feel there.", "بدأ كل شيء سنة 2003 في أورليان مع مطعمي الأول. ومنذ ذلك الحين لازمتني قناعة واحدة: يُحكم على المطعم بأطباقه بقدر ما يُحكم عليه بالشعور الذي يتركه عند ضيوفه."],
    "Après de longues années en France, je suis revenu à mes racines marocaines pour ouvrir, à Rabat, un lieu élégant et chaleureux où l’on prend le temps. Des produits de qualité, du fait maison, et le plaisir simple de recevoir.": ["After many years in France, I came back to my Moroccan roots to open, in Rabat, an elegant and warm place where people take their time. Quality products, homemade food, and the simple pleasure of hosting.", "بعد سنوات طويلة في فرنسا، عدتُ إلى جذوري المغربية لأفتح في الرباط مكانًا أنيقًا ودافئًا يأخذ فيه الناس وقتهم. منتجات عالية الجودة، وطعام منزلي، ومتعة الاستقبال البسيطة."],
    "Lire son histoire": ["Read his story", "اقرأ حكايته"],
    // ----- carte -----
    "Touchez une arche pour l’ouvrir.": ["Touch an arch to open it.", "المس قوسًا لفتحه."],
    "Choisissez une catégorie.": ["Choose a category.", "اختر فئة."],
    "Catégories": ["Categories", "الفئات"],
    "Délices Salés": ["Savoury Delights", "أطباق مالحة"],
    "Délices Sucrés": ["Sweet Delights", "أطباق حلوة"],
    "Cafés & Boissons chaudes": ["Coffees & Hot drinks", "قهوة ومشروبات ساخنة"],
    "Iced coffee & Frappés": ["Iced coffee & Frappés", "قهوة مثلجة وفرابيه"],
    "Matcha & Ube": ["Matcha & Ube", "ماتشا وأوبي"],
    "Milkshakes": ["Milkshakes", "ميلك شيك"],
    "Smoothies": ["Smoothies", "سموذي"],
    "Jus Frais": ["Fresh juices", "عصائر طازجة"],
    "Mocktails": ["Mocktails", "موكتيل"],
    "Alternatives végétales": ["Plant-based alternatives", "بدائل نباتية"],
    "Chaque plat est servi avec un accompagnement salade.": ["Every dish is served with a side salad.", "يُقدَّم كل طبق مع سلطة جانبية."],
    "Toast César": ["Caesar Toast", "توست سيزر"],
    "Chèvre Chaud": ["Warm Goat Cheese", "جبن الماعز الساخن"],
    "Œuf Benedict": ["Eggs Benedict", "بيض بنديكت"],
    "Burger Kifkif": ["Burger Kifkif", "برغر كيفكيف"],
    "Crispy Chicken / Effiloché. Servi avec ses frites de patate douce": ["Crispy chicken / Pulled. Served with sweet potato fries", "دجاج مقرمش / مفتّت. يُقدَّم مع بطاطا حلوة مقلية"],
    "Frenchy Glam": ["Frenchy Glam", "فرينشي غلام"],
    "Omelette": ["Omelette", "أومليت"],
    "Au choix : Soufflé au fromage / Œuf au plat / Lbed au Matcha": ["Your choice: Cheese soufflé / Fried egg / Lbed au Matcha", "حسب الاختيار: سوفليه الجبن / بيض مقلي / Lbed au Matcha"],
    "Salade César": ["Caesar Salad", "سلطة سيزر"],
    "Salade Buratta": ["Burrata Salad", "سلطة بوراتا"],
    "Pancake ou French Toast x2 – Fruits Rouges": ["Pancakes or French Toast x2 – Red Berries", "بانكيك أو فرنش توست (قطعتان) – توت أحمر"],
    "Goût au choix": ["Flavour of your choice", "النكهة حسب اختيارك"],
    "Pancake ou French Toast x2 – Banane Nutella": ["Pancakes or French Toast x2 – Banana Nutella", "بانكيك أو فرنش توست (قطعتان) – موز نوتيلا"],
    "Pancake ou French Toast x2 – Pistache": ["Pancakes or French Toast x2 – Pistachio", "بانكيك أو فرنش توست (قطعتان) – فستق"],
    "Pancake ou French Toast x2 – Pistache Kunefe": ["Pancakes or French Toast x2 – Pistachio Kunefe", "بانكيك أو فرنش توست (قطعتان) – فستق كنافة"],
    "Granola Bowl – Fruits Rouges": ["Granola Bowl – Red Berries", "وعاء غرانولا – توت أحمر"],
    "Granola Bowl – Exotique": ["Granola Bowl – Exotic", "وعاء غرانولا – استوائي"],
    "Pain au chocolat": ["Pain au chocolat", "بان أو شوكولا"],
    "Croissant": ["Croissant", "كرواسان"],
    "Pain suisse": ["Pain suisse", "بان سويس"],
    "Pâtisserie et cake du jour": ["Pastry and cake of the day", "معجنات وكعك اليوم"],
    "Espresso": ["Espresso", "إسبريسو"],
    "Américano": ["Americano", "أمريكانو"],
    "Latte": ["Latte", "لاتيه"],
    "Cappuccino": ["Cappuccino", "كابتشينو"],
    "Café Viennois": ["Viennese coffee", "قهوة فيينية"],
    "Caramel Macchiato": ["Caramel Macchiato", "كراميل ماكياتو"],
    "Chocolat Viennois": ["Viennese chocolate", "شوكولا فيينية"],
    "Chocolat Chaud": ["Hot chocolate", "شوكولا ساخنة"],
    "Thé marocain": ["Moroccan tea", "شاي مغربي"],
    "Infusion": ["Herbal tea", "منقوع الأعشاب"],
    "Iced latte": ["Iced latte", "لاتيه مثلج"],
    "Iced latte vanille": ["Vanilla iced latte", "لاتيه مثلج بالفانيليا"],
    "Iced latte caramel": ["Caramel iced latte", "لاتيه مثلج بالكراميل"],
    "Iced latte pistache": ["Pistachio iced latte", "لاتيه مثلج بالفستق"],
    "Frappé caramel": ["Caramel frappé", "فرابيه كراميل"],
    "Frappé vanille": ["Vanilla frappé", "فرابيه فانيليا"],
    "Frappé chocolat": ["Chocolate frappé", "فرابيه شوكولا"],
    "Matcha latte chaud": ["Hot matcha latte", "ماتشا لاتيه ساخن"],
    "Iced matcha latte": ["Iced matcha latte", "ماتشا لاتيه مثلج"],
    "Iced matcha latte Vanille": ["Vanilla iced matcha latte", "ماتشا لاتيه مثلج بالفانيليا"],
    "Iced Strawberry matcha": ["Iced strawberry matcha", "ماتشا مثلج بالفراولة"],
    "Iced Mango matcha": ["Iced mango matcha", "ماتشا مثلج بالمانجو"],
    "Ube latte": ["Ube latte", "أوبي لاتيه"],
    "Iced Ube latte": ["Iced ube latte", "أوبي لاتيه مثلج"],
    "Iced Ube latte vanille": ["Vanilla iced ube latte", "أوبي لاتيه مثلج بالفانيليا"],
    "Milkshake Vanille": ["Vanilla milkshake", "ميلك شيك فانيليا"],
    "Milkshake Fraise": ["Strawberry milkshake", "ميلك شيك فراولة"],
    "Milkshake Chocolat": ["Chocolate milkshake", "ميلك شيك شوكولا"],
    "Berry love": ["Berry love", "بيري لاف"],
    "Fraise / Framboise / Banane": ["Strawberry / Raspberry / Banana", "فراولة / توت العليق / موز"],
    "Sunshine": ["Sunshine", "صنشاين"],
    "Mangue / ananas / orange": ["Mango / pineapple / orange", "مانجو / أناناس / برتقال"],
    "Pink paradise": ["Pink paradise", "بينك براديس"],
    "Fraise / Banane, lait de coco": ["Strawberry / Banana, coconut milk", "فراولة / موز، حليب جوز الهند"],
    "Jus d’orange": ["Orange juice", "عصير برتقال"],
    "Jus de carotte": ["Carrot juice", "عصير جزر"],
    "Jus de citron": ["Lemon juice", "عصير ليمون"],
    "Jus de saison": ["Seasonal juice", "عصير الموسم"],
    "Mojito Classique": ["Classic mojito", "موهيتو كلاسيكي"],
    "Mojito Fruits rouges": ["Red berries mojito", "موهيتو التوت الأحمر"],
    "Mojito Passion": ["Passion fruit mojito", "موهيتو فاكهة العاطفة"],
    "Supplément. Le lait classique est déjà inclus.": ["Extra charge. Regular milk is already included.", "بسعر إضافي. الحليب العادي مُضمَّن أصلًا."],
    "Lait de coco": ["Coconut milk", "حليب جوز الهند"],
    "Lait d’avoine": ["Oat milk", "حليب الشوفان"],
    "Lait d’amande": ["Almond milk", "حليب اللوز"],
    "Le thé": ["Tea", "الشاي"],
    "Le brunch": ["Brunch", "البرانش"],
    "Les boissons": ["Drinks", "المشروبات"],
    // ----- réservation -----
    "Choisissez votre table, nous nous occupons du reste.": ["Choose your table, we’ll take care of the rest.", "اختر طاولتك ونحن نتكفّل بالباقي."],
    "Personnes": ["Guests", "عدد الأشخاص"],
    "Date": ["Date", "التاريخ"],
    "Autre date": ["Other date", "تاريخ آخر"],
    "Calendrier": ["Calendar", "التقويم"],
    "Heure": ["Time", "الوقت"],
    "Chargement…": ["Loading…", "جارٍ التحميل…"],
    "Nom": ["Name", "الاسم"],
    "Téléphone": ["Phone", "الهاتف"],
    "Remarque": ["Note", "ملاحظة"],
    "(facultatif)": ["(optional)", "(اختياري)"],
    "Choisissez une heure": ["Choose a time", "اختر وقتًا"],
    "Votre nom": ["Your name", "اسمك"],
    "Allergie, anniversaire, chaise bébé…": ["Allergy, birthday, baby chair…", "حساسية، عيد ميلاد، كرسي أطفال…"],
    "Actions rapides": ["Quick actions", "إجراءات سريعة"],
    "Venir chez Sam": ["Come to Sam’s", "تعالوا عند سام"],
    "Adresse": ["Address", "العنوان"],
    "Agdal, Rabat": ["Agdal, Rabat", "أكدال، الرباط"],
    "Adresse exacte à ajouter": ["Exact address to be added", "سيُضاف العنوان الدقيق"],
    "Horaires": ["Opening hours", "أوقات العمل"],
    "Tous les jours": ["Every day", "كل يوم"],
    "10h00 – 21h00": ["10:00 am – 9:00 pm", "10:00 – 21:00"],
    "Contact": ["Contact", "للتواصل"],
    "Appeler": ["Call", "اتصل"],
    "Itinéraire": ["Directions", "الاتجاهات"],
    "Agdal, Rabat · Maroc": ["Agdal, Rabat · Morocco", "أكدال، الرباط · المغرب"],
    // ----- alt-teksten -----
    "Table de brunch dressée près d’une grande fenêtre": ["Brunch table set beside a large window", "مائدة برانش مجهّزة قرب نافذة كبيرة"],
    "Table de brunch, fleurs et pain": ["Brunch table with flowers and bread", "مائدة برانش مع زهور وخبز"],
    "Thé à la menthe versé dans un verre": ["Mint tea being poured into a glass", "شاي بالنعناع يُصبّ في كأس"],
    "Croissant doré sur assiette": ["Golden croissant on a plate", "كرواسان ذهبي في طبق"],
    "Café avec latte art": ["Coffee with latte art", "قهوة مع رسم اللاتيه"],
    "Croissant et café devant l’arche du patio": ["Croissant and coffee in front of the patio arch", "كرواسان وقهوة أمام قوس الباحة"],
    "Un carnet ouvert et une plume sur une table en lin, avec un verre de thé à la menthe et des renoncules blanches": ["An open notebook and a pen on a linen table, with a glass of mint tea and white ranunculus", "دفتر مفتوح وقلم على طاولة من الكتان، مع كأس شاي بالنعناع وزهور الحوذان البيضاء"],
    "Thé à la menthe et expresso sur une table en lin": ["Mint tea and espresso on a linen table", "شاي بالنعناع وإسبريسو على طاولة من الكتان"],
    "Pancakes, croissant et granola": ["Pancakes, croissant and granola", "بانكيك وكرواسان وغرانولا"],
    "Iced latté, matcha et limonade": ["Iced latte, matcha and lemonade", "لاتيه مثلج وماتشا وليموناضة"],
    "Table dressée chez L’Atelier by Sam": ["A table set at L’Atelier by Sam", "طاولة مجهّزة في L’Atelier by Sam"],
    "Une théière en verre, du thé à la menthe et des pâtisseries aux amandes sur une table en lin": ["A glass teapot, mint tea and almond pastries on a linen table", "إبريق شاي زجاجي وشاي بالنعناع ومعجنات باللوز على طاولة من الكتان"],
    "La salle de L’Atelier by Sam": ["The dining room at L’Atelier by Sam", "قاعة L’Atelier by Sam"],
    "Un ordinateur portable, un café et des renoncules blanches sur une table en lin": ["A laptop, a coffee and white ranunculus on a linen table", "حاسوب محمول وقهوة وزهور الحوذان البيضاء على طاولة من الكتان"],
    "France": ["France", "فرنسا"],
    "Maroc": ["Morocco", "المغرب"],
    // ----- Notre histoire -----
    "Notre histoire · L’Atelier by Sam, Agdal Rabat": ["Our story · L’Atelier by Sam, Agdal Rabat", "حكايتنا · L’Atelier by Sam، أكدال الرباط"],
    "L’histoire de Sam : de son premier restaurant à Orléans en 2003 à L’Atelier by Sam, salon de thé et brunch à Agdal, Rabat.": ["Sam’s story: from his first restaurant in Orléans in 2003 to L’Atelier by Sam, a tea room and brunch spot in Agdal, Rabat.", "حكاية سام: من مطعمه الأول في أورليان سنة 2003 إلى L’Atelier by Sam، صالون الشاي والبرانش في أكدال بالرباط."],
    "Notre histoire": ["Our story", "حكايتنا"],
    "L’art de recevoir, le plaisir de partager.": ["The art of hosting, the joy of sharing.", "فنّ الاستقبال، ومتعة المشاركة."],
    "Une histoire de passion, de convictions et de rencontres.": ["A story of passion, conviction and encounters.", "حكاية شغف وقناعات ولقاءات."],
    "Tout commence en 2003, à Orléans, avec l’ouverture de mon premier restaurant. Depuis ce jour, la restauration est bien plus qu’un métier : c’est une aventure humaine, une passion et une certaine idée de l’hospitalité.": ["It all begins in 2003, in Orléans, with the opening of my first restaurant. Since that day, the restaurant world has been much more than a job: it is a human adventure, a passion and a certain idea of hospitality.", "كل شيء يبدأ سنة 2003 في أورليان، بافتتاح مطعمي الأول. ومنذ ذلك اليوم، لم يعد العمل في المطاعم مجرد مهنة: إنه مغامرة إنسانية وشغف وفكرة خاصة عن الضيافة."],
    "Au fil des années, une conviction s’est renforcée : la réussite d’un restaurant ne se mesure pas uniquement à la qualité de ses plats, mais aussi à la façon dont ses clients s’y sentent.": ["Over the years, one conviction has grown stronger: a restaurant’s success is not measured only by the quality of its dishes, but also by how its guests feel there.", "مع مرور السنين ترسّخت لديّ قناعة: نجاح المطعم لا يُقاس بجودة أطباقه فحسب، بل أيضًا بالشعور الذي يتركه عند زبائنه."],
    "Un accueil sincère, une attention particulière, un sourire, une conversation qui se prolonge autour d’une table… Ce sont souvent ces petits détails qui transforment un simple repas en un véritable moment de vie.": ["A sincere welcome, special attention, a smile, a conversation that carries on around a table… It is often these small details that turn a simple meal into a true moment of life.", "استقبال صادق، واهتمام خاص، وابتسامة، وحديث يطول حول مائدة… هذه التفاصيل الصغيرة هي في الغالب ما يحوّل وجبة عادية إلى لحظة حياة حقيقية."],
    "Le parcours": ["The journey", "المسار"],
    "2003": ["2003", "2003"],
    "Orléans": ["Orléans", "أورليان"],
    "L’ouverture de mon premier restaurant.": ["The opening of my first restaurant.", "افتتاح مطعمي الأول."],
    "Des années": ["Years", "سنوات"],
    "En France": ["In France", "في فرنسا"],
    "Une conviction se renforce : l’accueil compte autant que les plats.": ["A conviction grows: the welcome matters as much as the dishes.", "قناعة تترسّخ: الاستقبال لا يقلّ أهمية عن الأطباق."],
    "Le retour": ["The return", "العودة"],
    "Aux racines": ["To my roots", "إلى الجذور"],
    "Revenir au Maroc, pour un nouveau chapitre.": ["Coming back to Morocco, for a new chapter.", "العودة إلى المغرب، لفصل جديد."],
    "Aujourd’hui": ["Today", "اليوم"],
    "Rabat": ["Rabat", "الرباط"],
    "L’Atelier by Sam, à Agdal.": ["L’Atelier by Sam, in Agdal.", "L’Atelier by Sam، في أكدال."],
    "Un retour aux racines, une nouvelle histoire": ["A return to my roots, a new story", "عودة إلى الجذور، وحكاية جديدة"],
    "Après de nombreuses années en France, j’ai ressenti le besoin de revenir à mes racines marocaines et de construire un nouveau chapitre de ma vie dans un cadre qui correspond davantage à mes aspirations.": ["After many years in France, I felt the need to return to my Moroccan roots and to build a new chapter of my life in a setting that better matches my aspirations.", "بعد سنوات عديدة في فرنسا، شعرتُ بالحاجة إلى العودة إلى جذوري المغربية وبناء فصل جديد من حياتي في إطار أقرب إلى تطلعاتي."],
    "C’est à Rabat que j’ai choisi de donner vie à L’Atelier by Sam, un projet qui rassemble tout ce qui m’anime : le plaisir de recevoir, le goût des bonnes choses et l’envie de créer un lieu où les gens aiment se retrouver.": ["It is in Rabat that I chose to bring L’Atelier by Sam to life, a project that brings together everything that drives me: the pleasure of hosting, a taste for good things and the wish to create a place where people love to meet.", "في الرباط اخترتُ أن أُحيي L’Atelier by Sam، مشروع يجمع كل ما يحرّكني: متعة الاستقبال، وتذوّق الأشياء الجميلة، والرغبة في إنشاء مكان يحب الناس أن يلتقوا فيه."],
    "J’ai imaginé un espace élégant, chaleureux et apaisant, où l’on prend le temps. Le temps de savourer un brunch, de partager un thé, de retrouver ses proches ou de faire de nouvelles rencontres.": ["I imagined an elegant, warm and soothing space where people take their time. Time to savour a brunch, share a tea, meet loved ones or make new acquaintances.", "تخيّلتُ فضاءً أنيقًا ودافئًا ومريحًا، يأخذ فيه الناس وقتهم. وقتًا للاستمتاع ببرانش، وتقاسم كأس شاي، ولقاء الأحبّة أو التعرّف على أشخاص جدد."],
    "Un lieu où les conversations naissent naturellement, où les idées se partagent et où les liens se créent, simplement, autour d’une table.": ["A place where conversations start naturally, ideas are shared and bonds are made, simply, around a table.", "مكان تولد فيه الأحاديث بعفوية، وتُتبادل فيه الأفكار، وتنشأ فيه الروابط ببساطة حول مائدة."],
    "Bien manger, une conviction profonde": ["Eating well, a deep conviction", "الأكل الجيد، قناعة عميقة"],
    "Depuis mes débuts, je suis convaincu que la qualité de notre alimentation joue un rôle essentiel dans notre bien-être.": ["Since the beginning, I have been convinced that the quality of our food plays an essential role in our well-being.", "منذ بداياتي وأنا مقتنع بأن جودة غذائنا تؤدي دورًا أساسيًا في صحتنا وراحتنا."],
    "Bien manger, ce n’est pas seulement se faire plaisir. C’est aussi accorder de l’importance à ce que l’on consomme, à la qualité des ingrédients et à la manière dont les aliments sont préparés.": ["Eating well is not only about treating yourself. It is also about caring what we consume, the quality of the ingredients and the way food is prepared.", "الأكل الجيد ليس مجرد متعة. إنه أيضًا اهتمام بما نستهلكه، وبجودة المكوّنات، وبطريقة تحضير الطعام."],
    "C’est pourquoi je souhaite privilégier des produits de qualité, valoriser le fait maison et proposer une cuisine préparée avec soin.": ["That is why I want to favour quality products, value homemade food and offer cooking prepared with care.", "لهذا أحرص على اختيار منتجات عالية الجودة، وإعلاء قيمة الطعام المنزلي، وتقديم مطبخ يُحضَّر بعناية."],
    "Je crois profondément qu’une alimentation équilibrée et de bonnes habitudes de vie participent à notre bien-être sur le long terme. Cette conviction fait partie de ma vision de la restauration : offrir du plaisir, sans oublier l’importance de prendre soin de soi.": ["I deeply believe that a balanced diet and good lifestyle habits contribute to our well-being in the long run. This conviction is part of my vision of restaurants: offering pleasure, without forgetting the importance of taking care of yourself.", "أؤمن بعمق بأن الغذاء المتوازن والعادات الصحية الجيدة يسهمان في رفاهنا على المدى البعيد. وهذه القناعة جزء من رؤيتي للمطاعم: تقديم المتعة دون إغفال أهمية العناية بالنفس."],
    "Bien plus qu’un salon de thé": ["Much more than a tea room", "أكثر بكثير من صالون شاي"],
    "Avec L’Atelier by Sam, mon ambition est de créer un lieu vivant, où les générations se rencontrent, où les amis se retrouvent et où de nouvelles relations peuvent naître.": ["With L’Atelier by Sam, my ambition is to create a lively place where generations meet, friends gather and new relationships can begin.", "مع L’Atelier by Sam، طموحي هو إنشاء مكان نابض بالحياة، تلتقي فيه الأجيال، ويجتمع فيه الأصدقاء، وتولد فيه علاقات جديدة."],
    "Un endroit où l’on peut venir seul ou accompagné, pour travailler tranquillement, échanger des idées, partager un moment précieux ou simplement profiter d’une pause dans le quotidien.": ["A place where you can come alone or with company, to work quietly, exchange ideas, share a precious moment or simply enjoy a break from daily life.", "مكان يمكنك أن تأتي إليه وحدك أو برفقة آخرين، لتعمل بهدوء، أو تتبادل الأفكار، أو تتقاسم لحظة ثمينة، أو تستمتع ببساطة باستراحة من إيقاع الحياة اليومية."],
    "Je souhaite que chacun puisse y trouver ce qu’il est venu chercher, dans une atmosphère naturelle, élégante et accueillante.": ["I want everyone to find what they came for, in a natural, elegant and welcoming atmosphere.", "أتمنى أن يجد كل واحد هناك ما جاء يبحث عنه، في أجواء طبيعية وأنيقة ومرحّبة."],
    "Car je suis convaincu que les plus beaux moments ne sont pas toujours ceux que l’on prévoit. Parfois, ils commencent simplement autour d’un bon repas et d’une conversation sincère.": ["Because I am convinced that the most beautiful moments are not always the ones we plan. Sometimes they simply begin around a good meal and a sincere conversation.", "لأنني مقتنع بأن أجمل اللحظات ليست دائمًا تلك التي نخطط لها. أحيانًا تبدأ ببساطة حول وجبة طيبة وحديث صادق."],
    "L’Atelier by Sam, c’est ma façon de concevoir l’hospitalité : du goût, de l’attention et de l’humain.": ["L’Atelier by Sam is my way of seeing hospitality: taste, attention and humanity.", "L’Atelier by Sam هو طريقتي في فهم الضيافة: ذوق، واهتمام، وإنسانية."],
    "Bienvenue chez vous, à Rabat.": ["Welcome home, in Rabat.", "أهلًا بكم في بيتكم، بالرباط."],
    // ----- dynamische teksten (reservering) -----
    "MAD": ["MAD", "درهم"],
    "Matin & midi": ["Morning & noon", "الصباح والظهيرة"],
    "Après-midi": ["Afternoon", "بعد الظهر"],
    "Soir": ["Evening", "المساء"],
    "Demain": ["Tomorrow", "غدًا"],
    "Plus de place ce jour-là. Choisissez un autre jour.": ["No tables left that day. Please choose another day.", "لا توجد أماكن في ذلك اليوم. اختر يومًا آخر."],
    "1 personne": ["1 guest", "شخص واحد"],
    "{n} personnes": ["{n} guests", "{n} أشخاص"],
    "Ce créneau vient d’être pris. Choisissez une autre heure.": ["That time slot has just been taken. Please choose another time.", "تم حجز هذا الموعد للتو. اختر وقتًا آخر."],
    "Pour un grand groupe, contactez-nous sur WhatsApp.": ["For a large group, contact us on WhatsApp.", "للمجموعات الكبيرة، تواصلوا معنا عبر واتساب."],
    "Indiquez votre nom et un numéro de téléphone valide.": ["Please enter your name and a valid phone number.", "يرجى إدخال اسمك ورقم هاتف صحيح."],
    "Vous avez déjà plusieurs réservations à venir. Contactez-nous sur WhatsApp.": ["You already have several upcoming bookings. Contact us on WhatsApp.", "لديك بالفعل عدة حجوزات قادمة. تواصل معنا عبر واتساب."],
    "Les réservations en ligne sont fermées. Contactez-nous sur WhatsApp.": ["Online bookings are closed. Contact us on WhatsApp.", "الحجز عبر الإنترنت مغلق. تواصلوا معنا عبر واتساب."],
    "Pas de connexion. Réessayez ou contactez-nous sur WhatsApp.": ["No connection. Try again or contact us on WhatsApp.", "لا يوجد اتصال. أعد المحاولة أو تواصل معنا عبر واتساب."],
    "Une erreur est survenue. Réessayez ou contactez-nous sur WhatsApp.": ["Something went wrong. Try again or contact us on WhatsApp.", "حدث خطأ ما. أعد المحاولة أو تواصل معنا عبر واتساب."],
    "Envoi…": ["Sending…", "جارٍ الإرسال…"],
    "Réservation confirmée": ["Booking confirmed", "تم تأكيد الحجز"],
    "Demande envoyée": ["Request sent", "تم إرسال الطلب"],
    "Merci": ["Thank you", "شكرًا"],
    "Votre table est réservée": ["Your table is booked", "طاولتك محجوزة"],
    "Nous confirmons votre réservation très vite": ["We will confirm your booking very soon", "سنؤكد حجزك في أقرب وقت"],
    "Suivre ou annuler ma réservation": ["Follow or cancel my booking", "تتبّع حجزي أو إلغاؤه"],
    "Faire une autre réservation": ["Make another booking", "حجز آخر"]
  };

  const idx = LANG === "en" ? 0 : LANG === "ar" ? 1 : -1;
  function t(fr, vars) {
    const e = DICT[fr];
    let s = idx >= 0 && e && e[idx] != null ? e[idx] : fr;
    if (vars) s = s.replace(/\{(\w+)\}/g, (_, k) => (vars[k] == null ? "" : vars[k]));
    return s;
  }
  const LOCALE = LANG === "ar" ? "ar-MA-u-nu-latn" : LANG === "en" ? "en-GB" : "fr-FR";
  window.I18N = { lang: LANG, t, locale: LOCALE };

  const norm = s => s.replace(/\s+/g, " ").trim();
  function translateDom() {
    if (idx < 0) { addSwitcher(); return; }
    const w = document.createTreeWalker(document.documentElement, NodeFilter.SHOW_TEXT);
    const list = []; let n;
    while ((n = w.nextNode())) list.push(n);
    list.forEach(n => {
      const p = n.parentElement;
      if (!p || p.tagName === "SCRIPT" || p.tagName === "STYLE") return;
      if (p.closest(".w, .ghost, .badge")) return; // grote sierwoorden ("Brunch", "Atelier") blijven zoals ze zijn
      const raw = n.textContent, key = norm(raw);
      if (!key || !(key in DICT)) return;
      const out = t(key);
      if (out !== key) n.textContent = raw.replace(raw.trim(), out);
    });
    ["alt", "aria-label", "placeholder", "title"].forEach(a => document.querySelectorAll("[" + a + "]").forEach(el => {
      const v = el.getAttribute(a).trim();
      if (v in DICT) el.setAttribute(a, t(v));
    }));
    const md = document.querySelector('meta[name="description"]');
    if (md && md.content in DICT) md.content = t(md.content);
    addSwitcher();
  }

  function addSwitcher() {
    const nav = document.querySelector("header.top .nav");
    if (!nav || nav.querySelector(".lang")) return;
    const box = document.createElement("div");
    box.className = "lang";
    box.setAttribute("role", "group");
    box.setAttribute("aria-label", LANG === "ar" ? "اللغة" : LANG === "en" ? "Language" : "Langue");
    [["fr", "FR", "Français"], ["en", "EN", "English"], ["ar", "عربي", "العربية"]].forEach(([code, label, name]) => {
      const b = document.createElement("button");
      b.type = "button"; b.textContent = label; b.lang = code; b.title = name;
      b.setAttribute("aria-pressed", code === LANG ? "true" : "false");
      b.addEventListener("click", () => {
        if (code === LANG) return;
        try { localStorage.setItem("lang", code); } catch (_) {}
        const u = new URL(location.href); u.searchParams.delete("lang");
        history.replaceState(null, "", u.pathname + u.search + u.hash);
        location.reload(); // zelfde pagina, nieuwe taal
      });
      box.appendChild(b);
    });
    nav.appendChild(box);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", translateDom);
  else translateDom();
})();
