
export interface Suggestion {
  id: string;
  text: string;
  pillarId: string;
  minLevel: number;
  maxLevel: number;
  reference?: string;
}

export const SUGGESTIONS: Record<string, Suggestion[]> = {
  mik: [
    { id: 'mik-1', text: 'Genomgång i bibliotekskunskap och praktisk sökövning i katalogen.', pillarId: 'mik', minLevel: 1, maxLevel: 4, reference: '§1 Skolbibliotekens ändamål' },
    { id: 'mik-2', text: 'Planera ett källkritik- och källtillitspass med autentiska exempel.', pillarId: 'mik', minLevel: 3, maxLevel: 6, reference: '§1 Skolbibliotekens ändamål' },
    { id: 'mik-3', text: 'Workshop om nätetik och integritet, inklusive självbetjäning.', pillarId: 'mik', minLevel: 2, maxLevel: 5, reference: '§1 Skolbibliotekens ändamål' },
    { id: 'mik-4', text: 'Undervisning i informationssökning i stadens databaser.', pillarId: 'mik', minLevel: 4, maxLevel: 7, reference: 'Utbildningsförvaltningen stödjer' },
    { id: 'mik-5', text: 'Träna referenshantering med enkel mall kopplad till uppgift.', pillarId: 'mik', minLevel: 3, maxLevel: 6, reference: '§1 Skolbibliotekens ändamål' },
    { id: 'mik-6', text: 'Genomgång om upphovsrätt/CC och märk elevverk korrekt.', pillarId: 'mik', minLevel: 4, maxLevel: 7, reference: '§1 Skolbibliotekens ändamål' },
    { id: 'mik-7', text: 'Faktagranskning av nyheter med källkritisk checklista.', pillarId: 'mik', minLevel: 5, maxLevel: 8, reference: '§1 Skolbibliotekens ändamål' },
    { id: 'mik-8', text: 'Kritiskt användande av AI med krav på källor och verifiering.', pillarId: 'mik', minLevel: 6, maxLevel: 9, reference: '§1 Skolbibliotekens ändamål' },
    { id: 'mik-9', text: 'Lektion om tolkning av diagram/visualiseringar i ämneskontext.', pillarId: 'mik', minLevel: 5, maxLevel: 8, reference: '§1 Skolbibliotekens ändamål' },
    { id: 'mik-10', text: 'Visa digitala tillgänglighetsstöd: tal, e-böcker, anpassningar.', pillarId: 'mik', minLevel: 1, maxLevel: 5, reference: '§4 Prioriterade grupper' },
    { id: 'mik-11', text: 'Kortpass om lösenordshygien och dataskydd i elevprojekt.', pillarId: 'mik', minLevel: 2, maxLevel: 5, reference: '§1 Skolbibliotekens ändamål' },
    { id: 'mik-12', text: 'Co-planera MIK-undervisning med lärare i kurs/ämne.', pillarId: 'mik', minLevel: 7, maxLevel: 9, reference: '§3 Integrering i undervisningen' },
    { id: 'mik-13', text: 'Jämför sökstrategier: Google vs. databaser; reflektera.', pillarId: 'mik', minLevel: 5, maxLevel: 8, reference: '§1 Skolbibliotekens ändamål' },
    { id: 'mik-14', text: 'Utvärdera två lärresurser mot uppställda kriterier.', pillarId: 'mik', minLevel: 6, maxLevel: 9, reference: '§1 Skolbibliotekens ändamål' },
    { id: 'mik-15', text: 'Rutin för etisk publicering av elevarbeten.', pillarId: 'mik', minLevel: 4, maxLevel: 7, reference: '§1 Skolbibliotekens ändamål' },
    { id: 'mik-16', text: 'Bild-/videogranskning för att upptäcka manipulation.', pillarId: 'mik', minLevel: 6, maxLevel: 9, reference: '§1 Skolbibliotekens ändamål' }
  ],
  reading: [
    { id: 'read-1', text: 'Månadsvis bokprat och individuell vägledning mot läsmål.', pillarId: 'reading', minLevel: 1, maxLevel: 5, reference: '§1 Skolbibliotekens ändamål' },
    { id: 'read-2', text: 'Återkommande högläsning med boksamtal i klasserna.', pillarId: 'reading', minLevel: 2, maxLevel: 6, reference: '§1 Skolbibliotekens ändamål' },
    { id: 'read-3', text: 'Planera läsprojekt (även lov/sommar) med uppföljning.', pillarId: 'reading', minLevel: 4, maxLevel: 8, reference: '§1 Skolbibliotekens ändamål' },
    { id: 'read-4', text: 'Inför läslogg och kortreflektioner kopplat till mål.', pillarId: 'reading', minLevel: 3, maxLevel: 7, reference: '§3 Integrering i undervisningen' },
    { id: 'read-5', text: 'Genomgång av genrer och texttypers drag.', pillarId: 'reading', minLevel: 2, maxLevel: 5, reference: '§1 Skolbibliotekens ändamål' },
    { id: 'read-6', text: 'Begreppsarbete kopplat till ett tema/område.', pillarId: 'reading', minLevel: 3, maxLevel: 6, reference: '§1 Skolbibliotekens ändamål' },
    { id: 'read-7', text: 'Stöd i fackläsning (NO/SO) med strategier.', pillarId: 'reading', minLevel: 4, maxLevel: 8, reference: '§1 Skolbibliotekens ändamål' },
    { id: 'read-8', text: 'Stöd till SVA och flerspråkighet i uppgifter.', pillarId: 'reading', minLevel: 1, maxLevel: 6, reference: '§4 Prioriterade grupper' },
    { id: 'read-9', text: 'Lyft Mångspråksbibliotekets utbud och läsning på modersmål.', pillarId: 'reading', minLevel: 2, maxLevel: 5, reference: 'Utbildningsförvaltningen stödjer; §4' },
    { id: 'read-10', text: 'Introducera talböcker, lättläst och punktskrift för berörda elever.', pillarId: 'reading', minLevel: 1, maxLevel: 5, reference: '§4 Prioriterade grupper' },
    { id: 'read-11', text: 'Planera klassläsning via Cirkulationsbiblioteket.', pillarId: 'reading', minLevel: 3, maxLevel: 6, reference: 'Utbildningsförvaltningen stödjer' },
    { id: 'read-12', text: 'Skriv recension/essä med textbevis.', pillarId: 'reading', minLevel: 5, maxLevel: 8, reference: '§1 Skolbibliotekens ändamål' },
    { id: 'read-13', text: 'Inför strukturerad kamratrespons.', pillarId: 'reading', minLevel: 6, maxLevel: 9, reference: '§3 Integrering i undervisningen' },
    { id: 'read-14', text: 'Genomför läsutmaning/temavecka i biblioteket.', pillarId: 'reading', minLevel: 2, maxLevel: 6, reference: '§1 Skolbibliotekens ändamål' },
    { id: 'read-15', text: 'Arbeta med originalspråk/översättning och jämför.', pillarId: 'reading', minLevel: 5, maxLevel: 9, reference: '§1 Skolbibliotekens ändamål' },
    { id: 'read-16', text: 'Följ upp åtgärder i SKA med indikatorer.', pillarId: 'reading', minLevel: 8, maxLevel: 9, reference: '§3 Integrering i undervisningen' }
  ],
  culture: [
    { id: 'cult-1', text: 'Bokcirkel med samtida titel + klassikerutdrag.', pillarId: 'culture', minLevel: 3, maxLevel: 7, reference: '§1 Skolbibliotekens ändamål' },
    { id: 'cult-2', text: 'Författarporträtt/epoker – tidslinje och textprov.', pillarId: 'culture', minLevel: 4, maxLevel: 8, reference: '§1 Skolbibliotekens ändamål' },
    { id: 'cult-3', text: 'Poesi/novell/dramatik – läs och skapa.', pillarId: 'culture', minLevel: 2, maxLevel: 6, reference: '§1 Skolbibliotekens ändamål' },
    { id: 'cult-4', text: 'Jämför bok och film – vad ändras och varför?', pillarId: 'culture', minLevel: 3, maxLevel: 7, reference: '§1 Skolbibliotekens ändamål' },
    { id: 'cult-5', text: 'Lyft kulturarv och nationella minoriteter i urvalet.', pillarId: 'culture', minLevel: 1, maxLevel: 6, reference: '§4 Prioriterade grupper' },
    { id: 'cult-6', text: 'Tema: ett motiv i flera verk/medier.', pillarId: 'culture', minLevel: 4, maxLevel: 8, reference: '§1 Skolbibliotekens ändamål' },
    { id: 'cult-7', text: 'Kreativt skrivande i en författares stil.', pillarId: 'culture', minLevel: 5, maxLevel: 9, reference: '§1 Skolbibliotekens ändamål' },
    { id: 'cult-8', text: 'Närläsning med citat och resonemang.', pillarId: 'culture', minLevel: 6, maxLevel: 9, reference: '§1 Skolbibliotekens ändamål' },
    { id: 'cult-9', text: 'Elevutställning som synliggör mångfald i beståndet.', pillarId: 'culture', minLevel: 2, maxLevel: 6, reference: '§4 Prioriterade grupper' },
    { id: 'cult-10', text: 'Läsning på flera språk/översättning.', pillarId: 'culture', minLevel: 3, maxLevel: 7, reference: '§4 Prioriterade grupper' },
    { id: 'cult-11', text: 'Samverka med folkbibliotek/kulturaktörer.', pillarId: 'culture', minLevel: 4, maxLevel: 8, reference: '§1 Skolbibliotekens ändamål' },
    { id: 'cult-12', text: 'Recensionspodd/-blogg med elevbidrag.', pillarId: 'culture', minLevel: 5, maxLevel: 9, reference: '§1 Skolbibliotekens ändamål' },
    { id: 'cult-13', text: 'Synliggör medieplan: inköp och gallring.', pillarId: 'culture', minLevel: 2, maxLevel: 5, reference: '§1 Skolbibliotekens ändamål' },
    { id: 'cult-14', text: 'Visa tillgängliga format och läsmiljöer.', pillarId: 'culture', minLevel: 1, maxLevel: 4, reference: '§2 Personal och lokal; §4' },
    { id: 'cult-15', text: 'Elevledd kulturhändelse i biblioteket.', pillarId: 'culture', minLevel: 6, maxLevel: 9, reference: '§3 Integrering i undervisningen' },
    { id: 'cult-16', text: 'Biblioteksvandring – trygg och ändamålsenlig lokal.', pillarId: 'culture', minLevel: 1, maxLevel: 4, reference: '§2 Personal och lokal' }
  ],
  democracy: [
    { id: 'dem-1', text: 'Skriv debattartikel med källor – fri åsiktsbildning.', pillarId: 'democracy', minLevel: 5, maxLevel: 9, reference: '§1 Skolbibliotekens ändamål' },
    { id: 'dem-2', text: 'Genomgång av pressetik och publicistiska regler.', pillarId: 'democracy', minLevel: 4, maxLevel: 8, reference: '§1 Skolbibliotekens ändamål' },
    { id: 'dem-3', text: 'Seminarium: yttrandefrihet & ansvar online.', pillarId: 'democracy', minLevel: 6, maxLevel: 9, reference: '§1 Skolbibliotekens ändamål' },
    { id: 'dem-4', text: 'Källkritik kopplat till samhällsfrågor/val.', pillarId: 'democracy', minLevel: 5, maxLevel: 9, reference: '§1 Skolbibliotekens ändamål' },
    { id: 'dem-5', text: 'Starta eller stärka biblioteksråd.', pillarId: 'democracy', minLevel: 3, maxLevel: 7, reference: '§3 Integrering i undervisningen' },
    { id: 'dem-6', text: 'Granska representation och likvärdig tillgång i bestånd.', pillarId: 'democracy', minLevel: 4, maxLevel: 8, reference: '§4 Prioriterade grupper' },
    { id: 'dem-7', text: 'Rollspel: hantera näthat och åtgärder.', pillarId: 'democracy', minLevel: 3, maxLevel: 7, reference: '§1 Skolbibliotekens ändamål' },
    { id: 'dem-8', text: 'Identifiera propaganda/retoriska grepp.', pillarId: 'democracy', minLevel: 5, maxLevel: 9, reference: '§1 Skolbibliotekens ändamål' },
    { id: 'dem-9', text: 'Skriv insändare/medborgarförslag.', pillarId: 'democracy', minLevel: 4, maxLevel: 8, reference: '§1 Skolbibliotekens ändamål' },
    { id: 'dem-10', text: 'Jämför nyhetsbilder; metadata & kontext.', pillarId: 'democracy', minLevel: 6, maxLevel: 9, reference: '§1 Skolbibliotekens ändamål' },
    { id: 'dem-11', text: 'Barnkonventionen – koppling till bibliotekets uppdrag.', pillarId: 'democracy', minLevel: 1, maxLevel: 5, reference: '§1 Skolbibliotekens ändamål' },
    { id: 'dem-12', text: 'Värderingsövningar med källstöd.', pillarId: 'democracy', minLevel: 4, maxLevel: 8, reference: '§1 Skolbibliotekens ändamål' },
    { id: 'dem-13', text: 'Tillgängliggör fysisk/kognitiv miljö och rutiner.', pillarId: 'democracy', minLevel: 2, maxLevel: 6, reference: '§2 Personal och lokal; §4' },
    { id: 'dem-14', text: 'Riktade insatser för prioriterade grupper.', pillarId: 'democracy', minLevel: 1, maxLevel: 9, reference: '§4 Prioriterade grupper' },
    { id: 'dem-15', text: 'Återskapa och granska debattdiagram.', pillarId: 'democracy', minLevel: 7, maxLevel: 9, reference: '§1 Skolbibliotekens ändamål' },
    { id: 'dem-16', text: 'Följ upp delaktighet i SKA.', pillarId: 'democracy', minLevel: 8, maxLevel: 9, reference: '§3 Integrering i undervisningen' }
  ]
};
