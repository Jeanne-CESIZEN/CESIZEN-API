import "dotenv/config";
import { prisma } from "../../src/config/database.js";

const BASE_EMOTIONS = [
  "Joie",
  "Colère",
  "Peur",
  "Tristesse",
  "Surprise",
  "Dégoût",
];

export async function createBaseEmotions() {
  console.log("⏳ Seeding base emotions");

  const existingBaseEmotions = await prisma.baseEmotion.findMany({
    select: { name: true },
  });

  const existingNames = new Set(existingBaseEmotions.map((item) => item.name));
  const missingBaseEmotions = BASE_EMOTIONS.filter(
    (name) => !existingNames.has(name)
  );

  if (missingBaseEmotions.length > 0) {
    await prisma.baseEmotion.createMany({
      data: missingBaseEmotions.map((name) => ({ name })),
      skipDuplicates: true,
    });
  }

  const totalCount = await prisma.baseEmotion.count();

  console.log(
    `✅ ${missingBaseEmotions.length} base emotions created, ${totalCount} total`
  );
}
