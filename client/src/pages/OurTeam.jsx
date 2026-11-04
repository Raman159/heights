import React from "react";
import { pic } from "../data";
import { mediaUrl } from "../api";
import useCollection from "../hooks/useCollection";
import Banner from "../components/site/Banner";
import SectionHead from "../components/site/SectionHead";
import TeamMemberCard from "../components/site/TeamMemberCard";

export function OurTeam() {
  const teamMembers = useCollection("team_members");
  const members = (teamMembers || []).map((member) => ({
    id: member.id,
    fullName: member.full_name,
    department: member.department,
    designation: member.designation,
    biography: member.biography,
    image: mediaUrl(member.image_url) || pic("spa-lobby.webp"),
    socials: [
      member.instagram_url && { type: "instagram", href: member.instagram_url },
      member.linkedin_url && { type: "linkedin", href: member.linkedin_url },
      member.email && { type: "email", href: `mailto:${member.email}` },
    ].filter(Boolean),
  }));

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
            {members.map((member, i) => (
              <TeamMemberCard key={member.id} member={member} index={i} />
            ))}
            {teamMembers === null && (
              <p className="col-span-full py-12 text-center text-muted">
                Loading our team…
              </p>
            )}
            {teamMembers?.length === 0 && (
              <p className="col-span-full py-12 text-center text-muted">
                Our team profiles will be here soon.
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}