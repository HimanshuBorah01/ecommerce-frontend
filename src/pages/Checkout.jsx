import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/lib/AuthContext";
import { api } from "@/lib/api";
import { openRazorpayCheckout } from "@/lib/razorpay";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import OrderSuccessModal from "@/components/OrderSuccessModal";
import PaymentProcessing from "@/components/PaymentProcessing";
import {
  CreditCard,
  MapPin,
  Truck,
  Shield,
  Check,
  ChevronRight,
  Plus,
} from "lucide-react";
import { PAYMENT_METHODS } from "@/constants";

const emptyAddress = {
  fullName: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  pinCode: "",
};

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [placing, setPlacing] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(null);
  const [paymentError, setPaymentError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [address, setAddress] = useState({
    ...emptyAddress,
    fullName: user?.name || "",
    phone: user?.phone || "",
  });

  // Fetch saved addresses for the current user.
  const { data: addressesData } = useQuery({
    queryKey: ["addresses"],
    queryFn: () => api.get("/addresses"),
    enabled: !!user,
  });

  useEffect(() => {
    const list = Array.isArray(addressesData?.addresses)
      ? addressesData.addresses
      : Array.isArray(addressesData)
        ? addressesData
        : [];
    setSavedAddresses(list);
    if (list.length > 0) {
      const def = list.find((a) => a.isDefault) || list[0];
      setSelectedAddressId(def._id || def.id);
    }
  }, [addressesData]);

  const items = cart?.items || [];
  const subtotal = cartTotal || 0;
  const shipping = subtotal > 499 ? 0 : 49;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + shipping + tax;

  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-[#111827] mb-2">
          Your cart is empty
        </h1>
        <p className="text-gray-500 mb-6">
          Add items to your cart before checkout.
        </p>
        <Link to="/search" className="btn-primary inline-flex">
          Continue Shopping
        </Link>
      </div>
    );
  }

  // Step 1: Save a new address to the backend and select it.
  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setSavingAddress(true);
    setPaymentError("");
    try {
      const payload = {
        fullName: address.fullName,
        phone: address.phone,
        addressLine1: address.addressLine1,
        addressLine2: address.addressLine2 || undefined,
        city: address.city,
        state: address.state,
        pinCode: address.pinCode,
        country: "India",
        isDefault: savedAddresses.length === 0,
      };
      const data = await api.post("/addresses", payload);
      const created = data?.address;
      if (created?._id || created?.id) {
        setSavedAddresses((prev) => [...prev, created]);
        setSelectedAddressId(created._id || created.id);
      }
      setShowAddressForm(false);
      setStep(2);
    } catch (err) {
      setPaymentError(err.message || "Failed to save address");
    } finally {
      setSavingAddress(false);
    }
  };

  // Use a saved address and proceed to delivery.
  const handleUseSavedAddress = () => {
    if (!selectedAddressId) {
      setPaymentError("Please select an address");
      return;
    }
    setPaymentError("");
    setStep(2);
  };

  // Step 2 → Step 3
  const handleContinueToPayment = () => setStep(3);

  // Step 3: Create the order and handle payment.
  const handlePlaceOrder = async () => {
    setPlacing(true);
    setPaymentError("");
    try {
      const addressId = selectedAddressId;
      if (!addressId) throw new Error("Please select a delivery address");

      const orderData = await api.post("/orders", {
        addressId,
        paymentMethod,
      });
      const order = orderData?.order;

      if (!order) throw new Error("Order creation failed");

      if (paymentMethod === "cod") {
        // COD order is confirmed immediately by the backend.
        setOrderPlaced(order);
        clearCart();
        setStep(4);
        return;
      }

      // Razorpay flow: create a payment order and open checkout.
      setProcessing(true);
      const paymentRes = await api.post("/payment/order", {
        orderId: order._id || order.id,
      });
      const razorpayOrderId =
        paymentRes?.razorpayOrderId || paymentRes?.razorpay_order_id;

      if (!razorpayOrderId) {
        throw new Error("Could not initialize payment");
      }

      const payment = await openRazorpayCheckout({
        razorpayOrderId,
        prefill: {
          name: address.fullName || user?.name,
          email: user?.email || "",
          contact: address.phone || user?.phone || "",
        },
      });

      // Verify payment signature with the backend.
      await api.post("/payment/verify-payment", {
        razorpay_order_id: payment.razorpay_order_id,
        razorpay_payment_id: payment.razorpay_payment_id,
        razorpay_signature: payment.razorpay_signature,
      });

      setOrderPlaced(order);
      clearCart();
      setProcessing(false);
      setStep(4);
    } catch (err) {
      setProcessing(false);
      setPaymentError(
        err.message || "Failed to place order. Please try again.",
      );
      setStep(3);
    } finally {
      setPlacing(false);
    }
  };

  if (processing) {
    return <PaymentProcessing />;
  }

  if (orderPlaced) {
    return (
      <>
        <div className="max-w-[1400px] mx-auto px-3 md:px-4 py-4 md:py-6">
          <Breadcrumb
            items={[
              { label: "Home", to: "/" },
              { label: "Cart", to: "/cart" },
              { label: "Checkout" },
            ]}
          />
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check size={32} className="text-green-600" />
            </div>
            <h1 className="text-xl font-bold text-[#111827] mb-2">
              Order Confirmed!
            </h1>
            <p className="text-sm text-gray-500">
              Redirecting to your order details...
            </p>
          </div>
        </div>
        <OrderSuccessModal
          order={orderPlaced}
          total={total}
          paymentMethod={paymentMethod}
          onClose={() => navigate("/account/orders")}
        />
      </>
    );
  }

  const steps = ["Address", "Delivery", "Payment"];

  return (
    <div className="max-w-[1400px] mx-auto px-3 md:px-4 py-4 md:py-6">
      <Breadcrumb
        items={[
          { label: "Home", to: "/" },
          { label: "Cart", to: "/cart" },
          { label: "Checkout" },
        ]}
      />

      {/* Stepper */}
      <div className="flex items-center justify-center mb-6 md:mb-8">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center">
            <div
              className={`flex items-center gap-1.5 md:gap-2 ${step >= i + 1 ? "text-[#FF5A1F]" : "text-gray-400"}`}
            >
              <div
                className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs md:text-sm font-bold border-2 ${step >= i + 1 ? "border-[#FF5A1F] bg-[#FF5A1F] text-white" : "border-gray-300"}`}
              >
                {step > i + 1 ? <Check size={12} /> : i + 1}
              </div>
              <span className="text-xs md:text-sm font-medium hidden sm:block">
                {s}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`w-6 sm:w-16 h-0.5 mx-1 ${step > i + 1 ? "bg-[#FF5A1F]" : "bg-gray-200"}`}
              />
            )}
          </div>
        ))}
      </div>

      {paymentError && (
        <div className="mb-4 p-4 rounded-lg bg-red-50 text-red-600 text-sm border border-red-200">
          {paymentError}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="lg:col-span-2">
          {/* Step 1: Address */}
          {step === 1 && (
            <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
              <h2 className="font-bold text-base md:text-lg text-[#111827] mb-3 md:mb-4 flex items-center gap-2">
                <MapPin size={18} className="text-[#FF5A1F]" /> Shipping Address
              </h2>

              {/* Saved addresses */}
              {savedAddresses.length > 0 && !showAddressForm && (
                <>
                  <div className="space-y-3 mb-4">
                    {savedAddresses.map((addr) => {
                      const id = addr._id || addr.id;
                      return (
                        <label
                          key={id}
                          className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                            selectedAddressId === id
                              ? "border-[#FF5A1F] bg-orange-50"
                              : "border-gray-200 hover:border-orange-200"
                          }`}
                        >
                          <input
                            type="radio"
                            name="address"
                            checked={selectedAddressId === id}
                            onChange={() => setSelectedAddressId(id)}
                            className="mt-1 accent-[#FF5A1F]"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-[#111827]">
                              {addr.fullName || addr.full_name}
                              {addr.isDefault && (
                                <span className="ml-2 text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded">
                                  Default
                                </span>
                              )}
                            </p>
                            <p className="text-sm text-gray-600">
                              {addr.addressLine1 || addr.address_line1}
                              {addr.addressLine2
                                ? `, ${addr.addressLine2}`
                                : ""}
                            </p>
                            <p className="text-sm text-gray-600">
                              {addr.city}, {addr.state} -{" "}
                              {addr.pinCode || addr.pincode}
                            </p>
                            <p className="text-sm text-gray-500">
                              📞 {addr.phone}
                            </p>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => setShowAddressForm(true)}
                    className="flex items-center gap-2 px-4 py-2.5 border border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-[#FF5A1F] hover:text-[#FF5A1F] transition-colors mb-4"
                  >
                    <Plus size={16} /> Add New Address
                  </button>
                  <button
                    onClick={handleUseSavedAddress}
                    className="btn-primary w-full"
                  >
                    Continue to Delivery <ChevronRight size={16} />
                  </button>
                </>
              )}

              {/* Address form */}
              {(showAddressForm || savedAddresses.length === 0) && (
                <form onSubmit={handleAddressSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    <div>
                      <label className="text-sm text-gray-600 mb-1 block">
                        Full Name *
                      </label>
                      <input
                        required
                        value={address.fullName}
                        onChange={(e) =>
                          setAddress({ ...address, fullName: e.target.value })
                        }
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 mb-1 block">
                        Phone *
                      </label>
                      <input
                        required
                        value={address.phone}
                        onChange={(e) =>
                          setAddress({ ...address, phone: e.target.value })
                        }
                        className="input-field"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm text-gray-600 mb-1 block">
                        Address Line 1 *
                      </label>
                      <input
                        required
                        value={address.addressLine1}
                        onChange={(e) =>
                          setAddress({
                            ...address,
                            addressLine1: e.target.value,
                          })
                        }
                        className="input-field"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm text-gray-600 mb-1 block">
                        Address Line 2
                      </label>
                      <input
                        value={address.addressLine2}
                        onChange={(e) =>
                          setAddress({
                            ...address,
                            addressLine2: e.target.value,
                          })
                        }
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 mb-1 block">
                        City *
                      </label>
                      <input
                        required
                        value={address.city}
                        onChange={(e) =>
                          setAddress({ ...address, city: e.target.value })
                        }
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 mb-1 block">
                        State *
                      </label>
                      <input
                        required
                        value={address.state}
                        onChange={(e) =>
                          setAddress({ ...address, state: e.target.value })
                        }
                        className="input-field"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm text-gray-600 mb-1 block">
                        Pincode *
                      </label>
                      <input
                        required
                        value={address.pinCode}
                        onChange={(e) =>
                          setAddress({ ...address, pinCode: e.target.value })
                        }
                        className="input-field"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button
                      type="submit"
                      disabled={savingAddress}
                      className="btn-primary"
                    >
                      {savingAddress
                        ? "Saving..."
                        : "Save & Continue to Delivery"}
                      <ChevronRight size={16} />
                    </button>
                    {savedAddresses.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setShowAddressForm(false)}
                        className="btn-outline"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Step 2: Delivery */}
          {step === 2 && (
            <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
              <h2 className="font-bold text-base md:text-lg text-[#111827] mb-3 md:mb-4 flex items-center gap-2">
                <Truck size={18} className="text-[#FF5A1F]" /> Delivery Options
              </h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 border-2 border-[#FF5A1F] rounded-lg cursor-pointer bg-orange-50">
                  <input
                    type="radio"
                    name="delivery"
                    defaultChecked
                    className="accent-[#FF5A1F]"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-[#111827]">
                      Standard Delivery
                    </p>
                    <p className="text-sm text-gray-500">
                      3-5 business days ·{" "}
                      {shipping === 0 ? "Free" : `₹${shipping}`}
                    </p>
                  </div>
                  <span className="text-sm font-medium text-green-600">
                    {shipping === 0 ? "FREE" : `₹${shipping}`}
                  </span>
                </label>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(1)} className="btn-outline">
                  Back
                </button>
                <button
                  onClick={handleContinueToPayment}
                  className="btn-primary"
                >
                  Continue to Payment <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Payment */}
          {step === 3 && (
            <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
              <h2 className="font-bold text-base md:text-lg text-[#111827] mb-3 md:mb-4 flex items-center gap-2">
                <CreditCard size={18} className="text-[#FF5A1F]" /> Payment
                Method
              </h2>
              <div className="space-y-3">
                {PAYMENT_METHODS.map(({ id, label, icon }) => (
                  <label
                    key={id}
                    className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${paymentMethod === id ? "border-[#FF5A1F] bg-orange-50" : "border-gray-200 hover:border-orange-200"}`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === id}
                      onChange={() => setPaymentMethod(id)}
                      className="accent-[#FF5A1F]"
                    />
                    <span className="text-xl">{icon}</span>
                    <span className="font-medium text-[#111827]">{label}</span>
                  </label>
                ))}
              </div>
              <div className="flex items-center gap-2 mt-4 text-sm text-gray-500">
                <Shield size={14} className="text-green-600" /> Your payment
                information is secure and encrypted
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(2)} className="btn-outline">
                  Back
                </button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={placing}
                  className="btn-primary disabled:opacity-50 flex items-center gap-2"
                >
                  {placing ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>{" "}
                      Placing Order...
                    </>
                  ) : (
                    `Place Order · ₹${total.toLocaleString()}`
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Summary */}
        <div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-5 sticky top-4">
            <h3 className="font-bold text-base md:text-lg text-[#111827] mb-3 md:mb-4">
              Order Summary
            </h3>
            <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
              {items.map((item) => {
                const product = item.product || item.productId || {};
                const image = product.images?.[0]?.url || product.image || "";
                const price = item.price || product.price || 0;
                return (
                  <div key={item._id || item.id} className="flex gap-3">
                    <div className="w-12 h-14 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                      {image && (
                        <img
                          src={image}
                          alt=""
                          className="w-full h-full object-contain p-0.5"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#111827] line-clamp-1">
                        {product.name || product.title}
                      </p>
                      <p className="text-xs text-gray-400">
                        Qty: {item.quantity}
                      </p>
                      <p className="text-sm font-bold text-[#111827]">
                        ₹{(price * (item.quantity || 1)).toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="space-y-2 text-sm border-t border-gray-100 pt-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Shipping</span>
                <span>{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Tax (5%)</span>
                <span>₹{tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-100">
                <span className="font-bold">Total</span>
                <span className="font-bold text-[#FF5A1F] text-lg">
                  ₹{total.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
