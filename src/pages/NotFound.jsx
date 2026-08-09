import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Search, Package, ArrowRight } from "lucide-react";

const floatContainer = {
  animate: {
    y: [0, -14, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const floatSlow = {
  animate: {
    y: [0, -20, 0],
    x: [0, 8, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const floatFast = {
  animate: {
    y: [0, 12, 0],
    x: [0, -10, 0],
    transition: {
      duration: 3.5,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const stagger = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 120, damping: 14 },
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 overflow-hidden relative bg-gradient-to-br from-[#FFF7F0] via-[#F8FAFC] to-[#FFEFE5]">
      {/* Decorative blurred blobs */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-orange-200/40 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-amber-200/40 rounded-full blur-3xl"></div>

      {/* Floating decorative elements */}
      <motion.div
        variants={floatContainer}
        animate="animate"
        className="absolute top-16 left-[12%] text-orange-300/50 hidden sm:block"
      >
        <Package size={56} />
      </motion.div>
      <motion.div
        variants={floatSlow}
        animate="animate"
        className="absolute bottom-20 right-[14%] text-orange-400/40 hidden sm:block"
      >
        <Search size={64} />
      </motion.div>
      <motion.div
        variants={floatFast}
        animate="animate"
        className="absolute top-1/3 right-[8%] w-16 h-16 rounded-2xl bg-orange-200/50 rotate-12 hidden sm:block"
      ></motion.div>
      <motion.div
        variants={floatContainer}
        animate="animate"
        className="absolute bottom-1/3 left-[10%] w-10 h-10 rounded-full bg-amber-200/60 hidden sm:block"
      ></motion.div>

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="max-w-md w-full text-center relative z-10"
      >
        {/* Animated 404 number */}
        <motion.div
          variants={floatContainer}
          animate="animate"
          className="relative inline-block mb-4"
        >
          <motion.div
            animate={{
              scale: [1, 1.02, 1],
              rotate: [0, -2, 2, 0],
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="text-8xl md:text-9xl font-bold leading-none"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5A1F] via-orange-400 to-amber-500">
              404
            </span>
          </motion.div>
          <motion.div
            animate={{ scaleX: [0, 1], opacity: [1, 0.6, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="h-1 w-2/3 mx-auto bg-gradient-to-r from-[#FF5A1F] to-amber-400 rounded-full mt-2"
          />
        </motion.div>

        {/* Search icon in a pulsing ring */}
        <motion.div variants={item} className="mb-6">
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="relative w-20 h-20 mx-auto"
          >
            <div className="absolute inset-0 bg-orange-200/50 rounded-full animate-ping"></div>
            <div className="relative w-20 h-20 bg-gradient-to-br from-[#FF5A1F] to-orange-400 rounded-full flex items-center justify-center shadow-lg shadow-orange-200">
              <Search size={34} className="text-white" />
            </div>
          </motion.div>
        </motion.div>

        <motion.h2
          variants={item}
          className="text-2xl md:text-3xl font-bold text-[#111827] mb-3"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          Page Not Found
        </motion.h2>

        <motion.p
          variants={item}
          className="text-gray-500 mb-8 leading-relaxed"
        >
          Oops! The page you're looking for doesn't exist or has been moved.
          Let's get you back on track.
        </motion.p>

        <motion.div
          variants={item}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#FF5A1F] text-white text-sm font-semibold rounded-lg hover:bg-[#E64A19] shadow-md shadow-orange-200 transition-all hover:-translate-y-0.5"
          >
            <Home size={16} /> Go Home
          </Link>
          <Link
            to="/search"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-[#FF5A1F] text-[#FF5A1F] text-sm font-semibold rounded-lg hover:bg-orange-50 transition-all hover:-translate-y-0.5"
          >
            Browse Products <ArrowRight size={16} />
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
