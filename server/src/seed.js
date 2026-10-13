import "dotenv/config";
import bcrypt from "bcryptjs";
import { pool, rows } from "./db.js";
const username = process.env.ADMIN_USER,
  password = process.env.ADMIN_PASSWORD;
if (!username || !password || password.length < 12) {
  console.error("Set ADMIN_USER and ADMIN_PASSWORD (12+ chars) in .env");
  process.exit(1);
}
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
  await rows("INSERT IGNORE INTO settings(`key`,`value`) VALUES (?,?)", [k, v]);
const testimonials = [
  [
    "Raywant Bahadur Singh",
    "Excellent hospitality by the entire team, great service excellence. The 360 view was simply awesome.",
  ],
  [
    "Priyanka Bothra",
    "A spot that combines a great view with excellent service and food.",
  ],
  [
    "Agrim Karki",
    "Amazing views with great ambience! The staff were warm, professional, and very attentive.",
  ],
];
if ((await rows("SELECT COUNT(*) n FROM reviews"))[0].n === 0) {
  for (let i = 0; i < testimonials.length; i++)
    await rows("INSERT INTO reviews(author,quote,sort_order) VALUES (?,?,?)", [
      ...testimonials[i],
      i,
    ]);
}
console.log("Seed complete");
await pool.end();
