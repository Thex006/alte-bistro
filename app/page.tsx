import { EmberRibbon } from "@/components/ember-ribbon";
import { Hero } from "@/components/hero";
import { MenuSection } from "@/components/menu-section";
import { MobileBookBar } from "@/components/mobile-book-bar";
import { NightChapters } from "@/components/night-chapters";
import { ReviewsBento } from "@/components/reviews-bento";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { StoryBento } from "@/components/story-bento";
import { TaglineReveal } from "@/components/tagline-reveal";
import { VisitSection } from "@/components/visit-section";
import { ScrollProgress } from "@/components/motion/scroll-progress";
import { site } from "@/lib/site";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: site.name,
  servesCuisine: ["West African", "Hungarian", "Fusion"],
  priceRange: "$$$",
  address: {
    "@type": "PostalAddress",
    streetAddress: site.address.street,
    postalCode: "1075",
    addressLocality: "Budapest",
    addressCountry: "HU",
  },
  openingHours: "We-Su 18:00-01:00",
  acceptsReservations: true,
};

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <SiteNav />
      <main id="main">
        <Hero />
        <TaglineReveal />
        <MenuSection />
        <EmberRibbon />
        <NightChapters />
        <StoryBento />
        <ReviewsBento />
        <VisitSection />
      </main>
      <SiteFooter />
      <MobileBookBar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
