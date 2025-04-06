import { Hero } from '@/components/guest/Hero';
import { Features } from '@/components/guest/Features';
import { CTA } from '@/components/guest/CTA';

export default function Home() {
  return (
    <main>
      <Hero />
      <Features />
      <CTA />
    </main>
  );
}