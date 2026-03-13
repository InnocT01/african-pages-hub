export const origins = [
  "RDC", "Kenya", "Sénégal", "Nigeria", "Guinée", "Côte d'Ivoire",
  "Congo", "Mali", "Cameroun", "Afrique du Sud", "Tanzania",
  "Éthiopie", "Ghana", "Ouganda", "Rwanda", "Burundi", "Bénin", "Togo"
];

export const genres = [
  "Roman", "Nouvelle", "Poésie", "Essai", "Conte", "BD", "Manuel",
  "Revue scientifique", "Article", "Anthologie", "Langue", "Philosophie",
  "Histoire", "Théâtre", "Autobiographie"
];

export const contentTypes = [
  "ebook", "audio", "physical", "bd", "manuel_scolaire", "revue", "article"
] as const;

export const categories = [
  "literature", "education", "youth", "diaspora", "national_languages",
  "manuels_scolaires", "revues_scientifiques", "articles"
] as const;

export const bookLanguages = [
  { code: "fr", label_fr: "Français", label_en: "French" },
  { code: "en", label_fr: "Anglais", label_en: "English" },
  { code: "sw", label_fr: "Swahili", label_en: "Swahili" },
  { code: "ln", label_fr: "Lingala", label_en: "Lingala" },
  { code: "wo", label_fr: "Wolof", label_en: "Wolof" },
  { code: "ha", label_fr: "Haoussa", label_en: "Hausa" },
  { code: "yo", label_fr: "Yoruba", label_en: "Yoruba" },
  { code: "ig", label_fr: "Igbo", label_en: "Igbo" },
  { code: "am", label_fr: "Amharique", label_en: "Amharic" },
  { code: "zu", label_fr: "Zoulou", label_en: "Zulu" },
  { code: "rw", label_fr: "Kinyarwanda", label_en: "Kinyarwanda" },
  { code: "rn", label_fr: "Kirundi", label_en: "Kirundi" },
];
