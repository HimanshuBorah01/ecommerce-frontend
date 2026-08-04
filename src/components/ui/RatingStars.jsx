import { Star } from "lucide-react";

export default function RatingStars({
  rating = 0,
  reviewCount,
  size = 14,
  showNumber = false,
}) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={size}
            className={
              i < Math.round(rating)
                ? "text-[#FACC15] fill-[#FACC15]"
                : "text-gray-200 fill-gray-200"
            }
          />
        ))}
      </div>
      {showNumber && (
        <span className="text-sm font-semibold text-[#111827]">
          {rating.toFixed(1)}
        </span>
      )}
      {reviewCount != null && (
        <span className="text-sm text-gray-500">
          ({reviewCount.toLocaleString()})
        </span>
      )}
    </div>
  );
}
