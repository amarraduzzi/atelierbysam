// Menu: prijzen in MAD (getal, bv. 45). Leeg = geen prijs getoond. Fictieve prijzen, pas aan.
// Prijs staat bij het gerecht, of bij elke maat/variant.
const MENU = [
 {
  "name": "Boissons chaudes",
  "items": [
   {
    "name": "Thé à la menthe",
    "desc": "",
    "sizes": [],
    "price": "20"
   },
   {
    "name": "Infusion",
    "desc": "",
    "sizes": [],
    "price": "25"
   },
   {
    "name": "Expresso",
    "desc": "",
    "sizes": [],
    "price": "18"
   },
   {
    "name": "Allongé",
    "desc": "",
    "sizes": [],
    "price": "20"
   },
   {
    "name": "Café au lait",
    "desc": "",
    "sizes": [],
    "price": "25"
   },
   {
    "name": "Cappuccino",
    "desc": "",
    "sizes": [],
    "price": "30"
   },
   {
    "name": "Latté",
    "desc": "",
    "sizes": [],
    "price": "32"
   }
  ]
 },
 {
  "name": "Boissons froides",
  "items": [
   {
    "name": "Iced latté",
    "desc": "",
    "sizes": [],
    "price": "38"
   },
   {
    "name": "Iced latté aromatisé",
    "desc": "Caramel, vanille, etc.",
    "sizes": [],
    "price": "42"
   },
   {
    "name": "Iced pistachio latté",
    "desc": "",
    "sizes": [],
    "price": "48"
   },
   {
    "name": "Matcha",
    "desc": "",
    "sizes": [],
    "price": "45"
   },
   {
    "name": "Matcha mangue ou fraise",
    "desc": "Mangue ou fraise",
    "sizes": [],
    "price": "50"
   },
   {
    "name": "Limonade",
    "desc": "",
    "sizes": [],
    "price": "30"
   },
   {
    "name": "Virgin Mojito",
    "desc": "",
    "sizes": [
     {
      "label": "Classique",
      "price": "35",
      "desc": ""
     },
     {
      "label": "Fraise",
      "price": "40",
      "desc": ""
     },
     {
      "label": "Fruits rouges",
      "price": "40",
      "desc": ""
     },
     {
      "label": "Passion",
      "price": "40",
      "desc": ""
     }
    ]
   }
  ]
 },
 {
  "name": "Smoothies",
  "items": [
   {
    "name": "Smoothie fraise banane",
    "desc": "Fraise, banane",
    "sizes": [],
    "price": "40"
   },
   {
    "name": "Smoothie fruits rouges",
    "desc": "Fruits rouges",
    "sizes": [],
    "price": "42"
   },
   {
    "name": "Smoothie coco mangue",
    "desc": "Coco, mangue",
    "sizes": [],
    "price": "42"
   },
   {
    "name": "Smoothie coco ananas",
    "desc": "Coco, ananas",
    "sizes": [],
    "price": "40"
   }
  ]
 },
 {
  "name": "Délices salés",
  "items": [
   {
    "name": "Avocado Toast",
    "desc": "Pain céréales, cheese, houmous poivron, avocat, burrata, feta",
    "sizes": [],
    "price": "75"
   },
   {
    "name": "Chic Salmon",
    "desc": "Croissant, cheese, salade, saumon fumé, œuf poché",
    "sizes": [],
    "price": "95"
   },
   {
    "name": "Burger Kif-Kif",
    "desc": "Bun brioché (du jour), sauce blanche, salade, crispy poulet, cheddar, omelette",
    "sizes": [],
    "price": "85"
   },
   {
    "name": "Eggs Bénédict",
    "desc": "",
    "sizes": [],
    "price": "80"
   },
   {
    "name": "Frenchy Glam",
    "desc": "",
    "sizes": [],
    "price": "70"
   },
   {
    "name": "Exotique Rolls",
    "desc": "",
    "sizes": [],
    "price": "65"
   },
   {
    "name": "Club sandwich César",
    "desc": "",
    "sizes": [],
    "price": "70"
   },
   {
    "name": "Chèvre chaud",
    "desc": "",
    "sizes": [],
    "price": "65"
   },
   {
    "name": "Œufs",
    "desc": "",
    "sizes": [
     {
      "label": "Au plat",
      "price": "45",
      "desc": "2 œufs"
     },
     {
      "label": "Brouillés",
      "price": "45",
      "desc": "2 œufs"
     },
     {
      "label": "Soufflé au fromage",
      "price": "55",
      "desc": ""
     }
    ]
   }
  ]
 },
 {
  "name": "Délices sucrés",
  "items": [
   {
    "name": "French Toast",
    "desc": "Brioche perdue, x2. Au choix : fruits rouges / banane Nutella / pistache + éclats / pistache kunéfe chocolat (voir Suppléments)",
    "sizes": [],
    "price": "60"
   },
   {
    "name": "Pancakes",
    "desc": "Au choix : fruits rouges / banane Nutella / pistache + éclats / pistache kunéfe chocolat",
    "sizes": [
     {
      "label": "Petit (x3)",
      "price": "50",
      "desc": ""
     },
     {
      "label": "Grand (x2)",
      "price": "60",
      "desc": ""
     }
    ]
   },
   {
    "name": "Croissant gourmand",
    "desc": "Crème pâtissière vanille, fruits rouges, éclats de pistache",
    "sizes": [],
    "price": "45"
   },
   {
    "name": "Granola Bowl",
    "desc": "Yaourt grec, fruits du jour, muesli, miel",
    "sizes": [],
    "price": "55"
   },
   {
    "name": "Exotic Bowl",
    "desc": "",
    "sizes": [],
    "price": "60"
   },
   {
    "name": "Viennoiseries",
    "desc": "",
    "sizes": [
     {
      "label": "Croissant",
      "price": "12",
      "desc": "Croissant"
     },
     {
      "label": "Pain au chocolat",
      "price": "14",
      "desc": "Pain au chocolat"
     },
     {
      "label": "Pain aux raisins",
      "price": "14",
      "desc": "Pain aux raisins"
     }
    ]
   }
  ]
 }
];
