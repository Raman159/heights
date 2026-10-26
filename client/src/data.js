export const pic = (filename) =>
  filename?.endsWith(".webp") ? `/media/${filename}` : "/media/spa-lobby.webp";
export const serviceCards = [
  {
    name: "Restro",
    img: "/media/restaurant-interior.webp",
    href: "/restro",
    desc: "A rooftop restaurant with a 360° view of the city, serving a variety of cuisines and beverages.",
  },
  {
    name: "Spa",
    img: "/media/spa-lobby.webp",
    href: "/spa",
    desc: "Slow down with restorative treatments designed to relax your body and clear your mind.",
  },
  {
    name: "Gym",
    img: "/media/gym-interior.webp",
    href: "/gym",
    desc: "Move at your own pace in a welcoming space for strength, energy, and everyday wellbeing.",
  },
  {
    name: "Salon",
    img: "/media/salon-chairs.webp",
    href: "/services/salon1",
    desc: "Enjoy thoughtful care and a little time set aside just for you.",
  },
  {
    name: "Steam sauna",
    img: "/media/steam-room.webp",
    href: "/services/steam",
    desc: "Unwind in soothing warmth and let the day's tension melt away.",
  },
  {
    name: "Pool",
    img: "/media/infinity-pool.webp",
    href: "/services/pool",
    desc: "Take a refreshing swim and enjoy a peaceful pause above the city.",
  },
  {
    name: "Jacuzzi",
    img: "/media/jacuzzi-bath.webp",
    href: "/services/jacuzzi",
    desc: "Sink into warm bubbles for an easy, unhurried moment of relaxation.",
  },
];
export const services = [
  {
    slug: "spa",
    title: "Spa",
    subtitle: "Restore your balance",
    photo: "spa-lobby.webp",
    description:
      "A sanctuary for mindful restoration, oil-based therapy, dry massage and beautifully considered rituals.",
  },
  {
    slug: "gym",
    title: "Gym",
    subtitle: "Move with intention",
    photo: "gym-interior.webp",
    description:
      "A purposeful fitness destination with flexible memberships and space to pursue your goals.",
  },
  {
    slug: "restro",
    title: "Restro",
    subtitle: "Dine above the everyday",
    photo: "restaurant-interior.webp",
    description:
      "Multi-cuisine dining, vibrant hospitality and memorable moments with an elevated view.",
  },
  {
    slug: "salon",
    title: "Salon",
    subtitle: "A little time for yourself",
    photo: "salon-chairs.webp",
    description:
      "Thoughtful personal care and salon experiences designed around you.",
  },
  {
    slug: "steam",
    title: "Steam",
    subtitle: "Unwind in warmth",
    photo: "steam-room.webp",
    description:
      "A soothing steam experience to complement your wellness routine.",
  },
  {
    slug: "sauna",
    title: "Sauna",
    subtitle: "Deep calm, gentle heat",
    photo: "wooden-sauna.webp",
    description: "Step into restorative warmth and allow your pace to soften.",
  },
  {
    slug: "jacuzzi",
    title: "Jacuzzi",
    subtitle: "Pause in comfort",
    photo: "jacuzzi-bath.webp",
    description: "Unwind and reconnect with an indulgent hydrotherapy escape.",
  },
  {
    slug: "pool",
    title: "Swimming Pool",
    subtitle: "Your elevated escape",
    photo: "infinity-pool.webp",
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
