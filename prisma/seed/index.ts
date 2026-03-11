import "dotenv/config";
import { prisma } from "../../src/config/database.js";
import { createUsers } from "./user.js";
import { createCategories } from "./category.js";
import { createBaseEmotions } from "./baseEmotion.js";
import { createDetailedEmotions } from "./detailedEmotion.js";
import { createDevArticles } from "./devArticle.js";

async function main() {
  console.log("🌱 Starting database seeding...\n");

  try {
    await createUsers();
    await createCategories();
    await createBaseEmotions();
    await createDetailedEmotions();
    await createDevArticles();

    console.log("\n✅ Database seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error during seeding:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
