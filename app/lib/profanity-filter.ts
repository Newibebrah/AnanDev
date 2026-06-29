const badWords = [
  "anjing", "anjink", "anjeng", "babi", "babii",
  "bangsat", "bangsatt", "bangsad",
  "bajingan", "bajingann",
  "brengsek", "brengsekk", "berengsek",
  "kampret", "kamprett",
  "keparat", "keparatt",
  "kontol", "kontoll", "kontolll",
  "memek", "memeek", "memekk",
  "ngentot", "ngentott", "ngntot",
  "njing", "njin",
  "njeng",
  "peler", "pelerr",
  "pepek", "pepek",
  "perek", "perekk",
  "sialan", "sialann", "sial",
  "silit", "silit",
  "tai", "taik",
  "tolol", "tololl",
  "bego", "begoo",
  "goblok", "goblokkk", "goblog",
  "idiot", "idiott",
  "bodoh",
  "jancok", "jancokk", "jancuk", "jancuuk",
  "asu", "asuu",
  "cok", "cokk",
  "ndasmu", "ndasmuu",
  "matamu", "matamu",
  "kafir", "kafirr",
  "setan", "setann",
  "iblis",
  "lonte", "lonthe",
  "pelacur",
  "sundel",
  "bencong", "bencongg",
  "banci",
  "waria",
  "jablay",
  "monyet", "monyett",
  "kadal",
  "cebong", "cebongg",
  "kampang",
  "ngawi",
  "kenthu", "kentu",
  "jembud",
  "nenen",
  "tete",
  "toket",
  "pentil",
  "susuk",
  "coli", "colii",
  "onani",
  "masturbasi",
  "boker",
  "berak", "beol",
  "kencing",
  "pipis",
  "pantek", "pantekk",
  "ngentod",
  "tempik",
  "kimak", "kimaak",
  "pukimak",
];

const pattern = new RegExp(`\\b(${badWords.join("|")})\\b`, "gi");

function censorWord(word: string): string {
  return word[0] + "*".repeat(word.length - 1);
}

export function containsProfanity(text: string): boolean {
  return pattern.test(text);
}

export function filterProfanity(text: string): string {
  return text.replace(pattern, (match) => censorWord(match));
}
