export interface TaxonomyLevel {
  level: number;
  title: string;
  description: string;
}

export const librarianLevels: TaxonomyLevel[] = [
  { level: 1, title: "Ingen inblandning", description: "Biblioteket ignoreras helt i undervisningen." },
  { level: 2, title: "Självbetjäningslager", description: "Biblioteket tillhandahåller material, men användarna får klara sig själva." },
  { level: 3, title: "Individuell referenshjälp", description: "Bibliotekarien hjälper elever och lärare att hitta specifikt material vid förfrågan." },
  { level: 4, title: "Spontan samverkan", description: "Bibliotekarien hjälper klasser eller grupper som dyker upp utan förvarning." },
  { level: 5, title: "Informell planering", description: "Korta möten i korridorer eller personalrum där bibliotekarien ger tips på material." },
  { level: 6, title: "Planerad insamling", description: "Läraren ber i förväg bibliotekarien att plocka fram material till ett specifikt projekt." },
  { level: 7, title: "Marknadsföring", description: "Bibliotekarien arbetar aktivt med t.ex. bokprat för att engagera personal och elever." },
  { level: 8, title: "Formell planering i stödroll", description: "Bibliotekarien deltar i planering men endast som serviceperson; läraren styr helt innehållet." },
  { level: 9, title: "Pedagogisk design I", description: "Bibliotekarien planerar, genomför och utvärderar delar av undervisningen tillsammans med läraren." },
  { level: 10, title: "Pedagogisk design II", description: "Biblioteket är kärnan i undervisningen; informationssökning är helt integrerad i ämnet." },
  { level: 11, title: "Läroplansutveckling", description: "Bibliotekarien deltar i att forma skolans övergripande pedagogiska innehåll och kursplaner." },
];

export const teacherLevels: TaxonomyLevel[] = [
  { level: 1, title: "Helt självständig", description: "Läraren använder endast läroböcker och eget material." },
  { level: 2, title: "Privat samling", description: "Läraren förlitar sig på egna böcker i klassrummet." },
  { level: 3, title: "Lånad samling", description: "Läraren lånar material från biblioteket men sköter allt i klassrummet." },
  { level: 4, title: "Bibliotekarien som idégivare", description: "Läraren söker inspiration eller tips från bibliotekarien vid enstaka tillfällen." },
  { level: 5, title: "Biblioteket som berikning", description: "Biblioteket används för att ge 'det lilla extra' till ett temaområde." },
  { level: 6, title: "Biblioteket som innehåll", description: "Läraren planerar tillsammans med bibliotekarien för att integrera medier i kursmomentet." },
  { level: 7, title: "Partnerskap", description: "Lärare och bibliotekarie samarbetar som jämlika partners genom hela lärprocessen." },
  { level: 8, title: "Läroplansutveckling", description: "Läraren samråder med bibliotekarien vid långsiktig utveckling av ämnen och kursplaner." },
];

export const principalLevels: TaxonomyLevel[] = [
  { level: 1, title: "Ambivalent inställning", description: "Biblioteket får inget aktivt stöd p.g.a. bristande intresse eller prioriteringar." },
  { level: 2, title: "Införskaffa kunskap (Nivå 2)", description: "Rektorn börjar förstå bibliotekets roll i skolan." },
  { level: 3, title: "Införskaffa kunskap (Nivå 3)", description: "Rektorn anställer en visionär bibliotekarie." },
  { level: 4, title: "Införskaffa kunskap (Nivå 4)", description: "Rektorn inkluderar bibliotekarien i ledningsteamet." },
  { level: 5, title: "Bygga struktur", description: "Rektorn skapar en organisation där biblioteket är tillgängligt och ställer krav på användning." },
  { level: 6, title: "Utöva ledarskap (Nivå 6)", description: "Rektorn har en långsiktig ekonomisk plan för biblioteket." },
  { level: 7, title: "Utöva ledarskap (Nivå 7)", description: "Ser till att bibliotekets arbete bidrar till elevernas resultat." },
  { level: 8, title: "Utvärdera resultat", description: "Rektorn utvärderar systematiskt hur biblioteksverksamheten påverkar elevernas måluppfyllelse." },
];

export const fourPillars = [
  { 
    id: "collaboration", 
    title: "Samarbete", 
    question: "Planerar och undervisar personalen tillsammans?",
    bingoItems: [
      "Samplanerar med lärare", "Sambedömer elevuppgifter", "Deltar i arbetslagsmöten", "Gemensamma projekt",
      "Bibliotekarien i klassrummet", "Lärare besöker bibblan med klass", "Gemensam digital planering", "Gemensam utvärdering",
      "Tipsar om material till teman", "Lärare söker aktivt expertis", "Bibblan i lektionsplaneringen", "Källkritik i specifika ämnen",
      "Gemensamma bokinköp", "Coachar lärare i sökning", "Skolledningen uppmuntrar", "Tid avsatt för samplanering"
    ]
  },
  { 
    id: "reading", 
    title: "Läsning", 
    question: "Finns det ett brett utbud av litteratur som väcker läslust?",
    bingoItems: [
      "Bokprat för alla årskurser", "Aktuellt bokbestånd", "Läsutmaningar/aktiviteter", "Lockande skyltning",
      "E-böcker/ljudböcker finns", "Samarbete med hemmet", "Läsande förebilder (vuxna)", "Tid för fri läsning",
      "Känner elevernas läsnivåer", "Mångfald i utbudet", "Elevinflytande vid inköp", "Inbjudande miljö",
      "Litteratur på modersmål", "Författarbesök/events", "Boksamtal i grupper", "Öppet hela skoldagen"
    ]
  },
  { 
    id: "tech", 
    title: "Teknikstött lärande", 
    question: "Fungerar biblioteket som ett nav för digital kompetens och IT?",
    bingoItems: [
      "Nav för digital kompetens", "Hjälp med digitala verktyg", "Tillgång till databaser", "Makerspace/skapande",
      "Stöd i lärplattformar", "Källkritik på nätet", "Digitalt skapande (podd/film)", "Tekniskt kunnig personal",
      "Låneutrustning (kamera/VR)", "Digitalt mediebestånd", "Utbildning i upphovsrätt", "Stöd för Legimus/MTM",
      "Bra webbplats/blogg", "Ansvarsfull AI-användning", "Fungerande Wi-Fi", "Digitala infoskärmar"
    ]
  },
  { 
    id: "info", 
    title: "Informationskompetens", 
    question: "Undervisas eleverna systematiskt i källkritik och sökstrategier?",
    bingoItems: [
      "Systematisk källkritik", "Sökstrategier i alla år", "Värdera olika källor", "Referenshantering",
      "Upphovsrätt i undervisning", "Förståelse för algoritmer", "Källkritik i sociala medier", "Fakta vs Åsikt",
      "Analoga & digitala källor", "Formulera sökfrågor", "Förstå informationsflöden", "Kritiskt tänkande i alla ämnen",
      "Lektioner i sökning", "Samarbete kring uppgifter", "Verktyg för källkritik", "Ansvarsfull produktion"
    ]
  },
];
