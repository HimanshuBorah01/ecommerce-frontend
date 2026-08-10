import { motion } from "framer-motion";
import { Truck, RefreshCw, Shield, Tag } from "lucide-react";

const items = [
  { icon: Truck, title: "Free Delivery", desc: "On orders above ₹499" },
  { icon: RefreshCw, title: "Easy Returns", desc: "7 days return policy" },
  { icon: Shield, title: "Secure Payment", desc: "100% secure payment" },
  { icon: Tag, title: "Best Prices", desc: "Guaranteed" },
];

export default function TrustStrip() {
  return (
    <div className="bg-white border-y border-gray-100">
      <div className="max-w-[1400px] mx-auto px-3 md:px-4 py-2 md:py-4 grid grid-cols-2 xl:grid-cols-4 gap-1.5 md:gap-3">
        {items.map(({ icon: Icon, title, desc }, i) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ delay: i * 0.06, duration: 0.35, ease: "easeOut" }}
            whileHover={{ y: -3 }}
            className="flex flex-col items-center text-center min-w-0 overflow-hidden rounded-lg py-1.5 transition-colors hover:bg-orange-50/45"
          >
            <div className="w-8 h-8 md:w-12 md:h-12 bg-orange-50 rounded-full flex items-center justify-center flex-shrink-0 mb-1 md:mb-1.5 shadow-sm ring-1 ring-orange-100">
              <Icon size={15} className="md:hidden text-[#FF5A1F]" />
              <Icon size={20} className="hidden md:block text-[#FF5A1F]" />
            </div>
            <p className="text-[11px] md:text-sm font-semibold text-[#111827] leading-tight">
              {title}
            </p>
            <p className="text-[9px] md:text-xs text-gray-500 mt-0.5 leading-snug">
              {desc}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
