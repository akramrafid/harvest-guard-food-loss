import { HeroSection } from "@/components/landing/hero-section"
import { WorkflowSection } from "@/components/landing/workflow-section"
import { FeaturesSection } from "@/components/landing/features-section"
import { CTASection } from "@/components/landing/cta-section"

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <WorkflowSection />
      <FeaturesSection />
      <CTASection />
    </main>
  )
}
