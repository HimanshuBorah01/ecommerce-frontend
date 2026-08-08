import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import EmptyState from "@/components/ui/EmptyState";
import { ORDER_STATUSES } from "@/constants";
import {
  Package,
  ChevronRight,
  Clock,
  Truck,
  CheckCircle,
  ClipboardList,
  Box,
  Send,
} from "lucide-react";
import { useState } from "react";

export default function Orders() {
  const [filter, setFilter] = useState("all");

  const { data, isLoading } = useQuery({
    queryKey: ["orders", filter],
    queryFn: () =>
      api.get("/orders", { status: filter === "all" ? undefined : filter }),
  });

  const orders = data?.orders || data || [];

  const filtered =
    filter === "all" ? orders : orders.filter((o) => o.status === filter);

  // Full lifecycle used by the backend order model.
  const statusSteps = [
    "pending",
    "confirmed",
    "processing",
    "packed",
    "shipped",
    "out_for_delivery",
    "delivered",
  ];

  const stepIcons = [
    ClipboardList,
    CheckCircle,
    Clock,
    Box,
    Send,
    Truck,
    CheckCircle,
  ];

  const filterTabs = [
    "all",
    "pending",
    "confirmed",
    "processing",
    "packed",
    "shipped",
    "out_for_delivery",
    "delivered",
    "cancelled",
    "returned",
    "refunded",
  ];

  return (
    <div>
      <Breadcrumb
        items={[
          { label: "Home", to: "/" },
          { label: "Account", to: "/account" },
          { label: "My Orders" },
        ]}
      />
      <h1
        className="text-xl md:text-2xl font-bold text-[#111827] mb-4 md:mb-6"
        style={{ fontFamily: "Poppins, sans-serif" }}
      >
        My Orders
      </h1>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-4 md:mb-6 overflow-x-auto scrollbar-hide">
        {filterTabs.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize whitespace-nowrap transition-colors ${filter === f ? "bg-[#FF5A1F] text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-[#FF5A1F]"}`}
          >
            {f.replace(/_/g, " ")}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-40 skeleton rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Package size={48} className="text-gray-300" />}
          title="No orders found"
          description="You haven't placed any orders yet. Start shopping to see them here."
          actionLabel="Start Shopping"
          onAction={() => (window.location.href = "/search")}
        />
      ) : (
        <div className="space-y-4">
          {filtered.map((order) => {
            const status = order.status || "pending";
            const statusInfo = ORDER_STATUSES[status] || ORDER_STATUSES.pending;
            const currentStep = statusSteps.indexOf(status);
            return (
              <div
                key={order._id || order.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3 md:p-4 border-b border-gray-100 bg-gray-50">
                  <div className="flex flex-wrap items-center gap-3 md:gap-4">
                    <div>
                      <p className="text-xs text-gray-400">Order ID</p>
                      <p className="font-mono text-sm font-medium text-[#111827]">
                        {order._id || order.id}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Placed on</p>
                      <p className="text-sm font-medium text-[#111827]">
                        {new Date(
                          order.createdAt || order.created_date || Date.now(),
                        ).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Total</p>
                      <p className="text-sm font-bold text-[#111827]">
                        ₹
                        {(
                          order.totalAmount ||
                          order.total ||
                          order.totalPrice ||
                          0
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusInfo.color}`}
                  >
                    {statusInfo.label}
                  </span>
                </div>

                {/* Items */}
                <div className="p-3 md:p-4">
                  <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
                    {(order.items || []).map((item, i) => {
                      const product = item.product || item.productId || {};
                      const image =
                        product.images?.[0]?.url || product.image || "";
                      return (
                        <div
                          key={i}
                          className="flex-shrink-0 w-16 h-16 bg-gray-50 rounded-lg overflow-hidden"
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
                        </div>
                      );
                    })}
                  </div>

                  {/* Progress */}
                  {status !== "cancelled" &&
                    status !== "returned" &&
                    status !== "refunded" && (
                      <div className="flex items-center mt-4 mb-2">
                        {statusSteps.map((s, i) => {
                          const Icon = stepIcons[i];
                          const done = i <= currentStep;
                          return (
                            <div
                              key={s}
                              className="flex items-center flex-1 last:flex-none"
                            >
                              <div
                                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${done ? "bg-green-500 text-white" : "bg-gray-200 text-gray-400"}`}
                              >
                                <Icon size={14} />
                              </div>
                              {i < statusSteps.length - 1 && (
                                <div
                                  className={`flex-1 h-0.5 mx-1 ${i < currentStep ? "bg-green-500" : "bg-gray-200"}`}
                                />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                  <div className="flex items-center justify-between mt-4">
                    <p className="text-sm text-gray-500">
                      {(order.items || []).length} item(s)
                    </p>
                    <Link
                      to={`/account/orders/${order._id || order.id}`}
                      className="text-sm text-[#FF5A1F] font-medium hover:underline flex items-center gap-1"
                    >
                      View Details <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
