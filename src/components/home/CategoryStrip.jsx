import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const fallbackCategories = [
  {
    name: "Electronics",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=120&q=80",
    slug: "electronics",
  },
  {
    name: "Fashion",
    image:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?w=120&q=80",
    slug: "fashion",
  },
  {
    name: "Home & Kitchen",
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=120&q=80",
    slug: "home-kitchen",
  },
  {
    name: "Beauty",
    image:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=120&q=80",
    slug: "beauty",
  },
  {
    name: "Sports",
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=120&q=80",
    slug: "sports",
  },
  {
    name: "Books",
    image:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=120&q=80",
    slug: "books",
  },
  {
    name: "Toys & Games",
    image:
      "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=120&q=80",
    slug: "toys-games",
  },
  {
    name: "Deals",
    image:
      "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=120&q=80",
    slug: "deals",
  },
];

export default function CategoryStrip() {
  const categories = fallbackCategories;

  return (
    <section className="my-4 md:my-6">
      <div className="flex items-center justify-between mb-3 md:mb-4">
        <h2
          className="text-lg md:text-xl font-bold text-[#111827]"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          Top Categories
        </h2>
        <Link
          to="/categories"
          className="text-sm text-[#FF5A1F] font-medium hover:underline flex items-center gap-1"
        >
          View All <ChevronRight size={14} />
        </Link>
      </div>
      <div className="flex gap-3 md:gap-4 overflow-x-auto scrollbar-hide pb-2">
        {categories.slice(0, 10).map((cat) => {
          const slug = cat.slug || cat.name?.toLowerCase().replace(/\s+/g, "-");
          const image = cat.image || cat.thumbnail;
          return (
            <Link
              key={cat._id || slug}
              to={`/search?category=${slug}`}
              className="flex-shrink-0 flex flex-col items-center gap-2 group"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-orange-50 border-2 border-transparent group-hover:border-[#FF5A1F] transition-colors overflow-hidden flex items-center justify-center">
                {image ? (
                  <motion.img
                    src={image}
                    alt={cat.name}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.15 }}
                    transition={{ duration: 0.2 }}
                  />
                ) : (
                  <span className="text-2xl">
                    {["💻", "👗", "🏠", "💄", "⚽", "📚", "🧸", "🏷️"][0]}
                  </span>
                )}
              </div>
              <span className="text-xs text-center text-gray-600 group-hover:text-[#FF5A1F] transition-colors font-medium whitespace-nowrap">
                {cat.name}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
