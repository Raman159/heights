
import React, { useEffect, useState } from "react";
import { get } from "../api";
import useCollection from "../hooks/useCollection";

import HeroSection from "../components/home/HeroSection";
import PhilosophySection from "../components/home/PhilosophySection";
import ServicesSection from "../components/home/ServicesSection";
import EditorialSection from "../components/home/EditorialSection";
import ReviewsSection from "../components/home/ReviewsSection";
import OffersSection from "../components/home/OffersSection";
import HomeCtaSection from "../components/home/HomeCtaSection";
import WatermarkDivider from "../components/home/WatermarkDivider";
import Reels from "../components/site/Reels";

const SETTINGS_KEY = "height:public-settings";

function readCachedSettings() {
  try {
    return JSON.parse(localStorage.getItem(SETTINGS_KEY)) || null;
  } catch {
    return null;
  }
}

function useHeroSettings() {
  const [hero, setHero] = useState(readCachedSettings);

  useEffect(() => {
    let alive = true;

    get("/public/settings")
      .then((settings) => {
        if (!alive) return;

        setHero(settings);

        try {
          localStorage.setItem(
            SETTINGS_KEY,
            JSON.stringify(settings)
          );
        } catch {
          // Storage may be unavailable.
        }
      })
      .catch(() => {});

    return () => {
      alive = false;
    };
  }, []);

  return hero;
}

export function Home() {
  const offers = useCollection("offers");
  const reviews = useCollection("reviews");
  const hero = useHeroSettings();

  return (
    <main className="overflow-hidden bg-cream text-ink">
      <HeroSection settings={hero} />

      <PhilosophySection />

      <WatermarkDivider />

      <ServicesSection />

      <WatermarkDivider />

      <EditorialSection />

      <WatermarkDivider />

      <ReviewsSection reviews={reviews} />

      <WatermarkDivider />

      <Reels />

      <WatermarkDivider />

      <OffersSection offers={offers} />

      <WatermarkDivider />

      {/* <HomeCtaSection /> */}
    </main>
  );
}
