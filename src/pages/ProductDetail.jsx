import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useAuth } from "@/lib/AuthContext";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import ProductCard from "@/components/ui/ProductCard";
import {
  Heart,
  ShoppingCart,
  Truck,
  RefreshCw,
  Shield,
  ChevronRight,
  Minus,
  Plus,
  Star,
  Share2,
} from "lucide-react";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [adding, setAdding] = useState(false);

  const { data: productData, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: () => api.get(`/products/${id}`),
    enabled: !!id,
  });

  const { data: relatedData } = useQuery({
    queryKey: ["related", id],
    queryFn: () =>
      api.get("/products", { category: productData?.category, limit: 6 }),
    enabled: !!productData?.category,
  });

  const product = productData?.product || productData;
  useEffect(() => {
    setActiveImage(0);
    setQuantity(1);
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="aspect-square skeleton rounded-xl" />
          <div className="space-y-4">
            <div className="h-8 w-3/4 skeleton rounded" />
            <div className="h-6 w-1/2 skeleton rounded" />
            <div className="h-10 w-1/3 skeleton rounded" />
            <div className="h-24 skeleton rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-[#111827] mb-2">
          Product not found
        </h1>
        <Link to="/search" className="text-[#FF5A1F] hover:underline">
          Browse all products →
        </Link>
      </div>
    );
  }

  const images =
    product.images?.map((i) => i.url || i) ||
    [product.image || product.thumbnail].filter(Boolean);
  const price = product.price || product.discountedPrice || 0;
  const originalPrice = product.originalPrice || product.mrp;
  const discount =
    originalPrice && price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : product.discount || 0;
  // Backend returns averageRating/numberOfReviews; some mocks use rating.average/reviewCount.
  const rating =
    product.rating?.average ||
    product.averageRating ||
    product.rating ||
    product.avgRating ||
    0;
  const reviewCount =
    product.rating?.count ||
    product.reviewCount ||
    product.numberOfReviews ||
    0;
  const inStock = product.stock > 0 || product.inStock !== false;
  const wishlisted = isInWishlist(id);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    setAdding(true);
    try {
      await addToCart(id, quantity);
      navigate("/cart");
    } finally {
      setAdding(false);
    }
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    setAdding(true);
    try {
      await addToCart(id, quantity);
      navigate("/checkout");
    } finally {
      setAdding(false);
    }
  };

  const handleWishlist = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    wishlisted ? await removeFromWishlist(id) : await addToWishlist(id);
  };

  const related =
    relatedData?.products?.filter((p) => (p._id || p.id) !== id).slice(0, 5) ||
    [];

  return (
    <div className="max-w-[1400px] mx-auto px-3 md:px-4 py-4 md:py-6">
      <Breadcrumb
        items={[
          { label: "Home", to: "/" },
          {
            label: product.category || "Products",
            to: `/search?category=${product.category}`,
          },
          { label: product.name || product.title },
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mb-8 md:mb-10">
        {/* Images */}
        <div className="flex gap-4">
          <div className="hidden md:flex flex-col gap-2 w-20">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`aspect-square rounded-lg overflow-hidden border-2 ${activeImage === i ? "border-[#FF5A1F]" : "border-gray-200"} bg-gray-50`}
              >
                <img
                  src={img}
                  alt=""
                  className="w-full h-full object-contain p-1"
                />
              </button>
            ))}
          </div>
          <div className="flex-1">
            <div className="aspect-square bg-gray-50 rounded-xl overflow-hidden relative">
              {discount > 0 && (
                <span className="absolute top-3 left-3 z-10 bg-[#FF5A1F] text-white text-sm font-bold px-2 py-1 rounded">
                  {discount}% OFF
                </span>
              )}
              {images[activeImage] ? (
                <img
                  src={images[activeImage]}
                  alt={product.name}
                  className="w-full h-full object-contain p-8"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">
                  <ShoppingCart size={64} />
                </div>
              )}
            </div>
            <div className="flex gap-2 mt-3 md:hidden">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`w-14 h-14 rounded-lg overflow-hidden border-2 ${activeImage === i ? "border-[#FF5A1F]" : "border-gray-200"}`}
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-contain"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Info */}
        <div>
          <p className="text-sm text-[#FF5A1F] font-medium mb-1">
            {product.brand || product.category}
          </p>
          <h1
            className="text-xl md:text-2xl font-bold text-[#111827] mb-2"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            {product.name || product.title}
          </h1>

          {rating > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={
                      i < Math.floor(rating)
                        ? "text-[#FACC15] fill-[#FACC15]"
                        : "text-gray-200 fill-gray-200"
                    }
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-[#111827]">
                {rating.toFixed(1)}
              </span>
              <span className="text-sm text-gray-400">
                ({reviewCount.toLocaleString()} reviews)
              </span>
            </div>
          )}

          <div className="flex items-end gap-2 md:gap-3 mb-1 flex-wrap">
            <span className="text-2xl md:text-3xl font-bold text-[#111827]">
              ₹{price.toLocaleString()}
            </span>
            {originalPrice && originalPrice > price && (
              <span className="text-base md:text-lg text-gray-400 line-through">
                ₹{originalPrice.toLocaleString()}
              </span>
            )}
            {discount > 0 && (
              <span className="text-sm font-semibold text-green-600 mb-1">
                {discount}% off
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 mb-4">Inclusive of all taxes</p>

          {/* Offers */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
            <p className="text-sm font-semibold text-[#111827] mb-2">
              Available Offers
            </p>
            <ul className="space-y-1.5 text-sm text-gray-600">
              <li className="flex gap-2">
                <span className="text-[#FF5A1F]">🏷️</span> Bank Offer: 10% off
                up to ₹1,000 on credit cards
              </li>
              <li className="flex gap-2">
                <span className="text-[#FF5A1F]">💳</span> No Cost EMI on orders
                above ₹3,000
              </li>
              <li className="flex gap-2">
                <span className="text-[#FF5A1F]">🎁</span> Special Price: Get
                extra 5% off (price inclusive of discount)
              </li>
            </ul>
          </div>

          {/* Stock */}
          <div className="flex items-center gap-2 mb-4">
            {inStock ? (
              <span className="text-sm font-semibold text-green-600">
                ✓ In Stock
              </span>
            ) : (
              <span className="text-sm font-semibold text-red-500">
                ✕ Out of Stock
              </span>
            )}
            {product.sku && (
              <span className="text-sm text-gray-400">
                · SKU: {product.sku}
              </span>
            )}
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm font-medium text-[#111827]">
              Quantity:
            </span>
            <div className="flex items-center border border-gray-200 rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-9 h-9 flex items-center justify-center text-gray-600 hover:text-[#FF5A1F]"
              >
                <Minus size={14} />
              </button>
              <span className="w-10 text-center text-sm font-medium">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-9 h-9 flex items-center justify-center text-gray-600 hover:text-[#FF5A1F]"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 md:gap-3 mb-6">
            <button
              onClick={handleAddToCart}
              disabled={adding || !inStock}
              className="flex-1 flex items-center justify-center gap-2 px-4 md:px-6 py-3 bg-[#FF5A1F] text-white text-sm md:text-base font-medium rounded-lg hover:bg-[#E64A19] transition-colors disabled:opacity-50"
            >
              <ShoppingCart size={18} /> {adding ? "Adding..." : "Add to Cart"}
            </button>
            <button
              onClick={handleBuyNow}
              disabled={adding || !inStock}
              className="flex-1 flex items-center justify-center gap-2 px-4 md:px-6 py-3 bg-[#111827] text-white text-sm md:text-base font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              Buy Now
            </button>
            <button
              onClick={handleWishlist}
              className="w-11 h-11 md:w-12 md:h-12 flex items-center justify-center border border-gray-200 rounded-lg hover:border-[#EC4899] hover:text-[#EC4899] transition-colors flex-shrink-0"
            >
              <Heart
                size={18}
                className={
                  wishlisted ? "fill-[#EC4899] text-[#EC4899]" : "text-gray-500"
                }
              />
            </button>
            <button className="w-11 h-11 md:w-12 md:h-12 flex items-center justify-center border border-gray-200 rounded-lg hover:border-[#FF5A1F] hover:text-[#FF5A1F] transition-colors flex-shrink-0">
              <Share2 size={18} className="text-gray-500" />
            </button>
          </div>
          
          {/* Trust */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-100">
            {[
              { icon: Truck, label: "Free Delivery" },
              { icon: RefreshCw, label: "7-Day Returns" },
              { icon: Shield, label: "Warranty Policy" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex flex-col items-center text-center gap-1"
              >
                <Icon size={20} className="text-[#FF5A1F]" />
                <span className="text-xs text-gray-600">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 mb-8 md:mb-10">
        <div className="flex border-b border-gray-200 overflow-x-auto scrollbar-hide">
          {["description", "specifications", "reviews"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 md:px-6 py-3 text-sm font-medium capitalize whitespace-nowrap border-b-2 transition-colors ${activeTab === tab ? "border-[#FF5A1F] text-[#FF5A1F]" : "border-transparent text-gray-500 hover:text-[#111827]"}`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="p-4 md:p-6">
          {activeTab === "description" && (
            <div className="prose max-w-none text-sm text-gray-600 leading-relaxed">
              <p>
                {product.description ||
                  "No description available for this product."}
              </p>
            </div>
          )}
          {activeTab === "specifications" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {product.specifications ? (
                Object.entries(product.specifications).map(([k, v]) => (
                  <div
                    key={k}
                    className="flex justify-between py-2 border-b border-gray-100 text-sm"
                  >
                    <span className="text-gray-500 capitalize">
                      {k.replace(/([A-Z])/g, " $1")}
                    </span>
                    <span className="text-[#111827] font-medium">{v}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">
                  No specifications available.
                </p>
              )}
            </div>
          )}
          {activeTab === "reviews" && (
            <div>
              <div className="text-center py-4">
                <div className="text-4xl font-bold text-[#111827] mb-1">
                  {rating.toFixed(1)}
                </div>
                <div className="flex justify-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={
                        i < Math.floor(rating)
                          ? "text-[#FACC15] fill-[#FACC15]"
                          : "text-gray-200 fill-gray-200"
                      }
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-500">
                  {reviewCount.toLocaleString()} ratings
                </p>
              </div>

              {/* Review list */}
              {Array.isArray(product.reviews) && product.reviews.length > 0 ? (
                <div className="space-y-4 mt-4 pt-4 border-t border-gray-100">
                  {product.reviews.map((review, i) => (
                    <div
                      key={review._id || i}
                      className="pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex">
                          {[...Array(5)].map((_, s) => (
                            <Star
                              key={s}
                              size={13}
                              className={
                                s < (review.rating || 0)
                                  ? "text-[#FACC15] fill-[#FACC15]"
                                  : "text-gray-200 fill-gray-200"
                              }
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-400">
                          {review.user?.name || "Verified Buyer"}
                        </span>
                        {review.createdAt && (
                          <span className="text-xs text-gray-400">
                            ·{" "}
                            {new Date(review.createdAt).toLocaleDateString(
                              "en-IN",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </span>
                        )}
                      </div>
                      {review.comment && (
                        <p className="text-sm text-gray-600">
                          {review.comment}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-sm text-gray-500 py-4">
                  No reviews yet. Be the first to review this product!
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <h2
              className="text-lg md:text-xl font-bold text-[#111827]"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Related Products
            </h2>
            <Link
              to={`/search?category=${product.category}`}
              className="text-sm text-[#FF5A1F] font-medium hover:underline flex items-center gap-1"
            >
              View All <ChevronRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
            {related.map((p) => (
              <ProductCard key={p._id || p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
