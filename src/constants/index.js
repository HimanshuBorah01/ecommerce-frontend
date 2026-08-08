export const CATEGORIES = [
  { name: "Electronics", slug: "electronics", icon: "💻" },
  { name: "Fashion", slug: "fashion", icon: "👗" },
  { name: "Home & Kitchen", slug: "home-kitchen", icon: "🏠" },
  { name: "Beauty", slug: "beauty", icon: "💄" },
  { name: "Sports", slug: "sports", icon: "⚽" },
  { name: "Books", slug: "books", icon: "📚" },
  { name: "Toys & Games", slug: "toys-games", icon: "🧸" },
  { name: "Deals", slug: "deals", icon: "🏷️" },
];

export const TRUST_ITEMS = [
  { icon: "🚚", title: "Free Delivery", subtitle: "On orders above ₹499" },
  { icon: "🔄", title: "Easy Returns", subtitle: "7 days return policy" },
  { icon: "🔒", title: "Secure Payment", subtitle: "100% secure payment" },
  { icon: "🏷️", title: "Best Prices", subtitle: "Guaranteed" },
];

export const SORT_OPTIONS = [
  { value: "relevance", label: "Relevance" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Customer Rating" },
  { value: "newest", label: "Newest First" },
  { value: "discount", label: "Discount" },
];

export const ORDER_STATUSES = {
  pending: { label: "Pending", color: "text-yellow-600 bg-yellow-50" },
  confirmed: { label: "Confirmed", color: "text-orange-600 bg-orange-50" },
  processing: { label: "Processing", color: "text-blue-600 bg-blue-50" },
  packed: { label: "Packed", color: "text-indigo-600 bg-indigo-50" },
  shipped: { label: "Shipped", color: "text-purple-600 bg-purple-50" },
  out_for_delivery: {
    label: "Out for Delivery",
    color: "text-cyan-600 bg-cyan-50",
  },
  delivered: { label: "Delivered", color: "text-green-600 bg-green-50" },
  cancelled: { label: "Cancelled", color: "text-red-600 bg-red-50" },
  returned: { label: "Returned", color: "text-gray-600 bg-gray-50" },
  refunded: { label: "Refunded", color: "text-emerald-600 bg-emerald-50" },
};

// Payment methods supported by the backend (order controller validates these).
export const PAYMENT_METHODS = [
  {
    id: "razorpay",
    label: "Credit / Debit Card, UPI & Net Banking (Razorpay)",
    icon: "💳",
  },
  { id: "cod", label: "Cash on Delivery", icon: "💵" },
];
