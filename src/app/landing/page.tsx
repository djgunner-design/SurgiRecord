import LandingNav from '@/components/landing/nav';
import Hero from '@/components/landing/hero';
import Problems from '@/components/landing/problems';
import Features from '@/components/landing/features';
import Differentiators from '@/components/landing/differentiators';
import Comparison from '@/components/landing/comparison';
import CtaSection from '@/components/landing/cta-section';
import Footer from '@/components/landing/footer';

export default function LandingPage() {
  return (
    <>
      <LandingNav />
      <main>
        <Hero />
        <Problems />
        <Features />
        <Differentiators />
        <Comparison />
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
