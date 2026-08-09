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
      <div className="max-w-[1400px] mx-auto px-4 py-3 md:py-4 grid grid-cols-2 xl:grid-cols-4 gap-2 md:gap-3">
        {items.map(({ icon: Icon, title, desc }, i) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ scale: 1.05 }}
            className="flex flex-col items-center text-center min-w-0 overflow-hidden"
          >
            <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-50 rounded-full flex items-center justify-center flex-shrink-0 mb-1.5">
              <Icon size={18} className="md:hidden text-[#FF5A1F]" />
              <Icon size={20} className="hidden md:block text-[#FF5A1F]" />
            </div>
            <p className="text-xs md:text-sm font-semibold text-[#111827] leading-tight">
              {title}
            </p>
            <p className="text-[10px] md:text-xs text-gray-500 mt-0.5 leading-snug">
              {desc}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
