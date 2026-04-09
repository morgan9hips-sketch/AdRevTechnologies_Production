import { AudiencesSection } from '@/components/marketing/home/audiences-section'
import { DocsPreviewSection } from '@/components/marketing/home/docs-preview-section'
import { FinalCtaSection } from '@/components/marketing/home/final-cta-section'
import { HeroSection } from '@/components/marketing/home/hero-section'
import { HowItWorksSection } from '@/components/marketing/home/how-it-works-section'
import { ModulesSection } from '@/components/marketing/home/modules-section'
import { ValueStrip } from '@/components/marketing/home/value-strip'

export default function HomePage() {
  return (
    <div className="relative overflow-hidden bg-[linear-gradient(180deg,#02060f_0%,#06101d_35%,#071321_100%)] text-white">
      <HeroSection />
      <ValueStrip />
      <HowItWorksSection />
      <ModulesSection />
      <AudiencesSection />
      <DocsPreviewSection />
      <FinalCtaSection />
    </div>
  )
}
