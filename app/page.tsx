import HeroSection from '@/components/home/HeroSection';
import CoreAbility from '@/components/home/CoreAbility';
import ExplainDemo from '@/components/home/ExplainDemo';
import TimeDimension from '@/components/home/TimeDimension';
import TrustSection from '@/components/home/TrustSection';
import SampleQuestions from '@/components/home/SampleQuestions';
import FAQSection from '@/components/home/FAQSection';

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <CoreAbility />
      <ExplainDemo />
      <TimeDimension />
      <TrustSection />
      <SampleQuestions />
      <FAQSection />
    </main>
  );
}
