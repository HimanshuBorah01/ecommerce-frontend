import { motion } from "framer-motion";
import { Shield, Headphones, Check, IndianRupee } from "lucide-react";
import Logo from "@/components/layout/Logo";

const steps = [
  { label: "Cart", done: true },
  { label: "Address", done: true },
  { label: "Payment", done: true },
  { label: "Processing", active: true },
  { label: "Confirmation", done: false },
];

export default function PaymentProcessing() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <Logo />
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Shield size={16} className="text-green-600" />
          100% Secure Payments
        </div>
      </header>

      {/* Main */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-2xl text-center">
          {/* Stepper */}
          <div className="flex items-center justify-center gap-1 md:gap-2 mb-12">
            {steps.map((s, i) => (
              <div key={s.label} className="flex items-center gap-1 md:gap-2">
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                      s.done
                        ? "bg-[#FF5A1F] border-[#FF5A1F] text-white"
                        : s.active
                          ? "border-[#FF5A1F] bg-white"
                          : "border-gray-200 bg-white text-gray-300"
                    }`}
                  >
                    {s.done ? (
                      <Check size={16} />
                    ) : s.active ? (
                      <motion.div
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ repeat: Infinity, duration: 1.2 }}
                        className="w-3 h-3 rounded-full bg-[#FF5A1F]"
                      />
                    ) : (
                      <Check size={16} />
                    )}
                  </div>
                  <span
                    className={`text-xs ${s.active || s.done ? "text-[#111827] font-medium" : "text-gray-400"}`}
                  >
                    {s.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={`w-8 md:w-16 h-0.5 ${s.done ? "bg-[#FF5A1F]" : "bg-gray-200"}`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Animated graphic */}
          <div className="relative mb-8 flex items-center justify-center">
            <motion.div
              animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute w-48 h-48 rounded-full bg-orange-100"
            />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
              className="w-32 h-32 rounded-full border-4 border-orange-200 border-t-[#FF5A1F] flex items-center justify-center relative"
            >
              <div className="w-24 h-24 bg-white rounded-full shadow-lg flex items-center justify-center flex-col gap-1">
                <IndianRupee size={28} className="text-[#FF5A1F]" />
                <div className="space-y-1">
                  <div className="w-12 h-1.5 bg-gray-200 rounded" />
                  <div className="w-8 h-1.5 bg-gray-200 rounded mx-auto" />
                </div>
              </div>
            </motion.div>
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="absolute bottom-0 right-1/4 w-12 h-12 bg-[#FF5A1F]/10 rounded-full flex items-center justify-center"
            >
              <Shield size={20} className="text-[#FF5A1F]" />
            </motion.div>
          </div>

          <h1
            className="text-2xl md:text-3xl font-bold text-[#111827] mb-2"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Processing Your Payment
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            Please do not close this window or press the back button.
          </p>

          {/* Status box */}
          <div className="bg-[#FFF7F2] rounded-2xl p-5 md:p-6 max-w-md mx-auto">
            <div className="flex items-center gap-2 mb-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              >
                <svg
                  className="w-5 h-5 text-[#FF5A1F]"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="9"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeDasharray="40"
                  />
                </svg>
              </motion.div>
              <p className="font-bold text-sm text-[#111827]">
                This may take a few seconds
              </p>
            </div>
            <p className="text-xs text-gray-500">
              We are securely processing your payment. You will be redirected
              automatically once it's complete.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-100 px-6 py-4 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <Headphones size={14} className="text-[#FF5A1F]" />
          Need Help? Contact our support team
        </div>
        <div className="flex items-center gap-2">
          <Shield size={14} className="text-green-600" />
          Secured by Razorpay
        </div>
      </footer>
    </div>
  );
}
