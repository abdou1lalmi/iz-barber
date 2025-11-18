import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

// Define schema inline since we can't import TypeScript in .mjs
const services = "services";
const availability = "availability";

const pool = mysql.createPool(process.env.DATABASE_URL);
const db = drizzle(pool);

async function seed() {
  console.log("🌱 Seeding database...");

  try {
    // Insert default services
    console.log("📝 Inserting services...");
    await pool.query(
      `INSERT INTO services (name, description, durationMinutes, price) VALUES
       (?, ?, ?, ?),
       (?, ?, ?, ?),
       (?, ?, ?, ?)`,
      [
        "Basic Haircut", "Classic haircut with wash and style", 30, 2500,
        "Beard Trim", "Beard shaping and trimming", 20, 1500,
        "Haircut + Beard", "Full haircut with beard trim", 45, 3500,
      ]
    );

    // Insert default availability (9 AM - 6 PM, Monday-Saturday, closed Sunday)
    console.log("📅 Inserting availability...");
    await pool.query(
      `INSERT INTO availability (dayOfWeek, startTime, endTime, isOpen) VALUES
       (?, ?, ?, ?),
       (?, ?, ?, ?),
       (?, ?, ?, ?),
       (?, ?, ?, ?),
       (?, ?, ?, ?),
       (?, ?, ?, ?),
       (?, ?, ?, ?)`,
      [
        0, "00:00", "00:00", false,
        1, "09:00", "18:00", true,
        2, "09:00", "18:00", true,
        3, "09:00", "18:00", true,
        4, "09:00", "18:00", true,
        5, "09:00", "18:00", true,
        6, "09:00", "17:00", true,
      ]
    );

    console.log("✅ Seeding complete!");
    await pool.end();
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    await pool.end();
    process.exit(1);
  }
}

seed();
