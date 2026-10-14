import "dotenv/config";
import bcrypt from "bcryptjs";
import { pool, rows } from "./db.js";
const username = process.env.ADMIN_USER?.trim(),
  password = process.env.ADMIN_PASSWORD;

async function seed() {
  try {
    if (!username || username.length > 80 || !password || password.length < 12)
      throw Error(
        "something went wrong",
      );

    const count = await rows("SELECT COUNT(*) AS total FROM admins");
    if (count[0].total === 0) {
      await rows("INSERT INTO admins(username,password_hash) VALUES (?,?)", [
        username,
        await bcrypt.hash(password, 12),
      ]);
      console.log("Initial admin created");
    } else console.log("Admin already exists: no changes made");

    const defaults = {
      hero_video: "",
      hero_image: "/media/12-the-height-4350.webp",
      whatsapp_number: "",
      contact_email: "",
      address: "",
      opening_hours: "",
    };
    for (const [k, v] of Object.entries(defaults))
      await rows("INSERT IGNORE INTO settings(`key`,`value`) VALUES (?,?)", [
        k,
        v,
      ]);

    console.log("Seed complete");
  } finally {
    await pool.end();
  }
}

seed().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
