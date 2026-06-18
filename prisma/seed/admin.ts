import "dotenv/config";
import bcrypt from "bcrypt";
import { prisma } from "../../src/config/database.js";

/**
 * Création / réinitialisation d'un compte administrateur — SANS données de démo.
 * Destiné à la production : on ne lance pas le seed complet, on injecte
 * uniquement l'admin initial.
 *
 * Les identifiants sont fournis au runtime via variables d'environnement
 * (jamais en clair dans le code ni dans l'image) :
 *
 *   ADMIN_EMAIL=...  ADMIN_PASSWORD=...  [ADMIN_FIRSTNAME] [ADMIN_LASTNAME]
 *
 * Idempotent : ré-exécuter met à jour le mot de passe / réactive le compte.
 */
async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const firstname = process.env.ADMIN_FIRSTNAME ?? "Admin";
  const lastname = process.env.ADMIN_LASTNAME ?? "CESIZen";

  if (!email || !password) {
    console.error("❌ Variables requises : ADMIN_EMAIL et ADMIN_PASSWORD.");
    process.exit(1);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: { password: hashedPassword, role: "ADMIN", isActive: true },
    create: {
      email,
      password: hashedPassword,
      role: "ADMIN",
      firstname,
      lastname,
      gdprAcceptedAt: new Date(),
    },
  });

  console.log(`✅ Administrateur prêt : ${user.email} (role=${user.role})`);
}

main()
  .catch((error) => {
    console.error("❌ Échec de la création de l'admin :", error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
