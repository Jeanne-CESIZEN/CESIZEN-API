import "dotenv/config";
import { prisma } from "../../src/config/database.js";

const CATEGORIES = [
  { name: "Santé mentale", color: "#4B7BE5", iconName: "brain" },
  { name: "Bien-être", color: "#E91E8C", iconName: "heart" },
  { name: "Pratiques", color: "#D4A017", iconName: "leaf" },
  { name: "Croissance", color: "#7C3AED", iconName: "shield" },
  { name: "Relations", color: "#34A853", iconName: "users" },
];

export async function createCategories() {
  console.log("⏳ Seeding categories");

  const existingCategories = await prisma.category.findMany({
    select: { name: true },
  });

  const existingNames = new Set(existingCategories.map((item) => item.name));
  const missingCategories = CATEGORIES.filter(
    (item) => !existingNames.has(item.name)
  );

  if (missingCategories.length > 0) {
    await prisma.category.createMany({
      data: missingCategories,
      skipDuplicates: true,
    });
  }

  const totalCount = await prisma.category.count();

  console.log(
    `✅ ${missingCategories.length} categories created, ${totalCount} total`
  );
}
