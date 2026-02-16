import "dotenv/config";
import { prisma } from "../../src/config/database.js";

const DETAILED_EMOTION_REFERENTIAL: Record<string, string[]> = {
  Joie: [
    "Fierté",
    "Contentement",
    "Enchantement",
    "Excitation",
    "Émerveillement",
    "Gratitude",
  ],
  Colère: [
    "Frustration",
    "Irritation",
    "Rage",
    "Ressentiment",
    "Agacement",
    "Hostilité",
  ],
  Peur: [
    "Inquiétude",
    "Anxiété",
    "Terreur",
    "Appréhension",
    "Panique",
    "Crainte",
  ],
  Tristesse: [
    "Chagrin",
    "Mélancolie",
    "Abattement",
    "Désespoir",
    "Solitude",
    "Dépression",
  ],
  Surprise: [
    "Étonnement",
    "Étonnement",
    "Stupéfaction",
    "Sidération",
    "Incrédule",
    "Émerveillement",
    "Confusion",
  ],
  "Dégoût": [
    "Répulsion",
    "Déplaisir",
    "Nausée",
    "Dédain",
    "Horreur",
    "Dégoût profond",
  ],
};

export async function createDetailedEmotions() {
  console.log("⏳ Seeding detailed emotions");

  const baseEmotions = await prisma.baseEmotion.findMany({
    select: { id: true, name: true },
  });

  const baseEmotionByName = new Map(
    baseEmotions.map((baseEmotion) => [baseEmotion.name, baseEmotion.id])
  );

  const missingBaseEmotionNames = Object.keys(DETAILED_EMOTION_REFERENTIAL)
    .filter((name) => !baseEmotionByName.has(name));

  if (missingBaseEmotionNames.length > 0) {
    throw new Error(
      `MISSING_BASE_EMOTIONS_FOR_DETAILED_SEED: ${missingBaseEmotionNames.join(
        ", "
      )}`
    );
  }

  const referentialRows = Object.entries(DETAILED_EMOTION_REFERENTIAL).flatMap(
    ([baseEmotionName, detailedEmotionNames]) => {
      const baseEmotionId = baseEmotionByName.get(baseEmotionName)!;
      const uniqueNamesInBase = [...new Set(detailedEmotionNames)];

      return uniqueNamesInBase.map((name) => ({
        baseEmotionId,
        name,
      }));
    }
  );

  const existingDetailedEmotions = await prisma.detailedEmotion.findMany({
    select: { baseEmotionId: true, name: true },
  });

  const existingKeys = new Set(
    existingDetailedEmotions.map(
      (item) => `${item.baseEmotionId.toString()}::${item.name}`
    )
  );

  const missingDetailedEmotions = referentialRows.filter(
    (row) => !existingKeys.has(`${row.baseEmotionId}::${row.name}`)
  );

  if (missingDetailedEmotions.length > 0) {
    await prisma.detailedEmotion.createMany({
      data: missingDetailedEmotions,
      skipDuplicates: true,
    });
  }

  const totalCount = await prisma.detailedEmotion.count();

  console.log(
    `✅ ${missingDetailedEmotions.length} detailed emotions created, ${totalCount} total`
  );
}
