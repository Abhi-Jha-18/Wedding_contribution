import React from 'react';
import Hero from '../components/landing/Hero';
import HowItWorks from '../components/landing/HowItWorks';
import WhyChooseUs from '../components/landing/WhyChooseUs';
import WishlistPreview from '../components/landing/WishlistPreview';
import FinalCTA from '../components/landing/FinalCTA';

export default function Home() {
  return (
    <div>
      <Hero />
      <HowItWorks />
      <WhyChooseUs />
      <WishlistPreview />
      <FinalCTA />
    </div>
  );
}
