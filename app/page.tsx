import SiteHeader from "@/components/site-header";
import Hero from "@/components/home/hero";
import ServiceTiers from "@/components/home/tiers";
import ChannelSightFeature from "@/components/home/quote";
import GoogleReviews from "@/components/home/greviews";
import CaseStudies from "@/components/home/cases";
import ArcMarquee from "@/components/home/arc";
import WorkPlan from "@/components/home/team";
import CapabilitySequence from "@/components/home/separates";
import Guides from "@/components/home/blogteaser";
import SiteFooter from "@/components/site-footer";
import ConsentBanner from "@/components/consent-banner";
import HomeExperience from "@/components/home/home-experience";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-[var(--bg)] text-[var(--black)]">
        <Hero />
        <ServiceTiers />
        <ChannelSightFeature />
        <GoogleReviews />
        <CaseStudies />
        <ArcMarquee />
        <WorkPlan />
        <CapabilitySequence />
        <Guides />
      </main>
      <SiteFooter />
      <ConsentBanner />
      <HomeExperience />
    </>
  );
}
