import { useState } from "react";
import { Link } from "react-router-dom";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import NewsletterPopup from "@/components/NewsletterPopup";
import { LayoutGrid, Award, Tag, RefreshCw } from "lucide-react";

const CATEGORY_IMAGES = {
  electronics:
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&q=80",
  fashion:
    "https://images.unsplash.com/photo-1445205170230-053b83016050?w=200&q=80",
  "home-kitchen":
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&q=80",
  beauty:
    "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=200&q=80",
  sports:
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&q=80",
  books:
    "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=200&q=80",
  "toys-games":
    "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=200&q=80",
};

const highlights = [
  { icon: LayoutGrid, label: "Wide Range", sub: "Top categories" },
  { icon: Award, label: "Best Prices", sub: "Great deals" },
  { icon: Tag, label: "Quality Products", sub: "100% trusted" },
  { icon: RefreshCw, label: "Easy Returns", sub: "Hassle free" },
];

export default function Categories() {
  const [showPopup, setShowPopup] = useState(false);
  const [subEmail, setSubEmail] = useState("");

  const categories = [
    {
      name: "Electronics",
      slug: "electronics",
      productCount: 2456,
      description: "Mobiles, laptops, headphones, TVs, cameras and more",
    },
    {
      name: "Fashion",
      slug: "fashion",
      productCount: 3789,
      description: "Men, women & kids clothing, shoes, accessories and more",
    },
    {
      name: "Home & Kitchen",
      slug: "home-kitchen",
      productCount: 4321,
      description: "Furniture, home decor, kitchen appliances and more",
    },
    {
      name: "Beauty",
      slug: "beauty",
      productCount: 2145,
      description: "Skincare, makeup, haircare, fragrances and more",
    },
    {
      name: "Sports",
      slug: "sports",
      productCount: 1234,
      description: "Sports shoes, fitness gear, equipment and more",
    },
    {
      name: "Books",
      slug: "books",
      productCount: 985,
      description: "Fiction, non-fiction, academic, children's books and more",
    },
    {
      name: "Toys & Games",
      slug: "toys-games",
      productCount: 1876,
      description: "Toys, games, puzzles, learning and more",
    },
    {
      name: "More Categories",
      slug: "",
      productCount: null,
      description: "Discover other exciting categories",
    },
  ];

  return (
    <div className="max-w-[1400px] mx-auto px-3 md:px-4 py-4 md:py-6">
      <Breadcrumb
        items={[{ label: "Home", to: "/" }, { label: "All Categories" }]}
      />

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 md:mb-6 gap-4">
        <div>
          <h1
            className="text-xl md:text-2xl font-bold text-[#111827]"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            All Categories
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Explore all our categories and find what you're looking for
          </p>
        </div>
        <div className="hidden md:grid grid-cols-4 gap-3">
          {highlights.map(({ icon: Icon, label, sub }) => (
            <div key={label} className="flex items-center gap-2 text-sm">
              <div className="w-8 h-8 bg-orange-50 rounded-full flex items-center justify-center flex-shrink-0">
                <Icon size={14} className="text-[#FF5A1F]" />
              </div>
              <div>
                <p className="font-medium text-[#111827] text-xs">{label}</p>
                <p className="text-gray-400 text-xs">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {categories.map((cat) => {
          const slug = cat.slug || cat.name?.toLowerCase().replace(/\s+/g, "-");
          const image = cat.image || cat.thumbnail || CATEGORY_IMAGES[slug];
          return (
            <Link
              key={cat._id || slug || cat.name}
              to={slug ? `/search?category=${slug}` : "/search"}
              className="bg-white rounded-xl border border-gray-200 p-4 md:p-5 hover:shadow-md hover:border-orange-200 transition-all group min-w-0 overflow-hidden"
            >
              <div className="flex items-center gap-3 md:gap-4 mb-2 md:mb-3 min-w-0">
                {image ? (
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden bg-orange-50 flex-shrink-0">
                    <img
                      src={image}
                      alt={cat.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0">
                    <LayoutGrid size={24} className="text-[#FF5A1F]" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-sm md:text-base text-[#111827] group-hover:text-[#FF5A1F] transition-colors">
                    {cat.name}
                  </h3>
                  {cat.productCount && (
                    <p className="text-sm text-[#FF5A1F] font-medium">
                      {cat.productCount.toLocaleString()} products
                    </p>
                  )}
                </div>
              </div>
              <p className="text-xs text-gray-500 mb-3">{cat.description}</p>
              <span className="text-sm font-medium text-[#FF5A1F] group-hover:underline flex items-center gap-1 whitespace-nowrap">
                Shop Now →
              </span>
            </Link>
          );
        })}
      </div>

      {/* Newsletter */}
      <div className="mt-8 md:mt-10 bg-white rounded-xl border border-gray-200 p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="flex-1 w-full">
          <h3 className="font-bold text-[#111827] text-base md:text-lg">
            Get exclusive offers &amp; updates
          </h3>
          <p className="text-sm text-gray-500">
            Subscribe to our newsletter and never miss any deals!
          </p>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSubEmail(e.target.elements.email?.value || "");
            setShowPopup(true);
            e.target.reset();
          }}
          className="flex w-full md:flex-1 md:max-w-sm"
        >
          <input
            name="email"
            type="email"
            required
            placeholder="Enter your email address"
            className="flex-1 min-w-0 px-4 py-2.5 border border-gray-200 rounded-l-lg text-sm focus:outline-none focus:border-[#FF5A1F]"
          />
          <button
            type="submit"
            className="px-4 md:px-5 py-2.5 bg-[#FF5A1F] text-white text-sm font-medium rounded-r-lg hover:bg-[#E64A19] transition-colors whitespace-nowrap"
          >
            Subscribe
          </button>
        </form>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <span className="text-sm text-gray-500 font-medium whitespace-nowrap">
            Follow Us
          </span>
          <div className="flex items-center gap-2">
            {["f", "in", "tw", "yt"].map((s) => (
              <a
                key={s}
                href="#"
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-[#FF5A1F] hover:text-white transition-colors text-xs font-bold"
              >
                {s}
              </a>
            ))}
          </div>
        </div>
      </div>
      <NewsletterPopup
        open={showPopup}
        onClose={() => setShowPopup(false)}
        email={subEmail}
      />
    </div>
  );
}
