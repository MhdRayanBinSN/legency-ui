import type { Metadata } from "next";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import ConsentBanner from "@/components/consent-banner";
import HomeExperience from "@/components/home/home-experience";
import BlogListing from "@/components/blog/blog-listing";
import { blogPosts } from "@/data/blog-posts";

export const metadata: Metadata = {
  title: "Blog | Legency Media",
  description:
    "Insights and strategy for B2B marketing teams on Webflow, SEO, conversion, and website performance.",
};

export default function BlogPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-[var(--bg)] text-[var(--black)]">
        <BlogListing posts={blogPosts} />
      </main>
      <SiteFooter />
      <ConsentBanner />
      <HomeExperience />
    </>
  );
}
