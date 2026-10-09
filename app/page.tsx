import SiteHeader from "@/components/site-header";
import Hero from "@/components/home/hero";
import Tiers from "@/components/home/tiers";
import Quote from "@/components/home/quote";
import GoogleReviews from "@/components/home/greviews";
import Cases from "@/components/home/cases";
import ArcMarquee from "@/components/home/arc";
import Team from "@/components/home/team";
import Separates from "@/components/home/separates";
import BlogTeaser from "@/components/home/blogteaser";
import SiteFooter from "@/components/site-footer";
import ConsentBanner from "@/components/consent-banner";
import HomeExperience from "@/components/home/home-experience";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-[var(--bg)] text-[var(--black)]">
        <Hero />
        <Tiers />
        <Quote />
        <GoogleReviews />
        <Cases />
        <ArcMarquee />
        <Team />
        <Separates />
        <BlogTeaser />
      </main>
      <SiteFooter />
      <ConsentBanner />
      <HomeExperience />
    </>
  );
}
