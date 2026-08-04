import { Link, useNavigate } from 'react-router-dom';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/lib/AuthContext';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import EmptyState from '@/components/ui/EmptyState';
import ProductCard from '@/components/ui/ProductCard';
import { Heart, ShoppingBag } from 'lucide-react';

export default function Wishlist() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { wishlist, isLoading } = useWishlist();
  const { addToCart } = useCart();

  if (!isAuthenticated) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 py-16">
        <EmptyState
          icon={<Heart size={48} className="text-gray-300" />}
          title="Please login to view your wishlist"
          description="Login to save and view your favorite products."
          actionLabel="Login Now"
          onAction={() => navigate('/login')}
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 py-6">
        <div className="h-8 w-48 skeleton rounded mb-6" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="aspect-[3/4] skeleton rounded-xl" />)}
        </div>
      </div>
    );
  }

  const items = wishlist.map((item) => item.product || item).filter(Boolean);

  if (items.length === 0) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 py-6">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Wishlist' }]} />
        <EmptyState
          icon={<Heart size={48} className="text-gray-300" />}
          title="Your wishlist is empty"
          description="Save items you love by tapping the heart icon on any product."
          actionLabel="Start Shopping"
          onAction={() => navigate('/search')}
        />
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-3 md:px-4 py-4 md:py-6">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Wishlist' }]} />
      <div className="flex items-center justify-between mb-4 md:mb-6 flex-wrap gap-2">
        <h1 className="text-xl md:text-2xl font-bold text-[#111827]" style={{ fontFamily: 'Poppins, sans-serif' }}>
          My Wishlist <span className="text-sm md:text-base font-normal text-gray-500">({items.length} items)</span>
        </h1>
        <Link to="/search" className="text-sm text-[#FF5A1F] font-medium hover:underline flex items-center gap-1">
          <ShoppingBag size={14} /> Continue Shopping
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {items.map((p) => <ProductCard key={p._id || p.id} product={p} />)}
      </div>
    </div>
  );
}