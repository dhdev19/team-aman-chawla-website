import { PrismaClient, UserRole } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";
import { config } from "dotenv";

// Load environment variables
config();

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

async function main() {
  // Create PostgreSQL connection pool
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  // Create Prisma Client with PostgreSQL adapter
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({
    adapter: adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
  console.log("🌱 Starting database seed...");

  // Get admin credentials from environment variables
  const adminEmail = process.env.ADMIN_EMAIL || "admin@teamamanchawla.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "changeme123";

  // Check if admin user already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log("✅ Admin user already exists, skipping creation.");
    return;
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  // Create admin user
  const admin = await prisma.user.create({
    data: {
      email: adminEmail,
      password: hashedPassword,
      role: UserRole.ADMIN,
    },
  });

  console.log("✅ Admin user created successfully!");
  console.log(`   Email: ${admin.email}`);
  console.log(`   Role: ${admin.role}`);
  console.log(`   ID: ${admin.id}`);

  // Initialize page stats for navbar items
  const pageNames = [
    "Home",
    "About",
    "Properties",
    "Residential",
    "Plot",
    "Commercial",
    "Offices",
    "Refer",
    "Enquiry",
    "Blogs",
    "Contact",
    "TAC Registration",
  ];

  for (const pageName of pageNames) {
    await prisma.pageStat.upsert({
      where: { pageName },
      update: {},
      create: {
        pageName,
        clickCount: 0,
      },
    });
  }

  console.log("✅ Page stats initialized for all navbar items.");

  console.log("🎉 Database seed completed successfully!");

  // Cleanup
  await prisma.$disconnect();
  await pool.end();
}

main().catch((e) => {
  console.error("❌ Error seeding database:", e);
  process.exit(1);
});
