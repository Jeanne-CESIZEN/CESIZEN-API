import "dotenv/config";
import { prisma } from "../../src/config/database.js";

const BASE_EMOTIONS = [
  { name: "Joie", emoji: "😊", color: "#FBBF24", score: 5, order: 1 },
  { name: "Colère", emoji: "😠", color: "#EF4444", score: 2, order: 2 },
  { name: "Peur", emoji: "😨", color: "#8B5CF6", score: 2, order: 3 },
  { name: "Tristesse", emoji: "😢", color: "#3B82F6", score: 1, order: 4 },
  { name: "Surprise", emoji: "😮", color: "#F59E0B", score: 4, order: 5 },
  { name: "Dégoût", emoji: "🤢", color: "#6B7280", score: 1, order: 6 },
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
