import { Link } from "react-router-dom";
import { ChevronRight, ChevronLeft, Sparkles } from "lucide-react";
import { useRef } from "react";
import { motion } from "framer-motion";
import ProductCard from "@/components/ui/ProductCard";
import SkeletonCard from "@/components/ui/SkeletonCard";

const variants = {
  picks: {
    bg: "bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50",
    border: "border-orange-200",
    headerText: "text-[#b45309]",
    accent: "text-[#FF5A1F]",
    badge: "bg-orange-100 text-[#b45309]",
    hoverAnim: { y: -4, scale: 1.015, zIndex: 50 },
    hoverShadow: "hover:shadow-[0_18px_40px_-12px_rgba(255,90,31,0.35)]",
  },
  flash: {
    bg: "bg-gradient-to-br from-rose-50 via-red-50 to-pink-50",
    border: "border-rose-200",
    headerText: "text-[#be123c]",
    accent: "text-[#e11d48]",
    badge: "bg-rose-100 text-[#be123c]",
    hoverAnim: { y: -4, scale: 1.015, zIndex: 50 },
    hoverShadow: "hover:shadow-[0_18px_40px_-12px_rgba(225,29,72,0.35)]",
  },
  new: {
    bg: "bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50",
    border: "border-emerald-200",
    headerText: "text-[#047857]",
    accent: "text-[#059669]",
    badge: "bg-emerald-100 text-[#047857]",
    hoverAnim: { y: -4, scale: 1.015, zIndex: 50 },
    hoverShadow: "hover:shadow-[0_18px_40px_-12px_rgba(16,185,129,0.35)]",
  },
  trending: {
    bg: "bg-gradient-to-br from-indigo-50 via-violet-50 to-purple-50",
    border: "border-indigo-200",
    headerText: "text-[#4338ca]",
    accent: "text-[#6366f1]",
    badge: "bg-indigo-100 text-[#4338ca]",
    hoverAnim: { y: -4, scale: 1.015, zIndex: 50 },
    hoverShadow: "hover:shadow-[0_18px_40px_-12px_rgba(99,102,241,0.35)]",
  },
  best: {
    bg: "bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50",
    border: "border-sky-200",
    headerText: "text-[#0369a1]",
    accent: "text-[#0ea5e9]",
    badge: "bg-sky-100 text-[#0369a1]",
    hoverAnim: { scale: 1.015, y: -4, zIndex: 50 },
    hoverShadow: "hover:shadow-[0_18px_40px_-12px_rgba(14,165,233,0.4)]",
  },
};

export default function ProductSection({
  title,
  subtitle,
  products = [],
  viewAllTo,
  isLoading,
  variant = "picks",
}) {
  const scrollRef = useRef(null);
  const cfg = variants[variant] || variants.picks;

  const scroll = (dir) => {
    const el = scrollRef.current;
    if (el) {
      el.scrollBy({ left: dir === "left" ? -300 : 300, behavior: "smooth" });
    }
  };

  const handleWheelScroll = (e) => {
    const el = scrollRef.current;
    if (!el) return;

    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    const maxScroll = el.scrollWidth - el.clientWidth;
    const canScroll =
      maxScroll > 0 &&
      ((delta > 0 && el.scrollLeft < maxScroll - 1) ||
        (delta < 0 && el.scrollLeft > 1));

    if (!canScroll) return;

    e.preventDefault();
    el.scrollLeft += delta * 0.7;
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`my-4 md:my-5 rounded-xl ${cfg.bg} border ${cfg.border} p-3 md:p-4 overflow-visible relative z-10`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2 md:mb-3">
        <div className="flex items-center gap-2">
          <motion.div
            initial={{ rotate: -20, scale: 0.8 }}
            whileInView={{ rotate: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className={`w-7 h-7 md:w-8 md:h-8 rounded-lg ${cfg.badge} flex items-center justify-center shadow-sm`}
          >
            <Sparkles size={14} className={cfg.accent} />
          </motion.div>
          <div>
            <h2
              className={`text-base md:text-lg font-bold ${cfg.headerText}`}
              style={{ fontFamily: "Poppins, sans-serif", lineHeight: 1.2 }}
            >
              {title}
            </h2>
            {subtitle && (
              <p className="hidden md:block text-xs text-gray-500 mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => scroll("left")}
            className="hidden md:flex w-8 h-8 rounded-full bg-white border border-gray-200 items-center justify-center text-gray-600 hover:border-[#FF5A1F] hover:text-[#FF5A1F] transition-colors shadow-sm"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => scroll("right")}
            className="hidden md:flex w-8 h-8 rounded-full bg-white border border-gray-200 items-center justify-center text-gray-600 hover:border-[#FF5A1F] hover:text-[#FF5A1F] transition-colors shadow-sm"
          >
            <ChevronRight size={16} />
          </button>
          {viewAllTo && (
            <Link
              to={viewAllTo}
              className={`hidden md:flex text-sm font-medium hover:underline items-center gap-1 ${cfg.accent}`}
            >
              View All <ChevronRight size={14} />
            </Link>
          )}
        </div>
      </div>

      {/* Cards */}
      <div className="px-0 md:px-2 py-2">
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto overflow-y-visible scrollbar-hide overscroll-x-contain p-4 md:p-5"
          style={{ WebkitOverflowScrolling: "touch" }}
          onWheel={handleWheelScroll}
        >
          {isLoading
            ? [...Array(6)].map((_, i) => (
                <div key={i} className="flex-shrink-0 w-52 sm:w-56 md:w-56">
                  <SkeletonCard />
                </div>
              ))
            : products.map((p, i) => (
                <motion.div
                  key={p._id || p.id}
                  className={`flex-shrink-0 w-52 sm:w-56 md:w-60 ${cfg.hoverShadow} transition-shadow duration-300 overflow-visible`}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{
                    duration: 0.4,
                    delay: i * 0.05,
                    ease: "easeOut",
                  }}
                  whileHover={cfg.hoverAnim}
                >
                  <ProductCard product={p} />
                </motion.div>
              ))}
        </div>
      </div>

      {/* Mobile view all */}
      {viewAllTo && (
        <div className="mt-3 md:hidden text-center">
          <Link
            to={viewAllTo}
            className={`inline-flex items-center gap-1 text-sm font-semibold ${cfg.accent}`}
          >
            View All <ChevronRight size={14} />
          </Link>
        </div>
      )}
    </motion.section>
  );
}
