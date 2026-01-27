import "dotenv/config"; // ← Ajouter aussi ici par sécurité
import { prisma } from "../../src/config/database.js";
import bcrypt from "bcrypt";

export async function createUsers() {
  console.log(`⏳ Seeding users`);

  const existingCount = await prisma.user.count();
  let createdCounter = 0;

  if (existingCount === 0) {
    const hashedUserPassword = await bcrypt.hash("user", 10);
    const hashedAdminPassword = await bcrypt.hash("admin", 10);

    await prisma.user.createMany({
      data: [
        {
          email: "admin@admin.com",
          password: hashedAdminPassword,
          role: "ADMIN",
          firstname: "Admin",
          lastname: "CESIZEN",
        },
        {
          email: "user@user.com",
          password: hashedUserPassword,
          role: "USER",
          firstname: "User",
          lastname: "Test",
        },
      ],
    });

    createdCounter = 2;
  }

  console.log(
    `✅ ${existingCount} existing users 👉 ${createdCounter} users created`
  );
  console.log(`👉 Admin: "admin@admin.com" / "admin"`);
  console.log(`👉 User: "user@user.com" / "user"`);
}
