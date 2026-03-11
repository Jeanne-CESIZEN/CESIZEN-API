import "dotenv/config";
import { prisma } from "../../src/config/database.js";

const BASE_EMOTIONS = [
  { name: "Joie", emoji: "😊" },
  { name: "Colère", emoji: "😠" },
  { name: "Peur", emoji: "😨" },
  { name: "Tristesse", emoji: "😢" },
  { name: "Surprise", emoji: "😮" },
  { name: "Dégoût", emoji: "🤢" },
];

export async function createBaseEmotions() {
  console.log("⏳ Seeding base emotions");

  const existingBaseEmotions = await prisma.baseEmotion.findMany({
    select: { name: true },
  });

  const existingNames = new Set(existingBaseEmotions.map((item) => item.name));
  const missingBaseEmotions = BASE_EMOTIONS.filter(
    (item) => !existingNames.has(item.name)
  );

  if (missingBaseEmotions.length > 0) {
    await prisma.baseEmotion.createMany({
      data: missingBaseEmotions,
      skipDuplicates: true,
    });
  }

  const totalCount = await prisma.baseEmotion.count();

  console.log(
    `✅ ${missingBaseEmotions.length} base emotions created, ${totalCount} total`
  );
}
