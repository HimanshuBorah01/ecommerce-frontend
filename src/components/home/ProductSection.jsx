import { Link } from 'react-router-dom';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { useRef } from 'react';
import ProductCard from '@/components/ui/ProductCard';
import SkeletonCard from '@/components/ui/SkeletonCard';

export default function ProductSection({ title, products = [], viewAllTo, isLoading }) {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    const el = scrollRef.current;
    if (el) el.scrollBy({ left: dir === 'left' ? -300 : 300, behavior: 'smooth' });
  };

  return (
    <section className="my-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg md:text-xl font-bold text-[#111827]" style={{ fontFamily: 'Poppins, sans-serif' }}>
          {title}
        </h2>
        <div className="flex items-center gap-2">
          <button onClick={() => scroll('left')}
            className="hidden md:flex w-8 h-8 rounded-full border border-gray-200 items-center justify-center text-gray-600 hover:border-[#FF5A1F] hover:text-[#FF5A1F] transition-colors">
            <ChevronLeft size={16} />
          </button>
          <button onClick={() => scroll('right')}
            className="hidden md:flex w-8 h-8 rounded-full border border-gray-200 items-center justify-center text-gray-600 hover:border-[#FF5A1F] hover:text-[#FF5A1F] transition-colors">
            <ChevronRight size={16} />
          </button>
          {viewAllTo && (
            <Link to={viewAllTo} className="text-sm text-[#FF5A1F] font-medium hover:underline flex items-center gap-1">
              View All <ChevronRight size={14} />
            </Link>
          )}
        </div>
      </div>

      <div ref={scrollRef} className="flex gap-3 md:gap-4 overflow-x-auto scrollbar-hide pb-2">
        {isLoading
          ? [...Array(6)].map((_, i) => (
              <div key={i} className="flex-shrink-0 w-36 md:w-56"><SkeletonCard /></div>
            ))
          : products.map((p) => (
              <div key={p._id || p.id} className="flex-shrink-0 w-36 md:w-56">
                <ProductCard product={p} />
              </div>
            ))
        }
      </div>
    </section>
  );
}