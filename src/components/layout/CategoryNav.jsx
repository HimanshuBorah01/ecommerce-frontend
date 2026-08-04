import { Link } from 'react-router-dom';
import { Menu, Tag } from 'lucide-react';
import { CATEGORIES } from '@/constants';

export default function CategoryNav() {
  return (
    <div className="border-t border-gray-100 bg-white hidden md:block">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="flex items-center gap-6 overflow-x-auto scrollbar-hide">
          {/* All Categories button */}
          <Link to="/categories" className="flex items-center gap-2 px-4 py-2.5 bg-[#FF5A1F] text-white text-sm font-medium rounded-md whitespace-nowrap flex-shrink-0 hover:bg-[#E64A19] transition-colors">
            <Menu size={16} />
            All Categories
          </Link>

          {CATEGORIES.slice(0, -1).map((cat) =>
          <Link
            key={cat.slug}
            to={`/search?category=${cat.slug}`}
            className="py-2.5 text-sm font-medium text-[#111827] hover:text-[#FF5A1F] whitespace-nowrap transition-colors border-b-2 border-transparent hover:border-[#FF5A1F]">
            
              {cat.name}
            </Link>
          )}

          {/* Deals special */}
          <Link
            to="/search?deals=true"
            className="flex items-center gap-1 py-2.5 text-sm font-medium text-[#FF5A1F] whitespace-nowrap ml-auto flex-shrink-0">
            
            <Tag size={14} />
            Deals
          </Link>

          




          
        </div>
      </div>
    </div>);

}