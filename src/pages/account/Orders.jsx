import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
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
  XCircle,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

const CANCELLABLE_STATUSES = [
  "pending",
  "confirmed",
  "processing",
  "packed",
];

function isReturnEligible(order) {
  if (order.status !== "delivered") return false;
  const deliveryDate = order.deliveredAt || order.updatedAt;
  if (!deliveryDate) return false;
  const daysSinceDelivery = Math.floor(
    (Date.now() - new Date(deliveryDate).getTime()) /
      (1000 * 60 * 60 * 24),
  );
  return daysSinceDelivery <= 7;
}

function getDaysSinceDelivery(order) {
  const deliveryDate = order.deliveredAt || order.updatedAt;
  if (!deliveryDate) return null;
  return Math.floor(
    (Date.now() - new Date(deliveryDate).getTime()) /
      (1000 * 60 * 60 * 24),
  );
}

export default function Orders() {
  const [filter, setFilter] = useState("all");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Track which order has its dialog open
  const [activeOrderId, setActiveOrderId] = useState(null);
  const [dialogType, setDialogType] = useState(null); // "cancel" | "return"
  const [returnReason, setReturnReason] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["orders", filter],
    queryFn: () =>
      api.get("/orders", { status: filter === "all" ? undefined : filter }),
  });

  const orders = data?.orders || data || [];

  const filtered =
    filter === "all" ? orders : orders.filter((o) => o.status === filter);

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

  const cancelMutation = useMutation({
    mutationFn: (orderId) => api.put(`/orders/${orderId}/cancel`),
    onSuccess: () => {
      queryClient.invalidateQueries(["orders"]);
      setActiveOrderId(null);
      toast({
        title: "Order cancelled",
        description: "Your order has been cancelled successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Cancellation failed",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    },
  });

  const returnMutation = useMutation({
    mutationFn: (orderId) =>
      api.put(`/orders/${orderId}/return`, { reason: returnReason }),
    onSuccess: () => {
      queryClient.invalidateQueries(["orders"]);
      setActiveOrderId(null);
      setReturnReason("");
      toast({
        title: "Return requested",
        description: "Your return request has been submitted.",
      });
    },
    onError: (error) => {
      toast({
        title: "Return failed",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    },
  });

  const openDialog = (orderId, type) => {
    setActiveOrderId(orderId);
    setDialogType(type);
    setReturnReason("");
  };

  const activeOrder = activeOrderId
    ? orders.find((o) => (o._id || o.id) === activeOrderId)
    : null;

  const handleDialogAction = () => {
    if (dialogType === "cancel") {
      cancelMutation.mutate(activeOrderId);
    } else if (dialogType === "return") {
      returnMutation.mutate(activeOrderId);
    }
  };

  const isReturnDialog = dialogType === "return";
  const isActionPending = cancelMutation.isPending || returnMutation.isPending;

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
            const canCancel = CANCELLABLE_STATUSES.includes(status);
            const canReturn = isReturnEligible(order);
            const daysRemaining = canReturn ? 7 - getDaysSinceDelivery(order) : 0;

            return (
              <div
                key={order._id || order.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-[#FF5A1F] hover:shadow-md transition-all group"
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
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusInfo.color}`}
                    >
                      {statusInfo.label}
                    </span>
                    {(canCancel || canReturn) && (
                      <div className="flex items-center gap-1">
                        {canCancel && (
                          <Button
                            size="sm"
                            variant="destructive"
                            className="h-8 text-xs"
                            onClick={(e) => {
                              e.preventDefault();
                              openDialog(
                                order._id || order.id,
                                "cancel",
                              );
                            }}
                          >
                            <XCircle size={12} className="mr-1" />
                            Cancel
                          </Button>
                        )}
                        {canReturn && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 text-xs"
                            onClick={(e) => {
                              e.preventDefault();
                              openDialog(
                                order._id || order.id,
                                "return",
                              );
                            }}
                          >
                            <RotateCcw size={12} className="mr-1" />
                            Return
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Items */}
                <Link
                  to={`/account/orders/${order._id || order.id}`}
                  className="block p-3 md:p-4"
                >
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
                      <div className="mt-4 mb-2 overflow-x-auto scrollbar-hide -mx-1 px-1">
                        <div className="flex items-start min-w-[560px] md:min-w-0">
                          {statusSteps.map((s, i) => {
                            const Icon = stepIcons[i];
                            const done = i <= currentStep;
                            const label = ORDER_STATUSES[s]?.label || s;
                            return (
                              <div
                                key={s}
                                className="relative flex-1 last:flex-none md:min-w-[100px]"
                              >
                                {/* Connector line between icons */}
                                {i < statusSteps.length - 1 && (
                                  <div
                                    className={`absolute top-4 left-[calc(50%+16px)] right-[calc(-50%+16px)] h-0.5 ${i < currentStep ? "bg-green-500" : "bg-gray-200"}`}
                                  />
                                )}
                                <div className="flex flex-col items-center">
                                  <div
                                    className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-xs ${done ? "bg-green-500 text-white" : "bg-gray-200 text-gray-400"}`}
                                  >
                                    <Icon size={14} />
                                  </div>
                                  <span
                                    className={`mt-1.5 text-[10px] md:text-xs text-center capitalize whitespace-nowrap ${
                                      done
                                        ? "text-green-600 font-semibold"
                                        : "text-gray-400"
                                    }`}
                                  >
                                    {label}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                  {/* Cancelled / returned / refunded status banner */}
                  {(status === "cancelled" ||
                    status === "returned" ||
                    status === "refunded") && (
                    <div className="mt-4 mb-2">
                      <span
                        className={`inline-flex px-3 py-1.5 rounded-full text-sm font-semibold capitalize ${statusInfo.color}`}
                      >
                        {statusInfo.label}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-4">
                    <p className="text-sm text-gray-500">
                      {(order.items || []).length} item(s)
                    </p>
                    <span className="text-sm text-[#FF5A1F] font-medium flex items-center gap-1 group-hover:underline">
                      View Details <ChevronRight size={14} />
                    </span>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      )}

      {/* Action Dialog (Cancel / Return) */}
      <Dialog
        open={!!activeOrderId}
        onOpenChange={(open) => {
          if (!open) {
            setActiveOrderId(null);
            setDialogType(null);
            setReturnReason("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogType === "cancel" ? "Cancel Order" : "Return Order"}
            </DialogTitle>
            <DialogDescription>
              {dialogType === "cancel"
                ? "Are you sure you want to cancel this order? This action cannot be undone. Any stock reserved for this order will be released."
                : "Please provide a reason for returning this order. Our team will review your request and arrange for pickup."}
            </DialogDescription>
          </DialogHeader>
          {isReturnDialog && (
            <div className="py-4">
              <Textarea
                placeholder="Describe the reason for return..."
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
                rows={4}
                className="resize-none"
              />
              {returnMutation.isError && (
                <p className="text-sm text-red-500 mt-2">
                  {returnMutation.error?.message || ""}
                </p>
              )}
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setActiveOrderId(null);
                setDialogType(null);
                setReturnReason("");
              }}
              disabled={isActionPending}
            >
              {dialogType === "cancel" ? "Keep Order" : "Go Back"}
            </Button>
            <Button
              variant={dialogType === "cancel" ? "destructive" : "default"}
              onClick={handleDialogAction}
              disabled={
                isActionPending ||
                (isReturnDialog && returnReason.trim().length < 3)
              }
            >
              {isActionPending
                ? "Please wait..."
                : dialogType === "cancel"
                  ? "Yes, Cancel"
                  : "Submit Return"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
