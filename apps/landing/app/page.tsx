import { Navbar } from '@/components/navbar';
import { HeroSection } from '@/components/hero-section';
import { SocialProof } from '@/components/social-proof';
import { FeaturesGrid } from '@/components/features-grid';
import { InteractiveDemo } from '@/components/interactive-demo';
import { PricingSection } from '@/components/pricing-section';
import { CodeSnippet } from '@/components/code-snippet';
import { Testimonials } from '@/components/testimonials';
import { Footer } from '@/components/footer';

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[#0a0a0f] overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <SocialProof />
      <FeaturesGrid />
      <InteractiveDemo />
      <PricingSection />
      <CodeSnippet />
      <Testimonials />
      <Footer />
    </main>
  );
}
