import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { api } from "@/lib/api";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { ORDER_STATUSES } from "@/constants";
import {
  Package,
  MapPin,
  CreditCard,
  ArrowLeft,
  Download,
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

export default function OrderDetail() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showReturnDialog, setShowReturnDialog] = useState(false);
  const [returnReason, setReturnReason] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["order", id],
    queryFn: () => api.get(`/orders/${id}`),
    enabled: !!id,
  });

  const cancelMutation = useMutation({
    mutationFn: () => api.put(`/orders/${id}/cancel`),
    onSuccess: () => {
      queryClient.invalidateQueries(["orders"]);
      queryClient.invalidateQueries(["order", id]);
      setShowCancelDialog(false);
      toast({
        title: "Order cancelled",
        description: "Your order has been cancelled successfully. Stock has been restored.",
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
    mutationFn: () =>
      api.put(`/orders/${id}/return`, { reason: returnReason }),
    onSuccess: () => {
      queryClient.invalidateQueries(["orders"]);
      queryClient.invalidateQueries(["order", id]);
      setShowReturnDialog(false);
      setReturnReason("");
      toast({
        title: "Return requested",
        description:
          "Your return request has been submitted. Your items will be picked up soon.",
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
  const canCancel = CANCELLABLE_STATUSES.includes(status);
  const canReturn = isReturnEligible(order);
  const daysRemaining = canReturn ? 7 - getDaysSinceDelivery(order) : 0;
  const subtotal =
    order.subtotal ||
    items.reduce((s, i) => s + (i.price || 0) * (i.quantity || 1), 0);
  const shipping = order.shipping || 0;
  const tax = order.tax || 0;
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

          {/* Return Reason (if returned) */}
          {status === "returned" && order.returnReason && (
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 md:p-5">
              <h2 className="font-bold text-base md:text-lg text-[#111827] mb-2 flex items-center gap-2">
                <RotateCcw size={18} className="text-gray-500" /> Return Reason
              </h2>
              <p className="text-sm text-gray-600">{order.returnReason}</p>
            </div>
          )}
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

            {/* Action Buttons */}
            {(canCancel || canReturn) && (
              <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                {canCancel && (
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={() => setShowCancelDialog(true)}
                  >
                    <XCircle size={16} className="mr-2" />
                    Cancel Order
                  </Button>
                )}
                {canReturn && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setShowReturnDialog(true)}
                  >
                    <RotateCcw size={16} className="mr-2" />
                    Return Order
                    {daysRemaining > 0 && (
                      <span className="ml-2 text-xs opacity-80">
                        ({daysRemaining} day{daysRemaining !== 1 ? "s" : ""}{" "}
                        left)
                      </span>
                    )}
                  </Button>
                )}
              </div>
            )}

            <button className="btn-outline w-full mt-4">
              <Download size={16} /> Download Invoice
            </button>
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Order</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this order? This action cannot be
              undone. Any stock reserved for this order will be released.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCancelDialog(false)}
              disabled={cancelMutation.isPending}
            >
              Keep Order
            </Button>
            <Button
              variant="destructive"
              onClick={() => cancelMutation.mutate()}
              disabled={cancelMutation.isPending}
            >
              {cancelMutation.isPending ? "Cancelling..." : "Yes, Cancel"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Return Dialog */}
      <Dialog open={showReturnDialog} onOpenChange={setShowReturnDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Return Order</DialogTitle>
            <DialogDescription>
              Please provide a reason for returning this order. Our team will
              review your request and arrange for pickup.
            </DialogDescription>
          </DialogHeader>
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
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowReturnDialog(false);
                setReturnReason("");
              }}
              disabled={returnMutation.isPending}
            >
              Go Back
            </Button>
            <Button
              onClick={() => returnMutation.mutate()}
              disabled={returnMutation.isPending || returnReason.trim().length < 3}
            >
              {returnMutation.isPending ? "Submitting..." : "Submit Return"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
