import "dotenv/config";
import { prisma } from "../../../src/config/database.js";

// ---------------------------------------------------------------------------
// Entrées tracker de démonstration — 90 jours de données réalistes
// Simule un utilisateur actif qui suit ses émotions quotidiennement
// ---------------------------------------------------------------------------

// Distribution des émotions de base (nom → poids relatif)
// Reflète une personne globalement équilibrée avec des hauts et des bas
const EMOTION_WEIGHTS: Record<string, number> = {
  Joie: 30,
  Surprise: 12,
  Tristesse: 18,
  Colère: 12,
  Peur: 15,
  Dégoût: 13,
};

// Commentaires optionnels par émotion de base
const COMMENTS: Record<string, (string | null)[]> = {
  Joie: [
    "Belle journée, je me sens bien.",
    "Super retour de réunion, l'équipe était au top.",
    "Petite marche dans le parc, ça m'a vraiment rechargé.",
    "Bonne nouvelle professionnelle aujourd'hui !",
    "Soirée agréable avec des amis.",
    null,
    null,
  ],
  Surprise: [
    "Je ne m'y attendais pas du tout.",
    "Bonne surprise dans ma boîte mail.",
    null,
    "Événement inattendu, mais plutôt positif.",
    null,
  ],
  Tristesse: [
    "Journée difficile, j'ai du mal à trouver de l'énergie.",
    "Pensées mélancoliques ce soir.",
    "Je me sens un peu isolé ces derniers temps.",
    null,
    "Fatigue émotionnelle après une semaine chargée.",
    "J'ai besoin de prendre soin de moi.",
    null,
  ],
  Colère: [
    "Situation frustrante au travail.",
    "Mauvaise communication dans l'équipe, ça m'a agacé.",
    null,
    "J'ai du mal à lâcher prise ce soir.",
    "Impression d'injustice.",
    null,
  ],
  Peur: [
    "Anxiété avant un rendez-vous important.",
    "Inquiétudes pour l'avenir, difficile à gérer.",
    null,
    "Stress accumulé ces derniers jours.",
    "Sensation d'être dépassé par les événements.",
    null,
  ],
  Dégoût: [
    "Situation peu agréable que j'aurais pu éviter.",
    null,
    "Déception face à une personne de confiance.",
    null,
  ],
};

function pickWeighted(weights: Record<string, number>): string {
  const entries = Object.entries(weights);
  const total = entries.reduce((s, [, w]) => s + w, 0);
  let r = Math.random() * total;
  for (const [key, w] of entries) {
    r -= w;
    if (r <= 0) return key;
  }
  return entries[entries.length - 1][0];
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Seeded pseudo-random to ensure reproducible data across runs
let seed = 42;
function seededRandom(): number {
  seed = (seed * 1664525 + 1013904223) & 0xffffffff;
  return (seed >>> 0) / 0xffffffff;
}
function seededWeighted(weights: Record<string, number>): string {
  const entries = Object.entries(weights);
  const total = entries.reduce((s, [, w]) => s + w, 0);
  let r = seededRandom() * total;
  for (const [key, w] of entries) {
    r -= w;
    if (r <= 0) return key;
  }
  return entries[entries.length - 1][0];
}
function seededPick<T>(arr: T[]): T {
  return arr[Math.floor(seededRandom() * arr.length)];
}

export async function createDemoTrackerEntries(): Promise<void> {
  // Find the demo user
  const demoUser = await prisma.user.findFirst({
    where: { email: "demo@cesizen.fr" },
    select: { id: true },
  });
  if (!demoUser) {
    console.warn("⚠️  Utilisateur demo@cesizen.fr introuvable — skip tracker entries.");
    return;
  }

  // Load all detailed emotions grouped by base emotion name
  const baseEmotions = await prisma.baseEmotion.findMany({
    select: { name: true, detailedEmotions: { select: { id: true, name: true } } },
  });
  if (baseEmotions.length === 0) {
    console.warn("⚠️  Aucune émotion de base trouvée — skip tracker entries.");
    return;
  }

  const detailedByBase = new Map(
    baseEmotions.map((be) => [be.name, be.detailedEmotions])
  );

  // Check if entries already exist for this user
  const existing = await prisma.trackerEntry.count({ where: { userId: demoUser.id } });
  if (existing > 0) {
    console.log(`ℹ️  Entrées tracker déjà présentes (${existing}) — skip.`);
    return;
  }

  // Generate 90 days of entries (1 to 2 entries per day, some days skipped)
  const entries: {
    userId: string;
    detailedEmotionId: string;
    comment: string | null;
    createdAt: Date;
    updatedAt: Date;
  }[] = [];

  const now = new Date();

  for (let day = 89; day >= 0; day--) {
    // Skip ~15% of days (weekends or lazy days)
    if (seededRandom() < 0.15) continue;

    const date = new Date(now);
    date.setDate(date.getDate() - day);

    // 1 entry most days, occasionally 2
    const entryCount = seededRandom() < 0.25 ? 2 : 1;

    for (let e = 0; e < entryCount; e++) {
      const baseName = seededWeighted(EMOTION_WEIGHTS);
      const detailedList = detailedByBase.get(baseName) ?? [];
      if (detailedList.length === 0) continue;

      const detailedEmotion = seededPick(detailedList);
      const commentOptions = COMMENTS[baseName] ?? [null];
      const comment = seededPick(commentOptions);

      // Vary time of day: morning (7-9h) or evening (19-22h)
      const isMorning = seededRandom() < 0.35;
      const hour = isMorning
        ? 7 + Math.floor(seededRandom() * 3)
        : 19 + Math.floor(seededRandom() * 4);
      const minute = Math.floor(seededRandom() * 60);

      const entryDate = new Date(date);
      entryDate.setHours(hour, minute, 0, 0);

      entries.push({
        userId: demoUser.id,
        detailedEmotionId: detailedEmotion.id,
        comment,
        createdAt: entryDate,
        updatedAt: entryDate,
      });
    }
  }

  // Insert all entries
  await prisma.trackerEntry.createMany({ data: entries });
  console.log(`✅ ${entries.length} entrées tracker créées pour demo@cesizen.fr`);
}
