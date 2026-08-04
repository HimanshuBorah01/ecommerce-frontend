import { Link } from 'react-router-dom';
import { Flame, Package, Trophy, Award } from 'lucide-react';

const banners = [
  { icon: Flame, label: 'Trending Now', sub: 'Explore what\'s trending', to: '/search?sort=rating', color: 'from-orange-500 to-red-500' },
  { icon: Package, label: 'New Arrivals', sub: 'Fresh products just for you', to: '/search?sort=newest', color: 'from-blue-500 to-indigo-500' },
  { icon: Trophy, label: 'Best Sellers', sub: 'Customer favorites handpicked for you', to: '/search?sort=popular', color: 'from-yellow-500 to-orange-500' },
  { icon: Award, label: 'Top Brands', sub: 'Original products trusted by all', to: '/search?brands=true', color: 'from-green-500 to-teal-500' },
];

export default function BrandsBanner() {
  return (
    <section className="my-6 md:my-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {banners.map(({ icon: Icon, label, sub, to, color }) => (
          <Link key={label} to={to}
            className={`bg-gradient-to-br ${color} rounded-xl p-4 md:p-5 text-white hover:shadow-lg hover:scale-[1.02] transition-all group`}>
            <Icon size={24} className="md:hidden mb-2 group-hover:scale-110 transition-transform" />
            <Icon size={28} className="hidden md:block mb-3 group-hover:scale-110 transition-transform" />
            <p className="font-bold text-sm md:text-base">{label}</p>
            <p className="text-xs md:text-sm opacity-90 mt-1 line-clamp-1">{sub}</p>
            <p className="text-xs md:text-sm font-medium mt-2 md:mt-3 opacity-80 group-hover:opacity-100">Shop Now →</p>
          </Link>
        ))}
      </div>
    </section>
  );
}