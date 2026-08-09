import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { motion } from "framer-motion";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/lib/AuthContext";
import { useNavigate } from "react-router-dom";

export default function ProductCard({ product }) {
  const { isAuthenticated } = useAuth();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);
  const navigate = useNavigate();

  if (!product) return null;

  const id = product._id || product.id;
  const name = product.name || product.title || "Product";
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
  const image =
    product.images?.[0]?.url || product.image || product.thumbnail || "";
  const hoverImage = product.images?.[1]?.url || "";
  const wishlisted = isInWishlist(id);

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    wishlisted ? await removeFromWishlist(id) : await addToWishlist(id);
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    setAdding(true);
    try {
      await addToCart(id, 1);
    } finally {
      setAdding(false);
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={12}
        className={
          i < Math.floor(rating)
            ? "text-[#FACC15] fill-[#FACC15]"
            : "text-gray-200 fill-gray-200"
        }
      />
    ));
  };

  return (
    <Link to={`/product/${id}`} className="block group">
      <motion.div
        whileHover={{ y: -4, scale: 1.01 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden hover:shadow-lg hover:border-orange-200 transition-shadow duration-300"
      >
        {/* Image */}
        <div className="relative aspect-[3/4] bg-gray-50 overflow-hidden">
          {discount > 0 && (
            <div className="absolute top-2 left-2 z-10 bg-[#FF5A1F] text-white text-xs font-bold px-2 py-0.5 rounded">
              {discount}% OFF
            </div>
          )}
          <button
            onClick={handleWishlist}
            className="absolute top-2 right-2 z-10 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"
          >
            <Heart
              size={16}
              className={
                wishlisted ? "fill-[#EC4899] text-[#EC4899]" : "text-gray-400"
              }
            />
          </button>

          {image && (
            <img
              src={image}
              alt={name}
              className={`w-full h-full object-contain p-4 transition-opacity duration-300 ${hoverImage ? "group-hover:opacity-0" : ""}`}
            />
          )}
          {hoverImage && (
            <img
              src={hoverImage}
              alt={name}
              className="absolute inset-0 w-full h-full object-contain p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />
          )}
          {!image && (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              <ShoppingCart size={48} />
            </div>
          )}

          {/* Quick add overlay */}
          <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button
              onClick={handleAddToCart}
              disabled={adding || !inStock}
              className="w-full py-2.5 bg-[#111827] text-white text-sm font-medium hover:bg-[#FF5A1F] transition-colors disabled:bg-gray-300 flex items-center justify-center gap-2"
            >
              <ShoppingCart size={14} />
              {adding ? "Adding..." : inStock ? "Quick Add" : "Out of Stock"}
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="p-2.5 md:p-3">
          <p className="text-[10px] md:text-xs text-gray-400 mb-0.5 truncate">
            {product.brand || product.category}
          </p>
          <h3 className="text-xs md:text-sm font-medium text-[#111827] line-clamp-2 mb-1 md:mb-1.5 group-hover:text-[#FF5A1F] transition-colors">
            {name}
          </h3>

          {/* Rating */}
          {rating > 0 && (
            <div className="flex items-center gap-1 mb-1.5 md:mb-2">
              <div className="flex">{renderStars(rating)}</div>
              <span className="text-[10px] md:text-xs text-gray-500">
                ({reviewCount.toLocaleString()})
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-1.5 md:gap-2 flex-wrap">
            <span className="text-sm md:text-base font-bold text-[#111827]">
              ₹{price.toLocaleString()}
            </span>
            {originalPrice && originalPrice > price && (
              <span className="text-[10px] md:text-xs text-gray-400 line-through">
                ₹{originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          {inStock ? (
            <p className="text-[10px] md:text-xs text-green-600 font-medium mt-0.5 md:mt-1">
              In Stock
            </p>
          ) : (
            <p className="text-[10px] md:text-xs text-red-500 font-medium mt-0.5 md:mt-1">
              Out of Stock
            </p>
          )}
        </div>
      </motion.div>
    </Link>
  );
}
