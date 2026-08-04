import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Check,
  ClipboardList,
  Calendar,
  Package,
  Truck,
  CheckCircle,
  ShoppingBag,
  FileText,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function OrderSuccessModal({
  order,
  total,
  paymentMethod,
  onClose,
}) {
  const orderDate = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const orderTime = new Date().toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const steps = [
    {
      icon: ClipboardList,
      label: "Order Confirmed",
      desc: "We've received your order",
      active: true,
    },
    {
      icon: Package,
      label: "Processing",
      desc: "We are preparing your order",
      active: false,
    },
    {
      icon: Truck,
      label: "Shipped",
      desc: "Your order is on the way",
      active: false,
    },
    {
      icon: CheckCircle,
      label: "Delivered",
      desc: "Enjoy your purchase!",
      active: false,
    },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto relative shadow-2xl"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors z-10"
          >
            <X size={18} />
          </button>

          <div className="p-6 text-center">
            {/* Success icon */}
            <div className="relative w-20 h-20 mx-auto mb-4">
              <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-30"></div>
              <div className="relative w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
                <Check size={40} className="text-white" strokeWidth={3} />
              </div>
            </div>

            <h2
              className="text-xl md:text-2xl font-bold text-[#111827] mb-2"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Order Placed Successfully!
            </h2>
            <p className="text-sm text-gray-500 mb-5">
              Thank you for shopping with us. Your order has been placed
              successfully and is being confirmed.
            </p>

            {/* Order info */}
            <div className="bg-green-50 border border-green-100 rounded-lg p-4 mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2 text-left">
                <ClipboardList size={18} className="text-green-600" />
                <div>
                  <p className="text-xs text-gray-500">Order ID</p>
                  <p className="text-sm font-mono font-medium text-[#111827]">
                    #{order?.id || order?._id || "N/A"}
                  </p>
                </div>
              </div>
              <div className="w-px h-10 bg-gray-200"></div>
              <div className="flex items-center gap-2 text-left">
                <Calendar size={18} className="text-green-600" />
                <div>
                  <p className="text-xs text-gray-500">Order Date</p>
                  <p className="text-sm font-medium text-[#111827]">
                    {orderDate}, {orderTime}
                  </p>
                </div>
              </div>
            </div>

            {/* Progress steps */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-[#111827] mb-4">
                What's Next?
              </h3>
              <div className="flex items-center justify-between">
                {steps.map((step, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center flex-1 relative"
                  >
                    {i < steps.length - 1 && (
                      <div
                        className={`absolute top-5 left-1/2 w-full h-0.5 ${step.active ? "bg-green-500" : "bg-gray-200"}`}
                        style={{ zIndex: 0 }}
                      ></div>
                    )}
                    <div
                      className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center mb-2 ${step.active ? "bg-green-500 text-white" : "bg-gray-100 text-gray-400"}`}
                    >
                      <step.icon size={16} />
                    </div>
                    <p
                      className={`text-xs font-medium ${step.active ? "text-[#111827]" : "text-gray-400"}`}
                    >
                      {step.label}
                    </p>
                    <p className="text-[10px] text-gray-400 hidden sm:block">
                      {step.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-between items-center py-3 border-t border-gray-100 mb-4">
              <span className="text-sm text-gray-500">Total Paid</span>
              <span className="text-lg font-bold text-[#FF5A1F]">
                ₹{total?.toLocaleString() || 0}
              </span>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Link
                to="/search"
                onClick={onClose}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 rounded-lg text-sm font-medium text-[#111827] hover:bg-gray-50 transition-colors"
              >
                <ShoppingBag size={16} /> Continue Shopping
              </Link>
              <Link
                to={`/account/orders/${order?.id || order?._id || ""}`}
                onClick={onClose}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#FF5A1F] text-white text-sm font-medium rounded-lg hover:bg-[#E64A19] transition-colors"
              >
                <FileText size={16} /> View Order
              </Link>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
