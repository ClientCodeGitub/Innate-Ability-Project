import Link from 'next/link';
import Hero from '@/components/Hero';
import QuoteSection from '@/components/QuoteSection';
import BlueprintSection from '@/components/BlueprintSection';
import TestimonialCarousel from '@/components/TestimonialCarousel';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <QuoteSection />
      <BlueprintSection />
      <TestimonialCarousel />
      <CTASection />
      <Footer />
    </main>
  );
}
