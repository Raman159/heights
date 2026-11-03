import React from "react";
import { pic } from "../data";
import Banner from "../components/site/Banner";
import SectionHead from "../components/site/SectionHead";
import TeamMemberCard from "../components/site/TeamMemberCard";

const TEAM_MEMBERS = [
  {
      id: "aarav-shrestha",
      fullName: "Aarav Shrestha",
      department: "Culinary",
      designation: "Head Chef",
      biography:
        "A thoughtful approach to seasonal ingredients and nourishing food shapes every plate from our kitchen.",
      image: pic("../../public/media/breakfast-plate.webp"),
      socials: [
        { type: "instagram", href: "https://instagram.com/aarav.height" },
        { type: "linkedin", href: "https://linkedin.com/in/aarav-shrestha" },
        { type: "email", href: "mailto:aarav@height.example" },
      ],
      
},
  {
      id: "aarav-shrestha",
      fullName: "Aarav Shrestha",
      department: "Culinary",
      designation: "Head Chef",
      biography:
        "A thoughtful approach to seasonal ingredients and nourishing food shapes every plate from our kitchen.",
      image: pic("../../public/media/breakfast-plate.webp"),
      socials: [
        { type: "instagram", href: "https://instagram.com/aarav.height" },
        { type: "linkedin", href: "https://linkedin.com/in/aarav-shrestha" },
        { type: "email", href: "mailto:aarav@height.example" },
      ],

},
  {
      id: "aarav-shrestha",
      fullName: "Aarav Shrestha",
      department: "Culinary",
      designation: "Head Chef",
      biography:
        "A thoughtful approach to seasonal ingredients and nourishing food shapes every plate from our kitchen.",
      image: pic("../../public/media/breakfast-plate.webp"),
      socials: [
        { type: "instagram", href: "https://instagram.com/aarav.height" },
        { type: "linkedin", href: "https://linkedin.com/in/aarav-shrestha" },
        { type: "email", href: "mailto:aarav@height.example" },
      ],

},
  {
    id: "mira-karki",
    fullName: "Mira Karki",
    department: "Guest Experience",
    designation: "Guest Experience Lead",
    biography:
      "Mira brings warmth and care to every detail, helping guests feel welcome from the moment they arrive.",
    image: pic("../../public/media/breakfast-plate.webp"),
    socials: [
      { type: "instagram", href: "https://instagram.com/mira.height" },
      { type: "linkedin", href: "https://linkedin.com/in/mira-karki" },
      { type: "email", href: "mailto:mira@height.example" },
    ],
  },
  {
    id: "suman-rai",
    fullName: "Suman Rai",
    department: "Fitness & Wellness",
    designation: "Wellness Coach",
    biography:
      "Suman helps people build a balanced movement practice with thoughtful guidance and a focus on lasting wellbeing.",
    image: pic("../../public/media/breakfast-plate.webp"),
    socials: [
      { type: "instagram", href: "https://instagram.com/suman.height" },
      { type: "linkedin", href: "https://linkedin.com/in/suman-rai" },
      { type: "email", href: "mailto:suman@height.example" },
    ],
  },
];

export function OurTeam() {
  return (
    <>
      <Banner
        tag="THE PEOPLE OF HEIGHT"
        title="Meet the people behind your wellbeing."
        body="A thoughtful team bringing together warm hospitality, nourishing food, movement, and moments of calm."
        image={pic("spa-reception.webp")}
      />

      <section className="bg-cream py-20 md:py-28">
        <div className="shell">
          <SectionHead
            eyebrow="Our team"
            title="Care, in every detail"
            body="Get to know the people who make every HEIGHT experience feel considered, welcoming, and restorative."
          />

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {TEAM_MEMBERS.map((member, i) => (
              <TeamMemberCard key={member.id} member={member} index={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}