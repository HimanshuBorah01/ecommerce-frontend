import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import EmptyState from "@/components/ui/EmptyState";
import { Star } from "lucide-react";

export default function Reviews() {
  const { data, isLoading } = useQuery({
    queryKey: ["reviews"],
    queryFn: () => api.get("/reviews"),
  });

  const reviews = data?.reviews || data || [];

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="h-32 skeleton rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <Breadcrumb
        items={[
          { label: "Home", to: "/" },
          { label: "Account", to: "/account" },
          { label: "My Reviews" },
        ]}
      />
      <h1
        className="text-xl md:text-2xl font-bold text-[#111827] mb-4 md:mb-6"
        style={{ fontFamily: "Poppins, sans-serif" }}
      >
        My Reviews
      </h1>

      {reviews.length === 0 ? (
        <EmptyState
          icon={<Star size={48} className="text-gray-300" />}
          title="No reviews yet"
          description="Share your experience with products you've purchased to help other shoppers."
          actionLabel="Start Shopping"
          onAction={() => (window.location.href = "/search")}
        />
      ) : (
        <div className="space-y-3 md:space-y-4">
          {reviews.map((review) => {
            const product = review.product || {};
            return (
              <div
                key={review._id || review.id}
                className="bg-white rounded-xl border border-gray-200 p-4 md:p-5"
              >
                <div className="flex gap-3 md:gap-4">
                  <Link
                    to={`/product/${product._id || product.id}`}
                    className="w-16 h-20 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0"
                  >
                    {product.image && (
                      <img
                        src={product.image}
                        alt=""
                        className="w-full h-full object-contain p-1"
                      />
                    )}
                  </Link>
                  <div className="flex-1">
                    <Link
                      to={`/product/${product._id || product.id}`}
                      className="text-sm font-medium text-[#111827] hover:text-[#FF5A1F]"
                    >
                      {product.name || product.title}
                    </Link>
                    <div className="flex items-center gap-1 my-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={
                            i < (review.rating || 0)
                              ? "text-[#FACC15] fill-[#FACC15]"
                              : "text-gray-200 fill-gray-200"
                          }
                        />
                      ))}
                      <span className="text-xs text-gray-400 ml-1">
                        {new Date(
                          review.createdAt || Date.now(),
                        ).toLocaleDateString("en-IN")}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {review.comment || review.review}
                    </p>
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
