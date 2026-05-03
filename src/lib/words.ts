export const EASY_WORDS = [
  "about","above","abuse","actor","acute","admit","adopt","adult","after","again",
  "agent","agree","ahead","alarm","album","alert","alike","alive","alley","allow",
  "alone","along","aloud","aloof","alter","angel","angry","anime","ankle","annoy",
  "apart","apple","apply","areas","arena","argue","arise","asked","audio","aunts",
  "avoid","awake","award","aware","awful","badly","baker","bands","basic","basis",
  "beach","beard","began","begin","being","below","bench","berry","bible","bikes",
  "birds","birth","black","blade","blame","bland","blank","blast","blaze","bleed",
  "blend","bless","blind","block","blood","bloom","blown","blues","blunt","blurb",
  "board","boats","bonus","books","boots","bound","boxes","brain","brand","brave",
  "bread","break","breed","brick","bride","brief","bring","broad","broke","brook",
  "brown","brush","build","built","buyer","cabin","cakes","calls","camps","candy",
  "cargo","carry","cases","catch","cause","chain","chair","champ","chaos","charm",
  "chart","chase","cheap","check","cheek","cheep","cheer","chess","chest","chief",
  "child","china","chips","choir","chord","civic","civil","claim","clash","class",
  "clean","clear","clerk","click","climb","cling","clock","clone","close","cloth",
  "cloud","coach","coast","color","comes","comet","comic","comma","coral","count",
  "court","cover","craft","crane","crash","crazy","cream","creek","crime","crisp",
  "cross","crowd","crown","crush","curve","cycle","daily","dance","dares","dates",
  "deals","decay","depot","depth","devil","diary","digit","dirty","disco","doubt",
  "dough","draft","drain","drama","drank","drawn","dream","dress","drift","drink",
  "drive","drops","drove","drums","drunk","dryer","dying","eagle","early","earth",
  "eaten","email","empty","enemy","enjoy","enter","essay","event","every","exact",
  "exist","extra","fable","faced","facts","faith","falls","false","fancy","farms",
  "fault","feast","fence","fever","fiber","field","fifth","fifty","fight","files",
  "final","first","fixed","flame","flash","fleet","flesh","floor","fluid","focus",
  "folks","force","forge","forms","forth","found","frame","freed","fresh","front",
  "frost","froze","fruit","fully","funds","funny","games","giant","given","glare",
  "glass","globe","gloom","glory","glove","going","grace","grade","grain","grand",
  "grant","grasp","grass","grave","great","green","greet","grief","grill","grind",
  "groan","grove","grown","guide","guild","guile","guilt","girls","given","guard",
  "guest","guest","habit","handy","happy","harsh","haste","heads","heard","heart",
  "heavy","hills","hinge","hints","hired","holes","honor","hoped","horse","hotel",
  "hours","house","human","hurry","ideal","image","index","indie","inner","input",
  "issue","items","ivory","jelly","jewel","joint","joker","joust","judge","juice",
  "juicy","karma","keeps","kinds","kings","kneel","knife","knots","known","label",
  "lance","large","laser","later","laugh","layer","leads","learn","legal","level",
  "light","limit","linen","liver","local","lodge","logic","loose","lover","lower",
  "loyal","lucky","lunar","lunch","magic","major","maker","manor","maple","march",
  "marks","match","mayor","media","meets","might","minor","minus","mixed","model",
  "money","month","moral","motor","motto","mount","mouth","moved","movie","music",
  "naive","nerve","never","night","noble","noise","north","noted","novel","nurse",
  "nymph","occur","offer","often","opens","orbit","order","other","ought","outer",
  "owned","owner","ozone","paced","pages","paint","panel","paper","party","patch",
  "pause","peace","peach","pearl","pedal","penny","perky","petty","phase","phone",
  "photo","piano","piece","pilot","pinch","pilot","pixel","pizza","place","plain",
  "plane","plant","plate","plaza","plead","pluck","plugs","plump","plunge","point",
  "polar","poles","poppy","ports","posed","power","press","price","pride","prime",
  "print","prize","probe","prone","proof","prose","proud","prove","psalm","queen",
  "query","quest","queue","quiet","quota","quote","radar","radio","raise","rally",
  "ranch","range","rapid","rated","ratio","reach","ready","realm","rebel","refer",
  "reign","relax","rely","remix","repay","reset","rider","ridge","right","risky",
  "river","robin","rocky","roles","roman","roomy","roots","roses","rough","round",
  "route","royal","ruler","rural","sadly","saint","salad","sauce","scale","scene",
  "scent","scout","seize","serve","seven","shade","shake","shall","shape","share",
  "shark","sharp","sheet","shelf","shell","shift","shirt","shock","shoes","shoot",
  "shore","short","shout","sight","silva","skill","skull","slate","sleep","slice",
  "slide","slime","slope","smart","smile","smoke","snake","solar","solve","sonic",
  "sorry","south","space","spare","spark","speak","spear","speed","spend","spent",
  "spice","spill","spite","split","spoke","spoon","sport","spray","squad","stack",
  "staff","stage","stain","stake","stamp","stand","stare","stars","start","state",
  "stays","steam","steel","steep","steer","stern","stick","still","stone","stood",
  "store","storm","story","stove","strap","straw","stray","strip","stuck","study",
  "stuff","style","suite","sunny","super","surge","swamp","swear","sweep","sweet",
  "swept","swift","swing","swirl","swoop","sword","syrup","table","taken","taste",
  "teach","tears","tempo","tends","tests","theme","there","thick","thing","think",
  "third","those","three","threw","throw","tiger","tight","timer","tired","title",
  "today","token","tools","topic","total","touch","tough","tower","towns","toxic",
  "track","trade","train","trait","tramp","traps","tread","trees","trend","trial",
  "tried","tries","troop","trout","trace","trust","truth","tumor","tuned","twice",
  "twist","typed","types","under","union","unity","until","upper","urban","usage",
  "usual","utter","valid","valor","value","valve","video","vigor","viral","virus",
  "visit","vista","vital","vivid","voice","voter","vowed","wagon","walls","waste",
  "watch","water","weary","weave","wedge","weird","while","white","whole","wider",
  "width","witch","woman","women","words","works","world","worry","worse","worst",
  "worth","would","wound","wrath","write","wrong","yacht","yield","young","youth",
  "zones"
];

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function shuffleArray<T>(array: T[], seed: number): T[] {
  const arr = [...array];

  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom(seed + i) * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr;
}

const SHUFFLED_WORDS = shuffleArray(EASY_WORDS, 2024);

export function getDailyWord(): string {
  const now = new Date();
  const start = new Date(2024, 0, 1); // Jan 1, 2024 as epoch
  const diff = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  const index = diff % SHUFFLED_WORDS.length;
  return SHUFFLED_WORDS[index].toUpperCase();
}

export function getTimeUntilMidnight(): { hours: number; minutes: number; seconds: number } {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  const diff = midnight.getTime() - now.getTime();
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  return { hours, minutes, seconds };
}

export async function validateWord(word: string): Promise<boolean> {
  try {
    const response = await fetch(
      `https://api.datamuse.com/words?sp=${word.toLowerCase()}&max=1`
    );
    if (!response.ok) return true;
    const data = await response.json();
    return data.length > 0 && data[0].word.toLowerCase() === word.toLowerCase();
  } catch {
    return true;
  }
}

export function getRandomWord(): string {
  const index = Math.floor(Math.random() * EASY_WORDS.length);
  return EASY_WORDS[index].toUpperCase();
}

export function getDailyKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
}
