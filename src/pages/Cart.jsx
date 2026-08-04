import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/lib/AuthContext";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import EmptyState from "@/components/ui/EmptyState";
import {
  Trash2,
  Minus,
  Plus,
  ShoppingBag,
  ArrowRight,
  Tag,
  Shield,
  Truck,
} from "lucide-react";
import { useState } from "react";

export default function Cart() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { cart, cartCount, cartTotal, isLoading, updateQuantity, removeItem } =
    useCart();
  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");

  if (!isAuthenticated) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 py-16">
        <EmptyState
          icon={<ShoppingBag size={48} className="text-gray-300" />}
          title="Please login to view your cart"
          description="Login to your account to see items in your cart and proceed to checkout."
          actionLabel="Login Now"
          onAction={() => navigate("/login")}
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 py-6">
        <div className="h-8 w-48 skeleton rounded mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 skeleton rounded-xl" />
            ))}
          </div>
          <div className="h-64 skeleton rounded-xl" />
        </div>
      </div>
    );
  }

  const items = cart?.items || [];
  const subtotal = cart?.totalPrice || cart?.total || cartTotal || 0;
  const discount = appliedCoupon?.discount || 0;
  const shipping = subtotal > 499 ? 0 : 49;
  const total = Math.max(0, subtotal - discount) + shipping;

  const applyCoupon = () => {
    setCouponError("");
    if (!coupon.trim()) return;
    if (coupon.toUpperCase() === "SHOPY10") {
      setAppliedCoupon({
        code: "SHOPY10",
        discount: Math.round(subtotal * 0.1),
      });
    } else if (coupon.toUpperCase() === "FLAT100" && subtotal > 500) {
      setAppliedCoupon({ code: "FLAT100", discount: 100 });
    } else {
      setCouponError("Invalid coupon code or minimum amount not met");
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 py-6">
        <Breadcrumb items={[{ label: "Home", to: "/" }, { label: "Cart" }]} />
        <EmptyState
          icon={<ShoppingBag size={48} className="text-gray-300" />}
          title="Your cart is empty"
          description="Looks like you haven't added anything to your cart yet. Start shopping to fill it up!"
          actionLabel="Continue Shopping"
          onAction={() => navigate("/search")}
        />
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-3 md:px-4 py-4 md:py-6">
      <Breadcrumb items={[{ label: "Home", to: "/" }, { label: "Cart" }]} />
      <h1
        className="text-xl md:text-2xl font-bold text-[#111827] mb-4 md:mb-6"
        style={{ fontFamily: "Poppins, sans-serif" }}
      >
        Shopping Cart{" "}
        <span className="text-sm md:text-base font-normal text-gray-500">
          ({cartCount} items)
        </span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => {
            const product = item.product || item.productId || {};
            const itemId = item._id || item.id || product._id || product.id;
            const name = product.name || product.title || "Product";
            const image =
              product.images?.[0]?.url ||
              product.image ||
              product.thumbnail ||
              "";
            const price = item.price || product.price || 0;
            const qty = item.quantity || 1;
            return (
              <div
                key={itemId}
                className="bg-white rounded-xl border border-gray-200 p-3 md:p-4 flex gap-3 md:gap-4"
              >
                <Link
                  to={`/product/${product._id || product.id}`}
                  className="w-16 h-20 md:w-20 md:h-24 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0"
                >
                  {image ? (
                    <img
                      src={image}
                      alt={name}
                      className="w-full h-full object-contain p-1"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <ShoppingBag size={24} />
                    </div>
                  )}
                </Link>
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/product/${product._id || product.id}`}
                    className="text-sm font-medium text-[#111827] hover:text-[#FF5A1F] line-clamp-2"
                  >
                    {name}
                  </Link>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {product.brand || product.category}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-base font-bold text-[#111827]">
                      ₹{(price * qty).toLocaleString()}
                    </span>
                    {product.originalPrice && product.originalPrice > price && (
                      <span className="text-xs text-gray-400 line-through">
                        ₹{(product.originalPrice * qty).toLocaleString()}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-gray-200 rounded-lg">
                      <button
                        onClick={() =>
                          updateQuantity(itemId, Math.max(1, qty - 1))
                        }
                        className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-[#FF5A1F]"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-8 text-center text-sm font-medium">
                        {qty}
                      </span>
                      <button
                        onClick={() => updateQuantity(itemId, qty + 1)}
                        className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-[#FF5A1F]"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(itemId)}
                      className="text-sm text-gray-400 hover:text-red-500 flex items-center gap-1 transition-colors"
                    >
                      <Trash2 size={14} /> Remove
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-bold text-[#111827] mb-4">Order Summary</h3>

            {/* Coupon */}
            <div className="mb-4 pb-4 border-b border-gray-100">
              <div className="flex gap-2">
                <div className="flex-1 flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg">
                  <Tag size={14} className="text-gray-400" />
                  <input
                    type="text"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    placeholder="Coupon code"
                    className="flex-1 text-sm focus:outline-none bg-transparent"
                  />
                </div>
                <button
                  onClick={applyCoupon}
                  className="px-4 py-2 bg-[#111827] text-white text-sm font-medium rounded-lg hover:bg-gray-800"
                >
                  Apply
                </button>
              </div>
              {couponError && (
                <p className="text-xs text-red-500 mt-1">{couponError}</p>
              )}
              {appliedCoupon && (
                <p className="text-xs text-green-600 mt-1">
                  ✓ Coupon {appliedCoupon.code} applied
                </p>
              )}
              <p className="text-xs text-gray-400 mt-1">
                Try: SHOPY10 or FLAT100
              </p>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-medium">
                  ₹{subtotal.toLocaleString()}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-₹{discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-500">Shipping</span>
                <span className="font-medium">
                  {shipping === 0 ? "FREE" : `₹${shipping}`}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-gray-400">
                  Add ₹{(499 - subtotal).toLocaleString()} more for free
                  shipping
                </p>
              )}
            </div>

            <div className="flex justify-between pt-3 mt-3 border-t border-gray-100">
              <span className="font-bold text-[#111827]">Total</span>
              <span className="font-bold text-[#FF5A1F] text-lg">
                ₹{total.toLocaleString()}
              </span>
            </div>

            <button
              onClick={() => navigate("/checkout")}
              className="btn-primary w-full mt-4"
            >
              Proceed to Checkout <ArrowRight size={16} />
            </button>
            <Link
              to="/search"
              className="block text-center text-sm text-gray-500 hover:text-[#FF5A1F] mt-3"
            >
              Continue Shopping
            </Link>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
            {[
              { icon: Truck, label: "Free delivery on orders above ₹499" },
              { icon: Shield, label: "100% secure payment" },
              { icon: ShoppingBag, label: "Easy 7-day returns" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 text-sm text-gray-600"
              >
                <Icon size={16} className="text-[#FF5A1F]" /> {label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
