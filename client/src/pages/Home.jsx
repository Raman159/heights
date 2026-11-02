
import React, { useEffect, useState } from "react";
import { get } from "../api";
import useCollection from "../hooks/useCollection";

import SplashScreen from "../components/home/SplashScreen";
import HeroSection from "../components/home/HeroSection";
import PhilosophySection from "../components/home/PhilosophySection";
import ServicesSection from "../components/home/ServicesSection";
import ExperienceChapters from "../components/home/ExperienceChapters";
import EditorialSection from "../components/home/EditorialSection";
import DiningShowcase from "../components/home/DiningShowcase";
import GallerySection from "../components/home/GallerySection";
import ReviewsSection from "../components/home/ReviewsSection";
import OffersSection from "../components/home/OffersSection";
import HomeCtaSection from "../components/home/HomeCtaSection";
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

export function Home({ showSplash }) {
  const offers = useCollection("offers");
  const reviews = useCollection("reviews");
  const hero = useHeroSettings();

  return (
    <>
      {/* Splash screen - same logic as working code */}
      {showSplash && <SplashScreen />}

      {/* Homepage */}
      <main className="overflow-x-clip bg-cream text-ink">
        <HeroSection settings={hero} />

        <PhilosophySection />

        <ServicesSection />

        <ExperienceChapters />

        <EditorialSection />

        <DiningShowcase />

        <ReviewsSection reviews={reviews} />

        <GallerySection />

        <section
          aria-label="Height reels"
          className="bg-cream py-12 md:py-20"
        >
          <Reels />
        </section>

        <OffersSection offers={offers} />

        <HomeCtaSection />
      </main>
    </>
  );
}
