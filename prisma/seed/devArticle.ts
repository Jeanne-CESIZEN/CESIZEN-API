import "dotenv/config";
import { prisma } from "../../src/config/database.js";

const DEV_ARTICLE_CONTENT =
  "Ceci est un article de démonstration utilisé pour le seed de développement.";

export async function createDevArticles() {
  if (process.env.NODE_ENV === "production") {
    console.log("ℹ️  Skipping dev articles in production");
    return;
  }

  console.log("⏳ Seeding dev articles (one per category)");

  const categories = await prisma.category.findMany({
    select: { id: true, name: true },
  });

  let createdCount = 0;

  for (const category of categories) {
    const title = `Article de démo - ${category.name}`;

    const exists = await prisma.article.findFirst({
      where: { categoryId: category.id, title },
      select: { id: true },
    });

    if (exists) continue;

    await prisma.article.create({
      data: {
        categoryId: category.id,
        title,
        description: `Article fictif lié à la catégorie ${category.name}.`,
        content: DEV_ARTICLE_CONTENT,
      },
    });

    createdCount += 1;
  }

  const totalCount = await prisma.article.count();

  console.log(
    `✅ ${createdCount} dev articles created, ${totalCount} total articles`
  );
}
