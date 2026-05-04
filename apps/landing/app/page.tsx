import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { SocialProof } from '@/components/SocialProof';
import { FeaturesSection } from '@/components/FeaturesSection';
import { HowItWorks } from '@/components/HowItWorks';
import { PricingSection } from '@/components/PricingSection';
import { FAQSection } from '@/components/FAQSection';
import { FooterCTA } from '@/components/FooterCTA';
import { Footer } from '@/components/Footer';

export default function Home() {
  return (
    <main id="main-content" className="min-h-screen bg-[#0A0A0F] text-white overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <SocialProof />
      <FeaturesSection />
      <HowItWorks />
      <PricingSection />
      <FAQSection />
      <FooterCTA />
      <Footer />
    </main>
  );
}
