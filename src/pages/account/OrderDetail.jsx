import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { ORDER_STATUSES } from "@/constants";
import { Package, MapPin, CreditCard, ArrowLeft, Download } from "lucide-react";

export default function OrderDetail() {
  const { id } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ["order", id],
    queryFn: () => api.get(`/orders/${id}`),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 skeleton rounded" />
        <div className="h-64 skeleton rounded-xl" />
      </div>
    );
  }

  const order = data?.order || data;

  if (!order) {
    return (
      <div className="text-center py-16">
        <h1 className="text-xl font-bold text-[#111827] mb-2">
          Order not found
        </h1>
        <Link to="/account/orders" className="text-[#FF5A1F] hover:underline">
          ← Back to Orders
        </Link>
      </div>
    );
  }

  const status = order.status || "pending";
  const statusInfo = ORDER_STATUSES[status] || ORDER_STATUSES.pending;
  const items = order.items || [];
  const subtotal =
    order.subtotal ||
    items.reduce((s, i) => s + (i.price || 0) * (i.quantity || 1), 0);
  const shipping = order.shipping || 0;
  const tax = order.tax || 0;
  // Backend order model stores the total as `totalAmount`.
  const total =
    order.totalAmount ||
    order.total ||
    order.totalPrice ||
    subtotal + shipping + tax;

  return (
    <div>
      <Breadcrumb
        items={[
          { label: "Home", to: "/" },
          { label: "Account", to: "/account" },
          { label: "Orders", to: "/account/orders" },
          { label: order._id || order.id || "Detail" },
        ]}
      />

      <div className="flex items-start justify-between mb-4 md:mb-6 gap-3">
        <div className="min-w-0">
          <Link
            to="/account/orders"
            className="text-sm text-gray-500 hover:text-[#FF5A1F] flex items-center gap-1 mb-2"
          >
            <ArrowLeft size={14} /> Back to Orders
          </Link>
          <h1
            className="text-xl md:text-2xl font-bold text-[#111827]"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Order Details
          </h1>
          <p className="text-xs md:text-sm text-gray-500 mt-1">
            Order ID:{" "}
            <span className="font-mono break-all">{order._id || order.id}</span>
          </p>
        </div>
        <span
          className={`px-3 md:px-4 py-1 md:py-1.5 rounded-full text-xs md:text-sm font-semibold capitalize ${statusInfo.color} flex-shrink-0`}
        >
          {statusInfo.label}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="lg:col-span-2 space-y-3 md:space-y-4">
          {/* Items */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-5">
            <h2 className="font-bold text-base md:text-lg text-[#111827] mb-3 md:mb-4 flex items-center gap-2">
              <Package size={18} className="text-[#FF5A1F]" /> Items in Order
            </h2>
            <div className="space-y-4">
              {items.map((item, i) => {
                const product = item.product || item.productId || {};
                const image = product.images?.[0]?.url || product.image || "";
                return (
                  <div
                    key={i}
                    className="flex gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                  >
                    <Link
                      to={`/product/${product._id || product.id}`}
                      className="w-16 h-20 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0"
                    >
                      {image ? (
                        <img
                          src={image}
                          alt=""
                          className="w-full h-full object-contain p-1"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <Package size={20} />
                        </div>
                      )}
                    </Link>
                    <div className="flex-1">
                      <Link
                        to={`/product/${product._id || product.id}`}
                        className="text-sm font-medium text-[#111827] hover:text-[#FF5A1F] line-clamp-2"
                      >
                        {product.name || product.title}
                      </Link>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Qty: {item.quantity}
                      </p>
                      <p className="text-sm font-bold text-[#111827] mt-1">
                        ₹
                        {(
                          (item.price || product.price || 0) *
                          (item.quantity || 1)
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Address */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-5">
            <h2 className="font-bold text-base md:text-lg text-[#111827] mb-3 flex items-center gap-2">
              <MapPin size={18} className="text-[#FF5A1F]" /> Shipping Address
            </h2>
            {order.address ? (
              typeof order.address === "object" ? (
                <div className="text-sm text-gray-600 space-y-1">
                  <p className="font-medium text-[#111827]">
                    {order.address.fullName}
                  </p>
                  <p>
                    {order.address.addressLine1}
                    {order.address.addressLine2
                      ? `, ${order.address.addressLine2}`
                      : ""}
                  </p>
                  <p>
                    {order.address.city}, {order.address.state} -{" "}
                    {order.address.pincode || order.address.pinCode}
                  </p>
                  <p>Phone: {order.address.phone}</p>
                </div>
              ) : (
                <p className="text-sm text-gray-400">
                  Address reference:{" "}
                  <span className="font-mono">{order.address}</span>
                </p>
              )
            ) : (
              <p className="text-sm text-gray-400">No address on file</p>
            )}
          </div>
        </div>

        {/* Summary */}
        <div>
          <div className="bg-white rounded-xl border border-gray-200 p-5 sticky top-4">
            <h2 className="font-bold text-[#111827] mb-4 flex items-center gap-2">
              <CreditCard size={18} className="text-[#FF5A1F]" /> Payment
              Summary
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Shipping</span>
                <span>{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Tax</span>
                <span>₹{tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-100">
                <span className="font-bold">Total</span>
                <span className="font-bold text-[#FF5A1F]">
                  ₹{total.toLocaleString()}
                </span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
              <div>
                <p className="text-sm text-gray-500">Payment Method</p>
                <p className="text-sm font-medium text-[#111827] capitalize">
                  {order.paymentMethod || "N/A"}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">Payment Status</p>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                    order.paymentStatus === "paid"
                      ? "bg-green-50 text-green-600"
                      : order.paymentStatus === "failed"
                        ? "bg-red-50 text-red-600"
                        : order.paymentStatus === "refunded"
                          ? "bg-blue-50 text-blue-600"
                          : "bg-yellow-50 text-yellow-600"
                  }`}
                >
                  {order.paymentStatus || "pending"}
                </span>
              </div>
            </div>
            <button className="btn-outline w-full mt-4">
              <Download size={16} /> Download Invoice
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
