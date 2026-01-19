import "dotenv/config";
import prisma from "../../src/config/database.js";
import { createUsers } from "./user.js";

async function main() {
  console.log("🌱 Starting database seeding...\n");

  try {
    await createUsers();

    console.log("\n✅ Database seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error during seeding:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
