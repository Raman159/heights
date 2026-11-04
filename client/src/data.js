export const pic = (filename) =>
  /\.(webp|jpe?g|png)$/i.test(filename ?? "")
    ? `/media/${filename}`
    : "/media/spa-lobby.webp";


export const Experience = [
  {
    title: "Pool",
    lead: "THE AQUATIC ESCAPE ROOFTOP LIVING",
    name: "Pool",
    img: "/media/infinity-pool.webp",
    href: "/services/pool",
    desc: "Take a refreshing swim and enjoy a peaceful pause above the city.",
  },
  {
    title: "Gym & Fitness",
    lead: "Move with intention.",
    name: "Gym",
    img: "/media/gym-interior.webp",
    href: "/gym",
    desc: "Move at your own pace in a welcoming space for strength, energy, and everyday wellbeing.",
  },
  {
    title: "Restaurant",
    lead: "Savour the moment.",
    name: "Restaurant",
    img: "/media/restaurant-interior.webp",
    href: "/restro",
    desc: "A rooftop restaurant with a 360° view of the city, serving a variety of cuisines and beverages.",
  },
  {
    title: "Bar",
    lead: "Stay a little longer.",
    name: "Bar",
    img: "/media/bar-counter.webp",
    href: "/restro",
    desc: "Settle in for crafted drinks and relaxed rooftop evenings.",
  },
];

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
    href: "/services/salon",
    desc: "Enjoy thoughtful care and a little time set aside just for you.",
  },
  {
    name: "Steam",
    img: "/media/steam-room.webp",
    href: "/services/steam",
    desc: "Unwind in soothing warmth and feel the environment.",
  },
  {
    name: "Sauna",
    img: "/media/sauna-friends.webp",
    href: "/services/sauna",
    desc: "Let the day's tension melt away.",
  },
  {
    name: "Ice Bath",
    img: "/media/sauna-person.webp",
    href: "/services/icebath",
    desc: "Chill from the choas with city view.",
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
export const membership = [
  {
    name: "Elite",
    includes: "Gym, Steam, Sauna, Jacuzzi, Pool",
    prices: [40000, 80000, 130000, 200000],
    featured: true, // shows the "Most complete" badge
  },
  {
    name: "Wellness",
    includes: "Gym, Steam, Sauna, Jacuzzi",
    prices: [30000, 70000, 100000, 170000],
  },
  {
    name: "Retreat",
    includes: "Steam, Sauna, Jacuzzi",
    prices: [25000, 60000, 90000, 150000],
  },
  {
    name: "Fitness",
    includes: "Gym",
    prices: [20000, 40000, 70000, 100000],
  },
];
 
export const dayPass = {
  services: [
    { name: "Gym", price: 2000 },
    { name: "Swimming for Adults", price: 2000 },
    { name: "Swimming for Kids", price: 1000 },
  ],
  packages: [
    { name: "Steam, Sauna, and Jacuzzi", price: 2000 },
    { name: "Gym, Steam, Sauna, and Jacuzzi", price: 4000 },
    { name: "Gym, Steam, Sauna, Jacuzzi, and Pool", price: 5000 },
  ],
};
