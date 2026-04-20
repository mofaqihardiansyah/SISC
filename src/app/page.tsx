import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { FeaturedSeminars } from "@/components/landing/FeaturedSeminars";
import { StatsSection } from "@/components/landing/StatsSection";
import { CtaSection } from "@/components/landing/CtaSection";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <FeaturedSeminars />
      <StatsSection />
      <CtaSection />
    </div>
  );
}
