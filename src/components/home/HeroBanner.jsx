import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const slides = [
  {
    id: 1,
    badge: 'NEW ARRIVALS',
    title: 'Discover Premium',
    highlight: 'Products',
    subtitle: 'Shop the latest products from top brands with the best offers.',
    cta: 'Shop Now',
    ctaTo: '/search?sort=newest',
    secondary: 'Explore Deals',
    secondaryTo: '/search?deals=true',
    bg: 'from-orange-50 to-amber-50',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
    imageAlt: 'Premium headphones',
  },
  {
    id: 2,
    badge: 'FLASH SALE',
    title: 'Big Savings on',
    highlight: 'Smart Gadgets',
    subtitle: 'Up to 60% Off on Best Selling Electronics. Limited time offer!',
    cta: 'Shop Now',
    ctaTo: '/search?category=electronics',
    secondary: 'View All Deals',
    secondaryTo: '/search?deals=true',
    bg: 'from-slate-50 to-blue-50',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
    imageAlt: 'Smart watch',
  },
  {
    id: 3,
    badge: 'TRENDING',
    title: 'Fashion That',
    highlight: 'Speaks You',
    subtitle: 'Explore our curated fashion collection for every occasion.',
    cta: 'Shop Fashion',
    ctaTo: '/search?category=fashion',
    secondary: 'New Arrivals',
    secondaryTo: '/search?sort=newest',
    bg: 'from-pink-50 to-rose-50',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&q=80',
    imageAlt: 'Fashion collection',
  },
];

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  useEffect(() => {
    if (!autoplay) return;
    const t = setInterval(() => setCurrent((c) => (c + 1) % slides.length), 4000);
    return () => clearInterval(t);
  }, [autoplay]);

  const prev = () => { setCurrent((c) => (c - 1 + slides.length) % slides.length); setAutoplay(false); };
  const next = () => { setCurrent((c) => (c + 1) % slides.length); setAutoplay(false); };

  return (
    <div className="relative overflow-hidden bg-white">
      <AnimatePresence mode="wait">
        {slides.map((slide, i) =>
          i === current ? (
            <motion.div
              key={slide.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className={`bg-gradient-to-r ${slide.bg}`}
            >
              <div className="max-w-[1400px] mx-auto px-4 py-6 md:py-12 flex flex-col md:flex-row items-center gap-4 md:gap-8 min-h-[300px] md:min-h-[340px]">
                {/* Text */}
                <div className="flex-1 text-center md:text-left order-2 md:order-1">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
                    className="inline-block px-3 py-1 bg-[#FF5A1F] text-white text-xs font-bold rounded-full mb-3 tracking-wider"
                  >
                    {slide.badge}
                  </motion.div>
                  <motion.h1
                    initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }}
                    className="text-2xl md:text-5xl font-bold text-[#111827] leading-tight mb-1"
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                  >
                    {slide.title}<br />
                    <span className="text-[#FF5A1F]">{slide.highlight}</span>
                  </motion.h1>
                  <motion.p
                    initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
                    className="text-sm md:text-base text-gray-600 mt-2 md:mt-3 mb-4 md:mb-6 max-w-md mx-auto md:mx-0"
                  >
                    {slide.subtitle}
                  </motion.p>
                  <motion.div
                    initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.25 }}
                    className="flex items-center gap-2 md:gap-3 justify-center md:justify-start flex-wrap"
                  >
                    <Link to={slide.ctaTo} className="btn-primary text-sm px-5 py-2.5">
                      {slide.cta} →
                    </Link>
                    <Link to={slide.secondaryTo} className="btn-outline text-sm px-5 py-2.5">
                      {slide.secondary}
                    </Link>
                  </motion.div>
                </div>

                {/* Image */}
                <div style={{ perspective: 1000 }}>
                  <motion.div
                    initial={{ x: 40, opacity: 0, rotateY: -15 }} animate={{ x: 0, opacity: 1, rotateY: 0 }} transition={{ delay: 0.1 }}
                    whileHover={{ rotateY: 8, rotateX: -5, scale: 1.03 }}
                    style={{ transformStyle: 'preserve-3d' }}
                    className="flex-shrink-0 w-full max-w-xs md:w-96 h-44 md:h-64 rounded-2xl overflow-hidden shadow-lg order-1 md:order-2 cursor-pointer"
                  >
                    <img src={slide.image} alt={slide.imageAlt} className="w-full h-full object-cover" />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ) : null
        )}
      </AnimatePresence>

      {/* Nav */}
      <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 hover:bg-white rounded-full shadow flex items-center justify-center text-gray-700 hover:text-[#FF5A1F] transition-all z-10">
        <ChevronLeft size={20} />
      </button>
      <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 hover:bg-white rounded-full shadow flex items-center justify-center text-gray-700 hover:text-[#FF5A1F] transition-all z-10">
        <ChevronRight size={20} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, i) => (
          <button key={i} onClick={() => { setCurrent(i); setAutoplay(false); }}
            className={`rounded-full transition-all duration-300 ${i === current ? 'w-6 h-2 bg-[#FF5A1F]' : 'w-2 h-2 bg-white/60 hover:bg-white'}`}
          />
        ))}
      </div>
    </div>
  );
}