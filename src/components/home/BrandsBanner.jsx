import { Link } from 'react-router-dom';
import { Flame, Package, Trophy, Award } from 'lucide-react';
import { motion } from 'framer-motion';

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
        {banners.map(({ icon: Icon, label, sub, to, color }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ delay: i * 0.06, duration: 0.4, ease: "easeOut" }}
            whileHover={{ y: -4 }}
          >
            <Link
              to={to}
              className={`relative block h-full bg-gradient-to-br ${color} rounded-xl p-4 md:p-5 text-white shadow-sm hover:shadow-xl transition-shadow group overflow-hidden`}
            >
              <div className="absolute inset-x-0 top-0 h-px bg-white/40" />
              <Icon size={24} className="md:hidden mb-2 transition-transform duration-300 group-hover:scale-110" />
              <Icon size={28} className="hidden md:block mb-3 transition-transform duration-300 group-hover:scale-110" />
              <p className="font-bold text-sm md:text-base">{label}</p>
              <p className="text-xs md:text-sm opacity-90 mt-1 line-clamp-1">{sub}</p>
              <p className="text-xs md:text-sm font-medium mt-2 md:mt-3 opacity-80 group-hover:opacity-100 transition-opacity">Shop Now →</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
