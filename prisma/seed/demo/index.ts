import "dotenv/config";
import { prisma } from "../../../src/config/database.js";
import bcrypt from "bcrypt";
import { createDemoArticles } from "./articles.js";
import { createDemoTrackerEntries } from "./trackerEntries.js";

// ---------------------------------------------------------------------------
// Seed de démonstration — données réalistes pour la présentation du projet
//
// Usage : npm run db:seed-demo
//
// Ce script est idempotent : il peut être relancé plusieurs fois sans erreur.
// Il ne supprime rien : il crée uniquement si les données n'existent pas.
// ---------------------------------------------------------------------------

async function createDemoUser(): Promise<void> {
  const existing = await prisma.user.findUnique({
    where: { email: "demo@cesizen.fr" },
    select: { id: true },
  });
  if (existing) {
    console.log("ℹ️  Utilisateur demo@cesizen.fr déjà présent — skip.");
    return;
  }

  const hashedPassword = await bcrypt.hash("Demo1234!", 10);
  await prisma.user.create({
    data: {
      email: "demo@cesizen.fr",
      password: hashedPassword,
      firstname: "DEMO",
      lastname: "Martin",
      role: "ADMIN",
      isActive: true,
      gdprAcceptedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // il y a 90 jours
    },
  });
  console.log("✅ Utilisateur demo@cesizen.fr créé (MDP : Demo1234!)");
}

async function main() {
  console.log("🌱 Seed de démonstration CESIZen...\n");

  try {
    await createDemoUser();
    await createDemoArticles();
    await createDemoTrackerEntries();

    console.log("\n✅ Seed de démonstration terminé avec succès !");
    console.log("───────────────────────────────────────────────");
    console.log("   Compte démo : demo@cesizen.fr / Demo1234!");
    console.log("───────────────────────────────────────────────");
  } catch (error) {
    console.error("❌ Erreur pendant le seed de démonstration :", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
