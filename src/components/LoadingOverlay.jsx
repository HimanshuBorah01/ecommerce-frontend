import { motion, AnimatePresence } from "framer-motion";

export default function LoadingOverlay({ show, message = "Loading..." }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-2xl p-8 flex flex-col items-center gap-4 shadow-2xl">
            <div className="w-12 h-12 border-4 border-orange-100 border-t-[#FF5A1F] rounded-full animate-spin"></div>
            <p className="text-sm font-medium text-[#111827]">{message}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function PageLoader() {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-orange-100 border-t-[#FF5A1F] rounded-full animate-spin"></div>
    </div>
  );
}

export function ButtonLoader() {
  return (
    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block"></span>
  );
}
