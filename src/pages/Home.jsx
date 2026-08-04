import { lazy, Suspense } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import HeroBanner from '@/components/home/HeroBanner';
import TrustStrip from '@/components/home/TrustStrip';
import PromoStrip from '@/components/home/PromoStrip';
import CategoryStrip from '@/components/home/CategoryStrip';
import ProductSection from '@/components/home/ProductSection';
import BrandsBanner from '@/components/home/BrandsBanner';

export default function Home() {
  const { data: featuredData } = useQuery({
    queryKey: ['home-featured'],
    queryFn: () => api.get('/products', { limit: 10, sort: '-createdAt' }),
  });

  const { data: dealsData } = useQuery({
    queryKey: ['home-deals'],
    queryFn: () => api.get('/products', { limit: 8, sort: '-discount' }),
  });

  const { data: trendingData } = useQuery({
    queryKey: ['home-trending'],
    queryFn: () => api.get('/products', { limit: 8, sort: '-rating' }),
  });

  const featured = featuredData?.products || [];
  const deals = dealsData?.products || [];
  const trending = trendingData?.products || [];

  return (
    <div>
      <HeroBanner />
      <TrustStrip />
      <div className="max-w-[1400px] mx-auto px-4">
        <PromoStrip />
        <CategoryStrip />
        <ProductSection title="Top Picks for You" products={featured} viewAllTo="/search?sort=newest" />
        <ProductSection title="Flash Sale" products={deals} viewAllTo="/search?deals=true" />
        <ProductSection title="Trending Now" products={trending} viewAllTo="/search?sort=rating" />
        <BrandsBanner />
      </div>
    </div>
  );
}