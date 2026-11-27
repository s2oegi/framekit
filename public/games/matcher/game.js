const CATALOG = [
  // Magyarország
  { id: "hu-valmar", country: "hu", artist: "VALMAR", song: "Úristen", genre: "pop" },
  { id: "hu-dzsudlo", country: "hu", artist: "Dzsúdló", song: "Ha meghalok", genre: "pop" },
  { id: "hu-carson", country: "hu", artist: "Carson Coma", song: "Pók", genre: "pop" },
  { id: "hu-wellhello", country: "hu", artist: "Wellhello", song: "Rakpart", genre: "pop" },
  { id: "hu-manuel", country: "hu", artist: "Manuel", song: "3 Nap", genre: "pop" },
  { id: "hu-margaret", country: "hu", artist: "Margaret Island", song: "Eső", genre: "pop" },
  { id: "hu-analog", country: "hu", artist: "Analog Balaton", song: "Féreg", genre: "pop" },
  { id: "hu-ftf", country: "hu", artist: "Follow The Flow", song: "Nem tudja senki", genre: "pop" },
  { id: "hu-honeybeast", country: "hu", artist: "Honeybeast", song: "Egyedül", genre: "pop" },
  { id: "hu-blaha", country: "hu", artist: "Blahalouisiana", song: "Ha élni felejtek", genre: "pop" },
  { id: "hu-majka", country: "hu", artist: "Majka", song: "Belehalok", genre: "pop" },
  { id: "hu-byealex", country: "hu", artist: "ByeAlex", song: "Kedvesem", genre: "pop" },
  { id: "hu-azahriah", country: "hu", artist: "Azahriah", song: "Introvertált dal", genre: "rap" },
  { id: "hu-desh", country: "hu", artist: "DESH", song: "Kukásautó", genre: "rap" },
  { id: "hu-beton", country: "hu", artist: "Beton.Hofi", song: "Bagira", genre: "rap" },
  { id: "hu-pogany", country: "hu", artist: "Pogány Induló", song: "Zártosztály", genre: "rap" },
  { id: "hu-krubi", country: "hu", artist: "Krúbi", song: "BÁMM", genre: "rap" },
  { id: "hu-tdanny", country: "hu", artist: "T. Danny", song: "Megmondtam", genre: "rap" },
  { id: "hu-youngfly", country: "hu", artist: "Young Fly", song: "24 karát", genre: "rap" },
  { id: "hu-kkevin", country: "hu", artist: "Kkevin", song: "Csavargó", genre: "rap" },
  { id: "hu-lilfrakk", country: "hu", artist: "Lil Frakk", song: "Django", genre: "rap" },
  { id: "hu-ekhoe", country: "hu", artist: "Ekhoe", song: "Costa Rica", genre: "rap" },
  { id: "hu-bsw", country: "hu", artist: "BSW", song: "Rollercoaster", genre: "rap" },
  { id: "hu-bruno", country: "hu", artist: "Bruno X Spacc", song: "Budán vagy Pesten", genre: "rap" },
  { id: "hu-omega", country: "hu", artist: "Omega", song: "Gyöngyhajú lány", genre: "rock" },
  { id: "hu-illes", country: "hu", artist: "Illés", song: "Az utcán", genre: "rock" },
  { id: "hu-lgt", country: "hu", artist: "Locomotiv GT", song: "Ringasd el magad", genre: "rock" },
  { id: "hu-edda", country: "hu", artist: "Edda Művek", song: "Kölyköd voltam", genre: "rock" },
  { id: "hu-tankcsapda", country: "hu", artist: "Tankcsapda", song: "Ez az a ház", genre: "rock" },
  { id: "hu-quimby", country: "hu", artist: "Quimby", song: "Most múlik pontosan", genre: "rock" },
  { id: "hu-bikini", country: "hu", artist: "Bikini", song: "Nehéz a dolga", genre: "rock" },
  { id: "hu-republic", country: "hu", artist: "Republic", song: "A 67-es út", genre: "rock" },
  { id: "hu-beatrice", country: "hu", artist: "Beatrice", song: "Gyere kislány gyere", genre: "rock" },
  { id: "hu-pmobil", country: "hu", artist: "P. Mobil", song: "Menj tovább", genre: "rock" },
  { id: "hu-hobo", country: "hu", artist: "Hobo Blues Band", song: "Kőbánya blues", genre: "rock" },
  { id: "hu-kispal", country: "hu", artist: "Kispál és a Borz", song: "Sika, kasza, léc", genre: "rock" },
  { id: "hu-ivan", country: "hu", artist: "Ivan & The Parazol", song: "Grand Club", genre: "indie" },
  { id: "hu-thirtyy", country: "hu", artist: "30Y", song: "Bogozd ki", genre: "indie" },
  { id: "hu-platon", country: "hu", artist: "Platon Karataev", song: "Ocean", genre: "indie" },
  { id: "hu-elefant", country: "hu", artist: "Elefánt", song: "Magányos", genre: "indie" },
  { id: "hu-fran", country: "hu", artist: "Fran Palermo", song: "Arizona", genre: "indie" },
  { id: "hu-vadfruttik", country: "hu", artist: "Vad Fruttik", song: "Nekem senkim sincsen", genre: "indie" },
  { id: "hu-esti", country: "hu", artist: "Esti Kornél", song: "Félhomály", genre: "indie" },
  { id: "hu-qualitons", country: "hu", artist: "The Qualitons", song: "Zöld-sárga", genre: "indie" },
  { id: "hu-ambersmith", country: "hu", artist: "Amber Smith", song: "Sea Eyes", genre: "indie" },
  { id: "hu-supernem", country: "hu", artist: "Supernem", song: "Tudományos Fantasztikus Pop", genre: "indie" },
  { id: "hu-hs7", country: "hu", artist: "Heaven Street Seven", song: "Tudom, hogy szeretsz titokban", genre: "indie" },
  { id: "hu-mhu", country: "hu", artist: "Magashegyi Underground", song: "Szeplős váll", genre: "indie" },

  // Anglia / UK
  { id: "uk-adele", country: "uk", artist: "Adele", song: "Someone Like You", genre: "pop" },
  { id: "uk-edsheeran", country: "uk", artist: "Ed Sheeran", song: "Shape of You", genre: "pop" },
  { id: "uk-harry", country: "uk", artist: "Harry Styles", song: "As It Was", genre: "pop" },
  { id: "uk-samsmith", country: "uk", artist: "Sam Smith", song: "Stay With Me", genre: "pop" },
  { id: "uk-dualipa", country: "uk", artist: "Dua Lipa", song: "Don't Start Now", genre: "pop" },
  { id: "uk-capaldi", country: "uk", artist: "Lewis Capaldi", song: "Someone You Loved", genre: "pop" },
  { id: "uk-ellie", country: "uk", artist: "Ellie Goulding", song: "Burn", genre: "pop" },
  { id: "uk-georgeezra", country: "uk", artist: "George Ezra", song: "Shotgun", genre: "pop" },
  { id: "uk-jessieglynne", country: "uk", artist: "Jess Glynne", song: "Hold My Hand", genre: "pop" },
  { id: "uk-jessiej", country: "uk", artist: "Jessie J", song: "Price Tag", genre: "pop" },
  { id: "uk-onedirection", country: "uk", artist: "One Direction", song: "What Makes You Beautiful", genre: "pop" },
  { id: "uk-calvin", country: "uk", artist: "Calvin Harris", song: "Feel So Close", genre: "pop" },
  { id: "uk-stormzy", country: "uk", artist: "Stormzy", song: "Vossi Bop", genre: "rap" },
  { id: "uk-dave", country: "uk", artist: "Dave", song: "Location", genre: "rap" },
  { id: "uk-centralcee", country: "uk", artist: "Central Cee", song: "Doja", genre: "rap" },
  { id: "uk-skepta", country: "uk", artist: "Skepta", song: "Shutdown", genre: "rap" },
  { id: "uk-dizzee", country: "uk", artist: "Dizzee Rascal", song: "Bonkers", genre: "rap" },
  { id: "uk-littlesimz", country: "uk", artist: "Little Simz", song: "Woman", genre: "rap" },
  { id: "uk-ajtracey", country: "uk", artist: "AJ Tracey", song: "Ladbroke Grove", genre: "rap" },
  { id: "uk-jhus", country: "uk", artist: "J Hus", song: "Did You See", genre: "rap" },
  { id: "uk-diggad", country: "uk", artist: "Digga D", song: "Woi", genre: "rap" },
  { id: "uk-headie", country: "uk", artist: "Headie One", song: "Ain't It Different", genre: "rap" },
  { id: "uk-giggs", country: "uk", artist: "Giggs", song: "Talkin the Hardest", genre: "rap" },
  { id: "uk-wiley", country: "uk", artist: "Wiley", song: "Wearing My Rolex", genre: "rap" },
  { id: "uk-beatles", country: "uk", artist: "The Beatles", song: "Hey Jude", genre: "rock" },
  { id: "uk-queen", country: "uk", artist: "Queen", song: "Bohemian Rhapsody", genre: "rock" },
  { id: "uk-stones", country: "uk", artist: "The Rolling Stones", song: "Paint It Black", genre: "rock" },
  { id: "uk-zeppelin", country: "uk", artist: "Led Zeppelin", song: "Whole Lotta Love", genre: "rock" },
  { id: "uk-floyd", country: "uk", artist: "Pink Floyd", song: "Another Brick in the Wall", genre: "rock" },
  { id: "uk-clash", country: "uk", artist: "The Clash", song: "London Calling", genre: "rock" },
  { id: "uk-oasis", country: "uk", artist: "Oasis", song: "Wonderwall", genre: "rock" },
  { id: "uk-blur", country: "uk", artist: "Blur", song: "Song 2", genre: "rock" },
  { id: "uk-radiohead", country: "uk", artist: "Radiohead", song: "Creep", genre: "rock" },
  { id: "uk-bowie", country: "uk", artist: "David Bowie", song: "Heroes", genre: "rock" },
  { id: "uk-who", country: "uk", artist: "The Who", song: "My Generation", genre: "rock" },
  { id: "uk-arctic", country: "uk", artist: "Arctic Monkeys", song: "Do I Wanna Know?", genre: "rock" },
  { id: "uk-smiths", country: "uk", artist: "The Smiths", song: "There Is a Light That Never Goes Out", genre: "indie" },
  { id: "uk-joydivision", country: "uk", artist: "Joy Division", song: "Love Will Tear Us Apart", genre: "indie" },
  { id: "uk-cure", country: "uk", artist: "The Cure", song: "Just Like Heaven", genre: "indie" },
  { id: "uk-pulp", country: "uk", artist: "Pulp", song: "Common People", genre: "indie" },
  { id: "uk-stonesroses", country: "uk", artist: "The Stone Roses", song: "She Bangs the Drums", genre: "indie" },
  { id: "uk-franz", country: "uk", artist: "Franz Ferdinand", song: "Take Me Out", genre: "indie" },
  { id: "uk-florence", country: "uk", artist: "Florence + The Machine", song: "Dog Days Are Over", genre: "indie" },
  { id: "uk-1975", country: "uk", artist: "The 1975", song: "Chocolate", genre: "indie" },
  { id: "uk-foals", country: "uk", artist: "Foals", song: "My Number", genre: "indie" },
  { id: "uk-altj", country: "uk", artist: "Alt-J", song: "Breezeblocks", genre: "indie" },
  { id: "uk-glassanimals", country: "uk", artist: "Glass Animals", song: "Heat Waves", genre: "indie" },
  { id: "uk-wetleg", country: "uk", artist: "Wet Leg", song: "Chaise Longue", genre: "indie" },

  // USA
  { id: "us-taylor", country: "us", artist: "Taylor Swift", song: "Shake It Off", genre: "pop" },
  { id: "us-billie", country: "us", artist: "Billie Eilish", song: "bad guy", genre: "pop" },
  { id: "us-bruno", country: "us", artist: "Bruno Mars", song: "24K Magic", genre: "pop" },
  { id: "us-gaga", country: "us", artist: "Lady Gaga", song: "Bad Romance", genre: "pop" },
  { id: "us-beyonce", country: "us", artist: "Beyoncé", song: "Single Ladies", genre: "pop" },
  { id: "us-ariana", country: "us", artist: "Ariana Grande", song: "thank u, next", genre: "pop" },
  { id: "us-katy", country: "us", artist: "Katy Perry", song: "Firework", genre: "pop" },
  { id: "us-madonna", country: "us", artist: "Madonna", song: "Like a Prayer", genre: "pop" },
  { id: "us-britney", country: "us", artist: "Britney Spears", song: "Baby One More Time", genre: "pop" },
  { id: "us-mj", country: "us", artist: "Michael Jackson", song: "Billie Jean", genre: "pop" },
  { id: "us-olivia", country: "us", artist: "Olivia Rodrigo", song: "drivers license", genre: "pop" },
  { id: "us-justin", country: "us", artist: "Justin Timberlake", song: "Can't Stop the Feeling!", genre: "pop" },
  { id: "us-eminem", country: "us", artist: "Eminem", song: "Lose Yourself", genre: "rap" },
  { id: "us-kendrick", country: "us", artist: "Kendrick Lamar", song: "HUMBLE.", genre: "rap" },
  { id: "us-jayz", country: "us", artist: "Jay-Z", song: "99 Problems", genre: "rap" },
  { id: "us-kanye", country: "us", artist: "Kanye West", song: "Stronger", genre: "rap" },
  { id: "us-travis", country: "us", artist: "Travis Scott", song: "SICKO MODE", genre: "rap" },
  { id: "us-nicki", country: "us", artist: "Nicki Minaj", song: "Super Bass", genre: "rap" },
  { id: "us-snoop", country: "us", artist: "Snoop Dogg", song: "Drop It Like It's Hot", genre: "rap" },
  { id: "us-dre", country: "us", artist: "Dr. Dre", song: "Still D.R.E.", genre: "rap" },
  { id: "us-50cent", country: "us", artist: "50 Cent", song: "In Da Club", genre: "rap" },
  { id: "us-lilnasx", country: "us", artist: "Lil Nas X", song: "Old Town Road", genre: "rap" },
  { id: "us-cardib", country: "us", artist: "Cardi B", song: "Bodak Yellow", genre: "rap" },
  { id: "us-outkast", country: "us", artist: "OutKast", song: "Hey Ya!", genre: "rap" },
  { id: "us-nirvana", country: "us", artist: "Nirvana", song: "Smells Like Teen Spirit", genre: "rock" },
  { id: "us-gnr", country: "us", artist: "Guns N' Roses", song: "Sweet Child O' Mine", genre: "rock" },
  { id: "us-metallica", country: "us", artist: "Metallica", song: "Enter Sandman", genre: "rock" },
  { id: "us-pearljam", country: "us", artist: "Pearl Jam", song: "Alive", genre: "rock" },
  { id: "us-foo", country: "us", artist: "Foo Fighters", song: "Everlong", genre: "rock" },
  { id: "us-rhcp", country: "us", artist: "Red Hot Chili Peppers", song: "Californication", genre: "rock" },
  { id: "us-greenday", country: "us", artist: "Green Day", song: "Basket Case", genre: "rock" },
  { id: "us-whitestripes", country: "us", artist: "The White Stripes", song: "Seven Nation Army", genre: "rock" },
  { id: "us-aerosmith", country: "us", artist: "Aerosmith", song: "I Don't Want to Miss a Thing", genre: "rock" },
  { id: "us-bonjovi", country: "us", artist: "Bon Jovi", song: "Livin' on a Prayer", genre: "rock" },
  { id: "us-springsteen", country: "us", artist: "Bruce Springsteen", song: "Born in the U.S.A.", genre: "rock" },
  { id: "us-kiss", country: "us", artist: "Kiss", song: "I Was Made for Lovin' You", genre: "rock" },
  { id: "us-strokes", country: "us", artist: "The Strokes", song: "Last Nite", genre: "indie" },
  { id: "us-vampire", country: "us", artist: "Vampire Weekend", song: "A-Punk", genre: "indie" },
  { id: "us-lcd", country: "us", artist: "LCD Soundsystem", song: "Daft Punk Is Playing at My House", genre: "indie" },
  { id: "us-modestmouse", country: "us", artist: "Modest Mouse", song: "Float On", genre: "indie" },
  { id: "us-mgmt", country: "us", artist: "MGMT", song: "Kids", genre: "indie" },
  { id: "us-beachhouse", country: "us", artist: "Beach House", song: "Space Song", genre: "indie" },
  { id: "us-sufjan", country: "us", artist: "Sufjan Stevens", song: "Chicago", genre: "indie" },
  { id: "us-phoebe", country: "us", artist: "Phoebe Bridgers", song: "Motion Sickness", genre: "indie" },
  { id: "us-boniver", country: "us", artist: "Bon Iver", song: "Skinny Love", genre: "indie" },
  { id: "us-national", country: "us", artist: "The National", song: "Bloodbuzz Ohio", genre: "indie" },
  { id: "us-foster", country: "us", artist: "Foster the People", song: "Pumped Up Kicks", genre: "indie" },
  { id: "us-walkthemoon", country: "us", artist: "Walk the Moon", song: "Shut Up and Dance", genre: "indie" },

  // Franciaország
  { id: "fr-indila", country: "fr", artist: "Indila", song: "Dernière danse", genre: "pop" },
  { id: "fr-zaz", country: "fr", artist: "Zaz", song: "Je veux", genre: "pop" },
  { id: "fr-louane", country: "fr", artist: "Louane", song: "Jour 1", genre: "pop" },
  { id: "fr-mylene", country: "fr", artist: "Mylène Farmer", song: "Désenchantée", genre: "pop" },
  { id: "fr-vanessa", country: "fr", artist: "Vanessa Paradis", song: "Joe le taxi", genre: "pop" },
  { id: "fr-piaf", country: "fr", artist: "Édith Piaf", song: "La Vie en rose", genre: "pop" },
  { id: "fr-dassin", country: "fr", artist: "Joe Dassin", song: "Les Champs-Élysées", genre: "pop" },
  { id: "fr-carla", country: "fr", artist: "Carla Bruni", song: "Quelqu'un m'a dit", genre: "pop" },
  { id: "fr-christine", country: "fr", artist: "Christine and the Queens", song: "Tilted", genre: "pop" },
  { id: "fr-aya", country: "fr", artist: "Aya Nakamura", song: "Djadja", genre: "pop" },
  { id: "fr-daft", country: "fr", artist: "Daft Punk", song: "Get Lucky", genre: "pop" },
  { id: "fr-patrick", country: "fr", artist: "Patrick Bruel", song: "Place des grands hommes", genre: "pop" },
  { id: "fr-pnl", country: "fr", artist: "PNL", song: "Au DD", genre: "rap" },
  { id: "fr-orelsan", country: "fr", artist: "Orelsan", song: "Basique", genre: "rap" },
  { id: "fr-booba", country: "fr", artist: "Booba", song: "DKR", genre: "rap" },
  { id: "fr-niska", country: "fr", artist: "Niska", song: "Réseaux", genre: "rap" },
  { id: "fr-jul", country: "fr", artist: "Jul", song: "Tchikita", genre: "rap" },
  { id: "fr-sch", country: "fr", artist: "SCH", song: "A7", genre: "rap" },
  { id: "fr-ninho", country: "fr", artist: "Ninho", song: "Jefe", genre: "rap" },
  { id: "fr-kaaris", country: "fr", artist: "Kaaris", song: "Zoo", genre: "rap" },
  { id: "fr-mhd", country: "fr", artist: "MHD", song: "Afro Trap Pt. 3", genre: "rap" },
  { id: "fr-lomepal", country: "fr", artist: "Lomepal", song: "Trop beau", genre: "rap" },
  { id: "fr-mcsolaar", country: "fr", artist: "MC Solaar", song: "Caroline", genre: "rap" },
  { id: "fr-nekfeu", country: "fr", artist: "Nekfeu", song: "Égérie", genre: "rap" },
  { id: "fr-telephone", country: "fr", artist: "Téléphone", song: "Un autre monde", genre: "rock" },
  { id: "fr-noirdesir", country: "fr", artist: "Noir Désir", song: "Le vent nous portera", genre: "rock" },
  { id: "fr-indochine", country: "fr", artist: "Indochine", song: "L'Aventurier", genre: "rock" },
  { id: "fr-trust", country: "fr", artist: "Trust", song: "Antisocial", genre: "rock" },
  { id: "fr-louiseattaque", country: "fr", artist: "Louise Attaque", song: "J't'emmène au vent", genre: "rock" },
  { id: "fr-dionysos", country: "fr", artist: "Dionysos", song: "Song for Jedi", genre: "rock" },
  { id: "fr-phoenix", country: "fr", artist: "Phoenix", song: "1901", genre: "rock" },
  { id: "fr-manonegra", country: "fr", artist: "Mano Negra", song: "Mala Vida", genre: "rock" },
  { id: "fr-bbbrunes", country: "fr", artist: "BB Brunes", song: "Dis-moi", genre: "rock" },
  { id: "fr-gojira", country: "fr", artist: "Gojira", song: "Flying Whales", genre: "rock" },
  { id: "fr-shaka", country: "fr", artist: "Shaka Ponk", song: "I'm Picky", genre: "rock" },
  { id: "fr-rita", country: "fr", artist: "Les Rita Mitsouko", song: "Marcia Baila", genre: "rock" },
  { id: "fr-air", country: "fr", artist: "Air", song: "Sexy Boy", genre: "indie" },
  { id: "fr-justice", country: "fr", artist: "Justice", song: "D.A.N.C.E.", genre: "indie" },
  { id: "fr-imperatrice", country: "fr", artist: "L'Impératrice", song: "Agitations tropicales", genre: "indie" },
  { id: "fr-fishbach", country: "fr", artist: "Fishbach", song: "Un autre que moi", genre: "indie" },
  { id: "fr-feu", country: "fr", artist: "Feu! Chatterton", song: "La Malinche", genre: "indie" },
  { id: "fr-agar", country: "fr", artist: "Agar Agar", song: "Prettiest Virgin", genre: "indie" },
  { id: "fr-videoclub", country: "fr", artist: "Videoclub", song: "Amour plastique", genre: "indie" },
  { id: "fr-m83", country: "fr", artist: "M83", song: "Midnight City", genre: "indie" },
  { id: "fr-kavinsky", country: "fr", artist: "Kavinsky", song: "Nightcall", genre: "indie" },
  { id: "fr-breakbot", country: "fr", artist: "Breakbot", song: "Baby I'm Yours", genre: "indie" },
  { id: "fr-polo", country: "fr", artist: "Polo & Pan", song: "Canopée", genre: "indie" },
  { id: "fr-petitbiscuit", country: "fr", artist: "Petit Biscuit", song: "Sunset Lover", genre: "indie" },
].concat(typeof CATALOG_EXTRA !== "undefined" ? CATALOG_EXTRA : [])
  .concat(typeof CATALOG_EUROPE !== "undefined" ? CATALOG_EUROPE : [])
  .concat(typeof CATALOG_AFRICA !== "undefined" ? CATALOG_AFRICA : [])
  .concat(typeof CATALOG_AMERICAS !== "undefined" ? CATALOG_AMERICAS : [])
  .concat(typeof CATALOG_ASIA !== "undefined" ? CATALOG_ASIA : [])
  .concat(typeof CATALOG_OCEANIA !== "undefined" ? CATALOG_OCEANIA : [])
  .concat(typeof CATALOG_MICRO !== "undefined" ? CATALOG_MICRO : []);

const DIFFICULTY = {
  easy: { pairs: 6, columns: 4 },
  medium: { pairs: 8, columns: 4 },
  hard: { pairs: 12, columns: 6 },
};

const menuScreen = document.getElementById("menu-screen");
const gameScreen = document.getElementById("game-screen");
const setupForm = document.getElementById("setup-form");
const boardEl = document.getElementById("board");
const movesEl = document.getElementById("moves");
const timerEl = document.getElementById("timer");
const matchesEl = document.getElementById("matches");
const comboEl = document.getElementById("combo");
const comboStatEl = document.getElementById("stat-combo");
const comboBurstEl = document.getElementById("combo-burst");
const comboBurstValueEl = document.getElementById("combo-burst-value");
const pairTotalEl = document.getElementById("pair-total");
const gameModeEl = document.getElementById("game-mode");
const overlayEl = document.getElementById("overlay");
const winCopyEl = document.getElementById("win-copy");
const winKickerEl = document.getElementById("win-kicker");
const winTitleEl = document.getElementById("win-title");
const restartBtn = document.getElementById("restart");
const playAgainBtn = document.getElementById("play-again");
const shareDailyBtn = document.getElementById("share-daily");
const dailyBtn = document.getElementById("daily-btn");
const dailyBestEl = document.getElementById("daily-best");
const scoresBtn = document.getElementById("scores-btn");
const howtoBtn = document.getElementById("howto-btn");
const tutorialOverlayEl = document.getElementById("tutorial-overlay");
const tutorialStageEl = document.getElementById("tutorial-stage");
const tutorialTitleEl = document.getElementById("tutorial-title");
const tutorialCopyEl = document.getElementById("tutorial-copy");
const tutorialDotsEl = document.getElementById("tutorial-dots");
const tutorialNextBtn = document.getElementById("tutorial-next");
const tutorialBackBtn = document.getElementById("tutorial-back");
const tutorialSkipBtn = document.getElementById("tutorial-skip");
const scoresOverlayEl = document.getElementById("scores-overlay");
const scoresListEl = document.getElementById("scores-list");
const scoresEmptyEl = document.getElementById("scores-empty");
const scoresSubtitleEl = document.getElementById("scores-subtitle");
const scoresDiffEl = document.getElementById("scores-diff");
const scoresCloseBtn = document.getElementById("scores-close");
const winRankEl = document.getElementById("win-rank");
const backMenuBtn = document.getElementById("back-menu");
const winMenuBtn = document.getElementById("win-menu");
const countryChipsEl = document.getElementById("country-chips");
const continentChipsEl = document.getElementById("continent-chips");
const matchToastEl = document.getElementById("match-toast");
const matchToastCloseBtn = document.getElementById("match-toast-close");
const matchCoverEl = document.getElementById("match-cover");
const matchCoverFallbackEl = document.getElementById("match-cover-fallback");
const matchTitleEl = document.getElementById("match-title");
const matchArtistEl = document.getElementById("match-artist");
const matchExplicitBadgeEl = document.getElementById("match-explicit-badge");
const matchRefrainLabelEl = document.getElementById("match-refrain-label");
const matchRefrainEl = document.getElementById("match-refrain");
const matchEqEl = document.getElementById("match-eq");
const matchEqStageEl = document.getElementById("match-eq-stage");
const matchKickerEl = document.getElementById("match-kicker");
const menuSteps = [...setupForm.querySelectorAll(".menu-step")];
const stepDots = [...setupForm.querySelectorAll(".step-dots li")];

const PREVIEW_MS = 4500;
const PREVIEW_FADE_MS = 1400;
const PREVIEW_TARGET_VOLUME = 0.72;
const SNIPPET_MS = 1800;
const SNIPPET_FADE_MS = 140;
const SNIPPET_VOLUME = 0.62;
const mediaCache = new Map();
const explicitCache = new Map();
const previewAudio = new Audio();
previewAudio.preload = "auto";
const unlockTone = new Audio(
  "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA="
);
unlockTone.preload = "auto";
unlockTone.volume = 0.001;

/** Normalized (accent-stripped, lowercase) tokens censored when Explicit is Off. */
const SWEAR_TOKENS = new Set([
  "fuck",
  "fucking",
  "fucker",
  "fucked",
  "fuckin",
  "motherfucker",
  "motherfucking",
  "shit",
  "shitty",
  "bullshit",
  "bitch",
  "bitches",
  "asshole",
  "assholes",
  "bastard",
  "bastards",
  "dick",
  "dicks",
  "cock",
  "cocks",
  "pussy",
  "cunt",
  "cunts",
  "whore",
  "whores",
  "slut",
  "sluts",
  "nigga",
  "nigger",
  "faggot",
  "fag",
  "kurva",
  "kurvak",
  "basz",
  "baszd",
  "baszni",
  "baszott",
  "kibaszott",
  "bassza",
  "baszdmeg",
  "baszmeg",
  "fasz",
  "faszom",
  "faszok",
  "faszokat",
  "geci",
  "gecibe",
  "gecis",
  "picsa",
  "picsaba",
  "szar",
  "szaros",
  "buzi",
  "ribanc",
  "anyad",
  "anyadat",
  "kocsog",
  "lofasz",
  "lofaszt",
  "szopj",
  "szopni",
  "szopas",
]);

let activePairs = [];
let flipped = [];
let lock = false;
let moves = 0;
let matches = 0;
let streak = 0;
let bestStreak = 0;
let comboBurstTimer = null;
let startedAt = null;
let timerId = null;
let flipTimers = [];
let menuStep = 1;
let startGameGen = 0;
let settings = {
  continent: "northamerica",
  country: "us",
  genre: "mix",
  difficulty: "medium",
  explicit: false,
  snippets: true,
  daily: false,
  dailyKey: "",
  seed: null,
};
let mediaAbort = null;
let snippetAbort = null;
let snippetGen = 0;
let previewPlayGen = 0;
let previewStopTimer = null;
let previewReadyHandler = null;
let audioUnlocked = false;
let matchToastHideTimer = null;
let beepTimerIds = [];
let audioCtx = null;
let previewFadeRaf = null;
let previewTargetVolume = PREVIEW_TARGET_VOLUME;
let previewOwner = null;
let allowMatchClip = false;

function continentOf(country) {
  return CONTINENTS.find((c) => c.countries.includes(country))?.id || CONTINENTS[0].id;
}

function countriesForContinent(continentId) {
  const continent = CONTINENTS.find((c) => c.id === continentId) || CONTINENTS[0];
  return continent.countries.filter((code) => COUNTRY_ORDER.includes(code));
}

function shuffle(items, random = Math.random) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function hashSeed(text) {
  let hash = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function mulberry32(seed) {
  let a = seed >>> 0;
  return function random() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function todayKey() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function dailyStorageKey(dateKey = todayKey()) {
  return `matcher-daily-best:${dateKey}`;
}

function readDailyBest(dateKey = todayKey()) {
  try {
    const raw = localStorage.getItem(dailyStorageKey(dateKey));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed.moves !== "number" || typeof parsed.timeMs !== "number") {
      return null;
    }
    return parsed;
  } catch (_) {
    return null;
  }
}

function saveDailyBest(result) {
  const key = result.dailyKey || todayKey();
  const prev = readDailyBest(key);
  const better =
    !prev ||
    result.moves < prev.moves ||
    (result.moves === prev.moves && result.timeMs < prev.timeMs);
  if (!better) return prev;
  const next = {
    moves: result.moves,
    timeMs: result.timeMs,
    bestStreak: result.bestStreak || 0,
    country: result.country,
    genre: result.genre,
  };
  try {
    localStorage.setItem(dailyStorageKey(key), JSON.stringify(next));
  } catch (_) {
    /* ignore quota */
  }
  return next;
}

function updateDailyBestLabel() {
  if (!dailyBestEl) return;
  const best = readDailyBest();
  if (!best) {
    dailyBestEl.hidden = true;
    dailyBestEl.textContent = "";
    return;
  }
  dailyBestEl.hidden = false;
  dailyBestEl.textContent = t("dailyBest", {
    moves: best.moves,
    time: formatTime(best.timeMs),
  });
}

/** Core catalogs only — micro filler countries made daily feel random/broken. */
const DAILY_COUNTRY_POOL = [
  "us",
  "uk",
  "hu",
  "fr",
  "de",
  "it",
  "es",
  "pt",
  "pl",
  "nl",
  "se",
  "cn",
  "jp",
  "kr",
  "in",
];

function eligibleDailyCountries(minPairs) {
  const counts = new Map();
  CATALOG.forEach((pair) => {
    counts.set(pair.country, (counts.get(pair.country) || 0) + 1);
  });
  return DAILY_COUNTRY_POOL.filter((code) => (counts.get(code) || 0) >= minPairs);
}

function createDailySettings(explicit, snippets = true) {
  const dailyKey = todayKey();
  const metaRand = mulberry32(hashSeed(`matcher|daily|meta|${dailyKey}`));
  const boardSeed = hashSeed(`matcher|daily|board|${dailyKey}`);
  const need = DIFFICULTY.medium.pairs;
  const countries = eligibleDailyCountries(need);
  const pool = countries.length ? countries : ["us", "uk", "hu", "fr"];
  const country = pool[Math.floor(metaRand() * pool.length)];
  const genres = ["mix", "pop", "rap", "rock", "indie"];
  let genre = genres[Math.floor(metaRand() * genres.length)];
  if (genre !== "mix") {
    const themed = CATALOG.filter((pair) => pair.country === country && pair.genre === genre);
    if (themed.length < need) genre = "mix";
  }
  return {
    continent: continentOf(country),
    country,
    genre,
    difficulty: "medium",
    explicit: Boolean(explicit),
    snippets: Boolean(snippets),
    daily: true,
    dailyKey,
    seed: boardSeed,
  };
}

function formExplicitOn() {
  return setupForm.querySelector('input[name="explicit"]:checked')?.value === "on";
}

function formSnippetsOn() {
  return setupForm.querySelector('input[name="snippets"]:checked')?.value !== "off";
}

const SCORES_KEY = "matcher-scores-v1";
const SCORE_LIMIT = 8;
let scoresViewDaily = false;
let lastScoreRecord = null;

function scoreBoardKey({ daily = false, dailyKey = "", country, difficulty }) {
  if (daily) return `daily:${dailyKey || todayKey()}`;
  return `play:${country}:${difficulty}`;
}

function compareScores(a, b) {
  if (a.moves !== b.moves) return a.moves - b.moves;
  if (a.timeMs !== b.timeMs) return a.timeMs - b.timeMs;
  if ((b.bestStreak || 0) !== (a.bestStreak || 0)) {
    return (b.bestStreak || 0) - (a.bestStreak || 0);
  }
  // Newer equal runs stay on top for display, without counting as a new best.
  return (b.at || 0) - (a.at || 0);
}

function isStrictlyBetter(entry, prev) {
  if (!prev) return true;
  if (entry.moves !== prev.moves) return entry.moves < prev.moves;
  if (entry.timeMs !== prev.timeMs) return entry.timeMs < prev.timeMs;
  return (entry.bestStreak || 0) > (prev.bestStreak || 0);
}

function readAllScores() {
  try {
    const raw = localStorage.getItem(SCORES_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch (_) {
    return {};
  }
}

function writeAllScores(all) {
  try {
    localStorage.setItem(SCORES_KEY, JSON.stringify(all));
  } catch (_) {
    /* ignore quota */
  }
}

function listScores(key) {
  const all = readAllScores();
  return Array.isArray(all[key]) ? all[key] : [];
}

function recordScore(result) {
  const key = scoreBoardKey(result);
  const all = readAllScores();
  const list = Array.isArray(all[key]) ? [...all[key]] : [];
  const prevBest = list[0] || null;
  const entry = {
    moves: result.moves,
    timeMs: result.timeMs,
    bestStreak: result.bestStreak || 0,
    country: result.country,
    genre: result.genre || "mix",
    difficulty: result.difficulty,
    daily: Boolean(result.daily),
    at: Date.now(),
  };
  list.push(entry);
  list.sort(compareScores);
  const rank = list.indexOf(entry) + 1;
  all[key] = list.slice(0, SCORE_LIMIT);
  writeAllScores(all);
  return {
    rank,
    isBest: rank === 1 && isStrictlyBetter(entry, prevBest),
    kept: rank > 0 && rank <= SCORE_LIMIT,
    list: all[key],
  };
}

function currentScoresKey() {
  if (scoresViewDaily) {
    return scoreBoardKey({ daily: true, dailyKey: todayKey() });
  }
  const country =
    setupForm.querySelector('input[name="country"]:checked')?.value ||
    settings.country ||
    "us";
  const difficulty =
    scoresDiffEl?.querySelector('input[name="scores-diff"]:checked')?.value ||
    setupForm.querySelector('input[name="difficulty"]:checked')?.value ||
    "medium";
  return scoreBoardKey({ daily: false, country, difficulty });
}

function renderScoresList() {
  if (!scoresListEl || !scoresEmptyEl) return;
  const country =
    setupForm.querySelector('input[name="country"]:checked')?.value ||
    settings.country ||
    "us";
  const difficulty =
    scoresDiffEl?.querySelector('input[name="scores-diff"]:checked')?.value ||
    "medium";
  if (scoresSubtitleEl) {
    scoresSubtitleEl.textContent = scoresViewDaily
      ? t("scoresDailyHeader", { date: todayKey() })
      : t("scoresHeader", {
          country: t(`countries.${country}`),
          difficulty: t(difficulty),
        });
  }
  if (scoresDiffEl) scoresDiffEl.hidden = scoresViewDaily;
  document.querySelectorAll(".scores-tab").forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.scoresTab === (scoresViewDaily ? "daily" : "play"));
  });

  const rows = listScores(currentScoresKey());
  scoresListEl.innerHTML = rows
    .map((row, index) => {
      const bits = [];
      if (!scoresViewDaily && row.genre) {
        bits.push(escapeHtml(t(row.genre)));
      }
      if (row.bestStreak >= 2) {
        bits.push(escapeHtml(t("scoreCombo", { n: row.bestStreak })));
      }
      const meta = bits.length
        ? `<span class="scores-meta">${bits.join(" · ")}</span>`
        : `<span class="scores-meta"></span>`;
      return `<li>
        <span class="scores-rank">${index + 1}</span>
        <span class="scores-main">${escapeHtml(
          t("scoreRow", { moves: row.moves, time: formatTime(row.timeMs) })
        )}</span>
        ${meta}
      </li>`;
    })
    .join("");
  scoresEmptyEl.hidden = rows.length > 0;
}

function openScores() {
  // Prefer free-play board after a normal run; daily tab after a daily run.
  scoresViewDaily = Boolean(settings.daily && settings.dailyKey);
  const diff =
    setupForm.querySelector('input[name="difficulty"]:checked')?.value ||
    settings.difficulty ||
    "medium";
  const diffInput = scoresDiffEl?.querySelector(`input[name="scores-diff"][value="${diff}"]`);
  if (diffInput) diffInput.checked = true;
  renderScoresList();
  if (scoresOverlayEl) {
    scoresOverlayEl.hidden = false;
    scoresCloseBtn?.focus();
  }
}

function closeScores() {
  if (scoresOverlayEl) scoresOverlayEl.hidden = true;
}

const TUTORIAL_KEY = "matcher-tutorial-v1";
const TUTORIAL_STEPS = 4;
let tutorialStep = 0;

function tutorialSeen() {
  try {
    return localStorage.getItem(TUTORIAL_KEY) === "1";
  } catch (_) {
    return false;
  }
}

function markTutorialSeen() {
  try {
    localStorage.setItem(TUTORIAL_KEY, "1");
  } catch (_) {
    /* ignore */
  }
}

function tutorialStageHtml(step) {
  if (step === 0) {
    return `<div class="tut-pair">
      <div class="tut-card tut-card-artist"><span class="tut-kind" data-tut="artist"></span><span class="tut-label">A</span></div>
      <span class="tut-link" aria-hidden="true"></span>
      <div class="tut-card tut-card-song"><span class="tut-kind" data-tut="song"></span><span class="tut-label">♪</span></div>
    </div>`;
  }
  if (step === 1) {
    return `<div class="tut-board">
      <button type="button" class="tut-mini is-flipped" tabindex="-1" aria-hidden="true"><span></span></button>
      <button type="button" class="tut-mini" tabindex="-1" aria-hidden="true"><span>?</span></button>
      <button type="button" class="tut-mini is-flipped tut-mini-song" tabindex="-1" aria-hidden="true"><span></span></button>
      <button type="button" class="tut-mini" tabindex="-1" aria-hidden="true"><span>?</span></button>
    </div>`;
  }
  if (step === 2) {
    return `<div class="tut-audio">
      <div class="tut-wave" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
      <p class="tut-combo-pill">×3</p>
    </div>`;
  }
  return `<div class="tut-daily">
    <span class="tut-calendar" aria-hidden="true"><em></em><strong>13</strong></span>
    <p class="tut-daily-chip" data-tut="daily"></p>
  </div>`;
}

function renderTutorialStep() {
  if (!tutorialOverlayEl) return;
  const step = tutorialStep;
  if (tutorialStageEl) {
    tutorialStageEl.innerHTML = tutorialStageHtml(step);
    tutorialStageEl.querySelectorAll("[data-tut]").forEach((el) => {
      const key = el.getAttribute("data-tut");
      el.textContent = t(key);
    });
  }
  if (tutorialTitleEl) tutorialTitleEl.textContent = t(`tutorial${step + 1}Title`);
  if (tutorialCopyEl) tutorialCopyEl.textContent = t(`tutorial${step + 1}Body`);
  if (tutorialDotsEl) {
    tutorialDotsEl.innerHTML = Array.from({ length: TUTORIAL_STEPS }, (_, index) => {
      const active = index === step ? " is-active" : index < step ? " is-done" : "";
      return `<li class="${active.trim()}"></li>`;
    }).join("");
  }
  if (tutorialBackBtn) tutorialBackBtn.hidden = step === 0;
  if (tutorialSkipBtn) tutorialSkipBtn.hidden = step >= TUTORIAL_STEPS - 1;
  if (tutorialNextBtn) {
    tutorialNextBtn.textContent = step >= TUTORIAL_STEPS - 1 ? t("tutorialDone") : t("next");
  }
}

function openTutorial(startAt = 0) {
  closeScores();
  tutorialStep = Math.max(0, Math.min(TUTORIAL_STEPS - 1, startAt));
  renderTutorialStep();
  if (tutorialOverlayEl) {
    tutorialOverlayEl.hidden = false;
    tutorialNextBtn?.focus();
  }
}

function closeTutorial(markSeen = true) {
  if (tutorialOverlayEl) tutorialOverlayEl.hidden = true;
  if (markSeen) markTutorialSeen();
}

function maybeShowTutorial() {
  if (!tutorialSeen()) openTutorial(0);
}

function updateWinRank(record) {
  lastScoreRecord = record;
  if (!winRankEl) return;
  if (!record || !record.rank) {
    winRankEl.hidden = true;
    winRankEl.textContent = "";
    return;
  }
  const rankText = t("scoreRank", { n: record.rank });
  if (record.isBest) {
    winRankEl.textContent = `${t("scoreNewBest")} · ${rankText}`;
  } else if (!record.kept) {
    winRankEl.textContent = t("scoreOutside", { n: SCORE_LIMIT });
  } else {
    winRankEl.textContent = rankText;
  }
  winRankEl.hidden = false;
}

function clearFlipTimers() {
  flipTimers.forEach((id) => window.clearTimeout(id));
  flipTimers = [];
}

function later(fn, ms) {
  const id = window.setTimeout(() => {
    flipTimers = flipTimers.filter((timer) => timer !== id);
    fn();
  }, ms);
  flipTimers.push(id);
}

function formatTime(ms) {
  const total = Math.floor(ms / 1000);
  const minutes = Math.floor(total / 60);
  const seconds = String(total % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function updateTimer() {
  if (!startedAt) {
    timerEl.textContent = "0:00";
    return;
  }
  timerEl.textContent = formatTime(Date.now() - startedAt);
}

function startTimer() {
  if (startedAt) return;
  startedAt = Date.now();
  timerId = window.setInterval(updateTimer, 250);
}

function stopTimer() {
  if (timerId) {
    window.clearInterval(timerId);
    timerId = null;
  }
}

function unlockAudio() {
  getAudioCtx();
  if (audioUnlocked) return;

  // iOS gates each HTMLMediaElement separately. Warm both the dedicated
  // unlock tone and previewAudio inside the user gesture.
  let unlocked = false;
  const markUnlocked = () => {
    unlocked = true;
    audioUnlocked = true;
  };

  try {
    unlockTone.volume = 0.001;
    const tonePlay = unlockTone.play();
    if (tonePlay && typeof tonePlay.then === "function") {
      tonePlay
        .then(() => {
          markUnlocked();
          try {
            unlockTone.pause();
            unlockTone.currentTime = 0;
          } catch (_) {
            /* ignore */
          }
        })
        .catch(() => {});
    } else {
      markUnlocked();
    }
  } catch (_) {
    /* ignore */
  }

  const hadSrc = Boolean(previewAudio.getAttribute("src"));
  if (!hadSrc) {
    previewAudio.src = unlockTone.src;
  }
  const warmGen = previewPlayGen;
  try {
    previewAudio.volume = 0;
    const warm = previewAudio.play();
    if (warm && typeof warm.then === "function") {
      warm
        .then(() => {
          markUnlocked();
          // A real clip bumps previewPlayGen / sets previewOwner — do not clobber it.
          if (previewPlayGen !== warmGen || previewOwner) return;
          try {
            previewAudio.pause();
            previewAudio.currentTime = 0;
            if (!hadSrc) {
              previewAudio.removeAttribute("src");
              previewAudio.load();
            }
          } catch (_) {
            /* ignore */
          }
        })
        .catch(() => {});
    } else if (!unlocked) {
      markUnlocked();
    }
  } catch (_) {
    /* ignore */
  }
}

function clearPreviewFade() {
  if (previewFadeRaf) {
    window.cancelAnimationFrame(previewFadeRaf);
    previewFadeRaf = null;
  }
}

function fadePreviewIn(target = PREVIEW_TARGET_VOLUME, durationMs = PREVIEW_FADE_MS) {
  clearPreviewFade();
  previewTargetVolume = target;
  previewAudio.volume = 0;
  const started = performance.now();
  const tick = (now) => {
    const t = Math.min(1, (now - started) / durationMs);
    const eased = 1 - (1 - t) ** 3;
    previewAudio.volume = Math.min(target, target * eased);
    if (t < 1) {
      previewFadeRaf = window.requestAnimationFrame(tick);
    } else {
      previewFadeRaf = null;
      previewAudio.volume = target;
    }
  };
  previewFadeRaf = window.requestAnimationFrame(tick);
}

function clearBeepTimers() {
  beepTimerIds.forEach((id) => window.clearTimeout(id));
  beepTimerIds = [];
}

function stopPreviewAudio() {
  previewPlayGen += 1;
  previewOwner = null;
  clearPreviewFade();
  clearBeepTimers();
  if (previewStopTimer) {
    window.clearTimeout(previewStopTimer);
    previewStopTimer = null;
  }
  if (previewReadyHandler) {
    previewAudio.removeEventListener("loadeddata", previewReadyHandler);
    previewAudio.removeEventListener("canplay", previewReadyHandler);
    previewReadyHandler = null;
  }
  previewAudio.pause();
  previewAudio.volume = 0;
  try {
    previewAudio.currentTime = 0;
  } catch (_) {
    /* ignore */
  }
}

function shouldCensorContent() {
  return !settings.explicit;
}

function tokenLooksLikeSwear(token) {
  const n = normalizeMediaText(token).replace(/[^a-z0-9]/g, "");
  if (!n) return false;
  if (SWEAR_TOKENS.has(n)) return true;
  // Common English stems (avoid short false positives like "ass")
  if (n.startsWith("fuck") || n.startsWith("shit") || n.startsWith("bitch")) return true;
  if (n.startsWith("motherfuck")) return true;
  if (n.startsWith("fasz") || n.startsWith("geci") || n.startsWith("kurva")) return true;
  if (n.startsWith("basz") && n !== "basszus") return true;
  return false;
}

function containsSwear(text) {
  if (!text) return false;
  return String(text)
    .split(/(\s+)/)
    .some((part) => /\S/.test(part) && tokenLooksLikeSwear(part));
}

function censorDisplayHtml(text) {
  const raw = String(text || "");
  if (!shouldCensorContent() || !raw) return escapeHtml(raw);
  return raw
    .split(/(\s+)/)
    .map((part) => {
      if (!/\S/.test(part)) return escapeHtml(part);
      if (!tokenLooksLikeSwear(part)) return escapeHtml(part);
      return `<span class="censor" aria-hidden="true">${escapeHtml(part)}</span>`;
    })
    .join("");
}

function pairNeedsExplicitMark(pair) {
  if (!pair) return false;
  return Boolean(pair.isExplicit) || containsSwear(pair.song);
}

function getAudioCtx() {
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return null;
  if (!audioCtx) audioCtx = new Ctx();
  if (audioCtx.state === "suspended") audioCtx.resume().catch(() => {});
  return audioCtx;
}

function playCensorBeep(durationMs) {
  const ctx = getAudioCtx();
  if (!ctx) return;
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "square";
    osc.frequency.value = 920;
    gain.gain.value = 0.0001;
    osc.connect(gain);
    gain.connect(ctx.destination);
    const now = ctx.currentTime;
    const dur = Math.max(0.12, durationMs / 1000);
    gain.gain.exponentialRampToValueAtTime(0.14, now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);
    osc.start(now);
    osc.stop(now + dur + 0.02);
    previewAudio.volume = Math.min(0.04, previewTargetVolume * 0.08);
    const restoreId = window.setTimeout(() => {
      previewAudio.volume = previewTargetVolume;
    }, durationMs + 30);
    beepTimerIds.push(restoreId);
  } catch (_) {
    /* ignore */
  }
}

function playComboChime(level) {
  const ctx = getAudioCtx();
  if (!ctx) return;
  const notes = [523.25, 659.25, 783.99, 987.77];
  const count = Math.min(4, Math.max(2, level));
  try {
    const now = ctx.currentTime;
    for (let i = 0; i < count; i += 1) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.value = notes[Math.min(i, notes.length - 1)];
      osc.connect(gain);
      gain.connect(ctx.destination);
      const start = now + i * 0.08;
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.07, start + 0.025);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.2);
      osc.start(start);
      osc.stop(start + 0.24);
    }
  } catch (_) {
    /* ignore */
  }
}

function updateComboHud() {
  if (comboEl) {
    comboEl.textContent = streak >= 2 ? `×${streak}` : String(streak);
  }
  if (!comboStatEl) return;
  const hot = streak >= 2;
  comboStatEl.classList.toggle("is-hot", hot);
  if (hot) {
    comboStatEl.classList.remove("is-pulse");
    void comboStatEl.offsetWidth;
    comboStatEl.classList.add("is-pulse");
  } else {
    comboStatEl.classList.remove("is-pulse");
  }
}

function hideComboBurst() {
  if (comboBurstTimer) {
    window.clearTimeout(comboBurstTimer);
    comboBurstTimer = null;
  }
  if (!comboBurstEl) return;
  comboBurstEl.hidden = true;
  comboBurstEl.classList.remove("is-pop");
}

function showComboBurst(level) {
  if (!comboBurstEl || !comboBurstValueEl || level < 2) return;
  if (comboBurstTimer) {
    window.clearTimeout(comboBurstTimer);
    comboBurstTimer = null;
  }
  comboBurstValueEl.textContent = `×${level}`;
  comboBurstEl.hidden = false;
  comboBurstEl.classList.remove("is-pop");
  void comboBurstEl.offsetWidth;
  comboBurstEl.classList.add("is-pop");
  comboBurstTimer = window.setTimeout(() => {
    hideComboBurst();
  }, 1100);
}

function setMatchKicker(level) {
  if (!matchKickerEl) return;
  if (level >= 2) {
    matchKickerEl.textContent = t("matchCombo", { n: level });
    matchKickerEl.classList.add("is-combo");
  } else {
    matchKickerEl.textContent = t("matchReveal");
    matchKickerEl.classList.remove("is-combo");
  }
}

function registerMatchStreak() {
  streak += 1;
  if (streak > bestStreak) bestStreak = streak;
  updateComboHud();
  if (streak >= 2) {
    showComboBurst(streak);
    playComboChime(streak);
  } else if (comboStatEl) {
    comboStatEl.classList.remove("is-pulse");
    void comboStatEl.offsetWidth;
    comboStatEl.classList.add("is-pulse");
  }
}

function breakCombo() {
  if (streak === 0) {
    updateComboHud();
    return;
  }
  streak = 0;
  updateComboHud();
}

function winCopyText() {
  const time = timerEl.textContent;
  if (settings.daily) {
    if (bestStreak >= 2) {
      return t("winCopyDailyCombo", {
        date: settings.dailyKey,
        moves,
        time,
        streak: bestStreak,
      });
    }
    return t("winCopyDaily", { date: settings.dailyKey, moves, time });
  }
  if (bestStreak >= 2) {
    return t("winCopyCombo", { moves, time, streak: bestStreak });
  }
  return t("winCopy", { moves, time });
}

function shareDailyText() {
  return t("shareDaily", {
    date: settings.dailyKey || todayKey(),
    country: t(`countries.${settings.country}`),
    genre: t(settings.genre),
    moves,
    time: timerEl.textContent,
  });
}

async function copyDailyShare() {
  const text = shareDailyText();
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      const area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.left = "-9999px";
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      area.remove();
    }
    if (shareDailyBtn) {
      shareDailyBtn.textContent = t("dailyShared");
      window.setTimeout(() => {
        if (shareDailyBtn) shareDailyBtn.textContent = t("dailyShare");
      }, 1600);
    }
  } catch (_) {
    window.prompt(t("dailyShare"), text);
  }
}

function mergeBeepRanges(ranges) {
  if (!ranges.length) return [];
  const sorted = [...ranges].sort((a, b) => a.start - b.start);
  const out = [{ ...sorted[0] }];
  for (let i = 1; i < sorted.length; i += 1) {
    const prev = out[out.length - 1];
    const cur = sorted[i];
    if (cur.start <= prev.end + 0.05) {
      prev.end = Math.max(prev.end, cur.end);
    } else {
      out.push({ ...cur });
    }
  }
  return out;
}

function parseSyncedLines(synced) {
  if (!synced) return [];
  const lines = [];
  const re = /\[(\d{1,2}):(\d{2}(?:\.\d+)?)\]([^\[]*)/g;
  let match;
  while ((match = re.exec(synced))) {
    const text = match[3].replace(/<[^>]+>/g, "").trim();
    if (!text) continue;
    lines.push({
      t: Number(match[1]) * 60 + Number(match[2]),
      text,
    });
  }
  lines.sort((a, b) => a.t - b.t);
  return lines;
}

function beepRangesFromSynced(synced, previewStart = 0) {
  const lines = parseSyncedLines(synced);
  if (!lines.length) return [];
  const ranges = [];
  for (let i = 0; i < lines.length; i += 1) {
    if (!containsSwear(lines[i].text)) continue;
    const start = lines[i].t - previewStart;
    const next = i + 1 < lines.length ? lines[i + 1].t : lines[i].t + 2;
    const end = Math.min(start + 2.2, Math.max(start + 0.4, next - previewStart));
    if (end <= 0) continue;
    ranges.push({ start: Math.max(0, start), end });
  }
  return mergeBeepRanges(ranges);
}

function chorusStartFromSynced(synced) {
  const lines = parseSyncedLines(synced);
  if (lines.length < 3) return 0;
  const counts = new Map();
  for (const line of lines) {
    const key = normalizeMediaText(line.text);
    if (key.length < 8) continue;
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  let bestKey = "";
  let bestCount = 1;
  for (const [key, count] of counts) {
    if (count > bestCount) {
      bestCount = count;
      bestKey = key;
    }
  }
  if (bestKey && bestCount >= 2) {
    const hits = lines.filter((line) => normalizeMediaText(line.text) === bestKey);
    const inPreview = hits.find((hit) => hit.t <= 26);
    return (inPreview || hits[0]).t;
  }
  const mid = lines[Math.min(lines.length - 1, Math.floor(lines.length * 0.38))];
  return mid?.t || 0;
}

function fadePreviewOutThenStop(durationMs = 520) {
  clearPreviewFade();
  if (previewStopTimer) {
    window.clearTimeout(previewStopTimer);
    previewStopTimer = null;
  }
  const from = previewAudio.volume;
  if (from <= 0.01) {
    stopPreviewAudio();
    return;
  }
  const started = performance.now();
  const tick = (now) => {
    const t = Math.min(1, (now - started) / durationMs);
    previewAudio.volume = from * (1 - t) * (1 - t);
    if (t < 1) {
      previewFadeRaf = window.requestAnimationFrame(tick);
    } else {
      previewFadeRaf = null;
      stopPreviewAudio();
    }
  };
  previewFadeRaf = window.requestAnimationFrame(tick);
}

function scheduleCensorBeeps(ranges, forcePeriodic, limitMs = PREVIEW_MS) {
  clearBeepTimers();
  const limit = limitMs / 1000;
  if (ranges?.length) {
    for (const { start, end } of ranges) {
      if (end <= 0 || start >= limit) continue;
      const s = Math.max(0, start);
      const e = Math.min(limit, end);
      const delay = Math.round(s * 1000);
      const dur = Math.max(140, Math.round((e - s) * 1000));
      beepTimerIds.push(window.setTimeout(() => playCensorBeep(dur), delay));
    }
    return;
  }
  if (!forcePeriodic) return;
  for (let t = 420; t < limitMs; t += 720) {
    beepTimerIds.push(window.setTimeout(() => playCensorBeep(260), t));
  }
}

function normalizeMediaText(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function scoreTrackMatch(gotArtist, gotSong, wantArtist, wantSong) {
  const artist = normalizeMediaText(gotArtist);
  const song = normalizeMediaText(gotSong);
  const wantA = normalizeMediaText(wantArtist);
  const wantS = normalizeMediaText(wantSong);
  if (!artist || !song || !wantA || !wantS) return 0;

  let artistScore = 0;
  if (artist === wantA) {
    artistScore = 8;
  } else if (artist.includes(wantA) || wantA.includes(artist)) {
    artistScore = 5;
  } else {
    const parts = artist
      .split(/\s*(?:&|,|feat\.?|ft\.?|x|and)\s*/i)
      .map((part) => part.trim())
      .filter(Boolean);
    if (parts.some((part) => part === wantA || part.includes(wantA) || wantA.includes(part))) {
      artistScore = 6;
    }
  }

  let songScore = 0;
  if (song === wantS) {
    songScore = 8;
  } else if (song.startsWith(wantS) || wantS.startsWith(song)) {
    songScore = 6;
  } else if (song.includes(wantS) || wantS.includes(song)) {
    songScore = 4;
  }

  // Wrong artist with similar title (covers, karaoke, etc.) must never win
  if (!artistScore || !songScore) return 0;

  let score = artistScore + songScore;
  if (/\b(cover|karaoke|tribute|instrumental)\b/i.test(gotSong)) score -= 12;
  if (/\blive\b/i.test(gotSong)) score -= 2;
  return score;
}

function artworkUrl(url) {
  if (!url) return "";
  return url
    .replace(/100x100bb\.jpg/i, "600x600bb.jpg")
    .replace(/100x100bb\.png/i, "600x600bb.png");
}

function itunesStoreCountry(code) {
  if (!code) return "us";
  if (code === "uk") return "gb";
  return code;
}

function fetchJsonp(url, signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(Object.assign(new Error("Aborted"), { name: "AbortError" }));
      return;
    }
    const callback = `matcherJsonp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const script = document.createElement("script");
    let settled = false;

    const cleanup = () => {
      if (settled) return;
      settled = true;
      signal?.removeEventListener("abort", onAbort);
      delete window[callback];
      script.remove();
    };

    const onAbort = () => {
      cleanup();
      reject(Object.assign(new Error("Aborted"), { name: "AbortError" }));
    };

    window[callback] = (data) => {
      if (settled) return;
      cleanup();
      resolve(data);
    };
    script.onerror = () => {
      if (settled) return;
      cleanup();
      reject(new Error("jsonp"));
    };
    signal?.addEventListener("abort", onAbort, { once: true });
    script.src = `${url}${url.includes("?") ? "&" : "?"}callback=${callback}&output=jsonp`;
    document.head.appendChild(script);
  });
}

function pickBestTrack(results, artist, song, mapResult) {
  let best = null;
  let bestScore = 0;
  for (const row of results) {
    const mapped = mapResult(row);
    const score = scoreTrackMatch(mapped.artist, mapped.song, artist, song);
    if (score > bestScore) {
      bestScore = score;
      best = mapped;
    }
  }
  if (!best || bestScore < 9) return null;
  return best;
}

async function fetchDeezerMedia(artist, song, signal) {
  const query = `artist:"${artist}" track:"${song}"`;
  const url = `https://api.deezer.com/search?q=${encodeURIComponent(query)}&limit=8`;
  const data = await fetchJsonp(url, signal);
  const results = Array.isArray(data?.data) ? data.data : [];
  const best = pickBestTrack(results, artist, song, (row) => ({
    artist: row.artist?.name || "",
    song: row.title || row.title_short || "",
    cover: row.album?.cover_xl || row.album?.cover_big || row.album?.cover_medium || "",
    preview: row.preview || "",
  }));
  if (best) return { cover: best.cover, preview: best.preview };

  // Fallback: free text search, still scored strictly
  const looseUrl = `https://api.deezer.com/search?q=${encodeURIComponent(`${artist} ${song}`)}&limit=10`;
  const loose = await fetchJsonp(looseUrl, signal);
  const looseResults = Array.isArray(loose?.data) ? loose.data : [];
  const looseBest = pickBestTrack(looseResults, artist, song, (row) => ({
    artist: row.artist?.name || "",
    song: row.title || row.title_short || "",
    cover: row.album?.cover_xl || row.album?.cover_big || row.album?.cover_medium || "",
    preview: row.preview || "",
  }));
  return looseBest
    ? { cover: looseBest.cover, preview: looseBest.preview }
    : { cover: "", preview: "" };
}

async function fetchItunesMedia(artist, song, country, signal) {
  const store = itunesStoreCountry(country);
  const term = encodeURIComponent(`${artist} ${song}`);
  const response = await fetch(
    `https://itunes.apple.com/search?term=${term}&entity=song&limit=8&country=${store}`,
    { signal }
  );
  if (!response.ok) throw new Error("itunes");
  const data = await response.json();
  const results = Array.isArray(data.results) ? data.results : [];
  const best = pickBestTrack(results, artist, song, (row) => ({
    artist: row.artistName || "",
    song: row.trackName || "",
    cover: artworkUrl(row.artworkUrl100 || ""),
    preview: row.previewUrl || "",
  }));
  return best ? { cover: best.cover, preview: best.preview } : { cover: "", preview: "" };
}

async function fetchTrackMedia(artist, song, country, signal) {
  // Deezer first: better coverage for local hits missing from iTunes
  const deezer = await fetchDeezerMedia(artist, song, signal).catch((error) => {
    if (signal?.aborted || error?.name === "AbortError") throw error;
    return { cover: "", preview: "" };
  });
  if (deezer.cover || deezer.preview) return deezer;

  return fetchItunesMedia(artist, song, country, signal).catch((error) => {
    if (signal?.aborted || error?.name === "AbortError") throw error;
    return { cover: "", preview: "" };
  });
}

function extractRefrain(lyrics, song = "") {
  if (!lyrics) return "";
  const text = String(lyrics).replace(/\r/g, "");
  const marked = text.match(
    /\[(?:Chorus|Refrain|Hook|Kórus|Refrén|サビ|후렴)[^\]]*\]\s*([\s\S]*?)(?=\n\s*\[|$)/i
  );
  let lines;
  if (marked) {
    lines = marked[1]
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
  } else {
    lines = text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line && !/^\[[^\]]+\]$/.test(line));
    const counts = new Map();
    for (const line of lines) {
      const key = line.toLowerCase();
      counts.set(key, (counts.get(key) || 0) + 1);
    }
    const songKey = normalizeMediaText(song);
    const songWords = songKey.split(" ").filter((word) => word.length > 3);
    let bestKey = "";
    let bestScore = 0;
    for (const [key, count] of counts) {
      if (count < 2) continue;
      const norm = normalizeMediaText(key);
      let score = count * 10;
      if (songKey && songKey.length > 3 && norm.includes(songKey)) score += 12;
      for (const word of songWords) {
        if (norm.includes(word)) score += 6;
      }
      if (score > bestScore) {
        bestScore = score;
        bestKey = key;
      }
    }
    if (bestKey) {
      const idx = lines.findIndex((line) => line.toLowerCase() === bestKey);
      lines = lines.slice(Math.max(0, idx), Math.max(0, idx) + 3);
    } else {
      lines = lines.slice(0, 3);
    }
  }
  return lines.slice(0, 3).join("\n").trim();
}

async function fetchRefrain(artist, song, signal) {
  const pack = await fetchLyricsPack(artist, song, signal);
  return pack.refrain;
}

async function fetchLyricsPack(artist, song, signal) {
  const params = new URLSearchParams({
    artist_name: artist,
    track_name: song,
  });
  const response = await fetch(`https://lrclib.net/api/search?${params}`, { signal });
  if (!response.ok) throw new Error("lyrics");
  const data = await response.json();
  if (!Array.isArray(data) || !data.length) {
    return { refrain: "", synced: "" };
  }
  const wantArtist = normalizeMediaText(artist);
  const wantSong = normalizeMediaText(song);
  const hit = data.find((row) => {
    const a = normalizeMediaText(row.artistName);
    const s = normalizeMediaText(row.trackName);
    return (
      (a === wantArtist || a.includes(wantArtist) || wantArtist.includes(a)) &&
      (s === wantSong || s.includes(wantSong) || wantSong.includes(s))
    );
  });
  if (!hit) return { refrain: "", synced: "" };
  const synced = hit.syncedLyrics || "";
  const plain = hit.plainLyrics || "";
  return {
    refrain: extractRefrain(plain || synced, song),
    synced,
  };
}

async function resolveMatchMedia(pair, signal) {
  if (mediaCache.has(pair.id)) return mediaCache.get(pair.id);
  const [track, lyrics] = await Promise.all([
    fetchTrackMedia(pair.artist, pair.song, pair.country, signal),
    fetchLyricsPack(pair.artist, pair.song, signal).catch((error) => {
      if (signal?.aborted || error?.name === "AbortError") throw error;
      return { refrain: "", synced: "" };
    }),
  ]);
  if (signal?.aborted) {
    return { cover: "", preview: "", refrain: "", synced: "" };
  }
  const media = {
    cover: track.cover || "",
    preview: track.preview || "",
    refrain: lyrics.refrain || "",
    synced: lyrics.synced || "",
  };
  // Only cache hits — failed/offline lookups must be retryable
  if (media.cover || media.preview || media.refrain || media.synced) {
    mediaCache.set(pair.id, media);
  }
  return media;
}

function clampPreviewStart(start, duration, clipMs = PREVIEW_MS) {
  const dur = Number.isFinite(duration) && duration > 1 ? duration : 30;
  const maxStart = Math.max(0, dur - clipMs / 1000 - 0.25);
  return Math.min(Math.max(0, start), maxStart);
}

function previewSeekTime(chorusStart, duration, clipMs = PREVIEW_MS) {
  const dur = Number.isFinite(duration) && duration > 1 ? duration : 30;
  if (chorusStart > 0.4 && chorusStart < dur - 1.2) {
    return clampPreviewStart(chorusStart, dur, clipMs);
  }
  // Chorus is outside the 30s clip — start later, not at the cold intro.
  return clampPreviewStart(Math.max(8, dur * 0.35), dur, clipMs);
}

function playPreviewClip(url, options = {}) {
  stopPreviewAudio();
  if (!url) return;
  const {
    beepRanges = [],
    forceBeep = false,
    startAt = 0,
    durationMs = PREVIEW_MS,
    fadeMs = PREVIEW_FADE_MS,
    volume = PREVIEW_TARGET_VOLUME,
    owner = "match",
  } = options;
  const gen = ++previewPlayGen;
  previewOwner = owner;
  previewAudio.src = url;
  previewAudio.volume = 0;
  try {
    previewAudio.load();
  } catch (_) {
    /* ignore */
  }
  let began = false;
  const start = () => {
    if (gen !== previewPlayGen || began) return;
    began = true;
    if (previewReadyHandler) {
      previewAudio.removeEventListener("loadeddata", previewReadyHandler);
      previewAudio.removeEventListener("canplay", previewReadyHandler);
      previewReadyHandler = null;
    }

    const armStop = () => {
      if (previewStopTimer) window.clearTimeout(previewStopTimer);
      previewStopTimer = window.setTimeout(() => {
        if (gen !== previewPlayGen) return;
        fadePreviewOutThenStop(Math.min(480, Math.max(220, fadeMs + 160)));
      }, durationMs);
    };

    // Play first, then seek — Safari often yields silence if currentTime is
    // set before playback has actually started.
    const seekIfReady = () => {
      if (gen !== previewPlayGen) return;
      const dur = previewAudio.duration;
      if (!Number.isFinite(dur) || dur < 1) return;
      const seek = previewSeekTime(startAt, dur, durationMs);
      if (seek <= 0.2) return;
      try {
        previewAudio.currentTime = seek;
      } catch (_) {
        /* ignore */
      }
    };

    fadePreviewIn(volume, fadeMs);
    const playResult = previewAudio.play();
    if (playResult && typeof playResult.then === "function") {
      playResult
        .then(() => {
          seekIfReady();
          armStop();
        })
        .catch(() => {});
    } else {
      seekIfReady();
      armStop();
    }
    if (shouldCensorContent()) {
      scheduleCensorBeeps(beepRanges, forceBeep, durationMs);
    }
  };
  previewReadyHandler = () => {
    previewAudio.removeEventListener("loadeddata", previewReadyHandler);
    previewAudio.removeEventListener("canplay", previewReadyHandler);
    previewReadyHandler = null;
    start();
  };
  previewAudio.addEventListener("loadeddata", previewReadyHandler);
  previewAudio.addEventListener("canplay", previewReadyHandler);
  if (previewAudio.readyState >= 2) start();
}

function cancelSnippetFetch() {
  snippetGen += 1;
  if (snippetAbort) {
    snippetAbort.abort();
    snippetAbort = null;
  }
}

function clipOptionsFromMedia(pair, media, kind) {
  const startAt = chorusStartFromSynced(media.synced);
  const beepRanges = shouldCensorContent()
    ? beepRangesFromSynced(media.synced, startAt)
    : [];
  const lyricsHaveSwear =
    containsSwear(media.refrain) || containsSwear(media.synced) || containsSwear(pair.song);
  const forceBeep =
    shouldCensorContent() &&
    !beepRanges.length &&
    (Boolean(pair.isExplicit) || lyricsHaveSwear);
  if (kind === "snippet") {
    return {
      beepRanges,
      forceBeep,
      startAt,
      durationMs: SNIPPET_MS,
      fadeMs: SNIPPET_FADE_MS,
      volume: SNIPPET_VOLUME,
      owner: "snippet",
    };
  }
  return { beepRanges, forceBeep, startAt, owner: "match" };
}

function prefetchBoardMedia(pairs) {
  pairs.forEach((pair) => {
    void resolveMatchMedia(pair).catch(() => {});
  });
}

async function playCardSnippet(card) {
  if (!settings.snippets) return;
  const pair = activePairs.find((entry) => entry.id === card.dataset.pairId);
  if (!pair) return;

  allowMatchClip = false;
  cancelSnippetFetch();

  const cached = mediaCache.get(pair.id);
  if (cached?.preview) {
    if (card.classList.contains("is-flipped") && !card.classList.contains("is-matched")) {
      playPreviewClip(cached.preview, clipOptionsFromMedia(pair, cached, "snippet"));
    }
    return;
  }

  const gen = snippetGen;
  const controller = new AbortController();
  snippetAbort = controller;
  const { signal } = controller;

  try {
    const media = await resolveMatchMedia(pair, signal);
    if (signal.aborted || gen !== snippetGen) return;
    if (!card.classList.contains("is-flipped") || card.classList.contains("is-matched")) {
      return;
    }
    if (!media.preview) return;
    if (gen !== snippetGen) return;
    playPreviewClip(media.preview, clipOptionsFromMedia(pair, media, "snippet"));
  } catch (error) {
    if (signal.aborted || error?.name === "AbortError") return;
  } finally {
    if (snippetAbort === controller) snippetAbort = null;
  }
}

function setMatchCover(url) {
  matchCoverEl.onerror = () => {
    matchCoverEl.hidden = true;
    matchCoverFallbackEl.hidden = false;
  };
  if (url) {
    matchCoverEl.hidden = false;
    matchCoverFallbackEl.hidden = true;
    matchCoverEl.src = url;
  } else {
    matchCoverEl.removeAttribute("src");
    matchCoverEl.hidden = true;
    matchCoverFallbackEl.hidden = false;
  }
}

function setMatchRefrain(text) {
  if (text) {
    matchRefrainLabelEl.hidden = false;
    matchRefrainEl.hidden = false;
    if (shouldCensorContent()) {
      matchRefrainEl.innerHTML = censorDisplayHtml(text).replaceAll("\n", "<br>");
    } else {
      matchRefrainEl.textContent = text;
    }
  } else {
    matchRefrainLabelEl.hidden = true;
    matchRefrainEl.hidden = true;
    matchRefrainEl.textContent = "";
  }
}

function buildMatchEq() {
  if (!matchEqStageEl || matchEqStageEl.childElementCount) return;
  const heights = [42, 68, 55, 88, 36, 74, 96, 58, 82, 44, 70, 92, 50, 78, 62, 86];
  heights.forEach((height, index) => {
    const bar = document.createElement("span");
    bar.style.setProperty("--h", `${height}%`);
    bar.style.setProperty("--d", `${(index % 8) * 0.09}s`);
    bar.style.setProperty("--speed", `${0.55 + (index % 5) * 0.12}s`);
    matchEqStageEl.appendChild(bar);
  });
}

function updateMatchEqLevel(foundCount) {
  if (!matchEqEl) return;
  const total = Math.max(1, activePairs.length);
  const level = Math.min(1, Math.max(0, foundCount / total));
  matchEqEl.style.setProperty("--eq-level", level.toFixed(3));
}

function showMatchEq() {
  buildMatchEq();
  if (!matchEqEl) return;
  updateMatchEqLevel(matches + 1);
  matchEqEl.hidden = false;
  matchEqEl.classList.add("is-hot");
}

function coolMatchEq() {
  if (!matchEqEl) return;
  matchEqEl.classList.remove("is-hot");
}

function hideMatchEq() {
  if (!matchEqEl) return;
  matchEqEl.hidden = true;
  matchEqEl.classList.remove("is-hot");
  matchEqEl.style.removeProperty("--eq-level");
}

function hideMatchToastUi() {
  if (matchToastHideTimer) {
    window.clearTimeout(matchToastHideTimer);
    matchToastHideTimer = null;
  }
  coolMatchEq();
  matchToastEl.hidden = true;
  matchCoverEl.removeAttribute("src");
  matchTitleEl.textContent = "";
  matchArtistEl.textContent = "";
  if (matchExplicitBadgeEl) {
    matchExplicitBadgeEl.hidden = true;
    matchExplicitBadgeEl.textContent = "";
  }
  setMatchRefrain("");
  setMatchCover("");
  setMatchKicker(0);
}

function dismissMatchToast() {
  if (mediaAbort) {
    mediaAbort.abort();
    mediaAbort = null;
  }
  hideMatchToastUi();
  if (previewOwner === "match") {
    fadePreviewOutThenStop(280);
  }
}

function hideMatchReveal() {
  if (mediaAbort) {
    mediaAbort.abort();
    mediaAbort = null;
  }
  cancelSnippetFetch();
  stopPreviewAudio();
  hideMatchToastUi();
}

function showMatchReveal(pair) {
  cancelSnippetFetch();
  if (mediaAbort) mediaAbort.abort();
  mediaAbort = new AbortController();
  const { signal } = mediaAbort;
  allowMatchClip = true;

  if (matchToastHideTimer) {
    window.clearTimeout(matchToastHideTimer);
    matchToastHideTimer = null;
  }

  const mark = shouldCensorContent() && pairNeedsExplicitMark(pair);
  if (matchExplicitBadgeEl) {
    matchExplicitBadgeEl.hidden = !mark;
    matchExplicitBadgeEl.textContent = mark ? t("explicitBadge") : "";
  }
  if (shouldCensorContent()) {
    matchTitleEl.innerHTML = censorDisplayHtml(pair.song);
  } else {
    matchTitleEl.textContent = pair.song;
  }
  matchArtistEl.textContent = pair.artist;
  setMatchCover("");
  setMatchRefrain("");
  setMatchKicker(streak);
  matchToastEl.hidden = false;
  showMatchEq();

  const playMatchAudio = (media) => {
    if (!settings.snippets || !allowMatchClip || !media?.preview) return;
    playPreviewClip(media.preview, clipOptionsFromMedia(pair, media, "match"));
  };

  const cached = mediaCache.get(pair.id);
  if (cached) {
    setMatchCover(cached.cover);
    setMatchRefrain(cached.refrain);
    playMatchAudio(cached);
  }

  resolveMatchMedia(pair, signal)
    .then((media) => {
      if (signal.aborted) return;
      setMatchCover(media.cover);
      setMatchRefrain(media.refrain);
      if (cached?.preview) return;
      playMatchAudio(media);
    })
    .catch(() => {});

  matchToastHideTimer = window.setTimeout(() => {
    dismissMatchToast();
  }, 9000);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

async function lookupTrackExplicit(pair, signal) {
  if (pair.explicit === true) return true;
  if (pair.explicit === false) return false;
  if (explicitCache.has(pair.id)) return explicitCache.get(pair.id);

  try {
    const query = `artist:"${pair.artist}" track:"${pair.song}"`;
    const data = await fetchJsonp(
      `https://api.deezer.com/search?q=${encodeURIComponent(query)}&limit=5`,
      signal
    );
    const results = Array.isArray(data?.data) ? data.data : [];
    const best = pickBestTrack(results, pair.artist, pair.song, (row) => ({
      artist: row.artist?.name || "",
      song: row.title || row.title_short || "",
      explicit: Boolean(row.explicit_lyrics),
    }));
    const flag = best ? Boolean(best.explicit) : false;
    explicitCache.set(pair.id, flag);
    return flag;
  } catch (error) {
    if (signal?.aborted || error?.name === "AbortError") throw error;
    return false;
  }
}

async function pickPairsFiltered(country, genre, difficulty, allowExplicit, signal, random = Math.random) {
  const count = DIFFICULTY[difficulty].pairs;
  const countryPool = CATALOG.filter((pair) => pair.country === country);
  let preferred = countryPool;
  if (genre !== "mix") {
    const themed = countryPool.filter((pair) => pair.genre === genre);
    preferred = themed.length ? themed : countryPool;
  }

  const pairs = shuffle(preferred, random)
    .slice(0, Math.min(count, preferred.length))
    .map((pair) => ({ ...pair }));

  // Explicit On: play/show as-is. Explicit Off: keep all songs, mark for badge + censor.
  if (allowExplicit) {
    pairs.forEach((pair) => {
      pair.isExplicit = false;
    });
    return pairs;
  }

  await Promise.all(
    pairs.map(async (pair) => {
      try {
        pair.isExplicit = await lookupTrackExplicit(pair, signal);
      } catch (error) {
        if (signal?.aborted || error?.name === "AbortError") throw error;
        pair.isExplicit = containsSwear(pair.song);
      }
    })
  );
  return pairs;
}

function modeLabel() {
  const explicitLabel = settings.explicit ? t("explicitOn") : t("explicitOff");
  const snippetLabel = settings.snippets ? t("snippetsOn") : t("snippetsOff");
  const base = `${t(`continents.${settings.continent}`)} · ${t(`countries.${settings.country}`)} · ${t(settings.genre)} · ${t(settings.difficulty)} · ${t("explicit")}: ${explicitLabel} · ${t("snippets")}: ${snippetLabel}`;
  if (settings.daily) {
    return `${t("daily")} · ${settings.dailyKey} · ${base}`;
  }
  return base;
}

function buildDeck(pairs, random = Math.random) {
  return shuffle(
    pairs.flatMap((pair) => [
      {
        pairId: pair.id,
        kind: "artist",
        label: pair.artist,
        kindLabel: t("artist"),
      },
      {
        pairId: pair.id,
        kind: "song",
        label: pair.song,
        kindLabel: t("song"),
      },
    ]),
    random
  );
}

function selectedContinent() {
  return (
    setupForm.querySelector('input[name="continent"]:checked')?.value ||
    settings.continent ||
    "europe"
  );
}

function renderContinentChips() {
  if (!continentChipsEl) return;
  const selected = selectedContinent();
  continentChipsEl.setAttribute("aria-label", t("continent"));
  continentChipsEl.innerHTML = CONTINENTS.map((continent) => {
    const checked = continent.id === selected ? " checked" : "";
    return `<label class="chip">
      <input type="radio" name="continent" value="${continent.id}"${checked} />
      <span>${escapeHtml(t(`continents.${continent.id}`))}</span>
    </label>`;
  }).join("");
}

function renderCountryChips() {
  if (!countryChipsEl) return;
  const continentId = selectedContinent();
  const list = countriesForContinent(continentId);
  const selected =
    setupForm.querySelector('input[name="country"]:checked')?.value || settings.country;
  const active = list.includes(selected) ? selected : list[0];
  countryChipsEl.setAttribute("aria-label", t("country"));
  countryChipsEl.innerHTML = list
    .map((code) => {
      const checked = code === active ? " checked" : "";
      return `<label class="chip">
      <input type="radio" name="country" value="${code}"${checked} />
      <span>${escapeHtml(t(`countries.${code}`))}</span>
    </label>`;
    })
    .join("");
}

function refreshAriaLabels() {
  document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
    el.setAttribute("aria-label", t(el.getAttribute("data-i18n-aria")));
  });
}

function showScreen(screen) {
  const showMenu = screen === "menu";
  menuScreen.hidden = !showMenu;
  gameScreen.hidden = showMenu;
  if (showMenu) {
    overlayEl.hidden = true;
    hideMatchReveal();
    hideMatchEq();
    hideComboBurst();
  } else {
    closeScores();
    closeTutorial(true);
  }
}

function showMenuStep(step) {
  menuStep = step;
  menuSteps.forEach((el) => {
    const active = Number(el.dataset.step) === step;
    el.hidden = !active;
    el.classList.toggle("is-active", active);
  });
  stepDots.forEach((dot) => {
    const n = Number(dot.dataset.dot);
    dot.classList.toggle("is-active", n === step);
    dot.classList.toggle("is-done", n < step);
  });
}

function resetStats() {
  clearFlipTimers();
  hideMatchReveal();
  hideMatchEq();
  hideComboBurst();
  moves = 0;
  matches = 0;
  streak = 0;
  bestStreak = 0;
  flipped = [];
  lock = false;
  startedAt = null;
  stopTimer();
  movesEl.textContent = "0";
  matchesEl.textContent = "0";
  updateComboHud();
  timerEl.textContent = "0:00";
  overlayEl.hidden = true;
  if (winRankEl) {
    winRankEl.hidden = true;
    winRankEl.textContent = "";
  }
  lastScoreRecord = null;
}

function renderBoard(random = Math.random) {
  const { columns } = DIFFICULTY[settings.difficulty];
  boardEl.style.setProperty("--columns", String(columns));
  boardEl.innerHTML = "";

  buildDeck(activePairs, random).forEach((card) => {
    const pair = activePairs.find((entry) => entry.id === card.pairId);
    const showBadge =
      card.kind === "song" && shouldCensorContent() && pairNeedsExplicitMark(pair);
    const labelHtml =
      card.kind === "song" && shouldCensorContent()
        ? censorDisplayHtml(card.label)
        : escapeHtml(card.label);
    const button = document.createElement("button");
    button.type = "button";
    button.className = "card";
    button.dataset.pairId = card.pairId;
    button.dataset.kind = card.kind;
    button.dataset.rawLabel = card.label;
    button.setAttribute("aria-label", t("cardBack"));
    button.innerHTML = `
      <span class="card-inner">
        <span class="face face-back" aria-hidden="true"><span>♪</span></span>
        <span class="face face-front" aria-hidden="true">
          <span class="kind">${escapeHtml(card.kindLabel)}</span>
          ${
            showBadge
              ? `<span class="explicit-badge" title="${escapeHtml(t("explicit"))}">${escapeHtml(
                  t("explicitBadge")
                )}</span>`
              : ""
          }
          <span class="label">${labelHtml}</span>
        </span>
      </span>
    `;
    button.addEventListener("click", () => onCardClick(button));
    boardEl.appendChild(button);
  });
}

async function startGame(nextSettings = settings) {
  const gen = ++startGameGen;
  unlockAudio();
  settings = {
    daily: false,
    dailyKey: "",
    seed: null,
    snippets: true,
    ...nextSettings,
  };
  const startBtn = setupForm.querySelector('button[type="submit"]');
  if (startBtn) startBtn.disabled = true;
  if (dailyBtn) dailyBtn.disabled = true;
  if (scoresBtn) scoresBtn.disabled = true;
  if (howtoBtn) howtoBtn.disabled = true;
  if (restartBtn) restartBtn.disabled = true;
  if (playAgainBtn) playAgainBtn.disabled = true;
  try {
    const random = settings.seed != null ? mulberry32(settings.seed) : Math.random;
    activePairs = await pickPairsFiltered(
      settings.country,
      settings.genre,
      settings.difficulty,
      settings.explicit,
      undefined,
      random
    );
    if (gen !== startGameGen) return;
    if (!activePairs.length) {
      console.error("No catalog pairs for", settings);
      goToMenu();
      return;
    }
    pairTotalEl.textContent = String(activePairs.length);
    gameModeEl.textContent = modeLabel();
    resetStats();
    renderBoard(random);
    prefetchBoardMedia(activePairs);
    showScreen("game");
  } finally {
    if (gen !== startGameGen) return;
    if (startBtn) startBtn.disabled = false;
    if (dailyBtn) dailyBtn.disabled = false;
    if (scoresBtn) scoresBtn.disabled = false;
    if (howtoBtn) howtoBtn.disabled = false;
    if (restartBtn) restartBtn.disabled = false;
    if (playAgainBtn) playAgainBtn.disabled = false;
  }
}

async function startDailyChallenge() {
  const next = createDailySettings(formExplicitOn(), formSnippetsOn());
  await startGame(next);
}

function revealCard(card) {
  card.classList.add("is-flipped");
  const raw = card.dataset.rawLabel || card.querySelector(".label")?.textContent || "";
  card.setAttribute(
    "aria-label",
    `${card.querySelector(".kind").textContent}: ${raw}`
  );
}

function hideCard(card) {
  card.classList.remove("is-flipped", "is-wrong");
  card.setAttribute("aria-label", t("cardBack"));
}

function onCardClick(card) {
  if (lock) return;
  if (card.classList.contains("is-flipped") || card.classList.contains("is-matched")) {
    return;
  }

  unlockAudio();
  startTimer();
  revealCard(card);
  flipped.push(card);

  if (flipped.length < 2) {
    void playCardSnippet(card);
    return;
  }

  moves += 1;
  movesEl.textContent = String(moves);
  lock = true;
  cancelSnippetFetch();

  const [first, second] = flipped;
  const isMatch =
    first.dataset.pairId === second.dataset.pairId &&
    first.dataset.kind !== second.dataset.kind;

  if (isMatch) {
    cancelSnippetFetch();
    registerMatchStreak();
    const pair = activePairs.find((entry) => entry.id === first.dataset.pairId);
    if (pair) showMatchReveal(pair);
    const comboLevel = streak;
    later(() => {
      first.classList.add("is-matched");
      second.classList.add("is-matched");
      flipped = [];
      lock = false;
      matches += 1;
      matchesEl.textContent = String(matches);
      updateMatchEqLevel(matches);
      if (matches === activePairs.length) {
        // Let the last combo burst read before the win modal covers it.
        const delay = comboLevel >= 2 ? 700 : 0;
        if (delay) {
          later(() => finishGame(), delay);
        } else {
          finishGame();
        }
      }
    }, 280);
    return;
  }

  breakCombo();

  later(() => {
    first.classList.add("is-wrong");
    second.classList.add("is-wrong");
  }, 160);

  later(() => {
    hideCard(first);
    hideCard(second);
    flipped = [];
    lock = false;
    cancelSnippetFetch();
    fadePreviewOutThenStop(240);
  }, 900);
}

function finishGame() {
  hideMatchReveal();
  hideMatchEq();
  hideComboBurst();
  stopTimer();
  updateTimer();
  const elapsed = startedAt ? Date.now() - startedAt : 0;
  const recorded = recordScore({
    daily: Boolean(settings.daily),
    dailyKey: settings.dailyKey,
    country: settings.country,
    genre: settings.genre,
    difficulty: settings.difficulty,
    moves,
    timeMs: elapsed,
    bestStreak,
  });
  updateWinRank(recorded);
  if (settings.daily) {
    saveDailyBest({
      dailyKey: settings.dailyKey,
      moves,
      timeMs: elapsed,
      bestStreak,
      country: settings.country,
      genre: settings.genre,
    });
    updateDailyBestLabel();
    if (winKickerEl) winKickerEl.textContent = t("dailyWinKicker");
    if (winTitleEl) winTitleEl.textContent = t("dailyWinTitle");
    if (shareDailyBtn) shareDailyBtn.hidden = false;
  } else {
    if (winKickerEl) winKickerEl.textContent = t("winKicker");
    if (winTitleEl) winTitleEl.textContent = t("winTitle");
    if (shareDailyBtn) shareDailyBtn.hidden = true;
  }
  winCopyEl.textContent = winCopyText();
  overlayEl.hidden = false;
  playAgainBtn.focus();
}

function readSettingsFromForm() {
  const data = new FormData(setupForm);
  const country = String(data.get("country") || "us");
  return {
    continent: String(data.get("continent") || continentOf(country)),
    country,
    genre: String(data.get("genre") || "mix"),
    difficulty: String(data.get("difficulty") || "medium"),
    explicit: String(data.get("explicit") || "off") === "on",
    snippets: String(data.get("snippets") || "on") !== "off",
    daily: false,
    dailyKey: "",
    seed: null,
  };
}

function onLanguageChange() {
  renderContinentChips();
  renderCountryChips();
  refreshAriaLabels();
  updateDailyBestLabel();
  if (!gameScreen.hidden) {
    gameModeEl.textContent = modeLabel();
    if (!overlayEl.hidden) {
      winCopyEl.textContent = winCopyText();
      if (settings.daily) {
        if (winKickerEl) winKickerEl.textContent = t("dailyWinKicker");
        if (winTitleEl) winTitleEl.textContent = t("dailyWinTitle");
      } else {
        if (winKickerEl) winKickerEl.textContent = t("winKicker");
        if (winTitleEl) winTitleEl.textContent = t("winTitle");
      }
      if (shareDailyBtn && !shareDailyBtn.hidden) {
        shareDailyBtn.textContent = t("dailyShare");
      }
      if (lastScoreRecord) updateWinRank(lastScoreRecord);
    }
    if (matchToastEl && !matchToastEl.hidden) {
      setMatchKicker(streak);
    }
    boardEl.querySelectorAll(".card").forEach((card) => {
      const kind = card.dataset.kind;
      const kindEl = card.querySelector(".kind");
      if (kindEl) kindEl.textContent = t(kind === "artist" ? "artist" : "song");
      if (!card.classList.contains("is-flipped") && !card.classList.contains("is-matched")) {
        card.setAttribute("aria-label", t("cardBack"));
      }
    });
  }
  if (scoresOverlayEl && !scoresOverlayEl.hidden) {
    renderScoresList();
  }
  if (tutorialOverlayEl && !tutorialOverlayEl.hidden) {
    renderTutorialStep();
  }
}

function goToMenu() {
  startGameGen += 1;
  clearFlipTimers();
  stopTimer();
  hideMatchReveal();
  hideMatchEq();
  hideComboBurst();
  overlayEl.hidden = true;
  closeScores();
  closeTutorial(false);
  if (shareDailyBtn) shareDailyBtn.hidden = true;
  const startBtn = setupForm.querySelector('button[type="submit"]');
  if (startBtn) startBtn.disabled = false;
  if (dailyBtn) dailyBtn.disabled = false;
  if (scoresBtn) scoresBtn.disabled = false;
  if (howtoBtn) howtoBtn.disabled = false;
  if (restartBtn) restartBtn.disabled = false;
  if (playAgainBtn) playAgainBtn.disabled = false;
  updateDailyBestLabel();
  showMenuStep(1);
  showScreen("menu");
}

setupForm.addEventListener("click", (event) => {
  const next = event.target.closest("[data-next]");
  const prev = event.target.closest("[data-prev]");
  if (next) {
    event.preventDefault();
    showMenuStep(Number(next.dataset.next));
    return;
  }
  if (prev) {
    event.preventDefault();
    showMenuStep(Number(prev.dataset.prev));
  }
});

setupForm.addEventListener("change", (event) => {
  const input = event.target;
  if (!(input instanceof HTMLInputElement)) return;

  if (input.name === "continent") {
    settings.continent = input.value;
    const list = countriesForContinent(input.value);
    settings.country = list[0];
    renderCountryChips();
    return;
  }

  if (input.name !== "country") return;
  settings.country = input.value;
  settings.continent = continentOf(input.value);
});

setupForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (menuStep !== 4) {
    showMenuStep(Math.min(4, menuStep + 1));
    return;
  }
  void startGame(readSettingsFromForm());
});

restartBtn.addEventListener("click", () => {
  void startGame(settings);
});
playAgainBtn.addEventListener("click", () => {
  void startGame(settings);
});
if (dailyBtn) {
  dailyBtn.addEventListener("click", () => {
    void startDailyChallenge();
  });
}
if (shareDailyBtn) {
  shareDailyBtn.addEventListener("click", () => {
    void copyDailyShare();
  });
}
if (scoresBtn) {
  scoresBtn.addEventListener("click", () => {
    openScores();
  });
}
if (howtoBtn) {
  howtoBtn.addEventListener("click", () => {
    openTutorial(0);
  });
}
if (tutorialNextBtn) {
  tutorialNextBtn.addEventListener("click", () => {
    if (tutorialStep >= TUTORIAL_STEPS - 1) {
      closeTutorial(true);
      return;
    }
    tutorialStep += 1;
    renderTutorialStep();
  });
}
if (tutorialBackBtn) {
  tutorialBackBtn.addEventListener("click", () => {
    if (tutorialStep <= 0) return;
    tutorialStep -= 1;
    renderTutorialStep();
  });
}
if (tutorialSkipBtn) {
  tutorialSkipBtn.addEventListener("click", () => {
    closeTutorial(true);
  });
}
if (tutorialOverlayEl) {
  tutorialOverlayEl.addEventListener("click", (event) => {
    if (event.target === tutorialOverlayEl) closeTutorial(true);
  });
}
window.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  if (tutorialOverlayEl && !tutorialOverlayEl.hidden) {
    closeTutorial(true);
    return;
  }
  if (scoresOverlayEl && !scoresOverlayEl.hidden) closeScores();
});
if (scoresCloseBtn) {
  scoresCloseBtn.addEventListener("click", closeScores);
}
if (scoresOverlayEl) {
  scoresOverlayEl.addEventListener("click", (event) => {
    if (event.target === scoresOverlayEl) closeScores();
  });
}
document.querySelectorAll(".scores-tab").forEach((btn) => {
  btn.addEventListener("click", () => {
    scoresViewDaily = btn.dataset.scoresTab === "daily";
    renderScoresList();
  });
});
if (scoresDiffEl) {
  scoresDiffEl.addEventListener("change", () => {
    if (!scoresViewDaily) renderScoresList();
  });
}
backMenuBtn.addEventListener("click", goToMenu);
winMenuBtn.addEventListener("click", goToMenu);
matchToastCloseBtn.addEventListener("click", dismissMatchToast);

window.addEventListener("languagechange", () => {
  onLanguageChange();
});

initI18n();
onLanguageChange();
updateDailyBestLabel();
showMenuStep(1);
showScreen("menu");
