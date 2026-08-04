import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { useWishlist } from "@/contexts/WishlistContext";
import {
  Package,
  MapPin,
  Heart,
  Star,
  Clock,
  Truck,
  CheckCircle,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { ORDER_STATUSES } from "@/constants";

export default function Dashboard() {
  const { wishlistCount } = useWishlist();
  const { data } = useQuery({
    queryKey: ["orders"],
    queryFn: () => api.get("/orders"),
  });
  const orders = data?.orders || data || [];

  const stats = [
    {
      label: "Total Orders",
      value: orders.length,
      icon: Package,
      to: "/account/orders",
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Wishlist Items",
      value: wishlistCount,
      icon: Heart,
      to: "/account/wishlist",
      color: "bg-pink-50 text-pink-600",
    },
    {
      label: "Saved Addresses",
      value: 0,
      icon: MapPin,
      to: "/account/addresses",
      color: "bg-green-50 text-green-600",
    },
  ];

  const recentOrders = orders.slice(0, 3);

  return (
    <div>
      <Breadcrumb
        items={[
          { label: "Home", to: "/" },
          { label: "Account", to: "/account" },
          { label: "Dashboard" },
        ]}
      />
      <h1
        className="text-xl md:text-2xl font-bold text-[#111827] mb-1 md:mb-2"
        style={{ fontFamily: "Poppins, sans-serif" }}
      >
        Welcome back! 👋
      </h1>
      <p className="text-sm md:text-base text-gray-500 mb-4 md:mb-6">
        Here's what's happening with your account
      </p>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
        {stats.map(({ label, value, icon: Icon, to, color }) => (
          <Link
            key={label}
            to={to}
            className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-orange-200 transition-all group"
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${color}`}
            >
              <Icon size={18} />
            </div>
            <p className="text-2xl font-bold text-[#111827]">{value}</p>
            <p className="text-sm text-gray-500 group-hover:text-[#FF5A1F] transition-colors">
              {label}
            </p>
          </Link>
        ))}
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-5 mb-4 md:mb-6">
        <div className="flex items-center justify-between mb-3 md:mb-4">
          <h2 className="font-bold text-base md:text-lg text-[#111827] flex items-center gap-2">
            <Clock size={18} className="text-[#FF5A1F]" /> Recent Orders
          </h2>
          <Link
            to="/account/orders"
            className="text-sm text-[#FF5A1F] font-medium hover:underline flex items-center gap-1"
          >
            View All <ChevronRight size={14} />
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <div className="text-center py-8">
            <Package size={40} className="text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500 mb-3">No orders yet</p>
            <Link
              to="/search"
              className="text-sm text-[#FF5A1F] font-medium hover:underline"
            >
              Start Shopping →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((order) => {
              const status = order.status || "pending";
              const statusInfo =
                ORDER_STATUSES[status] || ORDER_STATUSES.pending;
              return (
                <Link
                  key={order._id || order.id}
                  to={`/account/orders/${order._id || order.id}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
                      {status === "delivered" ? (
                        <CheckCircle size={18} className="text-green-500" />
                      ) : (
                        <Truck size={18} className="text-[#FF5A1F]" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#111827]">
                        {order._id || order.id}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(
                          order.createdAt || order.created_date || Date.now(),
                        ).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-[#111827]">
                      ₹{(order.total || 0).toLocaleString()}
                    </p>
                    <span
                      className={`text-xs font-medium capitalize ${statusInfo.color.split(" ")[0]}`}
                    >
                      {statusInfo.label}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        <Link
          to="/search"
          className="bg-gradient-to-br from-[#FF5A1F] to-[#E64A19] rounded-xl p-5 text-white hover:shadow-lg transition-all"
        >
          <TrendingUp size={24} className="mb-2" />
          <p className="font-bold">Continue Shopping</p>
          <p className="text-sm opacity-90">Explore latest deals</p>
        </Link>
        <Link
          to="/account/addresses"
          className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-all"
        >
          <MapPin size={24} className="text-[#FF5A1F] mb-2" />
          <p className="font-bold text-[#111827]">Manage Addresses</p>
          <p className="text-sm text-gray-500">
            Add or edit delivery addresses
          </p>
        </Link>
        <Link
          to="/account/profile"
          className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-all"
        >
          <Star size={24} className="text-[#FF5A1F] mb-2" />
          <p className="font-bold text-[#111827]">Edit Profile</p>
          <p className="text-sm text-gray-500">Update your personal info</p>
        </Link>
      </div>
    </div>
  );
}
