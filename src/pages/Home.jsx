import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import HeroBanner from "@/components/home/HeroBanner";
import TrustStrip from "@/components/home/TrustStrip";
import PromoStrip from "@/components/home/PromoStrip";
import ProductSection from "@/components/home/ProductSection";
import BrandsBanner from "@/components/home/BrandsBanner";

export default function Home() {
  // Fetch the available products once. All sections will reuse this data so
  // every section is populated (the user can fine-tune per-section queries later).
  const { data: productsData } = useQuery({
    queryKey: ["home-products"],
    queryFn: () => api.get("/products", { limit: 20 }),
  });

  const products = productsData?.products || [];

  return (
    <div>
      <HeroBanner />
      <TrustStrip />

      <div className="max-w-[1400px] mx-auto px-4 overflow-visible">
        {/* Top Picks — orange/amber gradient */}
        <ProductSection
          title="Top Picks for You"
          subtitle="Handpicked favourites just for you"
          variant="picks"
          products={products}
          viewAllTo="/search?sort=newest"
        />

        {/* Flash Sale — rose gradient */}
        <ProductSection
          title="Flash Sale"
          subtitle="Up to 60% off · Limited time deals"
          variant="flash"
          products={products}
          viewAllTo="/search?deals=true"
        />

        <PromoStrip />

        {/* New Arrivals — emerald/teal gradient */}
        <ProductSection
          title="New Arrivals"
          subtitle="Fresh products just dropped"
          variant="new"
          products={products}
          viewAllTo="/search?sort=newest"
        />

        {/* Trending Now — indigo/violet gradient */}
        <ProductSection
          title="Trending Now"
          subtitle="What everyone is loving right now"
          variant="trending"
          products={products}
          viewAllTo="/search?sort=rating"
        />

        {/* Best Sellers — sky/cyan gradient */}
        <ProductSection
          title="Best Sellers"
          subtitle="Customer favourites, all-time bests"
          variant="best"
          products={products}
          viewAllTo="/search?sort=popular"
        />

        <BrandsBanner />
      </div>
    </div>
  );
}
