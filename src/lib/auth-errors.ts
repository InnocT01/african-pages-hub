type AuthErrorLike = { message?: string; status?: string | number };

type Lang = "fr" | "en";

const messages = {
  fr: {
    invalidCredentials: "Email ou mot de passe incorrect.",
    emailAlreadyUsed: "Cet email est déjà utilisé.",
    weakPassword: "Mot de passe trop faible (minimum 6 caractères).",
    emailNotConfirmed: "Veuillez confirmer votre email avant de vous connecter.",
    tooManyRequests: "Trop de tentatives. Réessayez dans quelques instants.",
    network: "Connexion réseau impossible. Vérifiez Internet puis réessayez.",
    timeout: "Le serveur met trop de temps à répondre. Réessayez.",
    generic: "Une erreur est survenue. Veuillez réessayer.",
  },
  en: {
    invalidCredentials: "Incorrect email or password.",
    emailAlreadyUsed: "This email is already in use.",
    weakPassword: "Weak password (minimum 6 characters).",
    emailNotConfirmed: "Please confirm your email before signing in.",
    tooManyRequests: "Too many attempts. Please try again in a moment.",
    network: "Network error. Check your internet and try again.",
    timeout: "Server response is taking too long. Please retry.",
    generic: "Something went wrong. Please try again.",
  },
} as const;

export const getAuthErrorMessage = (error: unknown, lang: Lang): string => {
  const authError = (error as AuthErrorLike) || {};
  const raw = (authError.message || "").toLowerCase();
  const code = (authError.status || "").toString().toLowerCase();
  const dict = messages[lang];

  if (raw.includes("invalid login credentials")) return dict.invalidCredentials;
  if (raw.includes("already registered") || raw.includes("user already registered") || raw.includes("already exists") || raw.includes("email exists")) {
    return dict.emailAlreadyUsed;
  }
  if (raw.includes("password") && (raw.includes("weak") || raw.includes("least") || raw.includes("minimum"))) {
    return dict.weakPassword;
  }
  if (raw.includes("email not confirmed")) return dict.emailNotConfirmed;
  if (raw.includes("too many") || code === "429") return dict.tooManyRequests;
  if (raw.includes("failed to fetch") || raw.includes("network")) return dict.network;
  if (raw.includes("timeout")) return dict.timeout;

  return dict.generic;
};
