import media from "./media.json";
export const pic = (q) =>
  media.find((m) => m.original.toLowerCase().includes(q.toLowerCase()))?.url ||
  "/media/00-sauna.webp";
export const services = [
  {
    slug: "spa",
    title: "Spa",
    subtitle: "Restore your balance",
    photo: "Spa at Height",
    description:
      "A sanctuary for mindful restoration, oil-based therapy, dry massage and beautifully considered rituals.",
  },
  {
    slug: "gym",
    title: "Gym",
    subtitle: "Move with intention",
    photo: "Gym.jpg",
    description:
      "A purposeful fitness destination with flexible memberships and space to pursue your goals.",
  },
  {
    slug: "restro",
    title: "Restro",
    subtitle: "Dine above the everyday",
    photo: "_DSC0116-HDR",
    description:
      "Multi-cuisine dining, vibrant hospitality and memorable moments with an elevated view.",
  },
  {
    slug: "salon",
    title: "Salon",
    subtitle: "A little time for yourself",
    photo: "Hair Salon",
    description:
      "Thoughtful personal care and salon experiences designed around you.",
  },
  {
    slug: "steam",
    title: "Steam",
    subtitle: "Unwind in warmth",
    photo: "Steam.jpg",
    description:
      "A soothing steam experience to complement your wellness routine.",
  },
  {
    slug: "sauna",
    title: "Sauna",
    subtitle: "Deep calm, gentle heat",
    photo: "Sauna.jpg",
    description: "Step into restorative warmth and allow your pace to soften.",
  },
  {
    slug: "jacuzzi",
    title: "Jacuzzi",
    subtitle: "Pause in comfort",
    photo: "Jacuzzi_.jpg",
    description: "Unwind and reconnect with an indulgent hydrotherapy escape.",
  },
  {
    slug: "pool",
    title: "Swimming Pool",
    subtitle: "Your elevated escape",
    photo: "Swimming Pool.jpg",
    description:
      "An inviting poolside retreat with an incredible city outlook.",
  },
];
export const spaGroups = [
  {
    name: "Oil Based Massage",
    items: ["Ayurvedic", "Deep Tissue", "Aroma Therapy", "Shirodhara"],
  },
  { name: "Dry Based Massage", items: ["Japanese Shiatsu", "Thai Therapy"] },
  {
    name: "Mini Massage",
    items: ["Facial", "Back", "Head and Shoulder", "Foot / Palm"],
  },
];
export const membership = [
  {
    name: "Elite",
    includes: "Gym, Steam, Sauna, Jacuzzi, Pool",
    prices: [40000, 80000, 130000, 200000],
  },
  {
    name: "Wellness",
    includes: "Gym, Steam, Sauna, Jacuzzi",
    prices: [30000, 70000, 100000, 170000],
  },
  { name: "Fitness", includes: "Gym", prices: [20000, 40000, 70000, 100000] },
];
