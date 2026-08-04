import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, X, PartyPopper } from "lucide-react";

export default function NewsletterPopup({ open, onClose, email }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, rotateX: -15 }}
            animate={{ scale: 1, opacity: 1, rotateX: 0 }}
            exit={{ scale: 0.8, opacity: 0, rotateX: 15 }}
            transition={{ type: "spring", duration: 0.5 }}
            style={{ transformStyle: "preserve-3d", perspective: 1000 }}
            className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 transition-colors"
            >
              <X size={18} />
            </button>

            {/* Confetti circles */}
            <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-[#FF5A1F]/10" />
            <div className="absolute -bottom-12 -left-12 w-40 h-40 rounded-full bg-orange-100/50" />

            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-20 h-20 mx-auto mb-5 rounded-full bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center relative z-10"
            >
              <CheckCircle size={40} className="text-white" />
            </motion.div>

            <div className="relative z-10">
              <div className="flex items-center justify-center gap-2 mb-2">
                <PartyPopper size={20} className="text-[#FF5A1F]" />
                <h2
                  className="text-xl font-bold text-[#111827]"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Subscribed Successfully!
                </h2>
              </div>
              <p className="text-sm text-gray-500 mb-2">
                Welcome to the Shopy family! 🎉
              </p>
              <p className="text-sm text-gray-500 mb-6">
                {email
                  ? `We've sent a confirmation to ${email}`
                  : "You'll now receive exclusive offers, deals, and updates."}
              </p>
              <button onClick={onClose} className="btn-primary w-full">
                Start Shopping →
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
